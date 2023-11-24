import {
  NavObjectFunction,
  NavObjectType,
  getNumber,
  throw404Error,
  lazyWithRetry,
} from '@tyro/core';
import { SchoolExamACircleIcon } from '@tyro/icons';
import { getCoreAcademicNamespace } from '@tyro/api';
import { redirect } from 'react-router-dom';

const SchoolActivityPage = lazyWithRetry(() => import('./pages'));
const CreateSchoolActivityPage = lazyWithRetry(() => import('./pages/create'));

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
            path: 'activity/create',
            index: true,
            element: <CreateSchoolActivityPage />,
          },
        ],
      },
    ],
  },
];
