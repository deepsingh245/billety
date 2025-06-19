import { lazy } from "react";
import DashboardLayout from "../pages/Dashborad/DashboardLayout";
import Home from "../pages/Home/Home";
import Clients from "../pages/Clients/Clients";
import Items from "../pages/Items/Items";
import { Navigate } from "react-router-dom";
import Invoices from "../pages/Invoices/Invoices";

const Login = lazy(() => import("../pages/Login/Login"));

export const routes = [
  {
    path: "/login",
    element: <Login disableCustomTheme={false} />,
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "clients",
        element: <Clients />,
      },
      {
        path: "items",
        element: <Items />,
      },
      {
        path: "invoices",
        element: <Invoices />,
      },
    ],
  },
];
