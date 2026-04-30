"use client";

import { Code2 } from "lucide-react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { ResumeContent } from "@/types/resume";

interface SkillsSectionProps {
  content: ResumeContent;
  updateSkills: (skills: string[]) => void;
}

export function SkillsSection({ content, updateSkills }: SkillsSectionProps) {
  return (
    <AccordionItem
      value="skills"
      className="bg-card border-border hover:border-primary/20 overflow-hidden rounded-none border shadow-sm transition-all"
    >
      <AccordionTrigger className="data-[state=open]:bg-muted/30 px-5 py-5 hover:no-underline">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-none">
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
  );
}
