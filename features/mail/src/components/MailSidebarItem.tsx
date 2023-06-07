import { useNavigate } from 'react-router-dom';
import { LabelInput, Maybe, useUser, Mail } from '@tyro/api';
// @mui
import {
  Typography,
  ListItemText,
  ListItemButton,
  SxProps,
} from '@mui/material';

// @types
import {
  Dispatch,
  ReactElement,
  SetStateAction,
  cloneElement,
  useEffect,
  useState,
} from 'react';
import { useTranslation } from '@tyro/i18n';
import {
  EditIcon,
  TrashIcon,
  MailInboxIcon,
  BlankFileIcon,
  SendMailIcon,
  StarIcon,
  LabelIcon,
} from '@tyro/icons';
import { ActionMenu } from '@tyro/core';
import { MailLabel, MailLabelId, Mails } from '../types';
// components
import { useMails } from '../api/mails';
import { objFromArray } from '../helpers';
import { LabelType } from '../constants';

// ----------------------------------------------------------------------

const LABEL_ICONS: Record<MailLabelId, ReactElement<{ sx?: SxProps }>> = {
  inbox: <MailInboxIcon />,
  trash: <TrashIcon />,
  drafts: <BlankFileIcon />,
  sent: <SendMailIcon />,
  starred: <StarIcon />,
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
  const labelOptions = [
    {
      label: t('common:actions.edit'),
      icon: <EditIcon />,
      onClick: () => {
        setLabelInfo({
          id: label.originalId,
          name: label.name,
          colour: label.color,
        });
      },
    },
    {
      label: t('mail:actions.removeLabel'),
      icon: <TrashIcon />,
      onClick: () => {},
    },
  ];

  const navigate = useNavigate();
  const isUnread = label.unreadCount > 0;
  const [hovered, setHovered] = useState(false);
  const { user } = useUser();

  const { data: mailsData, refetch } = useMails(
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

  const sharedIconProps = {
    mr: 2,
    color: label.color,
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
      {label.type === LabelType.CUSTOM ? (
        <LabelIcon sx={{ ...sharedIconProps, '& path': { opacity: 1 } }} />
      ) : (
        cloneElement(LABEL_ICONS[label.id], { sx: sharedIconProps })
      )}

      <ListItemText disableTypography primary={label.name} />

      {isUnread && (!hovered || label.type !== LabelType.CUSTOM) && (
        <Typography variant="caption">{label.unreadCount}</Typography>
      )}
      {hovered && label.type === LabelType.CUSTOM && (
        <ActionMenu menuItems={labelOptions} />
      )}
    </ListItemButton>
  );
}
