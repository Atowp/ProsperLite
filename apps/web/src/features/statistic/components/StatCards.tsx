import { useStore } from "@/store/useStore";
import { Card } from "@ui/card";
import { useDayjsCache } from "@/hooks/use-dayjs";
import { useQuery } from "@tanstack/react-query";
import { filterTransactionsByPeriod } from "@/lib/transaction-filters";
import TrendUpIcon from "~icons/lucide/trending-up";
import TrendDownIcon from "~icons/lucide/trending-down";
import WalletIcon from "~icons/lucide/wallet";
import ArrowUpIcon from "~icons/lucide/arrow-up";
import ArrowDownIcon from "~icons/lucide/arrow-down";
import { cn } from "@/lib/ui";

// Constants
const CURRENCY_LOCALE = "zh-Hans-CN" as const;
const CURRENCY_CODE = "CNY" as const;

// Query keys
const statCardsQueryKeys = {
  all: ["stat-cards"] as const,
  current: () => [...statCardsQueryKeys.all, "current"] as const,
};

// Helper function to format currency
function formatCurrency(amount: number): string {
  return amount.toLocaleString(CURRENCY_LOCALE, {
    style: "currency",
    currency: CURRENCY_CODE,
  });
}

// Helper function to calculate trend percentage
function calculateTrend(current: number, previous: number): number {
  return previous > 0 ? ((current - previous) / previous) * 100 : 0;
}

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  iconClassName?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconClassName,
  trend,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-bold tracking-tight mb-1">{value}</h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend.isPositive ? (
                <TrendUpIcon className="w-3 h-3 text-green-600" />
              ) : (
                <TrendDownIcon className="w-3 h-3 text-red-600" />
              )}
              <span
                className={cn(
                  "text-xs font-medium",
                  trend.isPositive ? "text-green-600" : "text-red-600"
                )}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value.toFixed(1)}%
              </span>
              <span className="text-xs text-muted-foreground ml-1">
                vs last month
              </span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "p-2 rounded-lg bg-muted/50",
            iconClassName || "text-blue-600"
          )}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}

export function StatCards() {
  const { transactions, getTotalBalance } = useStore();
  const { currentMonthStart, currentMonthEnd, lastMonthStart, lastMonthEnd } =
    useDayjsCache();

  // Use React Query to cache stat calculations
  const { data: stats } = useQuery({
    queryKey: [...statCardsQueryKeys.current(), transactions],
    queryFn: () => {
      // Current month income and expenses
      const currentMonthIncome = filterTransactionsByPeriod(
        transactions,
        "income",
        currentMonthStart,
        currentMonthEnd
      );

      const currentMonthExpense = filterTransactionsByPeriod(
        transactions,
        "expense",
        currentMonthStart,
        currentMonthEnd
      );

      // Last month income and expenses
      const lastMonthIncome = filterTransactionsByPeriod(
        transactions,
        "income",
        lastMonthStart,
        lastMonthEnd
      );

      const lastMonthExpense = filterTransactionsByPeriod(
        transactions,
        "expense",
        lastMonthStart,
        lastMonthEnd
      );

      // Current balance - use getTotalBalance which reflects all ledgers
      const currentBalance = getTotalBalance();

      // Calculate trends
      const incomeTrend = calculateTrend(currentMonthIncome, lastMonthIncome);
      const expenseTrend = calculateTrend(
        currentMonthExpense,
        lastMonthExpense
      );

      return {
        currentBalance,
        currentMonthIncome,
        currentMonthExpense,
        incomeTrend,
        expenseTrend,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  if (!stats) return null;

  // Calculate net savings for reuse
  const netSavings = stats.currentMonthIncome - stats.currentMonthExpense;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Current Balance"
        value={formatCurrency(stats.currentBalance)}
        icon={<WalletIcon className="w-5 h-5" />}
        iconClassName="text-blue-600"
      />
      <StatCard
        title="This Month Income"
        value={formatCurrency(stats.currentMonthIncome)}
        icon={<ArrowUpIcon className="w-5 h-5" />}
        iconClassName="text-green-600"
        trend={{
          value: stats.incomeTrend,
          isPositive: stats.incomeTrend >= 0,
        }}
      />
      <StatCard
        title="This Month Expense"
        value={formatCurrency(stats.currentMonthExpense)}
        icon={<ArrowDownIcon className="w-5 h-5" />}
        iconClassName="text-red-600"
        trend={{
          value: Math.abs(stats.expenseTrend),
          isPositive: stats.expenseTrend < 0,
        }}
      />
      <StatCard
        title="Net Savings"
        value={formatCurrency(netSavings)}
        subtitle="Income - Expense"
        icon={<WalletIcon className="w-5 h-5" />}
        iconClassName={netSavings >= 0 ? "text-green-600" : "text-red-600"}
      />
    </div>
  );
}
