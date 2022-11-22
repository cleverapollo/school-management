import { RouteObject } from "react-router";
import AdminSchoolsPage from "./pages/school";
import AdminPeoplesPage from "./pages/school/people";

const routes: RouteObject = {
  path: 'groups',
  children: [
    { path: 'enrolment', element: <AdminSchoolsPage /> },
    { path: 'subject', element: <AdminSchoolsPage /> },
    { path: 'custom', element: <AdminSchoolsPage /> },
    { path: 'enrolment/:groupId', element: <AdminSchoolsPage /> },
    { path: 'subject/:groupId', element: <AdminSchoolsPage /> },
    { path: 'custom/:groupId', element: <AdminSchoolsPage /> },
  ]
};

export default routes;