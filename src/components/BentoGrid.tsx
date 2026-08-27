"use client";

import { useEffect, useState } from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { Cpu, Radio, Activity, Battery, Signal, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Phase-based heart beat waveform generator
const ECG_PATTERN = [75, 75, 75, 80, 75, 70, 115, 55, 75, 83, 75, 75, 75];

export default function BentoGrid() {
  const [mounted, setMounted] = useState(false);
  const [ecgData, setEcgData] = useState<{ val: number }[]>([]);

  // Mount check for Recharts SSR
  useEffect(() => {
    setMounted(true);
    const initialData = Array.from({ length: 40 }, (_, i) => ({
      val: ECG_PATTERN[i % ECG_PATTERN.length] + Math.random() * 2 - 1,
    }));
    setEcgData(initialData);
  }, []);

  // Animate ECG Sparkline
  useEffect(() => {
    if (!mounted) return;
    let index = 0;
    const interval = setInterval(() => {
      setEcgData((prev) => {
        const nextVal = ECG_PATTERN[index % ECG_PATTERN.length] + (Math.random() * 2 - 1);
        index++;
        return [...prev.slice(1), { val: nextVal }];
      });
    }, 150);
    return () => clearInterval(interval);
  }, [mounted]);

  return (
    <section id="features" className="w-full py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="absolute inset-0 grid-lines opacity-[0.08] pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col gap-24 md:gap-36">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
          <Badge className="bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-[10px] px-2.5 py-0.5 rounded-full uppercase select-none mb-4">
            System Capabilities
          </Badge>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight bg-gradient-to-b from-slate-900 to-slate-600 bg-clip-text text-transparent">
            Precision Hardware. <br />
            <span className="font-light text-slate-500">Commercial Grade.</span>
          </h2>
          <p className="text-slate-600 text-sm md:text-base mt-4 max-w-lg leading-relaxed">
            Every SmartCollar combines custom physical sensor layers with local intelligence, ensuring continuous veterinary tracking in remote rangelands.
          </p>
        </div>

        {/* FEATURE ROW 1: TinyML Edge Inference (Text Left, Image Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Text Description */}
          <div className="lg:col-span-6 flex flex-col items-start gap-4">
            <div className="p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-600">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
              TinyML <span className="text-emerald-600 font-medium">Edge Inference</span>
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Run behavioral analysis directly on the animal. An optimized Random Forest classifier executes continuous 3-axis accelerometer state profiling locally on an ARM Cortex-M4 microcontroller.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs font-mono text-slate-500 pt-2 w-full">
              <li className="flex items-center gap-2 border-l border-emerald-500/50 pl-2">
                <span className="text-slate-600">Latency:</span>
                <span className="text-emerald-600 font-bold">18ms Inference</span>
              </li>
              <li className="flex items-center gap-2 border-l border-emerald-500/50 pl-2">
                <span className="text-slate-600">Accuracy:</span>
                <span className="text-emerald-600 font-bold">98.2% State Match</span>
              </li>
              <li className="flex items-center gap-2 border-l border-emerald-500/50 pl-2">
                <span className="text-slate-600">Profiled:</span>
                <span className="text-slate-700">Grazing, resting, walking</span>
              </li>
              <li className="flex items-center gap-2 border-l border-emerald-500/50 pl-2">
                <span className="text-slate-600">Power Draw:</span>
                <span className="text-slate-700">-92% vs raw stream</span>
              </li>
            </ul>
          </div>
          {/* Image Showcase */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl border border-slate-200 bg-white/80 p-2 overflow-hidden shadow-md shadow-slate-200/50 group">
              <div className="absolute -inset-1 rounded-2xl bg-emerald-500/5 opacity-0 group-hover:opacity-100 blur transition-all duration-500" />
              <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-950 relative">
                <img
                  src="/flock.jpg"
                  alt="Pasture landscape representing local edge telemetry testing grounds"
                  className="object-cover w-full h-full opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* FEATURE ROW 2: NB-IoT Connectivity (Image Left, Text Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Image Showcase */}
          <div className="lg:col-span-6 order-last lg:order-first">
            <div className="relative rounded-2xl border border-slate-200 bg-white/80 p-2 overflow-hidden shadow-md shadow-slate-200/50 group">
              <div className="absolute -inset-1 rounded-2xl bg-emerald-500/5 opacity-0 group-hover:opacity-100 blur transition-all duration-500" />
              <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-950 relative">
                <img
                  src="/mast.jpg"
                  alt="Arid rugged grazing landscape representing NB-IoT testing fields"
                  className="object-cover w-full h-full opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
          {/* Text Description */}
          <div className="lg:col-span-6 flex flex-col items-start gap-4">
            <div className="p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-600">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
              Narrowband <span className="text-emerald-600 font-medium">IoT Link</span>
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Designed for wide, cellular-scarce grazing lands. Narrowband IoT (LTE Cat-NB1/NB2) provides deep signal penetration across remote fields, sending localized state buffers instead of massive raw files.
            </p>
              <div className="border border-slate-200 bg-white/80 backdrop-blur-md rounded-xl p-4 flex flex-col gap-3 font-mono text-xs w-full max-w-md shadow-sm">
                <div className="flex items-center gap-2">
                  <Signal className="w-4 h-4 text-emerald-500 animate-pulse" />
                  <span className="text-slate-700">CoAP / UDP Secure Link</span>
                </div>
                <div className="flex justify-between text-slate-500 border-t border-slate-100 pt-2 text-[10px]">
                  <span className="flex items-center gap-1">
                    <Battery className="w-3.5 h-3.5 text-emerald-500" />
                    3.5+ Yrs Battery
                  </span>
                <span>Power Save Mode: &lt;5uA Deep Sleep</span>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURE ROW 3: Physiological Biometrics (Text Left, Recharts Dashboard Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Text Description */}
          <div className="lg:col-span-6 flex flex-col items-start gap-4">
            <div className="p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-600">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
              Kinematic <span className="text-emerald-600 font-medium">Biometrics</span>
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Motion and thermal sensing via ADXL345 triaxial accelerometer and DS18B20 digital probe.
              The Daily Activity Index (DAI) is derived from raw acceleration variance and
              compared against each animal&apos;s individual baseline — no optical sensing required.
              Pelt attenuation renders reflective PPG non-viable; optical modules are excluded from hardware.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono text-slate-500 pt-2 w-full">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-slate-600">ADXL345 ±3-axis 13-bit accelerometer</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-slate-600">DS18B20 ±0.5°C temperature probe</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-slate-600">DAI baseline per-animal calibration</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                <span className="text-slate-400 line-through">MAX30102 PPG — excluded (pelt)</span>
              </li>
            </ul>
          </div>
          {/* Recharts DAI Sparkline Showcase */}
          <div className="lg:col-span-6">
            <Card className="border border-slate-200 bg-white/80 backdrop-blur-md shadow-md shadow-slate-200/50 ring-0 rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 p-0">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
                  <span className="text-slate-700 text-xs font-mono font-bold uppercase tracking-wider">Kinematic Activity Stream</span>
                </div>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-mono text-[9px]">
                  DAI Live
                </Badge>
              </div>

              {/* Sparkline chart container */}
              <div className="border border-slate-100 rounded bg-slate-50 p-4 flex flex-col gap-2 relative">
                <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 mb-1">
                  <span>ADXL345 VARIANCE SIGNAL</span>
                  <span className="text-emerald-600">ACTIVE MOTION FEED</span>
                </div>
                <div className="w-full h-[110px]">
                  {mounted && ecgData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={ecgData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                        <defs>
                          <linearGradient id="colorBpm" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#10b981" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}  />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="val"
                          stroke="#10b981"
                          strokeWidth={1.5}
                          fillOpacity={1}
                          fill="url(#colorBpm)"
                          isAnimationActive={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-mono text-slate-600">
                      Loading activity feed...
                    </div>
                  )}
                </div>
              </div>

              {/* Numeric Parameters — no SpO2 */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="border border-slate-200 bg-slate-50 p-2.5 rounded-lg flex justify-between items-baseline">
                  <span className="text-slate-500">Core Tc:</span>
                  <span className="text-slate-800 font-bold">39.2°C</span>
                </div>
                <div className="border border-slate-200 bg-slate-50 p-2.5 rounded-lg flex justify-between items-baseline">
                  <span className="text-slate-500">DAI:</span>
                  <span className="text-emerald-700 font-bold">72 / 75</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

      </div>
    </section>
  );
}
