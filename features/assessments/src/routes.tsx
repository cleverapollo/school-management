import {
  NavObjectFunction,
  NavObjectType,
  getNumber,
  throw404Error,
} from '@tyro/core';
import { lazy } from 'react';
import { SchoolExamACircleIcon } from '@tyro/icons';
import { getCoreAcademicNamespace } from '@tyro/api';
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
const EditTermAssessmentPage = lazy(
  () => import('./pages/term-assessment/edit')
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
        title: t('navigation:general.assessments.title'),
        hasAccess: (permissions) =>
          permissions.hasPermission('ps:1:assessment:read_assessments'),
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

              if (!activeAcademicNamespace) {
                return;
              }

              return getAssessments({
                academicNameSpaceId:
                  activeAcademicNamespace.academicNamespaceId,
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
            path: ':academicNamespaceId/term-assessments',
            children: [
              {
                type: NavObjectType.NonMenuLink,
                index: true,
                loader: () => redirect('./..'),
              },
              {
                type: NavObjectType.NonMenuLink,
                path: ':assessmentId',
                loader: ({ params }) => {
                  const academicNameSpaceId = getNumber(
                    params.academicNamespaceId
                  );
                  const assessmentId = getNumber(params.assessmentId);

                  if (!academicNameSpaceId || !assessmentId) {
                    throw404Error();
                  }

                  return getAssessmentById({
                    academicNameSpaceId,
                    ids: [assessmentId],
                  });
                },
                children: [
                  {
                    type: NavObjectType.NonMenuLink,
                    index: true,
                    loader: ({ params }) => {
                      const academicNameSpaceId = getNumber(
                        params.academicNamespaceId
                      );
                      const assessmentId = getNumber(params.assessmentId);

                      if (!academicNameSpaceId || !assessmentId) {
                        throw404Error();
                      }

                      return getAssessmentSubjectGroups(academicNameSpaceId, {
                        assessmentId,
                      });
                    },
                    element: <ViewTermAssessment />,
                  },
                  {
                    type: NavObjectType.NonMenuLink,
                    path: 'edit',
                    element: <EditTermAssessmentPage />,
                  },
                  {
                    type: NavObjectType.NonMenuLink,
                    path: 'subject-group/:subjectGroupId',
                    loader: ({ params }) => {
                      const academicNameSpaceId = getNumber(
                        params.academicNamespaceId
                      );
                      const assessmentId = getNumber(params.assessmentId);
                      const subjectGroupId = getNumber(params.subjectGroupId);

                      if (
                        !academicNameSpaceId ||
                        !assessmentId ||
                        !subjectGroupId
                      ) {
                        throw404Error();
                      }

                      return Promise.all([
                        getAssessmentById({
                          academicNameSpaceId,
                          ids: [assessmentId],
                        }),
                        getAssessmentResults(academicNameSpaceId, {
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
