"use client";

import {
  GraduationCap,
  Plus,
  Trash2,
  Calendar as CalendarIcon,
  GripVertical,
  ChevronDown,
} from "lucide-react";
import { format, parse } from "date-fns";
import { enUS, id } from "date-fns/locale";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn, formatResumeDate } from "@/lib/utils";
import { Editor } from "@/components/editor/rich-text-editor";
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
import type {
  ResumeContent,
  ResumeEducation,
} from "@/features/resumes-list/types/resume";
import { EmptyState } from "./empty-state";
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
} from "@/components/ui/sortable";

interface EducationSectionProps {
  content: ResumeContent;
  addEducation: () => void;
  updateEducation: (id: string, data: Partial<ResumeEducation>) => void;
  updateEducationList: (education: ResumeEducation[]) => void;
  removeEducation: (id: string) => void;
}

export function EducationSection({
  content,
  addEducation,
  updateEducation,
  updateEducationList,
  removeEducation,
}: EducationSectionProps) {
  return (
    <AccordionItem
      value="education"
      className="bg-card border-border hover:border-primary/20 overflow-hidden rounded-none border shadow-sm transition-all"
    >
      <AccordionTrigger
        asChild
        className="data-[state=open]:bg-muted/30 px-5 hover:no-underline"
      >
        <div className="flex w-full cursor-pointer items-center justify-between pr-4">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-none">
              <GraduationCap className="h-4 w-4" />
            </div>
            <span className="text-foreground font-semibold tracking-tight">
              Education
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                addEducation();
              }}
              className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground flex h-8 w-8 items-center justify-center rounded-none transition-all"
              title="Add Education"
            >
              <Plus className="h-4 w-4" />
            </div>
            <ChevronDown className="text-muted-foreground h-4 w-4 transition-transform duration-200 group-data-[state=open]/accordion-trigger:rotate-180" />
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-5 pt-2 pb-6">
        <div className="flex w-full flex-col gap-6">
          <Sortable
            value={content.education}
            onValueChange={updateEducationList}
            getItemValue={(e) => e.id}
          >
            <SortableContent className="flex w-full flex-col gap-4">
              <Accordion type="single" collapsible className="w-full space-y-4">
                {content.education.map((edu: ResumeEducation) => (
                  <SortableItem key={edu.id} value={edu.id} asChild>
                    <AccordionItem
                      id={`education-${edu.id}`}
                      value={edu.id}
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
                                {edu.institution || "Nama Institusi"}
                              </span>
                              <span className="text-muted-foreground text-xs font-medium">
                                {edu.degree || "Gelar / Sertifikasi"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-muted-foreground text-[10px] font-medium uppercase">
                                {formatResumeDate(edu.startYear) || "Mulai"} —{" "}
                                {formatResumeDate(edu.endYear) || "Selesai"}
                              </div>
                              <div
                                role="button"
                                tabIndex={0}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeEducation(edu.id);
                                }}
                                className="hover:bg-destructive/10 hover:text-destructive text-muted-foreground flex h-8 w-8 items-center justify-center transition-colors"
                                title="Hapus Edukasi"
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
                              Institusi / Sekolah
                            </Label>
                            <Input
                              value={edu.institution || ""}
                              onChange={(e) =>
                                updateEducation(edu.id, {
                                  institution: e.target.value,
                                })
                              }
                              className="bg-background border-border"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-muted-foreground text-xs font-medium uppercase">
                              Gelar / Sertifikasi
                            </Label>
                            <Input
                              value={edu.degree || ""}
                              onChange={(e) =>
                                updateEducation(edu.id, {
                                  degree: e.target.value,
                                })
                              }
                              className="bg-background border-border"
                              placeholder="Misal: Sarjana Komputer"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-muted-foreground text-xs font-medium uppercase">
                              Bidang Studi / Jurusan
                            </Label>
                            <Input
                              value={edu.major || ""}
                              onChange={(e) =>
                                updateEducation(edu.id, {
                                  major: e.target.value,
                                })
                              }
                              className="bg-background border-border"
                              placeholder="Misal: Teknik Informatika"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-muted-foreground text-xs font-medium uppercase">
                              IPK / Nilai (Opsional)
                            </Label>
                            <Input
                              value={edu.gpa || ""}
                              onChange={(e) =>
                                updateEducation(edu.id, { gpa: e.target.value })
                              }
                              className="bg-background border-border"
                              placeholder="3.8/4.0"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-muted-foreground text-xs font-medium uppercase">
                              Bulan/Tahun Mulai
                            </Label>
                            <div className="relative">
                              <Input
                                value={formatResumeDate(edu.startYear) || ""}
                                onChange={(e) =>
                                  updateEducation(edu.id, {
                                    startYear: e.target.value,
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
                                      edu.startYear
                                        ? (() => {
                                            const d = parse(
                                              edu.startYear,
                                              "MMM yyyy",
                                              new Date(),
                                              { locale: enUS },
                                            );
                                            if (!isNaN(d.getTime())) return d;
                                            return parse(
                                              edu.startYear,
                                              "MMMM yyyy",
                                              new Date(),
                                              { locale: enUS },
                                            );
                                          })()
                                        : undefined
                                    }
                                    onMonthSelect={(date) => {
                                      if (date) {
                                        updateEducation(edu.id, {
                                          startYear: format(date, "MMM yyyy", {
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
                              Bulan/Tahun Lulus
                            </Label>
                            <div className="relative">
                              <Input
                                value={formatResumeDate(edu.endYear) || ""}
                                onChange={(e) =>
                                  updateEducation(edu.id, {
                                    endYear: e.target.value,
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
                                      edu.endYear
                                        ? (() => {
                                            const d = parse(
                                              edu.endYear,
                                              "MMM yyyy",
                                              new Date(),
                                              { locale: enUS },
                                            );
                                            if (!isNaN(d.getTime())) return d;
                                            return parse(
                                              edu.endYear,
                                              "MMMM yyyy",
                                              new Date(),
                                              { locale: enUS },
                                            );
                                          })()
                                        : undefined
                                    }
                                    onMonthSelect={(date) => {
                                      if (date) {
                                        updateEducation(edu.id, {
                                          endYear: format(date, "MMM yyyy", {
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
                              Deskripsi (Opsional)
                            </Label>
                            <Editor
                              initialDescription={
                                typeof edu.description === "string"
                                  ? edu.description
                                  : Array.isArray(edu.description)
                                    ? `<ul>${edu.description.map((item) => `<li>${item.text}</li>`).join("")}</ul>`
                                    : undefined
                              }
                              onSerializedChange={(serialized) =>
                                updateEducation(edu.id, { description: JSON.stringify(serialized) })
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
          {content.education.length === 0 && (
            <EmptyState message="Belum ada edukasi" onAdd={addEducation} />
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
