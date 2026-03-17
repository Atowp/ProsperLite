import ArrowUpRightIcon from "~icons/lucide/arrow-up-right";
import ArrowDownRightIcon from "~icons/lucide/arrow-down-right";
import { Card } from "@ui/card";
import {
  MonthlyProgress,
  DashboardTransactionList,
  CategoryExpensePieChart,
  PeriodExpenseBarChart,
} from "@/features/dashboard";
import { useDashboardStats } from "@/features/dashboard/hooks/use-dashboard-stats";
import { Skeleton } from "@ui/skeleton";
import dayjs from "@/lib/dayjs";
import { cn } from "@/lib/ui";

function Dashboard() {
  // Use cached query for statistics
  const { data: stats, isLoading: statsLoading } = useDashboardStats();

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Today's Expenses */}
      <Card className="md:col-span-2 p-8">
        <p className="text-slate-500 text-sm font-medium mb-1">
          {dayjs().format("MMMM DD YYYY")}, Today's Expenses
        </p>
        {statsLoading ? (
          <Skeleton className="h-12 w-48 mb-4" />
        ) : (
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            {stats?.todayExpenses.toLocaleString("zh-Hans-CN", {
              style: "currency",
              currency: "CNY",
            })}
          </h1>
        )}
        {statsLoading ? (
          <div className="flex gap-4">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold",
                stats?.isIncrease
                  ? "bg-red-50 text-red-700"
                  : "bg-green-50 text-green-700"
              )}
            >
              {stats?.isIncrease ? (
                <ArrowUpRightIcon className="w-3 h-3" />
              ) : (
                <ArrowDownRightIcon className="w-3 h-3" />
              )}
              {stats && stats.yesterdayExpenses > 0
                ? stats.percentChange.toFixed(1)
                : "0.0"}
              %
            </span>
            <span className="text-slate-400 text-xs">
              vs yesterday ¥{stats?.yesterdayExpenses.toFixed(2) || "0.00"}
            </span>
          </div>
        )}
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
