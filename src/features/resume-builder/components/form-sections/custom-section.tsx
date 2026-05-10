"use client";

import {
  LayoutGrid,
  Plus,
  Trash2,
  Calendar as CalendarIcon,
  ExternalLink,
  GripVertical,
  ChevronDown,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ResumeContent,
  ResumeCustomSection,
  ResumeCustomSectionItem,
} from "@/features/resumes-list/types/resume";
import { RichTextEditor } from "@/components/tiptap/rich-text-editor";
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
} from "@/components/ui/sortable";

interface CustomSectionProps {
  content: ResumeContent;
  addCustomSection: () => void;
  updateCustomSection: (id: string, data: Partial<ResumeCustomSection>) => void;
  updateCustomSectionList: (sections: ResumeCustomSection[]) => void;
  removeCustomSection: (id: string) => void;
  addCustomSectionItem: (sectionId: string) => void;
  updateCustomSectionItem: (
    sectionId: string,
    itemId: string,
    data: Partial<ResumeCustomSectionItem>,
  ) => void;
  updateCustomSectionItemList: (
    sectionId: string,
    items: ResumeCustomSectionItem[],
  ) => void;
  removeCustomSectionItem: (sectionId: string, itemId: string) => void;
}

export function CustomSection({
  content,
  addCustomSection,
  updateCustomSection,
  updateCustomSectionList,
  removeCustomSection,
  addCustomSectionItem,
  updateCustomSectionItem,
  updateCustomSectionItemList,
  removeCustomSectionItem,
}: CustomSectionProps) {
  const sections = content.customSections || [];

  return (
    <>
      <Sortable
        value={sections}
        onValueChange={updateCustomSectionList}
        getItemValue={(s) => s.id}
      >
        <SortableContent className="flex w-full flex-col gap-4">
          {sections.map((section) => (
            <SortableItem key={section.id} value={section.id} asChild>
              <AccordionItem
                key={section.id}
                value={section.id}
                className="bg-card border-border hover:border-primary/20 overflow-hidden rounded-none border shadow-sm transition-all"
              >
                <AccordionTrigger
                  asChild
                  className="data-[state=open]:bg-muted/30 px-5 hover:no-underline"
                >
                  <div className="flex w-full cursor-pointer items-center justify-between pr-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-none">
                        <LayoutGrid className="h-4 w-4" />
                      </div>
                      <div className="flex items-center gap-2">
                        <SortableItemHandle
                          asChild
                          className="text-muted-foreground hover:text-primary h-4 w-4 shrink-0"
                        >
                          <GripVertical />
                        </SortableItemHandle>
                        <Input
                          value={section.title || ""}
                          onChange={(e) => {
                            e.stopPropagation();
                            updateCustomSection(section.id, {
                              title: e.target.value,
                            });
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="h-7 border-none bg-transparent p-0 font-semibold tracking-tight focus:ring-0"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          addCustomSectionItem(section.id);
                        }}
                        className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground h-8 w-8 transition-all"
                        title="Tambah Item"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeCustomSection(section.id);
                        }}
                        className="hover:bg-destructive/10 hover:text-destructive h-8 w-8 transition-all"
                        title="Hapus Seksi"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <ChevronDown className="text-muted-foreground h-4 w-4 transition-transform duration-200 group-data-[state=open]/accordion-trigger:rotate-180" />
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 pt-2 pb-6">
                  <div className="flex w-full flex-col gap-6">
                    <Sortable
                      value={section.items}
                      onValueChange={(items) =>
                        updateCustomSectionItemList(section.id, items)
                      }
                      getItemValue={(i) => i.id}
                    >
                      <SortableContent className="flex w-full flex-col gap-4">
                        <Accordion
                          type="single"
                          collapsible
                          className="w-full space-y-4"
                        >
                          {section.items.map((item) => (
                            <SortableItem key={item.id} value={item.id} asChild>
                              <AccordionItem
                                id={`custom-${item.id}`}
                                value={item.id}
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
                                        <span className="text-sm font-bold">
                                          {item.title || "Judul / Nama"}
                                        </span>
                                        <span className="text-muted-foreground text-xs font-medium">
                                          {item.subtitle ||
                                            "Subjudul (Opsional)"}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <div className="text-muted-foreground text-[10px] font-medium uppercase">
                                          {item.date || "Tanggal"}
                                        </div>
                                        <div
                                          role="button"
                                          tabIndex={0}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            removeCustomSectionItem(
                                              section.id,
                                              item.id,
                                            );
                                          }}
                                          className="hover:bg-destructive/10 hover:text-destructive text-muted-foreground flex h-8 w-8 items-center justify-center transition-colors"
                                          title="Hapus Item"
                                        >
                                          <Trash2 className="h-3.5 w-3.5" />
                                        </div>
                                        <ChevronDown className="text-muted-foreground h-4 w-4 transition-transform duration-200 group-data-[state=open]/accordion-trigger:rotate-180" />
                                      </div>
                                    </div>
                                  </AccordionTrigger>
                                </div>
                                <AccordionContent className="border-t border-dashed px-6 py-6">
                                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                      <Label className="text-muted-foreground text-xs font-medium uppercase">
                                        Judul / Nama
                                      </Label>
                                      <Input
                                        value={item.title || ""}
                                        onChange={(e) =>
                                          updateCustomSectionItem(
                                            section.id,
                                            item.id,
                                            {
                                              title: e.target.value,
                                            },
                                          )
                                        }
                                        className="bg-background border-border"
                                        placeholder="Misal: Sertifikat Google Cloud"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-muted-foreground text-xs font-medium uppercase">
                                        Subjudul (Opsional)
                                      </Label>
                                      <Input
                                        value={item.subtitle || ""}
                                        onChange={(e) =>
                                          updateCustomSectionItem(
                                            section.id,
                                            item.id,
                                            {
                                              subtitle: e.target.value,
                                            },
                                          )
                                        }
                                        className="bg-background border-border"
                                        placeholder="Misal: Dikeluarkan oleh Google"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-muted-foreground text-xs font-medium uppercase">
                                        Tanggal / Periode
                                      </Label>
                                      <div className="relative">
                                        <Input
                                          value={item.date || ""}
                                          onChange={(e) =>
                                            updateCustomSectionItem(
                                              section.id,
                                              item.id,
                                              {
                                                date: e.target.value,
                                              },
                                            )
                                          }
                                          className="bg-background border-border pr-10"
                                          placeholder="Misal: Jan 2024"
                                        />
                                        <CalendarIcon className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-muted-foreground text-xs font-medium uppercase">
                                        Link (Opsional)
                                      </Label>
                                      <div className="relative">
                                        <Input
                                          value={item.link || ""}
                                          onChange={(e) =>
                                            updateCustomSectionItem(
                                              section.id,
                                              item.id,
                                              {
                                                link: e.target.value,
                                              },
                                            )
                                          }
                                          className="bg-background border-border pr-10"
                                          placeholder="https://..."
                                        />
                                        <ExternalLink className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
                                      </div>
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                      <Label className="text-muted-foreground text-xs font-medium uppercase">
                                        Deskripsi Poin (Opsional)
                                      </Label>
                                      <RichTextEditor
                                        content={
                                          typeof item.description === "string"
                                            ? item.description
                                            : Array.isArray(item.description)
                                              ? `<ul>${(item.description as any).map((bullet: any) => `<li>${bullet.text || bullet}</li>`).join("")}</ul>`
                                              : ""
                                        }
                                        onUpdate={(html) =>
                                          updateCustomSectionItem(
                                            section.id,
                                            item.id,
                                            {
                                              description: html,
                                            },
                                          )
                                        }
                                        minHeight="100px"
                                      />
                                    </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </SortableItem>
                          ))}
                        </Accordion>
                      </SortableContent>
                    </Sortable>
                    {section.items.length === 0 && (
                      <div className="border-border border border-dashed py-8 text-center">
                        <p className="text-muted-foreground text-xs italic">
                          Belum ada item. Klik tombol + di atas untuk menambah.
                        </p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </SortableItem>
          ))}
        </SortableContent>
      </Sortable>

      <Button
        type="button"
        variant="outline"
        onClick={addCustomSection}
        className="border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/50 w-full border-dashed py-6 transition-all"
      >
        <Plus className="mr-2 h-4 w-4" />
        Tambah Seksi Kustom (Sertifikasi, Penghargaan, dll)
      </Button>
    </>
  );
}
