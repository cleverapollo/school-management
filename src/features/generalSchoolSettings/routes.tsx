import {RouteObject} from "react-router";
import {Rooms} from "./rooms/pages/index";
import AcademicNamespaceList from "./academicNamespaces/pages/academicNamespaceList";
import Subjects from "./subjects/pages";

const routes: RouteObject[] = [
    {
        path: 'general-settings/rooms',
        element: <Rooms/>
    },{
        path: 'general-settings/academic-namespaces',
        element: <AcademicNamespaceList/>
    }, {
        path: 'general-settings/subjects',
        element: <Subjects/>
    }
];

export default routes;
