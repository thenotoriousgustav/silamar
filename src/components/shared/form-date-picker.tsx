"use client";

import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface FormDatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
}

/**
 * Reusable date picker combining Popover + Calendar in a single component.
 * Eliminates repeated Popover/Calendar boilerplate across form components.
 */
export function FormDatePicker({
  value,
  onChange,
  placeholder = "Pilih tanggal",
}: FormDatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "bg-background h-9 w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? (
            format(value, "d MMM yyyy", { locale: idLocale })
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="pointer-events-auto z-100 w-auto p-0"
        align="start"
      >
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          defaultMonth={value}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}
