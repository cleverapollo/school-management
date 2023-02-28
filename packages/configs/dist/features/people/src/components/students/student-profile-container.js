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
import { alpha, Box, CircularProgress, Container, Typography, } from '@mui/material';
import { Outlet, useParams, useMatches } from 'react-router-dom';
import { Page, useNumber, Tabs, LinkTab, Breadcrumbs, LazyLoader, } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useEffect, useState } from 'react';
import { useStudent } from '../../api/students';
import { StudentOverviewBar } from './student-overview-bar';
var getStudentTabs = function (t) { return [
    {
        label: 'Overview',
        value: 'overview',
    },
    {
        label: t('people:personal.title'),
        value: 'personal',
    },
    {
        label: 'Attendance',
        value: 'attendance',
    },
    {
        label: 'Fees',
        value: 'fees',
    },
    {
        label: 'Assessment',
        value: 'assessment',
    },
    {
        label: 'Timetable',
        value: 'timetable',
    },
    {
        label: 'Well-being',
        value: 'well-being',
    },
    {
        label: 'SEN',
        value: 'sen',
    },
    {
        label: 'Classes',
        value: 'classes',
    },
    {
        label: 'Settings',
        value: 'settings',
    },
]; };
function getInitialTabValue(matches, studentTabs) {
    var _a;
    var lastUrl = matches[matches.length - 1].pathname;
    var matchedPathname = studentTabs.find(function (_a) {
        var value = _a.value;
        return lastUrl.endsWith(value);
    });
    return (_a = matchedPathname === null || matchedPathname === void 0 ? void 0 : matchedPathname.value) !== null && _a !== void 0 ? _a : 'overview';
}
export default function StudentProfileContainer() {
    var _a, _b, _c, _d;
    var matches = useMatches();
    var t = useTranslation(['navigation', 'people']).t;
    var studentTabs = getStudentTabs(t);
    var _e = useState(getInitialTabValue(matches, studentTabs)), value = _e[0], setValue = _e[1];
    var id = useParams().id;
    var idNumber = useNumber(id);
    var data = useStudent(idNumber).data;
    var name = "".concat((_b = (_a = data === null || data === void 0 ? void 0 : data.person) === null || _a === void 0 ? void 0 : _a.firstName) !== null && _b !== void 0 ? _b : '', " ").concat((_d = (_c = data === null || data === void 0 ? void 0 : data.person) === null || _c === void 0 ? void 0 : _c.lastName) !== null && _d !== void 0 ? _d : '');
    useEffect(function () {
        setValue(getInitialTabValue(matches, studentTabs));
    }, [matches, studentTabs]);
    return (_jsxs(Page, __assign({ title: t('people:usersProfile', { name: name }), sx: {
            display: 'flex',
            flexDirection: 'column',
            px: 0,
            minHeight: '100%',
        } }, { children: [_jsx(Box, __assign({ sx: { px: 2 } }, { children: _jsxs(Container, __assign({ maxWidth: "xl", sx: {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                    } }, { children: [_jsx(Typography, __assign({ variant: "h4", component: "h1" }, { children: t('people:usersProfile', { name: name }) })), _jsx(Breadcrumbs, { links: [
                                {
                                    name: t('people:students'),
                                    href: './..',
                                },
                                {
                                    name: t('people:usersProfile', { name: name }),
                                },
                            ] }), _jsx(StudentOverviewBar, { studentId: idNumber }), _jsx(Box, __assign({ sx: { maxWidth: '100%' } }, { children: _jsx(Tabs, __assign({ value: value, onChange: function (event, newValue) {
                                    setValue(newValue);
                                } }, { children: studentTabs.map(function (tab) { return (_jsx(LinkTab, __assign({}, tab, { to: "./".concat(tab.value) }), tab.value)); }) })) }))] })) })), _jsx(Box, __assign({ sx: function (_a) {
                    var isLight = _a.isLight, palette = _a.palette;
                    return ({
                        backgroundColor: alpha(isLight ? palette.slate[100] : palette.slate[800], 0.6),
                        borderTopLeftRadius: '20px',
                        borderTopRightRadius: '20px',
                        flex: 1,
                        px: 2,
                        position: 'relative',
                    });
                } }, { children: _jsx(Container, __assign({ maxWidth: "xl" }, { children: _jsx(LazyLoader, __assign({ fallback: _jsx(Box, __assign({ sx: {
                                display: 'flex',
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                bottom: 0,
                                left: 0,
                                justifyContent: 'center',
                                alignItems: 'center',
                            } }, { children: _jsx(CircularProgress, {}) })) }, { children: _jsx(Outlet, {}) })) })) }))] })));
}
