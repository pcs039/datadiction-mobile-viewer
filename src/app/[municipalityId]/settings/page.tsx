"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import SupabaseBanner from "@/components/SupabaseBanner";
import BottomNav from "@/components/BottomNav";
import { isSupabaseConfigured } from "@/lib/supabase";
import { 
  Settings, 
  Database, 
  HelpCircle, 
  Terminal, 
  Save, 
  KeyRound, 
  Globe, 
  AlertCircle,
  CheckCircle2
} from "lucide-react";

interface ThemeClasses {
  textAccent: string;
  focusAccent: string;
  buttonBg: string;
}

const themeMap: Record<string, ThemeClasses> = {
  haenam: {
    textAccent: "text-orange-400",
    focusAccent: "focus:border-orange-500",
    buttonBg: "bg-orange-600 hover:bg-orange-500 shadow-orange-600/15",
  },
  wando: {
    textAccent: "text-emerald-400",
    focusAccent: "focus:border-emerald-500",
    buttonBg: "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/15",
  },
  jindo: {
    textAccent: "text-sky-400",
    focusAccent: "focus:border-sky-500",
    buttonBg: "bg-sky-600 hover:bg-sky-500 shadow-sky-600/15",
  },
};

export default function SettingsPage() {
  const params = useParams();
  const municipalityId = (params?.municipalityId as string) || "haenam";
  const tenant = municipalityId.toLowerCase();
  const theme = themeMap[tenant] || themeMap.haenam;

  // Read-only state from NEXT environment
  const [envConfigured, setEnvConfigured] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseAnonKey, setSupabaseAnonKey] = useState("");

  // Local overrides (LocalStorage)
  const [localUrl, setLocalUrl] = useState("");
  const [localKey, setLocalKey] = useState("");
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    setEnvConfigured(isSupabaseConfigured);
    setSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL || "");
    setSupabaseAnonKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "");
    
    // Load local storage overrides
    const storedUrl = localStorage.getItem("local_supabase_url") || "";
    const storedKey = localStorage.getItem("local_supabase_key") || "";
    setLocalUrl(storedUrl);
    setLocalKey(storedKey);
  }, []);

  const handleSaveOverrides = (e: React.FormEvent) => {
    e.preventDefault();
    if (localUrl.trim() && localKey.trim()) {
      localStorage.setItem("local_supabase_url", localUrl);
      localStorage.setItem("local_supabase_key", localKey);
      setSaveStatus("success");
      
      // Clear after 3 seconds
      setTimeout(() => {
        setSaveStatus("");
        // Reload page to re-initialize supabase client if overridden (mock/real)
        window.location.reload();
      }, 1500);
    } else {
      localStorage.removeItem("local_supabase_url");
      localStorage.removeItem("local_supabase_key");
      setSaveStatus("cleared");
      setTimeout(() => {
        setSaveStatus("");
        window.location.reload();
      }, 1500);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden pb-24 text-slate-200">
      <SupabaseBanner />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 space-y-5 no-scrollbar">
        {/* Title */}
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Settings className={`w-5 h-5 ${theme.textAccent}`} />
            <span>Settings</span>
          </h1>
          <p className="text-xs text-slate-400">
            Configure Supabase endpoints and environments.
          </p>
        </div>

        {/* Current Connection Mode Badge */}
        <div className={`p-4 rounded-2xl border flex items-center justify-between shadow-lg ${
          envConfigured || (localUrl && localKey)
            ? "bg-emerald-950/20 border-emerald-500/20 text-emerald-400"
            : "bg-amber-950/20 border-amber-500/20 text-amber-500"
        }`}>
          <div className="space-y-0.5">
            <h3 className="text-xs font-bold uppercase tracking-wider">Connection Status</h3>
            <p className="text-xs text-slate-400">
              {envConfigured || (localUrl && localKey)
                ? "Active: Live Supabase Synced"
                : "Active: Offline Mock Database"}
            </p>
          </div>
          {envConfigured || (localUrl && localKey) ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          ) : (
            <AlertCircle className="w-6 h-6 text-amber-500" />
          )}
        </div>

        {/* Local override setting form */}
        <form onSubmit={handleSaveOverrides} className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-800/80">
            <KeyRound className={`w-4 h-4 ${theme.textAccent}`} />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              LocalStorage Overrides
            </h3>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Need to sync with a live Supabase instance instantly? Add your credentials here. They will be saved locally in your browser.
          </p>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Supabase URL
              </label>
              <input
                type="text"
                value={localUrl}
                onChange={(e) => setLocalUrl(e.target.value)}
                placeholder="https://your-project-ref.supabase.co"
                className={`w-full bg-slate-950 border border-slate-800 text-xs rounded-xl py-2.5 px-3.5 text-white placeholder-slate-600 focus:outline-none ${theme.focusAccent} transition-colors`}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Anon API Key
              </label>
              <input
                type="password"
                value={localKey}
                onChange={(e) => setLocalKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className={`w-full bg-slate-950 border border-slate-800 text-xs rounded-xl py-2.5 px-3.5 text-white placeholder-slate-600 focus:outline-none ${theme.focusAccent} transition-colors`}
              />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-2.5 ${theme.buttonBg} hover:opacity-90 active:scale-95 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>Apply & Refresh</span>
          </button>

          {saveStatus === "success" && (
            <p className="text-center text-xs text-emerald-400 font-semibold animate-fade-in">
              ✓ Local credentials saved! Reloading...
            </p>
          )}
          {saveStatus === "cleared" && (
            <p className="text-center text-xs text-amber-400 font-semibold animate-fade-in">
              ✓ Local credentials cleared! Reloading...
            </p>
          )}
        </form>

        {/* Environment File Instruction */}
        <div className="bg-slate-900/20 border border-slate-800/40 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-800/80">
            <Globe className={`w-4 h-4 ${theme.textAccent}`} />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              System Environment Config
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            To make these credentials persistent in production, update `.env.local` inside the project directory:
          </p>
          <pre className="bg-slate-950 border border-slate-800/60 rounded-xl p-3 text-[10px] font-mono text-amber-300/80 overflow-x-auto leading-relaxed">
{`NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-string`}
          </pre>
        </div>

        {/* Terminal/DB Migration guide */}
        <div className="bg-slate-900/20 border border-slate-800/40 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-800/80">
            <Terminal className={`w-4 h-4 ${theme.textAccent}`} />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Supabase CLI Migrations
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Run the following schema migrations using the Supabase CLI:
          </p>
          <div className="bg-slate-950 border border-slate-800/60 rounded-xl p-3 text-[10px] font-mono text-emerald-400 overflow-x-auto space-y-1">
            <p># 1. Initialize local Supabase project</p>
            <p className="text-slate-200">supabase init</p>
            <p className="pt-2"># 2. Deploy schema migration files</p>
            <p className="text-slate-200">supabase db push</p>
          </div>
        </div>
      </div>

      {/* Floating navigation */}
      <BottomNav />
    </div>
  );
}
