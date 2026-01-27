import { Home, BarChart3, Wallet, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS = [
  { path: "/", label: "Home", icon: Home },
  { path: "/transactions", label: "Transactions", icon: Wallet },
  { path: "/statistic", label: "Statistic", icon: BarChart3 },
  { path: "/settings", label: "Settings", icon: Settings },
];
