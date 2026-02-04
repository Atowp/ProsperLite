import { lazy } from "react";
import App from "@/App";
import Layout from "@/layouts/Layout";
import { createBrowserRouter } from "react-router-dom";

// Lazy load page components for code splitting
const Dashboard = lazy(() => import("@/pages/Dashboard/Dashboard"));
const Transactions = lazy(() => import("@/pages/Transaction/Transaction"));
const Statistic = lazy(() => import("@/pages/Statistic/Statistic"));
const Settings = lazy(() => import("@/pages/Settings/Settings"));

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
            element: <Dashboard />,
          },
          {
            path: "transactions",
            element: <Transactions />,
          },
          {
            path: "statistic",
            element: <Statistic />,
          },
          {
            path: "settings",
            element: <Settings />,
          },
        ],
      },
    ],
  },
]);
