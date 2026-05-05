"use client";

import * as React from "react";
import { Zap, Settings, LogOut, ChevronUp } from "lucide-react";
import { sidebarData } from "@/config/sidebar";
import { NavMain } from "@/components/layout/nav-main";
import { ModeToggle } from "@/components/layout/mode-toggle";
import Link from "next/link";
import { useSession, signOut } from "@/lib/auth/client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { getTrackersAction } from "@/server/actions/job-applications";
import { useQuery } from "@tanstack/react-query";
import { CreateTrackerDialog } from "@/components/features/job-tracker/create-tracker-dialog";
import { TrackerActions } from "@/components/features/job-tracker/tracker-actions";
import { Briefcase } from "lucide-react";

export function AppSidebar() {
  const { data: session } = useSession();
  const user = session?.user;

  const { data: trackers } = useQuery({
    queryKey: ["trackers"],
    queryFn: () => getTrackersAction(),
  });

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const dynamicTrackers = React.useMemo(() => {
    const base = [...sidebarData.navTrackers];
    if (!trackers || trackers.length === 0) return base;

    const items = trackers.map((t) => ({
      title: t.name,
      url: `/job-tracker?trackerId=${t.id}`,
      icon: Briefcase,
      actions: <TrackerActions tracker={t} />,
    }));

    return [...base, ...items];
  }, [trackers]);

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="flex h-16 items-center justify-center">
        <div className="flex w-full items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="bg-primary flex h-8 w-8 shrink-0 items-center justify-center">
              <Zap className="text-primary-foreground h-4 w-4" />
            </div>
            <span className="text-foreground text-base font-bold group-data-[collapsible=icon]:hidden">
              SiLamar
            </span>
          </Link>
          <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
            <ModeToggle />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={sidebarData.navMain} label="Utama" />
        <NavMain
          items={dynamicTrackers}
          label="Trackers"
          action={<CreateTrackerDialog />}
        />
        <NavMain items={sidebarData.navSecondary} label="Analisis" />
      </SidebarContent>

      <SidebarFooter className="flex flex-col gap-2 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user?.image || ""}
                        alt={user?.name || ""}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {mounted ? user?.name?.charAt(0) : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                      <span className="text-foreground truncate font-semibold">
                        {mounted ? user?.name || "User" : "User"}
                      </span>
                      <span className="text-muted-foreground truncate text-xs">
                        {mounted ? user?.email : ""}
                      </span>
                    </div>
                    <ChevronUp className="text-muted-foreground ml-auto h-4 w-4 group-data-[collapsible=icon]:hidden" />
                  </SidebarMenuButton>
                }
              />
              <DropdownMenuContent
                side="top"
                className="bg-popover border-border text-popover-foreground w-[--radix-dropdown-menu-trigger-width] min-w-56"
                align="start"
              >
                <div className="flex items-center gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user?.image || ""}
                      alt={user?.name || ""}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {mounted ? user?.name?.charAt(0) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {mounted ? user?.name || "User" : "User"}
                    </span>
                    <span className="text-muted-foreground truncate text-xs">
                      {mounted ? user?.email : ""}
                    </span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="focus:bg-accent focus:text-accent-foreground cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Pengaturan</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="focus:bg-destructive/10 focus:text-destructive text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
