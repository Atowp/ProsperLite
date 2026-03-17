import type { Transaction } from "@/schemas/transaction";
import dayjs from "@/lib/dayjs";

/**
 * Filter transactions by type and date range, then sum the amounts
 *
 * @param transactions - Array of transactions to filter
 * @param type - Transaction type to filter by ("income" | "expense")
 * @param startDate - Start date (inclusive)
 * @param endDate - End date (inclusive)
 * @returns Total amount of filtered transactions
 *
 * @example
 * ```ts
 * const total = filterTransactionsByPeriod(
 *   transactions,
 *   "expense",
 *   dayjs().startOf("month"),
 *   dayjs().endOf("month")
 * );
 * ```
 */
export function filterTransactionsByPeriod(
  transactions: Transaction[],
  type: "income" | "expense",
  startDate: dayjs.Dayjs,
  endDate: dayjs.Dayjs
): number {
  return transactions
    .filter((tx) => {
      const txDate = dayjs(tx.date);
      return (
        tx.type === type &&
        txDate.isSameOrAfter(startDate) &&
        txDate.isSameOrBefore(endDate)
      );
    })
    .reduce((sum, tx) => sum + tx.amount, 0);
}

/**
 * Calculate both income and expense for a period
 *
 * @param transactions - Array of transactions to filter
 * @param periodStart - Start date (inclusive)
 * @param periodEnd - End date (inclusive)
 * @returns Object with income and expense totals
 *
 * @example
 * ```ts
 * const { income, expense } = calculatePeriodStats(
 *   transactions,
 *   dayjs().startOf("month"),
 *   dayjs().endOf("month")
 * );
 * ```
 */
export function calculatePeriodStats(
  transactions: Transaction[],
  periodStart: dayjs.Dayjs,
  periodEnd: dayjs.Dayjs
): { income: number; expense: number } {
  const income = filterTransactionsByPeriod(
    transactions,
    "income",
    periodStart,
    periodEnd
  );

  const expense = filterTransactionsByPeriod(
    transactions,
    "expense",
    periodStart,
    periodEnd
  );

  return { income, expense };
}

/**
 * Filter transactions by date range (all types)
 *
 * @param transactions - Array of transactions to filter
 * @param startDate - Start date (inclusive)
 * @param endDate - End date (inclusive)
 * @param type - Optional transaction type filter
 * @returns Filtered array of transactions
 *
 * @example
 * ```ts
 * const expenseTransactions = filterTransactionsByDateRange(
 *   transactions,
 *   dayjs().startOf("month"),
 *   dayjs().endOf("month"),
 *   "expense"
 * );
 *
 * const allTransactions = filterTransactionsByDateRange(
 *   transactions,
 *   dayjs().startOf("month"),
 *   dayjs().endOf("month")
 * );
 * ```
 */
export function filterTransactionsByDateRange(
  transactions: Transaction[],
  startDate: dayjs.Dayjs,
  endDate: dayjs.Dayjs,
  type?: "income" | "expense"
): Transaction[] {
  return transactions.filter((tx) => {
    const txDate = dayjs(tx.date);
    const matchesDate =
      txDate.isSameOrAfter(startDate) && txDate.isSameOrBefore(endDate);
    const matchesType = type ? tx.type === type : true;
    return matchesDate && matchesType;
  });
}

/**
 * Category statistics interface
 */
export interface CategoryStat {
  categoryId: string;
  categoryName: string;
  amount: number;
  count: number;
  amountPercentage: number;
  countPercentage: number;
}

/**
 * Filter and aggregate transactions by category
 *
 * @param transactions - Array of transactions to aggregate
 * @param categories - Array of categories
 * @param startDate - Start date (inclusive)
 * @param endDate - End date (inclusive)
 * @returns Array of category statistics with percentages
 *
 * @example
 * ```ts
 * const categoryStats = aggregateByCategory(
 *   transactions,
 *   categories,
 *   dayjs().startOf("month"),
 *   dayjs().endOf("month")
 * );
 * ```
 */
export function aggregateByCategory(
  transactions: Transaction[],
  categories: { id: string; name: string }[],
  startDate: dayjs.Dayjs,
  endDate: dayjs.Dayjs
): CategoryStat[] {
  // Filter transactions by date and type (expense only)
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
