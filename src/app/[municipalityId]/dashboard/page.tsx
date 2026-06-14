"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchNewsletterPages, approveNewsletter } from "@/lib/supabase";
import { SubPage, mockNewsletterPages } from "@/lib/newsletterData";
import SupabaseBanner from "@/components/SupabaseBanner";
import BottomNav from "@/components/BottomNav";
import { 
  ClipboardCheck, 
  ChevronLeft, 
  ChevronRight,
  Check, 
  AlertCircle, 
  Loader2, 
  CheckCircle,
  Eye,
  FileText,
  Clock,
  TrendingUp,
  BarChart3,
  Share2,
  Mail,
  Compass,
  Smartphone
} from "lucide-react";

interface ThemeClasses {
  textAccent: string;
  bgAccent: string;
  borderAccent: string;
  borderLAccent: string;
  glowAccent: string;
  buttonBg: string;
  buttonHoverBg: string;
  checkboxColor: string;
  barColor: string;
}

const themeMap: Record<string, ThemeClasses> = {
  haenam: {
    textAccent: "text-orange-400",
    bgAccent: "bg-orange-500/10",
    borderAccent: "border-orange-500/20",
    borderLAccent: "border-orange-500/40",
    glowAccent: "bg-orange-500/5",
    buttonBg: "bg-orange-600 shadow-orange-600/15",
    buttonHoverBg: "hover:bg-orange-500",
    checkboxColor: "text-orange-400",
    barColor: "bg-orange-500",
  },
  wando: {
    textAccent: "text-emerald-400",
    bgAccent: "bg-emerald-500/10",
    borderAccent: "border-emerald-500/20",
    borderLAccent: "border-emerald-500/40",
    glowAccent: "bg-emerald-500/5",
    buttonBg: "bg-emerald-600 shadow-emerald-600/15",
    buttonHoverBg: "hover:bg-emerald-500",
    checkboxColor: "text-emerald-400",
    barColor: "bg-emerald-500",
  },
  jindo: {
    textAccent: "text-sky-400",
    bgAccent: "bg-sky-500/10",
    borderAccent: "border-sky-500/20",
    borderLAccent: "border-sky-500/40",
    glowAccent: "bg-sky-500/5",
    buttonBg: "bg-sky-600 shadow-sky-600/15",
    buttonHoverBg: "hover:bg-sky-500",
    checkboxColor: "text-sky-400",
    barColor: "bg-sky-550",
  },
};

