import {
  NavObjectFunction,
  NavObjectType,
  lazyWithRetry,
  throw404Error,
} from '@tyro/core';
import { DocSearchIcon } from '@tyro/icons';
import dayjs from 'dayjs';
import { getReportsList } from './api/list';
import { getRunReports } from './api/run-report';
import { getAwolReportsQuery } from './api/awol-report';
import { getAwolReportsInfo } from './utils/get-awol-report-data';

const ReportsListPage = lazyWithRetry(() => import('./pages'));
const ReportContainer = lazyWithRetry(() => import('./components/container'));
const ReportPage = lazyWithRetry(() => import('./pages/view'));
const AwolStudentReportPage = lazyWithRetry(
  () => import('./pages/awol-students')
);

export const awolReportsData = {
  info: { id: 'awol-students', name: 'AWOL Students' },
  reports: [{ id: 'awol-students', name: 'AWOL Students' }],
};

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
            loader: async ({ params }) => {
              const { id = '' } = params;

              if (!id) {
                throw404Error();
              }
              const awolReports = getAwolReportsInfo(t);
              const awolReportId = awolReports?.info?.id;
              const formattedDate = dayjs().format('YYYY-MM-DD');

              return id === awolReportId
                ? getAwolReportsQuery({ date: formattedDate })
                : getRunReports({
                    topReportId: id,
                    filter: { reportId: id },
                  });
            },
            children: [
              {
                type: NavObjectType.NonMenuLink,
                path: ':reportId',
                element: <ReportPage />,
                loader: async ({ params }) => {
                  const { id = '', reportId = '' } = params;

                  if (!id || !reportId) {
                    throw404Error();
                  }

                  return getRunReports({
                    topReportId: id,
                    filter: { reportId: id },
                  });
                },
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'awol-students',
                element: <AwolStudentReportPage />,
                loader: async ({ params }) => {
                  const { id = '' } = params;
                  const formattedDate = dayjs().format('YYYY-MM-DD');

                  if (!id) {
                    throw404Error();
                  }
                  return getAwolReportsQuery({ date: formattedDate });
                },
              },
            ],
          },
        ],
      },
    ],
  },
];
