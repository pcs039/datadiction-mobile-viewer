"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { isSupabaseConfigured, createNewsletterPage } from "@/lib/supabase";
import { 
  FileEdit, 
  ChevronLeft, 
  Save, 
  Loader2, 
  HelpCircle,
  Database,
  Link2,
  MapPin,
  FileCheck,
  Building2,
  Calendar,
  Layers,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

interface ThemeClasses {
  textAccent: string;
  focusAccent: string;
  buttonBg: string;
  glowAccent: string;
}

const themeMap: Record<string, ThemeClasses> = {
  haenam: {
    textAccent: "text-orange-400",
    focusAccent: "focus:border-orange-500",
    buttonBg: "bg-orange-600 hover:bg-orange-500 shadow-orange-600/15",
    glowAccent: "bg-orange-500/5",
  },
  wando: {
    textAccent: "text-emerald-400",
    focusAccent: "focus:border-emerald-500",
    buttonBg: "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/15",
    glowAccent: "bg-emerald-500/5",
  },
  jindo: {
    textAccent: "text-sky-400",
    focusAccent: "focus:border-sky-500",
    buttonBg: "bg-sky-600 hover:bg-sky-500 shadow-sky-600/15",
    glowAccent: "bg-sky-500/5",
  },
};

export default function CmsEditorPage() {
  const [envConfigured, setEnvConfigured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Form states
  const [municipalityId, setMunicipalityId] = useState("haenam");
  const [issueNumber, setIssueNumber] = useState("해남군 소식지 Issue #5");
  const [publishDate, setPublishDate] = useState("2026-06-14");
  const [pageNumber, setPageNumber] = useState("6");
  const [category, setCategory] = useState("군정소식");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [attractionName, setAttractionName] = useState("");
  const [attractionPhone, setAttractionPhone] = useState("");

  const theme = themeMap[municipalityId] || themeMap.haenam;

  useEffect(() => {
    setEnvConfigured(isSupabaseConfigured);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() === "" || body.trim() === "") {
      setErrorMsg("소식지 페이지 제목과 본문 내용은 필수로 입력해야 합니다.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    const pageData = {
      municipalityId,
      issueNumber,
      publishDate,
      pageNumber: parseInt(pageNumber, 10) || 1,
      category,
      title,
      body,
      youtubeUrl,
      attractionName,
      attractionPhone
    };

    try {
      let insertedReal = false;
      if (envConfigured) {
        insertedReal = await createNewsletterPage(pageData);
      }

      if (insertedReal) {
        setSuccessMsg("✓ 데이터가 Supabase 실시간 DB에 성공적으로 적재되었습니다. [검수 대시보드] 및 [뷰어]에서 즉시 확인 가능합니다.");
      } else {
        // Fallback to LocalStorage mock database
        const localPageId = `local-page-${Math.random().toString(36).substring(2, 9)}`;
        const localNewsletterId = `local-news-${Math.random().toString(36).substring(2, 9)}`;

        const nameMap: Record<string, string> = {
          haenam: '해남군',
          wando: '완도군',
          jindo: '진도군'
        };
        const dbName = nameMap[municipalityId.toLowerCase()] || '해남군';

        const pageContents = [];
        let sortOrder = 1;
        
        // Add main body split by paragraph break
        const paragraphs = body.split('\n\n').filter(p => p.trim() !== '');
        paragraphs.forEach(p => {
          pageContents.push({
            id: `local-c-${Math.random().toString(36).substring(2, 7)}`,
            sub_page_id: localPageId,
            body: p.trim(),
            sort_order: sortOrder++
          });
        });

        // Youtube bullet list
        if (youtubeUrl && youtubeUrl.trim() !== '') {
          pageContents.push({
            id: `local-c-${Math.random().toString(36).substring(2, 7)}`,
            sub_page_id: localPageId,
            body: `기관 공식 유튜브 동영상 링크:\n• 동영상: ${youtubeUrl.trim()}`,
            sort_order: sortOrder++
          });
        }

        // Attraction bullet list
        if (attractionName && attractionName.trim() !== '') {
          const phoneText = attractionPhone ? `\n• 연락처: ${attractionPhone.trim()}` : '';
          pageContents.push({
            id: `local-c-${Math.random().toString(36).substring(2, 7)}`,
            sub_page_id: localPageId,
            body: `지역 추천 관광 명소 가이드:\n• 명소: ${attractionName.trim()}${phoneText}`,
            sort_order: sortOrder++
          });
        }

        const localPageObj = {
          id: localPageId,
          newsletter_id: localNewsletterId,
          title,
          page_number: parseInt(pageNumber, 10) || 1,
          category,
          municipality_slug: municipalityId.toLowerCase(),
          created_at: new Date().toISOString(),
          newsletters: {
            id: localNewsletterId,
            title: dbName,
            description: `${issueNumber} · ${publishDate}`
          },
          page_contents: pageContents
        };

        // Retrieve existing mock pages from LocalStorage, append and save
        const storedKey = `local_custom_pages_${municipalityId.toLowerCase()}`;
        const existingStr = localStorage.getItem(storedKey) || "[]";
        const existingPages = JSON.parse(existingStr);
        existingPages.push(localPageObj);
        localStorage.setItem(storedKey, JSON.stringify(existingPages));

        setSuccessMsg("✓ 데모 모드가 활성화되어 로컬 브라우저 저장소(LocalStorage)에 적재 완료되었습니다. [검수 대시보드] 및 [뷰어]에서 즉시 테스트가 가능합니다.");
      }

      // Reset mutable input forms
      setTitle("");
      setBody("");
      setYoutubeUrl("");
      setAttractionName("");
      setAttractionPhone("");
      
      // Auto clear message after 5 seconds
      setTimeout(() => {
        setSuccessMsg("");
      }, 5000);

    } catch (err) {
      console.error(err);
      setErrorMsg("입력 값을 저장하는 동안 에러가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#060814] text-slate-200 overflow-y-auto no-scrollbar pb-16">
      
      {/* Top navbar */}
      <div className="w-full bg-slate-900/40 border-b border-slate-800/60 px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>마스터 홈</span>
          </Link>
          <span className="text-slate-700">/</span>
          <FileEdit className={`w-4.5 h-4.5 ${theme.textAccent}`} />
          <h1 className="text-sm font-black text-white tracking-wider">새 소식지 입력기 (CMS)</h1>
        </div>

        <div className="flex items-center gap-3">
          {envConfigured ? (
            <span className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[9px] font-extrabold tracking-wide uppercase">
              <Database className="w-3.5 h-3.5" />
              Real-time Database
            </span>
          ) : (
            <span className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-[9px] font-extrabold tracking-wide uppercase">
              <Database className="w-3.5 h-3.5" />
              Local Mock Storage
            </span>
          )}
        </div>
      </div>

      {/* Editor Main Content Area */}
      <div className="max-w-4xl w-full mx-auto px-8 pt-8 space-y-6">
        
        {/* Title Description */}
        <div className="space-y-1">
          <h2 className="text-base font-extrabold text-white">소식지 콘텐츠 적재 시스템 (Headless CMS)</h2>
          <p className="text-xs text-slate-450">SQL 쿼리나 파일 수정 없이 UI 폼 입력만으로 소식지 본문 텍스트와 비디오/지도 위젯 데이터를 손쉽게 적재합니다.</p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSave} className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6.5 space-y-6 shadow-xl relative overflow-hidden">
          {/* Card glow */}
          <div className={`absolute -top-12 -right-12 w-24 h-24 ${theme.glowAccent} rounded-full blur-2xl`}></div>

          {/* Section 1: Municipality & Issue details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-1.5 border-b border-slate-800/80">
              <Building2 className={`w-4 h-4 ${theme.textAccent}`} />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                지자체 및 발행 정보
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Dropdown select */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">대상 지자체</label>
                <select
                  value={municipalityId}
                  onChange={(e) => setMunicipalityId(e.target.value)}
                  className={`w-full bg-slate-950 border border-slate-800 text-xs rounded-xl py-2.5 px-3.5 text-slate-200 focus:outline-none ${theme.focusAccent} transition-colors`}
                >
                  <option value="haenam">해남군 (Haenam)</option>
                  <option value="wando">완도군 (Wando)</option>
                  <option value="jindo">진도군 (Jindo)</option>
                </select>
              </div>

              {/* Issue Number */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">발행 호수 명칭</label>
                <input
                  type="text"
                  value={issueNumber}
                  onChange={(e) => setIssueNumber(e.target.value)}
                  placeholder="예: 해남군 소식지 Issue #5"
                  className={`w-full bg-slate-950 border border-slate-800 text-xs rounded-xl py-2.5 px-3.5 text-white placeholder-slate-650 focus:outline-none ${theme.focusAccent} transition-colors`}
                />
              </div>

              {/* Publish Date */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">발행 날짜</label>
                <div className="relative">
                  <input
                    type="text"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    placeholder="YYYY-MM-DD"
                    className={`w-full bg-slate-950 border border-slate-800 text-xs rounded-xl py-2.5 px-3.5 text-white placeholder-slate-650 focus:outline-none ${theme.focusAccent} transition-colors`}
                  />
                  <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: SubPage & Category */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-1.5 border-b border-slate-800/80">
              <FileCheck className={`w-4 h-4 ${theme.textAccent}`} />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                페이지 및 본문 정보
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Page Number */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">페이지 번호</label>
                <input
                  type="number"
                  value={pageNumber}
                  onChange={(e) => setPageNumber(e.target.value)}
                  placeholder="6"
                  className={`w-full bg-slate-950 border border-slate-800 text-xs rounded-xl py-2.5 px-3.5 text-white placeholder-slate-650 focus:outline-none ${theme.focusAccent} transition-colors`}
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">카테고리</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="예: 군정소식, 테크정보"
                  className={`w-full bg-slate-950 border border-slate-800 text-xs rounded-xl py-2.5 px-3.5 text-white placeholder-slate-650 focus:outline-none ${theme.focusAccent} transition-colors`}
                />
              </div>

              {/* Title */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">페이지 제목 (Title) *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="예: 완도군, 청정 해양 자원 웰니스 관광객 유치 박차"
                  className={`w-full bg-slate-950 border border-slate-800 text-xs rounded-xl py-2.5 px-3.5 text-white placeholder-slate-650 focus:outline-none ${theme.focusAccent} transition-colors`}
                  required
                />
              </div>
            </div>

            {/* Body TextArea */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span>본문 본문 텍스트 내용 *</span>
                <span className="text-slate-550 font-normal uppercase tracking-normal">줄바꿈을 두 번(double enter) 하면 문단이 분리되어 뷰어에 렌더링됩니다.</span>
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="본문 내용을 입력하세요.&#10;&#10;• 리스트나 불렛으로 정렬하고 싶다면 문단 첫머리에 '•' 나 '-' 표시를 적어주면 뷰어에 테마 총괄 디자인 불렛으로 자동 렌더링됩니다."
                rows={7}
                className={`w-full bg-slate-950 border border-slate-800 text-xs rounded-xl py-3 px-3.5 text-white placeholder-slate-650 focus:outline-none ${theme.focusAccent} transition-colors leading-relaxed`}
                required
              />
            </div>
          </div>

          {/* Section 3: Multimedia expansions */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-1.5 border-b border-slate-800/80">
              <Link2 className={`w-4 h-4 ${theme.textAccent}`} />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                멀티미디어 확장 연동 (선택)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* YouTube Link */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <span>유튜브 비디오 링크</span>
                  <span title="지역 홍보 동영상 주소 연동">
                    <HelpCircle className="w-3.5 h-3.5 text-slate-600" />
                  </span>
                </label>
                <input
                  type="text"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className={`w-full bg-slate-950 border border-slate-800 text-xs rounded-xl py-2.5 px-3.5 text-white placeholder-slate-650 focus:outline-none ${theme.focusAccent} transition-colors`}
                />
              </div>

              {/* Place Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <span>지역 추천 명소/맛집 이름</span>
                  <span title="지도 인터랙션 연동용 명칭">
                    <MapPin className="w-3.5 h-3.5 text-slate-600" />
                  </span>
                </label>
                <input
                  type="text"
                  value={attractionName}
                  onChange={(e) => setAttractionName(e.target.value)}
                  placeholder="예: 해남 명량식당"
                  className={`w-full bg-slate-950 border border-slate-800 text-xs rounded-xl py-2.5 px-3.5 text-white placeholder-slate-650 focus:outline-none ${theme.focusAccent} transition-colors`}
                />
              </div>

              {/* Place Phone */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">명소 연락처</label>
                <input
                  type="text"
                  value={attractionPhone}
                  onChange={(e) => setAttractionPhone(e.target.value)}
                  placeholder="예: 061-530-0000"
                  className={`w-full bg-slate-950 border border-slate-800 text-xs rounded-xl py-2.5 px-3.5 text-white placeholder-slate-650 focus:outline-none ${theme.focusAccent} transition-colors`}
                />
              </div>
            </div>
          </div>

          {/* Messages Alert */}
          {errorMsg && (
            <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-xl text-xs text-red-400 font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 animate-bounce-slow" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Submit Trigger Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 text-white text-xs font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${theme.buttonBg} active:scale-95 disabled:opacity-70 disabled:active:scale-100 cursor-pointer`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>데이터 적재 뮤테이션 실행 중...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>검수 요청하기 (데이터 적재)</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
