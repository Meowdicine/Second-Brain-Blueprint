"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

interface MainLayoutProps {
  children: React.ReactNode;
  lastUpdated?: string;
}

export function MainLayout({ children, lastUpdated }: MainLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const isDashboardRoute = pathname === "/dashboard";

  return (
    <div
      className={`relative overflow-x-clip bg-slate-950 text-slate-100 ${
        isDashboardRoute ? "min-h-screen xl:h-screen xl:overflow-y-hidden" : "min-h-screen"
      }`}
    >
      <div className="fixed inset-0 -z-20 bg-[linear-gradient(130deg,#020617_0%,#0b1120_42%,#111827_100%)]" />
      <div className="dashboard-grid-overlay fixed inset-0 -z-20 opacity-35" />
      <div className="dashboard-aurora dashboard-aurora-a fixed -top-32 left-[-12rem] -z-10" />
      <div className="dashboard-aurora dashboard-aurora-b fixed top-12 right-[-10rem] -z-10" />
      <div className="dashboard-aurora dashboard-aurora-c fixed bottom-[-10rem] left-[22%] -z-10" />

      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((prev) => !prev)} />

      <div
        className={`pl-0 transition-all duration-300 ${
          collapsed ? "md:pl-16" : "md:pl-72"
        }`}
      >
        <Header lastUpdated={lastUpdated} />

        <main
          className={`relative mx-auto w-full max-w-[1680px] p-4 md:p-6 lg:p-8 ${
            isDashboardRoute ? "xl:h-[calc(100vh-4rem)] xl:overflow-hidden" : ""
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
