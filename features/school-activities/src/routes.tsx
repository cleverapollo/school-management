import {
  getNumber,
  NavObjectFunction,
  NavObjectType,
  lazyWithRetry,
  throw404Error,
} from '@tyro/core';
import { redirect } from 'react-router-dom';
import { SchoolExamACircleIcon } from '@tyro/icons';
import { getSchoolActivityById } from './api/get-school-activities';

const SchoolActivityPage = lazyWithRetry(() => import('./pages'));
const CreateSchoolActivityPage = lazyWithRetry(() => import('./pages/create'));
const EditSchoolActivityPage = lazyWithRetry(() => import('./pages/edit'));
const SchoolActivitiesContainer = lazyWithRetry(
  () => import('./components/school-activities-container')
);

const EffectedClasses = lazyWithRetry(() => import('./pages/effected-classes'));

export const getRoutes: NavObjectFunction = (t) => [
  {
    type: NavObjectType.Category,
    title: t('navigation:general.title'),
    children: [
      {
        type: NavObjectType.RootLink,
        path: 'school-activity',
        title: t('navigation:general.schoolActivities.schoolActivity'),
        icon: <SchoolExamACircleIcon />,
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
            element: <SchoolActivitiesContainer />,
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
                index: true,
                loader: () => redirect('./effected-classes'),
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'effected-classes',
                element: <EffectedClasses />,
              },
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
