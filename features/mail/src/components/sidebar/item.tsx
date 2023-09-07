import { Link, useParams } from 'react-router-dom';
import {
  ListItemText,
  ListItemButton,
  SvgIconProps,
  Typography,
} from '@mui/material';

import {
  Dispatch,
  ForwardRefExoticComponent,
  RefAttributes,
  SetStateAction,
} from 'react';
import { useTranslation } from '@tyro/i18n';
import {
  EditIcon,
  TrashIcon,
  MailInboxIcon,
  SendMailIcon,
  StarIcon,
  LabelIcon,
  VerticalDotsIcon,
} from '@tyro/icons';
import { ActionMenu } from '@tyro/core';
import { ReturnTypeFromUseLabels } from '../../api/labels';
import { SystemLabels } from '../../constants';

const LABEL_ICONS: Record<
  SystemLabels,
  ForwardRefExoticComponent<
    Omit<SvgIconProps<'svg', any>, 'ref'> & RefAttributes<SVGSVGElement>
  >
> = {
  inbox: MailInboxIcon,
  trash: TrashIcon,
  sent: SendMailIcon,
  starred: StarIcon,
};

const linkTo = ({ custom, id }: ReturnTypeFromUseLabels) =>
  custom ? `/mail/label/${id}` : `/mail/${id}`;

type MailSidebarItemProps = {
  label: ReturnTypeFromUseLabels;
  setLabelInfo?: Dispatch<
    SetStateAction<Partial<ReturnTypeFromUseLabels> | null>
  >;
};

export function MailSidebarItem({ label, setLabelInfo }: MailSidebarItemProps) {
  const { t } = useTranslation(['mail', 'common']);
  const { labelId } = useParams<{ labelId: string }>();
  const isActive =
    typeof label.id === 'number'
      ? label.id === Number(labelId)
      : label.id === labelId;
  const labelOptions = [
    {
      label: t('common:actions.edit'),
      icon: <EditIcon />,
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        if (!setLabelInfo) return;
        setLabelInfo(label);
      },
    },
    {
      label: t('mail:actions.removeLabel'),
      icon: <TrashIcon />,
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
      },
    },
  ];

  const Icon =
    typeof label.id === 'number'
      ? LabelIcon
      : LABEL_ICONS[label.id] || LabelIcon;

  const sharedIconProps = {
    mr: 1,
    ...(label.custom && {
      color: label.colour && `${label.colour}.400`,
      'svg path': {
        fill: 'currentColor',
      },
    }),
  };

  const unreadCount = 5;
  const isUnread = unreadCount > 0;

  return (
    <ListItemButton
      component={Link}
      to={linkTo(label)}
      sx={{
        pl: 3,
        pr: 1,
        height: 48,
        typography: 'body2',
        color: !isActive ? 'text.secondary' : 'text.primary',
        fontWeight: !isActive ? '' : 'fontWeightMedium',
        bgcolor: !isActive ? '' : 'action.selected',

        '.label-options': {
          display: 'none',
        },

        ...(label.custom && {
          '&:hover': {
            '.label-options': {
              display: 'inline-flex',
            },
            '.unread-count': {
              display: 'none',
            },
          },
        }),
      }}
    >
      <Icon sx={sharedIconProps} />
      <ListItemText disableTypography primary={label.name} />

      {isUnread && (
        <Typography className="unread-count" variant="caption" pr={2}>
          {unreadCount}
        </Typography>
      )}
      {label.custom && (
        <ActionMenu
          iconOnly
          buttonIcon={<VerticalDotsIcon />}
          menuItems={labelOptions}
          buttonProps={{
            className: 'label-options',
          }}
        />
      )}
    </ListItemButton>
  );
}
