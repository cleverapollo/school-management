import { NavLink as RouterLink, useParams, useNavigate, useLocation } from 'react-router-dom';
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
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useMails } from '../api/mails';
import { objFromArray } from '../../../store/slices/mail';

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
    //console.log('path - ', `localhost:6420${baseUrl}/label/${label.name}`);
    //return `localhost:6420${baseUrl}/label/${label.name}`;
  }
  if (label.type === 'custom') {
    return `${baseUrl}/label/custom/${label.name}`;
    //console.log('path - ', `localhost:6420${baseUrl}/label/custom/${label.name}`);
    //return `localhost:6420${baseUrl}/label/custom/${label.name}`;
  }
  return baseUrl;
};

// ----------------------------------------------------------------------

type Props = {
  label: MailLabel;
  isActive: boolean;
  setActiveLabelName: Dispatch<SetStateAction<string>>;
  setMails: Dispatch<SetStateAction<Mails>>;
};


export default function MailSidebarItem({ label, isActive, setActiveLabelName, setMails, ...other }: Props) {
  const navigate = useNavigate();
  //const location = useLocation();
  const isUnread = label.unreadCount > 0;

  const { isLoading: isLoadingMails, data: mailsData, refetch } = useMails(label.name);
  useEffect(() => {
    mailsData && setMails({ byId: objFromArray(mailsData), allIds: Object.keys(objFromArray(mailsData)) });
  }, [mailsData]);

  return (
    <ListItemButton
      sx={{
        px: 3,
        height: 48,
        typography: 'body2',
        color: !isActive ? 'text.secondary' : 'text.primary',
        textTransform: 'capitalize',
        fontWeight: !isActive ? '' : 'fontWeightMedium',
        bgcolor: !isActive? '' : 'action.selected',
        // '&.active': {
        //   color: 'text.primary',
        //   fontWeight: 'fontWeightMedium',
        //   bgcolor: 'action.selected',
        // },
      }}
      onClick={() => {if(!isActive){setActiveLabelName(label.name); refetch();//navigate(linkTo(label));
      }}}
      {...other}
    >
      {/* <RouterLink to={linkTo(label)} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}> */}
        <Iconify
          icon={LABEL_ICONS[label.id]}
          sx={{ mr: 2, width: ICON.NAVBAR_ITEM, height: ICON.NAVBAR_ITEM, color: label.color }}
        />

        <ListItemText disableTypography primary={label.name} />

        {isUnread && <Typography variant="caption">{label.unreadCount}</Typography>}
      {/* </RouterLink> */}
    </ListItemButton>
  );
}
