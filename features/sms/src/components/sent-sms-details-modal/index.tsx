import { Box, Stack, Typography } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import {
  Avatar,
  usePreferredNameLayout,
  Dialog,
  DialogActions,
  DialogTitle,
} from '@tyro/core';
import { ReturnTypeFromUseSentSms } from '../../api/sent-sms';
import { SmsMessageField } from '../common/sms-message-field';
import { SmsSummary } from '../common/sms-summary';
import { ReadOnlyRecipientList } from './recipient-list';

interface SentSmsDetailsModalProps {
  data: ReturnTypeFromUseSentSms;
  isOpen: boolean;
  onClose: () => void;
}

export function SentSmsDetailsModal({
  data,
  isOpen,
  onClose,
}: SentSmsDetailsModalProps) {
  const { t } = useTranslation(['common', 'sms']);
  const { displayName } = usePreferredNameLayout();
  const senderName = displayName(data?.sender);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      scroll="paper"
      fullWidth
      maxWidth="md"
    >
      <Stack direction="row">
        <Box sx={{ flex: 1.2 }}>
          <DialogTitle>{t('sms:sendSms')}</DialogTitle>
          <Stack spacing={3} sx={{ p: 3, pt: 0 }}>
            <SmsMessageField
              label={t('sms:message')}
              value={data?.body}
              InputProps={{
                readOnly: true,
              }}
            />
          </Stack>
        </Box>
        <ReadOnlyRecipientList
          onClose={onClose}
          recipients={data?.recipients}
        />
      </Stack>

      <DialogActions
        sx={{
          borderTopColor: 'slate.200',
          borderTopWidth: 1,
          borderTopStyle: 'solid',
          p: '0 !important',
        }}
      >
        <Stack direction="row" sx={{ py: 1.5, flex: 1 }}>
          <Box sx={{ flex: 1.2, display: 'flex', alignItems: 'center' }}>
            <SmsSummary
              sx={{ flex: 1, px: 3 }}
              message={data?.body ?? ''}
              totalCost={data?.totalCost ?? 0}
            />
          </Box>
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <Stack sx={{ px: 3 }}>
              <Typography
                component="h3"
                variant="body2"
                sx={{ color: 'text.secondary' }}
              >
                {t('sms:sentBy')}:
              </Typography>
              <Stack direction="row" alignItems="center">
                <Avatar
                  src={data?.sender?.avatarUrl}
                  name={senderName}
                  sx={{
                    my: 1,
                    mr: 1.5,
                    width: 46,
                    height: 46,
                  }}
                />
                <Typography component="span" variant="subtitle1">
                  {senderName}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
