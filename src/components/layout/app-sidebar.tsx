"use client";

import * as React from "react";
import {
  LayoutDashboard,
  FileText,
  Target,
  Briefcase,
  Zap,
  Settings,
  LogOut,
  ChevronUp,
  Monitor,
} from "lucide-react";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "@/lib/auth/client";
import { useTheme } from "next-themes";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarTrigger,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const menuItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/resume-builder", icon: FileText, label: "Resume Builder" },
  { href: "/cover-letter", icon: FileText, label: "Cover Letter" },
  { href: "/job-tracker", icon: Briefcase, label: "Job Tracker" },
  { href: "/skill-gap", icon: Target, label: "Skill Gap" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const user = session?.user;

  return (
    <Sidebar collapsible="offcanvas" variant="sidebar">
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
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground group-data-[collapsible=icon]:hidden">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={isActive}
                      tooltip={item.label}
                      className={
                        isActive
                          ? "bg-primary/10 text-primary hover:bg-primary/20"
                          : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="flex flex-col gap-2 p-4">
        {/* Theme Toggle (Inline when expanded, dropdown when collapsed? Or just part of user menu) */}
        {/* Let's put it in the user menu for a cleaner look when icon-only */}

        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  />
                }
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="text-foreground truncate font-semibold">
                    {user?.name || "User"}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user?.email || ""}
                  </span>
                </div>
                <ChevronUp className="text-muted-foreground ml-auto h-4 w-4 group-data-[collapsible=icon]:hidden" />
              </DropdownMenuTrigger>
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
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.name}</span>
                    <span className="text-muted-foreground truncate text-xs">
                      {user?.email}
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
