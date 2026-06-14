import type { Metadata } from "next";
import "@/app/globals.css";
import MobileContainer from "@/components/MobileContainer";

export const metadata: Metadata = {
  title: "Data Dictionary - Mobile Viewer",
  description: "Browse database schemas, columns, constraints, and relationships in a beautiful mobile interface.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased w-screen h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
        {/* Glow Spheres in Backdrop for Premium Look */}
        <div className="absolute top-[10%] left-[20%] w-[350px] h-[350px] bg-orange-600/10 rounded-full blur-[100px] select-none pointer-events-none animate-pulse-slow"></div>
        <div className="absolute bottom-[10%] right-[20%] w-[450px] h-[450px] bg-amber-600/10 rounded-full blur-[120px] select-none pointer-events-none animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>

        {/* Mobile Mock Container */}
        <MobileContainer>
          {children}
        </MobileContainer>
      </body>
    </html>
  );
}
