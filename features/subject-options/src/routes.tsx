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
import { getOptionsSolutions } from './api/options-solutions';
import { getOptionsClassLists } from './api/options-class-list';

const SubjectOptions = lazyWithRetry(() => import('./pages/index'));
const CreateSubjectOptions = lazyWithRetry(() => import('./pages/create'));
const EditSubjectOptions = lazyWithRetry(() => import('./pages/edit'));

const OptionsViewContainer = lazyWithRetry(
  () => import('./components/view/container')
);
const StudentOptionsPreferencesPage = lazyWithRetry(
  () => import('./pages/view/preferences')
);
const StudentOptionsStatsPage = lazyWithRetry(
  () => import('./pages/view/stats')
);
const StudentOptionsSolvePage = lazyWithRetry(
  () => import('./pages/view/solve')
);
const StudentOptionsClassListsPage = lazyWithRetry(
  () => import('./pages/view/class-lists')
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
            path: 'edit/:id',
            element: <EditSubjectOptions />,
            loader: ({ params }) => {
              const id = getNumber(params.id);

              if (!id) {
                throw404Error();
              }

              return getOptionsSetup(id);
            },
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
              {
                type: NavObjectType.NonMenuLink,
                path: 'solve',
                element: <StudentOptionsSolvePage />,
                hasAccess: ({ hasPermission }) =>
                  hasPermission('ps:1:options:options_beta_test'),
                loader: ({ params }) => {
                  const id = getNumber(params.id);

                  if (!id) {
                    throw404Error();
                  }

                  return Promise.all([
                    getOptionsSetup(id),
                    getOptionsSolutions({ optionId: id }),
                  ]);
                },
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'class-lists',
                element: <StudentOptionsClassListsPage />,
                hasAccess: ({ hasPermission }) =>
                  hasPermission('ps:1:options:options_beta_test'),
                loader: async ({ params }) => {
                  const id = getNumber(params.id);

                  if (!id) {
                    throw404Error();
                  }

                  const { options_solutions: optionsSolutions } =
                    await getOptionsSolutions({ optionId: id });
                  const firstBlock = optionsSolutions.pools[0]?.blocks[0];
                  return getOptionsClassLists({
                    optionId: id,
                    blockIdx: firstBlock?.blockIdx ?? 0,
                  });
                },
              },
            ],
          },
        ],
      },
    ],
  },
];
