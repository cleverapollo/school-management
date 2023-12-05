import { lazyWithRetry, NavObjectFunction, NavObjectType } from '@tyro/core';
import { WalletWithMoneyIcon } from '@tyro/icons';
import { getStripeAccount } from './api/stripe-accounts';
import { stripeAccountGuard } from './utils/stripe-account-guard';

const ContactDashboard = lazyWithRetry(
  () => import('./pages/contact-dashboard')
);

const DiscountsPage = lazyWithRetry(() => import('./pages/discounts'));
const OnboardingPage = lazyWithRetry(() => import('./pages/onboarding'));

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
        loader: getStripeAccount,
        children: [
          {
            type: NavObjectType.NonMenuLink,
            path: 'onboarding',
            element: <OnboardingPage />,
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
