import ArrowUpRightIcon from "~icons/lucide/arrow-up-right";
import ArrowDownRightIcon from "~icons/lucide/arrow-down-right";
import { Card } from "@ui/card";
import {
  MonthlyProgress,
  DashboardTransactionList,
  CategoryExpensePieChart,
  PeriodExpenseBarChart,
} from "@/features/dashboard";
import { useStore } from "@/store/useStore";
import { useMemo } from "react";
import dayjs from "@/lib/dayjs";
import { cn } from "@/lib/ui";

function Dashboard() {
  const { transactions } = useStore();

  // Calculate today's and yesterday's expenses
  const { todayExpenses, yesterdayExpenses, percentChange, isIncrease } =
    useMemo(() => {
      const now = dayjs();
      const todayStart = now.startOf("day");
      const todayEnd = now.endOf("day");
      const yesterdayStart = now.subtract(1, "day").startOf("day");
      const yesterdayEnd = now.subtract(1, "day").endOf("day");

      // Filter today's expenses
      const todayTotal = transactions
        .filter((tx) => {
          const txDate = dayjs(tx.date);
          return (
            tx.type === "expense" &&
            txDate.isAfter(todayStart) &&
            txDate.isBefore(todayEnd)
          );
        })
        .reduce((sum, tx) => sum + tx.amount, 0);

      // Filter yesterday's expenses
      const yesterdayTotal = transactions
        .filter((tx) => {
          const txDate = dayjs(tx.date);
          return (
            tx.type === "expense" &&
            txDate.isAfter(yesterdayStart) &&
            txDate.isBefore(yesterdayEnd)
          );
        })
        .reduce((sum, tx) => sum + tx.amount, 0);

      // Calculate percentage change
      const percentChange =
        yesterdayTotal > 0
          ? ((todayTotal - yesterdayTotal) / yesterdayTotal) * 100
          : 0;

      return {
        todayExpenses: todayTotal,
        yesterdayExpenses: yesterdayTotal,
        percentChange: Math.abs(percentChange),
        isIncrease: todayTotal > yesterdayTotal,
      };
    }, [transactions]);

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Today's Expenses */}
      <Card className="md:col-span-2 p-8">
        <p className="text-slate-500 text-sm font-medium mb-1">
          {dayjs().format("MMMM DD YYYY")}, Today's Expenses
        </p>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          {todayExpenses.toLocaleString("zh-Hans-CN", {
            style: "currency",
            currency: "CNY",
          })}
        </h1>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold",
              isIncrease
                ? "bg-red-50 text-red-700"
                : "bg-green-50 text-green-700"
            )}
          >
            {isIncrease ? (
              <ArrowUpRightIcon className="w-3 h-3" />
            ) : (
              <ArrowDownRightIcon className="w-3 h-3" />
            )}
            {yesterdayExpenses > 0 ? percentChange.toFixed(1) : "0.0"}%
          </span>
          <span className="text-slate-400 text-xs">
            vs yesterday ¥{yesterdayExpenses.toFixed(2)}
          </span>
        </div>
      </Card>

      {/* Recent Transactions */}
      <Card className="md:row-span-2 flex flex-col p-0 overflow-hidden">
        <DashboardTransactionList maxItems={10} />
      </Card>

      {/* Category Pie Chart */}
      <CategoryExpensePieChart />

      {/* Monthly Budget Progress */}
      <MonthlyProgress />

      {/* Expense Trends Bar Chart */}
      <div className="md:col-span-3">
        <PeriodExpenseBarChart />
      </div>
    </section>
  );
}

export default Dashboard;
