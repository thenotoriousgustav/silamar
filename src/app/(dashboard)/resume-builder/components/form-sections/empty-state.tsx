"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  message: string;
  onAdd: () => void;
}

export function EmptyState({ message, onAdd }: EmptyStateProps) {
  return (
    <div className="border-border bg-muted/20 flex flex-col items-center justify-center rounded-none border-2 border-dashed py-10">
      <p className="text-surface-400 mb-4">{message}</p>
      <Button
        onClick={onAdd}
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        <Plus className="mr-2 h-4 w-4" /> Tambah Data
      </Button>
    </div>
  );
}
