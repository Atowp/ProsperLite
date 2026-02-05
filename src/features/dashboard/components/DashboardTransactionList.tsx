import { useStore } from "@/store/useStore";
import { TransactionItem } from "@/features/transactions/components/TransactionItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMemo } from "react";
import type { Transaction } from "@/schemas/transaction";
import { Link } from "react-router-dom";
import { cn } from "@/lib/ui";
import dayjs from "@/lib/dayjs";

interface DashboardTransactionListProps {
  /** Maximum number of transactions to display (default: 5) */
  maxItems?: number;
  /** Optional className for styling */
  className?: string;
}

export function DashboardTransactionList({
  maxItems = 5,
  className,
}: DashboardTransactionListProps = {}) {
  const { transactions } = useStore();

  // Get recent transactions (sorted by date descending, limited to maxItems)
  const recentTransactions = useMemo(() => {
    // Create a copy to avoid mutating the original array
    const result = [...transactions];
    // Sort by date descending
    return result
      .sort((a, b) => dayjs(b.date).unix() - dayjs(a.date).unix())
      .slice(0, maxItems);
  }, [transactions, maxItems]);

  // No-op handlers for read-only mode
  const handleEdit = () => {};
  const handleDelete = () => ({ success: true, message: "" });

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <span className="text-xs text-muted-foreground">
            ({recentTransactions.length})
          </span>
        </div>
        {/* View All link */}
        {transactions.length > maxItems && (
          <Link
            to="/transactions"
            className="text-xs text-primary hover:underline font-medium"
          >
            View All
          </Link>
        )}
      </div>

      {/* Transaction List */}
      <ScrollArea className="flex-1 max-h-170">
        <div className="p-2">
          {recentTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <p className="text-sm">No transactions yet</p>
              <p className="text-xs mt-1">
                <Link
                  to="/transactions"
                  className="text-primary hover:underline"
                >
                  Add your first transaction
                </Link>
              </p>
            </div>
          ) : (
            <div className="grid gap-2">
              {recentTransactions.map((transaction: Transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  readOnly
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
