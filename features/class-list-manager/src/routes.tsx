import { lazy } from 'react';
import { NavObjectFunction, NavObjectType } from '@tyro/core';
import { MoveGroupIcon } from '@tyro/icons';
import { redirect } from 'react-router-dom';

const ClassListManagerContainer = lazy(
  () => import('./components/class-list-manager-container')
);
const ClassListManager = lazy(() => import('./pages/index'));

export const getRoutes: NavObjectFunction = (t) => [
  {
    type: NavObjectType.Category,
    title: t('navigation:management.title'),
    children: [
      {
        type: NavObjectType.RootLink,
        path: 'class-list-manager',
        title: t('navigation:management.classListManager'),
        icon: <MoveGroupIcon />,
        element: <ClassListManagerContainer />,
        children: [
          {
            type: NavObjectType.NonMenuLink,
            index: true,
            loader: () => redirect('./class'),
          },
          {
            type: NavObjectType.NonMenuLink,
            path: 'class',
            element: <ClassListManager />,
          },
          {
            type: NavObjectType.NonMenuLink,
            path: 'block',
            element: <div>Blocks</div>,
          },
        ],
      },
    ],
  },
];
