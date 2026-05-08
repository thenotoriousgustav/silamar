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
import { cn } from "@/lib/utils";
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
import type {
  ResumeContent,
  ResumeExperience,
} from "@/features/resumes/types/resume";
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
                                  {exp.position || "Posisi"}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-muted-foreground text-[10px] font-medium uppercase">
                                {exp.startDate || "Mulai"} —{" "}
                                {exp.isCurrentJob
                                  ? "Present"
                                  : exp.endDate || "Selesai"}
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
                              Perusahaan
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
                              Posisi
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
                          <div className="space-y-2">
                            <Label className="text-muted-foreground text-xs font-medium uppercase">
                              Tanggal Mulai
                            </Label>
                            <div className="relative">
                              <Input
                                value={exp.startDate || ""}
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
                              Tanggal Selesai
                            </Label>
                            <div className="relative">
                              <Input
                                value={exp.isCurrentJob ? "Present" : exp.endDate || ""}
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
                              Masih bekerja disini
                            </Label>
                          </div>

                          <div className="space-y-4 md:col-span-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                                {lang === "id"
                                  ? "Deskripsi & Pencapaian"
                                  : "Key Responsibilities & Achievements"}
                              </Label>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const bullets = [...(exp.description || [])];
                                  bullets.push({
                                    id: crypto.randomUUID(),
                                    text: "",
                                  });
                                  updateExperience(exp.id, {
                                    description: bullets,
                                  });
                                }}
                                className="h-7 gap-1 px-2 text-[10px] font-bold"
                              >
                                <Plus className="h-3 w-3" /> Add Bullet
                              </Button>
                            </div>

                            <Sortable
                              value={exp.description || []}
                              onValueChange={(newBullets) => {
                                updateExperience(exp.id, {
                                  description: newBullets,
                                });
                              }}
                              getItemValue={(item) => item.id}
                            >
                              <SortableContent className="space-y-2">
                                {(exp.description || []).map((bullet, idx) => (
                                  <SortableItem
                                    key={bullet.id}
                                    value={bullet.id}
                                    className="bg-background group flex items-start gap-2"
                                  >
                                    <SortableItemHandle
                                      asChild
                                      className="text-muted-foreground hover:text-primary mt-2.5 cursor-grab transition-colors"
                                    >
                                      <GripVertical className="h-3.5 w-3.5" />
                                    </SortableItemHandle>
                                    <Input
                                      value={bullet.text || ""}
                                      onChange={(e) => {
                                        const newBullets = [
                                          ...(exp.description || []),
                                        ];
                                        newBullets[idx] = {
                                          ...newBullets[idx],
                                          text: e.target.value,
                                        };
                                        updateExperience(exp.id, {
                                          description: newBullets,
                                        });
                                      }}
                                      placeholder={
                                        lang === "id"
                                          ? "Contoh: Meningkatkan efisiensi sistem sebesar 20%..."
                                          : "Example: Improved system efficiency by 20%..."
                                      }
                                      className="bg-background border-border h-9 text-sm"
                                    />
                                    <div className="border-border bg-background flex shrink-0 items-center overflow-hidden rounded-none border shadow-sm">
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            disabled={
                                              optimizingId ===
                                              `${exp.id}-${idx}`
                                            }
                                            className="text-brand-500 hover:bg-brand-500/10 hover:text-brand-600 h-8 w-8 rounded-none border-r"
                                            title="AI Assistant"
                                          >
                                            {optimizingId ===
                                            `${exp.id}-${idx}` ? (
                                              <Loader2 className="h-3 w-3 animate-spin" />
                                            ) : (
                                              <Sparkles className="h-3 w-3" />
                                            )}
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                          align="start"
                                          className="w-56"
                                        >
                                          <DropdownMenuItem
                                            onClick={() =>
                                              handleOptimize(
                                                exp.id,
                                                idx,
                                                bullet.text,
                                                "optimize",
                                              )
                                            }
                                            className="gap-2 py-2"
                                          >
                                            <FileText className="text-brand-500 h-4 w-4" />
                                            <div>
                                              <p className="text-xs font-bold">
                                                Optimalkan Kalimat
                                              </p>
                                              <p className="text-muted-foreground text-[10px]">
                                                Gunakan kata kerja yang lebih
                                                kuat
                                              </p>
                                            </div>
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            onClick={() =>
                                              handleOptimize(
                                                exp.id,
                                                idx,
                                                bullet.text,
                                                "quantify",
                                              )
                                            }
                                            className="gap-2 py-2"
                                          >
                                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                                            <div>
                                              <p className="text-xs font-bold">
                                                Tambahkan Metrik
                                              </p>
                                              <p className="text-muted-foreground text-[10px]">
                                                Sertakan angka pencapaian
                                              </p>
                                            </div>
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            onClick={() =>
                                              handleOptimize(
                                                exp.id,
                                                idx,
                                                bullet.text,
                                                "grammar",
                                              )
                                            }
                                            className="gap-2 py-2"
                                          >
                                            <SpellCheck className="h-4 w-4 text-amber-500" />
                                            <div>
                                              <p className="text-xs font-bold">
                                                Perbaiki Grammar
                                              </p>
                                              <p className="text-muted-foreground text-[10px]">
                                                Cek typo dan tata bahasa
                                              </p>
                                            </div>
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                          const newBullets =
                                            exp.description.filter(
                                              (_, i) => i !== idx,
                                            );
                                          updateExperience(exp.id, {
                                            description:
                                              newBullets.length > 0
                                                ? newBullets
                                                : [
                                                    {
                                                      id: crypto.randomUUID(),
                                                      text: "",
                                                    },
                                                  ],
                                          });
                                        }}
                                        className="hover:text-destructive h-8 w-8 rounded-none"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </SortableItem>
                                ))}
                              </SortableContent>
                            </Sortable>
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
