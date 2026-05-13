import { type ClassValue, clsx } from "clsx";
import { format, parse } from "date-fns";
import { enUS } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatResumeDate(dateStr: string | undefined): string {
  if (!dateStr) return "";
  if (dateStr.toLowerCase() === "present" || dateStr.toLowerCase() === "sekarang")
    return dateStr;

  try {
    // Try parsing MMMM yyyy (full month)
    const d1 = parse(dateStr, "MMMM yyyy", new Date(), { locale: enUS });
    if (!isNaN(d1.getTime())) return format(d1, "MMM yyyy", { locale: enUS });

    // Try parsing MMM yyyy (short month)
    const d2 = parse(dateStr, "MMM yyyy", new Date(), { locale: enUS });
    if (!isNaN(d2.getTime())) return format(d2, "MMM yyyy", { locale: enUS });

    // Try parsing MM yyyy (numeric month)
    const d3 = parse(dateStr, "MM yyyy", new Date(), { locale: enUS });
    if (!isNaN(d3.getTime())) return format(d3, "MMM yyyy", { locale: enUS });

    return dateStr;
  } catch {
    return dateStr;
  }
}
