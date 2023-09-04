import { Link, useParams } from 'react-router-dom';
import { ListItemText, ListItemButton, SvgIconProps } from '@mui/material';

import {
  Dispatch,
  ForwardRefExoticComponent,
  ReactElement,
  RefAttributes,
  SetStateAction,
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
  setLabelInfo: Dispatch<SetStateAction<ReturnTypeFromUseLabels>>;
};

export function MailSidebarItem({ label, setLabelInfo }: MailSidebarItemProps) {
  const { t } = useTranslation(['mail', 'common']);
  const { id } = useParams<{ id: string }>();
  // const isActive = use
  const labelOptions = [
    {
      label: t('common:actions.edit'),
      icon: <EditIcon />,
      onClick: () => {
        setLabelInfo(label);
      },
    },
    {
      label: t('mail:actions.removeLabel'),
      icon: <TrashIcon />,
      onClick: () => {},
    },
  ];

  const Icon =
    typeof label.id === 'number'
      ? LabelIcon
      : LABEL_ICONS[label.id] || LabelIcon;

  const sharedIconProps = {
    mr: 2,
    color: label.colour,
  };

  return (
    <ListItemButton
      component={Link}
      to={linkTo(label)}
      sx={{
        px: 3,
        height: 48,
        typography: 'body2',
        color: !isActive ? 'text.secondary' : 'text.primary',
        fontWeight: !isActive ? '' : 'fontWeightMedium',
        bgcolor: !isActive ? '' : 'action.selected',
      }}
    >
      <Icon sx={sharedIconProps} />
      <ListItemText disableTypography primary={label.name} />

      {/* {isUnread && (!hovered || !label.custom) && (
        <Typography variant="caption">{label.unreadCount}</Typography>
      )} */}
      {label.custom && <ActionMenu menuItems={labelOptions} />}
    </ListItemButton>
  );
}
