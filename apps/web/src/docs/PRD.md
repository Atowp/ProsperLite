# Overview

**Project Name** ProsperLite

**Core Vision** Create a minimalist accouting tool that is "ready-to-use and visible at a glance" to solve the problems of bloated products and cumbersome operations in the market.

**Target User** Pursure efficiency and need immediate understanding of their financial status.

# Value Propositions

**Pain Point** Market accounting software has redundant functions, and need to click multiple times to record a transaction.

**Cool Point** Opening the home page will be an overview of consumption for this week/month, with key data in large font and charts.

**Key Scene** Before preparing for large expenditures, quickly slide open the dashboard and use the charts to visually determine if thee remaning budget for this month is sufficient.

## Must-Have Features

- Dashboard
- Category
- Ledger
- Transaction CRUD
- Statistic

## Should-Have Features

- Data Export/Import (JSON)
- Settings
  - Custom Category/Ledger

## Could-Have Features

- Mobile Responsive Design
- PWA support
- SearchBar

## Won't-Have Features

- Dark Mode
- Theme Switch (Optional)

# Functional Requirements

| Modules         | Prescription                                          | Acceptance                                                   | Level |
| :-------------- | :---------------------------------------------------- | :----------------------------------------------------------- | :---- |
| **Dashboard**   | Display weekly/monthly spending overview              | Dashboard seamless updates                                   | P0    |
| **Transaction** | Enter amount, preset 6 major categories, default date | Done a record within 3 clicks                                | P0    |
| **Statistic**   | Show expense distribution by category                 | Click on a pie chart, show expense details, Time granularity | P1    |
| **Settings**    | Export/Import, Customize categories/ledgers           | Click on a category/ledger, edit name/icon                   | P1    |
| **Status**      | Data persistence                                      | Refresh page, data still exist                               | P0    |

# Data Model

```ts
interface Transaction {
  id: string;
  amount: number;
  type: "income" | "expense";
  categoryId: string;
  ledgerId: string;
  date: string;
  remark?: string;
  createdAt: number;
}

interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
  createdAt: number;
  isSystem?: boolean;
}

interface Ledger {
  id: string;
  name: string;
  balance: number;
  createdAt: number;
}

interface ActionResponse<T = undefined> {
  success: boolean;
  message?: string;
  data?: T;
}
```

# Edge Cases

- Big Number Overflow
- Empty Data State
- Date Span Query
- Transaction/Category/Ledger Deletion
- Local Persistence Failure
- LocalStorage Sync
- Data Migration
- Future Date

# Technical Indicators

### Performance

- First Contentful Paint < 1.5s
- Dashboard Not Lag（1000 Transactions）
- Statistic Page Paint < 2s
- Support 10000 Transaction Pagination

### Robustness

- Vitest
  - calculateTotal
  - filterDataByDateRange
