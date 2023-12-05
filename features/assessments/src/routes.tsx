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
import { getAssessmentById, getAssessments } from './api/assessments';
import { getAssessmentSubjectGroups } from './api/assessment-subject-groups';
import { getAssessmentResults } from './api/assessment-results';

const AssessmentsPage = lazyWithRetry(() => import('./pages/assessments'));
const ViewTermAssessment = lazyWithRetry(
  () => import('./pages/term-assessment/view')
);
const CreateTermAssessmentPage = lazyWithRetry(
  () => import('./pages/term-assessment/create')
);
const CreateStateCbaPage = lazyWithRetry(
  () => import('./pages/state-cba/create')
);
const ViewStateCba = lazyWithRetry(() => import('./pages/state-cba/view'));
const EditStateCba = lazyWithRetry(() => import('./pages/state-cba/edit'));
const EditTermAssessmentResults = lazyWithRetry(
  () => import('./pages/term-assessment/subject-group/edit-results')
);
const EditStateCbaResults = lazyWithRetry(
  () => import('./pages/state-cba/edit-results')
);
const OverallCommentsTermAssessmentPage = lazyWithRetry(
  () => import('./pages/term-assessment/overall-comments')
);
const EditTermAssessmentPage = lazyWithRetry(
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
          permissions.isStaffUserWithPermission(
            'ps:1:assessment:read_assessments'
          ),
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
            hasAccess: ({ hasPermission }) =>
              hasPermission('ps:1:assessment:write_assessments'),
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
                    path: 'overall-comments',
                    element: <OverallCommentsTermAssessmentPage />,
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
          {
            type: NavObjectType.NonMenuLink,
            path: 'state-cba/create',
            element: <CreateStateCbaPage />,
            hasAccess: ({ hasPermission }) =>
              hasPermission('ps:1:assessment:write_assessments'),
          },
          {
            type: NavObjectType.NonMenuLink,
            path: ':academicNamespaceId/state-cba-assessments',
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
                    element: <ViewStateCba />,
                  },
                  {
                    type: NavObjectType.NonMenuLink,
                    path: 'edit',
                    element: <EditStateCba />,
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
                    element: <EditStateCbaResults />,
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
