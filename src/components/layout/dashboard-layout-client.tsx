"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import {
  HeaderProvider,
  useHeader,
} from "@/components/providers/header-provider";
import { SidebarTrigger } from "@/components/ui/sidebar";

function HeaderContent() {
  const { title, actions } = useHeader();
  return (
    <header className="border-border bg-background/50 sticky top-0 z-10 flex h-16 w-full shrink-0 items-center justify-between gap-2 border-b px-4 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <div className="bg-border mx-2 h-4 w-px" />
        <div className="flex min-w-0 items-center gap-2">{title}</div>
      </div>
      <div className="flex items-center gap-2">{actions}</div>
    </header>
  );
}

export function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HeaderProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-background flex h-screen flex-col overflow-hidden">
          <HeaderContent />
          <main className="custom-scrollbar flex-1 overflow-y-auto">
            <div className="max-w-8xl mx-auto p-6 lg:p-8">{children}</div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </HeaderProvider>
  );
}