function DashboardContent() {
  const params = useParams();
  const municipalityId = (params?.municipalityId as string) || "haenam";
  const tenant = municipalityId.toLowerCase();
  const theme = themeMap[tenant] || themeMap.haenam;

  const [pages, setPages] = useState<SubPage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [status, setStatus] = useState<"PENDING" | "APPROVING" | "APPROVED">("PENDING");

  // Local page selection state inside the mobile mockup simulator (right column)
  const [previewPage, setPreviewPage] = useState<number>(1);

  // Checklist items
  const [checkedItems, setCheckedItems] = useState({
    sourcePdfTextImg: false,
    highResImgOpt: false,
    snsVideoLink: false,
    restaurantMapInteraction: false,
  });

  const getFallbackData = () => {
    const filtered = mockNewsletterPages.filter(
      (p) => p.municipality_slug === tenant
    );

    if (typeof window !== "undefined") {
      try {
        const storedStr = localStorage.getItem(`local_custom_pages_${tenant}`);
        if (storedStr) {
          const storedPages = JSON.parse(storedStr) as SubPage[];
          if (Array.isArray(storedPages)) {
            return [...filtered, ...storedPages];
          }
        }
      } catch (err) {
        console.error("Failed to parse local custom pages:", err);
      }
    }

    return filtered.length > 0 
      ? filtered 
      : mockNewsletterPages.filter((p) => p.municipality_slug === "haenam");
  };

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setStatus("PENDING");
      setCheckedItems({
        sourcePdfTextImg: false,
        highResImgOpt: false,
        snsVideoLink: false,
        restaurantMapInteraction: false,
      });
      try {
        const liveData = await fetchNewsletterPages(tenant);
        if (liveData && liveData.length > 0) {
          setPages(liveData);
          setIsLive(true);
          const dbStatus = liveData[0]?.newsletters?.status;
          if (dbStatus === "APPROVED") {
            setStatus("APPROVED");
            setCheckedItems({
              sourcePdfTextImg: true,
              highResImgOpt: true,
              snsVideoLink: true,
              restaurantMapInteraction: true,
            });
          }
        } else {
          setPages(getFallbackData());
          setIsLive(false);
        }
      } catch (err) {
        console.error(`Failed to load newsletter data for ${tenant}:`, err);
        setPages(getFallbackData());
        setIsLive(false);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [tenant]);

  // Reset simulator active page when pages dataset changes
  useEffect(() => {
    setPreviewPage(1);
  }, [pages]);

  const activePage = pages[0];
  const totalPages = pages.length;
  const allChecked = Object.values(checkedItems).every(Boolean);

  // Active page inside the embedded phone mockup
  const previewActivePageIndex = Math.max(0, Math.min(previewPage - 1, totalPages - 1));
  const previewActivePage = pages[previewActivePageIndex] || pages[0];

  const handleApprove = async () => {
    if (!allChecked || status !== "PENDING") return;
    setStatus("APPROVING");
    try {
      const newsletterId = activePage?.newsletter_id || "newsletter-demo";
      // Perform database update
      const success = await approveNewsletter(newsletterId);
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setStatus("APPROVED");
    } catch (err) {
      console.error("Failed to approve newsletter:", err);
      setStatus("PENDING");
    }
  };

  const toggleCheck = (id: keyof typeof checkedItems) => {
    if (status !== "PENDING") return;
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const checklistItems = [
    { id: "sourcePdfTextImg", label: "기관 공식 PDF 원천 텍스트 및 이미지 매칭 상태" },
    { id: "highResImgOpt", label: "요청 반영된 추가 고화질 이미지 및 규격 최적화" },
    { id: "snsVideoLink", label: "지역 유튜브/SNS 동영상 링크 연동 상태" },
    { id: "restaurantMapInteraction", label: "지역 맛집/관광지 지도 및 연락처 인터랙션" },
  ] as const;

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center text-slate-400 space-y-3 pb-24">
        <div className={`w-8 h-8 border-4 border-t-transparent rounded-full animate-spin ${theme.checkboxColor === "text-orange-400" ? "border-orange-500" : theme.checkboxColor === "text-emerald-400" ? "border-emerald-500" : "border-sky-500"}`}></div>
        <p className="text-xs font-semibold tracking-wider">소식지 데이터를 불러오는 중...</p>
      </div>
    );
  }

  if (!activePage) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center text-slate-400 space-y-2 pb-24 px-6 text-center">
        <AlertCircle className={`w-12 h-12 ${theme.textAccent}`} />
        <p className="font-semibold text-sm">소식지 데이터를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const municipalityName = activePage.newsletters?.title || `${tenant.toUpperCase()} 소식지`;

  return (
    <div className="w-full h-full flex bg-[#060814] overflow-hidden text-slate-200 relative">
      <style>{`
        @keyframes float-particle {
          0% {
            transform: translateY(0) scale(1) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-280px) scale(0.2) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-float-particle {
          animation: float-particle 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>

      {/* Floating particles upon approval */}
      {status === "APPROVED" && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl z-40">
          {[...Array(16)].map((_, i) => {
            const delay = i * 0.1;
            const left = Math.random() * 80 + 10;
            const size = Math.random() * 6 + 4;
            const colors = ["#fb923c", "#34d399", "#38bdf8", "#fbbf24", "#ec4899"];
            const bg = colors[i % colors.length];
            return (
              <div
                key={i}
                className="absolute bottom-12 rounded-full animate-float-particle"
                style={{
                  left: `${left}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: bg,
                  animationDelay: `${delay}s`,
                  animationDuration: `${Math.random() * 1.5 + 1.5}s`,
                }}
              ></div>
            );
          })}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* DESKTOP SPLIT-SCREEN WORKBENCH (md+ screen width)    */}
      {/* ---------------------------------------------------- */}

      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 bg-slate-900/40 border-r border-slate-800/60 p-6 flex flex-col justify-between hidden md:flex">
        <div className="space-y-6">
          {/* Logo Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800/60">
            <div className={`w-9 h-9 rounded-xl ${theme.bgAccent} border ${theme.borderAccent} flex items-center justify-center`}>
              <ClipboardCheck className={`w-5 h-5 ${theme.textAccent}`} />
            </div>
            <div>
              <h2 className="text-xs font-extrabold text-white tracking-tight line-clamp-1">
                {municipalityName}
              </h2>
              <span className="text-[9px] text-slate-500 font-semibold tracking-wider uppercase">통합 제작 관리 시스템</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold ${theme.bgAccent} ${theme.textAccent}`}>
              <ClipboardCheck className="w-4 h-4" />
              <span>실시간 검수 대시보드</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-400 cursor-not-allowed">
              <Eye className="w-4 h-4" />
              <span>성과 관리 리포트</span>
              <span className="ml-auto text-[7px] bg-slate-800/80 text-slate-500 px-1.5 py-0.5 rounded-full uppercase">준비중</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-400 cursor-not-allowed">
              <FileText className="w-4 h-4" />
              <span>배포 채널 관리</span>
              <span className="ml-auto text-[7px] bg-slate-800/80 text-slate-500 px-1.5 py-0.5 rounded-full uppercase">준비중</span>
            </div>
          </nav>
        </div>

        {/* User Viewer Link */}
        <Link
          href={`/${tenant}/page/1`}
          className="flex items-center justify-center gap-2 py-3 bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 rounded-xl text-xs font-bold text-slate-405 hover:text-white transition-all duration-300"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>주민용 뷰어 바로가기</span>
        </Link>
      </div>

      {/* Main Panel Content */}
      <div className="flex-1 flex flex-col overflow-hidden hidden md:flex">
        {/* Navbar Header */}
        <header className="h-16 border-b border-slate-800/60 flex items-center justify-between px-8 bg-slate-950/20">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-[10px] font-bold text-slate-450 hover:text-white transition-colors uppercase tracking-wider flex items-center gap-1 border border-slate-800 bg-slate-900/60 px-2.5 py-1 rounded-lg hover:bg-slate-800"
            >
              <span>전체 프로젝트 홈</span>
            </Link>
            <span className="text-slate-700">/</span>
            <span className="text-xs font-extrabold text-white">실시간 검수 대시보드</span>
          </div>

          <div className="flex items-center gap-3">
            {isLive ? (
              <span className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[9px] font-extrabold tracking-wide uppercase">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                실시간 Supabase 연동됨
              </span>
            ) : (
              <span className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-[9px] font-extrabold tracking-wide uppercase">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                데모 데이터 연동
              </span>
            )}
            <div className="h-6 w-px bg-slate-800"></div>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full ${theme.bgAccent} border ${theme.borderAccent} flex items-center justify-center text-[10px] font-bold ${theme.textAccent}`}>
                {tenant.substring(0, 2).toUpperCase()}
              </div>
              <span className="text-[11px] font-bold text-slate-300">검수 공무원</span>
            </div>
          </div>
        </header>

        {/* Scrollable layout grid splits 60/40 */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
          {/* Row 1: Key Performance Metrics */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-slate-900/20 border border-slate-800/40 rounded-2xl p-5 space-y-1.5 relative overflow-hidden">
              <div className="text-[9.5px] font-bold text-slate-500 uppercase tracking-wider">이번 호수 주민 조회수</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">1,240회</span>
                <span className="text-[9.5px] font-bold text-emerald-400 flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" /> +12.5%
                </span>
              </div>
            </div>

            <div className="bg-slate-900/20 border border-slate-800/40 rounded-2xl p-5 space-y-1.5 relative overflow-hidden">
              <div className="text-[9.5px] font-bold text-slate-500 uppercase tracking-wider">평균 체류 시간</div>
              <div className="text-2xl font-black text-white">2분 45초</div>
            </div>

            <div className="bg-slate-900/20 border border-slate-800/40 rounded-2xl p-5 space-y-1.5 relative overflow-hidden">
              <div className="text-[9.5px] font-bold text-slate-500 uppercase tracking-wider">발행 승인 상태</div>
              <div>
                {status === "APPROVED" ? (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                    APPROVED (발행 완료)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-xs font-bold">
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></span>
                    PENDING (검수 중)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Row 2: Widescreen Split Screen (60% / 40%) */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left Column (60% -> Col span 3): Charts and Checklist */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Performance charts card */}
              <div className="bg-slate-900/20 border border-slate-800/40 rounded-2xl p-6 space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800/60">
                  <BarChart3 className={`w-4.5 h-4.5 ${theme.textAccent}`} />
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
                    주민 조회 활성 트렌드 및 유입 경로 리포트
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  {/* Daily stats trends (W-3/5) */}
                  <div className="md:col-span-3 space-y-3">
                    <h4 className="text-[10.5px] font-bold text-slate-400">일일 조회 추이 (최근 7일)</h4>
                    <div className="h-32 flex items-end justify-between px-2 pt-2 relative">
                      {[35, 50, 42, 60, 80, 95, 75].map((val, idx) => (
                        <div key={idx} className="flex flex-col items-center flex-1 group z-10">
                          <div className="w-6 rounded-t-md relative overflow-hidden transition-all duration-300" style={{ height: `${val}%` }}>
                            <div className={`absolute inset-0 ${theme.barColor} opacity-80 group-hover:opacity-100`}></div>
                          </div>
                          <span className="text-[9px] text-slate-500 font-bold mt-1.5">{["월", "화", "수", "목", "금", "토", "일"][idx]}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Referral channel distributions (W-2/5) */}
                  <div className="md:col-span-2 space-y-3.5 border-t md:border-t-0 md:border-l border-slate-800/60 pt-4 md:pt-0 md:pl-6">
                    <h4 className="text-[10.5px] font-bold text-slate-400">유입 경로 비율</h4>
                    
                    <div className="space-y-2.5">
                      {/* Channel 1 */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-semibold text-slate-350">
                          <span className="flex items-center gap-1"><Share2 className="w-3 h-3 text-orange-400" /> 카카오톡 공유</span>
                          <span>65%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                          <div className={`h-full ${theme.barColor} rounded-full`} style={{ width: "65%" }}></div>
                        </div>
                      </div>

                      {/* Channel 2 */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-semibold text-slate-350">
                          <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" /> 문자알림 서비스</span>
                          <span>20%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                          <div className="h-full bg-slate-600 rounded-full" style={{ width: "20%" }}></div>
                        </div>
                      </div>

                      {/* Channel 3 */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-semibold text-slate-350">
                          <span className="flex items-center gap-1"><Compass className="w-3 h-3 text-slate-450" /> 직접 유입 및 QR</span>
                          <span>15%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                          <div className="h-full bg-slate-700 rounded-full" style={{ width: "15%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checklist panel and Approve button */}
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 space-y-6 shadow-xl relative overflow-hidden">
                <div className={`absolute -top-12 -right-12 w-24 h-24 ${theme.glowAccent} rounded-full blur-2xl`}></div>

                {status !== "APPROVED" ? (
                  <>
                    <div className="space-y-1 pb-2 border-b border-slate-800/80">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                        <span>원천 소스 검수 체크리스트 (4대 필수 항목)</span>
                      </h3>
                      <p className="text-[10px] text-slate-500">
                        담당 공무원은 우측 스마트폰 시뮬레이터를 조작하며 아래 항목들을 모두 확인해 주십시오.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {checklistItems.map((item) => {
                        const checked = checkedItems[item.id];
                        return (
                          <button
                            key={item.id}
                            type="button"
                            disabled={status !== "PENDING"}
                            onClick={() => toggleCheck(item.id)}
                            className="flex items-start gap-3 text-left w-full group p-3 bg-slate-950/40 border border-slate-800/50 rounded-xl transition-all duration-300 hover:bg-slate-900/60 hover:border-slate-800 active:scale-[0.99] disabled:opacity-75 disabled:active:scale-100 shadow-sm"
                          >
                            <div className={`w-4.5 h-4.5 mt-0.5 flex-shrink-0 rounded-md border flex items-center justify-center transition-all ${
                              checked
                                ? `${theme.checkboxColor} ${theme.bgAccent} ${theme.borderAccent} border-current scale-105`
                                : "border-slate-700 text-transparent"
                            }`}>
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                            <span className={`text-[10.5px] leading-snug font-semibold transition-colors ${
                              checked ? "text-slate-200" : "text-slate-400 group-hover:text-slate-350"
                            }`}>
                              {item.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        disabled={!allChecked || status !== "PENDING"}
                        onClick={handleApprove}
                        className={`w-full py-3.5 text-white text-xs font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                          allChecked && status === "PENDING"
                            ? `${theme.buttonBg} ${theme.buttonHoverBg} hover:scale-[1.01] active:scale-95 cursor-pointer`
                            : "bg-slate-800 border border-slate-800/80 text-slate-500 cursor-not-allowed"
                        }`}
                      >
                        {status === "APPROVING" ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>최종 발행 승인 처리 중...</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4 stroke-[3.5]" />
                            <span>최종 발행 승인</span>
                          </>
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  /* Success layout */
                  <div className="text-center space-y-4 py-3 animate-fade-in relative z-10">
                    <div className="flex justify-center">
                      <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-450 animate-bounce-slow">
                        <CheckCircle className="w-7 h-7" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-extrabold text-white">모바일 소식지 최종 발행 완료</h3>
                      <p className="text-[10.5px] text-slate-400 leading-relaxed max-w-[320px] mx-auto">
                        검수가 통과되어 status가 <span className="text-emerald-450 font-bold">APPROVED</span> 상태로 활성화되었습니다. 이제 주민들이 스마트폰 기기에서 실시간으로 읽을 수 있습니다.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column (40% -> Col span 2): Smartphone Simulator Mockup */}
            <div className="lg:col-span-2 flex justify-center items-start">
              <div className="relative w-full max-w-[310px] h-[630px] bg-slate-950 rounded-[40px] shadow-2xl border-[6px] border-slate-900 overflow-hidden flex flex-col select-none">
                
                {/* Phone Simulator Notch */}
                <div className="flex justify-between items-center px-6 pt-3 pb-1 bg-slate-950 text-slate-500 text-[9px] font-bold z-50">
                  <span>9:41</span>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-4.5 bg-slate-900 rounded-b-xl flex items-center justify-center">
                    <div className="w-8 h-0.5 bg-slate-950 rounded-full mr-2"></div>
                    <div className="w-1.5 h-1.5 bg-slate-950 rounded-full border border-slate-800"></div>
                  </div>
                  <div className="flex items-center gap-1">
                    {/* Simulated signals */}
                    <span className="w-1 h-2 bg-slate-500 rounded-2xs inline-block"></span>
                    <span className="w-1.5 h-2 bg-slate-500 rounded-2xs inline-block"></span>
                    <span className="w-2 h-2 bg-slate-500 rounded-2xs inline-block"></span>
                  </div>
                </div>

                {/* Simulator Display Screen content */}
                <div className="flex-1 flex flex-col overflow-hidden relative bg-[#0b0f19] px-3.5 pt-3.5 space-y-3 pb-24">
                  {/* Miniature top title banner */}
                  <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
                    <div className="flex items-center gap-1 text-[8px] font-bold text-slate-500">
                      <Clock className={`w-2.5 h-2.5 ${theme.textAccent}`} />
                      <span>{previewActivePage.newsletters?.description || "Issue #4 · 2026"}</span>
                    </div>
                    <span className="text-[7.5px] bg-slate-800/80 border border-slate-800 text-slate-400 px-1.5 py-0.2 rounded-full uppercase font-extrabold tracking-wider">
                      Simulator
                    </span>
                  </div>

                  {/* Dynamic Page Container */}
                  <div key={previewPage} className="space-y-3.5 animate-fade-in flex-1 overflow-y-auto no-scrollbar pb-12">
                    <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-3.5 space-y-1.5 relative overflow-hidden group">
                      <div className={`absolute -top-8 -right-8 w-16 h-16 ${theme.glowAccent} rounded-full blur-xl`}></div>
                      
                      <div className="flex items-center gap-1.5">
                        <span className={`px-1.5 py-0.2 rounded-full text-[7.5px] font-extrabold ${theme.bgAccent} ${theme.textAccent} border ${theme.borderAccent} uppercase tracking-wider`}>
                          {previewActivePage.category}
                        </span>
                      </div>
                      <h1 className="text-[11.5px] font-black text-white leading-snug">
                        {previewActivePage.title}
                      </h1>
                    </div>

                    <div className="space-y-2.5 px-0.5">
                      {previewActivePage.page_contents.map((content) => {
                        const lines = content.body.split("\n");
                        const isBulletList = lines.some((l) => l.trim().startsWith("•") || l.trim().startsWith("-"));

                        if (isBulletList) {
                          return (
                            <div key={content.id} className="bg-slate-900/20 border border-slate-800/40 rounded-xl p-3 space-y-1 shadow-inner">
                              {lines.map((line, idx) => {
                                const clean = line.trim();
                                if (clean.startsWith("•") || clean.startsWith("-")) {
                                  return (
                                    <div key={idx} className="flex items-start gap-1.5 text-[9.5px] text-slate-300 leading-relaxed">
                                      <span className={`${theme.textAccent} font-bold`}>{clean.charAt(0)}</span>
                                      <span>{clean.substring(1).trim()}</span>
                                    </div>
                                  );
                                }
                                return <p key={idx} className="text-[9.5px] text-slate-405 leading-relaxed">{clean}</p>;
                              })}
                            </div>
                          );
                        }

                        return (
                          <p key={content.id} className={`text-[9.5px] text-slate-300 leading-relaxed text-justify border-l border-slate-750 pl-2.5 py-0.2`}>
                            {content.body}
                          </p>
                        );
                      })}
                    </div>
                  </div>

                  {/* Local Pagination Bar inside phone mockup */}
                  <div className="absolute bottom-16 left-3 right-3 h-9 glassmorphism rounded-lg flex items-center justify-between px-3 z-30 shadow-md">
                    <button
                      type="button"
                      disabled={previewPage === 1}
                      onClick={() => setPreviewPage((p) => Math.max(1, p - 1))}
                      className="text-[9.5px] font-extrabold text-slate-450 hover:text-white disabled:opacity-30 disabled:hover:text-slate-450 transition-colors flex items-center"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Prev</span>
                    </button>
                    <span className="text-[9px] text-slate-400 font-bold tracking-wider">
                      {previewPage} / {totalPages}
                    </span>
                    <button
                      type="button"
                      disabled={previewPage === totalPages}
                      onClick={() => setPreviewPage((p) => Math.min(totalPages, p + 1))}
                      className="text-[9.5px] font-extrabold text-slate-450 hover:text-white disabled:opacity-30 disabled:hover:text-slate-450 transition-colors flex items-center"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Bottom Home Indicator Bar mockup */}
                  <div className="absolute bottom-0 left-0 right-0 h-4 bg-slate-950 flex justify-center items-center select-none z-50">
                    <div className="w-20 h-0.5 bg-slate-750 rounded-full opacity-60"></div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* MOBILE LAYOUT (Visible on mobile/small viewports)   */}
      {/* ---------------------------------------------------- */}
      <div className="flex-1 flex flex-col overflow-hidden pb-36 md:hidden">
        {/* Header Back & Badge Row */}
        <div className="px-4 pt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              href={`/${tenant}/page/1`}
              className="flex items-center gap-0.5 text-[10px] font-bold text-slate-450 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>뷰어</span>
            </Link>
            <span className="text-slate-700">|</span>
            <Link
              href="/"
              className="text-[10px] font-bold text-slate-450 hover:text-white transition-colors"
            >
              <span>마스터 홈</span>
            </Link>
          </div>

          {status === "APPROVED" ? (
            <span className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wide uppercase">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              발행 승인 완료
            </span>
          ) : (
            <span className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wide uppercase">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></span>
              발행 검수 중
            </span>
          )}
        </div>

        {/* Dashboard Title */}
        <div className="px-4 pt-4 space-y-0.5">
          <h1 className="text-lg font-extrabold text-white flex items-center gap-2">
            <ClipboardCheck className={`w-5 h-5 ${theme.textAccent}`} />
            <span>실시간 검수 패널</span>
          </h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
            {activePage.newsletters?.title || "소식지"} · {tenant.toUpperCase()}
          </p>
        </div>

        {/* Mini Preview Box */}
        <div className="px-4 pt-4">
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-4 space-y-2 relative overflow-hidden group shadow-lg">
            <div className={`absolute -top-10 -right-10 w-20 h-20 ${theme.glowAccent} rounded-full blur-xl transition-all`}></div>
            
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800/60">
              <Eye className={`w-4 h-4 ${theme.textAccent}`} />
              <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-350">
                대상 소식지 원천 정보
              </h3>
            </div>

            <div className="space-y-1 pt-1">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.2 rounded-full text-[8px] font-extrabold ${theme.bgAccent} ${theme.textAccent} border ${theme.borderAccent} uppercase tracking-wider`}>
                  {activePage.category}
                </span>
                <span className="text-[9px] font-semibold text-slate-500">
                  {activePage.newsletters?.description || "소식지 설명"}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-200 line-clamp-1">
                {activePage.title}
              </h4>
              <p className="text-[10.5px] text-slate-400 line-clamp-2 leading-relaxed">
                {activePage.page_contents[0]?.body || "내용이 존재하지 않습니다."}
              </p>
            </div>
          </div>
        </div>

        {/* Checklist Container */}
        <div className="flex-1 overflow-y-auto px-4 pt-4 space-y-4 no-scrollbar">
          {status !== "APPROVED" ? (
            <div className="space-y-3 pb-8">
              <div className="flex items-center gap-2 pl-0.5">
                <FileText className={`w-4 h-4 ${theme.textAccent}`} />
                <h3 className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400">
                  원천 소스 검수 체크리스트
                </h3>
              </div>

              <div className="space-y-2">
                {checklistItems.map((item) => {
                  const checked = checkedItems[item.id];
                  return (
                    <button
                      key={item.id}
                      type="button"
                      disabled={status !== "PENDING"}
                      onClick={() => toggleCheck(item.id)}
                      className="flex items-start gap-3.5 text-left w-full group p-3.5 bg-slate-900/20 border border-slate-800/40 rounded-2xl transition-all duration-300 hover:bg-slate-900/50 hover:border-slate-800/80 active:scale-[0.99] disabled:opacity-70 disabled:active:scale-100 shadow-sm"
                    >
                      <div className={`w-5 h-5 flex-shrink-0 rounded-md border flex items-center justify-center transition-all ${
                        checked
                          ? `${theme.checkboxColor} ${theme.bgAccent} ${theme.borderAccent} border-current scale-105`
                          : "border-slate-700 text-transparent"
                      }`}>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span className={`text-[11px] leading-snug font-medium transition-colors ${
                        checked ? "text-slate-100" : "text-slate-400 group-hover:text-slate-305"
                      }`}>
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Approval Trigger Button */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={!allChecked || status !== "PENDING"}
                  onClick={handleApprove}
                  className={`w-full py-3 text-white text-xs font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                    allChecked && status === "PENDING"
                      ? `${theme.buttonBg} ${theme.buttonHoverBg} hover:scale-[1.02] active:scale-95 cursor-pointer`
                      : "bg-slate-800 border border-slate-800 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  {status === "APPROVING" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>발행 상태 업데이트 중...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 stroke-[3.5]" />
                      <span>최종 발행 승인</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Success Approved Card */
            <div className="bg-slate-900/30 border border-emerald-500/20 rounded-2xl p-6 text-center space-y-4 animate-fade-in shadow-xl shadow-emerald-950/5 relative overflow-hidden">
              <div className="absolute inset-0 bg-emerald-500/[0.02] animate-pulse"></div>

              <div className="flex justify-center">
                <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center animate-bounce-slow text-emerald-400">
                  <CheckCircle className="w-8 h-8" />
                </div>
              </div>

              <div className="space-y-1.5 relative z-10">
                <h3 className="text-sm font-extrabold text-white">발행이 승인되었습니다!</h3>
                <p className="text-[11px] text-slate-450 leading-relaxed max-w-[240px] mx-auto">
                  검수 승인 처리가 완료되어, 원천 소스 상태값이 <span className="text-emerald-400 font-bold">APPROVED</span> 상태로 활성화되었습니다.
                </p>
              </div>

              <div className="pt-2 relative z-10">
                <Link
                  href={`/${tenant}/page/1`}
                  className={`inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-white text-[11px] font-extrabold tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 ${theme.buttonBg} ${theme.buttonHoverBg}`}
                >
                  <span>소식지 뷰어로 이동</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        <BottomNav />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
        대시보드 로딩 중...
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
