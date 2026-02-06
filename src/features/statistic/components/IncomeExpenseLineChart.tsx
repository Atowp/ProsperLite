import { Card } from "@ui/card";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { useState } from "react";
import { cn } from "@/lib/ui";
import { useIncomeExpenseTrend } from "@/hooks/use-statistic-stats";

type PeriodType = "week" | "month" | "year";

interface IncomeExpenseData {
  name: string;
  income: number;
  expense: number;
  fullDate: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: {
    name: string;
    value: number;
    dataKey: string;
    payload: IncomeExpenseData;
    color: string;
  }[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as IncomeExpenseData;
    return (
      <div className="bg-background border rounded-lg p-3 shadow-md">
        <p className="font-semibold mb-2">{data.fullDate || label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name === "income" ? "Income" : "Expense"}: ¥
            {entry.value.toFixed(2)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function IncomeExpenseLineChart({ className }: { className?: string }) {
  const [period, setPeriod] = useState<PeriodType>("month");

  // Use cached query for trend data
  const { data: trendData, isLoading } = useIncomeExpenseTrend(period);

  if (isLoading) {
    return (
      <Card className={className}>
        <div className="flex flex-col p-6 min-h-[400px]">
          {/* Header with Period Toggle */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Income vs Expense</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Track your financial trends
              </p>
            </div>
            <div className="flex gap-1 flex-wrap">
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
                  {p === "week" ? "This Week" : p === "month" ? "This Month" : "This Year"}
                </button>
              ))}
            </div>
          </div>

          {/* Loading Skeleton */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full h-[300px] animate-pulse bg-muted/20 rounded-lg" />
          </div>
        </div>
      </Card>
    );
  }

  const data = trendData || [];
  const hasNoData = data.every((d) => d.income === 0 && d.expense === 0);

  return (
    <Card className={className}>
      <div className="flex flex-col p-2 min-h-[500px]">
        {/* Header with Period Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Income vs Expense</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Track your financial trends
            </p>
          </div>
          <div className="flex gap-1 flex-wrap">
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
                {p === "week" ? "Week" : p === "month" ? "Month" : "Year"}
              </button>
            ))}
          </div>
        </div>

        {/* Line Chart */}
        {hasNoData ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <p className="text-sm">No transaction data yet</p>
          </div>
        ) : (
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
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
                  width={70}
                  tickFormatter={(value) => `¥${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: "12px" }}
                  formatter={(value) =>
                    value === "income" ? "Income" : "Expense"
                  }
                />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Summary */}
        {!hasNoData && (
          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <p className="text-muted-foreground text-xs">Total Income</p>
              <p className="font-semibold text-green-600">
                ¥{data.reduce((sum, d) => sum + d.income, 0).toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground text-xs">Total Expense</p>
              <p className="font-semibold text-red-600">
                ¥{data.reduce((sum, d) => sum + d.expense, 0).toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground text-xs">Net</p>
              <p
                className={`font-semibold ${
                  data.reduce((sum, d) => sum + d.income - d.expense, 0) >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                ¥
                {data
                  .reduce((sum, d) => sum + d.income - d.expense, 0)
                  .toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
