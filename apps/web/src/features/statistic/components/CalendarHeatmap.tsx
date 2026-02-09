import { Card } from "@ui/card";
import { useState } from "react";
import { useDayjsCache } from "@/hooks/use-dayjs";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@/store/useStore";
import dayjs from "dayjs";
import { cn } from "@/lib/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Transaction } from "@/schemas";

// Query keys
const calendarHeatmapQueryKeys = {
  all: ["calendar-heatmap"] as const,
  yearly: (year: string) =>
    [...calendarHeatmapQueryKeys.all, "year", year] as const,
};

// Generate year options (last 5 years)
function generateYearOptions() {
  const options: { value: string; label: string }[] = [];
  const now = new Date();

  for (let i = 0; i < 5; i++) {
    const year = now.getFullYear() - i;
    options.push({
      value: year.toString(),
      label: `${year}`,
    });
  }

  return options;
}

const YEAR_OPTIONS = generateYearOptions();

// Color levels for the heatmap
const getColorLevel = (amount: number, maxAmount: number): number => {
  if (amount === 0) return 0;
  const ratio = amount / maxAmount;
  if (ratio < 0.25) return 1;
  if (ratio < 0.5) return 2;
  if (ratio < 0.75) return 3;
  return 4;
};

const getLevelColor = (level: number): string => {
  const colors = [
    "bg-gray-100 dark:bg-gray-800", // level 0 - no data
    "bg-blue-200 dark:bg-blue-900", // level 1 - light
    "bg-blue-300 dark:bg-blue-700", // level 2 - medium-light
    "bg-blue-400 dark:bg-blue-600", // level 3 - medium-dark
    "bg-blue-500 dark:bg-blue-500", // level 4 - dark
  ];
  return colors[level] || colors[0];
};

interface DayData {
  date: string;
  amount: number;
  dayOfWeek: number;
  weekOfYear: number;
}

// Helper to group transactions by date
function groupTransactionsByDate(transactions: Transaction[], year: string) {
  const dailyData: Map<string, number> = new Map();
  const yearStart = dayjs(year).startOf("year");
  const yearEnd = dayjs(year).endOf("year");

  // Initialize all days of the year with 0
  let current = yearStart;
  while (current.isBefore(yearEnd) || current.isSame(yearEnd, "day")) {
    dailyData.set(current.format("YYYY-MM-DD"), 0);
    current = current.add(1, "day");
  }

  // Sum up expenses by date
  transactions
    .filter((tx) => {
      const txDate = dayjs(tx.date);
      return (
        tx.type === "expense" &&
        txDate.isSameOrAfter(yearStart) &&
        txDate.isSameOrBefore(yearEnd)
      );
    })
    .forEach((tx) => {
      const dateKey = dayjs(tx.date).format("YYYY-MM-DD");
      dailyData.set(dateKey, (dailyData.get(dateKey) || 0) + tx.amount);
    });

  return dailyData;
}

// Generate heatmap grid data
function generateHeatmapData(
  dailyData: Map<string, number>,
  year: string
): { weeks: DayData[][]; maxAmount: number; yearTotal: number } {
  const yearStart = dayjs(year).startOf("year");
  const weeks: DayData[][] = [];
  let maxAmount = 0;
  let yearTotal = 0;

  // Find first Sunday of the year (or last Sunday of previous year)
  let startDate = yearStart;
  while (startDate.day() !== 0) {
    startDate = startDate.subtract(1, "day");
  }

  // Generate 53 weeks
  let currentWeekStart = startDate;
  for (let week = 0; week < 53; week++) {
    const weekData: DayData[] = [];
    for (let day = 0; day < 7; day++) {
      const currentDate = currentWeekStart.add(day, "day");
      const dateStr = currentDate.format("YYYY-MM-DD");
      const amount = dailyData.get(dateStr) || 0;

      if (currentDate.year() === parseInt(year)) {
        maxAmount = Math.max(maxAmount, amount);
        yearTotal += amount;
      }

      weekData.push({
        date: dateStr,
        amount,
        dayOfWeek: day,
        weekOfYear: week,
      });
    }
    weeks.push(weekData);
    currentWeekStart = currentWeekStart.add(7, "day");
  }

  return { weeks, maxAmount, yearTotal };
}

interface TooltipProps {
  date: string;
  amount: number;
  position: { x: number; y: number };
  visible: boolean;
}

