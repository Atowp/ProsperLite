import { Button } from "@/components/ui/button";
import Edit2Icon from "~icons/lucide/edit-2";
import Trash2Icon from "~icons/lucide/trash-2";
import type { ActionResponse } from "@/types";
import { useConfirmStore } from "@/hooks/use-confirm-store";
import { toast } from "sonner";
import { useStore } from "@/store/useStore";
import type { Transaction } from "@/schemas/transaction";
import dayjs from "dayjs";
import { cn } from "@/lib/ui";
import { useIsMobile } from "@/hooks/use-mobile";

interface TransactionItemProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => ActionResponse;
}

export function TransactionItem({
  transaction,
  onEdit,
  onDelete,
}: TransactionItemProps) {
  const isMobile = useIsMobile();
  const confirmStore = useConfirmStore();
  const { ledgers } = useStore();

  const ledger = ledgers.find((l) => l.id === transaction.ledgerId);

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
    // On mobile, tapping the item opens edit drawer
    if (isMobile) {
      onEdit(transaction);
    }
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors group",
        isMobile && "cursor-pointer active:bg-accent"
      )}
      onClick={handleItemClick}
    >
      <div className="flex items-center gap-4 flex-1">
        {/* Date */}
        <div className="text-sm text-muted-foreground w-24">
          {dayjs(transaction.date).format("YYYY-MM-DD")}
        </div>

        {/* Category & Remark */}
        <div className="flex-1">
          <div className="text-xs text-muted-foreground">
            {ledger?.name || "Unknown"}
          </div>
        </div>

        {/* Amount */}
        <div className={cn("text-lg font-semibold", amountColor)}>
          {amountPrefix}¥{transaction.amount.toFixed(2)}
        </div>
      </div>

      {/* Actions - hidden on mobile, visible on desktop */}
      <div
        className={cn(
          "flex items-center gap-1 transition-opacity ml-4",
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
    </div>
  );
}
