import Link from "next/link";
import NavbarDemo from "@/components/resizable-navbar-demo";
import { FeaturesBentoSection } from "@/components/home/bento-grid";
import {
  ArrowRight,
  Sparkles,
  FileText,
  Zap,
  ShieldCheck,
  Layers,
  LineChart,
  CheckCircle2,
  Cpu,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-emerald-500/20">
      {/* Floating Elevated Navbar */}
      <header className="fixed inset-x-0 top-3 sm:top-5 z-50 flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8">
          <NavbarDemo />
        </div>
      </header>

      {/* Hero Section with High-Tech RAG Visual Grid Pattern */}
      <section className="relative pt-32 sm:pt-40 pb-20 md:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle Cyber Grid Matrix */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#80808015_1px,transparent_1px),linear-gradient(to_bottom,#80808015_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_15%,#000_70%,transparent_100%)]" />

        {/* Ambient Neon Cyan / Emerald Glowing Aura */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[550px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-7">
          {/* High-Tech Shimmer Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 backdrop-blur-md shadow-xs animate-pulse">
            <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
            <span>DocuMind 2.0 • Real-Time Financial & Enterprise Document AI</span>
          </div>

          {/* Clean, High-Contrast Hero Headline (No cheap rainbow gradient) */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-foreground leading-[1.08]">
            Chat With Any Document{" "}
            <span className="block mt-2 font-black tracking-tight text-foreground relative inline-block">
              In Real-Time
              <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-primary to-emerald-500 rounded-full opacity-80" />
            </span>
          </h1>

          {/* Hero Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-normal">
            Upload financial statements, 10-K filings, auditor reports, or operational dossiers. Ask questions and get instant streaming answers grounded in your data with verified mathematical citations.
          </p>

          {/* Call To Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link href="/chat">
              <Button
                size="lg"
                className="h-12 px-8 text-sm font-bold rounded-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Launch Document Chat</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <Link href="/dashboard">
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 text-sm font-bold rounded-full gap-2 border-border/90 bg-card text-foreground hover:bg-white hover:text-black dark:hover:bg-white dark:hover:text-black transition-all cursor-pointer shadow-2xs hover:shadow-md"
              >
                <FileText className="h-4 w-4 text-emerald-500" />
                <span>Go to Dashboard</span>
              </Button>
            </Link>
          </div>

          {/* Telemetry Metrics Row */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-6 text-xs sm:text-sm font-semibold text-muted-foreground">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              <span>&lt; 320ms First Token</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-blue-500" />
              <span>Multi-File Correlated Search</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Zero-Hallucination Verified Citations</span>
            </div>
          </div>
        </div>

        {/* Interactive Financial Document QA Simulator Mockup */}
        <div className="max-w-5xl mx-auto mt-16 sm:mt-20">
          <div className="rounded-2xl border border-border/90 bg-card/85 dark:bg-neutral-900/85 shadow-2xl backdrop-blur-xl p-3.5 sm:p-6 overflow-hidden transition-all duration-300 hover:border-emerald-500/40">
            {/* Window Top Controls */}
            <div className="flex items-center justify-between pb-3.5 border-b border-border/80 mb-4 px-2">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground ml-2">
                  DocuMind Financial Assistant — session_live
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                  ● SSE Stream Active (140 tok/s)
                </span>
              </div>
            </div>

            {/* Mock Chat Content - Financial Document Context */}
            <div className="space-y-4 p-2 sm:p-3 text-xs sm:text-sm">
              {/* User Prompt */}
              <div className="flex justify-end gap-2.5 max-w-2xl ml-auto">
                <div className="space-y-1.5 text-right">
                  <div className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground bg-muted/80 px-2.5 py-1 rounded-md border border-border/60">
                    <FileText className="h-3 w-3 text-primary" />
                    <span>Referencing: Q3_2026_Consolidated_Financial_Report.pdf</span>
                  </div>
                  <div className="bg-primary text-primary-foreground px-4 py-2.5 rounded-2xl rounded-tr-xs text-left shadow-xs font-medium">
                    What was our ARR growth, net revenue retention, and free cash flow margin for Q3 2026?
                  </div>
                </div>
              </div>

              {/* Bot Response with Thinking Badge & Citations */}
              <div className="flex gap-3 max-w-3xl mr-auto">
                <div className="h-8 w-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-500 mt-1">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="space-y-2.5 flex-1">
                  {/* Citations Preview Badge */}
                  <div className="inline-flex items-center gap-2 text-xs bg-muted/70 px-3 py-1 rounded-md border border-border font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="font-bold text-foreground">Source Chunk #8 • Page 14</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">99.1% Cosine Similarity</span>
                  </div>

                  <div className="p-4 rounded-xl bg-muted/30 border border-border/80 text-foreground space-y-3 leading-relaxed text-xs sm:text-sm">
                    <p>
                      According to the audited <strong>Consolidated Financial Statements for Q3 2026</strong>, the operational and financial metrics are summarized below:
                    </p>

                    {/* Financial Metrics Summary Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 my-2">
                      <div className="p-2.5 rounded-lg bg-background border border-border space-y-1">
                        <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-emerald-500" />
                          ARR YoY Growth
                        </span>
                        <p className="text-base font-black text-foreground">$184.6M (+34.2%)</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-background border border-border space-y-1">
                        <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                          <LineChart className="h-3 w-3 text-blue-500" />
                          Net Retention (NRR)
                        </span>
                        <p className="text-base font-black text-foreground">124.5%</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-background border border-border space-y-1">
                        <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                          <BarChart3 className="h-3 w-3 text-purple-500" />
                          Free Cash Flow
                        </span>
                        <p className="text-base font-black text-foreground">$42.8M (23.2%)</p>
                      </div>
                    </div>

                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      <li>
                        <strong className="text-foreground">Revenue Expansion:</strong> Driven by 48 new enterprise customer contracts with ACV &gt; $100k.
                      </li>
                      <li>
                        <strong className="text-foreground">Gross Margin:</strong> Non-GAAP gross margin stood at <strong>78.4%</strong>, representing a 330 bps improvement over Q3 2025.
                      </li>
                      <li>
                        <strong className="text-foreground">Operating Leverage:</strong> GAAP operating expenses decreased 4.1% as a percentage of total revenues.
                      </li>
                    </ul>

                    <div className="pt-1 flex items-center justify-between text-[11px] text-muted-foreground font-mono border-t border-border/50">
                      <span>Streamed via DocuMind RAG pipeline in 0.38s</span>
                      <span className="text-emerald-500 font-semibold">100% Grounded</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RAG Pipeline Interactive Flow Visualizer */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/60">
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
            <Cpu className="h-3.5 w-3.5" />
            <span>HOW DOCUMIND RAG WORKS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            From Raw PDFs to Verified Insights in 3 Steps
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            A secure retrieval-augmented generation pipeline optimized for factual integrity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-card border border-border/80 space-y-3.5 shadow-sm relative group hover:border-emerald-500/40 transition-colors">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              01
            </div>
            <h3 className="font-bold text-lg text-foreground">Ingest & Intelligent Chunking</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Upload PDF, DOCX, or TXT documents. Files are split into semantically coherent chunks with overlap to preserve tables and context continuity.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border/80 space-y-3.5 shadow-sm relative group hover:border-primary/40 transition-colors">
            <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              02
            </div>
            <h3 className="font-bold text-lg text-foreground">Pinecone Vector Indexing</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Chunks are transformed into high-dimensional vector embeddings and partitioned into dedicated user namespaces for sub-10ms similarity recall.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border/80 space-y-3.5 shadow-sm relative group hover:border-blue-500/40 transition-colors">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
              03
            </div>
            <h3 className="font-bold text-lg text-foreground">Grounded SSE Streaming</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              The retrieved evidence is injected into the LLM system prompt. Responses stream in real-time backed by verifiable chunk-level citations.
            </p>
          </div>
        </div>
      </section>

      {/* Bento Grid Features Section */}
      <FeaturesBentoSection />

      {/* Call To Action Banner */}
      <section className="pt-6 pb-20 sm:pt-8 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 bg-gradient-to-br from-neutral-900 to-neutral-950 text-white border border-neutral-800 shadow-2xl text-center space-y-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-500/20 via-emerald-500/10 to-transparent pointer-events-none" />

          {/* Active Target Document Badge */}
          <div className="relative z-10 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-emerald-300 backdrop-blur-md">
            <FileText className="h-3.5 w-3.5 text-emerald-400" />
            <span>Target: Master_Services_Agreement_2026.pdf • SOC2_Audit_Type_II.pdf</span>
          </div>

          <div className="relative z-10 space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
              Ready to Query Complex Legal Contracts & Compliance Dossiers?
            </h2>
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
              Upload Master Service Agreements, NDAs, ISO audit frameworks, or technical system specs. Extract hidden liabilities, verify clauses, and cite paragraphs instantly with zero hallucination.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link href="/chat">
              <Button
                size="lg"
                className="h-12 px-8 rounded-full bg-white text-black hover:bg-neutral-200 font-bold text-sm gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Launch Document Chat</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <Link href="/dashboard">
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 rounded-full border-neutral-700 bg-neutral-900/80 hover:bg-white hover:text-black text-white font-bold text-sm transition-all cursor-pointer"
              >
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="py-10 border-t border-border/80 text-center text-xs text-muted-foreground space-y-2">
        <div className="flex items-center justify-center gap-2 font-bold text-foreground">
          <FileText className="h-4 w-4 text-emerald-500" />
          <span>DocuMind</span>
        </div>
        <p>© 2026 DocuMind AI. Grounded document comprehension & vector intelligence.</p>
      </footer>
    </div>
  );
}
