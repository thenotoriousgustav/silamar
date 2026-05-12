"use client";

import {
  Briefcase,
  Plus,
  Trash2,
  Calendar as CalendarIcon,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Loader2,
  FileText,
  TrendingUp,
  SpellCheck,
  GripVertical,
} from "lucide-react";
import { format, parse } from "date-fns";
import { enUS, id } from "date-fns/locale";
import { cn, formatResumeDate } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MonthPicker } from "@/components/ui/monthpicker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Editor } from "@/components/editor/rich-text-editor";
import type {
  ResumeContent,
  ResumeExperience,
} from "@/features/resumes-list/types/resume";
import { EmptyState } from "./empty-state";
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
} from "@/components/ui/sortable";

interface ExperienceSectionProps {
  content: ResumeContent;
  addExperience: () => void;
  updateExperience: (id: string, data: Partial<ResumeExperience>) => void;
  removeExperience: (id: string) => void;
  updateExperienceList: (experience: ResumeExperience[]) => void;
  handleOptimize: (
    expId: string,
    idx: number,
    text: string,
    type: "optimize" | "quantify" | "grammar",
  ) => void;
  optimizingId: string | null;
}

export function ExperienceSection({
  content,
  addExperience,
  updateExperience,
  removeExperience,
  updateExperienceList,
  handleOptimize,
  optimizingId,
}: ExperienceSectionProps) {
  const lang = content.style?.language || "id";

  return (
    <AccordionItem
      value="experience"
      className="bg-card border-border hover:border-primary/20 overflow-hidden rounded-none border shadow-sm transition-all"
    >
      <AccordionTrigger
        asChild
        className="data-[state=open]:bg-muted/30 px-5 hover:no-underline"
      >
        <div className="flex w-full cursor-pointer items-center justify-between pr-4">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-none">
              <Briefcase className="h-4 w-4" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-foreground font-semibold tracking-tight">
                Work Experience
              </span>
              <p className="text-muted-foreground text-[10px]">
                {content.experience.length} Items • Click to expand
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                addExperience();
              }}
              className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground flex h-8 w-8 items-center justify-center rounded-none transition-all"
              title="Tambah Pengalaman"
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
            value={content.experience}
            onValueChange={updateExperienceList}
            getItemValue={(e) => e.id}
          >
            <SortableContent className="flex w-full flex-col gap-4">
              <Accordion type="single" collapsible className="w-full space-y-4">
                {content.experience.map((exp: ResumeExperience) => (
                  <SortableItem key={exp.id} value={exp.id} asChild>
                    <AccordionItem
                      id={`experience-${exp.id}`}
                      value={exp.id}
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
                            <div className="flex flex-col gap-1">
                              <span className="text-foreground text-sm font-bold">
                                {exp.company || "Nama Perusahaan"}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground text-[10px]">
                                  {exp.position ||
                                    (lang === "id" ? "Posisi" : "Position")}
                                  {exp.employmentType &&
                                    ` • ${exp.employmentType}`}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-muted-foreground text-[10px] font-medium uppercase">
                                {formatResumeDate(exp.startDate) ||
                                  (lang === "id" ? "Mulai" : "Start")}{" "}
                                —{" "}
                                {exp.isCurrentJob
                                  ? "Present"
                                  : formatResumeDate(exp.endDate) ||
                                    (lang === "id" ? "Selesai" : "End")}
                              </div>
                              <div
                                role="button"
                                tabIndex={0}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeExperience(exp.id);
                                }}
                                className="hover:bg-destructive/10 hover:text-destructive text-muted-foreground flex h-8 w-8 items-center justify-center transition-colors"
                                title="Hapus Pengalaman"
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
                              {lang === "id" ? "Perusahaan" : "Company"}
                            </Label>
                            <Input
                              value={exp.company || ""}
                              onChange={(e) =>
                                updateExperience(exp.id, {
                                  company: e.target.value,
                                })
                              }
                              className="bg-background border-border"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-muted-foreground text-xs font-medium uppercase">
                              {lang === "id" ? "Posisi" : "Position"}
                            </Label>
                            <Input
                              value={exp.position || ""}
                              onChange={(e) =>
                                updateExperience(exp.id, {
                                  position: e.target.value,
                                })
                              }
                              className="bg-background border-border"
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label className="text-muted-foreground text-xs font-medium uppercase">
                              {lang === "id"
                                ? "Tipe Pekerjaan"
                                : "Employment Type"}
                            </Label>
                            <Input
                              value={exp.employmentType || ""}
                              onChange={(e) =>
                                updateExperience(exp.id, {
                                  employmentType: e.target.value,
                                })
                              }
                              placeholder={
                                lang === "id"
                                  ? "Contoh: Full-time, Remote, dll."
                                  : "Example: Full-time, Remote, etc."
                              }
                              className="bg-background border-border"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-muted-foreground text-xs font-medium uppercase">
                              {lang === "id" ? "Tanggal Mulai" : "Start Date"}
                            </Label>
                            <div className="relative">
                              <Input
                                value={formatResumeDate(exp.startDate) || ""}
                                onChange={(e) =>
                                  updateExperience(exp.id, {
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
                                      exp.startDate
                                        ? (() => {
                                            const d = parse(
                                              exp.startDate,
                                              "MMM yyyy",
                                              new Date(),
                                              { locale: enUS },
                                            );
                                            if (!isNaN(d.getTime())) return d;
                                            return parse(
                                              exp.startDate,
                                              "MMMM yyyy",
                                              new Date(),
                                              { locale: enUS },
                                            );
                                          })()
                                        : undefined
                                    }
                                    onMonthSelect={(date) => {
                                      if (date) {
                                        updateExperience(exp.id, {
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
                              {lang === "id" ? "Tanggal Selesai" : "End Date"}
                            </Label>
                            <div className="relative">
                              <Input
                                value={
                                  exp.isCurrentJob
                                    ? "Present"
                                    : formatResumeDate(exp.endDate) || ""
                                }
                                disabled={exp.isCurrentJob}
                                onChange={(e) =>
                                  updateExperience(exp.id, {
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
                                    disabled={exp.isCurrentJob}
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
                                      exp.endDate
                                        ? (() => {
                                            const d = parse(
                                              exp.endDate,
                                              "MMM yyyy",
                                              new Date(),
                                              { locale: enUS },
                                            );
                                            if (!isNaN(d.getTime())) return d;
                                            return parse(
                                              exp.endDate,
                                              "MMMM yyyy",
                                              new Date(),
                                              { locale: enUS },
                                            );
                                          })()
                                        : undefined
                                    }
                                    onMonthSelect={(date) => {
                                      if (date) {
                                        updateExperience(exp.id, {
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
                          <div className="flex items-center space-x-2 py-1 md:col-span-2">
                            <Checkbox
                              id={`current-${exp.id}`}
                              checked={exp.isCurrentJob}
                              onCheckedChange={(checked) =>
                                updateExperience(exp.id, {
                                  isCurrentJob: !!checked,
                                  endDate: checked ? "" : exp.endDate,
                                })
                              }
                            />
                            <Label
                              htmlFor={`current-${exp.id}`}
                              className="text-xs leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {lang === "id"
                                ? "Masih bekerja disini"
                                : "Currently working here"}
                            </Label>
                          </div>

                          <div className="space-y-4 md:col-span-2">
                            <Label className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                              {lang === "id"
                                ? "Deskripsi & Pencapaian"
                                : "Key Responsibilities & Achievements"}
                            </Label>
                            <Editor
                              initialDescription={
                                typeof exp.description === "string"
                                  ? exp.description
                                  : Array.isArray(exp.description)
                                    ? `<ul>${exp.description.map((item) => `<li>${item.text}</li>`).join("")}</ul>`
                                    : undefined
                              }
                              onSerializedChange={(serialized) =>
                                updateExperience(exp.id, { description: JSON.stringify(serialized) })
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
          {content.experience.length === 0 && (
            <EmptyState
              message="Belum ada pengalaman kerja"
              onAdd={addExperience}
            />
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
