import { lazy } from "react";
import { Navigate } from "react-router-dom";
import Clients from "../pages/Clients/Clients";
import DashboardLayout from "../pages/Dashborad/DashboardLayout";
import Home from "../pages/Home/Home";
import Invoices from "../pages/Invoices/Invoices";
import Items from "../pages/Items/Items";
import InvoiceDetail from "../pages/Invoices/InvoiceDetail";
import { ROUTES } from "../constants/routes.constants";

const Login = lazy(() => import("../pages/Login/Login"));

export const routes = [
  {
    path: ROUTES.LOGIN,
    element: <Login disableCustomTheme={false} />,
  },
  {
    path: ROUTES.WILDCARD,
    element: <Navigate to={ROUTES.LOGIN} replace />,
  },
  {
    path: ROUTES.DASHBOARD.ROOT,
    element: <DashboardLayout />,
    children: [
      {
        path: ROUTES.DASHBOARD.HOME,
        element: <Home />,
      },
      {
        path: ROUTES.DASHBOARD.CLIENTS,
        element: <Clients />,
      },
      {
        path: ROUTES.DASHBOARD.ITEMS,
        element: <Items />,
      },
      {
        path: ROUTES.DASHBOARD.INVOICES.ROOT,
        element: <Invoices />,
      },
      {
        path: ROUTES.DASHBOARD.INVOICES.CREATE,
        element: <Invoices />,
      },
      {
        path: ROUTES.DASHBOARD.INVOICES.DETAIL_PATH,
        element: <InvoiceDetail />,
      },
    ],
  },
];
