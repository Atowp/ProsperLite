import type { LucideIcon } from "lucide-react";

export interface Transaction {
  id: string;
  amount: number;
  type: "income" | "expense";
  categoryId: string;
  ledgerId: string;
  date: string;
  remark?: string;
  createdAt: number;
}

export interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
  createdAt: number;
  isSystem?: boolean;
}

export interface Ledger {
  id: string;
  name: string;
  balance: number;
  createdAt: number;
}

export interface ActionResponse<T = undefined> {
  success: boolean;
  message?: string;
  data?: T;
}
