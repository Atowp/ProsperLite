import {
  StatCards,
  IncomeExpenseLineChart,
  CategoryRanking,
  CalendarHeatmap,
} from "@/features/statistic";

function Statistic() {
  return (
    <section className="space-y-6">
      {/* Statistics Cards */}
      <StatCards />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income vs Expense Line Chart */}
        <div className="lg:col-span-2">
          <IncomeExpenseLineChart />
        </div>
        {/* Category Ranking */}
        <div className="lg:col-span-1">
          <CategoryRanking />
        </div>
      </div>

      {/* Calendar Heatmap */}
      <CalendarHeatmap />
    </section>
  );
}

export default Statistic;
