"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Check } from "lucide-react";

interface UpgradeModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpgradeModal({ isOpen, onOpenChange }: UpgradeModalProps) {
  const perks = [
    "Template Resume & Cover Letter Premium",
    "Analisis ATS Berbasis AI Tak Terbatas",
    "Sinkronisasi Cloud & Prioritas Support",
    "Hapus Watermark pada PDF",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none rounded-none">
        <div className="bg-primary p-8 text-primary-foreground">
          <div className="mb-4 flex h-12 w-12 items-center justify-center bg-white/20">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold italic">Upgrade ke Pro</h2>
          <p className="mt-2 text-primary-foreground/80 text-sm">
            Dapatkan akses penuh ke semua fitur premium dan tingkatkan peluang kerja kamu.
          </p>
        </div>
        
        <div className="p-8 space-y-6">
          <ul className="space-y-3">
            {perks.map((perk, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center bg-primary/10 text-primary">
                  <Check className="h-3 w-3" />
                </div>
                <span className="text-muted-foreground">{perk}</span>
              </li>
            ))}
          </ul>
          
          <div className="space-y-3">
            <Button className="w-full py-6 font-bold text-base bg-primary hover:bg-primary/90 rounded-none shadow-lg shadow-primary/20 transition-all">
              Mulai Langganan — Rp 49k/bln
            </Button>
            <Button variant="ghost" className="w-full text-muted-foreground font-medium" onClick={() => onOpenChange(false)}>
              Mungkin Nanti
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
