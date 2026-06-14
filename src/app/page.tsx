"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase";
import { 
  Building2, 
  Layers, 
  BarChart3, 
  CheckCircle, 
  AlertTriangle, 
  FileEdit, 
  Database,
  ArrowRight,
  TrendingUp,
  Cpu,
  Search,
  Grid,
  List,
  ExternalLink
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  englishName: string;
  latestIssue: string;
  status: "APPROVED" | "UNDER_REVIEW" | "DRAFT";
  views: number;
  increase: string;
  color: string;
  themeClasses: {
    text: string;
    border: string;
    bg: string;
    btn: string;
    glow: string;
  };
}

const mockMunicipalities: Project[] = [
  {
    id: "haenam",
    name: "해남군",
    englishName: "Haenam",
    latestIssue: "해남군 소식지 Issue #4",
    status: "APPROVED",
    views: 1480,
    increase: "+15.2%",
    color: "orange",
    themeClasses: {
      text: "text-orange-400",
      border: "border-orange-500/20 hover:border-orange-500/40",
      bg: "bg-orange-500/10",
      btn: "bg-orange-600 hover:bg-orange-500 shadow-orange-600/10",
      glow: "bg-orange-500/5",
    }
  },
  {
    id: "wando",
    name: "완도군",
    englishName: "Wando",
    latestIssue: "완도군 소식지 Issue #1",
    status: "UNDER_REVIEW",
    views: 1390,
    increase: "+10.8%",
    color: "emerald",
    themeClasses: {
      text: "text-emerald-400",
      border: "border-emerald-500/20 hover:border-emerald-500/40",
      bg: "bg-emerald-500/10",
      btn: "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/10",
      glow: "bg-emerald-500/5",
    }
  },
  {
    id: "jindo",
    name: "진도군",
    englishName: "Jindo",
    latestIssue: "진도군 소식지 Issue #1",
    status: "DRAFT",
    views: 1250,
    increase: "+8.4%",
    color: "sky",
    themeClasses: {
      text: "text-sky-400",
      border: "border-sky-500/20 hover:border-sky-500/40",
      bg: "bg-sky-500/10",
      btn: "bg-sky-600 hover:bg-sky-500 shadow-sky-600/10",
      glow: "bg-sky-500/5",
    }
  },
  {
    id: "gangjin",
    name: "강진군",
    englishName: "Gangjin",
    latestIssue: "강진군 소식지 Issue #2",
    status: "APPROVED",
    views: 980,
    increase: "+11.5%",
    color: "orange",
    themeClasses: {
      text: "text-orange-400",
      border: "border-orange-500/20 hover:border-orange-500/40",
      bg: "bg-orange-500/10",
      btn: "bg-orange-600 hover:bg-orange-500 shadow-orange-600/10",
      glow: "bg-orange-500/5",
    }
  },
  {
    id: "jangheung",
    name: "장흥군",
    englishName: "Jangheung",
    latestIssue: "장흥군 소식지 Issue #1",
    status: "DRAFT",
    views: 760,
    increase: "+5.1%",
    color: "sky",
    themeClasses: {
      text: "text-sky-400",
      border: "border-sky-500/20 hover:border-sky-500/40",
      bg: "bg-sky-500/10",
      btn: "bg-sky-600 hover:bg-sky-500 shadow-sky-600/10",
      glow: "bg-sky-500/5",
    }
  },
  {
    id: "yeongam",
    name: "영암군",
    englishName: "Yeongam",
    latestIssue: "영암군 소식지 Issue #3",
    status: "UNDER_REVIEW",
    views: 1100,
    increase: "+9.2%",
    color: "emerald",
    themeClasses: {
      text: "text-emerald-400",
      border: "border-emerald-500/20 hover:border-emerald-500/40",
      bg: "bg-emerald-500/10",
      btn: "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/10",
      glow: "bg-emerald-500/5",
    }
  },
  {
    id: "muan",
    name: "무안군",
    englishName: "Muan",
    latestIssue: "무안군 소식지 Issue #5",
    status: "APPROVED",
    views: 1550,
    increase: "+14.6%",
    color: "orange",
    themeClasses: {
      text: "text-orange-400",
      border: "border-orange-500/20 hover:border-orange-500/40",
      bg: "bg-orange-500/10",
      btn: "bg-orange-600 hover:bg-orange-500 shadow-orange-600/10",
      glow: "bg-orange-500/5",
    }
  },
  {
    id: "hampyeong",
    name: "함평군",
    englishName: "Hampyeong",
    latestIssue: "함평군 소식지 Issue #1",
    status: "DRAFT",
    views: 640,
    increase: "+3.2%",
    color: "sky",
    themeClasses: {
      text: "text-sky-400",
      border: "border-sky-500/20 hover:border-sky-500/40",
      bg: "bg-sky-500/10",
      btn: "bg-sky-600 hover:bg-sky-500 shadow-sky-600/10",
      glow: "bg-sky-500/5",
    }
  },
  {
    id: "yeonggwang",
    name: "영광군",
    englishName: "Yeonggwang",
    latestIssue: "영광군 소식지 Issue #2",
    status: "UNDER_REVIEW",
    views: 890,
    increase: "+6.8%",
    color: "emerald",
    themeClasses: {
      text: "text-emerald-400",
      border: "border-emerald-500/20 hover:border-emerald-500/40",
      bg: "bg-emerald-500/10",
      btn: "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/10",
      glow: "bg-emerald-500/5",
    }
  },
  {
    id: "jangseong",
    name: "장성군",
    englishName: "Jangseong",
    latestIssue: "장성군 소식지 Issue #1",
    status: "APPROVED",
    views: 1020,
    increase: "+11.0%",
    color: "orange",
    themeClasses: {
      text: "text-orange-400",
      border: "border-orange-500/20 hover:border-orange-500/40",
      bg: "bg-orange-500/10",
      btn: "bg-orange-600 hover:bg-orange-500 shadow-orange-600/10",
      glow: "bg-orange-500/5",
    }
  },
  {
    id: "sinan",
    name: "신안군",
    englishName: "Sinan",
    latestIssue: "신안군 소식지 Issue #1",
    status: "DRAFT",
    views: 550,
    increase: "+2.5%",
    color: "sky",
    themeClasses: {
      text: "text-sky-400",
      border: "border-sky-500/20 hover:border-sky-500/40",
      bg: "bg-sky-500/10",
      btn: "bg-sky-600 hover:bg-sky-500 shadow-sky-600/10",
      glow: "bg-sky-500/5",
    }
  },
  {
    id: "yeosu",
    name: "여수시",
    englishName: "Yeosu",
    latestIssue: "여수시 소식지 Issue #6",
    status: "APPROVED",
    views: 3200,
    increase: "+18.3%",
    color: "orange",
    themeClasses: {
      text: "text-orange-400",
      border: "border-orange-500/20 hover:border-orange-500/40",
      bg: "bg-orange-500/10",
      btn: "bg-orange-600 hover:bg-orange-500 shadow-orange-600/10",
      glow: "bg-orange-500/5",
    }
  },
  {
    id: "suncheon",
    name: "순천시",
    englishName: "Suncheon",
    latestIssue: "순천시 소식지 Issue #8",
    status: "APPROVED",
    views: 3800,
    increase: "+21.2%",
    color: "orange",
    themeClasses: {
      text: "text-orange-400",
      border: "border-orange-500/20 hover:border-orange-500/40",
      bg: "bg-orange-500/10",
      btn: "bg-orange-600 hover:bg-orange-500 shadow-orange-600/10",
      glow: "bg-orange-500/5",
    }
  },
  {
    id: "gwangyang",
    name: "광양시",
    englishName: "Gwangyang",
    latestIssue: "광양시 소식지 Issue #4",
    status: "UNDER_REVIEW",
    views: 2100,
    increase: "+13.5%",
    color: "emerald",
    themeClasses: {
      text: "text-emerald-400",
      border: "border-emerald-500/20 hover:border-emerald-500/40",
      bg: "bg-emerald-500/10",
      btn: "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/10",
      glow: "bg-emerald-500/5",
    }
  },
  {
    id: "boseong",
    name: "보성군",
    englishName: "Boseong",
    latestIssue: "보성군 소식지 Issue #2",
    status: "DRAFT",
    views: 720,
    increase: "+4.1%",
    color: "sky",
    themeClasses: {
      text: "text-sky-400",
      border: "border-sky-500/20 hover:border-sky-500/40",
      bg: "bg-sky-500/10",
      btn: "bg-sky-600 hover:bg-sky-500 shadow-sky-600/10",
      glow: "bg-sky-500/5",
    }
  },
  {
    id: "goheung",
    name: "고흥군",
    englishName: "Goheung",
    latestIssue: "고흥군 소식지 Issue #3",
    status: "APPROVED",
    views: 1200,
    increase: "+8.9%",
    color: "orange",
    themeClasses: {
      text: "text-orange-400",
      border: "border-orange-500/20 hover:border-orange-500/40",
      bg: "bg-orange-500/10",
      btn: "bg-orange-600 hover:bg-orange-500 shadow-orange-600/10",
      glow: "bg-orange-500/5",
    }
  },
  {
    id: "gurye",
    name: "구례군",
    englishName: "Gurye",
    latestIssue: "구례군 소식지 Issue #1",
    status: "UNDER_REVIEW",
    views: 590,
    increase: "+2.8%",
    color: "emerald",
    themeClasses: {
      text: "text-emerald-400",
      border: "border-emerald-500/20 hover:border-emerald-500/40",
      bg: "bg-emerald-500/10",
      btn: "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/10",
      glow: "bg-emerald-500/5",
    }
  },
  {
    id: "gokseong",
    name: "곡성군",
    englishName: "Gokseong",
    latestIssue: "곡성군 소식지 Issue #1",
    status: "DRAFT",
    views: 480,
    increase: "+1.9%",
    color: "sky",
    themeClasses: {
      text: "text-sky-400",
      border: "border-sky-500/20 hover:border-sky-500/40",
      bg: "bg-sky-500/10",
      btn: "bg-sky-600 hover:bg-sky-500 shadow-sky-600/10",
      glow: "bg-sky-500/5",
    }
  },
  {
    id: "hwasun",
    name: "화순군",
    englishName: "Hwasun",
    latestIssue: "화순군 소식지 Issue #3",
    status: "APPROVED",
    views: 1450,
    increase: "+12.1%",
    color: "orange",
    themeClasses: {
      text: "text-orange-400",
      border: "border-orange-500/20 hover:border-orange-500/40",
      bg: "bg-orange-500/10",
      btn: "bg-orange-600 hover:bg-orange-500 shadow-orange-600/10",
      glow: "bg-orange-500/5",
    }
  },
  {
    id: "damyang",
    name: "담양군",
    englishName: "Damyang",
    latestIssue: "담양군 소식지 Issue #2",
    status: "UNDER_REVIEW",
    views: 930,
    increase: "+7.4%",
    color: "emerald",
    themeClasses: {
      text: "text-emerald-400",
      border: "border-emerald-500/20 hover:border-emerald-500/40",
      bg: "bg-emerald-500/10",
      btn: "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/10",
      glow: "bg-emerald-500/5",
    }
  }
];

