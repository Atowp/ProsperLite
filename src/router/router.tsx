import Layout from "@/layouts/Layout";
import { createBrowserRouter } from "react-router-dom";
import { Transactions } from "@/pages/Transaction/Transaction";
import { Statistic } from "@/pages/Statistic/Statistic";
import { Settings } from "@/pages/Settings/Settings";
import { Dashboard } from "@/pages/Dashboard/Dashboard";

export const router = createBrowserRouter([
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
]);
