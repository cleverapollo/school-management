import { NavObjectFunction, NavObjectType } from '@tyro/core';
import { lazy } from 'react';
import { redirect } from 'react-router-dom';
import { SchoolExamACircleIcon } from '@tyro/icons';
import { UserType } from '@tyro/api';

const TermAssessmentsContainer = lazy(
  () => import('./components/term-assessments-container')
);

const CreateTermAssessmentPage = lazy(
  () => import('./pages/create-term-assessment')
);

export const getRoutes: NavObjectFunction = (t) => [
  {
    type: NavObjectType.Category,
    title: t('navigation:general.title'),
    children: [
      {
        type: NavObjectType.RootGroup,
        path: 'assessment',
        icon: <SchoolExamACircleIcon />,
        // TODO: check which permissions are needed
        hasAccess: ({ userType }) => userType === UserType.Admin,
        title: t('navigation:general.assessment.title'),
        children: [
          {
            type: NavObjectType.MenuLink,
            path: 'overview',
            title: t('navigation:general.assessment.overview'),
            element: <div>overview section</div>,
          },
          {
            type: NavObjectType.MenuLink,
            path: 'term-assessments',
            title: t('navigation:general.assessment.termAssessments'),
            element: <TermAssessmentsContainer />,
            children: [
              {
                type: NavObjectType.NonMenuLink,
                index: true,
                // TODO: add list of term assessments
                element: <div />,
                loader: () => redirect('./create'),
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'create',
                element: <CreateTermAssessmentPage />,
              },
            ],
          },
        ],
      },
    ],
  },
];
