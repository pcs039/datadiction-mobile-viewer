"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Newspaper, Archive, Settings } from "lucide-react";

interface ThemeClasses {
  textAccent: string;
  bgAccent: string;
}

const themeMap: Record<string, ThemeClasses> = {
  haenam: {
    textAccent: "text-orange-400",
    bgAccent: "bg-orange-500/10",
  },
  wando: {
    textAccent: "text-emerald-400",
    bgAccent: "bg-emerald-500/10",
  },
  jindo: {
    textAccent: "text-sky-400",
    bgAccent: "bg-sky-500/10",
  },
};

export default function BottomNav() {
  const pathname = usePathname();

  // Extract municipalityId from pathname (e.g., /wando/page/1 -> wando, /wando/settings -> wando)
  const match = pathname.match(/^\/([^\/]+)/);
  const rawSlug = match ? match[1].toLowerCase() : "haenam";
  const currentSlug = (rawSlug !== "settings") ? rawSlug : "haenam";

  const theme = themeMap[currentSlug] || themeMap.haenam;

  const navItems = [
    {
      label: "Viewer",
      href: `/${currentSlug}/page/1`,
      icon: Newspaper,
      activePattern: /^\/([^\/]+)\/page\/\d+$/,
      rootActivePattern: /^\/$/,
    },
    {
      label: "Archive",
      href: "#",
      icon: Archive,
      activePattern: /^\/([^\/]+)\/archive$/,
      rootActivePattern: /^\/archive$/,
    },
    {
      label: "Settings",
      href: `/${currentSlug}/settings`,
      icon: Settings,
      activePattern: /^\/([^\/]+)\/settings$/,
      rootActivePattern: /^\/settings$/,
    },
  ];

  const isActive = (item: typeof navItems[0]) => {
    if (item.activePattern && item.activePattern.test(pathname)) {
      return true;
    }
    if (item.rootActivePattern && item.rootActivePattern.test(pathname)) {
      return true;
    }
    return pathname === item.href;
  };

  return (
    <div className="absolute bottom-4 left-4 right-4 h-16 glassmorphism rounded-2xl flex items-center justify-around px-4 z-40 shadow-xl transition-all duration-300">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item);

        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={(e) => {
              if (item.label === "Archive") {
                e.preventDefault();
                alert("Archive 기능은 준비 중입니다. 현재는 Viewer와 Settings 기능을 이용해 주세요.");
              }
            }}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
              active
                ? `${theme.textAccent} ${theme.bgAccent} scale-105`
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Icon className="w-5.5 h-5.5 transition-transform duration-300" />
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
