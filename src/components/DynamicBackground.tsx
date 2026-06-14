"use client";

import { usePathname } from "next/navigation";

export default function DynamicBackground() {
  const pathname = usePathname();
  
  // Extract municipalityId from pathname (e.g. /wando/page/1 -> wando, /jindo/settings -> jindo)
  const match = pathname.match(/^\/([^\/]+)/);
  const municipalityId = match ? match[1].toLowerCase() : "haenam";

  // Select glow sphere colors based on municipalityId
  let glowClasses = {
    top: "bg-orange-600/10",
    bottom: "bg-amber-600/10",
  };

  if (municipalityId === "wando") {
    glowClasses = {
      top: "bg-emerald-600/10",
      bottom: "bg-green-600/10",
    };
  } else if (municipalityId === "jindo") {
    glowClasses = {
      top: "bg-sky-600/10",
      bottom: "bg-blue-600/10",
    };
  }

  return (
    <>
      <div className={`absolute top-[10%] left-[20%] w-[350px] h-[350px] ${glowClasses.top} rounded-full blur-[100px] select-none pointer-events-none animate-pulse-slow transition-all duration-1000`}></div>
      <div className={`absolute bottom-[10%] right-[20%] w-[450px] h-[450px] ${glowClasses.bottom} rounded-full blur-[120px] select-none pointer-events-none animate-pulse-slow transition-all duration-1000`} style={{ animationDelay: '1.5s' }}></div>
    </>
  );
}
