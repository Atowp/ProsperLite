import { Card } from "@ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategoryRanking } from "@/features/statistic/hooks/use-statistic-stats";
import { cn } from "@/lib/ui";
import { useMemo, useState } from "react";

type SortType = "amount" | "count";

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

// Generate month options
function generateMonthOptions() {
  const options: { value: string; label: string }[] = [];

  // Add "All" option
  options.push({
    value: "all",
    label: "All",
  });

  for (let i = 1; i <= 12; i++) {
    const month = i.toString().padStart(2, "0");
    options.push({
      value: month,
      label: `${i}`,
    });
  }

  return options;
}

const YEAR_OPTIONS = generateYearOptions();
const MONTH_OPTIONS = generateMonthOptions();

export function CategoryRanking({ className }: { className?: string }) {
  const now = new Date();
  const [sortBy, setSortBy] = useState<SortType>("amount");
  const [selectedYear, setSelectedYear] = useState<string>(
    now.getFullYear().toString()
  );
  const [selectedMonth, setSelectedMonth] = useState<string>(
    (now.getMonth() + 1).toString().padStart(2, "0")
  );

  // Use cached query for category ranking
  const { data: categoryData, isLoading } = useCategoryRanking(
    selectedYear,
    selectedMonth
  );

  // Sort data based on sortBy
  const sortedData = useMemo(() => {
    if (!categoryData) return [];
    return [...categoryData].sort((a, b) =>
      sortBy === "amount" ? b.amount - a.amount : b.count - a.count
    );
  }, [categoryData, sortBy]);

  // Calculate total based on sort type
  const totalValue = useMemo(() => {
    if (!sortedData) return 0;
    if (sortBy === "amount") {
      return sortedData.reduce((sum, item) => sum + item.amount, 0);
    } else {
      return sortedData.reduce((sum, item) => sum + item.count, 0);
    }
  }, [sortedData, sortBy]);

  return (
    <Card className={className}>
      <div className="flex flex-col p-2 h-[500px]">
        {/* Header with Year/Month Selector */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Rank</h3>
          <div className="flex gap-2">
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
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[80px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTH_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Sort Toggle */}
        <div className="flex gap-1 mb-4">
          <button
            type="button"
            onClick={() => setSortBy("amount")}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-md transition-colors",
              sortBy === "amount"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            By Amount
          </button>
          <button
            type="button"
            onClick={() => setSortBy("count")}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-md transition-colors",
              sortBy === "count"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            By Count
          </button>
        </div>

        {/* Category List with Scroll */}
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-muted animate-pulse" />
                      <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                    </div>
                    <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                  </div>
                  <div className="h-2 w-full bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
          </div>
        ) : !sortedData || sortedData.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <p className="text-sm">
              No expenses {selectedMonth === "all" ? "this year" : "this month"}
            </p>
          </div>
        ) : (
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4 pr-2">
              {sortedData.map((item, index) => {
                const percentage =
                  sortBy === "amount"
                    ? item.amountPercentage
                    : item.countPercentage;
                return (
                  <div key={item.categoryId} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold",
                            index < 3
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {index + 1}
                        </span>
                        <span className="font-medium">{item.categoryName}</span>
                      </div>
                      {sortBy === "amount" ? (
                        <span className="font-semibold">
                          ¥{item.amount.toFixed(2)}
                        </span>
                      ) : (
                        <span className="font-semibold">{item.count}</span>
                      )}
                    </div>
                    <Progress value={percentage} className="h-2" />
                    <p className="text-xs text-muted-foreground text-right">
                      {percentage.toFixed(1)}%
                    </p>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}

        {/* Total */}
        {sortedData && sortedData.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {sortBy === "amount" ? "Total Expense" : "Total Number"}
              </span>
              <span className="text-lg font-bold">
                {sortBy === "amount"
                  ? `¥${totalValue.toFixed(2)}`
                  : `${totalValue}`}
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
