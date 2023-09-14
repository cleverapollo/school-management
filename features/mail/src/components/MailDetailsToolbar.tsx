/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { useNavigate, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Box,
  Link,
  Tooltip,
  Typography,
  IconButton,
  DialogTitle,
} from '@mui/material';
import { Mail } from '@tyro/api';
import { useMemo, useState } from 'react';
import { useResponsive, Avatar, ActionMenu } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import {
  ChevronLeftIcon,
  ForwardMailIcon,
  LabelsIcon,
  MailIcon,
  ReplyIcon,
  TrashIcon,
} from '@tyro/icons';
import { fDateTimeSuffix } from '../../../../src/utils/formatTime';
import { DialogAnimate } from '../../../../src/components/animate';
import { MailLabel, MailLabelId } from '../types';
import ApplyLabelsForm from './ApplyLabelsForm';
import { labelsMap, LabelType } from '../constants';

// ----------------------------------------------------------------------

const RootStyle = styled(Box)(({ theme }) => ({
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

export default function MailDetailsToolbar({
  mail,
  labels,
  activeLabelName,
  ...other
}: Props) {
  const { t } = useTranslation(['mail']);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const labelOptions = [
    {
      label: t('mail:actions.reply'),
      icon: <ReplyIcon />,
      onClick: () => {},
    },
    {
      label: t('mail:actions.forward'),
      icon: <ForwardMailIcon />,
      onClick: () => {},
    },
    {
      label: t('mail:actions.applyLabel'),
      icon: <LabelsIcon />,
      onClick: () => {
        setIsOpenDialog(true);
      },
    },
    {
      label: t('mail:actions.markAsUnread'),
      icon: <MailIcon />,
      onClick: () => {},
    },
    {
      label: t('mail:actions.deleteThisMessage'),
      icon: <TrashIcon />,
      onClick: () => {},
    },
  ];
  const navigate = useNavigate();

  const { labelName } = useParams();

  const isDesktop = useResponsive('up', 'sm');

  const baseUrl = '/mail';

  const handleBack = () => {
    if (!labelName) {
      return navigate(`${baseUrl}/label/inbox`);
    }
    if (
      Object.values(labelsMap).includes(
        activeLabelName.toLowerCase() as MailLabelId
      )
    ) {
      return navigate(`${baseUrl}/label/${labelName}`);
    }
    return navigate(`${baseUrl}/label/custom/${labelName}`);
  };

  const mailData = {
    threadId: mail.threadId,
    mailId: mail.id,
  };

  const labelsForApplying = useMemo(
    () =>
      labels?.filter(
        (label) =>
          label.type === LabelType.CUSTOM &&
          !mail.labels?.filter(
            (activeLabel) => activeLabel?.id === label.originalId
          ).length
      ),
    [labels, mail?.labels]
  );

  return (
    <RootStyle {...other}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Tooltip title={t('mail:tooltipTitles.back')}>
          <IconButton onClick={handleBack}>
            <ChevronLeftIcon sx={{ width: 20, height: 20 }} />
          </IconButton>
        </Tooltip>
        <Avatar src="google.com" name={mail.senderPartyId?.toString()} />

        <Box sx={{ ml: 2 }}>
          <Typography display="inline" variant="subtitle2">
            {mail.senderPartyId}
          </Typography>
          <Link variant="caption" sx={{ color: 'text.secondary' }}>
            &nbsp; {`<${mail.senderPartyId}>`}
          </Link>
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', display: 'block' }}
          >
            To:&nbsp;
            {mail.recipients?.map((person) => (
              <Link color="inherit" key={person?.recipientPartyId}>
                {/* {person?.name} */}
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
            <Tooltip title={t('mail:tooltipTitles.reply')}>
              <IconButton>
                <ReplyIcon sx={{ width: 20, height: 20 }} />
              </IconButton>
            </Tooltip>
          </>
        )}

        <Tooltip title={t('mail:tooltipTitles.moreOptions')}>
          <ActionMenu
            iconOnly
            buttonLabel={t('mail:actions.more')}
            menuItems={labelOptions}
          />
        </Tooltip>
        <DialogAnimate
          open={isOpenDialog}
          onClose={() => setIsOpenDialog(false)}
        >
          <DialogTitle>{t('mail:applyLabel')}</DialogTitle>
          <ApplyLabelsForm
            mailData={mailData}
            labels={labelsForApplying}
            onCancel={() => setIsOpenDialog(false)}
          />
        </DialogAnimate>
      </Box>
    </RootStyle>
  );
}
