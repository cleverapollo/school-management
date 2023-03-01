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
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Card, Stack, Typography, Badge, IconButton, Divider, } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { useDisclosure, Avatar } from '@tyro/core';
import { useStudent } from '../../../api/students';
import { SupportPlanRing } from '../support-plan-ring';
import { AdditionalInfo } from './additional-info';
import { CurrentLocation } from './current-location';
import { PrioritySupportStudentModal } from './priority-support-student-modal';
import { TyroId } from './tyro-id';
import { useStudentStatus } from '../../../api/status';
export function StudentOverviewBar(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var studentId = _a.studentId;
    var _l = useStudent(studentId), data = _l.data, isLoading = _l.isLoading;
    var _m = useStudentStatus(studentId), statusData = _m.data, statusIsLoading = _m.isLoading;
    var _o = useDisclosure(), getButtonProps = _o.getButtonProps, getDisclosureProps = _o.getDisclosureProps;
    var t = useTranslation(['people']).t;
    var name = "".concat((_c = (_b = data === null || data === void 0 ? void 0 : data.person) === null || _b === void 0 ? void 0 : _b.firstName) !== null && _c !== void 0 ? _c : '', " ").concat((_e = (_d = data === null || data === void 0 ? void 0 : data.person) === null || _d === void 0 ? void 0 : _d.lastName) !== null && _e !== void 0 ? _e : '');
    if (data == null) {
        return null;
    }
    return (_jsxs(_Fragment, { children: [_jsx(Card, __assign({ variant: "outlined", sx: { p: 1.25, flex: 1, my: 2 } }, { children: _jsxs(Stack, __assign({ direction: "row", alignItems: "center", sx: { flexWrap: 'wrap' } }, { children: [_jsx(IconButton, __assign({ disabled: !(statusData === null || statusData === void 0 ? void 0 : statusData.priorityStudent) && !(statusData === null || statusData === void 0 ? void 0 : statusData.activeSupportPlan), "aria-label": t('people:studentClickableAvatarAria', { name: name }) }, getButtonProps(), { children: _jsx(Badge, __assign({ anchorOrigin: {
                                    vertical: 'top',
                                    horizontal: 'left',
                                }, sx: function (_a) {
                                    var palette = _a.palette;
                                    return ({
                                        '& .MuiBadge-badge': {
                                            boxShadow: "0 0 0 2px ".concat(palette.background.paper),
                                            backgroundColor: palette.blue[500],
                                        },
                                    });
                                }, overlap: "circular", variant: "dot", badgeContent: (statusData === null || statusData === void 0 ? void 0 : statusData.priorityStudent) ? 1 : 0 }, { children: _jsx(SupportPlanRing, __assign({ hasSupportPlan: true }, { children: _jsx(Avatar, { src: (_g = (_f = data === null || data === void 0 ? void 0 : data.person) === null || _f === void 0 ? void 0 : _f.avatarUrl) !== null && _g !== void 0 ? _g : undefined, name: name }) })) })) })), _jsxs(Stack, __assign({ sx: { ml: 0.5, mr: 2.5 } }, { children: [_jsx(Typography, __assign({ variant: "subtitle1", component: "h2" }, { children: name })), Array.isArray(statusData === null || statusData === void 0 ? void 0 : statusData.sessionAttendance) && (_jsx(Stack, __assign({ component: "dl", sx: { my: 0 } }, { children: (_h = statusData === null || statusData === void 0 ? void 0 : statusData.sessionAttendance) === null || _h === void 0 ? void 0 : _h.map(function (session) { return (_jsxs(Stack, __assign({ direction: "row", spacing: 1 }, { children: [_jsx(Typography, __assign({ component: "dt", sx: {
                                                    color: 'slate.600',
                                                    fontWeight: 600,
                                                    fontSize: 12,
                                                } }, { children: session === null || session === void 0 ? void 0 : session.name })), _jsx(Typography, __assign({ component: "dd", sx: { fontSize: 12 } }, { children: session === null || session === void 0 ? void 0 : session.status }))] }), session === null || session === void 0 ? void 0 : session.name)); }) })))] })), _jsx(CurrentLocation, { studentPartyId: data === null || data === void 0 ? void 0 : data.partyId }), _jsx(Divider, { orientation: "vertical", flexItem: true, sx: { ml: 2.5, mr: 1 } }), _jsx(AdditionalInfo, { year: data === null || data === void 0 ? void 0 : data.yearGroups, classGroup: data === null || data === void 0 ? void 0 : data.classGroup, tutor: data.tutors, yearGroupLead: data === null || data === void 0 ? void 0 : data.yearGroupLeads }), _jsx(Divider, { orientation: "vertical", flexItem: true, sx: { mx: 1 } }), _jsx(TyroId, { id: (_j = data === null || data === void 0 ? void 0 : data.partyId) !== null && _j !== void 0 ? _j : 0 })] })) })), _jsx(PrioritySupportStudentModal, __assign({ studentId: (_k = data === null || data === void 0 ? void 0 : data.partyId) !== null && _k !== void 0 ? _k : 0, studentName: name }, getDisclosureProps()))] }));
}
