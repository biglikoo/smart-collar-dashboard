"use client";

import { motion } from "framer-motion";
import { ArrowRight, Cpu, Radio, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dosis } from "next/font/google";

const dosis = Dosis({ subsets: ["latin"], weight: ["600", "700", "800"] });

export default function HeroSection() {
  return (
    <section className="relative w-full py-20 md:py-28 lg:py-36 xl:py-44 bg-slate-50 overflow-hidden">
      
      {/* Background Textures and Subtle Glows */}
      <div className="absolute inset-0 grid-lines opacity-[0.15] pointer-events-none" />
      <div className="absolute inset-0 dot-matrix opacity-[0.1] pointer-events-none" />
      
      {/* Massive radial spotlight centered behind hero text */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Editorial Product Typography */}
          <motion.div
            className="lg:col-span-7 flex flex-col items-start text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Tech Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 bg-white/80 backdrop-blur-md text-slate-500 text-xs font-mono uppercase tracking-widest mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>SmartCollar Model V2</span>
            </div>

            {/* Editorial Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
              The Future of <br className="hidden sm:inline" />
              <span className="bg-gradient-to-b from-slate-900 to-slate-600 bg-clip-text text-transparent">
                Livestock Intelligence.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mt-6 text-sm md:text-base text-slate-600 tracking-wide leading-relaxed font-light max-w-xl">
              Precision behavioral classification and physiological telemetry for Yankasa and Ouda flocks. Driven by local Edge AI inference, transmitted seamlessly via low-power NB-IoT network architectures.
            </p>

            {/* Minimalist CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                size="lg"
                className={`${dosis.className} bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-widest h-11 px-6 rounded-md border-b border-emerald-600 active:translate-y-[1px] transition-all flex items-center justify-center gap-2 group`}
              >
                Request Demo
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className={`${dosis.className} border-slate-800 bg-slate-900/20 hover:bg-slate-900/60 hover:text-white text-slate-350 font-bold text-xs uppercase tracking-widest h-11 px-6 rounded-md transition-all flex items-center justify-center gap-2`}
              >
                Read Thesis Specs
              </Button>
            </div>

            {/* Key Specs Row */}
            <div className="mt-14 grid grid-cols-3 gap-8 border-t border-slate-200 pt-8 w-full max-w-lg font-mono">
              <div>
                <div className="text-lg font-semibold text-slate-800">TinyML</div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold mt-1.5 tracking-widest">Random Forest</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-slate-800">NB-IoT</div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold mt-1.5 tracking-widest">CoAP / Sec</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-emerald-600">3.5+ Yrs</div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold mt-1.5 tracking-widest">Battery Life</div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: High-End Product Imagery Showcase */}
          <motion.div
            className="lg:col-span-5 w-full flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <div className="w-full max-w-lg relative group">
              {/* Subtle green ambient drop glow behind the frame */}
              <div className="absolute -inset-2 rounded-[32px] bg-emerald-500/10 opacity-60 blur-xl group-hover:bg-emerald-500/15 transition-all pointer-events-none" />
              
              {/* High-fidelity Product Hero Frame */}
              <div className="relative w-full aspect-[4/3] rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xl shadow-slate-200/60">
                <img
                  src="/sheep.jpg"
                  alt="Majestic Yankasa/Ouda Ram in natural grassland landscape representing SmartCollar edge nodes"
                  className="object-cover w-full h-full opacity-90 hover:scale-105 transition-transform duration-700 pointer-events-none"
                />
                {/* Subtle vignette layer overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
                
                {/* Floating product tag */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-white/80 backdrop-blur-md border border-slate-200 px-3.5 py-2 rounded-xl font-mono text-[10px] text-slate-500 select-none">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <Radio className="w-3.5 h-3.5 text-emerald-500" />
                    NB-IoT Active Status
                  </span>
                  <span className="text-emerald-600">98% Signal Link</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
