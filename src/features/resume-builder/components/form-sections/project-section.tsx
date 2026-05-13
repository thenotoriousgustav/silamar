"use client";

import { format, parse } from "date-fns";
import { enUS, id } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  Code2,
  GripVertical,
  Plus,
  Trash2,
} from "lucide-react";

import { DynamicEditor as Editor } from "@/components/editor/dynamic-editor";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MonthPicker } from "@/components/ui/monthpicker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
} from "@/components/ui/sortable";
import type { ResumeContent, ResumeProject } from "@/types/resume";

import { EmptyState } from "./empty-state";

interface ProjectSectionProps {
  content: ResumeContent;
  addProject: () => void;
  updateProject: (id: string, data: Partial<ResumeProject>) => void;
  updateProjectList: (projects: ResumeProject[]) => void;
  removeProject: (id: string) => void;
}

export function ProjectSection({
  content,
  addProject,
  updateProject,
  updateProjectList,
  removeProject,
}: ProjectSectionProps) {
  return (
    <AccordionItem
      value="projects"
      className="bg-card border-border hover:border-primary/20 overflow-hidden rounded-none border shadow-sm transition-all"
    >
      <AccordionTrigger
        asChild
        className="data-[state=open]:bg-muted/30 px-5 hover:no-underline"
      >
        <div className="flex w-full cursor-pointer items-center justify-between pr-4">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-none">
              <Code2 className="h-4 w-4" />
            </div>
            <span className="text-foreground font-semibold tracking-tight">
              Projects
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                addProject();
              }}
              className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground flex h-8 w-8 items-center justify-center rounded-none transition-all"
              title="Add Project"
            >
              <Plus className="h-4 w-4" />
            </div>
            <ChevronDown className="text-muted-foreground h-4 w-4 transition-transform duration-200 group-data-[state=open]/accordion-trigger:rotate-180" />
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="w-full px-5 pt-2 pb-6">
        <div className="flex w-full flex-col gap-6">
          <Sortable
            value={content.projects}
            onValueChange={updateProjectList}
            getItemValue={(e) => e.id}
          >
            <SortableContent className="flex w-full flex-col gap-4">
              <Accordion type="single" collapsible className="w-full space-y-4">
                {content.projects.map((project: ResumeProject) => (
                  <SortableItem key={project.id} value={project.id} asChild>
                    <AccordionItem
                      id={`projects-${project.id}`}
                      value={project.id}
                      className="bg-muted/20 border-border group overflow-hidden rounded-none border shadow-sm transition-all"
                    >
                      <div className="flex w-full items-center">
                        <SortableItemHandle
                          asChild
                          className="text-muted-foreground hover:text-primary ml-4 cursor-grab transition-colors"
                        >
                          <GripVertical className="h-4 w-4" />
                        </SortableItemHandle>
                        <AccordionTrigger
                          asChild
                          className="hover:bg-muted/30 flex-1 px-4 hover:no-underline"
                        >
                          <div className="flex w-full flex-1 cursor-pointer items-center justify-between text-left">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-sm font-bold">
                                {project.name || "Nama Projek"}
                              </span>
                              <span className="text-muted-foreground text-xs font-medium">
                                {project.link || "Tautan Projek"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-muted-foreground text-[10px] font-medium uppercase">
                                {project.startDate || "Mulai"} —{" "}
                                {project.endDate || "Selesai"}
                              </div>
                              <div
                                role="button"
                                tabIndex={0}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeProject(project.id);
                                }}
                                className="hover:bg-destructive/10 hover:text-destructive text-muted-foreground flex h-8 w-8 items-center justify-center transition-colors"
                                title="Hapus Projek"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </div>
                              <ChevronDown className="text-muted-foreground h-4 w-4 transition-transform duration-200 group-data-[state=open]/accordion-trigger:rotate-180" />
                            </div>
                          </div>
                        </AccordionTrigger>
                      </div>
                      <AccordionContent className="border-t border-dashed px-6 py-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label className="text-muted-foreground text-xs font-medium uppercase">
                              Nama Projek
                            </Label>
                            <Input
                              value={project.name || ""}
                              onChange={(e) =>
                                updateProject(project.id, {
                                  name: e.target.value,
                                })
                              }
                              className="bg-background border-border"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-muted-foreground text-xs font-medium uppercase">
                              Tautan Projek (Opsional)
                            </Label>
                            <Input
                              value={project.link || ""}
                              onChange={(e) =>
                                updateProject(project.id, {
                                  link: e.target.value,
                                })
                              }
                              placeholder="https://github.com/..."
                              className="bg-background border-border"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-muted-foreground text-xs font-medium uppercase">
                              Bulan/Tahun Mulai
                            </Label>
                            <div className="relative">
                              <Input
                                value={project.startDate || ""}
                                onChange={(e) =>
                                  updateProject(project.id, {
                                    startDate: e.target.value,
                                  })
                                }
                                placeholder="MMM yyyy"
                                className="bg-background border-border pr-10"
                              />
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-muted-foreground hover:text-primary absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2 rounded-none"
                                  >
                                    <CalendarIcon className="h-4 w-4" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="end"
                                >
                                  <MonthPicker
                                    selectedMonth={
                                      project.startDate
                                        ? (() => {
                                            const d = parse(
                                              project.startDate,
                                              "MMM yyyy",
                                              new Date(),
                                              { locale: enUS },
                                            );
                                            if (!isNaN(d.getTime())) return d;
                                            return parse(
                                              project.startDate,
                                              "MMMM yyyy",
                                              new Date(),
                                              { locale: enUS },
                                            );
                                          })()
                                        : undefined
                                    }
                                    onMonthSelect={(date) => {
                                      if (date) {
                                        updateProject(project.id, {
                                          startDate: format(date, "MMM yyyy", {
                                            locale: enUS,
                                          }),
                                        });
                                      }
                                    }}
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-muted-foreground text-xs font-medium uppercase">
                              Bulan/Tahun Selesai
                            </Label>
                            <div className="relative">
                              <Input
                                value={project.endDate || ""}
                                onChange={(e) =>
                                  updateProject(project.id, {
                                    endDate: e.target.value,
                                  })
                                }
                                placeholder="MMM yyyy"
                                className="bg-background border-border pr-10"
                              />
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-muted-foreground hover:text-primary absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2 rounded-none"
                                  >
                                    <CalendarIcon className="h-4 w-4" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="end"
                                >
                                  <MonthPicker
                                    selectedMonth={
                                      project.endDate
                                        ? (() => {
                                            const d = parse(
                                              project.endDate,
                                              "MMM yyyy",
                                              new Date(),
                                              { locale: enUS },
                                            );
                                            if (!isNaN(d.getTime())) return d;
                                            return parse(
                                              project.endDate,
                                              "MMMM yyyy",
                                              new Date(),
                                              { locale: enUS },
                                            );
                                          })()
                                        : undefined
                                    }
                                    onMonthSelect={(date) => {
                                      if (date) {
                                        updateProject(project.id, {
                                          endDate: format(date, "MMM yyyy", {
                                            locale: enUS,
                                          }),
                                        });
                                      }
                                    }}
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                          </div>
                          <div className="space-y-4 md:col-span-2">
                            <Label className="text-muted-foreground text-xs font-medium uppercase">
                              Deskripsi Projek
                            </Label>
                            <Editor
                              initialDescription={
                                typeof project.description === "string"
                                  ? project.description
                                  : Array.isArray(project.description)
                                    ? `<ul>${(project.description as any[]).map((item) => `<li>${item.text || item}</li>`).join("")}</ul>`
                                    : undefined
                              }
                              onSerializedChange={(serialized) =>
                                updateProject(project.id, {
                                  description: JSON.stringify(serialized),
                                })
                              }
                            />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </SortableItem>
                ))}
              </Accordion>
            </SortableContent>
          </Sortable>
          {content.projects.length === 0 && (
            <EmptyState message="Belum ada projek" onAdd={addProject} />
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
