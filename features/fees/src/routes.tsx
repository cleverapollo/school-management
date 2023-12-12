import { lazyWithRetry, NavObjectFunction, NavObjectType } from '@tyro/core';
import { WalletWithMoneyIcon } from '@tyro/icons';
import { getStripeAccount } from './api/stripe-accounts';
import { stripeAccountGuard } from './utils/stripe-account-guard';

const ContactDashboard = lazyWithRetry(
  () => import('./pages/contact-dashboard')
);

const DiscountsPage = lazyWithRetry(() => import('./pages/discounts'));
const SetupPage = lazyWithRetry(() => import('./pages/setup'));

export const getRoutes: NavObjectFunction = (t) => [
  // {
  //   type: NavObjectType.Category,
  //   title: t('navigation:general.title'),
  //   hasAccess: ({ isContact }) => isContact,
  //   children: [
  //     {
  //       type: NavObjectType.RootLink,
  //       path: 'fees',
  //       title: t('navigation:general.fees'),
  //       icon: <WalletWithMoneyIcon />,
  //       element: <ContactDashboard />,
  //     },
  //   ],
  // },
  {
    type: NavObjectType.Category,
    title: t('navigation:management.title'),
    hasAccess: ({ isStaffUserWithPermission }) =>
      isStaffUserWithPermission('ps:1:fees:write_fees'),
    children: [
      {
        type: NavObjectType.RootGroup,
        path: 'fees',
        title: t('navigation:general.fees'),
        icon: <WalletWithMoneyIcon />,
        children: [
          {
            type: NavObjectType.NonMenuLink,
            path: 'setup',
            element: <SetupPage />,
          },
          {
            type: NavObjectType.MenuLink,
            path: 'overview',
            title: t('navigation:management.fees.overview'),
            loader: stripeAccountGuard,
          },
          {
            type: NavObjectType.MenuLink,
            path: 'discounts',
            title: t('navigation:management.fees.discounts'),
            loader: stripeAccountGuard,
            element: <DiscountsPage />,
          },
        ],
      },
    ],
  },
];
