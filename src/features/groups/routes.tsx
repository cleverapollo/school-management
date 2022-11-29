import { RouteObject } from "react-router";
import CustomGroups from "./pages/custom";
import ViewCustomGroupPage from "./pages/custom/view";
import EnrolmentGroups from "./pages/enrolment";
import ViewEnrolmentGroupPage from "./pages/enrolment/view";
import SubjectGroups from "./pages/subject";
import ViewSubjectGroupPage from "./pages/subject/view";

const routes: RouteObject = {
  path: 'groups',
  children: [
    {
      path: 'enrolment',
      element: <EnrolmentGroups />,
      children: [{
        path: ':groupId/view',
        element: <ViewEnrolmentGroupPage />,
      }]
    },
    {
      path: 'subject',
      element: <SubjectGroups />,
      children: [{
        path: ':groupId/view',
        element: <ViewSubjectGroupPage />
      }]
    },
    {
      path: 'custom',
      element: <CustomGroups />,
      children: [{
        path: ':groupId/view',
        element: <ViewCustomGroupPage />
      }]
    },
  ]
};

export default routes;