"use client";

import { Code2, Plus, Trash2, GripVertical, ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputList,
} from "@/components/ui/tags-input";
import type {
  ResumeContent,
  ResumeSkill,
} from "@/features/resumes/types/resume";
import { Label } from "@/components/ui/label";

import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
} from "@/components/ui/sortable";

interface SkillsSectionProps {
  content: ResumeContent;
  addSkillCategory: () => void;
  updateSkillCategory: (id: string, data: Partial<ResumeSkill>) => void;
  removeSkillCategory: (id: string) => void;
  updateSkills: (skills: ResumeSkill[]) => void;
}

interface SortableSkillItemProps {
  skill: ResumeSkill;
  updateSkillCategory: (id: string, data: Partial<ResumeSkill>) => void;
  removeSkillCategory: (id: string) => void;
}

function SortableSkillItem({
  skill,
  updateSkillCategory,
  removeSkillCategory,
}: SortableSkillItemProps) {
  return (
    <SortableItem value={skill.id} asChild>
      <AccordionItem
        id={`skills-${skill.id}`}
        value={skill.id}
        className="bg-muted/20 border-border group overflow-hidden rounded-none border shadow-sm transition-all"
      >
        <div className="flex w-full items-center">
          <SortableItemHandle
            asChild
            className="text-muted-foreground hover:text-primary ml-4 cursor-grab transition-colors"
          >
            <GripVertical className="h-4 w-4" />
          </SortableItemHandle>
          <AccordionTrigger
            asChild
            className="hover:bg-muted/30 flex-1 px-4 hover:no-underline"
          >
            <div className="flex w-full flex-1 cursor-pointer items-center justify-between text-left">
              <div className="flex flex-col gap-0.5">
                <span className="text-foreground text-sm font-bold">
                  {skill.category || "Nama Kategori"}
                </span>
                <span className="text-muted-foreground text-[10px]">
                  {skill.items.length} Skill • Klik untuk expand
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSkillCategory(skill.id);
                  }}
                  className="hover:bg-destructive/10 hover:text-destructive text-muted-foreground flex h-8 w-8 items-center justify-center transition-colors"
                  title="Hapus Kategori"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </div>
                <ChevronDown className="text-muted-foreground h-4 w-4 transition-transform duration-200 group-data-[state=open]/accordion-trigger:rotate-180" />
              </div>
            </div>
          </AccordionTrigger>
        </div>
        <AccordionContent className="border-t border-dashed px-6 py-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                Nama Kategori
              </Label>
              <Input
                value={skill.category || ""}
                onChange={(e) =>
                  updateSkillCategory(skill.id, {
                    category: e.target.value,
                  })
                }
                placeholder="Contoh: Frameworks, Languages, Tools..."
                className="bg-background border-border h-9 text-sm focus:ring-1"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                Daftar Skill
              </Label>
              <TagsInput
                value={skill.items}
                onValueChange={(items) =>
                  updateSkillCategory(skill.id, { items })
                }
                editable
                addOnPaste
                className="w-full"
              >
                <TagsInputList className="border-border bg-background focus-within:ring-primary/50 rounded-none border shadow-sm focus-within:ring-1">
                  {skill.items.map((item, index) => (
                    <TagsInputItem key={index} value={item}>
                      {item}
                    </TagsInputItem>
                  ))}
                  <TagsInputInput
                    placeholder="Ketik skill & tekan Enter..."
                    className="text-xs"
                  />
                </TagsInputList>
              </TagsInput>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </SortableItem>
  );
}

export function SkillsSection({
  content,
  addSkillCategory,
  updateSkillCategory,
  removeSkillCategory,
  updateSkills,
}: SkillsSectionProps) {
  return (
    <AccordionItem
      value="skills"
      className="bg-card border-border hover:border-primary/20 overflow-hidden rounded-none border shadow-sm transition-all"
    >
      <AccordionTrigger
        asChild
        className="data-[state=open]:bg-muted/30 px-5 hover:no-underline"
      >
        <div className="flex w-full cursor-pointer items-center justify-between pr-4">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-none">
              <Code2 className="h-4 w-4" />
            </div>
            <span className="text-foreground font-semibold tracking-tight">
              Skills
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                addSkillCategory();
              }}
              className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground flex h-8 w-8 items-center justify-center rounded-none transition-all"
              title="Tambah Kategori"
            >
              <Plus className="h-4 w-4" />
            </div>
            <ChevronDown className="text-muted-foreground h-4 w-4 transition-transform duration-200 group-data-[state=open]/accordion-trigger:rotate-180" />
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-5 pt-2 pb-6">
        <div className="flex w-full flex-col gap-8">
          <Sortable
            value={content.skills}
            onValueChange={updateSkills}
            getItemValue={(s) => s.id}
          >
            <SortableContent className="flex w-full flex-col gap-4">
              <Accordion type="single" collapsible className="w-full space-y-4">
                {content.skills.map((skill) => (
                  <SortableSkillItem
                    key={skill.id}
                    skill={skill}
                    updateSkillCategory={updateSkillCategory}
                    removeSkillCategory={removeSkillCategory}
                  />
                ))}
              </Accordion>
            </SortableContent>
          </Sortable>

          {content.skills.length === 0 && (
            <div className="border-border flex flex-col items-center justify-center border border-dashed py-10 text-center">
              <p className="text-muted-foreground text-xs italic">
                Belum ada kategori skill.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={addSkillCategory}
                className="mt-4 h-8 gap-2 border-dashed"
              >
                <Plus className="h-3.5 w-3.5" /> Tambah Kategori
              </Button>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
