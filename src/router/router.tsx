import Layout from "@/layouts/Layout";
import { createBrowserRouter } from "react-router-dom";
import { Home } from "@/pages/Home/Home";
import { Transactions } from "@/pages/Transaction/Transaction";
import { Statistic } from "@/pages/Statistic/Statistic";
import { Settings } from "@/pages/Settings/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
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
