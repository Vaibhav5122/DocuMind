import * as React from "react";
import NavbarDemo from "@/components/resizable-navbar-demo";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <header className="fixed inset-x-0 top-5 z-50 flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <NavbarDemo />
        </div>
      </header>

      <div className="flex flex-1">
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <div className="mx-auto container max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
