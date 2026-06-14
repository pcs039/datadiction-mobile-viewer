"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Newspaper, Archive, Settings } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Viewer",
      href: "/",
      icon: Newspaper,
      activePattern: /^\/$/,
    },
    {
      label: "Archive",
      href: "#",
      icon: Archive,
      activePattern: /^\/archive/,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
      activePattern: /^\/settings/,
    },
  ];

  const isActive = (item: typeof navItems[0]) => {
    if (item.activePattern) {
      return item.activePattern.test(pathname);
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
                ? "text-orange-400 bg-orange-500/10 scale-105"
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
