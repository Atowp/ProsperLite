import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import type { ActionResponse } from "@/types";
import { useConfirmStore } from "@/hooks/use-confirm-store";
import { toast } from "sonner";
import { useStore } from "@/store/useStore";
import type { Transaction } from "@/schemas/transaction";
import dayjs from "dayjs";
import { cn } from "@/lib/ui";

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
  const confirmStore = useConfirmStore();
  const { categories, ledgers } = useStore();

  const category = categories.find((c) => c.id === transaction.categoryId);
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

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors group">
      <div className="flex items-center gap-4 flex-1">
        {/* Date */}
        <div className="text-sm text-muted-foreground w-24">
          {dayjs(transaction.date).format("YYYY-MM-DD")}
        </div>

        {/* Category & Remark */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{category?.name || "Unknown"}</span>
            {transaction.remark && (
              <span className="text-xs text-muted-foreground">
                ({transaction.remark})
              </span>
            )}
          </div>
          <div className="text-xs text-muted-foreground">{ledger?.name || "Unknown"}</div>
        </div>

        {/* Amount */}
        <div className={cn("text-lg font-semibold", amountColor)}>
          {amountPrefix}¥{transaction.amount.toFixed(2)}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onEdit(transaction)}
        >
          <Edit2 className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:text-destructive"
          onClick={() => handleDeleteClick()}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
