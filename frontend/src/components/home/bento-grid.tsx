"use client";

import React from "react";
import {
  Sparkles,
  Zap,
  Layers,
  Search,
  FileCheck,
  Cpu,
  ArrowRight,
  TrendingUp,
  LineChart,
} from "lucide-react";

interface BentoItemProps {
  title: string;
  description: string;
  header: React.ReactNode;
  icon: React.ReactNode;
  className?: string;
  badge?: string;
}

export function BentoGrid({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto ${
        className || ""
      }`}
    >
      {children}
    </div>
  );
}

export function BentoGridItem({
  title,
  description,
  header,
  icon,
  className,
  badge,
}: BentoItemProps) {
  return (
    <div
      className={`group/bento relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card/75 dark:bg-neutral-900/75 p-5 sm:p-6 backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/5 overflow-hidden ${
        className || ""
      }`}
    >
      {/* Subtle ambient hover glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-emerald-500/5 via-transparent to-primary/5 opacity-0 group-hover/bento:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Header Visual */}
      <div className="w-full shrink-0 mb-4">{header}</div>

      {/* Content Area */}
      <div className="relative z-10 flex flex-col justify-between flex-1 transition-transform duration-300 group-hover/bento:translate-x-1">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary w-fit shadow-xs">
              {icon}
            </div>
            {badge && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                {badge}
              </span>
            )}
          </div>
          <h3 className="font-bold text-foreground text-lg mb-1.5 tracking-tight group-hover/bento:text-emerald-500 dark:group-hover/bento:text-emerald-400 transition-colors">
            {title}
          </h3>
          <p className="font-normal text-muted-foreground text-xs sm:text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export function FeaturesBentoSection() {
  return (
    <section className="pt-20 pb-12 sm:pt-24 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      <div className="text-center space-y-3.5 mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-wide">
          <Sparkles className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
          <span>ENTERPRISE RAG ARCHITECTURE</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
          Engineered for Financial Precision & Sub-Second Speed
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Purpose-built for financial analysts, auditors, and operators who require mathematically accurate citations with zero hallucination.
        </p>
      </div>

      <BentoGrid>
        {/* Item 1: Real-time Streaming (2 cols) */}
        <BentoGridItem
          title="Real-Time Financial SSE Streaming"
          description="Analyze quarterly earnings, 10-K filings, and audit statements with instantaneous token generation. Watch the model reason through complex balance sheets in real-time."
          header={
            <div className="flex flex-1 w-full h-40 rounded-xl bg-neutral-950 p-4 border border-neutral-800 text-neutral-200 flex-col justify-between font-mono text-xs overflow-hidden shadow-inner">
              <div className="flex items-center justify-between text-neutral-400 border-b border-neutral-800 pb-2">
                <span className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px]">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  SSE Stream: Active
                </span>
                <span className="text-[10px] text-neutral-400">TTFT: 240ms • 140 tok/s</span>
              </div>
              <div className="space-y-1.5 py-1">
                <p className="text-blue-400 font-semibold text-xs">
                  &gt; query: &quot;What was Q3 Free Cash Flow and EBITDA margin?&quot;
                </p>
                <p className="text-neutral-300 text-[11px] leading-relaxed">
                  According to Table 4.1 in <span className="text-emerald-400 font-semibold">Q3_2026_Earnings.pdf</span>, Free Cash Flow reached <span className="text-white font-bold">$48.2M</span> (24.1% margin) with Adjusted EBITDA of <span className="text-white font-bold">$62.5M</span>...
                  <span className="inline-block w-1.5 h-3.5 bg-emerald-400 ml-1 animate-pulse align-middle" />
                </p>
              </div>
            </div>
          }
          icon={<Zap className="h-5 w-5 text-amber-500" />}
          className="md:col-span-2"
          badge="High Throughput"
        />

        {/* Item 2: Multi-Doc Reference (1 col) */}
        <BentoGridItem
          title="Cross-Filing Synthesis"
          description="Synthesize statements across multiple financial periods. Compare Q2 vs Q3 earnings or cross-reference 10-K risk disclosures in one unified prompt."
          header={
            <div className="flex flex-1 w-full h-40 rounded-xl bg-muted/40 p-3.5 border border-border/70 flex-col justify-center gap-2.5 overflow-hidden">
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-background border border-border text-xs shadow-2xs">
                <div className="h-4 w-4 rounded-md bg-primary flex items-center justify-center text-[10px] text-primary-foreground font-bold">
                  ✓
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-foreground">Q3_2026_Earnings_Report.pdf</p>
                  <p className="text-[10px] text-muted-foreground">8.4 MB • 42 Pages</p>
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">Ready</span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-background border border-border text-xs shadow-2xs">
                <div className="h-4 w-4 rounded-md bg-primary flex items-center justify-center text-[10px] text-primary-foreground font-bold">
                  ✓
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-foreground">Annual_10K_Filing_2026.pdf</p>
                  <p className="text-[10px] text-muted-foreground">14.2 MB • 112 Pages</p>
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">Ready</span>
              </div>
            </div>
          }
          icon={<Layers className="h-5 w-5 text-blue-500" />}
          badge="Multi-File"
        />

        {/* Item 3: Verifiable Citations (1 col) */}
        <BentoGridItem
          title="Verifiable Citations"
          description="Every figure, table, and percentage is anchored to exact source chunks with similarity scores so you can audit the proof immediately."
          header={
            <div className="flex flex-1 w-full h-40 rounded-xl bg-muted/40 p-3.5 border border-border/70 flex-col justify-center gap-2 overflow-hidden">
              <div className="p-3 rounded-lg bg-background border border-border text-xs space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <FileCheck className="h-3.5 w-3.5 text-primary" />
                    Chunk #18 • Page 26
                  </span>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    99.2% Match
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed font-mono">
                  &quot;Consolidated Net Income attributable to common shareholders stood at $34,812,000 against $26,450,000 in prior period...&quot;
                </p>
              </div>
            </div>
          }
          icon={<FileCheck className="h-5 w-5 text-emerald-500" />}
          badge="Audit Grade"
        />

        {/* Item 4: Pinecone Vector Database (2 cols) */}
        <BentoGridItem
          title="Sub-Millisecond Vector Retrieval Pipeline"
          description="Documents are partitioned into semantically coherent chunks, embedded via high-dimensional neural models, and indexed in Pinecone vector namespaces for sub-10ms similarity lookup."
          header={
            <div className="flex flex-1 w-full h-40 rounded-xl bg-neutral-950 p-4 border border-neutral-800 text-neutral-200 flex items-center justify-around overflow-hidden shadow-inner font-mono text-xs">
              <div className="flex flex-col items-center gap-2">
                <div className="h-11 w-11 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-blue-400 shadow-sm">
                  <LineChart className="h-5 w-5" />
                </div>
                <span className="text-[10px] text-neutral-400 font-medium">1. Ingest PDF</span>
              </div>
              <ArrowRight className="h-4 w-4 text-neutral-600" />
              <div className="flex flex-col items-center gap-2">
                <div className="h-11 w-11 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-purple-400 shadow-sm">
                  <Cpu className="h-5 w-5" />
                </div>
                <span className="text-[10px] text-neutral-400 font-medium">2. Chunk & Embed</span>
              </div>
              <ArrowRight className="h-4 w-4 text-neutral-600" />
              <div className="flex flex-col items-center gap-2">
                <div className="h-11 w-11 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-emerald-400 shadow-sm">
                  <Search className="h-5 w-5" />
                </div>
                <span className="text-[10px] text-neutral-400 font-medium">3. Pinecone Hybrid</span>
              </div>
              <ArrowRight className="h-4 w-4 text-neutral-600" />
              <div className="flex flex-col items-center gap-2">
                <div className="h-11 w-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold">4. Grounded Output</span>
              </div>
            </div>
          }
          icon={<Cpu className="h-5 w-5 text-violet-500" />}
          className="md:col-span-2"
          badge="Pinecone Hybrid"
        />
      </BentoGrid>
    </section>
  );
}
