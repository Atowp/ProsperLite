import type { Category } from "./types";
import {
  BusFront,
  Smile,
  Hamburger,
  Hospital,
  MicVocal,
  ShoppingBag,
  Wifi,
} from "lucide-react";

export const ALL_CATEGORY_ICONS_MAP = {
  meals: Hamburger,
  shopping: ShoppingBag,
  transport: BusFront,
  entertainment: MicVocal,
  medical: Hospital,
  other: Smile,
  wifi: Wifi,
};

export const ALL_CATEGORY_ICON_KEYS = Object.keys(
  ALL_CATEGORY_ICONS_MAP
) as (keyof typeof ALL_CATEGORY_ICONS_MAP)[];

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "1", name: "Meals", iconKey: "meals", createdAt: Date.now() },
  { id: "2", name: "Shopping", iconKey: "shopping", createdAt: Date.now() },
  { id: "3", name: "Transport", iconKey: "transport", createdAt: Date.now() },
  {
    id: "4",
    name: "Entertainment",
    iconKey: "entertainment",
    createdAt: Date.now(),
  },
  { id: "5", name: "Medical", iconKey: "medical", createdAt: Date.now() },
  {
    id: "6",
    name: "Other",
    iconKey: "other",
    createdAt: Date.now(),
    isSystem: true,
  },
];
