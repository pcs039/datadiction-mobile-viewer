"use client";

import { usePathname } from "next/navigation";
import MobileContainer from "./MobileContainer";

interface ResponsiveLayoutWrapperProps {
  children: React.ReactNode;
}

export default function ResponsiveLayoutWrapper({ children }: ResponsiveLayoutWrapperProps) {
  const pathname = usePathname();
  const isWidescreenAdmin = pathname === "/" || pathname.startsWith("/editor") || pathname.includes("/dashboard");

  if (isWidescreenAdmin) {
    // Desktop layout for dashboard fills the screen without any mock containers
    return (
      <div className="w-full h-full flex flex-col text-slate-200 pt-14">
        {children}
      </div>
    );
  }

  // Standard viewer pages wrap inside MobileContainer (simulated phone on desktop, fullscreen on mobile)
  return (
    <div className="w-full h-full flex items-center justify-center p-0 pt-14 md:p-4 md:pt-18">
      <MobileContainer>
        {children}
      </MobileContainer>
    </div>
  );
}
