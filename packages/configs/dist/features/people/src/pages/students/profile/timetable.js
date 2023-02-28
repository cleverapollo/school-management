import { jsxs as _jsxs } from "react/jsx-runtime";
import { useParams } from 'react-router-dom';
export default function StudentProfileTimetablePage() {
    var id = useParams().id;
    return _jsxs("div", { children: ["Student Profile Timetable Page ", id] });
}
