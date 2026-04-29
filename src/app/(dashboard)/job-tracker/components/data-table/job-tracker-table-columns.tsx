"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import {
  Building2 as CompanyIcon,
  Briefcase as PositionIcon,
  Clock as DateIcon,
  Tag as TypeIcon,
  Activity as StatusIcon,
  MoreHorizontal,
  PencilLine,
  Trash2,
  ExternalLink,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  JOB_STATUS_LABELS,
  type JobStatus,
  type JobApplication,
} from "@/types/job";
import { formatDate } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import { STATUS_BADGE } from "../../constants";
import { Button } from "@/components/ui/button";

interface GetColumnsProps {
  onEdit: (job: JobApplication) => void;
  onDelete: (job: JobApplication) => void;
}

export function getJobTrackerColumns({
  onEdit,
  onDelete,
}: GetColumnsProps): ColumnDef<JobApplication>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <div
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          className="flex items-center justify-center"
        >
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={
              table.getIsSomePageRowsSelected() &&
              !table.getIsAllPageRowsSelected()
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className="translate-y-0.5"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          className="flex items-center justify-center"
        >
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="translate-y-0.5"
          />
        </div>
      ),
      size: 32,
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "position",
      accessorKey: "position",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Posisi" />
      ),
      cell: ({ row }) => (
        <div className="text-foreground font-medium">
          {row.getValue("position")}
        </div>
      ),
      meta: {
        label: "Posisi",
        placeholder: "Cari posisi...",
        variant: "text",
        icon: PositionIcon,
      },
      enableColumnFilter: true,
    },
    {
      id: "company",
      accessorKey: "company",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Perusahaan" />
      ),
      cell: ({ row }) => (
        <div className="text-muted-foreground">{row.getValue("company")}</div>
      ),
      meta: {
        label: "Perusahaan",
        placeholder: "Cari perusahaan...",
        variant: "text",
        icon: CompanyIcon,
      },
      enableColumnFilter: true,
    },
    {
      id: "type",
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Tipe" />
      ),
      cell: ({ row }) => (
        <div className="bg-muted text-muted-foreground w-fit rounded-none px-2 py-0.5 text-[10px] font-medium whitespace-nowrap">
          {row.getValue("type")}
        </div>
      ),
      meta: {
        label: "Tipe",
        variant: "multiSelect",
        options: [
          { label: "Full-Time", value: "full-time" },
          { label: "Part-Time", value: "part-time" },
          { label: "Internship", value: "internship" },
          { label: "Contract", value: "contract" },
          { label: "Freelance", value: "freelance" },
        ],
        icon: TypeIcon,
      },
      enableColumnFilter: true,
    },
    {
      id: "status",
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Status" />
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as JobStatus;
        return (
          <span
            className={cn(
              "rounded-none px-2.5 py-0.5 text-[10px] font-bold uppercase",
              STATUS_BADGE[status],
            )}
          >
            {JOB_STATUS_LABELS[status]}
          </span>
        );
      },
      meta: {
        label: "Status",
        variant: "multiSelect",
        options: Object.entries(JOB_STATUS_LABELS).map(([value, label]) => ({
          label,
          value,
        })),
        icon: StatusIcon,
      },
      enableColumnFilter: true,
    },
    {
      id: "interviewDate",
      accessorKey: "interviewDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Interview" />
      ),
      cell: ({ row }) => {
        const date = row.getValue("interviewDate") as string;
        return (
          <div className="text-muted-foreground italic">
            {date ? formatDate(date, "d MMM yyyy") : "-"}
          </div>
        );
      },
      meta: {
        label: "Interview",
        variant: "dateRange",
        icon: DateIcon,
      },
      enableColumnFilter: true,
    },
    {
      id: "appliedDate",
      accessorKey: "appliedDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Tanggal" />
      ),
      cell: ({ row }) => {
        const date = row.getValue("appliedDate") as string;
        return (
          <div className="text-muted-foreground">
            {date ? formatDate(date, "d MMM yyyy") : "-"}
          </div>
        );
      },
      meta: {
        label: "Tanggal",
        variant: "dateRange",
        icon: DateIcon,
      },
      enableColumnFilter: true,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={(triggerProps) => (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-none"
                  {...triggerProps}
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerProps.onClick?.(e);
                  }}
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              )}
            />
            <DropdownMenuContent align="end" className="rounded-none">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(row.original);
                }}
                className="rounded-none"
              >
                <PencilLine className="mr-2 h-3.5 w-3.5" />
                Edit Detail
              </DropdownMenuItem>
              {row.original.jobUrl && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(row.original.jobUrl!, "_blank");
                  }}
                  className="rounded-none"
                >
                  <ExternalLink className="mr-2 h-3.5 w-3.5" />
                  Buka Link
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator className="rounded-none" />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(row.original);
                }}
                className="text-destructive focus:bg-destructive/10 focus:text-destructive rounded-none"
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];
}
