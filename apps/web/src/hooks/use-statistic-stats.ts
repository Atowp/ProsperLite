import { useQuery } from "@tanstack/react-query";
import { useStore } from "@/store/useStore";
import { useMonthCache } from "@/hooks/use-dayjs";
import dayjs from "@/lib/dayjs";
import type { Transaction } from "@/schemas/transaction";

/**
 * Query key factory for statistics
 */
export const statisticQueryKeys = {
  all: ["statistic"] as const,
  cards: () => [...statisticQueryKeys.all, "cards"] as const,
  trend: (period: string) =>
    [...statisticQueryKeys.all, "trend", period] as const,
  categoryRanking: (year: string, month: string) =>
    [...statisticQueryKeys.all, "category-ranking", year, month] as const,
};

/**
 * Filter and aggregate transactions by category
 */
function aggregateByCategory(
  transactions: Transaction[],
  categories: { id: string; name: string }[],
  startDate: dayjs.Dayjs,
  endDate: dayjs.Dayjs
) {
  // Filter transactions by date and type
  const filteredTransactions = transactions.filter((tx) => {
    const txDate = dayjs(tx.date);
    return (
      tx.type === "expense" &&
      txDate.isSameOrAfter(startDate) &&
      txDate.isSameOrBefore(endDate)
    );
  });

  // Calculate stats for each category
  const categoryStats = categories
    .map((category) => {
      const categoryTransactions = filteredTransactions.filter(
        (tx) => tx.categoryId === category.id
      );

      const amount = categoryTransactions.reduce(
        (sum, tx) => sum + tx.amount,
        0
      );

      return {
        categoryId: category.id,
        categoryName: category.name,
        amount,
        count: categoryTransactions.length,
      };
    })
    .filter((item) => item.amount > 0);

  // Calculate totals
  const totalAmount = categoryStats.reduce((sum, item) => sum + item.amount, 0);
  const totalCount = categoryStats.reduce((sum, item) => sum + item.count, 0);

  // Add percentages
  return categoryStats.map((item) => ({
    ...item,
    amountPercentage: totalAmount > 0 ? (item.amount / totalAmount) * 100 : 0,
    countPercentage: totalCount > 0 ? (item.count / totalCount) * 100 : 0,
  }));
}

/**
 * Hook to get category ranking for a specific month
 */
export function useCategoryRanking(year: string, month: string) {
  const { transactions, categories } = useStore();
  const { monthStart, monthEnd } = useMonthCache(year, month);

  return useQuery({
    queryKey: statisticQueryKeys.categoryRanking(year, month),
    queryFn: () =>
      aggregateByCategory(transactions, categories, monthStart, monthEnd),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Helper to calculate period statistics (income vs expense)
 */
function calculatePeriodStats(
  transactions: Transaction[],
  periodStart: dayjs.Dayjs,
  periodEnd: dayjs.Dayjs
) {
  const income = transactions
    .filter((tx) => {
      const txDate = dayjs(tx.date);
      return (
        tx.type === "income" &&
        txDate.isSameOrAfter(periodStart) &&
        txDate.isSameOrBefore(periodEnd)
      );
    })
    .reduce((sum, tx) => sum + tx.amount, 0);

  const expense = transactions
    .filter((tx) => {
      const txDate = dayjs(tx.date);
      return (
        tx.type === "expense" &&
        txDate.isSameOrAfter(periodStart) &&
        txDate.isSameOrBefore(periodEnd)
      );
    })
    .reduce((sum, tx) => sum + tx.amount, 0);

  return { income, expense };
}

/**
 * Generate time period data points for trend analysis
 */
function generateTimePeriodData(
  transactions: Transaction[],
  period: "week" | "month" | "year",
  currentDate: dayjs.Dayjs
) {
  const data: Array<{
    name: string;
    fullDate: string;
    income: number;
    expense: number;
  }> = [];

  if (period === "week") {
    // Current week (Monday to Sunday)
    const weekStart = currentDate.startOf("week");

    for (let i = 0; i < 7; i++) {
      const date = weekStart.add(i, "day");
      const dayStart = date.startOf("day");
      const dayEnd = date.endOf("day");

      const { income, expense } = calculatePeriodStats(
        transactions,
        dayStart,
        dayEnd
      );

      data.push({
        name: date.format("MM/DD"),
        fullDate: date.format("YYYY-MM-DD"),
        income,
        expense,
      });
    }
  } else if (period === "month") {
    // Current month (1st to last day)
    const monthStart = currentDate.startOf("month");
    const monthEnd = currentDate.endOf("month");
    const daysInMonth = monthEnd.date();

    // Group by 5-day periods for better visualization
    const periods = Math.ceil(daysInMonth / 5);
    for (let i = 0; i < periods; i++) {
      const periodStart = monthStart.add(i * 5, "day");
      const periodEnd = periodStart.add(4, "day");

      // Adjust the last period to end at month end
      const adjustedEnd = periodEnd.isAfter(monthEnd) ? monthEnd : periodEnd;

      const { income, expense } = calculatePeriodStats(
        transactions,
        periodStart.startOf("day"),
        adjustedEnd.endOf("day")
      );

      data.push({
        name: `${periodStart.format("MM/DD")}-${adjustedEnd.format("MM/DD")}`,
        fullDate: `${periodStart.format("YYYY-MM-DD")}-${adjustedEnd.format(
          "YYYY-MM-DD"
        )}`,
        income,
        expense,
      });
    }
  } else {
    // Current year (January to December)
    const yearStart = currentDate.startOf("year");

    for (let i = 0; i < 12; i++) {
      const date = yearStart.month(i);
      const monthStart = date.startOf("month");
      const monthEnd = date.endOf("month");

      const { income, expense } = calculatePeriodStats(
        transactions,
        monthStart,
        monthEnd
      );

      data.push({
        name: date.format("MMM"),
        fullDate: date.format("YYYY-MM"),
        income,
        expense,
      });
    }
  }

  return data;
}

/**
 * Hook to get trend data for income vs expense
 */
export function useIncomeExpenseTrend(period: "week" | "month" | "year") {
  const { transactions } = useStore();

  return useQuery({
    queryKey: statisticQueryKeys.trend(period),
    queryFn: () => {
      const now = dayjs();
      return generateTimePeriodData(transactions, period, now);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
