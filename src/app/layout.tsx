import type { Metadata } from "next";
import "@/app/globals.css";
import ResponsiveLayoutWrapper from "@/components/ResponsiveLayoutWrapper";
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
      <body className="antialiased w-screen h-screen bg-slate-950 relative overflow-hidden">
        {/* Global Navigation Header Bar */}
        <GlobalHeader />

        {/* Glow Spheres in Backdrop for Premium Look */}
        <DynamicBackground />

        {/* Responsive Layout Wrapper (toggles mobile frame or full widescreen layout) */}
        <ResponsiveLayoutWrapper>
          {children}
        </ResponsiveLayoutWrapper>
      </body>
    </html>
  );
}
