"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Cpu, Radio, ShieldAlert } from "lucide-react";

interface TelemetryData {
  timestamp: string;
  device_id: string;
  breed: "Yankasa" | "Ouda";
  metrics: {
    bpm: number;
    temp_c: number;
    spo2: number;
  };
  accelerometer: {
    x: number;
    y: number;
    z: number;
  };
  tinyml: {
    inference_ms: number;
    predicted_state: "GRAZING" | "RESTING" | "AMBULATING";
    confidence: number;
    classifier: string;
  };
  network: {
    nb_iot_signal_dbm: number;
    battery_mv: number;
    tx_status: "SUCCESS" | "RETRYING" | "STANDBY";
  };
}

const BREEDS = ["Yankasa", "Ouda"] as const;
const STATES = ["GRAZING", "RESTING", "AMBULATING"] as const;

function generateMockTelemetry(prev?: TelemetryData): TelemetryData {
  const breed = prev ? prev.breed : (Math.random() > 0.5 ? "Yankasa" : "Ouda");
  const device_id = breed === "Yankasa" ? "SC-YNK-0941" : "SC-OUD-1102";
  
  // Realistic sheep biometrics
  // BPM normal: 70-90, Temp: 38.5 - 40.0 C
  let bpm = 75 + Math.floor(Math.random() * 15);
  let temp_c = 38.8 + Math.random() * 0.8;
  let spo2 = 96 + Math.floor(Math.random() * 4);
  
  let state: "GRAZING" | "RESTING" | "AMBULATING" = "GRAZING";
  const roll = Math.random();
  if (roll < 0.5) state = "GRAZING";
  else if (roll < 0.8) state = "RESTING";
  else state = "AMBULATING";

  if (state === "RESTING") {
    bpm -= 5;
    temp_c -= 0.2;
  } else if (state === "AMBULATING") {
    bpm += 10;
    temp_c += 0.3;
  }

  return {
    timestamp: new Date().toISOString(),
    device_id,
    breed,
    metrics: {
      bpm: Math.round(bpm),
      temp_c: parseFloat(temp_c.toFixed(2)),
      spo2: Math.min(spo2, 100),
    },
    accelerometer: {
      x: parseFloat((Math.random() * 2 - 1).toFixed(3)),
      y: parseFloat((Math.random() * 2 - 1).toFixed(3)),
      z: parseFloat((Math.random() * 2 - 1).toFixed(3)),
    },
    tinyml: {
      inference_ms: 12 + Math.floor(Math.random() * 6),
      predicted_state: state,
      confidence: parseFloat((85 + Math.random() * 14.5).toFixed(1)),
      classifier: "RandomForestEdge_v1.2",
    },
    network: {
      nb_iot_signal_dbm: -90 - Math.floor(Math.random() * 15),
      battery_mv: prev ? prev.network.battery_mv - 1 : 3680,
      tx_status: Math.random() > 0.15 ? "SUCCESS" : "STANDBY",
    },
  };
}

