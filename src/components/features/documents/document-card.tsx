"use client";

import { ReactNode } from "react";
import { Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DocumentCardProps {
  title: string;
  subtitle?: string;
  updatedAt: Date;
  icon: ReactNode;
  onDelete: (e: React.MouseEvent) => void;
  onClick?: () => void;
  href: string;
  linkText: string;
  children?: ReactNode;
  className?: string;
}

export function DocumentCard({
  title,
  subtitle,
  updatedAt,
  icon,
  onDelete,
  onClick,
  href,
  linkText,
  children,
  className,
}: DocumentCardProps) {
  const CardWrapper = onClick ? "div" : "div"; // Both are divs, but logic changes

  return (
    <div
      role={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "glass group hover:border-primary/30 hover:shadow-primary/10 p-6 transition-all hover:shadow-lg",
        onClick && "cursor-pointer",
        className,
      )}
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="bg-primary/20 flex h-12 w-12 items-center justify-center">
          {icon}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="hover:text-destructive hover:bg-destructive/10 text-muted-foreground -mt-2 -mr-2 h-8 w-8 transition-colors"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(e);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <h3 className="group-hover:text-primary text-foreground truncate font-semibold transition-colors">
        {title}
      </h3>
      
      {subtitle && (
        <p className="text-muted-foreground truncate text-sm">
          {subtitle}
        </p>
      )}

      <p className="text-muted-foreground mt-1 text-xs">
        Diupdate {formatDate(updatedAt)}
      </p>

      {children}

      <div className="mt-4">
        <Link
          href={href}
          onClick={(e) => e.stopPropagation()}
          className="text-muted-foreground group-hover:text-foreground flex items-center gap-1 text-xs transition-colors"
        >
          {linkText} <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
