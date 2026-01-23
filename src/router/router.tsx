import App from "@/App";
import { createBrowserRouter } from "react-router-dom";
import { Home } from "@/pages/Home/Home";
import { Transactions } from "@/pages/Transaction/Transaction";
import { Analysis } from "@/pages/Analysis/Analysis";
import { Settings } from "@/pages/Settings/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
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
        path: "analysis",
        element: <Analysis />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
]);
