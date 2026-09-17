"use client";

import { useState, useMemo, useCallback } from "react";
import type { DocumentInfo } from "@/types/chat";

export function useDocumentSelection(documents: DocumentInfo[] = []) {
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const isSelected = useCallback(
    (id: string) => selectedDocIds.includes(id),
    [selectedDocIds],
  );

  const toggleDocument = useCallback((id: string) => {
    setSelectedDocIds((prev) =>
      prev.includes(id) ? prev.filter((docId) => docId !== id) : [...prev, id],
    );
  }, []);

  const selectDocument = useCallback((id: string) => {
    setSelectedDocIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const deselectDocument = useCallback((id: string) => {
    setSelectedDocIds((prev) => prev.filter((docId) => docId !== id));
  }, []);

  const selectAll = useCallback((ids?: string[]) => {
    if (ids) {
      setSelectedDocIds(Array.from(new Set(ids)));
    } else {
      setSelectedDocIds(documents.map((d) => d._id));
    }
  }, [documents]);

  const clearSelection = useCallback(() => {
    setSelectedDocIds([]);
  }, []);

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.originalFileName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" ||
        doc.status.toUpperCase() === statusFilter.toUpperCase();

      return matchesSearch && matchesStatus;
    });
  }, [documents, searchQuery, statusFilter]);

  const selectedDocuments = useMemo(() => {
    return documents.filter((doc) => selectedDocIds.includes(doc._id));
  }, [documents, selectedDocIds]);

  return {
    selectedDocIds,
    selectedDocuments,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    filteredDocuments,
    isSelected,
    toggleDocument,
    selectDocument,
    deselectDocument,
    selectAll,
    clearSelection,
  };
}
