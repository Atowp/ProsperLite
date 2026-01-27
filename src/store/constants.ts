import type { Category, Ledger } from "@/types";
import {
  BusFront,
  Gift,
  Hamburger,
  Hospital,
  MicVocal,
  ShoppingBag,
} from "lucide-react";

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "1", name: "Meals", icon: Hamburger, createdAt: Date.now() },
  { id: "2", name: "Shopping", icon: ShoppingBag, createdAt: Date.now() },
  { id: "3", name: "Transport", icon: BusFront, createdAt: Date.now() },
  { id: "4", name: "Entertainment", icon: MicVocal, createdAt: Date.now() },
  { id: "5", name: "Medical", icon: Hospital, createdAt: Date.now() },
  { id: "6", name: "Other", icon: Gift, createdAt: Date.now(), isSystem: true },
];

export const DEFAULT_LEDGER: Ledger[] = [
  { id: "1", name: "Default", balance: 0, createdAt: Date.now() },
];
