"use client";

import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase";
import { Database, Link2Off, RefreshCw } from "lucide-react";

export default function SupabaseBanner() {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-slate-900/60 border-b border-slate-800 backdrop-blur-md sticky top-0 z-30 select-none">
      <div className="flex items-center gap-2">
        <Database className="w-4 h-4 text-orange-400" />
        <span className="text-xs font-semibold tracking-wide bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
          NEWSLETTER VIEWER
        </span>
      </div>

      {isSupabaseConfigured ? (
        <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-[10px] font-medium shadow-sm">
          <RefreshCw className="w-3 h-3 animate-spin-slow" />
          <span>Supabase Connected</span>
        </div>
      ) : (
        <Link 
          href="/settings"
          className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors"
        >
          <Link2Off className="w-3 h-3" />
          <span>Using Mock Data</span>
        </Link>
      )}
    </div>
  );
}
