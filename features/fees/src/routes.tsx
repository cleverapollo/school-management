import { lazyWithRetry, NavObjectFunction, NavObjectType } from '@tyro/core';
import { WalletWithMoneyIcon } from '@tyro/icons';

const ContactDashboard = lazyWithRetry(
  () => import('./pages/contact-dashboard')
);

export const getRoutes: NavObjectFunction = (t) => [
  {
    type: NavObjectType.Category,
    title: t('navigation:general.title'),
    hasAccess: ({ isContact }) => isContact,
    children: [
      {
        type: NavObjectType.RootLink,
        path: 'fees',
        title: t('navigation:general.fees'),
        icon: <WalletWithMoneyIcon />,
        element: <ContactDashboard />,
      },
    ],
  },
];
