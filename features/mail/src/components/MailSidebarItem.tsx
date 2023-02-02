/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { useNavigate } from 'react-router-dom';
import { LabelInput, Maybe, useUser, Mail } from '@tyro/api';
// @mui
import { Typography, ListItemText, ListItemButton } from '@mui/material';
// @types
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Label as LabelIcon } from '@mui/icons-material';
import { useTranslation } from '@tyro/i18n';
import { MailLabel, Mails } from '../types';
// components
import { Iconify } from '../../../../src/components/iconify';
import { useMails } from '../api/mails';
import { objFromArray } from '../helpers';
import OptionButton from '../../../../src/components/table/OptionButton';
import { Option } from '../../../../src/components/table/types';
import { LabelType } from '../constants';

// ----------------------------------------------------------------------

const NavItemSize = 24;

const LABEL_ICONS = {
  all: 'eva:email-fill',
  inbox: 'eva:inbox-fill',
  trash: 'eva:trash-2-outline',
  drafts: 'eva:file-fill',
  spam: 'ic:round-report',
  sent: 'ic:round-send',
  starred: 'eva:star-fill',
  important: 'ic:round-label-important',
  id_social: 'eva:share-fill',
  id_promotions: 'ic:round-label',
  id_forums: 'ic:round-forum',
};

const linkTo = (label: MailLabel) => {
  const baseUrl = '/mail';

  if (label.type === 'system') {
    return `${baseUrl}/label/${label.name}`;
  }
  if (label.type === 'custom') {
    return `${baseUrl}/label/custom/${label.name}`;
  }
  return baseUrl;
};

// ----------------------------------------------------------------------

type Props = {
  label: MailLabel;
  isActive: boolean;
  setActiveLabelName: Dispatch<SetStateAction<string>>;
  setMails: Dispatch<SetStateAction<Mails>>;
  setLabelInfo: Dispatch<SetStateAction<Maybe<LabelInput>>>;
};

export default function MailSidebarItem({
  label,
  isActive,
  setActiveLabelName,
  setMails,
  setLabelInfo,
  ...other
}: Props) {
  const { t } = useTranslation(['mail', 'common']);
  const labelOptions: Option<any>[] = [
    {
      text: t('common:actions.edit'),
      icon: 'edit',
      action: (e: MouseEvent) => {
        e.stopPropagation();
        setLabelInfo({
          id: label.originalId,
          name: label.name,
          colour: label.color,
        });
      },
    },
    {
      text: t('mail:actions.removeLabel'),
      icon: 'delete',
      action: (e: MouseEvent) => {
        e.stopPropagation();
      },
    },
  ];

  const navigate = useNavigate();
  const isUnread = label.unreadCount > 0;
  const [hovered, setHovered] = useState(false);
  const { user } = useUser();

  const {
    isLoading: isLoadingMails,
    data: mailsData,
    refetch,
  } = useMails(
    label.originalId ?? 1,
    user?.profiles && user.profiles[0].partyId
  );
  useEffect(() => {
    if (isActive) {
      const mailsDataWithThreads: Maybe<Mail>[] = [];
      mailsData?.forEach((mail) => {
        mailsDataWithThreads.push(mail as Mail);
        if (mail?.threads?.length) {
          mail.threads.forEach((threadMail) => {
            mailsDataWithThreads.push(threadMail as Mail);
          });
        }
      });
      mailsDataWithThreads &&
        setMails({
          byId: objFromArray(mailsDataWithThreads),
          allIds: Object.keys(objFromArray(mailsDataWithThreads)),
        });
    }
  }, [mailsData]);

  useEffect(() => {
    if (isActive && user?.profiles?.length) {
      refetch();
    }
  }, [isActive, user?.profiles]);

  const onClickListItem = () => {
    if (!isActive) {
      setActiveLabelName(label.name);
      refetch();
      navigate(linkTo(label));
    }
  };

  return (
    <ListItemButton
      sx={{
        px: 3,
        height: 48,
        typography: 'body2',
        color: !isActive ? 'text.secondary' : 'text.primary',
        textTransform: label.type !== 'custom' ? 'capitalize' : 'none',
        fontWeight: !isActive ? '' : 'fontWeightMedium',
        bgcolor: !isActive ? '' : 'action.selected',
      }}
      onClick={onClickListItem}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...other}
    >
      {label.type !== LabelType.CUSTOM ? (
        <Iconify
          icon={
            LABEL_ICONS[
              typeof label.id !== 'number' ? label.id ?? 'inbox' : 'inbox'
            ]
          } // ToDo: remove inbox
          sx={{
            mr: 2,
            width: NavItemSize,
            height: NavItemSize,
            color: label.color,
          }}
        />
      ) : (
        <LabelIcon
          sx={{
            mr: 2,
            width: NavItemSize,
            height: NavItemSize,
            color: label.color,
          }}
        />
      )}

      <ListItemText disableTypography primary={label.name} />

      {isUnread && (!hovered || label.type !== LabelType.CUSTOM) && (
        <Typography variant="caption">{label.unreadCount}</Typography>
      )}
      {hovered && label.type === LabelType.CUSTOM && (
        <OptionButton options={labelOptions} />
      )}
    </ListItemButton>
  );
}
