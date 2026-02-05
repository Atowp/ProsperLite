import { Button } from "@/components/ui/button";
import Edit2Icon from "~icons/lucide/edit-2";
import Trash2Icon from "~icons/lucide/trash-2";
import type { ActionResponse } from "@/types";
import { useConfirmStore } from "@/hooks/use-confirm-store";
import { toast } from "sonner";
import { useStore } from "@/store/useStore";
import type { Transaction } from "@/schemas/transaction";
import dayjs from "@/lib/dayjs";
import { cn } from "@/lib/ui";
import { useIsMobile } from "@/hooks/use-mobile";

interface TransactionItemProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => ActionResponse;
  /** Read-only mode - hides edit/delete buttons and disables click */
  readOnly?: boolean;
}

export function TransactionItem({
  transaction,
  onEdit,
  onDelete,
  readOnly = false,
}: TransactionItemProps) {
  const isMobile = useIsMobile();
  const confirmStore = useConfirmStore();
  const { ledgers, categories } = useStore();

  const ledger = ledgers.find((l) => l.id === transaction.ledgerId);
  const category = categories.find((c) => c.id === transaction.categoryId);

  const isExpense = transaction.type === "expense";
  const amountColor = isExpense ? "text-red-500" : "text-green-500";
  const amountPrefix = isExpense ? "-" : "+";

  const handleDeleteClick = () => {
    confirmStore.confirm({
      title: "Delete Transaction",
      description: `This action cannot be undone. This will permanently delete this transaction from our servers.`,
      onConfirm: () => {
        const result: ActionResponse = onDelete(transaction.id);
        toast[result.success ? "success" : "error"](result.message);
      },
    });
  };

  const handleItemClick = () => {
    // On mobile, tapping the item opens edit drawer (only if not read-only)
    if (isMobile && !readOnly) {
      onEdit(transaction);
    }
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors group",
        !readOnly && isMobile && "cursor-pointer active:bg-accent"
      )}
      onClick={handleItemClick}
    >
      {/* Left content - always visible */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Date - smaller on mobile */}
        <div
          className={cn(
            "text-sm text-muted-foreground flex-shrink-0",
            isMobile ? "text-xs w-16" : "w-24"
          )}
        >
          {dayjs(transaction.date).format(isMobile ? "MM/DD" : "YYYY-MM-DD")}
        </div>

        {/* Category & Ledger */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Category name - primary */}
          <div
            className={cn(
              "font-medium truncate",
              isMobile ? "text-xs" : "text-sm"
            )}
            title={category?.name || "Unknown"}
          >
            {category?.name || "Unknown"}
          </div>
          {/* Ledger name - secondary, smaller */}
          <div
            className={cn(
              "text-muted-foreground truncate",
              isMobile ? "text-[10px]" : "text-xs"
            )}
            title={ledger?.name || "Unknown"}
          >
            {ledger?.name || "Unknown"}
          </div>
        </div>

        {/* Amount - always visible */}
        <div
          className={cn(
            "font-semibold flex-shrink-0",
            isMobile ? "text-sm" : "text-lg",
            amountColor
          )}
        >
          {amountPrefix}¥{transaction.amount.toFixed(2)}
        </div>
      </div>

      {/* Actions - hidden on mobile, visible on desktop hover, not shown in read-only mode */}
      {!readOnly && (
        <div
          className={cn(
            "flex items-center gap-1 transition-opacity ml-2 flex-shrink-0",
            isMobile ? "hidden" : "opacity-0 group-hover:opacity-100"
          )}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(transaction);
            }}
          >
            <Edit2Icon className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick();
            }}
          >
            <Trash2Icon className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
