import {
  getNumber,
  lazyWithRetry,
  NavObjectFunction,
  NavObjectType,
  throw404Error,
} from '@tyro/core';
import { WalletWithMoneyIcon } from '@tyro/icons';
import { getDiscounts } from './api/discounts';
import { getFees } from './api/fees';
import { getFeesCategories } from './api/fees-categories';
import { stripeAccountGuard } from './utils/stripe-account-guard';

const ContactDashboard = lazyWithRetry(
  () => import('./pages/contact-dashboard')
);

const DiscountsPage = lazyWithRetry(() => import('./pages/discounts'));
const SetupPage = lazyWithRetry(() => import('./pages/setup'));
const CategoriesPage = lazyWithRetry(() => import('./pages/categories'));
const OverviewPage = lazyWithRetry(() => import('./pages/fee'));
const CreateFeePage = lazyWithRetry(() => import('./pages/fee/create'));
const EditFeePage = lazyWithRetry(() => import('./pages/fee/edit'));

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
            loader: async () => {
              const redirect = await stripeAccountGuard();
              return redirect || getFees({});
            },
            element: <OverviewPage />,
          },
          {
            type: NavObjectType.NonMenuLink,
            path: 'create',
            element: <CreateFeePage />,
          },
          {
            type: NavObjectType.NonMenuLink,
            path: 'edit/:feeId',
            loader: ({ params }) => {
              const feeId = getNumber(params?.feeId);
              if (!feeId) throw404Error();

              return getFees({ ids: [feeId] });
            },
            element: <EditFeePage />,
          },
          {
            type: NavObjectType.MenuLink,
            path: 'discounts',
            title: t('navigation:management.fees.discounts'),
            loader: async () => {
              const redirect = await stripeAccountGuard();
              return redirect || getDiscounts({});
            },
            element: <DiscountsPage />,
          },
          {
            type: NavObjectType.MenuLink,
            path: 'categories',
            title: t('navigation:management.fees.categories'),
            loader: async () => {
              const redirect = await stripeAccountGuard();
              return redirect || getFeesCategories({});
            },
            element: <CategoriesPage />,
          },
        ],
      },
    ],
  },
];
