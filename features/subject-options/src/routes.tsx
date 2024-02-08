import {
  getNumber,
  lazyWithRetry,
  NavObjectFunction,
  NavObjectType,
  throw404Error,
} from '@tyro/core';
import { BookOpenWithTextIcon } from '@tyro/icons';
import { redirect } from 'react-router-dom';
import { getOptionsSetup, getOptionsSetupList } from './api/options';
import { getOptionsPreferences } from './api/options-preferences';

const SubjectOptions = lazyWithRetry(() => import('./pages/index'));
const CreateSubjectOptions = lazyWithRetry(() => import('./pages/create'));

const OptionsViewContainer = lazyWithRetry(
  () => import('./components/view/container')
);
const StudentOptionsPreferencesPage = lazyWithRetry(
  () => import('./pages/view/preferences')
);
const StudentOptionsStatsPage = lazyWithRetry(
  () => import('./pages/view/stats')
);

export const getRoutes: NavObjectFunction = (t) => [
  {
    type: NavObjectType.Category,
    title: t('navigation:management.title'),
    hasAccess: ({ isStaffUserWithPermission }) =>
      isStaffUserWithPermission('ps:1:options:read_options'),
    children: [
      {
        type: NavObjectType.RootLink,
        path: 'subject-options',
        title: t('navigation:management.subjectOptions'),
        icon: <BookOpenWithTextIcon />,
        children: [
          {
            index: true,
            type: NavObjectType.NonMenuLink,
            element: <SubjectOptions />,
            loader: () => getOptionsSetupList({}),
          },
          {
            type: NavObjectType.NonMenuLink,
            path: 'create',
            element: <CreateSubjectOptions />,
          },
          {
            type: NavObjectType.NonMenuLink,
            path: ':id',
            element: <OptionsViewContainer />,
            loader: ({ params }) => {
              const id = getNumber(params.id);

              if (!id) {
                throw404Error();
              }

              return getOptionsSetupList({ ids: [id] });
            },
            children: [
              {
                type: NavObjectType.NonMenuLink,
                index: true,
                loader: () => redirect('./preferences'),
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'preferences',
                element: <StudentOptionsPreferencesPage />,
                loader: ({ params }) => {
                  const id = getNumber(params.id);

                  if (!id) {
                    throw404Error();
                  }

                  return Promise.all([
                    getOptionsSetup(id),
                    getOptionsPreferences({ optionId: id }),
                  ]);
                },
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'stats',
                element: <StudentOptionsStatsPage />,
                loader: ({ params }) => {
                  const id = getNumber(params.id);

                  if (!id) {
                    throw404Error();
                  }

                  return Promise.all([
                    getOptionsSetup(id),
                    getOptionsPreferences({ optionId: id }),
                  ]);
                },
              },
            ],
          },
        ],
      },
    ],
  },
];
