"use client";

import { LayoutGrid, Plus, Trash2, Calendar as CalendarIcon, ExternalLink } from "lucide-react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { 
  ResumeContent, 
  ResumeCustomSection, 
  ResumeCustomSectionItem 
} from "@/types/resume";

interface CustomSectionProps {
  content: ResumeContent;
  addCustomSection: () => void;
  updateCustomSection: (id: string, data: Partial<ResumeCustomSection>) => void;
  removeCustomSection: (id: string) => void;
  addCustomSectionItem: (sectionId: string) => void;
  updateCustomSectionItem: (sectionId: string, itemId: string, data: Partial<ResumeCustomSectionItem>) => void;
  removeCustomSectionItem: (sectionId: string, itemId: string) => void;
}

export function CustomSection({
  content,
  addCustomSection,
  updateCustomSection,
  removeCustomSection,
  addCustomSectionItem,
  updateCustomSectionItem,
  removeCustomSectionItem,
}: CustomSectionProps) {
  const sections = content.customSections || [];

  return (
    <>
      {sections.map((section) => (
        <AccordionItem
          key={section.id}
          value={section.id}
          className="bg-card border-border hover:border-primary/20 overflow-hidden rounded-none border shadow-sm transition-all"
        >
          <AccordionTrigger className="data-[state=open]:bg-muted/30 px-5 py-5 hover:no-underline">
            <div className="flex w-full items-center justify-between pr-4">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-none">
                  <LayoutGrid className="h-4 w-4" />
                </div>
                <Input
                  value={section.title}
                  onChange={(e) => {
                    e.stopPropagation();
                    updateCustomSection(section.id, { title: e.target.value });
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="h-7 border-none bg-transparent p-0 font-semibold tracking-tight focus:ring-0"
                />
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
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pt-2 pb-6">
            <div className="flex flex-col gap-6">
              {section.items.map((item) => (
                <Card
                  key={item.id}
                  className="bg-muted/20 border-border relative overflow-hidden rounded-none"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCustomSectionItem(section.id, item.id)}
                    className="hover:bg-destructive/10 hover:text-destructive text-muted-foreground absolute top-2 right-2 h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-muted-foreground text-xs font-medium uppercase">
                          Judul / Nama
                        </Label>
                        <Input
                          value={item.title}
                          onChange={(e) =>
                            updateCustomSectionItem(section.id, item.id, {
                              title: e.target.value,
                            })
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
                          value={item.subtitle}
                          onChange={(e) =>
                            updateCustomSectionItem(section.id, item.id, {
                              subtitle: e.target.value,
                            })
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
                            value={item.date}
                            onChange={(e) =>
                              updateCustomSectionItem(section.id, item.id, {
                                date: e.target.value,
                              })
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
                            value={item.link}
                            onChange={(e) =>
                              updateCustomSectionItem(section.id, item.id, {
                                link: e.target.value,
                              })
                            }
                            className="bg-background border-border pr-10"
                            placeholder="https://..."
                          />
                          <ExternalLink className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
                        </div>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-muted-foreground text-xs font-medium uppercase">
                            Deskripsi Poin (Opsional)
                          </Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const bullets = [...(item.description || [])];
                              bullets.push("");
                              updateCustomSectionItem(section.id, item.id, {
                                description: bullets,
                              });
                            }}
                            className="h-7 gap-1 px-2 text-[10px] font-bold"
                          >
                            <Plus className="h-3 w-3" /> Add Point
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {(item.description || []).map((bullet, idx) => (
                            <div key={idx} className="flex gap-2">
                              <Input
                                value={bullet}
                                onChange={(e) => {
                                  const newBullets = [...(item.description || [])];
                                  newBullets[idx] = e.target.value;
                                  updateCustomSectionItem(section.id, item.id, {
                                    description: newBullets,
                                  });
                                }}
                                className="bg-background border-border h-9 text-sm"
                                placeholder="Detail tambahan..."
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  const newBullets = (item.description || []).filter((_, i) => i !== idx);
                                  updateCustomSectionItem(section.id, item.id, {
                                    description: newBullets,
                                  });
                                }}
                                className="hover:text-destructive h-9 w-9 shrink-0"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {section.items.length === 0 && (
                <div className="border-border border-dashed border py-8 text-center">
                  <p className="text-muted-foreground text-xs italic">Belum ada item. Klik tombol + di atas untuk menambah.</p>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}

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
