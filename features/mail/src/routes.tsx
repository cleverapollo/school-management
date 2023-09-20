import {
  getNumber,
  lazyWithRetry,
  NavObjectFunction,
  NavObjectType,
} from '@tyro/core';
import { LetterIcon } from '@tyro/icons';
import { getUser } from '@tyro/api';
import { LoaderFunction, redirect } from 'react-router-dom';
import { getLabels } from './api/labels';
import { getLabelById, SystemLabelMapping } from './utils/labels';
import { getMail, getMailList } from './api/mails';
import { MailCountLabel } from './components/common/mail-count-label';

const Mail = lazyWithRetry(() => import('./pages/index'));

const labelPageLoader: LoaderFunction = async ({ params }) => {
  const { activeProfile } = await getUser();
  const activeProfileId = activeProfile?.partyId ?? 0;
  const labels = await getLabels({
    personPartyId: activeProfileId,
  });

  const matchedLabel = getLabelById(params.labelId ?? '0', labels);
  return getMailList(matchedLabel?.originalId ?? 0, activeProfileId);
};

const mailPageLoader: LoaderFunction = async ({ params }) => {
  const mailId = getNumber(params.mailId);
  return getMail(mailId ?? 0);
};

export const getRoutes: NavObjectFunction = (t) => [
  {
    type: NavObjectType.Category,
    title: t('navigation:general.title'),
    children: [
      {
        type: NavObjectType.RootLink,
        path: 'mail',
        title: t('navigation:general.mail'),
        icon: <LetterIcon />,
        info: <MailCountLabel />,
        hasAccess: (permissions) =>
          permissions.hasAtLeastOnePermission([
            'ps:1:communications:read_mail',
            'ps:1:communications:write_mail',
          ]),
        element: <Mail />,
        children: [
          {
            type: NavObjectType.NonMenuLink,
            index: true,
            loader: () => redirect(`./${SystemLabelMapping.Inbox}`),
          },
          {
            type: NavObjectType.NonMenuLink,
            path: ':labelId',
            loader: labelPageLoader,
            element: <Mail />,
            children: [
              {
                type: NavObjectType.NonMenuLink,
                path: 'view/:mailId',
                loader: mailPageLoader,
                element: <Mail />,
              },
            ],
          },
          {
            type: NavObjectType.NonMenuLink,
            path: 'label/:labelId',
            loader: labelPageLoader,
            element: <Mail />,
            children: [
              {
                type: NavObjectType.NonMenuLink,
                path: 'view/:mailId',
                loader: mailPageLoader,
                element: <Mail />,
              },
            ],
          },
        ],
      },
    ],
  },
];
