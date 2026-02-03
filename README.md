# ProsperLite

A high-performance, lightweight wealth management dashboard architected with React 18, TypeScript, and TanStack Query.

## Key Features

## Tech Stack

| Layer                | Technology                     |
| :------------------- | :----------------------------- |
| **Framework**        | React 18 (Concurrent Mode)     |
| **Language**         | TypeScript (Strict Mode)       |
| **Styling**          | Tailwind CSS + Shadcn/UI       |
| **State Management** | Zustand                        |
| **Data Validation**  | Zod                            |
| **Visualizations**   | ECharts / Recharts             |
| **Build Tool**       | Vite + Pnpm                    |
| **Testing**          | Vitest + React Testing Library |

## Why This Project?

This project serves as a showcase of my ability to handle **complex state management** and **performance optimization** in a FinTech context.

## Project Structure

```text
src/
├── api/             # Axios instance & service definitions
├── hooks/           # Custom TanStack Query hooks (The "Brain")
├── store/           # Zustand stores for UI/Global state
├── components/      # Atomic UI components & Composite cards
├── lib/             # Shared utils & Zod schemas
└── pages/           # High-level route views
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
