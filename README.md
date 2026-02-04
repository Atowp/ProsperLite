# ProsperLite

A high-performance, lightweight wealth management dashboard architected with React 19, TypeScript, and Zustand.

## Key Features

## Tech Stack

| Layer                | Technology                           |
| :------------------- | :----------------------------------- |
| **Framework**        | React 19 + React Router v7           |
| **Language**         | TypeScript 5 (Strict Mode)           |
| **Styling**          | Tailwind CSS v4 + Shadcn/UI          |
| **State Management** | Zustand + Immer + Persist Middleware |
| **Form Management**  | React Hook Form + Zod                |
| **UI Components**    | Radix UI Primitives + Custom Drawer  |
| **Icons**            | unplugin-icons + Iconify (Lucide)    |
| **Date Handling**    | dayjs + react-day-picker             |
| **Notifications**    | sonner (Toast)                       |
| **Visualizations**   | Recharts                             |
| **Build Tool**       | Vite + Pnpm                          |
| **Code Quality**     | ESLint + TypeScript ESLint           |

## Why This Project?

This project serves as a showcase of my ability to handle **complex state management** and **performance optimization** in a FinTech context.

## Project Structure

```text
src/
├── components/      # Reusable UI components (Dialog, Drawer, Form, etc.)
├── config/          # Application configuration (navigation, constants)
├── features/        # Feature-based modules (transactions, categories, ledgers)
│   ├── transactions/ # Transaction management
│   ├── categories/   # Category management with icon picker
│   └── ledgers/      # Ledger (account) management
├── hooks/           # Custom React hooks (useMobile, useConfirm, etc.)
├── layouts/         # Page layouts (main app shell with sidebar)
├── lib/             # Utility functions and helpers
├── pages/           # Route pages (Dashboard, Settings, Transactions, Statistics)
├── router/          # React Router configuration
├── store/           # Zustand global state with Immer + Persist
│   ├── useStore.ts  # Main store composition
│   └── types.ts     # Store type definitions
└── types/           # Global TypeScript type definitions
```

## Architecture Decison Records

1. All state must be managed using Zustand. Defining complex state within components is prohibited.
   1. The system should automatically populate the most probable ledgerId and categoryId based on the user's historical behavior (using the recent transaction cache in Zustand).
   2. Before data enters the Zustand or is sent to the backend, amounts (yuan) must be uniformly converted to integers (fen) via the Transformer. Division operations are performed during UI layer display.
2. All UI must be atomically extended based on Shadcn/UI.
   1. All UI components must use sonner (recommended by Shadcn) to provide non-blocking operation success feedback.
3. All charts must be implemented using ECharts or Recharts.
4. Pre-flight Validation
   1. All user inputs must be validated using Zod schemas before being sent to the server.
   2. If validation fails, the UI should display clear error messages to the user.
