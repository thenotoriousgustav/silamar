"use client";

import type { Table as TanstackTable } from "@tanstack/react-table";
import { ExternalLink, PencilLine, Trash2, X } from "lucide-react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import {
  ActionBar,
  ActionBarClose,
  ActionBarGroup,
  ActionBarItem,
  ActionBarSelection,
  ActionBarSeparator,
} from "@/components/ui/action-bar";
import { Button } from "@/components/ui/button";
import {
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import type { JobApplication } from "@/features/job-tracker/types";

interface JobTrackerTableProps {
  table: TanstackTable<JobApplication>;
  isLoading: boolean;
  onRowClick: (job: JobApplication) => void;
  onEditJob: (job: JobApplication) => void;
  onDeleteJob: (job: JobApplication) => void;
}

export function JobTrackerTable({
  table,
  isLoading,
  onRowClick,
  onEditJob,
  onDeleteJob,
}: JobTrackerTableProps) {
  return (
    <div className="rounded-none border-none bg-transparent">
      <DataTable
        table={table}
        onRowClick={onRowClick}
        isLoading={isLoading}
        renderContextMenu={(job) => (
          <>
            <ContextMenuItem
              onClick={() => onEditJob(job)}
              className="rounded-none"
            >
              <PencilLine className="mr-2 h-3.5 w-3.5" />
              Edit Detail
            </ContextMenuItem>
            {job.jobUrl && (
              <ContextMenuItem
                onClick={() => window.open(job.jobUrl!, "_blank")}
                className="rounded-none"
              >
                <ExternalLink className="mr-2 h-3.5 w-3.5" />
                Buka Link
              </ContextMenuItem>
            )}
            <ContextMenuSeparator className="rounded-none" />
            <ContextMenuItem
              onClick={() => onDeleteJob(job)}
              className="text-destructive focus:bg-destructive/10 focus:text-destructive rounded-none"
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Hapus
            </ContextMenuItem>
          </>
        )}
        actionBar={
          <div onClick={(e) => e.stopPropagation()}>
            <ActionBar
              open={table.getFilteredSelectedRowModel().rows.length > 0}
              onOpenChange={(open) => {
                if (!open) table.resetRowSelection();
              }}
            >
              <ActionBarSelection className="text-xs font-bold">
                {table.getFilteredSelectedRowModel().rows.length} Terpilih
              </ActionBarSelection>
              <ActionBarSeparator />
              <ActionBarGroup>
                <ActionBarItem
                  className="bg-destructive/10 text-destructive hover:bg-destructive/20 h-8 rounded-none px-3 text-xs font-bold"
                  onClick={() => {
                    const selectedRows = table
                      .getFilteredSelectedRowModel()
                      .rows.map((row) => row.original);
                    if (selectedRows.length > 0) {
                      onDeleteJob(selectedRows[0]);
                    }
                  }}
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  Hapus
                </ActionBarItem>
              </ActionBarGroup>
              <ActionBarSeparator />
              <ActionBarClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-none"
                >
                  <X className="h-4 w-4" />
                </Button>
              </ActionBarClose>
            </ActionBar>
          </div>
        }
      >
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  );
}
