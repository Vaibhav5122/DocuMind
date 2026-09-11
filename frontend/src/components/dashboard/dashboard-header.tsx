import { UploadDocumentDialog } from "./uploadDialog";

interface DashboardHeaderProps {
  userName?: string;
}

export function DashboardHeader({ userName = "User" }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome back, {userName}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your documents, track processing status, and access your
          knowledge.
        </p>
      </div>
      <UploadDocumentDialog />
    </div>
  );
}
