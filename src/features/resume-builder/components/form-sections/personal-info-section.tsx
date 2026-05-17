"use client";

import {
  Camera,
  ChevronDown,
  Globe,
  Link as LinkIcon,
  Mail,
  MapPin,
  Phone,
  User,
  X,
} from "lucide-react";
import { useRef } from "react";

import { DynamicEditor as Editor } from "@/components/editor/dynamic-editor";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ResumeContent } from "@/types/resume";

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

  const { personalInfo } = content;

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
      <AccordionContent className="px-5 pt-4 pb-6">
        <div className="space-y-6">
          {/* Row 1: Photo + Name/Title side by side */}
          <div className="flex items-start gap-5">
            {/* Photo */}
            <div className="group relative shrink-0">
              <Avatar className="border-muted-foreground/30 ring-offset-background group-hover:border-primary/50 h-20 w-20 border-2 border-dashed ring-2 ring-transparent transition-all">
                <AvatarImage
                  src={personalInfo.photoUrl}
                  className="object-cover"
                />
                <AvatarFallback className="bg-muted">
                  <User className="text-muted-foreground h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              {personalInfo.photoUrl ? (
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full shadow-lg"
                  onClick={() => updatePersonalInfo({ photoUrl: "" })}
                >
                  <X className="h-2.5 w-2.5" />
                </Button>
              ) : (
                <Button
                  size="icon"
                  variant="secondary"
                  className="border-border absolute -right-1 -bottom-1 h-6 w-6 rounded-full border shadow-lg"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-3 w-3" />
                </Button>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Name + Title */}
            <div className="min-w-0 flex-1 space-y-3">
              <div className="space-y-1.5">
                <Label className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                  Nama Lengkap
                </Label>
                <Input
                  value={personalInfo.fullName || ""}
                  onChange={(e) =>
                    updatePersonalInfo({ fullName: e.target.value })
                  }
                  placeholder="John Doe"
                  className="bg-background border-border h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                  Gelar / Posisi
                </Label>
                <Input
                  value={personalInfo.title || ""}
                  onChange={(e) =>
                    updatePersonalInfo({ title: e.target.value })
                  }
                  placeholder="Senior Frontend Developer"
                  className="bg-background border-border h-9"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Contact info — compact 2-col grid with icons */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Email */}
            <div className="space-y-1.5">
              <Label className="text-muted-foreground flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase">
                <Mail className="h-3 w-3" /> Email
              </Label>
              <Input
                type="email"
                value={personalInfo.email || ""}
                onChange={(e) =>
                  updatePersonalInfo({ email: e.target.value })
                }
                placeholder="john@example.com"
                className="bg-background border-border h-9"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label className="text-muted-foreground flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase">
                <Phone className="h-3 w-3" /> Telepon
              </Label>
              <Input
                value={personalInfo.phone || ""}
                onChange={(e) =>
                  updatePersonalInfo({ phone: e.target.value })
                }
                placeholder="+62 812 3456 7890"
                className="bg-background border-border h-9"
              />
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <Label className="text-muted-foreground flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase">
                <MapPin className="h-3 w-3" /> Lokasi
              </Label>
              <Input
                value={personalInfo.location || ""}
                onChange={(e) =>
                  updatePersonalInfo({ location: e.target.value })
                }
                placeholder="Jakarta, Indonesia"
                className="bg-background border-border h-9"
              />
            </div>

            {/* LinkedIn */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-muted-foreground flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase">
                  <LinkIcon className="h-3 w-3" /> LinkedIn
                </Label>
                <button
                  type="button"
                  onClick={() => {
                    const hasLabel =
                      personalInfo.linkedin?.label !== undefined;
                    updatePersonalInfo({
                      linkedin: {
                        url: personalInfo.linkedin?.url || "",
                        label: hasLabel ? (undefined as any) : "",
                      },
                    });
                  }}
                  className="text-primary hover:text-primary/80 text-[9px] font-medium"
                >
                  {personalInfo.linkedin?.label !== undefined
                    ? "- Label"
                    : "+ Label"}
                </button>
              </div>
              <Input
                value={personalInfo.linkedin?.url || ""}
                onChange={(e) =>
                  updatePersonalInfo({
                    linkedin: {
                      url: e.target.value,
                      label: personalInfo.linkedin?.label ?? "",
                    },
                  })
                }
                placeholder="https://linkedin.com/in/johndoe"
                className="bg-background border-border h-9"
              />
              {personalInfo.linkedin?.label !== undefined && (
                <Input
                  value={personalInfo.linkedin.label}
                  onChange={(e) =>
                    updatePersonalInfo({
                      linkedin: {
                        url: personalInfo.linkedin?.url || "",
                        label: e.target.value,
                      },
                    })
                  }
                  placeholder="Teks tampilan"
                  className="bg-muted/30 border-border h-7 text-[11px]"
                />
              )}
            </div>

            {/* Website */}
            <div className="space-y-1.5 sm:col-span-2">
              <div className="flex items-center justify-between">
                <Label className="text-muted-foreground flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase">
                  <Globe className="h-3 w-3" /> Website / Portfolio
                </Label>
                <button
                  type="button"
                  onClick={() => {
                    const hasLabel =
                      personalInfo.website?.label !== undefined;
                    updatePersonalInfo({
                      website: {
                        url: personalInfo.website?.url || "",
                        label: hasLabel ? (undefined as any) : "",
                      },
                    });
                  }}
                  className="text-primary hover:text-primary/80 text-[9px] font-medium"
                >
                  {personalInfo.website?.label !== undefined
                    ? "- Label"
                    : "+ Label"}
                </button>
              </div>
              <Input
                value={personalInfo.website?.url || ""}
                onChange={(e) =>
                  updatePersonalInfo({
                    website: {
                      url: e.target.value,
                      label: personalInfo.website?.label ?? "",
                    },
                  })
                }
                placeholder="https://johndoe.com"
                className="bg-background border-border h-9"
              />
              {personalInfo.website?.label !== undefined && (
                <Input
                  value={personalInfo.website.label}
                  onChange={(e) =>
                    updatePersonalInfo({
                      website: {
                        url: personalInfo.website?.url || "",
                        label: e.target.value,
                      },
                    })
                  }
                  placeholder="Teks tampilan"
                  className="bg-muted/30 border-border h-7 text-[11px]"
                />
              )}
            </div>
          </div>

          {/* Row 3: Professional Summary — Rich Text Editor */}
          <div className="space-y-2">
            <Label className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
              Ringkasan Profesional
            </Label>
            <Editor
              initialDescription={personalInfo.summary || undefined}
              onSerializedChange={(serialized) =>
                updatePersonalInfo({ summary: JSON.stringify(serialized) })
              }
            />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
