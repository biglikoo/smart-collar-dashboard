/**
 * SmartCollar Canonical Type Definitions
 * Reflects the real hardware architecture — ESP32-S3, DHT22, ADXL345, DS18B20.
 * Optical/PPG (SpO2) sensing is EXCLUDED: pelt attenuation renders MAX30102 non-viable.
 */

// ─── 7-State WRF Diagnostic Enum ─────────────────────────────────────────────
// Weighted Random Forest classifier output from the ESP32 edge model.

export const DIAGNOSTIC_STATE = {
  0: { label: "Resting",              category: "normal",     severity: 0 },
  1: { label: "Grazing",              category: "normal",     severity: 0 },
  2: { label: "Ambulating",           category: "normal",     severity: 0 },
  3: { label: "Agitated",             category: "warning",    severity: 1 },
  4: { label: "Feverish",             category: "pathogenic", severity: 2 },
  5: { label: "Sluggish",             category: "pathogenic", severity: 2 },
  6: { label: "Respiratory Distress", category: "pathogenic", severity: 2 },
} as const;

export type DiagnosticFlag = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// ─── NB-IoT Ingestion Payload Interface ──────────────────────────────────────
// Exact schema transmitted by each collar over CoAP/NB-IoT on the hourly sweep.

export interface TelemetryPayload {
  device_id:        string;        // e.g. "Yankasa_01", "Ouda_04"
  battery_mv:       number;        // 18650 LiPo millivolts (3000–4200)
  diagnostic_flag:  DiagnosticFlag;// WRF classifier output (0–6)
  core_temp_c?:     number;        // Derived core temp via Tc=Ts+α(Ta−Ts)+β
  env_temp_c?:      number;        // DHT22 ambient temperature °C
  resp_rate?:       number;        // Derived breath rate from ADXL345 motion
  dai?:             number;        // Daily Activity Index (0–100)
  dai_baseline?:    number;        // Per-animal baseline DAI
  signal_dbm?:      number;        // NB-IoT RSSI
  timestamp?:       string;        // ISO 8601 — filled by server if absent
}

// ─── Internal application collar record ──────────────────────────────────────
// Hydrated from the latest TelemetryPayload + the collar registry.

export type Breed = "Yankasa" | "Ouda";
export type TxStatus = "ONLINE" | "STANDBY" | "ALERT";

export interface CollarRecord {
  id:               string;
  breed:            Breed;
  diagnostic_flag:  DiagnosticFlag;
  battery_mv:       number;
  core_temp_c:      number;
  env_temp_c:       number;
  resp_rate:        number;
  dai:              number;
  dai_baseline:     number;
  signal_dbm:       number;
  lastSync:         string;
  status:           TxStatus;
}

// ─── Threshold constants ──────────────────────────────────────────────────────
// Based on published ovine veterinary baselines.
// SpO2 / optical thresholds intentionally omitted.

export const THRESHOLDS = {
  temp:      { min: 38.5, max: 40.5 },   // °C core body
  resp_rate: { min: 15,   max: 30   },   // breaths / min
  dai_drop:  { warn: 0.25, crit: 0.50 }, // fraction drop from baseline
  battery_mv_low: 3400,                  // ~20% charge on typical 18650
} as const;

// ─── PPR consensus (requires 3/3 pathogenic flags) ───────────────────────────
// PPR is only flagged when Feverish (4) + Sluggish (5) + Respiratory Distress (6)
// appear simultaneously across sequential readings, or a single collar transmits
// diagnostic_flag combinations that trigger multi-path inference.

export function isPprRisk(collar: CollarRecord): boolean {
  const highTemp   = collar.core_temp_c > THRESHOLDS.temp.max;
  const fastBreath = collar.resp_rate    > THRESHOLDS.resp_rate.max;
  const lethargic  = (collar.dai_baseline - collar.dai) / collar.dai_baseline
                     >= THRESHOLDS.dai_drop.crit;
  return highTemp && fastBreath && lethargic;
}

// ─── DAI status helper ────────────────────────────────────────────────────────

export function daiStatus(collar: CollarRecord): {
  label: string; color: string; bar: string;
} {
  const drop = (collar.dai_baseline - collar.dai) / collar.dai_baseline;
  if (drop >= THRESHOLDS.dai_drop.crit)
    return { label: "Lethargic", color: "text-rose-600",    bar: "bg-rose-500"    };
  if (drop >= THRESHOLDS.dai_drop.warn)
    return { label: "Monitor",   color: "text-amber-600",   bar: "bg-amber-500"   };
  return   { label: "Normal",    color: "text-emerald-600", bar: "bg-emerald-500" };
}

// ─── Battery percentage from millivolts ──────────────────────────────────────

export function batteryPct(mv: number): number {
  const MIN = 3000, MAX = 4200;
  return Math.round(Math.max(0, Math.min(100, (mv - MIN) / (MAX - MIN) * 100)));
}
