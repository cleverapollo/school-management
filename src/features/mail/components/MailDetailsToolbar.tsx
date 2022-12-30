import { useNavigate, useParams } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Link, Tooltip, Typography, IconButton, DialogTitle } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// utils
import createAvatar from '../../../utils/createAvatar';
import { fDateTimeSuffix } from '../../../utils/formatTime';
// @types
import { Mail, Label } from '@tyro/api/src/gql/graphql';
// components
import Avatar from '../../../components/Avatar';
import Iconify from '../../../components/Iconify';
import OptionButton from '../../../components/table/OptionButton';
import { Option } from '../../../components/table/types';
import { useState } from 'react';
import { DialogAnimate } from '../../../components/animate';
import { MailLabel, MailLabelId } from '../types';
import ApplyLabelsForm from './ApplyLabelsForm';
import { labelsMap, LABEL_TYPE } from '../constants';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  height: 84,
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 2),
  justifyContent: 'space-between',
}));

// ----------------------------------------------------------------------

type Props = {
  mail: Mail;
  labels: MailLabel[];
  activeLabelName: string;
};

export default function MailDetailsToolbar({ mail, labels, activeLabelName, ...other }: Props) {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const labelOptions: Option<any>[] = [
    {
      text: 'Reply',
      icon: 'arrowLeft',
      action: (e) => { e.stopPropagation(); },
    },
    {
      text: 'Forward',
      icon: 'arrow',
      action: (e) => { e.stopPropagation(); },
    },
    {
      text: 'Apply label',
      icon: 'label',
      action: (e) => { e.stopPropagation(); setIsOpenDialog(true);},
    },
    {
      text: 'Mark as unread',
      icon: 'mail',
      action: (e) => { e.stopPropagation(); },
    },
    {
      text: 'Delete this message',
      icon: 'delete',
      action: (e) => { e.stopPropagation(); },
    },
  ];
  const navigate = useNavigate();

  const { labelName } = useParams();

  const isDesktop = useResponsive('up', 'sm');

  const baseUrl = PATH_DASHBOARD.mail.root;

  const handleBack = () => {
    if (!labelName) {
      return navigate(`${baseUrl}/label/inbox`);
    }
    if (Object.values(labelsMap).includes(activeLabelName.toLowerCase() as MailLabelId)) {
      return navigate(`${baseUrl}/label/${labelName}`);
    } else {
      return navigate(`${baseUrl}/label/custom/${labelName}`);
    }
  };

  const mailData = {
    threadId: mail.threadId,
    mailId: mail.id,
  }

  return (
    <RootStyle {...other}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Tooltip title="Back">
          <IconButton onClick={handleBack}>
            <Iconify icon={'eva:arrow-ios-back-fill'} width={20} height={20} />
          </IconButton>
        </Tooltip>
        <Avatar
          alt={mail.senderPartyId?.toString()}
          src={'google.com'}
          color={createAvatar(mail.senderPartyId?.toString() ?? '').color}
        >
          {createAvatar(mail.senderPartyId?.toString() ?? '').name}
        </Avatar>

        <Box sx={{ ml: 2 }}>
          <Typography display="inline" variant="subtitle2">
            {mail.senderPartyId}
          </Typography>
          <Link variant="caption" sx={{ color: 'text.secondary' }}>
            &nbsp; {`<${mail.senderPartyId}>`}
          </Link>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
            To:&nbsp;
            {mail.recipients?.map((person) => (
              <Link color="inherit" key={person?.recipientPartyId}>
                {person?.name}
              </Link>
            ))}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {isDesktop && (
          <>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {fDateTimeSuffix(mail.sentOn)}
            </Typography>
            <Tooltip title="Reply">
              <IconButton>
                <Iconify icon={'ic:round-reply'} width={20} height={20} />
              </IconButton>
            </Tooltip>
          </>
        )}

        <Tooltip title="More options">
          <OptionButton options={labelOptions} />
        </Tooltip>
        <DialogAnimate open={isOpenDialog} onClose={() => setIsOpenDialog(false)}>
          <DialogTitle>Apply label</DialogTitle>
          <ApplyLabelsForm 
            mailData={mailData} 
            activeLabels={mail.labels?.filter(label => label?.custom) as Label[]} 
            labels={labels?.filter(label => label.type === LABEL_TYPE.CUSTOM) as MailLabel[]} 
            onCancel={() => setIsOpenDialog(false)}
          />
        </DialogAnimate>
      </Box>
    </RootStyle>
  );
}
