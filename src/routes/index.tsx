import { lazy } from "react";
import DashboardLayout from "../pages/Dashborad/DashboardLayout";

const Login = lazy(() => import("../pages/Login/Login"));

export const routes = [
  {
    path: "/login",
    element: <Login disableCustomTheme={false} />,
  },
{
    path: "/dashboard",
    element: <DashboardLayout />,
    // children: [
    //   {
    //     path: "home",
    //     element: <Home />,
    //   },
    //   {
    //     path: "billing",
    //     element: <Billing />,
    //   },
    // ],
  },
];