function HeatmapTooltip({ date, amount, position, visible }: TooltipProps) {
  if (!visible) return null;

  return (
    <div
      className="fixed z-50 bg-background border rounded-lg p-2 shadow-lg pointer-events-none text-xs"
      style={{ left: position.x + 10, top: position.y - 40 }}
    >
      <p className="font-medium">{dayjs(date).format("MMM D, YYYY")}</p>
      <p className="text-muted-foreground">
        {amount > 0 ? `¥${amount.toFixed(2)}` : "No expenses"}
      </p>
    </div>
  );
}

export function CalendarHeatmap({ className }: { className?: string }) {
  const { transactions } = useStore();
  const { now } = useDayjsCache();
  const [selectedYear, setSelectedYear] = useState<string>(
    now.year().toString()
  );
  const [tooltip, setTooltip] = useState<{
    date: string;
    amount: number;
    position: { x: number; y: number };
    visible: boolean;
  }>({ date: "", amount: 0, position: { x: 0, y: 0 }, visible: false });

  // Use React Query to cache heatmap calculations
  const { data: heatmapData, isLoading } = useQuery({
    queryKey: calendarHeatmapQueryKeys.yearly(selectedYear),
    queryFn: () => {
      const dailyData = groupTransactionsByDate(transactions, selectedYear);
      return generateHeatmapData(dailyData, selectedYear);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
  });

  const handleMouseEnter = (
    date: string,
    amount: number,
    e: React.MouseEvent
  ) => {
    setTooltip({
      date,
      amount,
      position: { x: e.clientX, y: e.clientY },
      visible: true,
    });
  };

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <div className="flex flex-col p-6 min-h-[300px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Activity Heatmap</h3>
            <div className="w-[100px] h-8 bg-muted animate-pulse rounded" />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full h-[200px] bg-muted/20 animate-pulse rounded-lg" />
          </div>
        </div>
      </Card>
    );
  }

  if (!heatmapData) return null;

  const { weeks, maxAmount, yearTotal } = heatmapData;

  // Calculate which week each month starts at
  const getMonthStartWeek = (monthIndex: number): number => {
    const yearStart = dayjs(selectedYear).startOf("year");
    const monthStart = dayjs(selectedYear).month(monthIndex).startOf("month");
    const weekDiff = monthStart.diff(yearStart, "week");
    return Math.max(0, weekDiff);
  };

  const monthLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <Card className={className}>
      <HeatmapTooltip {...tooltip} />
      <div className="flex flex-col p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Activity Heatmap</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Total: ¥{yearTotal.toFixed(2)} in {selectedYear}
            </p>
          </div>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[100px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {YEAR_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Heatmap */}
        <div className="flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-1 text-xs text-muted-foreground pr-2">
            <div className="h-4" /> {/* Spacer for month labels row */}
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
              (day, index) => (
                <div key={index} className="h-3 flex items-center">
                  <span>{day}</span>
                </div>
              )
            )}
          </div>

          {/* Weeks */}
          <div className="flex-1 overflow-x-auto">
            <div className="flex flex-col gap-1 min-w-max relative">
              {/* Month labels */}
              <div className="flex text-xs text-muted-foreground h-4">
                {monthLabels.map((month, index) => {
                  const weekIndex = getMonthStartWeek(index);
                  return (
                    <span
                      key={month}
                      className="absolute"
                      style={{ left: `${weekIndex * 16}px` }}
                    >
                      {month}
                    </span>
                  );
                })}
              </div>

              {/* Weeks grid */}
              <div className="flex gap-1">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {week.map((day) => {
                      const colorLevel = getColorLevel(day.amount, maxAmount);
                      const isCurrentYear =
                        dayjs(day.date).year() === parseInt(selectedYear);

                      return (
                        <div
                          key={day.date}
                          className={cn(
                            "w-3 h-3 rounded-sm cursor-pointer transition-colors hover:ring-1 hover:ring-border",
                            getLevelColor(colorLevel),
                            !isCurrentYear && "opacity-20"
                          )}
                          onMouseEnter={(e) =>
                            handleMouseEnter(day.date, day.amount, e)
                          }
                          onMouseLeave={handleMouseLeave}
                          title={`${day.date}: ¥${day.amount.toFixed(2)}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-2 mt-4 text-xs text-muted-foreground">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={cn("w-3 h-3 rounded-sm", getLevelColor(level))}
            />
          ))}
          <span>More</span>
        </div>
      </div>
    </Card>
  );
}
