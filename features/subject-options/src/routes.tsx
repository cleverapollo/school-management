import { lazyWithRetry, NavObjectFunction, NavObjectType } from '@tyro/core';
import { BookOpenWithTextIcon } from '@tyro/icons';

const SubjectOptions = lazyWithRetry(() => import('./pages/index'));
const CreateSubjectOptions = lazyWithRetry(() => import('./pages/create'));

export const getRoutes: NavObjectFunction = (t) => [
  {
    type: NavObjectType.Category,
    title: t('navigation:management.title'),
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
          },
          {
            type: NavObjectType.NonMenuLink,
            path: 'create',
            element: <CreateSubjectOptions />,
          },
        ],
      },
    ],
  },
];
