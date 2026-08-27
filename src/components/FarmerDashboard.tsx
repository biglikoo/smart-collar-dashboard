"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Activity, ArrowRight, ShieldCheck, ShieldAlert, Battery, Clock } from "lucide-react";
import { type DiagnosticFlag, DIAGNOSTIC_STATE } from "@/types/smartcollar";

function getClinicalStyle(flag: number) {
  if ([0, 1, 2].includes(flag)) {
    return { bg: "bg-emerald-500", border: "border-emerald-500", text: "text-emerald-700", pulse: false, badge: "bg-emerald-100 text-emerald-800 border-emerald-200" };
  }
  if ([3, 5].includes(flag)) {
    return { bg: "bg-amber-500", border: "border-amber-500", text: "text-amber-700", pulse: false, badge: "bg-amber-100 text-amber-800 border-amber-200" };
  }
  if ([4, 6].includes(flag)) {
    return { bg: "bg-rose-600", border: "border-rose-600", text: "text-rose-700", pulse: true, badge: "bg-rose-100 text-rose-800 border-rose-200" };
  }
  return { bg: "bg-slate-500", border: "border-slate-500", text: "text-slate-700", pulse: false, badge: "bg-slate-100 text-slate-800 border-slate-200" };
}

export default function FarmerDashboard() {
  const [rams, setRams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/collars");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setRams(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-mono text-slate-500 text-sm">
        Loading Flock Clinical Data...
      </div>
    );
  }

  const alertCount = rams.filter(c => {
    const flag = c.telemetry[0]?.diagnostic_flag ?? 0;
    return [4, 6].includes(flag);
  }).length;
  const flockOk = alertCount === 0;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-700">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Image
            src="/logo.png"
            alt="Deelo Tech"
            width={120}
            height={40}
            style={{ width: "auto", height: "32px" }}
            className="object-contain"
            priority
          />
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
          >
            Go to Engineer View
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-8">
        
        {/* Flock Status Summary */}
        <section className={`rounded-3xl p-6 sm:p-8 flex items-center gap-5 shadow-sm border ${flockOk ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"}`}>
          <div className={`p-4 rounded-full shrink-0 ${flockOk ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}>
            {flockOk ? <ShieldCheck className="w-8 h-8" /> : <ShieldAlert className="w-8 h-8 animate-pulse" />}
          </div>
          <div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${flockOk ? "text-emerald-800" : "text-rose-800"}`}>
              {flockOk ? "Flock is Healthy" : `${alertCount} Animal(s) in Critical Condition`}
            </h1>
            <p className={`text-sm mt-1 font-medium ${flockOk ? "text-emerald-600" : "text-rose-600"}`}>
              {flockOk ? "All monitored clinical baselines are normal." : "Immediate intervention recommended for critical states."}
            </p>
          </div>
        </section>

        {/* Clinical Roster Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {rams.map((c) => {
            const t = c.telemetry[0] || {};
            const flag = t.diagnostic_flag ?? 0;
            const style = getClinicalStyle(flag);
            const stateInfo = DIAGNOSTIC_STATE[flag as DiagnosticFlag] || { label: "Unknown" };
            const lastPing = new Date(c.last_seen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

            return (
              <div key={c.id} className={`bg-white rounded-2xl shadow-sm border-2 overflow-hidden flex flex-col ${style.border}`}>
                {/* Status Bar */}
                <div className={`px-4 py-2.5 ${style.bg} flex items-center justify-between text-white ${style.pulse ? "animate-pulse" : ""}`}>
                  <div className="flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]">
                    <Activity className="w-3.5 h-3.5" />
                    Clinical State: {stateInfo.label}
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-4 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-black tracking-tight text-slate-900">{c.id}</h2>
                      <div className="text-sm font-mono text-slate-500 mt-0.5">{c.breed}</div>
                    </div>
                    <div className={`px-2 py-1 rounded-md border text-[10px] font-mono font-bold uppercase ${style.badge}`}>
                      WRF_{flag}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-1">
                    <div className="flex flex-col gap-1 rounded-lg p-2.5 bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                        <Battery className="w-3 h-3" /> Battery
                      </div>
                      <div className="text-base font-bold font-mono text-slate-800">
                        {t.battery_mv ?? "---"} <span className="text-[10px] text-slate-400 font-sans font-normal">mV</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 rounded-lg p-2.5 bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                        <Clock className="w-3 h-3" /> Last Ping
                      </div>
                      <div className="text-xs font-bold font-mono text-slate-800 mt-1">
                        {lastPing}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}
