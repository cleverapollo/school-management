import { NavObjectFunction, NavObjectType, lazyWithRetry } from '@tyro/core';
import { DocSearchIcon } from '@tyro/icons';
import dayjs from 'dayjs';
import { getReportsList } from './api/list';
import { getAwolReportsQuery } from './api/awol-report';

const ReportsListPage = lazyWithRetry(() => import('./pages'));
const ReportContainer = lazyWithRetry(() => import('./components/container'));
const ReportPage = lazyWithRetry(() => import('./pages/view'));
const AwolStudentReportPage = lazyWithRetry(
  () => import('./pages/awol-students')
);

export const getRoutes: NavObjectFunction = (t) => [
  {
    type: NavObjectType.Category,
    title: t('navigation:management.title'),
    children: [
      {
        type: NavObjectType.RootLink,
        path: 'reports',
        hasAccess: ({ isStaffUserWithPermission }) =>
          isStaffUserWithPermission('ps:1:general_admin:read_reports'),
        title: t('navigation:management.reports'),
        icon: <DocSearchIcon />,
        children: [
          {
            type: NavObjectType.NonMenuLink,
            index: true,
            loader: getReportsList,
            element: <ReportsListPage />,
          },
          {
            type: NavObjectType.NonMenuLink,
            path: ':id',
            element: <ReportContainer />,
            children: [
              {
                type: NavObjectType.NonMenuLink,
                path: ':reportId',
                element: <ReportPage />,
              },
            ],
          },
          {
            type: NavObjectType.NonMenuLink,
            path: 'awol-students',
            element: <AwolStudentReportPage />,
            loader: async () =>
              getAwolReportsQuery({
                from: dayjs().format('YYYY-MM-DD'),
                to: dayjs().format('YYYY-MM-DD'),
              }),
          },
        ],
      },
    ],
  },
];
