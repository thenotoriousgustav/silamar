"use client";

import { GraduationCap, Plus, Trash2, Calendar as CalendarIcon } from "lucide-react";
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

interface EducationSectionProps {
  content: ResumeContent;
  addEducation: () => void;
  updateEducation: (id: string, data: Partial<ResumeEducation>) => void;
  removeEducation: (id: string) => void;
}

export function EducationSection({
  content,
  addEducation,
  updateEducation,
  removeEducation,
}: EducationSectionProps) {
  return (
    <AccordionItem
      value="education"
      className="bg-card border-border hover:border-primary/20 overflow-hidden rounded-none border shadow-sm transition-all"
    >
      <AccordionTrigger className="data-[state=open]:bg-muted/30 px-5 py-5 hover:no-underline">
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
          {content.education.map((edu: ResumeEducation) => (
            <Card
              key={edu.id}
              className="bg-muted/20 border-border relative overflow-hidden rounded-none"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeEducation(edu.id)}
                className="hover:bg-destructive/10 hover:text-destructive text-muted-foreground absolute top-2 right-2 h-8 w-8"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs font-medium uppercase">
                      Institusi
                    </Label>
                    <Input
                      value={edu.institution}
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
                      Gelar
                    </Label>
                    <Input
                      value={edu.degree}
                      onChange={(e) =>
                        updateEducation(edu.id, { degree: e.target.value })
                      }
                      placeholder="S1"
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs font-medium uppercase">
                      Jurusan
                    </Label>
                    <Input
                      value={edu.major}
                      onChange={(e) =>
                        updateEducation(edu.id, { major: e.target.value })
                      }
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs font-medium uppercase">
                      GPA (Opsional)
                    </Label>
                    <Input
                      value={edu.gpa}
                      onChange={(e) =>
                        updateEducation(edu.id, { gpa: e.target.value })
                      }
                      placeholder="3.85 / 4.00"
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
                              value={edu.startYear}
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
                            edu.startYear
                              ? parse(
                                  edu.startYear,
                                  "MMMM yyyy",
                                  new Date(),
                                  { locale: id },
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
                      Bulan/Tahun Selesai
                    </Label>
                    <Popover>
                      <PopoverTrigger
                        nativeButton={false}
                        render={
                          <div className="relative">
                            <Input
                              readOnly
                              value={edu.endYear}
                              placeholder="Pilih bulan & tahun"
                              className="bg-background border-border focus:ring-primary/50 cursor-pointer pr-10 focus:ring-1"
                              disabled={edu.isCurrentlyStudying}
                            />
                            <CalendarIcon className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
                          </div>
                        }
                      />
                      <PopoverContent className="w-auto p-0" align="start">
                        <MonthPicker
                          selectedMonth={
                            edu.endYear
                              ? parse(
                                  edu.endYear,
                                  "MMMM yyyy",
                                  new Date(),
                                  { locale: id },
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

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-muted-foreground text-xs font-medium uppercase">
                      Pencapaian / Aktivitas
                    </Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const current = edu.description || [];
                        updateEducation(edu.id, {
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
                    {(edu.description || []).map((bullet, idx) => (
                      <div
                        key={idx}
                        className="group flex items-start gap-2"
                      >
                        <div className="bg-primary/20 text-primary mt-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-none text-[10px] font-bold">
                          {idx + 1}
                        </div>
                        <div className="relative flex-1">
                          <textarea
                            value={bullet}
                            onChange={(e) => {
                              const newDesc = [...(edu.description || [])];
                              newDesc[idx] = e.target.value;
                              updateEducation(edu.id, {
                                description: newDesc,
                              });
                            }}
                            placeholder="Contoh: Lulus dengan predikat Cum Laude atau Aktif di organisasi mahasiswa..."
                            className="bg-background border-border focus:border-primary/50 custom-scrollbar min-h-15 w-full resize-none rounded-none border p-3 text-sm transition-all focus:ring-0"
                            rows={2}
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const newDesc = [...(edu.description || [])];
                            newDesc.splice(idx, 1);
                            updateEducation(edu.id, {
                              description: newDesc,
                            });
                          }}
                          className="hover:bg-destructive/10 hover:text-destructive text-muted-foreground h-8 w-8 shrink-0 opacity-0 transition-all group-hover:opacity-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                    {(edu.description || []).length === 0 && (
                      <p className="text-muted-foreground py-2 text-center text-xs italic">
                        Belum ada pencapaian yang ditambahkan.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {content.education.length === 0 && (
            <EmptyState
              message="Belum ada data edukasi"
              onAdd={addEducation}
            />
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
