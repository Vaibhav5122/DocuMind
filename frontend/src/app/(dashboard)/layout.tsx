import * as React from "react";
import NavbarDemo from "@/components/resizable-navbar-demo";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex flex-col">
      <header className="fixed inset-x-0 top-3 sm:top-4 z-50 flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8">
          <NavbarDemo />
        </div>
      </header>

      <div className="flex flex-1 flex-col pt-16 sm:pt-20">
        <main className="flex-1 flex flex-col w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
