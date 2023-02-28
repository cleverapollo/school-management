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
import { Fragment, useMemo } from 'react';
import { Box, Tooltip } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { CodeType } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { CheckmarkIcon, CloseIcon, MinusIcon } from '@tyro/icons';
import { useStudentStatus } from '../../../api/status';
function CurrentAttendanceIcon(_a) {
    var name = _a.name, codeType = _a.codeType;
    var t = useTranslation(['attendance']).t;
    var _b = useMemo(function () {
        switch (codeType) {
            case CodeType.Present:
            case CodeType.Late:
                return {
                    icon: (_jsx(CheckmarkIcon, { sx: { color: 'white', width: 16, height: 16 } })),
                    color: 'green',
                    tooltip: name,
                };
            case CodeType.UnexplainedAbsence:
            case CodeType.ExplainedAbsence:
                return {
                    icon: _jsx(CloseIcon, {}),
                    color: 'rose',
                    tooltip: name,
                };
            default:
                return {
                    icon: _jsx(MinusIcon, {}),
                    color: 'sky',
                    tooltip: t('attendance:attendanceNotTaken'),
                };
        }
    }, [codeType, name, t]), icon = _b.icon, color = _b.color, tooltip = _b.tooltip;
    return (_jsx(Tooltip, __assign({ title: tooltip }, { children: _jsx(Box, __assign({ sx: function (_a) {
                var palette = _a.palette;
                return ({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: alpha(palette[color]['500'], 0.35),
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                });
            } }, { children: _jsx(Box, __assign({ sx: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: "".concat(color, ".500"),
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                } }, { children: icon })) })) })));
}
export function CurrentLocation(_a) {
    var studentPartyId = _a.studentPartyId;
    var t = useTranslation(['people']).t;
    var _b = useStudentStatus(studentPartyId), data = _b.data, isLoading = _b.isLoading;
    var currentLocationList = useMemo(function () {
        var _a;
        var _b, _c, _d, _e, _f, _g;
        var room = (_c = (_b = data === null || data === void 0 ? void 0 : data.currentLocation) === null || _b === void 0 ? void 0 : _b.room) === null || _c === void 0 ? void 0 : _c.map(function (a) { return a === null || a === void 0 ? void 0 : a.name; }).find(function (a) { return true; });
        // todo  back end is not in place for this
        // const attendanceName = data?.sessionAttendance
        //   ?.map((a) => a?.name || undefined)
        //   .find((a) => true);
        // const attendanceCode = data?.sessionAttendance
        //   ?.map((a) => a?.status || undefined)
        //   .find((a) => true);
        var currentAttendance = (_jsx(CurrentAttendanceIcon, { name: "present", codeType: CodeType.Present }));
        return _a = {},
            _a[t('people:currentLocation')] = room,
            _a[t('people:currentLesson')] = (_e = (_d = data === null || data === void 0 ? void 0 : data.currentLocation) === null || _d === void 0 ? void 0 : _d.lesson) !== null && _e !== void 0 ? _e : '-',
            _a[t('people:currentTeacher')] = (_g = (_f = data === null || data === void 0 ? void 0 : data.currentLocation) === null || _f === void 0 ? void 0 : _f.teacher) !== null && _g !== void 0 ? _g : '-',
            _a[t('people:attendance')] = currentAttendance,
            _a;
    }, [data, t]);
    return (_jsx(Box, __assign({ component: "dl", display: "grid", gridTemplateColumns: "repeat(4, auto)", gridTemplateRows: "repeat(2, 1fr)", alignItems: "strech", sx: { my: 0 } }, { children: Object.entries(currentLocationList).map(function (_a, index) {
            var key = _a[0], value = _a[1];
            return (_jsxs(Fragment, { children: [_jsx(Box, __assign({ component: "dt", gridColumn: (index % 4) + 1, gridRow: 1, sx: {
                            fontSize: '0.75rem',
                            px: 2,
                            py: 0.5,
                            color: 'slate.600',
                            display: 'flex',
                            alignItems: 'center',
                        } }, { children: key })), _jsx(Box, __assign({ component: "dd", gridColumn: (index % 4) + 1, gridRow: 2, sx: __assign(__assign({ fontSize: '0.75rem', ml: 0, backgroundColor: 'blue.50', py: 0.5, px: 2, display: 'flex', alignItems: 'center' }, (index === 0 && { borderRadius: '17px 0 0 17px' })), (index === 3 && {
                            borderRadius: '0 17px 17px 0',
                            justifyContent: 'center',
                        })) }, { children: value }))] }, key));
        }) })));
}
