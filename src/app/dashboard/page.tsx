"use client";

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Battery, Clock, Activity, ShieldAlert, Cpu } from "lucide-react";
import { DIAGNOSTIC_STATE, type DiagnosticFlag } from "@/types/smartcollar";

function getClinicalStyle(flag: number) {
  if ([0, 1, 2].includes(flag)) return { bg: "bg-emerald-500", border: "border-emerald-500", text: "text-emerald-700", pulse: false };
  if ([3, 5].includes(flag)) return { bg: "bg-amber-500", border: "border-amber-500", text: "text-amber-700", pulse: false };
  if ([4, 6].includes(flag)) return { bg: "bg-rose-600", border: "border-rose-600", text: "text-rose-700", pulse: true };
  return { bg: "bg-slate-500", border: "border-slate-500", text: "text-slate-700", pulse: false };
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DashboardPage() {
  // Use SWR for real-time polling (every 5 seconds)
  const { data: collars = [], isLoading: loadingCollars } = useSWR("/api/collars", fetcher, { refreshInterval: 5000 });
  const { data: telemetry = [], isLoading: loadingTelemetry } = useSWR("/api/telemetry", fetcher, { refreshInterval: 5000 });

  if (loadingCollars) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-mono text-slate-500 text-sm">
        Initializing Cloud Clinical View...
      </div>
    );
  }

  const onlineCount = collars.filter((c: any) => c.status !== "STANDBY").length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/70 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <Image src="/logo.png" alt="Deelo Tech" width={140} height={45} style={{ width: "auto", height: "34px" }} className="object-contain" priority />
          </Link>
          <div className="hidden md:flex flex-col items-center">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">SmartCollar Cloud</span>
            <span className="text-sm font-semibold text-slate-800">Engineer Dashboard (7-State WRF)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {onlineCount}/{collars.length} Online
            </div>
            <Link href="/" className="flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-emerald-600 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Home
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-8">
        
        {/* ── Minimalist Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
          {collars.map((c: any) => {
            const t = c.telemetry[0] || {};
            const flag = t.diagnostic_flag ?? 0;
            const style = getClinicalStyle(flag);
            const stateInfo = DIAGNOSTIC_STATE[flag as DiagnosticFlag] || { label: "Unknown", category: "unknown" };
            
            const lastPing = new Date(c.last_seen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

            return (
              <div key={c.id} className={`relative bg-white rounded-2xl shadow-sm border-2 overflow-hidden flex flex-col ${style.border}`}>
                <div className={`px-5 py-3 ${style.bg} flex items-center justify-between text-white ${style.pulse ? "animate-pulse" : ""}`}>
                  <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-xs">
                    <Activity className="w-4 h-4" />
                    State {flag}: {stateInfo.label}
                  </div>
                  {style.pulse && <ShieldAlert className="w-4 h-4" />}
                </div>

                <div className="p-5 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-black tracking-tight text-slate-900">{c.id}</h2>
                      <div className="text-sm font-mono text-slate-500 mt-0.5">{c.breed}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="flex flex-col gap-1 border border-slate-100 rounded-xl p-3 bg-slate-50">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                        <Battery className="w-3.5 h-3.5" /> Battery
                      </div>
                      <div className="text-lg font-bold font-mono text-slate-800">
                        {t.battery_mv ?? "---"} <span className="text-xs text-slate-400 font-sans font-normal">mV</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 border border-slate-100 rounded-xl p-3 bg-slate-50">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                        <Clock className="w-3.5 h-3.5" /> Last Ping
                      </div>
                      <div className="text-sm font-bold font-mono text-slate-800 mt-1">
                        {lastPing}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Raw Telemetry Feed (Latest 50 Records) ── */}
        <section className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="w-5 h-5 text-slate-700" />
            <h3 className="font-bold text-slate-800">Edge ML Inference Telemetry (Last 50 Records)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm font-mono">
              <thead>
                <tr className="bg-slate-50 border-y border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold">Timestamp</th>
                  <th className="py-3 px-4 font-semibold">Collar ID</th>
                  <th className="py-3 px-4 font-semibold">State</th>
                  <th className="py-3 px-4 font-semibold">Core Temp</th>
                  <th className="py-3 px-4 font-semibold">Feature Ext (ms)</th>
                  <th className="py-3 px-4 font-semibold">Inference (ms)</th>
                  <th className="py-3 px-4 font-semibold text-right">Total Edge (ms)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {telemetry.map((record: any) => (
                  <tr key={record.id} className="hover:bg-slate-50 transition-colors text-slate-700">
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      {new Date(record.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit', fractionalSecondDigits: 3 })}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-slate-900">{record.device_id}</td>
                    <td className="py-2.5 px-4">
                      <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px]">
                        WRF_{record.diagnostic_flag}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">{record.core_temp_c ? `${record.core_temp_c}°C` : '---'}</td>
                    <td className="py-2.5 px-4 text-emerald-600">{record.feature_time_ms ?? '---'}</td>
                    <td className="py-2.5 px-4 text-sky-600">{record.inference_time_ms ?? '---'}</td>
                    <td className="py-2.5 px-4 font-bold text-right text-slate-800">{record.total_edge_ms ?? '---'}</td>
                  </tr>
                ))}
                {telemetry.length === 0 && !loadingTelemetry && (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-slate-400">Waiting for incoming UDP / HTTP payloads...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
