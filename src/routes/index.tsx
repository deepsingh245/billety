import { lazy } from "react";
import { Navigate } from "react-router-dom";
import Clients from "../pages/Clients/Clients";
import DashboardLayout from "../pages/Dashborad/DashboardLayout";
import Home from "../pages/Home/Home";
import Invoices from "../pages/Invoices/Invoices";
import Items from "../pages/Items/Items";
import InvoiceDetail from "../pages/Invoices/InvoiceDetail";
import { ROUTES } from "../constants/routes.constants";
import { AuthGuard } from "../context/AuthGuard";
import { GuestGuard } from "../context/GuestGuard";


const Login = lazy(() => import("../pages/Login/Login"));
const Signup = lazy(() => import("../pages/Signup/Signup"));
const Profile = lazy(() => import("../pages/Profile/Profile"));
const Settings = lazy(() => import("../pages/Settings/Settings"));

export const routes = [
  {
    path: ROUTES.LOGIN,
    element: (
      <GuestGuard>
        <Login disableCustomTheme={false} />
      </GuestGuard>
    ),
  },
  {
    path: ROUTES.SIGNUP,
    element: (
      <GuestGuard>
        <Signup disableCustomTheme={false} />
      </GuestGuard>
    ),
  },

  {
    path: ROUTES.WILDCARD,
    element: <Navigate to={ROUTES.LOGIN} replace />,
  },
  {
    path: ROUTES.DASHBOARD.ROOT,
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
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
      {
        path: ROUTES.DASHBOARD.PROFILE,
        element: <Profile />,
      },
      {
        path: ROUTES.DASHBOARD.SETTINGS,
        element: <Settings />,
      },
    ],
  },
];
