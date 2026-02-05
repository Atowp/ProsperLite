import { useStore } from "@/store/useStore";
import { Card } from "@ui/card";
import dayjs from "@/lib/dayjs";
import { PieChart, Pie, ResponsiveContainer } from "recharts";

interface MonthlyProgressProps {
  className?: string;
}

export function MonthlyProgress({ className }: MonthlyProgressProps) {
  const { transactions, monthlyLimit } = useStore();

  // Calculate current month's expenses
  const currentMonthExpenses = transactions
    .filter((tx) => {
      const txDate = dayjs(tx.date);
      const now = dayjs();
      return txDate.isSame(now, "month") && txDate.isSame(now, "year");
    })
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const percentage = (currentMonthExpenses / monthlyLimit) * 100;
  const remaining = Math.max(monthlyLimit - currentMonthExpenses, 0);
  const isOverBudget = currentMonthExpenses > monthlyLimit;

  // Colors
  const SPENT_COLOR = isOverBudget ? "#ef4444" : "#3b82f6";
  const REMAINING_COLOR = "#e5e7eb";

  // Prepare data for pie chart
  const data = isOverBudget
    ? [{ name: "spent", value: monthlyLimit, fill: SPENT_COLOR }]
    : [
        { name: "spent", value: currentMonthExpenses, fill: SPENT_COLOR },
        { name: "remaining", value: remaining, fill: REMAINING_COLOR },
      ];

  return (
    <Card className={className}>
      <div className="flex flex-col items-center p-6">
        {/* Header */}
        <div className="w-full mb-4">
          <h3 className="text-lg font-semibold">Monthly Budget</h3>
          {/* <p className="text-sm text-muted-foreground mt-1">
            {dayjs().format("MMMM YYYY")}
          </p> */}
        </div>

        {/* Pie Chart */}
        {monthlyLimit === 0 ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <p className="text-sm">No budget set</p>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center">
            {/* Pie Chart */}
            <div className="relative h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Text Overlay */}
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span
                  className={`text-lg font-bold ${
                    isOverBudget ? "text-red-600" : "text-blue-600"
                  }`}
                >
                  {percentage.toFixed(0)}%
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {isOverBudget ? "Over" : "Used"}
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="w-full mt-4 grid grid-cols-2 gap-2">
              <div className="flex flex-col items-center p-2 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Spent</p>
                <p
                  className={`text-base font-semibold ${
                    isOverBudget ? "text-red-600" : ""
                  }`}
                >
                  ¥{currentMonthExpenses.toFixed(2)}
                </p>
              </div>
              <div className="flex flex-col items-center p-2 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Limit</p>
                <p className="text-base font-semibold">
                  ¥{monthlyLimit.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
