import { NavObjectFunction, NavObjectType } from '@tyro/core';
import { lazy } from 'react';
import { SchoolExamACircleIcon } from '@tyro/icons';
import { UserType } from '@tyro/api';

const AssessmentsContainer = lazy(() => import('./components/container'));
const AssessmentsPage = lazy(() => import('./pages/assessments'));
const CreateTermAssessmentPage = lazy(
  () => import('./pages/term-assessment/create')
);

export const getRoutes: NavObjectFunction = (t) => [
  {
    type: NavObjectType.Category,
    title: t('navigation:general.title'),
    children: [
      {
        type: NavObjectType.RootLink,
        path: 'assessments',
        icon: <SchoolExamACircleIcon />,
        // TODO: check which permissions are needed
        hasAccess: ({ userType }) => userType === UserType.Admin,
        title: t('navigation:general.assessment.title'),
        element: <AssessmentsContainer />,
        children: [
          {
            type: NavObjectType.NonMenuLink,
            index: true,
            element: <AssessmentsPage />,
          },
          {
            type: NavObjectType.NonMenuLink,
            path: 'term-assessments/create',
            element: <CreateTermAssessmentPage />,
          },
        ],
      },
    ],
  },
];
