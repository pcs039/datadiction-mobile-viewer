"use client";

import React from "react";
import MobileContainer from "@/components/MobileContainer";

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full flex items-center justify-center p-0 md:p-4">
      <MobileContainer>
        {children}
      </MobileContainer>
    </div>
  );
}
