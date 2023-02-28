var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Dialog, DialogContent, DialogContentText, DialogTitle, } from '@mui/material';
export function PrioritySupportStudentModal(_a) {
    var id = _a.id, open = _a.open, onClose = _a.onClose, studentId = _a.studentId, studentName = _a.studentName;
    return (_jsxs(Dialog, __assign({ open: open, onClose: onClose, id: id, "aria-labelledby": "".concat(id, "-title"), "aria-describedby": "".concat(id, "-description") }, { children: [_jsxs(DialogTitle, __assign({ id: "".concat(id, "-title") }, { children: ["Prioity note and active support plan for ", studentName] })), _jsx(DialogContent, { children: _jsx(DialogContentText, __assign({ id: "".concat(id, "-description") }, { children: "Still to be designed" })) })] })));
}
