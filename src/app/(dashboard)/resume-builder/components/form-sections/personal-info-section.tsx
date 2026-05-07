"use client";

import { User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ResumeContent } from "@/types/resume";

interface PersonalInfoSectionProps {
  content: ResumeContent;
  updatePersonalInfo: (info: Partial<ResumeContent["personalInfo"]>) => void;
}

export function PersonalInfoSection({
  content,
  updatePersonalInfo,
}: PersonalInfoSectionProps) {
  return (
    <AccordionItem
      value="personal"
      className="bg-card border-border hover:border-primary/20 overflow-hidden border shadow-sm transition-all"
    >
      <AccordionTrigger
        asChild
        className="data-[state=open]:bg-muted/30 px-5 py-5 hover:no-underline"
      >
        <div className="flex cursor-pointer items-center gap-4">
          <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-none">
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
          <div className="space-y-2">
            <Label
              htmlFor="website"
              className="text-muted-foreground text-xs font-medium tracking-wider uppercase"
            >
              Website / Portfolio (Opsional)
            </Label>
            <Input
              id="website"
              value={content.personalInfo.website || ""}
              onChange={(e) => updatePersonalInfo({ website: e.target.value })}
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
