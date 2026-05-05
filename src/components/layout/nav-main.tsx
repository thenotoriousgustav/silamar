"use client";

import * as React from "react";

import { ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

function NavMainItem({ item, pathname }: { item: any; pathname: string }) {
  const isParentActive =
    pathname === item.url ||
    item.items?.some((sub: any) => pathname === sub.url);
  const [isOpen, setIsOpen] = React.useState(isParentActive);

  // Sync open state with navigation
  // React.useEffect(() => {
  //   if (isParentActive) {
  //     setIsOpen(true);
  //   }
  // }, [isParentActive]);

  if (item.items && item.items.length > 0) {
    return (
      <Collapsible
        key={item.title}
        render={<div />}
        open={isOpen}
        onOpenChange={setIsOpen}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger
            render={
              <SidebarMenuButton tooltip={item.title} isActive={isParentActive}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            }
          />
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.items?.map((subItem: any) => (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton
                    render={<Link href={subItem.url} />}
                    isActive={pathname === subItem.url}
                  >
                    {subItem.icon && <subItem.icon className="h-4 w-4" />}
                    <span>{subItem.title}</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  return (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton
        render={<Link href={item.url} />}
        tooltip={item.title}
        isActive={pathname === item.url}
      >
        {item.icon && <item.icon />}
        <span>{item.title}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      icon?: LucideIcon;
    }[];
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <NavMainItem key={item.title} item={item} pathname={pathname} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
