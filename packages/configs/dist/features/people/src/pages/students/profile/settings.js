import { jsxs as _jsxs } from "react/jsx-runtime";
import { useParams } from 'react-router-dom';
export default function StudentProfileSettingsPage() {
    var id = useParams().id;
    return _jsxs("div", { children: ["Student Profile Settings Page ", id] });
}
