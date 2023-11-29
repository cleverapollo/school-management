import { lazyWithRetry, NavObjectFunction, NavObjectType } from '@tyro/core';
import { MoveGroupIcon } from '@tyro/icons';
import { redirect } from 'react-router-dom';
import { getYearGroups } from '@tyro/groups';
import { getBlocksList } from './api/blocks';

const ClassListManagerContainer = lazyWithRetry(
  () => import('./components/class-list-manager-container')
);
const ClassListManagerClasses = lazyWithRetry(() => import('./pages/classes'));
const ClassListManagerBlocks = lazyWithRetry(() => import('./pages/blocks'));

export const getRoutes: NavObjectFunction = (t) => [
  {
    type: NavObjectType.Category,
    title: t('navigation:management.title'),
    children: [
      {
        type: NavObjectType.RootLink,
        path: 'class-list-manager',
        hasAccess: (permissions) =>
          permissions.hasPermission('ps:1:groups:view_class_list_manager'),
        title: t('navigation:management.classListManager'),
        icon: <MoveGroupIcon />,
        element: <ClassListManagerContainer />,
        children: [
          {
            type: NavObjectType.NonMenuLink,
            index: true,
            loader: () => redirect('./classes'),
          },
          {
            type: NavObjectType.NonMenuLink,
            path: 'classes',
            loader: () => getYearGroups(),
            element: <ClassListManagerClasses />,
          },
          {
            type: NavObjectType.NonMenuLink,
            path: 'blocks',
            loader: async () => {
              const { core_yearGroupEnrollments: coreYearGroupEnrollments } =
                await getYearGroups();
              const [yearGroup] = coreYearGroupEnrollments;
              const searchParams = new URLSearchParams(
                document.location.search
              );
              const yearGroupId = searchParams.get('yearGroupId');
              return getBlocksList(
                Number(yearGroupId) ?? yearGroup?.yearGroupId
              );
            },
            element: <ClassListManagerBlocks />,
          },
        ],
      },
    ],
  },
];
