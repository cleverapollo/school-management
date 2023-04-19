import { NavObjectFunction, NavObjectType, getNumber } from '@tyro/core';
import { lazy } from 'react';
import { SchoolExamACircleIcon } from '@tyro/icons';
import { UserType, getCoreAcademicNamespace } from '@tyro/api';
import { getAssessments } from './api/assessments';
import { getAssessmentSubjectGroups } from './api/assessment-subject-groups';

const AssessmentsPage = lazy(() => import('./pages/assessments'));
const TermAssessmentSubjectGroupsPage = lazy(
  () => import('./pages/term-assessment/subject-groups')
);
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
        title: t('navigation:general.assessments.title'),
        children: [
          {
            type: NavObjectType.NonMenuLink,
            index: true,
            loader: async () => {
              const data = await getCoreAcademicNamespace();

              const activeAcademicNamespace =
                data.core_academicNamespaces?.find(
                  (academicNamespace) =>
                    academicNamespace?.isActiveDefaultNamespace
                );

              return getAssessments({
                academicNameSpaceId:
                  activeAcademicNamespace?.academicNamespaceId ?? null,
              });
            },
            element: <AssessmentsPage />,
          },
          {
            type: NavObjectType.NonMenuLink,
            path: 'term-assessments/create',
            element: <CreateTermAssessmentPage />,
          },
          {
            type: NavObjectType.NonMenuLink,
            path: 'term-assessments/:assessmentId',
            loader: async ({ params }) => {
              const assessmentId = getNumber(params.assessmentId);

              return getAssessmentSubjectGroups({ assessmentId });
            },
            element: <TermAssessmentSubjectGroupsPage />,
          },
        ],
      },
    ],
  },
];
