import {
  NavObjectFunction,
  NavObjectType,
  getNumber,
  throw404Error,
} from '@tyro/core';
import { lazy } from 'react';
import { SchoolExamACircleIcon } from '@tyro/icons';
import { UserType, getCoreAcademicNamespace } from '@tyro/api';
import { redirect } from 'react-router-dom';
import { getAssessmentById, getAssessments } from './api/assessments';
import { getAssessmentSubjectGroups } from './api/assessment-subject-groups';
import { getAssessmentResults } from './api/term-assessments/results';

const AssessmentsPage = lazy(() => import('./pages/assessments'));
const ViewTermAssessment = lazy(() => import('./pages/term-assessment/view'));
const CreateTermAssessmentPage = lazy(
  () => import('./pages/term-assessment/create')
);
const EditTermAssessmentResults = lazy(
  () => import('./pages/term-assessment/subject-group/edit-results')
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
            path: 'term-assessments',
            children: [
              {
                type: NavObjectType.NonMenuLink,
                index: true,
                loader: () => redirect('./..'),
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'create',
                element: <CreateTermAssessmentPage />,
              },
              {
                type: NavObjectType.NonMenuLink,
                path: ':assessmentId',
                loader: ({ params }) => {
                  const assessmentId = getNumber(params.assessmentId);

                  if (!assessmentId) {
                    throw404Error();
                  }

                  return getAssessmentById(assessmentId);
                },
                children: [
                  {
                    type: NavObjectType.NonMenuLink,
                    index: true,
                    loader: ({ params }) => {
                      const assessmentId = getNumber(params.assessmentId);

                      return getAssessmentSubjectGroups({ assessmentId });
                    },
                    element: <ViewTermAssessment />,
                  },
                  {
                    type: NavObjectType.NonMenuLink,
                    path: 'subject-group/:subjectGroupId',
                    loader: ({ params }) => {
                      const assessmentId = getNumber(params.assessmentId);
                      const subjectGroupId = getNumber(params.subjectGroupId);

                      if (!assessmentId || !subjectGroupId) {
                        throw404Error();
                      }

                      return Promise.all([
                        getAssessmentById(assessmentId),
                        getAssessmentResults({
                          assessmentId,
                          subjectGroupIds: [subjectGroupId],
                        }),
                      ]);
                    },
                    element: <EditTermAssessmentResults />,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
