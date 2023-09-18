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
import { TFunction, useTranslation } from '@tyro/i18n';
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
import { LabelType } from '@tyro/api';
import { ReturnTypeFromUseLabels } from '../../api/labels';
import { SystemLabels } from '../../utils/labels';

const LABEL_ICONS: Record<
  SystemLabels,
  ForwardRefExoticComponent<
    Omit<SvgIconProps<'svg', any>, 'ref'> & RefAttributes<SVGSVGElement>
  >
> = {
  inbox: MailInboxIcon,
  bin: TrashIcon,
  sent: SendMailIcon,
  // starred: StarIcon, add back in when star label is added
};

type MailSidebarItemProps = {
  label: ReturnTypeFromUseLabels;
  setLabelInfo?: Dispatch<
    SetStateAction<Partial<ReturnTypeFromUseLabels> | null>
  >;
  unreadCount?: number;
};

export function MailSidebarItem({
  label,
  setLabelInfo,
  unreadCount = 0,
}: MailSidebarItemProps) {
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

  const listItemLink = label.custom
    ? `/mail/label/${label.id}`
    : `/mail/${label.id}`;
  const labelName =
    label.type !== LabelType.Custom
      ? t(`mail:systemLabel.${label.type}`)
      : label.name;
  const isUnread = unreadCount > 0;

  return (
    <ListItemButton
      component={Link}
      to={listItemLink}
      sx={{
        pl: 3,
        pr: 1,
        height: 48,
        typography: 'body2',
        ...(isActive
          ? {
              color: 'text.primary',
              fontWeight: 'fontWeightMedium',
              backgroundColor: 'action.selected',
            }
          : {
              color: 'text.secondary',
            }),

        '.label-options': {
          position: 'absolute',
          right: 8,
          opacity: 0,
        },

        ...(label.custom && {
          '&:hover, &:focus-within': {
            '.label-options': {
              opacity: 1,
            },
            '.unread-count': {
              opacity: 0,
            },
          },
        }),
      }}
    >
      <Icon sx={sharedIconProps} />
      <ListItemText disableTypography primary={labelName} />

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
