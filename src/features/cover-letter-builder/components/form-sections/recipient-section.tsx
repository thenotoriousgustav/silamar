"use client";

import { Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { CoverLetterBuilderData } from "@/features/cover-letters-list/schema";

interface RecipientSectionProps {
  content: CoverLetterBuilderData;
  updateContent: (update: Partial<CoverLetterBuilderData>) => void;
}

export function RecipientSection({
  content,
  updateContent,
}: RecipientSectionProps) {
  return (
    <AccordionItem
      value="recipient"
      className="bg-card border-border hover:border-primary/20 overflow-hidden border shadow-sm transition-all"
    >
      <AccordionTrigger
        asChild
        className="data-[state=open]:bg-muted/30 px-5 py-5 hover:no-underline"
      >
        <div className="flex cursor-pointer items-center gap-4">
          <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-none">
            <Building2 className="h-4 w-4" />
          </div>
          <span className="text-foreground font-semibold tracking-tight">
            Informasi Penerima
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-5 pt-2 pb-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label
              htmlFor="cl-recipientName"
              className="text-muted-foreground text-xs font-medium tracking-wider uppercase"
            >
              Nama Penerima
            </Label>
            <Input
              id="cl-recipientName"
              value={content.recipientName || ""}
              onChange={(e) => updateContent({ recipientName: e.target.value })}
              placeholder="Bapak/Ibu HRD"
              className="bg-background border-border focus:border-primary focus:ring-primary transition-all focus:ring-1"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="cl-department"
              className="text-muted-foreground text-xs font-medium tracking-wider uppercase"
            >
              Departemen
            </Label>
            <Input
              id="cl-department"
              value={content.department || ""}
              onChange={(e) => updateContent({ department: e.target.value })}
              placeholder="Human Resources"
              className="bg-background border-border focus:border-primary focus:ring-primary transition-all focus:ring-1"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="cl-companyName"
              className="text-muted-foreground text-xs font-medium tracking-wider uppercase"
            >
              Nama Perusahaan
            </Label>
            <Input
              id="cl-companyName"
              value={content.companyName || ""}
              onChange={(e) => updateContent({ companyName: e.target.value })}
              placeholder="PT Maju Jaya"
              className="bg-background border-border focus:border-primary focus:ring-primary transition-all focus:ring-1"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="cl-recipientAddress"
              className="text-muted-foreground text-xs font-medium tracking-wider uppercase"
            >
              Alamat Perusahaan
            </Label>
            <Input
              id="cl-recipientAddress"
              value={content.recipientAddress || ""}
              onChange={(e) =>
                updateContent({ recipientAddress: e.target.value })
              }
              placeholder="Alamat Perusahaan"
              className="bg-background border-border focus:border-primary focus:ring-primary transition-all focus:ring-1"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label
              htmlFor="cl-recipientCityAndPostal"
              className="text-muted-foreground text-xs font-medium tracking-wider uppercase"
            >
              Kota & Kode Pos Perusahaan
            </Label>
            <Input
              id="cl-recipientCityAndPostal"
              value={content.recipientCityAndPostal || ""}
              onChange={(e) =>
                updateContent({ recipientCityAndPostal: e.target.value })
              }
              placeholder="Kota, Kode Pos"
              className="bg-background border-border focus:border-primary focus:ring-primary transition-all focus:ring-1"
            />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
