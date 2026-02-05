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
import { useIsMobile } from "@/hooks/use-mobile";

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

  const isMobile = useIsMobile();

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
        // const remark = (tx.remark || "").toLowerCase();
        return categoryName.includes(query);
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
    <div className="space-y-4">
      {/* Header with filters */}
      {/* Desktop layout - single row */}
      {!isMobile && (
        <div className="space-y-4">
          {/* Transactions section header with filters */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center">
              <h3 className="text-lg font-semibold mr-2">Transactions</h3>
              <span className="text-xs text-muted-foreground">
                ({filteredAndSortedTransactions.length})
              </span>
            </div>

            <div className="flex items-center gap-3">
              <DateRangePicker
                startDate={dateRangeStart}
                endDate={dateRangeEnd}
                onDateRangeChange={handleDateRangeChange}
              />
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 w-48 md:w-64 pl-9"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile layout - stacked */}
      {isMobile && (
        <div className="space-y-4">
          {/* Title row with count */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Transactions</h3>
            <span className="text-sm text-muted-foreground">
              ({filteredAndSortedTransactions.length})
            </span>
          </div>

          {/* Date range picker - full width */}
          <DateRangePicker
            startDate={dateRangeStart}
            endDate={dateRangeEnd}
            onDateRangeChange={handleDateRangeChange}
            className="w-full"
          />

          {/* Search bar - full width */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-full pl-9"
            />
          </div>
        </div>
      )}

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
