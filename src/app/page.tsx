"use client";

import { useState, useEffect, Suspense } from "react";
import { fetchNewsletterPages } from "@/lib/supabase";
import { SubPage, mockNewsletterPages } from "@/lib/newsletterData";
import SupabaseBanner from "@/components/SupabaseBanner";
import BottomNav from "@/components/BottomNav";
import { ChevronLeft, ChevronRight, Clock, AlertCircle } from "lucide-react";

function NewsletterViewerContent() {
  const [pages, setPages] = useState<SubPage[]>(mockNewsletterPages);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const liveData = await fetchNewsletterPages();
        if (liveData && liveData.length > 0) {
          setPages(liveData);
          setIsLive(true);
        } else {
          setPages(mockNewsletterPages);
          setIsLive(false);
        }
      } catch (err) {
        console.error("Failed to load newsletter data:", err);
        setPages(mockNewsletterPages);
        setIsLive(false);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const totalPages = pages.length;
  const activePageIndex = Math.max(0, Math.min(currentPage - 1, totalPages - 1));
  const activePage = pages[activePageIndex];

  const handlePrevPage = () => {
    setCurrentPage((p) => Math.max(1, p - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((p) => Math.min(totalPages, p + 1));
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center text-slate-400 space-y-3 pb-24">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold tracking-wider">소식지 데이터를 불러오는 중...</p>
      </div>
    );
  }

  if (!activePage) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center text-slate-400 space-y-2 pb-24 px-6 text-center">
        <AlertCircle className="w-12 h-12 text-orange-500" />
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
            <Clock className="w-3.5 h-3.5 text-orange-400" />
            <span>
              {activePage.newsletters?.description && activePage.newsletters.description.includes("·") 
                ? activePage.newsletters.description 
                : "Issue #4 · 2026-06-14"}
            </span>
          </div>

          {isLive ? (
            <span className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wide uppercase">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
              실시간 Supabase
            </span>
          ) : (
            <span className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wide uppercase">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
              오프라인 데모
            </span>
          )}
        </div>

        {/* Transition wrapper keyed by page number */}
        <div key={currentPage} className="space-y-5 animate-fade-in">
          {/* Category & Title Header Card */}
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-3xl p-5 space-y-2.5 shadow-xl relative overflow-hidden group">
            {/* Subtle glow background */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-all"></div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-500/10 text-orange-400 border border-orange-500/20 uppercase tracking-wider">
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
                            <span className="text-orange-400 font-bold mt-1">{marker}</span>
                            <span>{cleanLine.substring(1).trim()}</span>
                          </div>
                        );
                      }
                      return (
                        <p key={idx} className="text-xs text-slate-450 font-medium leading-relaxed pb-1.5">
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
                  className="text-xs text-slate-305 font-normal leading-relaxed text-justify border-l-2 border-orange-500/40 pl-3.5 py-0.5"
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
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-40 disabled:hover:text-slate-400 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>
        <span className="text-xs text-slate-505 font-bold tracking-wider">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-40 disabled:hover:text-slate-400 transition-colors"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
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
