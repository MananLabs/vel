'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, BrainCircuit, Terminal, Activity,
  Boxes, GitMerge, FileCode2, Database, Mic, Layers,
  ChevronRight, Sparkles, Cpu, Blocks, ArrowUpRight
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════
   VEL AI — Premium Landing Page
   Inspired by elite devtools (Solana.new, Linear, Vercel)
   ═══════════════════════════════════════════════════════════ */

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 1], [0, 400]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div className="min-h-screen bg-transparent text-[#E8E8E8] font-body selection:bg-white/20 selection:text-white overflow-hidden">
      
      {/* ── NAVIGATION ──────────────────────────────────────── */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between"
      >
        <div className="absolute inset-0 bg-[#020203]/40 backdrop-blur-2xl border-b border-white/[0.04] mask-nav" />
        
        <div className="relative z-10 flex items-center gap-12">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-[15px] tracking-tight">VEL AI</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-[13px] font-medium text-white/60">
            {['Features', 'Models', 'Workspace', 'Developers', 'Pricing'].map(item => (
              <Link key={item} href={`#${item.toLowerCase()}`} className="hover:text-white transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-6">
          <Link href="/sign-in" className="text-[13px] font-medium text-white/60 hover:text-white transition-colors">
            Login
          </Link>
          <Link href="/sign-up" className="relative group overflow-hidden rounded-full p-[1px]">
            <span className="absolute inset-0 bg-gradient-to-r from-white/40 to-white/10 rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-[#0A0A0C] px-5 py-2 rounded-full flex items-center gap-2 transition-all group-hover:bg-[#111114]">
              <span className="text-[13px] font-semibold text-white">Launch App</span>
              <ArrowRight className="w-3.5 h-3.5 text-white/70 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        </div>
      </motion.nav>

      {/* ── HERO SECTION ──────────────────────────────────────── */}
      <section className="relative min-h-[100svh] flex flex-col items-center justify-center pt-24 pb-32">
        {/* Background Visual moved to global layout.tsx */}

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8 backdrop-blur-md"
          >
            <div className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse shadow-[0_0_12px_#00FF88]" />
            <span className="text-[11px] font-mono tracking-widest uppercase text-white/70">
              The Infinite Multi-Agent Operating Workspace
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(48px,8vw,120px)] font-hero font-normal leading-[0.9] tracking-[-0.05em] text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/30 pb-4 drop-shadow-2xl"
          >
            The Future of <br className="hidden md:block" />
            AI Workflows
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-[clamp(16px,2vw,20px)] leading-[1.6] text-white/50 max-w-2xl font-medium tracking-tight"
          >
            VEL AI unifies Claude, GPT, Gemini, Kimi, Perplexity, terminal agents, 
            CAD systems, and intelligent workflows into one infinite workspace.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4"
          >
            <Link href="/sign-up" className="h-12 px-8 rounded-full bg-white text-black font-semibold flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]">
              Start Building <ArrowRight className="w-4 h-4" />
            </Link>
            <button className="h-12 px-8 rounded-full bg-white/[0.03] border border-white/[0.08] text-white font-medium flex items-center gap-2 hover:bg-white/[0.08] transition-all backdrop-blur-md">
              Watch Demo
            </button>
          </motion.div>
        </div>

        {/* Infinite Workspace Preview (Floating 3D) */}
        <motion.div 
          initial={{ opacity: 0, y: 100, rotateX: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ perspective: 2000 }}
          className="relative w-full max-w-6xl mt-32 px-6"
        >
          <div className="relative aspect-[16/9] w-full rounded-2xl bg-[#0A0A0C]/80 border border-white/[0.08] backdrop-blur-2xl shadow-[0_0_100px_rgba(109,95,255,0.15)] overflow-hidden">
            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px] opacity-50" />
            
            {/* Unified SVG Canvas for perfect scaling and attachment */}
            <svg viewBox="0 0 1000 600" className="absolute inset-0 w-full h-full drop-shadow-2xl">
              <defs>
                <linearGradient id="glow-orange" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#FFAA00" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#FFAA00" stopOpacity="0.1"/>
                </linearGradient>
                <linearGradient id="glow-green" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#00FF88" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#00FF88" stopOpacity="0.1"/>
                </linearGradient>
              </defs>
              
              {/* Fake SVG Edges perfectly attached to Node boundaries */}
              <path 
                d="M 356 160 C 480 160, 480 140, 600 140" 
                stroke="url(#glow-orange)" 
                strokeWidth="2" 
                fill="none" 
                strokeDasharray="6 6" 
                className="animate-[dash_20s_linear_infinite]" 
              />
              <path 
                d="M 406 460 C 530 460, 530 430, 650 430" 
                stroke="url(#glow-green)" 
                strokeWidth="2" 
                fill="none" 
              />

              {/* Fake Nodes embedded as foreignObjects */}
              <foreignObject x="100" y="90" width="256" height="140">
                <NodeCard title="Research Agent" model="Sonar Pro" color="#FFAA00" streaming />
              </foreignObject>
              <foreignObject x="600" y="70" width="256" height="140">
                <NodeCard title="Data Analyzer" model="Claude Opus" color="#A78BFA" connected />
              </foreignObject>
              <foreignObject x="150" y="380" width="256" height="160">
                <NodeCard title="System Terminal" model="DevOps" color="#00FF88" terminal />
              </foreignObject>
              <foreignObject x="650" y="360" width="256" height="140">
                <NodeCard title="Logic Synthesis" model="GPT-4.1" color="#10B981" streaming />
              </foreignObject>
            </svg>
            
            <div className="absolute inset-0 bg-gradient-to-t from-[#020203] via-transparent to-transparent opacity-80" />
          </div>
        </motion.div>
      </section>

      {/* ── LOGOS ────────────────────────────────────────────── */}
      <section className="py-24 border-y border-white/[0.04] bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-[12px] font-mono tracking-widest text-white/30 uppercase mb-12">
            Integrated with the frontier of intelligence
          </p>
          <div className="flex flex-wrap justify-center gap-x-16 gap-y-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            {['Anthropic', 'OpenAI', 'Google DeepMind', 'Perplexity', 'Meta AI', 'DeepSeek', 'xAI'].map(logo => (
              <span key={logo} className="text-xl font-bold tracking-tight">{logo}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ───────────────────────────────────── */}
      <section id="features" className="py-40 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20">
            <h2 className="text-[clamp(32px,5vw,56px)] font-display font-semibold tracking-tight leading-[1.1] mb-6">
              Infinite Canvas.<br/>
              <span className="text-white/40">Zero limitations.</span>
            </h2>
            <p className="text-lg text-white/50 max-w-2xl leading-relaxed">
              Break out of the chat box. Orchestrate complex workflows with multi-agent consensus, live terminal execution, and persistent shared context.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:auto-rows-[420px]">
            {/* ── CARD 1: Task List (1/3) ── */}
            <div className="group relative p-8 rounded-[24px] bg-[#0A0A0C]/90 border border-white/5 shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-xl flex flex-col justify-end overflow-hidden hover:border-white/10 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="absolute top-0 left-0 right-0 p-8 space-y-3">
                {[
                  { name: 'Research Competitors', icon: <Boxes className="w-3.5 h-3.5" />, color: '#00FF88' },
                  { name: 'Analyze Codebase', icon: <FileCode2 className="w-3.5 h-3.5" />, color: '#A78BFA' },
                  { name: 'Deploy Infrastructure', icon: <Terminal className="w-3.5 h-3.5" />, color: '#FFAA00' },
                  { name: 'Generate Reports', icon: <Database className="w-3.5 h-3.5" />, color: '#4488FF' },
                ].map((task, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <div className="flex items-center gap-3 text-sm text-white/70">
                      {task.icon} {task.name}
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: task.color, boxShadow: `0 0 8px ${task.color}` }} />
                  </div>
                ))}
              </div>

              <div className="relative z-10 mt-auto">
                <h3 className="text-xl font-display font-semibold tracking-tight mb-2 text-white/90">Autonomous Swarms</h3>
                <p className="text-[14px] text-white/40 leading-relaxed group-hover:text-white/60 transition-colors">
                  Deploy multiple specialized agents to handle repetitive research and engineering pipelines.
                </p>
              </div>
            </div>

            {/* ── CARD 2: Workflows (2/3) ── */}
            <div className="group relative p-8 md:col-span-2 rounded-[24px] bg-[#0A0A0C]/90 border border-white/5 shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-xl flex flex-col justify-end overflow-hidden hover:border-white/10 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-bl from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="absolute top-0 left-0 w-full h-[60%] flex items-center justify-center">
                <svg viewBox="0 0 400 200" className="w-full h-full opacity-60">
                  <path d="M 100 100 C 180 100, 200 40, 300 40" stroke="url(#glow-blue)" strokeWidth="1.5" fill="none" className="animate-[dash_10s_linear_infinite]" strokeDasharray="4 4" />
                  <path d="M 100 100 C 180 100, 200 100, 300 100" stroke="url(#glow-purple)" strokeWidth="1.5" fill="none" />
                  <path d="M 100 100 C 180 100, 200 160, 300 160" stroke="url(#glow-orange)" strokeWidth="1.5" fill="none" className="animate-[dash_15s_linear_infinite]" strokeDasharray="4 4" />
                  
                  <defs>
                    <linearGradient id="glow-blue" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#4488FF" stopOpacity="0.8"/><stop offset="100%" stopColor="#4488FF" stopOpacity="0"/></linearGradient>
                    <linearGradient id="glow-purple" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#A78BFA" stopOpacity="0.8"/><stop offset="100%" stopColor="#A78BFA" stopOpacity="0"/></linearGradient>
                  </defs>

                  <rect x="60" y="80" width="40" height="40" rx="8" fill="#111115" stroke="#ffffff" strokeOpacity="0.1" />
                  <foreignObject x="60" y="80" width="40" height="40">
                    <div className="w-full h-full flex items-center justify-center">
                      <BrainCircuit className="w-5 h-5 text-white/80" />
                    </div>
                  </foreignObject>

                  <rect x="300" y="24" width="32" height="32" rx="6" fill="#111115" stroke="#ffffff" strokeOpacity="0.1" />
                  <foreignObject x="300" y="24" width="32" height="32">
                    <div className="w-full h-full flex items-center justify-center">
                      <Terminal className="w-3.5 h-3.5 text-[#4488FF]" />
                    </div>
                  </foreignObject>

                  <rect x="300" y="84" width="32" height="32" rx="6" fill="#111115" stroke="#ffffff" strokeOpacity="0.1" />
                  <foreignObject x="300" y="84" width="32" height="32">
                    <div className="w-full h-full flex items-center justify-center">
                      <Cpu className="w-3.5 h-3.5 text-[#A78BFA]" />
                    </div>
                  </foreignObject>

                  <rect x="300" y="144" width="32" height="32" rx="6" fill="#111115" stroke="#ffffff" strokeOpacity="0.1" />
                  <foreignObject x="300" y="144" width="32" height="32">
                    <div className="w-full h-full flex items-center justify-center">
                      <Database className="w-3.5 h-3.5 text-[#FFAA00]" />
                    </div>
                  </foreignObject>
                </svg>
              </div>

              <div className="relative z-10 mt-auto">
                <h3 className="text-xl font-display font-semibold tracking-tight mb-2 text-white/90">Infinite Routing</h3>
                <p className="text-[14px] text-white/40 leading-relaxed max-w-md group-hover:text-white/60 transition-colors">
                  Design complex acyclic graphs. Output from GPT-4o flows directly into Claude's context window.
                </p>
              </div>
            </div>

            {/* ── CARD 3: Radar (1/3) ── */}
            <div className="group relative p-8 rounded-[24px] bg-[#0A0A0C]/90 border border-white/5 shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-xl flex flex-col justify-end overflow-hidden hover:border-white/10 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="absolute top-0 left-0 w-full h-[60%] flex items-center justify-center">
                <div className="relative w-40 h-40 rounded-full border border-white/5 flex items-center justify-center">
                  <div className="absolute w-24 h-24 rounded-full border border-white/5" />
                  <div className="absolute w-8 h-8 rounded-full border border-white/10 bg-white/[0.02]" />
                  <div className="absolute w-full h-full rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,rgba(255,255,255,0.1)_360deg)] animate-[spin_4s_linear_infinite]" />
                  <div className="absolute top-1/4 right-1/4 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />
                  <div className="absolute bottom-1/3 left-1/4 w-1 h-1 rounded-full bg-white/50" />
                </div>
              </div>

              <div className="relative z-10 mt-auto">
                <h3 className="text-xl font-display font-semibold tracking-tight mb-2 text-white/90">Shared Context</h3>
                <p className="text-[14px] text-white/40 leading-relaxed group-hover:text-white/60 transition-colors">
                  A persistent memory store ensures all agents maintain exact situational awareness.
                </p>
              </div>
            </div>

            {/* ── CARD 4: Code (1/3) ── */}
            <div className="group relative p-8 rounded-[24px] bg-[#0A0A0C]/90 border border-white/5 shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-xl flex flex-col justify-end overflow-hidden hover:border-white/10 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-t from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="absolute top-8 left-8 right-8 bg-[#050507] rounded-xl border border-white/5 overflow-hidden">
                <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/5 bg-white/[0.02]">
                  <div className="w-2 h-2 rounded-full bg-red-500/80" />
                  <div className="w-2 h-2 rounded-full bg-amber-500/80" />
                  <div className="w-2 h-2 rounded-full bg-green-500/80" />
                  <span className="ml-2 text-[9px] font-mono text-white/30">terminal.tsx</span>
                </div>
                <div className="p-4 font-mono text-[10px] leading-relaxed text-white/40">
                  <span className="text-[#A78BFA]">const</span> agent = <span className="text-[#4488FF]">new</span> <span className="text-[#00FF88]">DevOpsAgent</span>();<br/>
                  agent.<span className="text-[#4488FF]">deploy</span>(&#123;<br/>
                  &nbsp;&nbsp;target: <span className="text-[#FFAA00]">'production'</span>,<br/>
                  &nbsp;&nbsp;autoFix: <span className="text-[#A78BFA]">true</span><br/>
                  &#125;);
                </div>
              </div>

              <div className="relative z-10 mt-auto">
                <h3 className="text-xl font-display font-semibold tracking-tight mb-2 text-white/90">Terminal Sandboxes</h3>
                <p className="text-[14px] text-white/40 leading-relaxed group-hover:text-white/60 transition-colors">
                  Deploy agents that can write, execute, and debug bash scripts natively.
                </p>
              </div>
            </div>

            {/* ── CARD 5: Bars (1/3) ── */}
            <div className="group relative p-8 rounded-[24px] bg-[#0A0A0C]/90 border border-white/5 shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-xl flex flex-col justify-end overflow-hidden hover:border-white/10 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-tl from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="absolute top-0 left-0 w-full h-[60%] flex flex-col items-center justify-center gap-6">
                <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                  <Sparkles className="w-5 h-5 text-white/80" />
                </div>
                <div className="flex items-end gap-1.5 h-12">
                  {[40, 60, 30, 80, 50, 90, 70, 45].map((h, i) => (
                    <div key={i} className="w-3 bg-white/10 rounded-t-sm" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>

              <div className="relative z-10 mt-auto">
                <h3 className="text-xl font-display font-semibold tracking-tight mb-2 text-white/90">Deep Research</h3>
                <p className="text-[14px] text-white/40 leading-relaxed group-hover:text-white/60 transition-colors">
                  Multi-pass data extraction powered by Perplexity Sonar and continuous learning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TERMINAL / DEVOPS SHOWCASE ──────────────────────── */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#00FF88]/[0.02] to-transparent" />
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00FF88]/10 border border-[#00FF88]/20 text-[#00FF88] text-[11px] font-mono uppercase tracking-widest mb-6">
              Agentic Execution
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-semibold tracking-tight mb-6 leading-tight">
              AI that writes code.<br/>
              <span className="text-white/40">And actually runs it.</span>
            </h2>
            <p className="text-lg text-white/50 leading-relaxed mb-8">
              Deploy autonomous terminal agents. They don't just suggest bash commands—they execute them, read the output, debug failures, and deploy infrastructure directly from your workspace.
            </p>
            <ul className="space-y-4">
              {['Secure isolated sandboxes', 'Real-time stdout/stderr streaming', 'Automated error recovery loops'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white/70">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex-1 w-full">
            <div className="bg-[#0A0A0C] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-xs font-mono text-white/30">vel-ai@production:~</span>
              </div>
              <div className="p-6 font-mono text-sm leading-relaxed h-[320px] overflow-hidden relative">
                <div className="text-white/40">~ <span className="text-[#00FF88]">$</span> vel-agent deploy --target aws</div>
                <div className="text-[#A78BFA] mt-2">➔ Initializing Claude DevOps Agent...</div>
                <div className="text-white/60 mt-2">Analyzing infrastructure requirements...</div>
                <div className="text-white/60">Generating Terraform states...</div>
                <div className="text-amber-400 mt-2">⚠ Warning: Missing IAM permissions. Automatically generating policy patch.</div>
                <div className="text-white/60 mt-2">Applying patches...</div>
                <div className="text-[#00FF88] mt-4">✔ Infrastructure successfully deployed in 14.2s</div>
                <div className="text-white/40 mt-4">~ <span className="text-[#00FF88]">$</span> <span className="animate-pulse">_</span></div>
                
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0A0A0C] to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.04] bg-[#020203] pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-16">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight">VEL AI</span>
            </div>
            <p className="text-[13px] text-white/40 leading-relaxed">
              The infinite multi-agent operating workspace. Unifying intelligence, execution, and context.
            </p>
          </div>

          <div className="flex gap-16 text-[13px]">
            <div className="flex flex-col gap-4">
              <h4 className="font-semibold text-white/80 mb-2">Platform</h4>
              {['Canvas', 'Models', 'Terminal', 'Pricing'].map(l => (
                <Link key={l} href="#" className="text-white/40 hover:text-white transition-colors">{l}</Link>
              ))}
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-semibold text-white/80 mb-2">Resources</h4>
              {['Documentation', 'API Reference', 'GitHub', 'Discord'].map(l => (
                <Link key={l} href="#" className="text-white/40 hover:text-white transition-colors">{l}</Link>
              ))}
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-semibold text-white/80 mb-2">Company</h4>
              {['Blog', 'Careers', 'Terms', 'Privacy'].map(l => (
                <Link key={l} href="#" className="text-white/40 hover:text-white transition-colors">{l}</Link>
              ))}
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 mt-24 pt-8 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between text-[12px] text-white/30">
          <span>© {new Date().getFullYear()} VEL AI Inc. All rights reserved.</span>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <div className="w-2 h-2 rounded-full bg-[#00FF88]" /> All systems operational
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes dash {
          to { stroke-dashoffset: -400; }
        }
      `}</style>
    </div>
  );
}

/* ── REUSABLE COMPONENTS ────────────────────────────────── */



function NodeCard({ title, model, color, streaming, terminal, connected }: any) {
  return (
    <div className="p-4 rounded-[14px] bg-[#0A0A0C]/90 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl w-full h-full hover:border-white/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: streaming ? `0 0 10px ${color}` : 'none' }} />
          <span className="text-xs font-semibold text-white/80">{title}</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/50 font-mono">
          {model}
        </span>
      </div>
      
      <div className="space-y-2">
        {terminal ? (
          <div className="h-16 bg-[#050507] rounded-md border border-white/5 p-2 font-mono text-[9px] text-[#00FF88]/70">
            $ execute build<br/>
            > resolving deps...
          </div>
        ) : (
          <>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              {streaming && <div className="h-full w-2/3 bg-gradient-to-r from-transparent to-white/20 animate-pulse" />}
              {connected && <div className="h-full w-full bg-white/10" />}
            </div>
            <div className="h-2 w-4/5 bg-white/5 rounded-full" />
            <div className="h-2 w-5/6 bg-white/5 rounded-full" />
          </>
        )}
      </div>
    </div>
  );
}
