"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Cpu, ExternalLink, GraduationCap, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Dosis } from "next/font/google";

const dosis = Dosis({ subsets: ["latin"], weight: ["600", "700", "800"] });
import HeroSection from "@/components/HeroSection";
import BentoGrid from "@/components/BentoGrid";
import TerminalSim from "@/components/TerminalSim";
import { Badge } from "@/components/ui/badge";

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function DeeloLogoSvg(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="url(#deelo-logo-grad)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <defs>
        <linearGradient id="deelo-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
      {/* Interlocking geometric horn/chevrons and digital network lines */}
      <path d="M12 18c-3.314 0-6-2.686-6-6 0-3.314 2.686-6 6-6" />
      <path d="M12 18c3.314 0 6-2.686 6-6 0-3.314-2.686-6-6-6" />
      <path d="M9 9c1.5-1.5 4.5-1.5 6 0" />
      <path d="M6 6c3-3 9-3 12 0" />
      <circle cx="12" cy="12" r="1.5" fill="#10b981" stroke="#10b981" strokeWidth="0.5" />
    </svg>
  );
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans selection:bg-emerald-100 selection:text-emerald-700">
      
      {/* 1. Glassmorphism Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/70 backdrop-blur-md supports-[backdrop-filter]:bg-white/70">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image src="/logo.png" alt="Deelo Tech Logo" width={140} height={45} style={{ width: 'auto', height: '40px' }} className="object-contain" priority />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono font-bold uppercase tracking-widest text-slate-500">
            <Link href="#features" className="hover:text-emerald-600 transition-colors">
              Features
            </Link>
            <Link href="#developer-api" className="hover:text-emerald-600 transition-colors">
              Developer API
            </Link>
          </nav>

          {/* Right CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/dashboard">
              <Button
                size="sm"
                className={`${dosis.className} bg-emerald-950/60 border border-emerald-800 hover:bg-emerald-900/80 text-emerald-400 text-xs uppercase tracking-wider font-bold h-9 rounded-none`}
              >
                Launch Dashboard
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-slate-500 hover:text-slate-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white/95 font-mono text-xs uppercase tracking-wider font-bold">
            <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
              <Link
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-slate-500 hover:text-emerald-600 transition-colors"
              >
                Features
              </Link>
              <Link
                href="#developer-api"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-slate-500 hover:text-emerald-600 transition-colors"
              >
                Developer API
              </Link>
              <hr className="border-slate-900 my-2" />
              <Link href="/dashboard">
                <Button
                  onClick={() => setMobileMenuOpen(false)}
                  className={`${dosis.className} w-full bg-emerald-950/60 border border-emerald-800 hover:bg-emerald-900/80 text-emerald-400 text-xs uppercase tracking-wider font-bold h-10 rounded-none`}
                >
                  Launch Dashboard
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Sections */}
      <main className="flex-1">
        {/* 2. Hero Section */}
        <HeroSection />

        {/* 3. Features Section (Alternating Clean Rows) */}
        <BentoGrid />

        {/* 4. Developer API Section (containing Terminal Simulator) */}
        <section id="developer-api" className="w-full py-24 bg-slate-100 border-t border-slate-200 relative overflow-hidden">
          <div className="absolute inset-0 grid-lines opacity-[0.05] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.03)_0%,transparent_75%)] pointer-events-none" />
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* Left Column: API Info */}
              <div className="lg:col-span-5 flex flex-col items-start gap-4">
                <Badge className="bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-wider select-none">
                  Technical Telemetry
                </Badge>
                <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 leading-snug">
                  Enterprise <br />
                  <span className="font-light text-slate-600 font-sans">Architecture</span>
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Ingest real-time livestock behavior and physiological states directly into your existing ranch ERP systems. Access lightweight, structured telemetry streams via CoAP payloads or local hardware serial outputs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-2 text-xs font-mono text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Standard CoAP / Sec Protocol
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Clean lightweight JSON
                  </div>
                </div>
              </div>

              {/* Right Column: TerminalSim */}
              <div className="lg:col-span-7 w-full">
                <TerminalSim />
              </div>

            </div>
          </div>
        </section>
      </main>

      {/* 4. Minimalist Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 text-slate-500 font-mono text-[11px] relative">
        <div className="absolute inset-0 dot-matrix opacity-10 pointer-events-none" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4 items-start">
            
            {/* Left Copyright info */}
            <div className="md:col-span-6 flex flex-col gap-3">
              <div className="flex items-center gap-1.5 text-slate-700 font-black tracking-wider uppercase text-xs">
                <Cpu className="w-3.5 h-3.5 text-emerald-500" />
                DEELO-TECH SMARTCOLLAR
              </div>
              <p className="leading-relaxed max-w-sm text-slate-500">
                Precision IoT monitoring platforms engineered for pastoral cattle and sheep husbandry in Sahelian grazing regions.
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-600 mt-2">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Affiliation: Federal University of Technology, Minna (FUT Minna)</span>
              </div>
            </div>

            {/* Middle Quick Links */}
            <div className="md:col-span-3 flex flex-col gap-2">
              <div className="text-[10px] text-slate-600 uppercase tracking-widest font-black mb-1">Project Modules</div>
              <Link href="#features" className="hover:text-slate-300 transition-colors">Edge ML Classifier</Link>
              <Link href="#features" className="hover:text-slate-300 transition-colors">NB-IoT Transceiver</Link>
              <Link href="#features" className="hover:text-slate-300 transition-colors">Sensor Interface Board</Link>
            </div>

            {/* Right Academic & Source Links */}
            <div className="md:col-span-3 flex flex-col gap-2">
              <div className="text-[10px] text-slate-600 uppercase tracking-widest font-black mb-1">Documentation</div>
              <a
                href="#"
                className="hover:text-slate-300 transition-colors flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                Thesis Manuscript
                <ExternalLink className="w-3 h-3 text-slate-600" />
              </a>
              <a
                href="#"
                className="hover:text-slate-300 transition-colors flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                Hardware Schematic (PDF)
                <ExternalLink className="w-3 h-3 text-slate-600" />
              </a>
              <a
                href="https://github.com"
                className="hover:text-slate-300 transition-colors flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                Firmware Source (GitHub)
                <GithubIcon className="w-3 h-3" />
              </a>
            </div>

          </div>

          <div className="border-t border-slate-200 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-400">
            <span>© 2026 Deelo-Tech. All rights reserved.</span>
            <span className="mt-2 sm:mt-0 flex items-center gap-1">
              <Server className="w-3 h-3" />
              Edge Nodes: FUT Minna Agricultural IoT Lab
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
