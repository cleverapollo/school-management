import { RouteObject } from "react-router";
import Mail from "./pages/index";

const routes: RouteObject = {
  path: 'mail',
  element: <Mail />,
  children: [
    {
      path: ':mailId',
      element: <Mail />,
    },
    {
      path: 'label',
      children: [{
        path: ':labelName',
        element: <Mail />,
      }]
    },
    {
      path: 'label/custom',
      children: [{
        path: ':labelName',
        element: <Mail />,
      }]
    },
  ]
};

export default routes;
