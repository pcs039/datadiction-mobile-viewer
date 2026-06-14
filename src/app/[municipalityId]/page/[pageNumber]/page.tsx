"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchNewsletterPages } from "@/lib/supabase";
import { SubPage, mockNewsletterPages } from "@/lib/newsletterData";
import SupabaseBanner from "@/components/SupabaseBanner";
import BottomNav from "@/components/BottomNav";
import { ChevronLeft, ChevronRight, Clock, AlertCircle } from "lucide-react";

interface ThemeClasses {
  textAccent: string;
  bgAccent: string;
  borderAccent: string;
  borderLAccent: string;
  glowAccent: string;
  loadingSpinner: string;
  bulletAccent: string;
  buttonColor: string;
}

const themeMap: Record<string, ThemeClasses> = {
  haenam: {
    textAccent: "text-orange-400",
    bgAccent: "bg-orange-500/10",
    borderAccent: "border-orange-500/20",
    borderLAccent: "border-orange-500/40",
    glowAccent: "bg-orange-500/5 group-hover:bg-orange-500/10",
    loadingSpinner: "border-orange-500",
    bulletAccent: "text-orange-400",
    buttonColor: "text-orange-400 hover:text-orange-300",
  },
  wando: {
    textAccent: "text-emerald-400",
    bgAccent: "bg-emerald-500/10",
    borderAccent: "border-emerald-500/20",
    borderLAccent: "border-emerald-500/40",
    glowAccent: "bg-emerald-500/5 group-hover:bg-emerald-500/10",
    loadingSpinner: "border-emerald-500",
    bulletAccent: "text-emerald-400",
    buttonColor: "text-emerald-400 hover:text-emerald-300",
  },
  jindo: {
    textAccent: "text-sky-400",
    bgAccent: "bg-sky-500/10",
    borderAccent: "border-sky-500/20",
    borderLAccent: "border-sky-500/40",
    glowAccent: "bg-sky-500/5 group-hover:bg-sky-500/10",
    loadingSpinner: "border-sky-500",
    bulletAccent: "text-sky-400",
    buttonColor: "text-sky-400 hover:text-sky-300",
  },
};

