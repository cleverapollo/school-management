import { useNavigate } from 'react-router-dom';
import { LabelInput, Maybe, useUser, Mail } from '@tyro/api';
// @mui
import { Typography, ListItemText, ListItemButton } from '@mui/material';
// @types
import { ICON } from '../../../config';
// @types
import { MailLabel, Mails } from '../types';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Iconify from '../../../components/Iconify';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useMails } from '../api/mails';
import { objFromArray } from '../../../store/slices/mail';
import { Label as LabelIcon } from '@mui/icons-material';
import OptionButton from '../../../components/table/OptionButton';
import { Option } from '../../../components/table/types';
import { LABEL_TYPE } from '../constants';

// ----------------------------------------------------------------------

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
  const baseUrl = PATH_DASHBOARD.mail.root;

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


export default function MailSidebarItem({ label, isActive, setActiveLabelName, setMails, setLabelInfo, ...other }: Props) {
  const labelOptions: Option<any>[] = [
    {
      text: 'edit',
      icon: 'edit',
      action: (e) => { 
        e.stopPropagation(); 
        setLabelInfo({ id: label.originalId, name: label.name, colour: label.color })
      },
    },
    {
      text: 'Remove label',
      icon: 'delete',
      action: (e) => { e.stopPropagation(); },
    },
  ];

  const navigate = useNavigate();
  const isUnread = label.unreadCount > 0;
  const [hovered, setHovered] = useState(false);
  const { user } = useUser();

  const { isLoading: isLoadingMails, data: mailsData, refetch } = useMails(label.originalId ?? 1, user?.profiles && user.profiles[0].partyId);
  useEffect(() => {
    if(isActive) {
      const mailsDataWithThreads: Maybe<Mail>[] = [];
      mailsData?.forEach(mail => {
        mailsDataWithThreads.push(mail);
        if(mail?.threads?.length){
          mail.threads.forEach(threadMail => {
            mailsDataWithThreads.push(threadMail);
          });
        }
      });
      mailsDataWithThreads && setMails(
        { 
          byId: objFromArray(mailsDataWithThreads), 
          allIds: Object.keys(objFromArray(mailsDataWithThreads)) 
        }
      );
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
  }

  return (
    <ListItemButton
      sx={{
        px: 3,
        height: 48,
        typography: 'body2',
        color: !isActive ? 'text.secondary' : 'text.primary',
        textTransform: label.type !== 'custom' ? 'capitalize' : 'none',
        fontWeight: !isActive ? '' : 'fontWeightMedium',
        bgcolor: !isActive? '' : 'action.selected',
      }}
      onClick={onClickListItem}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...other}
    >
      {label.type !== LABEL_TYPE.CUSTOM ? 
        <Iconify
          icon={LABEL_ICONS[typeof(label.id) !== 'number' ? (label.id ?? 'inbox') : 'inbox']} //ToDo: remove inbox
          sx={{ mr: 2, width: ICON.NAVBAR_ITEM, height: ICON.NAVBAR_ITEM, color: label.color }}
        /> :
        <LabelIcon sx={{ mr: 2, width: ICON.NAVBAR_ITEM, height: ICON.NAVBAR_ITEM, color: label.color }}/>
      }

      <ListItemText disableTypography primary={label.name} />

      {isUnread && 
        (!hovered || label.type !== LABEL_TYPE.CUSTOM) && 
        <Typography variant="caption">{label.unreadCount}</Typography>
      }
      {hovered && label.type === LABEL_TYPE.CUSTOM && <OptionButton options={labelOptions}/>}
    </ListItemButton>
  );
}
