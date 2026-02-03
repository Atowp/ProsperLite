import { lazy } from "react";
import App from "@/App";
import Layout from "@/layouts/Layout";
import { createBrowserRouter } from "react-router-dom";
import { SuspenseWrapper } from "@/components/SuspenseWrapper";

// Lazy load page components for code splitting
const Dashboard = lazy(() =>
  import("@/pages/Dashboard/Dashboard").then((m) => ({ default: m.Dashboard }))
);
const Transactions = lazy(() =>
  import("@/pages/Transaction/Transaction").then((m) => ({
    default: m.Transactions,
  }))
);
const Statistic = lazy(() =>
  import("@/pages/Statistic/Statistic").then((m) => ({ default: m.Statistic }))
);
const Settings = lazy(() =>
  import("@/pages/Settings/Settings").then((m) => ({ default: m.Settings }))
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Layout />,
        children: [
          {
            index: true,
            element: (
              <SuspenseWrapper>
                <Dashboard />
              </SuspenseWrapper>
            ),
          },
          {
            path: "transactions",
            element: (
              <SuspenseWrapper>
                <Transactions />
              </SuspenseWrapper>
            ),
          },
          {
            path: "statistic",
            element: (
              <SuspenseWrapper>
                <Statistic />
              </SuspenseWrapper>
            ),
          },
          {
            path: "settings",
            element: (
              <SuspenseWrapper>
                <Settings />
              </SuspenseWrapper>
            ),
          },
        ],
      },
    ],
  },
]);