function NewsletterViewerContent() {
  const params = useParams();
  const municipalityId = (params?.municipalityId as string) || "haenam";
  const pageNumberStr = (params?.pageNumber as string) || "1";
  
  const tenant = municipalityId.toLowerCase();
  const currentPage = parseInt(pageNumberStr, 10) || 1;
  const theme = themeMap[tenant] || themeMap.haenam;

  const [pages, setPages] = useState<SubPage[]>([]);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
      try {
        const liveData = await fetchNewsletterPages(tenant);
        if (liveData && liveData.length > 0) {
          setPages(liveData);
          setIsLive(true);
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

  const totalPages = pages.length;
  // Try to find the page with the exact page_number, fallback to pages[0]
  const activePage = pages.find((p) => p.page_number === currentPage) || pages[0];

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center text-slate-400 space-y-3 pb-24">
        <div className={`w-8 h-8 border-4 border-t-transparent rounded-full animate-spin ${theme.loadingSpinner}`}></div>
        <p className="text-xs font-semibold tracking-wider">소식지 데이터를 불러오는 중...</p>
      </div>
    );
  }

  if (!activePage) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center text-slate-400 space-y-2 pb-24 px-6 text-center">
        <AlertCircle className={`w-12 h-12 ${theme.textAccent}`} />
        <p className="font-semibold text-sm">소식지 페이지를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden pb-36">
      {/* Top Banner indicating connection state */}
      <SupabaseBanner />

      {/* Main Content Area (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 space-y-4 no-scrollbar">
        {/* Status indicator row */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 tracking-wide uppercase">
            <Clock className={`w-3.5 h-3.5 ${theme.textAccent}`} />
            <span>
              {activePage.newsletters?.description && activePage.newsletters.description.includes("·") 
                ? activePage.newsletters.description 
                : `Issue #4 · 2026-06-14`}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {isLive ? (
              <span className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wide uppercase">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                실시간
              </span>
            ) : (
              <span className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wide uppercase">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                데모
              </span>
            )}
            <Link
              href={`/${tenant}/dashboard`}
              className={`flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800/80 px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wide uppercase transition-all duration-300 hover:scale-105 active:scale-95`}
            >
              검수 패널
            </Link>
          </div>
        </div>

        {/* Transition wrapper keyed by page number */}
        <div key={currentPage} className="space-y-5 animate-fade-in">
          {/* Category & Title Header Card */}
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-3xl p-5 space-y-2.5 shadow-xl relative overflow-hidden group">
            {/* Subtle glow background */}
            <div className={`absolute -top-12 -right-12 w-24 h-24 ${theme.glowAccent} rounded-full blur-2xl transition-all`}></div>

            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${theme.bgAccent} ${theme.textAccent} border ${theme.borderAccent} uppercase tracking-wider`}>
                {activePage.category}
              </span>
              <span className="text-[10px] font-medium text-slate-500">
                {activePage.newsletters?.title || "DataDiction Tech Weekly"}
              </span>
            </div>
            <h1 className="text-lg font-extrabold text-white leading-snug tracking-tight">
              {activePage.title}
            </h1>
          </div>

          {/* Body contents list */}
          <div className="space-y-4 px-1">
            {activePage.page_contents.map((content) => {
              // Check if body content represents bullet list items
              const lines = content.body.split("\n");
              const isBulletList = lines.some((line) => line.trim().startsWith("•") || line.trim().startsWith("-"));

              if (isBulletList) {
                return (
                  <div
                    key={content.id}
                    className="bg-slate-900/20 border border-slate-800/40 rounded-2xl p-4.5 space-y-2 shadow-inner"
                  >
                    {lines.map((line, idx) => {
                      const cleanLine = line.trim();
                      if (cleanLine.startsWith("•") || cleanLine.startsWith("-")) {
                        const marker = cleanLine.charAt(0);
                        return (
                          <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed font-normal">
                            <span className={`${theme.bulletAccent} font-bold mt-1`}>{marker}</span>
                            <span>{cleanLine.substring(1).trim()}</span>
                          </div>
                        );
                      }
                      return (
                        <p key={idx} className="text-xs text-slate-400 font-medium leading-relaxed pb-1.5">
                          {cleanLine}
                        </p>
                      );
                    })}
                  </div>
                );
              }

              return (
                <p
                  key={content.id}
                  className={`text-xs text-slate-300 font-normal leading-relaxed text-justify border-l-2 ${theme.borderLAccent} pl-3.5 py-0.5`}
                >
                  {content.body}
                </p>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Bottom Page Pagination Bar */}
      <div className="absolute bottom-22 left-4 right-4 h-12 glassmorphism rounded-xl flex items-center justify-between px-4 z-35 shadow-lg">
        {hasPrev ? (
          <Link
            href={`/${tenant}/page/${currentPage - 1}`}
            className={`flex items-center gap-1.5 text-xs font-semibold ${theme.buttonColor} transition-colors`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </Link>
        ) : (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 opacity-40 select-none">
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </div>
        )}
        
        <span className="text-xs text-slate-400 font-bold tracking-wider">
          {currentPage} / {totalPages || 1}
        </span>
        
        {hasNext ? (
          <Link
            href={`/${tenant}/page/${currentPage + 1}`}
            className={`flex items-center gap-1.5 text-xs font-semibold ${theme.buttonColor} transition-colors`}
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 opacity-40 select-none">
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Floating bottom main navigation */}
      <BottomNav />
    </div>
  );
}

export default function NewsletterViewerPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
        소식지 로딩 중...
      </div>
    }>
      <NewsletterViewerContent />
    </Suspense>
  );
}
