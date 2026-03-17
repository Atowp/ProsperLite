import { useQuery } from "@tanstack/react-query";
import { useStore } from "@/store/useStore";
import { useDayjsCache } from "@/hooks/use-dayjs";
import {
  filterTransactionsByPeriod,
  filterTransactionsByDateRange,
} from "@/lib/transaction-filters";
import { useMemo } from "react";
import dayjs from "@/lib/dayjs";

/**
 * Query key factory for dashboard statistics
 */
export const dashboardQueryKeys = {
  all: ["dashboard"] as const,
  stats: () => [...dashboardQueryKeys.all, "stats"] as const,
  today: () => [...dashboardQueryKeys.all, "today"] as const,
  monthlyProgress: () =>
    [...dashboardQueryKeys.all, "monthly-progress"] as const,
};

/**
 * Hook to calculate and cache dashboard statistics
 */
export function useDashboardStats() {
  const { transactions } = useStore();
  const { todayStart, todayEnd, yesterdayStart, yesterdayEnd } =
    useDayjsCache();

  return useQuery({
    queryKey: dashboardQueryKeys.stats(),
    queryFn: () => {
      // Current day expenses
      const todayExpenses = filterTransactionsByPeriod(
        transactions,
        "expense",
        todayStart,
        todayEnd
      );

      // Yesterday expenses
      const yesterdayExpenses = filterTransactionsByPeriod(
        transactions,
        "expense",
        yesterdayStart,
        yesterdayEnd
      );

      // Calculate percentage change
      const percentChange =
        yesterdayExpenses > 0
          ? ((todayExpenses - yesterdayExpenses) / yesterdayExpenses) * 100
          : 0;

      const isIncrease = todayExpenses > yesterdayExpenses;

      return {
        todayExpenses,
        yesterdayExpenses,
        percentChange: Math.abs(percentChange),
        isIncrease,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to calculate and cache monthly budget progress
 */
export function useMonthlyProgress() {
  const { transactions, monthlyLimit } = useStore();
  const { currentMonthStart, currentMonthEnd } = useDayjsCache();

  return useQuery({
    queryKey: dashboardQueryKeys.monthlyProgress(),
    queryFn: () => {
      const currentMonthExpenses = filterTransactionsByPeriod(
        transactions,
        "expense",
        currentMonthStart,
        currentMonthEnd
      );

      const percentage = (currentMonthExpenses / monthlyLimit) * 100;
      const remaining = Math.max(monthlyLimit - currentMonthExpenses, 0);
      const isOverBudget = currentMonthExpenses > monthlyLimit;

      return {
        currentMonthExpenses,
        percentage,
        remaining,
        isOverBudget,
      };
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to get filtered transactions by date range (memoized)
 */
export function useFilteredTransactions(
  startDate: dayjs.Dayjs,
  endDate: dayjs.Dayjs,
  type?: "income" | "expense"
) {
  const { transactions } = useStore();

  return useMemo(() => {
    return filterTransactionsByDateRange(
      transactions,
      startDate,
      endDate,
      type
    );
  }, [transactions, startDate, endDate, type]);
}
