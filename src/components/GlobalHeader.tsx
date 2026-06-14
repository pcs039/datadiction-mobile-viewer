"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, ChevronRight, Layers } from "lucide-react";

const municipalityNames: Record<string, string> = {
  haenam: "해남군",
  wando: "완도군",
  jindo: "진도군",
  gangjin: "강진군",
  jangheung: "장흥군",
  yeongam: "영암군",
  muan: "무안군",
  hampyeong: "함평군",
  yeonggwang: "영광군",
  jangseong: "장성군",
  sinan: "신안군",
  yeosu: "여수시",
  suncheon: "순천시",
  gwangyang: "광양시",
  boseong: "보성군",
  goheung: "고흥군",
  gurye: "구례군",
  gokseong: "곡성군",
  hwasun: "화순군",
  damyang: "담양군",
};

export default function GlobalHeader() {
  const pathname = usePathname();
  
  // Parse path segments
  // Path format examples:
  // /
  // /[municipalityId]/dashboard
  // /[municipalityId]/page/[pageNumber]
  // /[municipalityId]/settings
  const segments = pathname.split("/").filter(Boolean);
  
  const isRoot = segments.length === 0;
  const rawTenant = segments[0] || "";
  const tenant = rawTenant.toLowerCase();
  const hasTenant = tenant !== "settings" && segments.length > 0;
  
  const mName = municipalityNames[tenant] || rawTenant.toUpperCase();
  const subRoute = segments[1] || "";
  
  let sectionLabel = "";
  if (subRoute === "dashboard") {
    sectionLabel = "실시간 검수 대시보드";
  } else if (subRoute === "page") {
    const pageNum = segments[2] || "1";
    sectionLabel = `주민 열람용 뷰어 (P.${pageNum})`;
  } else if (subRoute === "settings" || tenant === "settings") {
    sectionLabel = "시스템 설정";
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-slate-950/70 border-b border-slate-900/80 backdrop-blur-md z-50 flex items-center justify-between px-6 transition-all duration-300">
      {/* Left side breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 select-none">
        <Link 
          href="/" 
          className="flex items-center gap-1 text-slate-450 hover:text-white transition-colors"
          title="마스터 포털 홈"
        >
          <Home className="w-4 h-4" />
        </Link>
        
        {isRoot && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-700" />
            <span className="text-white font-extrabold">통합 마스터 홈</span>
          </>
        )}

        {hasTenant && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-700" />
            <Link 
              href={`/${tenant}/dashboard`}
              className="text-slate-300 hover:text-white transition-colors"
            >
              {mName}
            </Link>
          </>
        )}

        {sectionLabel && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-700" />
            <span className="text-white font-extrabold">{sectionLabel}</span>
          </>
        )}
      </div>

      {/* Right side system labels */}
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-800/80 text-slate-400 px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-widest scale-90">
          <Layers className="w-3 h-3 text-orange-400" />
          Enterprise System
        </span>
      </div>
    </header>
  );
}
