"use client";

import { Code2, Plus, Trash2, Calendar as CalendarIcon } from "lucide-react";
import { format, parse } from "date-fns";
import { id } from "date-fns/locale";
import {
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

interface ProjectSectionProps {
  content: ResumeContent;
  addProject: () => void;
  updateProject: (id: string, data: Partial<ResumeProject>) => void;
  removeProject: (id: string) => void;
}

export function ProjectSection({
  content,
  addProject,
  updateProject,
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
          {content.projects.map((project: ResumeProject) => (
            <Card
              key={project.id}
              className="bg-muted/20 border-border relative overflow-hidden rounded-none"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeProject(project.id)}
                className="hover:bg-destructive/10 hover:text-destructive text-muted-foreground absolute top-2 right-2 h-8 w-8"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs font-medium uppercase">
                      Nama Projek
                    </Label>
                    <Input
                      value={project.name || ""}
                      onChange={(e) =>
                        updateProject(project.id, { name: e.target.value })
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
                        updateProject(project.id, { link: e.target.value })
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
                      <PopoverContent className="w-auto p-0" align="start">
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
                      <PopoverContent className="w-auto p-0" align="start">
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
                            description: [...current, ""],
                          });
                        }}
                        className="hover:border-primary/50 hover:bg-primary/5 h-7 gap-1 px-2 text-[10px] font-semibold transition-all"
                      >
                        <Plus className="h-3 w-3" />
                        Tambah Poin
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {(project.description || []).map((bullet, idx) => (
                        <div key={idx} className="group flex items-start gap-2">
                          <div className="bg-primary/20 text-primary mt-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-none text-[10px] font-bold">
                            {idx + 1}
                          </div>
                          <div className="relative flex-1">
                            <textarea
                              value={bullet || ""}
                              onChange={(e) => {
                                const newDesc = [
                                  ...(project.description || []),
                                ];
                                newDesc[idx] = e.target.value;
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
                              const newDesc = [...(project.description || [])];
                              newDesc.splice(idx, 1);
                              updateProject(project.id, {
                                description: newDesc,
                              });
                            }}
                            className="hover:bg-destructive/10 hover:text-destructive text-muted-foreground h-8 w-8 shrink-0 opacity-0 transition-all group-hover:opacity-100"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                      {(project.description || []).length === 0 && (
                        <p className="text-muted-foreground py-2 text-center text-xs italic">
                          Belum ada deskripsi yang ditambahkan.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {content.projects.length === 0 && (
            <EmptyState message="Belum ada projek" onAdd={addProject} />
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
