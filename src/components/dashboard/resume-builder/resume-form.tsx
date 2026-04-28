"use client";

import { useState } from "react";
import {
  User,
  Briefcase,
  GraduationCap,
  Code2,
  Plus,
  Trash2,
  Settings2,
  Languages,
  ChevronUp,
  ChevronDown,
  Calendar as CalendarIcon,
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import type {
  ResumeContent,
  ResumeExperience,
  ResumeEducation,
  ResumeProject,
} from "@/types/resume";

interface ResumeFormProps {
  content: ResumeContent;
  updatePersonalInfo: (info: Partial<ResumeContent["personalInfo"]>) => void;
  addExperience: () => void;
  updateExperience: (id: string, data: Partial<ResumeExperience>) => void;
  removeExperience: (id: string) => void;
  addEducation: () => void;
  updateEducation: (id: string, data: Partial<ResumeEducation>) => void;
  removeEducation: (id: string) => void;
  addProject: () => void;
  updateProject: (id: string, data: Partial<ResumeProject>) => void;
  removeProject: (id: string) => void;
  updateSkills: (skills: string[]) => void;
  updateStyle: (style: Partial<ResumeContent["style"]>) => void;
}

export function ResumeForm({
  content,
  updatePersonalInfo,
  addExperience,
  updateExperience,
  removeExperience,
  addEducation,
  updateEducation,
  removeEducation,
  addProject,
  updateProject,
  removeProject,
  updateSkills,
  updateStyle,
}: ResumeFormProps) {
  const lang = content.style?.language || "id";

  return (
    <div className="custom-scrollbar flex h-full flex-col gap-6 overflow-y-auto p-6">
      <Accordion
        defaultValue={["personal"]}
        multiple
        className="w-full space-y-4 border-none"
      >
        {/* Section: Personal Info */}
        <AccordionItem
          value="personal"
          className="bg-card border-border hover:border-primary/20 overflow-hidden rounded-2xl border shadow-sm transition-all"
        >
          <AccordionTrigger className="data-[state=open]:bg-muted/30 px-5 py-5 hover:no-underline">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-xl">
                <User className="h-4 w-4" />
              </div>
              <span className="text-foreground font-semibold tracking-tight">
                Informasi Pribadi
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pt-2 pb-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="fullName"
                  className="text-muted-foreground text-xs font-medium tracking-wider uppercase"
                >
                  Nama Lengkap
                </Label>
                <Input
                  id="fullName"
                  value={content.personalInfo.fullName}
                  onChange={(e) =>
                    updatePersonalInfo({ fullName: e.target.value })
                  }
                  placeholder="John Doe"
                  className="bg-background border-border focus:border-primary focus:ring-primary transition-all focus:ring-1"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-muted-foreground text-xs font-medium tracking-wider uppercase"
                >
                  Gelar / Posisi
                </Label>
                <Input
                  id="title"
                  value={content.personalInfo.title}
                  onChange={(e) =>
                    updatePersonalInfo({ title: e.target.value })
                  }
                  placeholder="Senior Frontend Developer"
                  className="bg-background border-border focus:border-primary focus:ring-primary transition-all focus:ring-1"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-muted-foreground text-xs font-medium tracking-wider uppercase"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={content.personalInfo.email}
                  onChange={(e) =>
                    updatePersonalInfo({ email: e.target.value })
                  }
                  placeholder="john@example.com"
                  className="bg-background border-border focus:border-primary focus:ring-primary transition-all focus:ring-1"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-muted-foreground text-xs font-medium tracking-wider uppercase"
                >
                  Nomor Telepon
                </Label>
                <Input
                  id="phone"
                  value={content.personalInfo.phone}
                  onChange={(e) =>
                    updatePersonalInfo({ phone: e.target.value })
                  }
                  placeholder="+62 812 3456 7890"
                  className="bg-background border-border focus:border-primary focus:ring-primary transition-all focus:ring-1"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="location"
                  className="text-muted-foreground text-xs font-medium tracking-wider uppercase"
                >
                  Lokasi
                </Label>
                <Input
                  id="location"
                  value={content.personalInfo.location}
                  onChange={(e) =>
                    updatePersonalInfo({ location: e.target.value })
                  }
                  placeholder="Jakarta, Indonesia"
                  className="bg-background border-border focus:border-primary focus:ring-primary transition-all focus:ring-1"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="website"
                  className="text-muted-foreground text-xs font-medium tracking-wider uppercase"
                >
                  Website / Portfolio (Opsional)
                </Label>
                <Input
                  id="website"
                  value={content.personalInfo.website}
                  onChange={(e) =>
                    updatePersonalInfo({ website: e.target.value })
                  }
                  placeholder="https://johndoe.com"
                  className="bg-background border-border focus:border-primary focus:ring-primary transition-all focus:ring-1"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label
                  htmlFor="summary"
                  className="text-muted-foreground text-xs font-medium tracking-wider uppercase"
                >
                  Ringkasan Profesional
                </Label>
                <Textarea
                  id="summary"
                  value={content.personalInfo.summary}
                  onChange={(e) =>
                    updatePersonalInfo({ summary: e.target.value })
                  }
                  placeholder="Ceritakan singkat tentang pengalaman dan keahlianmu..."
                  className="bg-background border-border focus:border-primary focus:ring-primary min-h-24 transition-all focus:ring-1"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section: Experience */}
        <AccordionItem
          value="experience"
          className="bg-card border-border hover:border-primary/20 overflow-hidden rounded-2xl border shadow-sm transition-all"
        >
          <AccordionTrigger className="data-[state=open]:bg-muted/30 px-5 py-5 hover:no-underline">
            <div className="flex w-full items-center justify-between pr-4">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-xl">
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
                className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg transition-all"
                title="Tambah Pengalaman"
              >
                <Plus className="h-4 w-4" />
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pt-2 pb-6">
            <div className="flex flex-col gap-6">
              {content.experience.map((exp: ResumeExperience) => (
                <Card
                  key={exp.id}
                  className="bg-muted/20 border-border relative overflow-hidden rounded-xl"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeExperience(exp.id)}
                    className="hover:bg-destructive/10 hover:text-destructive text-muted-foreground absolute top-2 right-2 h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-muted-foreground text-xs font-medium uppercase">
                          Perusahaan
                        </Label>
                        <Input
                          value={exp.company}
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
                          value={exp.position}
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
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={
                                exp.startDate
                                  ? parse(
                                      exp.startDate,
                                      "MMMM yyyy",
                                      new Date(),
                                      { locale: id },
                                    )
                                  : undefined
                              }
                              onSelect={(date) => {
                                if (date) {
                                  updateExperience(exp.id, {
                                    startDate: format(date, "MMMM yyyy", {
                                      locale: id,
                                    }),
                                  });
                                }
                              }}
                              initialFocus
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
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={
                                exp.endDate
                                  ? parse(
                                      exp.endDate,
                                      "MMMM yyyy",
                                      new Date(),
                                      { locale: id },
                                    )
                                  : undefined
                              }
                              onSelect={(date) => {
                                if (date) {
                                  updateExperience(exp.id, {
                                    endDate: format(date, "MMMM yyyy", {
                                      locale: id,
                                    }),
                                  });
                                }
                              }}
                              disabled={exp.isCurrentJob}
                              initialFocus
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
                              const field =
                                lang === "id"
                                  ? "descriptionId"
                                  : "descriptionEn";
                              const current =
                                exp[field] || exp.description || [];
                              const bullets = Array.isArray(current)
                                ? [...current]
                                : [current];
                              bullets.push("");
                              updateExperience(exp.id, {
                                [field]: bullets,
                                description:
                                  lang === "id" ? bullets : exp.description,
                              });
                            }}
                            className="h-7 gap-1 px-2 text-[10px] font-bold"
                          >
                            <Plus className="h-3 w-3" /> Add Bullet
                          </Button>
                        </div>

                        <div className="space-y-2">
                          {(() => {
                            const current =
                              lang === "id"
                                ? exp.descriptionId || exp.description
                                : exp.descriptionEn || [];
                            const bullets = Array.isArray(current)
                              ? current
                              : current
                                ? [current]
                                : [""];

                            return bullets.map((bullet, idx) => (
                              <div
                                key={`${exp.id}-bullet-${idx}`}
                                className="group flex items-start gap-2"
                              >
                                <span className="text-muted-foreground mt-2.5 w-4 text-[10px] font-bold">
                                  {idx + 1}.
                                </span>
                                <Input
                                  value={bullet}
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
                                <div className="border-border bg-background flex shrink-0 items-center overflow-hidden rounded-lg border shadow-sm">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    disabled={idx === 0}
                                    onClick={() => {
                                      const newBullets = [...bullets];
                                      [newBullets[idx - 1], newBullets[idx]] = [
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
                                      [newBullets[idx], newBullets[idx + 1]] = [
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
                        <p className="text-muted-foreground text-[10px] italic">
                          * Kamu bisa memindahkan urutan atau menghapus poin
                          pencapaian dengan tombol di samping.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {content.experience.length === 0 && (
                <EmptyState
                  message="Belum ada pengalaman kerja"
                  onAdd={addExperience}
                />
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section: Education */}
        <AccordionItem
          value="education"
          className="bg-card border-border hover:border-primary/20 overflow-hidden rounded-2xl border shadow-sm transition-all"
        >
          <AccordionTrigger className="data-[state=open]:bg-muted/30 px-5 py-5 hover:no-underline">
            <div className="flex w-full items-center justify-between pr-4">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-xl">
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
                className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg transition-all"
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
                  className="bg-muted/20 border-border relative overflow-hidden rounded-xl"
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
                          Tahun Mulai
                        </Label>
                        <Input
                          value={edu.startYear}
                          onChange={(e) =>
                            updateEducation(edu.id, {
                              startYear: e.target.value,
                            })
                          }
                          className="bg-background border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-muted-foreground text-xs font-medium uppercase">
                          Tahun Selesai
                        </Label>
                        <Input
                          value={edu.endYear}
                          onChange={(e) =>
                            updateEducation(edu.id, { endYear: e.target.value })
                          }
                          className="bg-background border-border"
                        />
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

        {/* Section: Projects */}
        <AccordionItem
          value="projects"
          className="bg-card border-border hover:border-primary/20 overflow-hidden rounded-2xl border shadow-sm transition-all"
        >
          <AccordionTrigger className="data-[state=open]:bg-muted/30 px-5 py-5 hover:no-underline">
            <div className="flex w-full items-center justify-between pr-4">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-xl">
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
                className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg transition-all"
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
                  className="bg-muted/20 border-border relative overflow-hidden rounded-xl"
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
                          value={project.name}
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
                          value={project.link}
                          onChange={(e) =>
                            updateProject(project.id, { link: e.target.value })
                          }
                          placeholder="https://github.com/..."
                          className="bg-background border-border"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label className="text-muted-foreground text-xs font-medium uppercase">
                          Deskripsi Projek
                        </Label>
                        <Textarea
                          value={project.description}
                          onChange={(e) =>
                            updateProject(project.id, {
                              description: e.target.value,
                            })
                          }
                          className="bg-background border-border min-h-20"
                        />
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

        {/* Section: Skills */}
        <AccordionItem
          value="skills"
          className="bg-card border-border hover:border-primary/20 overflow-hidden rounded-2xl border shadow-sm transition-all"
        >
          <AccordionTrigger className="data-[state=open]:bg-muted/30 px-5 py-5 hover:no-underline">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-xl">
                <Code2 className="h-4 w-4" />
              </div>
              <span className="text-foreground font-semibold tracking-tight">
                Skills
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pt-2 pb-6">
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Skills (Pisahkan dengan koma)
              </Label>
              <Textarea
                value={content.skills.join(", ")}
                onChange={(e) =>
                  updateSkills(e.target.value.split(",").map((s) => s.trim()))
                }
                className="bg-background border-border focus:border-primary focus:ring-primary min-h-32 py-3 transition-all focus:ring-1"
                placeholder="React, Next.js, TypeScript, Tailwind CSS..."
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section: Visual Settings */}
        <AccordionItem
          value="style"
          className="bg-card border-border hover:border-primary/20 overflow-hidden rounded-2xl border shadow-sm transition-all"
        >
          <AccordionTrigger className="data-[state=open]:bg-muted/30 px-5 py-5 hover:no-underline">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-xl">
                <Settings2 className="h-4 w-4" />
              </div>
              <span className="text-foreground font-semibold tracking-tight">
                Pengaturan Visual
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pt-2 pb-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <Label className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Jenis Font
                </Label>
                <div className="relative">
                  <select
                    value={content.style?.fontFamily || "Helvetica"}
                    onChange={(e) => updateStyle({ fontFamily: e.target.value })}
                    className="bg-background border-border focus:border-primary focus:ring-primary h-11 w-full appearance-none rounded-lg border px-4 py-2 text-sm transition-all focus:ring-1"
                  >
                    <option value="Calibri">Calibri</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Helvetica">Helvetica</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Ukuran Font
                </Label>
                <div className="flex gap-2">
                  {["text-xs", "text-sm", "text-base"].map((size) => (
                    <Button
                      key={size}
                      variant={
                        content.style?.fontSize === size ? "default" : "outline"
                      }
                      className="h-11 flex-1 transition-all"
                      onClick={() => updateStyle({ fontSize: size })}
                    >
                      {size === "text-xs"
                        ? "Kecil"
                        : size === "text-sm"
                          ? "Sedang"
                          : "Besar"}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-3 md:col-span-2">
                <Label className="text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-wider uppercase">
                  <Languages className="h-3.5 w-3.5" /> Bahasa Resume (PDF)
                </Label>
                <div className="flex gap-2">
                  {[
                    { id: "id", label: "Indonesia" },
                    { id: "en", label: "Inggris" },
                  ].map((lang) => (
                    <Button
                      key={lang.id}
                      variant={
                        (content.style?.language || "id") === lang.id
                          ? "default"
                          : "outline"
                      }
                      className="h-11 flex-1 transition-all"
                      onClick={() =>
                        updateStyle({ language: lang.id as "id" | "en" })
                      }
                    >
                      {lang.label}
                    </Button>
                  ))}
                </div>
                <p className="text-muted-foreground text-[10px] italic">
                  * Ini akan menentukan bahasa yang digunakan pada tampilan PDF
                  akhir.
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

function EmptyState({
  message,
  onAdd,
}: {
  message: string;
  onAdd: () => void;
}) {
  return (
    <div className="border-border bg-muted/20 flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-10">
      <p className="text-surface-400 mb-4">{message}</p>
      <Button
        onClick={onAdd}
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        <Plus className="mr-2 h-4 w-4" /> Tambah Data
      </Button>
    </div>
  );
}
