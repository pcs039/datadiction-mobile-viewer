import React from "react";

interface MobileContainerProps {
  children: React.ReactNode;
}

export default function MobileContainer({ children }: MobileContainerProps) {
  return (
    // md+ screens: max-w-md h-[840px] md:h-[880px] rounded-[48px] border-8 border-slate-900 shadow-2xl
    // Mobile screens: w-full h-full rounded-none border-0 shadow-none (native fullscreen view)
    <div className="relative w-full h-full md:max-w-md md:h-[840px] lg:h-[880px] bg-slate-950 md:rounded-[48px] md:shadow-2xl md:border-8 md:border-slate-900 overflow-hidden flex flex-col transition-all duration-300">
      
      {/* Phone Notch & Status Bar (Simulated) - Hidden on mobile screens to save viewport space */}
      <div className="hidden md:flex justify-between items-center px-8 pt-4 pb-2 bg-slate-950 text-slate-400 text-xs font-semibold select-none z-50">
        <span>9:41</span>
        {/* Dynamic Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-6 bg-slate-900 rounded-b-2xl flex items-center justify-center">
          <div className="w-12 h-1 bg-slate-950 rounded-full mr-4"></div>
          <div className="w-2.5 h-2.5 bg-slate-950 rounded-full border border-slate-800"></div>
        </div>
        <div className="flex items-center gap-1.5">
          {/* Signal Icon */}
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M2 22h20V2zM18 20V8.83l2-2V20zM14 20v-8h2v8zm-4 0v-5h2v5zm-4 0v-2h2v2z" />
          </svg>
          {/* Wifi Icon */}
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 21l-12-12c6.627-6.627 17.373-6.627 24 0l-12 12zm0-16.71c-4.97 0-9 4.03-9 9l9 9 9-9c0-4.97-4.03-9-9-9z" />
          </svg>
          {/* Battery Icon */}
          <div className="w-5 h-2.5 border border-slate-400 rounded-sm p-0.5 flex items-center">
            <div className="h-full w-3.5 bg-slate-400 rounded-2xs"></div>
          </div>
        </div>
      </div>

      {/* Screen Content Wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden relative bg-[#0b0f19]">
        {children}
      </div>

      {/* Bottom Safe Area Home Indicator - Hidden on mobile screens to allow edge-to-edge layout */}
      <div className="hidden md:flex h-6 bg-slate-950 justify-center items-center select-none z-50">
        <div className="w-28 h-1 bg-slate-700 rounded-full opacity-60"></div>
      </div>
    </div>
  );
}
