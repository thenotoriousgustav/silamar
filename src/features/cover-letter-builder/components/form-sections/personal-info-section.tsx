"use client";

import { User } from "lucide-react";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CoverLetterBuilderData } from "@/features/cover-letter-builder/types/cover-letter-content";

interface PersonalInfoSectionProps {
  content: CoverLetterBuilderData;
  updateContent: (update: Partial<CoverLetterBuilderData>) => void;
}

export function PersonalInfoSection({
  content,
  updateContent,
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
              htmlFor="cl-fullName"
              className="text-muted-foreground text-xs font-medium tracking-wider uppercase"
            >
              Nama Lengkap
            </Label>
            <Input
              id="cl-fullName"
              value={content.fullName || ""}
              onChange={(e) => updateContent({ fullName: e.target.value })}
              placeholder="John Doe, M.Kom"
              className="bg-background border-border focus:border-primary focus:ring-primary transition-all focus:ring-1"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="cl-email"
              className="text-muted-foreground text-xs font-medium tracking-wider uppercase"
            >
              Email
            </Label>
            <Input
              id="cl-email"
              type="email"
              value={content.email || ""}
              onChange={(e) => updateContent({ email: e.target.value })}
              placeholder="john@example.com"
              className="bg-background border-border focus:border-primary focus:ring-primary transition-all focus:ring-1"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="cl-phone"
              className="text-muted-foreground text-xs font-medium tracking-wider uppercase"
            >
              Nomor Telepon
            </Label>
            <Input
              id="cl-phone"
              value={content.phone || ""}
              onChange={(e) => updateContent({ phone: e.target.value })}
              placeholder="+62 812 3456 7890"
              className="bg-background border-border focus:border-primary focus:ring-primary transition-all focus:ring-1"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="cl-address"
              className="text-muted-foreground text-xs font-medium tracking-wider uppercase"
            >
              Alamat
            </Label>
            <Input
              id="cl-address"
              value={content.address || ""}
              onChange={(e) => updateContent({ address: e.target.value })}
              placeholder="Jl. Sudirman No. 1"
              className="bg-background border-border focus:border-primary focus:ring-primary transition-all focus:ring-1"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label
              htmlFor="cl-cityAndPostal"
              className="text-muted-foreground text-xs font-medium tracking-wider uppercase"
            >
              Kota & Kode Pos
            </Label>
            <Input
              id="cl-cityAndPostal"
              value={content.cityAndPostal || ""}
              onChange={(e) => updateContent({ cityAndPostal: e.target.value })}
              placeholder="Jakarta, 12345"
              className="bg-background border-border focus:border-primary focus:ring-primary transition-all focus:ring-1"
            />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
