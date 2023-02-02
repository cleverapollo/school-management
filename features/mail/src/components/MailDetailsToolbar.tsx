/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { useNavigate, useParams } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import {
  Box,
  Link,
  Tooltip,
  Typography,
  IconButton,
  DialogTitle,
} from '@mui/material';
// routes
import { Mail } from '@tyro/api';
import { useMemo, useState } from 'react';
import { useResponsive } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
// hooks
// utils
import createAvatar from '../../../../src/utils/createAvatar';
import { fDateTimeSuffix } from '../../../../src/utils/formatTime';
// @types
// components
import Avatar from '../../../../src/components/Avatar';
import { Iconify } from '../../../../src/components/iconify';
import OptionButton from '../../../../src/components/table/OptionButton';
import { Option } from '../../../../src/components/table/types';
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
  const labelOptions: Option<any>[] = [
    {
      text: t('mail:actions.reply'),
      icon: 'arrowLeft',
      action: (e: MouseEvent) => {
        e.stopPropagation();
      },
    },
    {
      text: t('mail:actions.forward'),
      icon: 'arrow',
      action: (e: MouseEvent) => {
        e.stopPropagation();
      },
    },
    {
      text: t('mail:actions.applyLabel'),
      icon: 'label',
      action: (e: MouseEvent) => {
        e.stopPropagation();
        setIsOpenDialog(true);
      },
    },
    {
      text: t('mail:actions.markAsUnread'),
      icon: 'mail',
      action: (e: MouseEvent) => {
        e.stopPropagation();
      },
    },
    {
      text: t('mail:actions.deleteThisMessage'),
      icon: 'delete',
      action: (e: MouseEvent) => {
        e.stopPropagation();
      },
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
            <Iconify icon="eva:arrow-ios-back-fill" width={20} height={20} />
          </IconButton>
        </Tooltip>
        <Avatar
          alt={mail.senderPartyId?.toString()}
          src="google.com"
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
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', display: 'block' }}
          >
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
            <Tooltip title={t('mail:tooltipTitles.reply')}>
              <IconButton>
                <Iconify icon="ic:round-reply" width={20} height={20} />
              </IconButton>
            </Tooltip>
          </>
        )}

        <Tooltip title={t('mail:tooltipTitles.moreOptions')}>
          <OptionButton options={labelOptions} />
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
