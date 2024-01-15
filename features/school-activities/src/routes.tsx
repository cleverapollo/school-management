import {
  getNumber,
  NavObjectFunction,
  NavObjectType,
  lazyWithRetry,
  throw404Error,
} from '@tyro/core';
import { redirect } from 'react-router-dom';
import { SchoolBagIcon } from '@tyro/icons';
import { getSchoolActivityById } from './api/get-school-activities';
import { getClassAway } from './api/class-away';
import { getLessonsNeedingCover } from './api/lessons-needed-cover';

const SchoolActivityPage = lazyWithRetry(() => import('./pages'));
const CreateSchoolActivityPage = lazyWithRetry(() => import('./pages/create'));
const EditSchoolActivityPage = lazyWithRetry(() => import('./pages/edit'));
const SchoolActivitiesContainer = lazyWithRetry(
  () => import('./components/school-activities-container')
);

const CoverRequired = lazyWithRetry(() => import('./pages/cover-required'));
const ClassAway = lazyWithRetry(() => import('./pages/class-away'));

export const getRoutes: NavObjectFunction = (t) => [
  {
    type: NavObjectType.Category,
    title: t('navigation:general.title'),
    children: [
      {
        type: NavObjectType.RootLink,
        path: 'school-activity',
        title: t('navigation:general.schoolActivities.title'),
        hasAccess: ({ isStaffUserWithPermission }) =>
          isStaffUserWithPermission(
            'ps:1:school_activity:read_school_activity'
          ),
        icon: <SchoolBagIcon />,
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
                loader: () => redirect('./cover-required'),
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'edit',
                element: <EditSchoolActivityPage />,
                loader: ({ params }) => {
                  const schoolActivityId = getNumber(params.activityId);

                  if (!schoolActivityId) {
                    throw404Error();
                  }

                  return getSchoolActivityById({
                    schoolActivityIds: [schoolActivityId],
                  });
                },
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'cover-required',
                element: <CoverRequired />,
                loader: ({ params }) => {
                  const schoolActivityId = getNumber(params.activityId);

                  if (!schoolActivityId) {
                    throw404Error();
                  }

                  return getLessonsNeedingCover({ schoolActivityId });
                },
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'class-away',
                element: <ClassAway />,
                loader: ({ params }) => {
                  const schoolActivityId = getNumber(params.activityId);

                  if (!schoolActivityId) {
                    throw404Error();
                  }

                  return getClassAway({ schoolActivityId });
                },
              },
            ],
          },
        ],
      },
    ],
  },
];
