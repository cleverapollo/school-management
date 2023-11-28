import {
  getNumber,
  NavObjectFunction,
  NavObjectType,
  lazyWithRetry,
  throw404Error,
} from '@tyro/core';
import { SchoolExamACircleIcon } from '@tyro/icons';
import { getSchoolActivityById } from './api/get-school-activities';

const SchoolActivityPage = lazyWithRetry(() => import('./pages'));
const CreateSchoolActivityPage = lazyWithRetry(() => import('./pages/create'));
const EditSchoolActivityPage = lazyWithRetry(() => import('./pages/edit'));

export const getRoutes: NavObjectFunction = (t) => [
  {
    type: NavObjectType.Category,
    title: t('navigation:general.title'),
    children: [
      {
        type: NavObjectType.RootLink,
        path: 'school-activities',
        icon: <SchoolExamACircleIcon />,
        title: t('navigation:general.schoolActivities.title'),
        children: [
          {
            type: NavObjectType.NonMenuLink,
            index: true,
            element: <SchoolActivityPage />,
          },
          {
            type: NavObjectType.NonMenuLink,
            path: 'create',
            element: <CreateSchoolActivityPage />,
          },
          {
            type: NavObjectType.NonMenuLink,
            path: ':activityId',
            loader: ({ params }) => {
              const schoolActivityId = getNumber(params.activityId);

              if (!schoolActivityId) {
                throw404Error();
              }

              return getSchoolActivityById({
                schoolActivityIds: [schoolActivityId],
              });
            },
            children: [
              {
                type: NavObjectType.NonMenuLink,
                path: 'edit',
                element: <EditSchoolActivityPage />,
              },
            ],
          },
        ],
      },
    ],
  },
];
