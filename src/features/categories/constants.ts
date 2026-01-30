import type { Category } from "./types";
import {
  CarFront,
  Smile,
  ChefHat,
  Hospital,
  Gamepad2,
  ShoppingBag,
  Wifi,
} from "lucide-react";

export const ALL_CATEGORY_ICONS_MAP = {
  meals: ChefHat,
  shopping: ShoppingBag,
  transport: CarFront,
  entertainment: Gamepad2,
  medical: Hospital,
  default: Smile,
  wifi: Wifi,
};

export const ALL_CATEGORY_ICON_KEYS = Object.keys(
  ALL_CATEGORY_ICONS_MAP
) as (keyof typeof ALL_CATEGORY_ICONS_MAP)[];

export const DEFAULT_CATEGORY_ID = "0";

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: DEFAULT_CATEGORY_ID,
    name: "Default",
    iconKey: "default",
    createdAt: Date.now(),
    isSystem: true,
  },
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
];
