import { Button } from "@ui/button";
import { Edit2, Trash2, Wallet } from "lucide-react";
import type { Ledger } from "../types";
import type { ActionResponse } from "@/types";
import { Badge } from "@ui/badge";
import { useConfirmStore } from "@/hooks/use-confirm-store";
import { toast } from "sonner";

interface LedgerItemProps {
  ledger: Ledger;
  onEdit: (ledger: Ledger) => ActionResponse;
  onDelete: (id: string) => ActionResponse;
}

export function LedgerItem({
  ledger,
  onEdit,
  onDelete,
}: LedgerItemProps) {
  const confirmStore = useConfirmStore();

  const handleDeleteClick = () => {
    confirmStore.confirm({
      description: `This action cannot be undone. This will permanently delete "${ledger.name}" from our servers.`,
      onConfirm: () => {
        const result: ActionResponse = onDelete(ledger.id);
        toast[result.success ? "success" : "error"](result.message);
      },
    });
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors group">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-md">
          <Wallet className="h-5 w-5 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-sm">{ledger.name}</span>
          <span className="text-xs text-muted-foreground">
            Balance: {ledger.balance.toFixed(2)}
          </span>
        </div>
        {ledger.isSystem && <Badge>Default</Badge>}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onEdit(ledger)}
        >
          <Edit2 className="h-4 w-4" />
        </Button>

        {/* only show delete button for non-system ledgers */}
        {!ledger.isSystem && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:text-destructive"
            onClick={() => handleDeleteClick()}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
