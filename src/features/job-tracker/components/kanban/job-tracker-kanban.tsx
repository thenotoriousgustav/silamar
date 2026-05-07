"use client";

import {
  Building2,
  Clock,
  PencilLine,
  Trash2,
  GripVertical,
  Briefcase,
} from "lucide-react";
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnHandle,
  KanbanItem,
  KanbanOverlay,
} from "@/components/ui/kanban";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { formatDate } from "@/lib/utils/format";
import {
  type JobStatus,
  type JobApplication,
} from "@/features/job-tracker/types";
import {
  KANBAN_COLUMNS,
  STATUS_COLORS,
  STATUS_BADGE,
} from "@/features/job-tracker/constants";

interface JobTrackerKanbanProps {
  columns: Record<string, JobApplication[]>;
  onColumnsChange: (columns: Record<string, JobApplication[]>) => void;
  onDragStart: (event: any) => void;
  onDragEnd: (event: any) => void;
  onItemClick: (job: JobApplication) => void;
  onItemEdit: (job: JobApplication) => void;
  onItemDelete: (job: JobApplication) => void;
}

export function JobTrackerKanban({
  columns,
  onColumnsChange,
  onDragStart,
  onDragEnd,
  onItemClick,
  onItemEdit,
  onItemDelete,
}: JobTrackerKanbanProps) {
  return (
    <Kanban
      value={columns}
      onValueChange={onColumnsChange}
      getItemValue={(item) => item.id}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <KanbanBoard className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Object.keys(columns).map((status) => {
          const colInfo = KANBAN_COLUMNS.find((c) => c.id === status);
          return (
            <JobColumn
              key={status}
              value={status}
              label={colInfo?.label || status}
              tasks={columns[status] || []}
              onItemClick={onItemClick}
              onItemEdit={onItemEdit}
              onItemDelete={onItemDelete}
            />
          );
        })}
      </KanbanBoard>
      <KanbanOverlay>
        {({ value, variant }) => {
          if (variant === "column") {
            const col = KANBAN_COLUMNS.find((c) => c.id === value);
            return (
              <JobColumn
                value={value}
                label={col?.label || (value as string)}
                tasks={columns[value] || []}
                onItemClick={onItemClick}
                onItemEdit={onItemEdit}
                onItemDelete={onItemDelete}
              />
            );
          }

          const job = Object.values(columns)
            .flat()
            .find((j) => j.id === value);

          if (!job) return null;

          return <JobCard job={job} />;
        }}
      </KanbanOverlay>
    </Kanban>
  );
}

// Sub-components for Kanban
interface JobCardProps extends Omit<
  React.ComponentProps<typeof KanbanItem>,
  "value"
> {
  job: JobApplication;
  onItemClick?: (job: JobApplication) => void;
  onItemEdit?: (job: JobApplication) => void;
  onItemDelete?: (job: JobApplication) => void;
}

function JobCard({
  job,
  onItemClick,
  onItemEdit,
  onItemDelete,
  ...props
}: JobCardProps) {
  return (
    <KanbanItem
      key={job.id}
      value={job.id}
      asChild
      {...props}
      onClick={() => onItemClick?.(job)}
    >
      <div className="group glass hover:border-primary/20 border-border/50 relative cursor-pointer rounded-none border p-4 text-left shadow-sm transition-all">
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-foreground line-clamp-1 text-sm font-semibold">
                {job.position}
              </div>
              <div className="text-muted-foreground mt-0.5 flex items-center gap-1 text-xs">
                <Building2 className="h-3 w-3" /> {job.company}
              </div>
            </div>

            <div className="absolute top-2 right-2 flex gap-1 opacity-0 transition-all group-hover:opacity-100">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary/10 h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation();
                  onItemEdit?.(job);
                }}
              >
                <PencilLine className="text-muted-foreground h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-destructive/10 h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation();
                  onItemDelete?.(job);
                }}
              >
                <Trash2 className="text-destructive h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="bg-muted text-muted-foreground rounded-none px-2 py-0.5 text-[10px] font-medium">
              {job.type}
            </div>
            {job.appliedDate && (
              <div className="text-muted-foreground flex items-center gap-1 text-[10px]">
                <Clock className="h-2.5 w-2.5" />{" "}
                {formatDate(job.appliedDate, "d MMM")}
              </div>
            )}
          </div>
        </div>
      </div>
    </KanbanItem>
  );
}

interface JobColumnProps extends Omit<
  React.ComponentProps<typeof KanbanColumn>,
  "children"
> {
  tasks: JobApplication[];
  label: string;
  onItemClick?: (job: JobApplication) => void;
  onItemEdit?: (job: JobApplication) => void;
  onItemDelete?: (job: JobApplication) => void;
}

function JobColumn({
  value,
  tasks,
  label,
  onItemClick,
  onItemEdit,
  onItemDelete,
  ...props
}: JobColumnProps) {
  const statusId = value as JobStatus;

  return (
    <KanbanColumn
      value={value}
      className={cn("rounded-none border p-4", STATUS_COLORS[statusId])}
      {...props}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-foreground text-sm font-semibold">{label}</h3>
          <span
            className={cn(
              "rounded-none px-2 py-0.5 text-xs font-bold",
              STATUS_BADGE[statusId],
            )}
          >
            {tasks.length}
          </span>
        </div>
        <KanbanColumnHandle asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground h-8 w-8"
          >
            <GripVertical className="h-4 w-4" />
          </Button>
        </KanbanColumnHandle>
      </div>

      <div className="flex min-h-25 flex-col gap-3">
        {tasks.length === 0 && (
          <div className="border-border/50 bg-background/20 rounded-none border border-dashed py-8 text-center">
            <Briefcase className="text-muted-foreground/30 mx-auto mb-2 h-5 w-5" />
            <p className="text-muted-foreground/50 text-xs">Kosong</p>
          </div>
        )}
        {tasks.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            asHandle
            onItemClick={onItemClick}
            onItemEdit={onItemEdit}
            onItemDelete={onItemDelete}
          />
        ))}
      </div>
    </KanbanColumn>
  );
}
