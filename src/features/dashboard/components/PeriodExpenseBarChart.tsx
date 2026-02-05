import { useStore } from "@/store/useStore";
import { Card } from "@ui/card";
import dayjs from "@/lib/dayjs";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { cn } from "@/lib/ui";
import { useState, useMemo } from "react";

type PeriodType = "week" | "month" | "year";

interface PeriodExpenseBarChartProps {
  className?: string;
}

interface PeriodExpenseData {
  name: string;
  value: number;
  fullDate: string;
}

// Define tooltip payload interface manually
interface TooltipPayloadItem {
  payload: PeriodExpenseData;
  value: number;
  name: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

// Move CustomTooltip outside component to avoid recreation
const CustomTooltip = ({
  active,
  payload,
  label,
}: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as PeriodExpenseData;
    return (
      <div className="bg-background border rounded-lg p-3 shadow-md">
        <p className="font-semibold">{data.fullDate || label}</p>
        <p className="text-sm text-muted-foreground">
          ¥{data.value.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

export function PeriodExpenseBarChart({ className }: PeriodExpenseBarChartProps) {
  const { transactions } = useStore();
  const [period, setPeriod] = useState<PeriodType>("week");

  // Memoize data calculation to avoid recalculation on every render
  const data: PeriodExpenseData[] = useMemo(() => {
    const now = dayjs();
    const expenseTransactions = transactions.filter(
      (tx) => tx.type === "expense"
    );

    if (period === "week") {
      // Last 7 days
      const days: PeriodExpenseData[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = now.subtract(i, "day");
        const dayStart = date.startOf("day");
        const dayEnd = date.endOf("day");

        const total = expenseTransactions
          .filter((tx) => {
            const txDate = dayjs(tx.date);
            // Use isSameOrAfter and isSameOrBefore to include boundary times
            return (
              txDate.isSameOrAfter(dayStart) && txDate.isSameOrBefore(dayEnd)
            );
          })
          .reduce((sum, tx) => sum + tx.amount, 0);

        days.push({
          name: date.format("MM/DD"),
          value: total,
          fullDate: date.format("YYYY-MM-DD"),
        });
      }
      return days;
    } else if (period === "month") {
      // Last 30 days grouped by week
      const weeks: PeriodExpenseData[] = [];
      for (let i = 3; i >= 0; i--) {
        const weekStart = now.subtract(i, "week").startOf("week");
        const weekEnd = now.subtract(i, "week").endOf("week");

        const total = expenseTransactions
          .filter((tx) => {
            const txDate = dayjs(tx.date);
            return (
              txDate.isSameOrAfter(weekStart) && txDate.isSameOrBefore(weekEnd)
            );
          })
          .reduce((sum, tx) => sum + tx.amount, 0);

        weeks.push({
          name: `Week ${4 - i}`,
          value: total,
          fullDate: `${weekStart.format("MM/DD")}-${weekEnd.format("MM/DD")}`,
        });
      }
      return weeks;
    } else {
      // Last 12 months
      const months: PeriodExpenseData[] = [];
      for (let i = 11; i >= 0; i--) {
        const date = now.subtract(i, "month");
        const monthStart = date.startOf("month");
        const monthEnd = date.endOf("month");

        const total = expenseTransactions
          .filter((tx) => {
            const txDate = dayjs(tx.date);
            return (
              txDate.isSameOrAfter(monthStart) && txDate.isSameOrBefore(monthEnd)
            );
          })
          .reduce((sum, tx) => sum + tx.amount, 0);

        months.push({
          name: date.format("MMM"),
          value: total,
          fullDate: date.format("YYYY-MM"),
        });
      }
      return months;
    }
  }, [transactions, period]);

  // Check if data is empty
  const hasNoData = data.length === 0 || data.every((d) => d.value === 0);

  return (
    <Card className={className}>
      <div className="flex flex-col p-6 min-h-[400px]">
        {/* Header with Period Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Expense Trends</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Track your spending over time
            </p>
          </div>
          <div className="flex gap-1">
            {(["week", "month", "year"] as PeriodType[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                  period === p
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        {hasNoData ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <p className="text-sm">No expense data yet</p>
          </div>
        ) : (
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                  width={60}
                  tickFormatter={(value) => `¥${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: "12px" }}
                  formatter={() => "Expenses"}
                />
                <Bar
                  dataKey="value"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Summary */}
        {!hasNoData && (
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-muted-foreground">
              {period === "week"
                ? "Last 7 days"
                : period === "month"
                ? "Last 4 weeks"
                : "Last 12 months"}
            </span>
            <span className="font-semibold">
              Total: ¥{data.reduce((sum, d) => sum + d.value, 0).toFixed(2)}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
