import type { Metadata } from "next";
import "@/app/globals.css";
import DynamicBackground from "@/components/DynamicBackground";
import GlobalHeader from "@/components/GlobalHeader";

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
      <body className="antialiased w-screen h-screen bg-slate-950 relative overflow-hidden text-slate-200">
        {/* Global Navigation Header Bar */}
        <GlobalHeader />

        {/* Glow Spheres in Backdrop for Premium Look */}
        <DynamicBackground />

        {/* Full width content area starting below the global header */}
        <div className="w-full h-full flex flex-col pt-14">
          {children}
        </div>
      </body>
    </html>
  );
}
