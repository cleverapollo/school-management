import { lazyWithRetry, NavObjectFunction, NavObjectType } from '@tyro/core';
import { WalletWithMoneyIcon } from '@tyro/icons';

const ContactDashboard = lazyWithRetry(
  () => import('./pages/contact-dashboard')
);

const DiscountsPage = lazyWithRetry(() => import('./pages/discounts'));

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
  {
    type: NavObjectType.Category,
    title: t('navigation:management.title'),
    hasAccess: ({ isStaffUser }) => isStaffUser,
    children: [
      {
        type: NavObjectType.RootGroup,
        path: 'fees',
        title: t('navigation:general.fees'),
        icon: <WalletWithMoneyIcon />,
        children: [
          {
            type: NavObjectType.MenuLink,
            path: 'discounts',
            title: t('navigation:management.fees.discounts'),
            element: <DiscountsPage />,
          },
        ],
      },
    ],
  },
];