export default function MasterDashboardPage() {
  const [envConfigured, setEnvConfigured] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "REVIEW" | "APPROVED">("ALL");
  const [viewMode, setViewMode] = useState<"GRID" | "LIST">("GRID");

  useEffect(() => {
    setEnvConfigured(isSupabaseConfigured);
  }, []);

  // Filter logic
  const filteredProjects = mockMunicipalities.filter((p) => {
    const matchesSearch = 
      p.name.includes(searchQuery) || 
      p.englishName.toLowerCase().includes(searchQuery.toLowerCase());
      
    let matchesTab = true;
    if (activeTab === "REVIEW") {
      matchesTab = p.status === "UNDER_REVIEW" || p.status === "DRAFT";
    } else if (activeTab === "APPROVED") {
      matchesTab = p.status === "APPROVED";
    }
    
    return matchesSearch && matchesTab;
  });

  // Calculate sum of views
  const totalViewsSum = mockMunicipalities.reduce((sum, p) => sum + p.views, 0);

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/25 text-emerald-450 px-2 py-0.5 rounded-full text-[9px] font-bold">
            <CheckCircle className="w-3 h-3" />
            <span>발행 완료</span>
          </span>
        );
      case "UNDER_REVIEW":
        return (
          <span className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/25 text-amber-450 px-2 py-0.5 rounded-full text-[9px] font-bold">
            <AlertTriangle className="w-3 h-3" />
            <span>검수 대기</span>
          </span>
        );
      case "DRAFT":
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-sky-500/10 border border-sky-500/25 text-sky-450 px-2 py-0.5 rounded-full text-[9px] font-bold">
            <FileEdit className="w-3 h-3" />
            <span>작성 중</span>
          </span>
        );
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#060814] text-slate-200 overflow-y-auto no-scrollbar pb-16">
      
      {/* Upper Global Stats Row */}
      <div className="max-w-6xl w-full mx-auto px-8 pt-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl font-black text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-orange-400" />
              <span>통합 프로젝트 관리 대시보드</span>
            </h1>
            <p className="text-xs text-slate-450">전체 지자체 소식지의 발행 실시간 상태 및 조회 지표를 총괄 관리합니다.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/editor"
              className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 text-orange-400 px-3.5 py-1.5 rounded-xl text-[10px] font-extrabold tracking-wider transition-all hover:scale-105 active:scale-95"
            >
              <span>새 소식지 제작/편집</span>
            </Link>
            <div className="h-6 w-px bg-slate-800"></div>
            {envConfigured ? (
              <span className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[9px] font-extrabold tracking-wide uppercase">
                <Database className="w-3.5 h-3.5" />
                Live DB Connected
              </span>
            ) : (
              <span className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-[9px] font-extrabold tracking-wide uppercase">
                <Cpu className="w-3.5 h-3.5" />
                Sandbox Demo Mode
              </span>
            )}
          </div>
        </div>

        {/* Global Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/20 border border-slate-800/40 rounded-2xl p-5 space-y-2 relative overflow-hidden shadow-md">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>전체 누적 조회수</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">{totalViewsSum.toLocaleString()}회</span>
              <span className="text-[9.5px] font-bold text-emerald-400 flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> +14.6%
              </span>
            </div>
          </div>

          <div className="bg-slate-900/20 border border-slate-800/40 rounded-2xl p-5 space-y-2 relative overflow-hidden shadow-md">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>총 관리 프로젝트</span>
            </div>
            <div className="text-2xl font-black text-white">{mockMunicipalities.length}개소</div>
          </div>

          <div className="bg-slate-900/20 border border-slate-800/40 rounded-2xl p-5 space-y-2 relative overflow-hidden shadow-md">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              <span>연동 데이터베이스 호스트</span>
            </div>
            <div className="text-xs font-bold text-slate-350 pt-1 line-clamp-1 leading-relaxed">
              {envConfigured ? "ujmswgewfgqblvxyshup.supabase.co" : "Offline Sandbox DB (LocalStorage)"}
            </div>
          </div>
        </div>

        {/* Filter Toolbar (Search + Tabs + View Mode Toggle) */}
        <div className="bg-slate-900/35 border border-slate-800/60 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-inner">
          {/* Left: Search input */}
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="지자체명 또는 코드 검색..."
              className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-slate-650 focus:outline-none focus:border-orange-500/80 transition-colors"
            />
          </div>

          {/* Center: Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-900 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("ALL")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === "ALL" 
                  ? "bg-slate-900 text-white" 
                  : "text-slate-550 hover:text-slate-300"
              }`}
            >
              전체 ({mockMunicipalities.length})
            </button>
            <button
              onClick={() => setActiveTab("REVIEW")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === "REVIEW" 
                  ? "bg-slate-900 text-white" 
                  : "text-slate-550 hover:text-slate-300"
              }`}
            >
              검수대기 ({mockMunicipalities.filter(p => p.status !== "APPROVED").length})
            </button>
            <button
              onClick={() => setActiveTab("APPROVED")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === "APPROVED" 
                  ? "bg-slate-900 text-white" 
                  : "text-slate-550 hover:text-slate-300"
              }`}
            >
              발행완료 ({mockMunicipalities.filter(p => p.status === "APPROVED").length})
            </button>
          </div>

          {/* Right: View mode toggle */}
          <div className="flex items-center gap-1 border-l border-slate-800/80 pl-4">
            <button
              onClick={() => setViewMode("GRID")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "GRID" 
                  ? "bg-orange-500/10 text-orange-400 border border-orange-500/25" 
                  : "text-slate-550 hover:text-slate-300 border border-transparent"
              }`}
              title="격자형 카드 뷰"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("LIST")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "LIST" 
                  ? "bg-orange-500/10 text-orange-400 border border-orange-500/25" 
                  : "text-slate-550 hover:text-slate-300 border border-transparent"
              }`}
              title="리스트 뷰"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Projects Render Section */}
        {filteredProjects.length === 0 ? (
          <div className="bg-slate-900/10 border border-slate-800/40 rounded-2xl py-12 text-center text-slate-500 text-xs font-semibold">
            검색 결과에 부합하는 지자체 프로젝트가 없습니다.
          </div>
        ) : viewMode === "GRID" ? (
          /* GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            {filteredProjects.map((p) => {
              const tc = p.themeClasses;
              return (
                <div 
                  key={p.id}
                  className={`bg-slate-900/30 border ${tc.border} rounded-2xl p-6 space-y-5 shadow-lg relative overflow-hidden group transition-all duration-300 hover:scale-[1.02]`}
                >
                  <div className={`absolute -top-10 -right-10 w-24 h-24 ${tc.glow} rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500`}></div>
                  
                  <div className="flex justify-between items-start relative z-10">
                    <div>
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        <span>{p.name}</span>
                        <span className="text-[10px] text-slate-550 font-normal">({p.englishName})</span>
                      </h3>
                      <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">{p.id} project</p>
                    </div>
                    {renderStatusBadge(p.status)}
                  </div>

                  <div className="space-y-2.5 pt-1 relative z-10">
                    <div className="flex justify-between border-b border-slate-800/60 pb-2">
                      <span className="text-[10.5px] text-slate-500 font-semibold">주민 조회수</span>
                      <span className="text-[11.5px] font-extrabold text-slate-250 flex items-center gap-1">
                        {p.views.toLocaleString()}회
                        <span className="text-[9.5px] text-emerald-450 font-semibold">{p.increase}</span>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10.5px] text-slate-500 font-semibold">최신 발행본</span>
                      <span className="text-[10.5px] font-bold text-slate-350">{p.latestIssue}</span>
                    </div>
                  </div>

                  <div className="pt-2 relative z-10">
                    <Link
                      href={`/${p.id}/dashboard`}
                      className={`w-full py-2.5 rounded-xl text-white text-[10.5px] font-extrabold tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 shadow-md ${tc.btn}`}
                    >
                      <span>대시보드 관리</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2.5] transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* COMPACT LIST VIEW */
          <div className="bg-slate-900/20 border border-slate-800/40 rounded-2xl overflow-hidden shadow-lg animate-fade-in">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/80 bg-slate-950/40 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                    <th className="py-4.5 px-6">지자체 프로젝트</th>
                    <th className="py-4.5 px-6">최신 발행 호수</th>
                    <th className="py-4.5 px-6">누적 조회수</th>
                    <th className="py-4.5 px-6">유입 경로 증가율</th>
                    <th className="py-4.5 px-6">발행 검수 상태</th>
                    <th className="py-4.5 px-6 text-right">대시보드 바로가기</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 text-xs font-semibold text-slate-300">
                  {filteredProjects.map((p) => {
                    const isOrange = p.color === "orange";
                    const isGreen = p.color === "emerald";
                    const borderHoverClass = isOrange 
                      ? "hover:bg-orange-500/[0.02]" 
                      : isGreen 
                      ? "hover:bg-emerald-500/[0.02]" 
                      : "hover:bg-sky-500/[0.02]";

                    return (
                      <tr key={p.id} className={`transition-colors ${borderHoverClass}`}>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold">{p.name}</span>
                            <span className="text-[10px] text-slate-500 lowercase">({p.id})</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-slate-400">{p.latestIssue}</td>
                        <td className="py-4 px-6 text-white font-extrabold">{p.views.toLocaleString()}회</td>
                        <td className="py-4 px-6 text-emerald-450">{p.increase}</td>
                        <td className="py-4 px-6">{renderStatusBadge(p.status)}</td>
                        <td className="py-4 px-6 text-right">
                          <Link 
                            href={`/${p.id}/dashboard`}
                            className={`inline-flex items-center gap-1.5 text-[10.5px] font-bold ${
                              isOrange 
                                ? "text-orange-400 hover:text-orange-300" 
                                : isGreen 
                                ? "text-emerald-400 hover:text-emerald-300" 
                                : "text-sky-400 hover:text-sky-300"
                            } transition-colors`}
                          >
                            <span>입장</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
