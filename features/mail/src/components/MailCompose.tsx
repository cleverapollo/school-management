/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { useMemo, useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import {
  Box,
  Input,
  Portal,
  Button,
  Divider,
  Backdrop,
  IconButton,
  Typography,
} from '@mui/material';
// hooks
import { RecipientType } from '@tyro/api';
import { useResponsive } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
// components
import { Iconify } from '../../../../src/components/iconify';
import Editor from '../../../../src/components/editor';
import { useSendMail } from '../api/mails';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  right: 0,
  bottom: 0,
  zIndex: 1999,
  minHeight: 440,
  outline: 'none',
  display: 'flex',
  position: 'fixed',
  overflow: 'hidden',
  flexDirection: 'column',
  margin: theme.spacing(3),
  boxShadow: theme.customShadows.z20,
  borderRadius: Number(theme.shape.borderRadius) * 2,
  backgroundColor: theme.palette.background.paper,
}));

const InputStyle = styled(Input)(({ theme }) => ({
  padding: theme.spacing(0.5, 3),
  borderBottom: `solid 1px ${theme.palette.divider}`,
}));

// ----------------------------------------------------------------------

type Props = {
  isOpenCompose: boolean;
  onCloseCompose: VoidFunction;
};

export default function MailCompose({ isOpenCompose, onCloseCompose }: Props) {
  const { t } = useTranslation(['mail', 'common']);
  const [fullScreen, setFullScreen] = useState(false);

  const [message, setMessage] = useState('');

  const isDesktop = useResponsive('up', 'sm');

  const [recipientsString, setRecipientsString] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const filter = useMemo(
    () => ({
      body: message,
      canReply: true,
      // ToDo: refactor recipients with user names
      recipients: recipientsString.split(',').map((recipient) => ({
        recipientPartyId: +recipient,
        recipientType: RecipientType.To,
      })),
      subject,
    }),
    [message, recipientsString, subject]
  );

  const mutation = useSendMail(filter);

  const handleChangeMessage = (value: string) => {
    setMessage(value);
  };

  const handleExitFullScreen = () => {
    setFullScreen(false);
  };

  const handleEnterFullScreen = () => {
    setFullScreen(true);
  };

  const handleClose = () => {
    onCloseCompose();
    setFullScreen(false);
  };

  const onSend = () => {
    mutation.mutate();
    handleClose();
  };

  if (!isOpenCompose) {
    return null;
  }

  return (
    <Portal>
      <Backdrop open={fullScreen || !isDesktop} sx={{ zIndex: 1998 }} />
      <RootStyle
        sx={{
          ...(fullScreen && {
            top: 0,
            left: 0,
            zIndex: 1999,
            margin: 'auto',
            width: {
              xs: `calc(100% - 24px)`,
              md: `calc(100% - 80px)`,
            },
            height: {
              xs: `calc(100% - 24px)`,
              md: `calc(100% - 80px)`,
            },
          }),
        }}
      >
        <Box
          sx={{
            pl: 3,
            pr: 1,
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6">{t('mail:newMessage')}</Typography>
          <Box>
            <IconButton
              onClick={
                fullScreen ? handleExitFullScreen : handleEnterFullScreen
              }
            >
              <Iconify
                icon={fullScreen ? 'eva:collapse-fill' : 'eva:expand-fill'}
                width={20}
                height={20}
              />
            </IconButton>

            <IconButton onClick={handleClose}>
              <Iconify icon="eva:close-fill" width={20} height={20} />
            </IconButton>
          </Box>
        </Box>

        <Divider />

        <InputStyle
          disableUnderline
          placeholder={t('mail:placeholders.to')}
          value={recipientsString}
          onChange={({ target: { value } }) => setRecipientsString(value)}
        />

        <InputStyle
          disableUnderline
          placeholder={t('mail:placeholders.subject')}
          value={subject}
          onChange={({ target: { value } }) => setSubject(value)}
        />

        <Editor
          simple
          id="compose-mail"
          value={message}
          onChange={handleChangeMessage}
          placeholder={t('mail:placeholders.typeMessage')}
          sx={{
            borderColor: 'transparent',
            flexGrow: 1,
          }}
        />

        <Divider />

        <Box sx={{ py: 2, px: 3, display: 'flex', alignItems: 'center' }}>
          <Button variant="contained" onClick={onSend}>
            {t('common:actions.send')}
          </Button>

          <IconButton size="small" sx={{ ml: 2, mr: 1 }}>
            <Iconify
              icon="ic:round-add-photo-alternate"
              width={24}
              height={24}
            />
          </IconButton>

          <IconButton size="small">
            <Iconify icon="eva:attach-2-fill" width={24} height={24} />
          </IconButton>
        </Box>
      </RootStyle>
    </Portal>
  );
}