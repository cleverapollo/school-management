import {
  getNumber,
  lazyWithRetry,
  NavObjectFunction,
  NavObjectType,
  throw404Error,
} from '@tyro/core';
import { WalletWithMoneyIcon } from '@tyro/icons';
import { getUser } from '@tyro/api';
import { redirect } from 'react-router-dom';
import { getFeeDebtors } from './api/debtors';
import { getDiscounts } from './api/discounts';
import { getFees } from './api/fees';
import { getFeesCategories } from './api/fees-categories';
import { getStudentFees } from './api/student-fees';
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
const FeeViewContainer = lazyWithRetry(
  () => import('./components/fees/fee-view-container')
);
const ViewFeeOverview = lazyWithRetry(
  () => import('./pages/fee/view/overview')
);

export const getRoutes: NavObjectFunction = (t) => [
  {
    type: NavObjectType.Category,
    title: t('navigation:general.title'),
    hasAccess: ({ isContact, hasPermission }) =>
      isContact && hasPermission('ps:1:fees:pay_fees'),
    children: [
      {
        type: NavObjectType.RootLink,
        path: 'fees',
        title: t('navigation:general.fees'),
        icon: <WalletWithMoneyIcon />,
        element: <ContactDashboard />,
        loader: async () => {
          const { activeProfile } = await getUser();

          return getStudentFees({ contactPartyId: activeProfile?.partyId });
        },
      },
    ],
  },
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
              const guardCheck = await stripeAccountGuard();
              return guardCheck || getFees({});
            },
            element: <OverviewPage />,
          },
          {
            type: NavObjectType.NonMenuLink,
            path: 'create',
            loader: async () => {
              const guardCheck = await stripeAccountGuard();
              return guardCheck || getFees({});
            },
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
              const guardCheck = await stripeAccountGuard();
              return guardCheck || getDiscounts({});
            },
            element: <DiscountsPage />,
          },
          {
            type: NavObjectType.MenuLink,
            path: 'categories',
            title: t('navigation:management.fees.categories'),
            loader: async () => {
              const guardCheck = await stripeAccountGuard();
              return guardCheck || getFeesCategories({});
            },
            element: <CategoriesPage />,
          },
          {
            type: NavObjectType.NonMenuLink,
            path: 'view/:id',
            element: <FeeViewContainer />,
            loader: async ({ params }) => {
              const feeId = getNumber(params.id);

              if (!feeId) {
                throw404Error();
              }

              const guardCheck = await stripeAccountGuard();

              return guardCheck || getFees({ ids: [feeId] });
            },
            children: [
              {
                type: NavObjectType.NonMenuLink,
                index: true,
                loader: () => redirect('overview'),
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'overview',
                element: <ViewFeeOverview />,
                loader: async ({ params }) => {
                  const feeId = getNumber(params.id);

                  if (!feeId) {
                    throw404Error();
                  }

                  return getFeeDebtors({ ids: [feeId] });
                },
              },
            ],
          },
        ],
      },
    ],
  },
];
