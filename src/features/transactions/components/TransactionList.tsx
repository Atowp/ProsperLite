import { useStore } from "@/store/useStore";
import { TransactionItem } from "./TransactionItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { TransactionActionDialog } from "./TransactionActionDialog";
import { useState, useMemo } from "react";
import type { Transaction, TransactionInput } from "@/schemas/transaction";
import { Input } from "@/components/ui/input";
import dayjs from "dayjs";

interface TransactionListProps {
  /** Optional date filter for transactions */
  startDate?: string;
  endDate?: string;
  /** Optional category filter */
  categoryId?: string;
}

export function TransactionList({
  startDate,
  endDate,
  categoryId,
}: TransactionListProps = {}) {
  const {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    categories,
  } = useStore();

  const [isOpen, setIsOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Filter transactions based on props
  const filteredTransactions = useMemo(() => {
    let result = transactions;

    // Filter by date range
    if (startDate && endDate) {
      const start = dayjs(startDate).startOf("day");
      const end = dayjs(endDate).endOf("day");
      result = result.filter((tx) => {
        const txDate = dayjs(tx.date);
        return txDate.isAfter(start) && txDate.isBefore(end);
      });
    }

    // Filter by category
    if (categoryId) {
      result = result.filter((tx) => tx.categoryId === categoryId);
    }

    // Filter by search query (remark or category name)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((tx) => {
        const category = categories.find((c) => c.id === tx.categoryId);
        const categoryName = category?.name.toLowerCase() || "";
        const remark = (tx.remark || "").toLowerCase();
        return categoryName.includes(query) || remark.includes(query);
      });
    }

    // Sort by date descending
    return result.sort((a, b) => dayjs(b.date).unix() - dayjs(a.date).unix());
  }, [transactions, startDate, endDate, categoryId, searchQuery, categories]);

  const handleOpenDialog = (transaction?: Transaction) => {
    setEditTransaction(transaction || null);
    setIsOpen(true);
  };

  const handleSubmit = (data: TransactionInput) => {
    if (editTransaction) {
      return updateTransaction(editTransaction.id, data);
    } else {
      return addTransaction(data);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <h3 className="text-lg font-semibold mr-2">Transactions</h3>
            <span className="text-xs text-muted-foreground">
              ({filteredTransactions.length})
            </span>
          </div>

          {/* Search Input */}
          <Input
            placeholder="Search by category or remark..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 h-8"
          />
        </div>

        <Button
          variant="default"
          className="px-4"
          onClick={() => handleOpenDialog()}
        >
          Add
        </Button>
      </div>

      {/* Transaction List */}
      <ScrollArea className="h-125 pr-4">
        <div className="grid gap-2">
          {filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <p className="text-sm">No transactions found</p>
              {searchQuery && (
                <p className="text-xs mt-1">Try adjusting your search</p>
              )}
            </div>
          ) : (
            filteredTransactions.map((transaction: Transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onEdit={(t: Transaction) => handleOpenDialog(t)}
                onDelete={(id: string) => deleteTransaction(id)}
              />
            ))
          )}
        </div>
      </ScrollArea>

      {/* Transaction Action Dialog (supports both add and edit) */}
      <TransactionActionDialog
        key={editTransaction?.id || "new"}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        initialData={editTransaction}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
