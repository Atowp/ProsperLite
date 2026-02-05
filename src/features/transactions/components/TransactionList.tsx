import { useStore } from "@/store/useStore";
import { TransactionItem } from "./TransactionItem";
import { TransactionActionDialog } from "./TransactionActionDialog";
import { useState, useMemo } from "react";
import type { Transaction, TransactionInput } from "@/schemas/transaction";
import { Input } from "@/components/ui/input";
import dayjs from "@/lib/dayjs";
import { Pagination } from "@/components/ui/pagination";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import SearchIcon from "~icons/lucide/search";

interface TransactionListProps {
  /** Optional category filter */
  categoryId?: string;
}

export function TransactionList({ categoryId }: TransactionListProps = {}) {
  const {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    categories,
    currentPage,
    itemsPerPage,
    dateRangeStart,
    dateRangeEnd,
    setCurrentPage,
    setDateRange,
  } = useStore();

  const [isOpen, setIsOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Filter and sort transactions
  const filteredAndSortedTransactions = useMemo(() => {
    // Create a copy to avoid mutating the original array from Zustand store
    let result = [...transactions];

    // Filter by date range from store
    if (dateRangeStart && dateRangeEnd) {
      const start = dayjs(dateRangeStart).startOf("day");
      const end = dayjs(dateRangeEnd).endOf("day");
      result = result.filter((tx) => {
        const txDate = dayjs(tx.date);
        // Use isSameOrAfter and isSameOrBefore to include boundary times
        return txDate.isSameOrAfter(start) && txDate.isSameOrBefore(end);
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
  }, [
    transactions,
    dateRangeStart,
    dateRangeEnd,
    categoryId,
    searchQuery,
    categories,
  ]);

  // Calculate pagination
  const totalPages = Math.ceil(
    filteredAndSortedTransactions.length / itemsPerPage
  );

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedTransactions.slice(startIndex, endIndex);
  }, [filteredAndSortedTransactions, currentPage, itemsPerPage]);

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDateRangeChange = (start: string | null, end: string | null) => {
    setDateRange(start, end);
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Header with filters - Desktop: inline, Mobile: stacked */}
      <div className="space-y-3">
        {/* Title row - always on top on mobile */}
        <div className="flex items-center">
          <div className="flex items-center">
            <h3 className="text-base sm:text-lg font-semibold mr-2">
              Transactions
            </h3>
            <span className="text-xs text-muted-foreground">
              ({filteredAndSortedTransactions.length})
            </span>
          </div>

          {/* Filters row - stacked on mobile, inline on desktop */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between w-full">
            {/* Date Range Picker */}
            <DateRangePicker
              startDate={dateRangeStart}
              endDate={dateRangeEnd}
              onDateRangeChange={handleDateRangeChange}
            />
            {/* Search Input - visible on all screens with icon */}
            <div className="relative flex-1 sm:flex-none ml-2">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 sm:w-48 sm:h-8 md:w-64"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="grid gap-2">
        {paginatedTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <p className="text-sm">No transactions found</p>
            {(searchQuery || dateRangeStart || dateRangeEnd) && (
              <p className="text-xs mt-1">Try adjusting your filters</p>
            )}
          </div>
        ) : (
          paginatedTransactions.map((transaction: Transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              onEdit={(t: Transaction) => handleOpenDialog(t)}
              onDelete={(id: string) => deleteTransaction(id)}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredAndSortedTransactions.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

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
