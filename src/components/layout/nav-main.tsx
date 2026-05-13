"use client";


import { ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

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
  const [isOpen, setIsOpen] = React.useState(isParentActive || item.isActive);

  if (item.items && item.items.length > 0) {
    return (
      <Collapsible
        key={item.title}
        open={isOpen}
        onOpenChange={setIsOpen}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip={item.title} isActive={isParentActive}>
              {item.icon && <item.icon />}
              <span>{item.title}</span>
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.items?.map((subItem: any) => (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={pathname === subItem.url}
                  >
                    <Link href={subItem.url}>
                      {subItem.icon && <subItem.icon className="h-4 w-4" />}
                      <span>{subItem.title}</span>
                    </Link>
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
        asChild
        tooltip={item.title}
        isActive={pathname === item.url}
      >
        <Link href={item.url}>
          {item.icon && <item.icon />}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
      {item.actions && item.actions}
    </SidebarMenuItem>
  );
}

export function NavMain({
  items,
  label,
  action,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    actions?: React.ReactNode;
    items?: {
      title: string;
      url: string;
      icon?: LucideIcon;
    }[];
  }[];
  label?: string;
  action?: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      {label && (
        <div className="flex items-center justify-between pr-2">
          <SidebarGroupLabel>{label}</SidebarGroupLabel>
          {action}
        </div>
      )}
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
