"use client";

import { Code2, Plus, Trash2, GripVertical } from "lucide-react";
import {
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
import type { ResumeContent, ResumeSkill } from "@/types/resume";
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
    <SortableItem value={skill.id}>
      <div className="bg-muted/30 border-border hover:border-primary/30 overflow-hidden border transition-all">
        <div className="bg-muted/50 border-border/50 flex items-center justify-between border-b px-4 py-1.5">
          <SortableItemHandle
            asChild
            className="text-muted-foreground hover:text-primary cursor-grab transition-colors"
          >
            <GripVertical className="h-3.5 w-3.5" />
          </SortableItemHandle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeSkillCategory(skill.id)}
            className="hover:bg-destructive/10 hover:text-destructive text-muted-foreground h-6 w-6 transition-all"
            title="Hapus Kategori"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="space-y-4 p-4">
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
      </div>
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
        nativeButton={false}
        render={<div />}
        className="data-[state=open]:bg-muted/30 px-5 py-5 hover:no-underline"
      >
        <div className="flex w-full items-center justify-between pr-4">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-none">
              <Code2 className="h-4 w-4" />
            </div>
            <span className="text-foreground font-semibold tracking-tight">
              Skills
            </span>
          </div>
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
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-5 pt-2 pb-6">
        <div className="flex flex-col gap-8">
          <Sortable
            value={content.skills}
            onValueChange={updateSkills}
            getItemValue={(s) => s.id}
          >
            <SortableContent className="flex flex-col gap-4">
              {content.skills.map((skill) => (
                <SortableSkillItem
                  key={skill.id}
                  skill={skill}
                  updateSkillCategory={updateSkillCategory}
                  removeSkillCategory={removeSkillCategory}
                />
              ))}
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
