import { jsx as _jsx } from "react/jsx-runtime";
import { lazy } from 'react';
import { NavObjectType, getNumber } from '@tyro/core';
import { UserGroupIcon } from '@tyro/icons';
import { UserType } from '@tyro/api';
import { redirect } from 'react-router-dom';
import { getStudentDashboardAssessments } from '@tyro/assessment';
import { getStudent, getStudents } from './api/students';
import { getStudentPersonal } from './api/student/personal';
import { getStudentsContacts } from './api/student/overview';
import { getContacts } from './api/contacts';
var StudentsListPage = lazy(function () { return import('./pages/students'); });
// Student profile pages
var StudentProfileContainer = lazy(function () { return import('./components/students/student-profile-container'); });
var StudentProfileOverviewPage = lazy(function () { return import('./pages/students/profile/overview'); });
var StudentProfilePersonalPage = lazy(function () { return import('./pages/students/profile/personal'); });
var StudentProfileAttendancePage = lazy(function () { return import('./pages/students/profile/attendance'); });
var StudentProfileFeesPage = lazy(function () { return import('./pages/students/profile/fees'); });
var StudentProfileAssessmentPage = lazy(function () { return import('./pages/students/profile/assessment'); });
var StudentProfileTimetablePage = lazy(function () { return import('./pages/students/profile/timetable'); });
var StudentProfileWellBeingPage = lazy(function () { return import('./pages/students/profile/well-being'); });
var StudentProfileSenPage = lazy(function () { return import('./pages/students/profile/sen'); });
var StudentProfileClassesPage = lazy(function () { return import('./pages/students/profile/classes'); });
var StudentProfileSettingsPage = lazy(function () { return import('./pages/students/profile/settings'); });
var ContactsListPage = lazy(function () { return import('./pages/contacts'); });
export var getRoutes = function (t) { return [
    {
        type: NavObjectType.Category,
        title: t('navigation:management.title'),
        children: [
            {
                type: NavObjectType.RootGroup,
                path: 'people',
                title: t('navigation:management.people.title'),
                icon: _jsx(UserGroupIcon, {}),
                hasAccess: function (_a) {
                    var userType = _a.userType;
                    return !!userType && [UserType.Admin, UserType.Teacher].includes(userType);
                },
                children: [
                    {
                        type: NavObjectType.MenuLink,
                        path: 'students',
                        title: t('navigation:management.people.students'),
                        loader: function () { return getStudents(); },
                        element: _jsx(StudentsListPage, {}),
                    },
                    {
                        type: NavObjectType.NonMenuLink,
                        path: 'students/:id',
                        element: _jsx(StudentProfileContainer, {}),
                        loader: function (_a) {
                            var params = _a.params;
                            var studentId = getNumber(params.id);
                            return getStudent(studentId);
                        },
                        children: [
                            {
                                type: NavObjectType.NonMenuLink,
                                index: true,
                                loader: function () { return redirect('./overview'); },
                            },
                            {
                                type: NavObjectType.NonMenuLink,
                                path: 'overview',
                                loader: function (_a) {
                                    var params = _a.params;
                                    var studentId = getNumber(params.id);
                                    return Promise.all([
                                        getStudentsContacts(studentId),
                                        getStudentDashboardAssessments(studentId),
                                    ]);
                                },
                                element: _jsx(StudentProfileOverviewPage, {}),
                            },
                            {
                                type: NavObjectType.NonMenuLink,
                                path: 'personal',
                                loader: function (_a) {
                                    var params = _a.params;
                                    var studentId = getNumber(params.id);
                                    return getStudentPersonal(studentId);
                                },
                                element: _jsx(StudentProfilePersonalPage, {}),
                            },
                            {
                                type: NavObjectType.NonMenuLink,
                                path: 'attendance',
                                element: _jsx(StudentProfileAttendancePage, {}),
                            },
                            {
                                type: NavObjectType.NonMenuLink,
                                path: 'fees',
                                element: _jsx(StudentProfileFeesPage, {}),
                            },
                            {
                                type: NavObjectType.NonMenuLink,
                                path: 'assessment',
                                element: _jsx(StudentProfileAssessmentPage, {}),
                            },
                            {
                                type: NavObjectType.NonMenuLink,
                                path: 'timetable',
                                element: _jsx(StudentProfileTimetablePage, {}),
                            },
                            {
                                type: NavObjectType.NonMenuLink,
                                path: 'well-being',
                                element: _jsx(StudentProfileWellBeingPage, {}),
                            },
                            {
                                type: NavObjectType.NonMenuLink,
                                path: 'sen',
                                element: _jsx(StudentProfileSenPage, {}),
                            },
                            {
                                type: NavObjectType.NonMenuLink,
                                path: 'classes',
                                element: _jsx(StudentProfileClassesPage, {}),
                            },
                            {
                                type: NavObjectType.NonMenuLink,
                                path: 'settings',
                                element: _jsx(StudentProfileSettingsPage, {}),
                            },
                        ],
                    },
                    {
                        type: NavObjectType.MenuLink,
                        path: 'contacts',
                        title: t('navigation:management.people.contacts'),
                        loader: function () { return getContacts(); },
                        element: _jsx(ContactsListPage, {}),
                    },
                ],
            },
        ],
    },
]; };
