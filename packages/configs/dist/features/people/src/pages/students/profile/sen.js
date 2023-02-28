import { jsxs as _jsxs } from "react/jsx-runtime";
import { useParams } from 'react-router-dom';
export default function StudentProfileSenPage() {
    var id = useParams().id;
    return _jsxs("div", { children: ["Student Profile SEN Page ", id] });
}
