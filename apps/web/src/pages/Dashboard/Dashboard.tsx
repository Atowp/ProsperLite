import { Card } from "@ui/card";
import {
  MonthlyProgress,
  DashboardTransactionList,
  CategoryExpensePieChart,
  PeriodExpenseBarChart,
  TodayExpensesCard,
} from "@/features/dashboard";
import { useDashboardStats } from "@/features/dashboard/hooks/use-dashboard-stats";

function Dashboard() {
  // Use cached query for statistics
  const { data: stats, isLoading: statsLoading } = useDashboardStats();

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Today's Expenses */}
      <TodayExpensesCard stats={stats} isLoading={statsLoading} />

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
