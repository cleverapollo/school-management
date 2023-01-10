/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { RouteObject } from 'react-router';
import { lazy, Suspense } from 'react';
import LoadingScreen from '../../../src/components/LoadingScreen';

const CustomGroups = lazy(() => import('./pages/custom'));
const ViewCustomGroupPage = lazy(() => import('./pages/custom/view'));
const EnrolmentGroups = lazy(() => import('./pages/enrolment'));
const ViewEnrolmentGroupPage = lazy(() => import('./pages/enrolment/view'));
const SubjectGroups = lazy(() => import('./pages/subject'));
const ViewSubjectGroupPage = lazy(() => import('./pages/subject/view'));
const Subjects = lazy(() => import('./pages/subject/students-list'));

function Loadable({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LoadingScreen />}>{children}</Suspense>;
}

export const routes: RouteObject[] = [
  {
    path: 'groups',
    children: [
      {
        path: 'enrolment',
        element: (
          <Loadable>
            <EnrolmentGroups />
          </Loadable>
        ),
        children: [
          {
            path: ':groupId/view',
            element: (
              <Loadable>
                <ViewEnrolmentGroupPage />
              </Loadable>
            ),
          },
        ],
      },
      {
        path: 'subject',
        element: (
          <Loadable>
            <SubjectGroups />
          </Loadable>
        ),
        children: [
          {
            path: ':groupId/view',
            element: (
              <Loadable>
                <ViewSubjectGroupPage />
              </Loadable>
            ),
          },
        ],
      },
      {
        path: 'custom',
        element: (
          <Loadable>
            <CustomGroups />
          </Loadable>
        ),
        children: [
          {
            path: ':groupId/view',
            element: (
              <Loadable>
                <ViewCustomGroupPage />
              </Loadable>
            ),
          },
        ],
      },
    ],
  },
  {
    path: 'subjects',
    element: (
      <Loadable>
        <Subjects />
      </Loadable>
    ),
  },
];
