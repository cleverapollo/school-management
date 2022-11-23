import { RouteObject } from "react-router";
import CalendarPage from "./pages/calendar";

const routes: RouteObject = {
  path: '/calendar',
  element: (<CalendarPage />),
};

export default routes;
