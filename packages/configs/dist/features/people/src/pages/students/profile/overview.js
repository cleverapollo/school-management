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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Stack } from '@mui/material';
import { getNumber } from '@tyro/core';
import { StudentAssessmentWidget } from '@tyro/assessment';
import { useParams } from 'react-router-dom';
import { StudentContactsWidget } from '../../../components/students/student-contacts-widget';
export default function StudentProfileOverviewPage() {
    var id = useParams().id;
    var studentId = getNumber(id);
    return (_jsxs(Stack, __assign({ direction: "row", my: 3, spacing: 3 }, { children: [_jsx(StudentContactsWidget, { studentId: studentId }), _jsx(StudentAssessmentWidget, { studentId: studentId })] })));
}
