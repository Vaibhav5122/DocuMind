import { CheckCircle2, Clock, FileText, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardStats } from "./types";

interface StatsCardsProps {
  stats: DashboardStats;
  isLoading: boolean;
}

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-6 border shadow-sm">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-3 w-28" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="border border-border/60 shadow-sm">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <FileText className="h-6 w-6" />
          </div>
          <div className="flex-col flex items-center ">
            <p className="text-xs font-medium text-muted-foreground">
              Total Documents
            </p>
            <p className="text-2xl font-bold tracking-tight text-foreground">
              {stats.total}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              All your uploaded documents
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border/60 shadow-sm">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="flex-col flex items-center ">
            <p className="text-xs font-medium text-muted-foreground">
              Processed
            </p>
            <p className="text-2xl font-bold tracking-tight text-foreground">
              {stats.Processed}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ready to chat
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border/60 shadow-sm">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <Clock className="h-6 w-6" />
          </div>
          <div className="flex-col flex items-center ">
            <p className="text-xs font-medium text-muted-foreground">
              Processing
            </p>
            <p className="text-2xl font-bold tracking-tight text-foreground">
              {stats.Processing}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Being processed
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border/60 shadow-sm">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
            <XCircle className="h-6 w-6" />
          </div>
          <div className="flex-col flex items-center ">
            <p className="text-xs font-medium text-muted-foreground">Failed</p>
            <p className="text-2xl font-bold tracking-tight text-foreground">
              {stats.Failed}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Needs attention
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
