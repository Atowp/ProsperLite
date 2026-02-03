import type { Ledger } from "@/schemas";

export const DEFAULT_LEDGER_ID = "1";

export const DEFAULT_LEDGER: Ledger[] = [
  { id: DEFAULT_LEDGER_ID, name: "Default", balance: 0, createdAt: Date.now() },
];
