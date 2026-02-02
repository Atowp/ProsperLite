import { useStore } from "@/store/useStore";
import { LedgerItem } from "./LedgerItem";
import { ScrollArea } from "@ui/scroll-area";
import type { Ledger } from "../types";
import { Button } from "@/components/ui/button";
import { LedgerActionDialog } from "./LedgerActionDialog";
import { useState } from "react";

export function LedgerList() {
  const { ledgers, addLedger, updateLedger, deleteLedger } = useStore();

  const [isOpen, setIsOpen] = useState(false);
  const [editLedger, setEditLedger] = useState<Ledger | null>(null);

  const handleOpenDialog = (ledger?: Ledger) => {
    setEditLedger(ledger || null);
    setIsOpen(true);
    return {
      success: true,
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold mr-2">Ledgers</h3>
          <span className="text-xs text-muted-foreground">
            ({ledgers.length})
          </span>
        </div>
        <div className="mr-3">
          <Button
            variant="default"
            className="px-4"
            onClick={() => handleOpenDialog()}
          >
            Add
          </Button>
        </div>
      </div>

      <ScrollArea className="h-100 pr-4">
        <div className="grid gap-2">
          {ledgers.map((ledger: Ledger) => (
            <LedgerItem
              key={ledger.id}
              ledger={ledger}
              onEdit={(l: Ledger) => handleOpenDialog(l)}
              onDelete={(id: string) => deleteLedger(id)}
            />
          ))}
        </div>
      </ScrollArea>

      <LedgerActionDialog
        key={editLedger?.id || "new"}
        initialData={editLedger}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onSubmit={(data) => {
          if (editLedger) {
            return updateLedger(editLedger.id, data);
          } else {
            return addLedger(data);
          }
        }}
      />
    </div>
  );
}
