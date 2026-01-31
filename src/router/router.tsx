import App from "@/App";
import Layout from "@/layouts/Layout";
import { createBrowserRouter } from "react-router-dom";
import { Transactions, Statistic, Settings, Dashboard } from "@/pages";

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
