"use client";

import { useState } from "react";
import {
  useGetAllDocument,
  useDeleteDocument,
} from "@/lib/hooks/dashboard/useDocuments";
import { useCurrentSession } from "@/lib/hooks/auth/useAuth";
import { DashboardHeader } from "./dashboard-header";
import { StatsCards } from "./stats-cards";
import { DocumentTable } from "./document-table";
import type { DashboardStats, DocumentItem } from "./types";

export function DashboardContent() {
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data: userSession } = useCurrentSession();
  const { data: documents = [], isPending: isLoading } = useGetAllDocument();

  const {
    mutate: deleteMutate,
    isPending: isDeleting,
    variables: deletingDocumentId,
  } = useDeleteDocument();

  const handleFilterChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    setCurrentPage(1);
  };

  const stats: DashboardStats = {
    total: documents.length,
    Processed: documents.filter(
      (d: DocumentItem) => d.status === "UPLOADED" || d.status === "READY",
    ).length,
    Processing: documents.filter((d: DocumentItem) => d.status === "PROCESSING")
      .length,
    Failed: documents.filter((d: DocumentItem) => d.status === "FAILED").length,
  };

  const filteredDocuments = documents.filter((doc: DocumentItem) => {
    if (statusFilter === "All") return true;
    if (statusFilter === "Processed") {
      return doc.status === "UPLOADED" || doc.status === "READY";
    }
    return doc.status.toLowerCase() === statusFilter.toLowerCase();
  });

  const handleDeleteDocument = (documentId: string) => {
    deleteMutate(documentId);
  };

  const handleViewDocument = (documentId: string) => {
    console.log("Viewing document:", documentId);
  };

  return (
    <div className="flex-1 space-y-8 p-8 max-w-7xl mx-auto">
      <DashboardHeader userName={userSession?.user?.name} />
      <StatsCards stats={stats} isLoading={isLoading} />
      <DocumentTable
        documents={filteredDocuments}
        totalCount={documents.length}
        isLoading={isLoading}
        statusFilter={statusFilter}
        onStatusFilterChange={handleFilterChange}
        onDeleteDocument={handleDeleteDocument}
        deletingId={isDeleting ? (deletingDocumentId as string) : null}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        itemsPerPage={8}
        onViewDocument={handleViewDocument}
      />
    </div>
  );
}
