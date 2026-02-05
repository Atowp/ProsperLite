import { useState } from "react";
import CalendarIcon from "~icons/lucide/calendar";
import XIcon from "~icons/lucide/x";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "@/lib/ui";
import dayjs from "@/lib/dayjs";

interface DateRangePickerProps {
  startDate: string | null;
  endDate: string | null;
  onDateRangeChange: (start: string | null, end: string | null) => void;
  className?: string;
}

export function DateRangePicker({
  startDate,
  endDate,
  onDateRangeChange,
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);

  // Convert string dates to Date objects for the calendar with validation
  const start =
    startDate && dayjs(startDate).isValid() ? new Date(startDate) : undefined;
  const end =
    endDate && dayjs(endDate).isValid() ? new Date(endDate) : undefined;

  const handleClear = () => {
    onDateRangeChange(null, null);
  };

  const handleSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (!range) {
      onDateRangeChange(null, null);
      return;
    }

    const from = range.from ? dayjs(range.from).format("YYYY-MM-DD") : null;
    const to = range.to ? dayjs(range.to).format("YYYY-MM-DD") : null;

    onDateRangeChange(from, to);
  };

  const formatDate = (date: Date | undefined): string => {
    if (!date) return "";
    const d = dayjs(date);
    return d.isValid() ? d.format("MMM DD, YYYY") : "";
  };

  const hasActiveFilter = startDate || endDate;

  // Determine display text
  const getDisplayText = () => {
    if (start && end) {
      return `${formatDate(start)} - ${formatDate(end)}`;
    }
    if (start) {
      return `${formatDate(start)} - ...`;
    }
    if (end) {
      return `... - ${formatDate(end)}`;
    }
    return "Pick a date range";
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal h-8 w-full sm:w-auto flex-1 sm:flex-none",
              !startDate && !endDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="truncate">{getDisplayText()}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={{ from: start, to: end }}
            onSelect={handleSelect}
            numberOfMonths={2}
            disabled={(date) => date > new Date()}
          />
        </PopoverContent>
      </Popover>

      {hasActiveFilter && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="h-8 px-2 flex-shrink-0"
        >
          <XIcon className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
