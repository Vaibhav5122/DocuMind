import type { Metadata } from "next";
import { DashboardContent } from "@/components/dashboard/dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your uploaded documents, view vector indexing status, and inspect file analytics.",
};

export default function DashboardPage() {
  return (
    <div className="w-full">
      <DashboardContent />
    </div>
  );
}
