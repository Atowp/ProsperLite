import dayjs from "@/lib/dayjs";
import { useMemo } from "react";

/**
 * Hook that provides cached dayjs instances for common date references
 * This avoids creating new dayjs instances on every render
 */
export function useDayjsCache() {
  return useMemo(() => {
    const now = dayjs();

    return {
      now,
      todayStart: now.startOf("day"),
      todayEnd: now.endOf("day"),
      yesterdayStart: now.subtract(1, "day").startOf("day"),
      yesterdayEnd: now.subtract(1, "day").endOf("day"),
      currentMonthStart: now.startOf("month"),
      currentMonthEnd: now.endOf("month"),
      lastMonthStart: now.subtract(1, "month").startOf("month"),
      lastMonthEnd: now.subtract(1, "month").endOf("month"),
    };
  }, []); // Empty dependency array - these only need to be created once per session
}

/**
 * Hook that provides cached dayjs instances for a specific month
 */
export function useMonthCache(year: string, month: string) {
  return useMemo(() => {
    if (month === "all") {
      // Return entire year range
      const yearStart = dayjs(year).startOf("year");
      const yearEnd = dayjs(year).endOf("year");

      return {
        date: yearStart,
        monthStart: yearStart,
        monthEnd: yearEnd,
        monthStr: `${year}-all`,
      };
    }

    const monthStr = `${year}-${month}`;
    const date = dayjs(monthStr);

    return {
      date,
      monthStart: date.startOf("month"),
      monthEnd: date.endOf("month"),
      monthStr,
    };
  }, [year, month]);
}

/**
 * Parse transaction date once and cache it
 */
export function useTransactionDate(dateString: string | Date) {
  return useMemo(() => dayjs(dateString), [dateString]);
}