export default function TerminalSim() {
  const [mounted, setMounted] = useState(false);
  const [logs, setLogs] = useState<TelemetryData[]>([]);
  const [activeData, setActiveData] = useState<TelemetryData | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Generate initial logs
    let current = generateMockTelemetry();
    const initialLogs: TelemetryData[] = [current];
    for (let i = 0; i < 4; i++) {
      current = generateMockTelemetry(current);
      initialLogs.push(current);
    }
    setLogs(initialLogs);
    setActiveData(current);

    // Set interval for streaming
    const interval = setInterval(() => {
      setLogs((prevLogs) => {
        const next = generateMockTelemetry(prevLogs[prevLogs.length - 1]);
        setActiveData(next);
        const updated = [...prevLogs, next];
        // Keep last 30 logs to avoid memory bloat
        return updated.slice(-30);
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [logs]);

  if (!mounted) {
    return (
      <div className="w-full h-[378px] flex flex-col rounded-lg border border-slate-800 bg-black overflow-hidden font-mono shadow-2xl glow-green-sm">
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900/60 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="text-xs text-slate-400 ml-2 flex items-center gap-1.5 select-none">
              <Terminal className="w-3.5 h-3.5 text-emerald-500" />
              ovine-telemetry@deelo-edge:~
            </span>
          </div>
        </div>
        <div className="flex-1 bg-slate-950/40 flex items-center justify-center text-slate-600 text-xs">
          Initializing secure telemetry link...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col rounded-lg border border-slate-800 bg-black overflow-hidden font-mono shadow-2xl glow-green-sm">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/60 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <span className="text-xs text-slate-400 ml-2 flex items-center gap-1.5 select-none">
            <Terminal className="w-3.5 h-3.5 text-emerald-500" />
            ovine-telemetry@deelo-edge:~
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500 select-none">
          <span className="flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            TinyML active
          </span>
          <span className="flex items-center gap-1">
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            NB-IoT connection
          </span>
        </div>
      </div>

      {/* Terminal Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-800 bg-slate-950/40">
        
        {/* Left Stats Section */}
        <div className="p-4 lg:col-span-1 flex flex-col gap-4 bg-slate-950/80">
          <div className="border border-slate-800/80 rounded bg-black/50 p-3.5">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-1">
              Active Animal Profile
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-300">
                {activeData?.breed === "Yankasa" ? "Yankasa Ram" : "Ouda Ram"}
              </span>
              <span className="text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.5 rounded">
                {activeData?.device_id}
              </span>
            </div>
          </div>

          <div className="border border-slate-800/80 rounded bg-black/50 p-3.5 flex flex-col gap-3">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
              TinyML Edge Classifier
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Classified State:</span>
              <span className="text-sm font-black text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                {activeData?.tinyml.predicted_state}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Confidence:</span>
              <span className="text-xs font-semibold text-slate-200">
                {activeData?.tinyml.confidence}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Inference Delay:</span>
              <span className="text-xs font-semibold text-slate-200">
                {activeData?.tinyml.inference_ms} ms
              </span>
            </div>
          </div>

          <div className="border border-slate-800/80 rounded bg-black/50 p-3.5 flex flex-col gap-2">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
              Live Sensor Telemetry
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="border border-slate-850 bg-black/30 p-2 rounded">
                <div className="text-[9px] text-slate-500 uppercase">Heart</div>
                <div className="text-xs font-bold text-emerald-400 mt-1">
                  {activeData?.metrics.bpm} <span className="text-[8px] text-slate-500 font-normal">BPM</span>
                </div>
              </div>
              <div className="border border-slate-850 bg-black/30 p-2 rounded">
                <div className="text-[9px] text-slate-500 uppercase">Temp</div>
                <div className="text-xs font-bold text-slate-200 mt-1">
                  {activeData?.metrics.temp_c}°C
                </div>
              </div>
              <div className="border border-slate-850 bg-black/30 p-2 rounded">
                <div className="text-[9px] text-slate-500 uppercase">SpO2</div>
                <div className="text-xs font-bold text-slate-200 mt-1">
                  {activeData?.metrics.spo2}%
                </div>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 mt-auto leading-relaxed border-t border-slate-850 pt-2.5">
            <div className="flex justify-between">
              <span>BATTERY STATUS:</span>
              <span className="text-emerald-400">{(activeData ? activeData.network.battery_mv / 1000 : 3.6).toFixed(2)} V</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>NB-IoT SIGNAL:</span>
              <span className="text-slate-300">{activeData?.network.nb_iot_signal_dbm} dBm</span>
            </div>
          </div>
        </div>

        {/* Right JSON Feed Section */}
        <div 
          ref={scrollContainerRef}
          className="lg:col-span-2 p-4 h-[330px] overflow-y-auto terminal-scroll bg-black/90 flex flex-col gap-3 font-mono text-xs"
        >
          <div className="text-[10px] text-slate-600 border-b border-slate-850 pb-1 mb-1 sticky top-0 bg-black/90 flex justify-between select-none">
            <span>TRANSMITTED JSON STREAM</span>
            <span>FORMAT: NB-IoT COAP PAYLOAD</span>
          </div>

          <div className="flex flex-col gap-3">
            <AnimatePresence initial={false}>
              {logs.map((log, index) => (
                <motion.div
                  key={`${log.timestamp}-${index}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-l-2 border-emerald-500/30 pl-3 py-1 bg-slate-900/10 hover:bg-slate-900/30 transition-colors rounded-r"
                >
                  <div className="text-[10px] text-slate-500 flex justify-between mb-1">
                    <span>[LOG ENTRY #{index + 1}]</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <pre className="whitespace-pre-wrap leading-relaxed overflow-x-auto text-[11px] selection:bg-emerald-800 selection:text-white font-mono text-slate-500">
                    <span>{"{"}</span>
                    {"\n  "}
                    <span className="text-slate-400">"device"</span>: <span className="text-green-300">"{log.device_id}"</span>,
                    {"\n  "}
                    <span className="text-slate-400">"metrics"</span>: {"{ "}
                    <span className="text-slate-400">"bpm"</span>: <span className="text-emerald-400 font-semibold">{log.metrics.bpm}</span>,{" "}
                    <span className="text-slate-400">"temp_c"</span>: <span className="text-emerald-400 font-semibold">{log.metrics.temp_c}</span>,{" "}
                    <span className="text-slate-400">"spo2"</span>: <span className="text-emerald-400 font-semibold">{log.metrics.spo2}</span>
                    {" },"}
                    {"\n  "}
                    <span className="text-slate-400">"edge_ml"</span>: {"{ "}
                    <span className="text-slate-400">"state"</span>: <span className="text-green-300">"{log.tinyml.predicted_state}"</span>,{" "}
                    <span className="text-slate-400">"conf"</span>: <span className="text-emerald-400 font-semibold">{log.tinyml.confidence}</span>
                    {" },"}
                    {"\n  "}
                    <span className="text-slate-400">"rf_accel"</span>: {"{ "}
                    <span className="text-slate-400">"x"</span>: <span className="text-emerald-400 font-semibold">{log.accelerometer.x}</span>,{" "}
                    <span className="text-slate-400">"y"</span>: <span className="text-emerald-400 font-semibold">{log.accelerometer.y}</span>,{" "}
                    <span className="text-slate-400">"z"</span>: <span className="text-emerald-400 font-semibold">{log.accelerometer.z}</span>
                    {" }"}
                    {"\n}"}
                  </pre>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
