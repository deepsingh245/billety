import { lazy } from "react";
import { Navigate } from "react-router-dom";
import Clients from "../pages/Clients/Clients";
import DashboardLayout from "../pages/Dashborad/DashboardLayout";
import Home from "../pages/Home/Home";
import Invoices from "../pages/Invoices/Invoices";
import Items from "../pages/Items/Items";
import InvoiceDetail from "../pages/Invoices/InvoiceDetail";

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
      {
        path: "invoices/create",
        element: <Invoices />,
      },
      {
        path: "invoices/:id",
        element: <InvoiceDetail />,
      },
    ],
  },
];
