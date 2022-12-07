import { Outlet, RouteObject } from "react-router";
import PermissionBasedGuard from "../../guards/PermissionBasedGuard";
import AdminSchoolsPage from "./pages/school";
import AdminPeoplesPage from "./pages/school/people";

const routes: RouteObject = {
  path: 'admin',
  element: (
    <PermissionBasedGuard permissions={['tyro_admin:access']} hasContent>
      <Outlet />
    </PermissionBasedGuard>
  ),
  children: [
    { path: 'schools', element: <AdminSchoolsPage /> },
    { path: 'schools/:schoolId/people', element: <AdminPeoplesPage /> },
  ]
};

export default routes;
