"use client";

import {
  GraduationCap,
  Plus,
  Trash2,
  Calendar as CalendarIcon,
  GripVertical,
} from "lucide-react";
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
import type { ResumeContent, ResumeEducation } from "@/types/resume";
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
        nativeButton={false}
        render={<div />}
        className="data-[state=open]:bg-muted/30 px-5 py-5 hover:no-underline"
      >
        <div className="flex w-full items-center justify-between pr-4">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-none">
              <GraduationCap className="h-4 w-4" />
            </div>
            <span className="text-foreground font-semibold tracking-tight">
              Edukasi
            </span>
          </div>
          <div
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              addEducation();
            }}
            className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground flex h-8 w-8 items-center justify-center rounded-none transition-all"
            title="Tambah Edukasi"
          >
            <Plus className="h-4 w-4" />
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-5 pt-2 pb-6">
        <div className="flex flex-col gap-6">
          <Sortable
            value={content.education}
            onValueChange={updateEducationList}
            getItemValue={(e) => e.id}
          >
            <SortableContent className="flex flex-col gap-6">
              {content.education.map((edu: ResumeEducation) => (
                <SortableItem key={edu.id} value={edu.id}>
                  <Card className="bg-muted/20 border-border relative overflow-hidden rounded-none">
                    <div className="bg-muted/50 border-border/50 flex items-center justify-between border-b px-6 py-2">
                      <SortableItemHandle
                        asChild
                        className="text-muted-foreground hover:text-primary cursor-grab transition-colors"
                      >
                        <GripVertical className="h-4 w-4" />
                      </SortableItemHandle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeEducation(edu.id)}
                        className="hover:bg-destructive/10 hover:text-destructive text-muted-foreground h-7 w-7 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <CardContent className="p-6">
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
                              updateEducation(edu.id, { major: e.target.value })
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
                          <Popover>
                            <PopoverTrigger
                              render={
                                <div className="relative">
                                  <Input
                                    readOnly
                                    value={edu.startYear || ""}
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
                                  edu.startYear
                                    ? parse(
                                        edu.startYear,
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
                                    updateEducation(edu.id, {
                                      startYear: format(date, "MMMM yyyy", {
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
                            Bulan/Tahun Lulus
                          </Label>
                          <Popover>
                            <PopoverTrigger
                              render={
                                <div className="relative">
                                  <Input
                                    readOnly
                                    value={edu.endYear || ""}
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
                                  edu.endYear
                                    ? parse(
                                        edu.endYear,
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
                                    updateEducation(edu.id, {
                                      endYear: format(date, "MMMM yyyy", {
                                        locale: id,
                                      }),
                                    });
                                  }
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </SortableItem>
              ))}
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
