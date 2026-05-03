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

// DND Kit Imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: skill.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    position: "relative" as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? "ring-primary/50 opacity-50 ring-2" : ""} group relative space-y-4`}
    >
      <div className="bg-muted/30 border-border hover:border-primary/30 space-y-4 border p-4 transition-all">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-1 items-start gap-3">
            <div
              {...attributes}
              {...listeners}
              className="text-muted-foreground hover:text-primary mt-7 cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="h-4 w-4" />
            </div>
            <div className="flex-1 space-y-2">
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
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeSkillCategory(skill.id)}
            className="hover:text-destructive hover:bg-destructive/10 text-muted-foreground mt-6 h-8 w-8 shrink-0 transition-all"
            title="Hapus Kategori"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2 pl-7">
          <Label className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
            Daftar Skill
          </Label>
          <TagsInput
            value={skill.items}
            onValueChange={(items) => updateSkillCategory(skill.id, { items })}
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
  );
}

export function SkillsSection({
  content,
  addSkillCategory,
  updateSkillCategory,
  removeSkillCategory,
  updateSkills,
}: SkillsSectionProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = content.skills.findIndex((s) => s.id === active.id);
      const newIndex = content.skills.findIndex((s) => s.id === over.id);

      const newSkills = arrayMove(content.skills, oldIndex, newIndex);
      updateSkills(newSkills);
    }
  };

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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={content.skills.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {content.skills.map((skill) => (
                <SortableSkillItem
                  key={skill.id}
                  skill={skill}
                  updateSkillCategory={updateSkillCategory}
                  removeSkillCategory={removeSkillCategory}
                />
              ))}
            </SortableContext>
          </DndContext>

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
