"use client";

import { User, ChevronDown, Camera, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ResumeContent } from "@/features/resumes-list/types/resume";
import { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface PersonalInfoSectionProps {
  content: ResumeContent;
  updatePersonalInfo: (info: Partial<ResumeContent["personalInfo"]>) => void;
}

export function PersonalInfoSection({
  content,
  updatePersonalInfo,
}: PersonalInfoSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran foto maksimal 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        updatePersonalInfo({ photoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <AccordionItem
      value="personal"
      className="bg-card border-border hover:border-primary/20 overflow-hidden border shadow-sm transition-all"
    >
      <AccordionTrigger
        asChild
        className="data-[state=open]:bg-muted/30 px-5 hover:no-underline"
      >
        <div className="flex w-full cursor-pointer items-center justify-between pr-4">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-none">
              <User className="h-4 w-4" />
            </div>
            <span className="text-foreground font-semibold tracking-tight">
              Informasi Pribadi
            </span>
          </div>
          <ChevronDown className="text-muted-foreground h-4 w-4 transition-transform duration-200 group-data-[state=open]/accordion-trigger:rotate-180" />
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-5 pt-2 pb-6">
        <div className="mb-8 flex flex-col items-center justify-center gap-4">
          <div className="relative group">
            <Avatar className="h-28 w-28 border-2 border-dashed border-muted-foreground/30 ring-offset-background transition-all group-hover:border-primary/50 ring-2 ring-transparent">
              <AvatarImage
                src={content.personalInfo.photoUrl}
                className="object-cover"
              />
              <AvatarFallback className="bg-muted">
                <User className="text-muted-foreground h-10 w-10" />
              </AvatarFallback>
            </Avatar>
            {content.personalInfo.photoUrl ? (
              <Button
                size="icon"
                variant="destructive"
                className="absolute -top-1 -right-1 h-6 w-6 rounded-full shadow-lg"
                onClick={() => updatePersonalInfo({ photoUrl: "" })}
              >
                <X className="h-3 w-3" />
              </Button>
            ) : (
              <Button
                size="icon"
                variant="secondary"
                className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full border border-border shadow-lg"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="text-center">
            <p className="text-xs font-medium text-slate-500">Foto Profil</p>
            <p className="text-[10px] text-slate-400">Maksimal 2MB (JPG, PNG)</p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>

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
              value={content.personalInfo.fullName || ""}
              onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
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
              value={content.personalInfo.title || ""}
              onChange={(e) => updatePersonalInfo({ title: e.target.value })}
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
              value={content.personalInfo.email || ""}
              onChange={(e) => updatePersonalInfo({ email: e.target.value })}
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
              value={content.personalInfo.phone || ""}
              onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
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
              value={content.personalInfo.location || ""}
              onChange={(e) => updatePersonalInfo({ location: e.target.value })}
              placeholder="Jakarta, Indonesia"
              className="bg-background border-border focus:border-primary focus:ring-primary transition-all focus:ring-1"
            />
          </div>

          {/* LinkedIn Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="linkedinUrl"
                className="text-muted-foreground text-xs font-medium tracking-wider uppercase"
              >
                LinkedIn
              </Label>
              <button
                type="button"
                onClick={() => {
                  const currentLabel = content.personalInfo.linkedin?.label;
                  updatePersonalInfo({
                    linkedin: {
                      ...content.personalInfo.linkedin,
                      label: currentLabel === undefined ? "" : undefined as any,
                      url: content.personalInfo.linkedin?.url || "",
                    },
                  });
                }}
                className="text-primary hover:text-primary/80 text-[10px] font-medium transition-colors"
              >
                {content.personalInfo.linkedin?.label !== undefined
                  ? "- Hapus Label"
                  : "+ Label Kustom"}
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <Input
                id="linkedinUrl"
                value={content.personalInfo.linkedin?.url || ""}
                onChange={(e) =>
                  updatePersonalInfo({
                    linkedin: {
                      ...content.personalInfo.linkedin,
                      url: e.target.value,
                      label: content.personalInfo.linkedin?.label ?? "",
                    },
                  })
                }
                placeholder="https://linkedin.com/in/johndoe"
                className="bg-background border-border focus:border-primary focus:ring-primary transition-all focus:ring-1"
              />
              {content.personalInfo.linkedin?.label !== undefined && (
                <div className="flex items-center gap-2">
                  <div className="bg-primary/20 h-4 w-1 shrink-0" />
                  <Input
                    value={content.personalInfo.linkedin.label}
                    onChange={(e) =>
                      updatePersonalInfo({
                        linkedin: {
                          ...content.personalInfo.linkedin,
                          label: e.target.value,
                          url: content.personalInfo.linkedin?.url || "",
                        },
                      })
                    }
                    placeholder="Teks tampilan (misal: linkedin.com/in/johndoe)"
                    className="bg-muted/30 border-border h-8 text-xs focus:ring-0"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Website Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="websiteUrl"
                className="text-muted-foreground text-xs font-medium tracking-wider uppercase"
              >
                Website / Portfolio
              </Label>
              <button
                type="button"
                onClick={() => {
                  const currentLabel = content.personalInfo.website?.label;
                  updatePersonalInfo({
                    website: {
                      ...content.personalInfo.website,
                      label: currentLabel === undefined ? "" : undefined as any,
                      url: content.personalInfo.website?.url || "",
                    },
                  });
                }}
                className="text-primary hover:text-primary/80 text-[10px] font-medium transition-colors"
              >
                {content.personalInfo.website?.label !== undefined
                  ? "- Hapus Label"
                  : "+ Label Kustom"}
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <Input
                id="websiteUrl"
                value={content.personalInfo.website?.url || ""}
                onChange={(e) =>
                  updatePersonalInfo({
                    website: {
                      ...content.personalInfo.website,
                      url: e.target.value,
                      label: content.personalInfo.website?.label ?? "",
                    },
                  })
                }
                placeholder="https://johndoe.com"
                className="bg-background border-border focus:border-primary focus:ring-primary transition-all focus:ring-1"
              />
              {content.personalInfo.website?.label !== undefined && (
                <div className="flex items-center gap-2">
                  <div className="bg-primary/20 h-4 w-1 shrink-0" />
                  <Input
                    value={content.personalInfo.website.label}
                    onChange={(e) =>
                      updatePersonalInfo({
                        website: {
                          ...content.personalInfo.website,
                          label: e.target.value,
                          url: content.personalInfo.website?.url || "",
                        },
                      })
                    }
                    placeholder="Teks tampilan (misal: portfolio.com)"
                    className="bg-muted/30 border-border h-8 text-xs focus:ring-0"
                  />
                </div>
              )}
            </div>
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
              value={content.personalInfo.summary || ""}
              onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
              placeholder="Ceritakan singkat tentang pengalaman dan keahlianmu..."
              className="bg-background border-border focus:border-primary focus:ring-primary min-h-24 transition-all focus:ring-1"
            />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
