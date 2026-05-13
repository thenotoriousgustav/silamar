"use client";

import {
  Calendar as CalendarIcon,
  ChevronDown,
  ExternalLink,
  GripVertical,
  Plus,
  Trash2,
} from "lucide-react";

import { DynamicEditor as Editor } from "@/components/editor/dynamic-editor";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
} from "@/components/ui/sortable";
import { ResumeContent, ResumeCustomSectionItem } from "@/types/resume";
import { cn } from "@/lib/utils";

interface ItemsListSectionProps {
  title: string;
  icon: React.ReactNode;
  items: ResumeCustomSectionItem[];
  sectionId: "certificates" | "awards" | "publications";
  addItem: (type: "certificates" | "awards" | "publications") => void;
  updateItem: (
    type: "certificates" | "awards" | "publications",
    itemId: string,
    data: Partial<ResumeCustomSectionItem>,
  ) => void;
  updateItemList: (
    type: "certificates" | "awards" | "publications",
    items: ResumeCustomSectionItem[],
  ) => void;
  removeItem: (
    type: "certificates" | "awards" | "publications",
    itemId: string,
  ) => void;
  onRemoveSection: (sectionId: string) => void;
  placeholderTitle?: string;
  placeholderSubtitle?: string;
}

export function ItemsListSection({
  title,
  icon,
  items,
  sectionId,
  addItem,
  updateItem,
  updateItemList,
  removeItem,
  onRemoveSection,
  placeholderTitle = "Judul / Nama",
  placeholderSubtitle = "Penerbit / Penyelenggara",
}: ItemsListSectionProps) {
  return (
    <AccordionItem
      value={sectionId}
      className="bg-card border-border hover:border-primary/20 overflow-hidden rounded-none border shadow-sm transition-all"
    >
      <AccordionTrigger
        asChild
        className="data-[state=open]:bg-muted/30 px-5 hover:no-underline"
      >
        <div className="flex w-full cursor-pointer items-center justify-between pr-4">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-none">
              {icon}
            </div>
            <span className="font-semibold tracking-tight">{title}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                addItem(sectionId);
              }}
              className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground h-8 w-8 transition-all"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveSection(sectionId);
              }}
              className="hover:bg-destructive/10 hover:text-destructive h-8 w-8 transition-all"
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
            value={items}
            onValueChange={(newItems) => updateItemList(sectionId, newItems)}
            getItemValue={(i) => i.id}
          >
            <SortableContent className="flex w-full flex-col gap-4">
              <Accordion type="single" collapsible className="w-full space-y-4">
                {items.map((item) => (
                  <SortableItem key={item.id} value={item.id} asChild>
                    <AccordionItem
                      id={`${sectionId}-${item.id}`}
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
                                {item.title || placeholderTitle}
                              </span>
                              <span className="text-muted-foreground text-xs font-medium">
                                {item.subtitle || placeholderSubtitle}
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
                                  removeItem(sectionId, item.id);
                                }}
                                className="hover:bg-destructive/10 hover:text-destructive text-muted-foreground flex h-8 w-8 items-center justify-center transition-colors"
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
                                updateItem(sectionId, item.id, {
                                  title: e.target.value,
                                })
                              }
                              placeholder={placeholderTitle}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-muted-foreground text-xs font-medium uppercase">
                              Penerbit / Institusi
                            </Label>
                            <Input
                              value={item.subtitle || ""}
                              onChange={(e) =>
                                updateItem(sectionId, item.id, {
                                  subtitle: e.target.value,
                                })
                              }
                              placeholder={placeholderSubtitle}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-muted-foreground text-xs font-medium uppercase">
                              Tanggal
                            </Label>
                            <div className="relative">
                              <Input
                                value={item.date || ""}
                                onChange={(e) =>
                                  updateItem(sectionId, item.id, {
                                    date: e.target.value,
                                  })
                                }
                                placeholder="Misal: Jan 2024"
                                className="pr-10"
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
                                  updateItem(sectionId, item.id, {
                                    link: e.target.value,
                                  })
                                }
                                placeholder="https://..."
                                className="pr-10"
                              />
                              <ExternalLink className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
                            </div>
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label className="text-muted-foreground text-xs font-medium uppercase">
                              Deskripsi
                            </Label>
                            <Editor
                              initialDescription={
                                typeof item.description === "string"
                                  ? item.description
                                  : undefined
                              }
                              onSerializedChange={(serialized) =>
                                updateItem(sectionId, item.id, {
                                  description: JSON.stringify(serialized),
                                })
                              }
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
          {items.length === 0 && (
            <div className="border-border border border-dashed py-8 text-center">
              <p className="text-muted-foreground text-xs italic">
                Belum ada item. Klik tombol + di atas untuk menambah.
              </p>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
