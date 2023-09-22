import {
  NavObjectFunction,
  NavObjectType,
  lazyWithRetry,
  throw404Error,
} from '@tyro/core';
import { DocSearchIcon } from '@tyro/icons';
import { getReportsList } from './api/list';
import { getRunReports } from './api/run-report';

const ReportsListPage = lazyWithRetry(() => import('./pages'));
const ReportPage = lazyWithRetry(() => import('./pages/view'));

export const getRoutes: NavObjectFunction = (t) => [
  {
    type: NavObjectType.Category,
    title: t('navigation:management.title'),
    children: [
      {
        type: NavObjectType.RootLink,
        path: 'reports-list',
        hasAccess: ({ isTyroUser }) => isTyroUser,
        title: t('navigation:management.reports'),
        icon: <DocSearchIcon />,
        children: [
          {
            type: NavObjectType.NonMenuLink,
            index: true,
            hasAccess: ({ isTyroUser }) => isTyroUser,
            loader: getReportsList,
            element: <ReportsListPage />,
          },
          {
            type: NavObjectType.NonMenuLink,
            path: ':id',
            hasAccess: ({ isTyroUser }) => isTyroUser,
            loader: async ({ params }) => {
              const reportId = params.id ?? '';

              if (!reportId) {
                throw404Error();
              }

              return getRunReports({ reportId });
            },
            element: <ReportPage />,
          },
        ],
      },
    ],
  },
];
