import { Outlet, RouteObject } from "react-router";
import AuthGuard from "../../guards/AuthGuard";
import PermissionBasedGuard from "../../guards/PermissionBasedGuard";
import DashboardLayout from "../../layouts/dashboard";
import CalendarPage from "./pages/calendar";

const routes: RouteObject = {
  path: '/',
  element: (
    <AuthGuard>
      <DashboardLayout />
    </AuthGuard>
  ),
  children: [
    { path: 'calendar', element: <CalendarPage /> },
  ]
};

export default routes;
