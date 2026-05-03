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
import { id } from "date-fns/locale";
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
import { Card, CardContent } from "@/components/ui/card";
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
import type { ResumeContent, ResumeExperience } from "@/types/resume";
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
        nativeButton={false}
        render={<div />}
        className="data-[state=open]:bg-muted/30 px-5 py-5 hover:no-underline"
      >
        <div className="flex w-full items-center justify-between pr-4">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-none">
              <Briefcase className="h-4 w-4" />
            </div>
            <span className="text-foreground font-semibold tracking-tight">
              Pengalaman Kerja
            </span>
          </div>
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
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-5 pt-2 pb-6">
        <div className="flex flex-col gap-6">
          <Sortable
            value={content.experience}
            onValueChange={updateExperienceList}
            getItemValue={(e) => e.id}
          >
            <SortableContent className="flex flex-col gap-4">
              <Accordion className="w-full space-y-4">
                {content.experience.map((exp: ResumeExperience) => (
                  <SortableItem key={exp.id} value={exp.id}>
                    <AccordionItem
                      value={exp.id}
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
                                {exp.company || "Nama Perusahaan"}
                              </span>
                              <span className="text-muted-foreground text-xs font-medium">
                                {exp.position || "Posisi / Jabatan"}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
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
                            <Popover>
                              <PopoverTrigger
                                render={
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "bg-background border-border w-full justify-start text-left font-normal",
                                      !exp.startDate && "text-muted-foreground",
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {exp.startDate ? (
                                      exp.startDate
                                    ) : (
                                      <span>Pilih tanggal</span>
                                    )}
                                  </Button>
                                }
                              />
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <MonthPicker
                                  selectedMonth={
                                    exp.startDate
                                      ? parse(
                                          exp.startDate,
                                          "MMMM yyyy",
                                          new Date(),
                                          {
                                            locale: id,
                                          },
                                        )
                                      : undefined
                                  }
                                  onMonthSelect={(date) => {
                                    if (date) {
                                      updateExperience(exp.id, {
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
                              Tanggal Selesai
                            </Label>
                            <Popover>
                              <PopoverTrigger
                                render={
                                  <Button
                                    variant="outline"
                                    disabled={exp.isCurrentJob}
                                    className={cn(
                                      "bg-background border-border w-full justify-start text-left font-normal",
                                      !exp.endDate && "text-muted-foreground",
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {exp.isCurrentJob ? (
                                      "Present"
                                    ) : exp.endDate ? (
                                      exp.endDate
                                    ) : (
                                      <span>Pilih tanggal</span>
                                    )}
                                  </Button>
                                }
                              />
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <MonthPicker
                                  selectedMonth={
                                    exp.endDate
                                      ? parse(
                                          exp.endDate,
                                          "MMMM yyyy",
                                          new Date(),
                                          {
                                            locale: id,
                                          },
                                        )
                                      : undefined
                                  }
                                  onMonthSelect={(date) => {
                                    if (date) {
                                      updateExperience(exp.id, {
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
                                  bullets.push("");
                                  updateExperience(exp.id, {
                                    description: bullets,
                                  });
                                }}
                                className="h-7 gap-1 px-2 text-[10px] font-bold"
                              >
                                <Plus className="h-3 w-3" /> Add Bullet
                              </Button>
                            </div>

                            <div className="space-y-2">
                              {(() => {
                                const bullets = Array.isArray(exp.description)
                                  ? exp.description
                                  : exp.description
                                    ? [exp.description]
                                    : [];

                                return bullets.map((bullet, idx) => (
                                  <div
                                    key={`${exp.id}-bullet-${idx}`}
                                    className="group flex items-start gap-2"
                                  >
                                    <span className="text-muted-foreground mt-2.5 w-4 text-[10px] font-bold">
                                      {idx + 1}.
                                    </span>
                                    <Input
                                      value={bullet || ""}
                                      onChange={(e) => {
                                        const newBullets = [...bullets];
                                        newBullets[idx] = e.target.value;
                                        const field =
                                          lang === "id"
                                            ? "descriptionId"
                                            : "descriptionEn";
                                        updateExperience(exp.id, {
                                          [field]: newBullets,
                                          description:
                                            lang === "id"
                                              ? newBullets
                                              : exp.description,
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
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        disabled={idx === 0}
                                        onClick={() => {
                                          const newBullets = [...bullets];
                                          [
                                            newBullets[idx - 1],
                                            newBullets[idx],
                                          ] = [
                                            newBullets[idx],
                                            newBullets[idx - 1],
                                          ];
                                          const field =
                                            lang === "id"
                                              ? "descriptionId"
                                              : "descriptionEn";
                                          updateExperience(exp.id, {
                                            [field]: newBullets,
                                            description:
                                              lang === "id"
                                                ? newBullets
                                                : exp.description,
                                          });
                                        }}
                                        className="border-border h-8 w-8 rounded-none border-r"
                                      >
                                        <ChevronUp className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        disabled={idx === bullets.length - 1}
                                        onClick={() => {
                                          const newBullets = [...bullets];
                                          [
                                            newBullets[idx],
                                            newBullets[idx + 1],
                                          ] = [
                                            newBullets[idx + 1],
                                            newBullets[idx],
                                          ];
                                          const field =
                                            lang === "id"
                                              ? "descriptionId"
                                              : "descriptionEn";
                                          updateExperience(exp.id, {
                                            [field]: newBullets,
                                            description:
                                              lang === "id"
                                                ? newBullets
                                                : exp.description,
                                          });
                                        }}
                                        className="border-border h-8 w-8 rounded-none border-r"
                                      >
                                        <ChevronDown className="h-3 w-3" />
                                      </Button>
                                      <DropdownMenu>
                                        <DropdownMenuTrigger
                                          render={
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
                                          }
                                        />
                                        <DropdownMenuContent
                                          align="start"
                                          className="w-56"
                                        >
                                          <DropdownMenuItem
                                            onClick={() =>
                                              handleOptimize(
                                                exp.id,
                                                idx,
                                                bullet,
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
                                                bullet,
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
                                                bullet,
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
                                          const newBullets = bullets.filter(
                                            (_, i) => i !== idx,
                                          );
                                          const field =
                                            lang === "id"
                                              ? "descriptionId"
                                              : "descriptionEn";
                                          updateExperience(exp.id, {
                                            [field]:
                                              newBullets.length > 0
                                                ? newBullets
                                                : [""],
                                            description:
                                              lang === "id"
                                                ? newBullets.length > 0
                                                  ? newBullets
                                                  : [""]
                                                : exp.description,
                                          });
                                        }}
                                        className="hover:text-destructive h-8 w-8 rounded-none"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                ));
                              })()}
                            </div>
                            {(exp.description || []).length > 0 && (
                              <p className="text-muted-foreground text-[10px] italic">
                                * Kamu bisa memindahkan urutan atau menghapus
                                poin pencapaian dengan tombol di samping.
                              </p>
                            )}
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
