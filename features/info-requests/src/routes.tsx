import {
  lazyWithRetry,
  NavObjectFunction,
  NavObjectType,
  throw404Error,
} from '@tyro/core';
import { DocEditIcon } from '@tyro/icons';
import { getInfoRequestFormList } from './api/form-list';
import { getInfoRequestFormSetupDetails } from './api/form-setup';

const InfoRequestFormList = lazyWithRetry(() => import('./pages/index'));
const InfoRequestFormView = lazyWithRetry(() => import('./pages/view'));

export const getRoutes: NavObjectFunction = (t) => [
  {
    type: NavObjectType.Category,
    title: t('navigation:general.title'),
    hasAccess: ({ isContact }) => isContact,
    children: [
      {
        type: NavObjectType.RootLink,
        path: 'info-requests',
        title: t('navigation:general.infoRequests'),
        icon: <DocEditIcon />,
        children: [
          {
            type: NavObjectType.NonMenuLink,
            index: true,
            element: <InfoRequestFormList />,
            loader: () => getInfoRequestFormList({}),
          },
          {
            type: NavObjectType.NonMenuLink,
            path: 'view',
            element: <InfoRequestFormView />,
            loader: ({ request }) => {
              const url = new URL(request.url);
              const name = url.searchParams.get('name');
              const provider = url.searchParams.get('provider');
              const forPartyId = url.searchParams.get('forPartyId');
              const objectId = url.searchParams.get('objectId');

              if (!name || !provider) {
                return throw404Error();
              }

              return getInfoRequestFormSetupDetails({
                id: {
                  name,
                  provider,
                  forPartyId: Number(forPartyId),
                  objectId: Number(objectId),
                },
              });
            },
          },
        ],
      },
    ],
  },
];
