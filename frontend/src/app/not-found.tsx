"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, FileQuestion, Sparkles, LayoutDashboard, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocuMindLogo } from "@/components/ui/logo";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden bg-background text-foreground selection:bg-emerald-500/20">
      {/* Background Cyber Matrix Grid */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Ambient Neon Cyan / Emerald Glowing Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[500px] h-[350px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-xl mx-auto text-center space-y-6">
        {/* Brand Header */}
        <div className="flex justify-center mb-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <DocuMindLogo size={36} showText={true} />
          </Link>
        </div>

        {/* 404 Status Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
          <span>Error 404 • Coordinate Not Found</span>
        </div>

        {/* Glowing 404 Visual */}
        <div className="relative flex justify-center items-center py-2">
          <div className="relative text-8xl sm:text-9xl font-black tracking-tighter bg-gradient-to-b from-foreground via-muted-foreground/60 to-muted-foreground/20 bg-clip-text text-transparent select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-16 w-16 rounded-2xl bg-card border border-border shadow-2xl flex items-center justify-center text-emerald-500">
              <FileQuestion className="h-8 w-8 text-emerald-500 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Main Error Explanation */}
        <div className="space-y-2.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Lost in Vector Space
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
            The document, conversation, or route you are looking for has been relocated, deleted, or does not exist.
          </p>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {/* Back to Home Button */}
          <Link href="/">
            <Button
              size="lg"
              className="h-11 px-6 rounded-full font-bold text-xs sm:text-sm gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Home className="h-4 w-4" />
              <span>Back to Home</span>
            </Button>
          </Link>

          {/* Go Back / Previous Page Button */}
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.back()}
            className="h-11 px-6 rounded-full font-bold text-xs sm:text-sm gap-2 border-border/90 bg-card hover:bg-accent text-foreground transition-all cursor-pointer shadow-xs hover:shadow-md"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </Button>
        </div>

        {/* Quick Route Shortcuts */}
        <div className="pt-6 border-t border-border/60 flex items-center justify-center gap-6 text-xs text-muted-foreground font-medium">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <LayoutDashboard className="h-3.5 w-3.5 text-emerald-500" />
            <span>Dashboard</span>
          </Link>
          <span className="text-border">•</span>
          <Link
            href="/chat"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <MessageSquare className="h-3.5 w-3.5 text-blue-500" />
            <span>Chat</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
