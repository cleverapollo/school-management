import {RouteObject} from "react-router";
import Subjects from "./rooms/pages/index";
import AcademicNamespaceList from "./academicNamespaces/pages/academicNamespaceList";

const routes: RouteObject[] = [
    {
        path: 'general-settings/rooms',
        element: <Subjects/>
    },{
        path: 'general-settings/academic-namespaces',
        element: <AcademicNamespaceList/>
    }
];

export default routes;
