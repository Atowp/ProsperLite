// Using unplugin-icons for tree-shakeable, on-demand icon loading
import HomeIcon from "~icons/lucide/home";
import WalletIcon from "~icons/lucide/wallet";
import BarChart3Icon from "~icons/lucide/bar-chart-3";
import SettingsIcon from "~icons/lucide/settings";
import type { ComponentType } from "react";

export interface NavItem {
  path: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

// Icons are loaded on-demand at compile time via unplugin-icons
export const NAV_ITEMS: NavItem[] = [
  { path: "/", label: "Home", icon: HomeIcon },
  { path: "/transactions", label: "Transactions", icon: WalletIcon },
  { path: "/statistic", label: "Statistic", icon: BarChart3Icon },
  { path: "/settings", label: "Settings", icon: SettingsIcon },
];
