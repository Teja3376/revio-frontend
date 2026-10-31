import type { ReactNode } from "react";
import { QueryProvider } from "@/components/query-provider";
import { DashboardShell } from "./dashboard-shell";

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <DashboardShell>{children}</DashboardShell>
    </QueryProvider>
  );
}
