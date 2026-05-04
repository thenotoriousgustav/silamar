"use client";

import {
  Code2,
  Plus,
  Trash2,
  Calendar as CalendarIcon,
  GripVertical,
} from "lucide-react";
import { format, parse } from "date-fns";
import { id } from "date-fns/locale";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MonthPicker } from "@/components/ui/monthpicker";
import type { ResumeContent, ResumeProject } from "@/types/resume";
import { EmptyState } from "./empty-state";
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
} from "@/components/ui/sortable";

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
        nativeButton={false}
        render={<div />}
        className="data-[state=open]:bg-muted/30 px-5 py-5 hover:no-underline"
      >
        <div className="flex w-full items-center justify-between pr-4">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-none">
              <Code2 className="h-4 w-4" />
            </div>
            <span className="text-foreground font-semibold tracking-tight">
              Projek
            </span>
          </div>
          <div
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              addProject();
            }}
            className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground flex h-8 w-8 items-center justify-center rounded-none transition-all"
            title="Tambah Projek"
          >
            <Plus className="h-4 w-4" />
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-5 pt-2 pb-6">
        <div className="flex flex-col gap-6">
          <Sortable
            value={content.projects}
            onValueChange={updateProjectList}
            getItemValue={(e) => e.id}
          >
            <SortableContent className="flex flex-col gap-4">
              <Accordion className="w-full space-y-4">
                {content.projects.map((project: ResumeProject) => (
                  <SortableItem key={project.id} value={project.id}>
                    <AccordionItem
                      id={`projects-${project.id}`}
                      value={project.id}
                      className="bg-muted/20 border-border group overflow-hidden rounded-none border shadow-sm transition-all"
                    >
                      <div className="flex items-center">
                        <SortableItemHandle
                          asChild
                          className="text-muted-foreground hover:text-primary ml-4 cursor-grab transition-colors"
                        >
                          <GripVertical className="h-4 w-4" />
                        </SortableItemHandle>
                        <AccordionTrigger
                          nativeButton={false}
                          render={<div />}
                          className="hover:bg-muted/30 flex-1 px-4 py-4 hover:no-underline"
                        >
                          <div className="flex w-full flex-1 items-center justify-between text-left">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-sm font-bold">
                                {project.name || "Nama Projek"}
                              </span>
                              <span className="text-muted-foreground text-xs font-medium">
                                {project.link || "Tautan Projek"}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
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
                            <Popover>
                              <PopoverTrigger
                                nativeButton={false}
                                render={
                                  <div className="relative">
                                    <Input
                                      readOnly
                                      value={project.startDate || ""}
                                      placeholder="Pilih bulan & tahun"
                                      className="bg-background border-border focus:ring-primary/50 cursor-pointer pr-10 focus:ring-1"
                                    />
                                    <CalendarIcon className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
                                  </div>
                                }
                              />
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <MonthPicker
                                  selectedMonth={
                                    project.startDate
                                      ? parse(
                                          project.startDate,
                                          "MMMM yyyy",
                                          new Date(),
                                          { locale: id },
                                        )
                                      : undefined
                                  }
                                  onMonthSelect={(date) => {
                                    if (date) {
                                      updateProject(project.id, {
                                        startDate: format(date, "MMMM yyyy", {
                                          locale: id,
                                        }),
                                      });
                                    }
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-muted-foreground text-xs font-medium uppercase">
                              Bulan/Tahun Selesai
                            </Label>
                            <Popover>
                              <PopoverTrigger
                                nativeButton={false}
                                render={
                                  <div className="relative">
                                    <Input
                                      readOnly
                                      value={project.endDate || ""}
                                      placeholder="Pilih bulan & tahun"
                                      className="bg-background border-border focus:ring-primary/50 cursor-pointer pr-10 focus:ring-1"
                                    />
                                    <CalendarIcon className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
                                  </div>
                                }
                              />
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <MonthPicker
                                  selectedMonth={
                                    project.endDate
                                      ? parse(
                                          project.endDate,
                                          "MMMM yyyy",
                                          new Date(),
                                          { locale: id },
                                        )
                                      : undefined
                                  }
                                  onMonthSelect={(date) => {
                                    if (date) {
                                      updateProject(project.id, {
                                        endDate: format(date, "MMMM yyyy", {
                                          locale: id,
                                        }),
                                      });
                                    }
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div className="space-y-4 md:col-span-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-muted-foreground text-xs font-medium uppercase">
                                Deskripsi Projek
                              </Label>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const current = project.description || [];
                                  updateProject(project.id, {
                                    description: [
                                      ...current,
                                      { id: crypto.randomUUID(), text: "" },
                                    ],
                                  });
                                }}
                                className="hover:border-primary/50 hover:bg-primary/5 h-7 gap-1 px-2 text-[10px] font-semibold transition-all"
                              >
                                <Plus className="h-3 w-3" />
                                Tambah Poin
                              </Button>
                            </div>

                            <div className="space-y-2">
                              <Sortable
                                value={project.description || []}
                                onValueChange={(newBullets) => {
                                  updateProject(project.id, {
                                    description: newBullets,
                                  });
                                }}
                                getItemValue={(item) => item.id}
                              >
                                <SortableContent className="space-y-2">
                                  {(project.description || []).map(
                                    (bullet, idx) => (
                                      <SortableItem
                                        key={bullet.id}
                                        value={bullet.id}
                                        className="group flex items-start gap-2"
                                      >
                                        <SortableItemHandle
                                          asChild
                                          className="text-muted-foreground hover:text-primary mt-3 cursor-grab transition-colors"
                                        >
                                          <GripVertical className="h-3.5 w-3.5" />
                                        </SortableItemHandle>
                                        <div className="relative flex-1">
                                          <textarea
                                            value={bullet.text || ""}
                                            onChange={(e) => {
                                              const newDesc = [
                                                ...(project.description || []),
                                              ];
                                              newDesc[idx] = {
                                                ...newDesc[idx],
                                                text: e.target.value,
                                              };
                                              updateProject(project.id, {
                                                description: newDesc,
                                              });
                                            }}
                                            placeholder="Jelaskan kontribusi atau fitur utama projek ini..."
                                            className="bg-background border-border focus:border-primary/50 custom-scrollbar min-h-15 w-full resize-none rounded-none border p-3 text-sm transition-all focus:ring-0"
                                            rows={2}
                                          />
                                        </div>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => {
                                            const newDesc =
                                              project.description.filter(
                                                (_, i) => i !== idx,
                                              );
                                            updateProject(project.id, {
                                              description: newDesc,
                                            });
                                          }}
                                          className="hover:bg-destructive/10 hover:text-destructive text-muted-foreground h-8 w-8 shrink-0 opacity-0 transition-all group-hover:opacity-100"
                                        >
                                          <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                      </SortableItem>
                                    ),
                                  )}
                                </SortableContent>
                              </Sortable>
                              {(project.description || []).length === 0 && (
                                <p className="text-muted-foreground py-2 text-center text-xs italic">
                                  Belum ada deskripsi yang ditambahkan.
                                </p>
                              )}
                            </div>
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
