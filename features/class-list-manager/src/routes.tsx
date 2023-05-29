import { lazy } from 'react';
import { NavObjectFunction, NavObjectType } from '@tyro/core';
import { MoveGroupIcon } from '@tyro/icons';
import { redirect } from 'react-router-dom';

const ClassListManagerContainer = lazy(
  () => import('./components/class-list-manager-container')
);
const ClassListManagerClasses = lazy(() => import('./pages/classes'));
const ClassListManagerBlocks = lazy(() => import('./pages/blocks'));

export const getRoutes: NavObjectFunction = (t) => [
  {
    type: NavObjectType.Category,
    title: t('navigation:management.title'),
    children: [
      {
        type: NavObjectType.RootLink,
        path: 'class-list-manager',
        hasAccess: (permissions) => !permissions.isTyroTenantAndUser,
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
            element: <ClassListManagerClasses />,
          },
          {
            type: NavObjectType.NonMenuLink,
            path: 'blocks',
            element: <ClassListManagerBlocks />,
          },
        ],
      },
    ],
  },
];
