import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { Avatar, usePreferredNameLayout } from '@tyro/core';
import { ReturnTypeFromUseSentSms } from '../api/sent-sms';
import { SmsMessageField } from './common/sms-message-field';

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
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{t('sms:smsDetails')}</DialogTitle>

      <Stack
        gap={2}
        sx={{
          px: 3,
        }}
      >
        <Stack direction="row" justifyContent="space-between" component="dl">
          <Stack>
            <Typography
              component="dt"
              variant="subtitle1"
              color="text.secondary"
            >
              {t('sms:sentBy')}
            </Typography>
            <Box display="flex" alignItems="center">
              <Avatar
                src={data?.sender?.avatarUrl}
                name={senderName}
                sx={{
                  mr: 1,
                  width: 28,
                  height: 28,
                  fontSize: '0.75rem',
                }}
              />
              <Typography component="dd" variant="body1">
                {senderName}
              </Typography>
            </Box>
          </Stack>
          <Stack>
            <Typography
              component="dt"
              variant="subtitle1"
              color="text.secondary"
              sx={{ textAlign: 'right' }}
            >
              {t('sms:totalCost')}
            </Typography>
            <Typography
              component="dd"
              variant="body1"
              sx={{ textAlign: 'right' }}
            >
              €{data?.totalCost}
            </Typography>
          </Stack>
        </Stack>

        <SmsMessageField
          value={data?.body}
          variant="filled"
          InputProps={{
            readOnly: true,
          }}
        />
      </Stack>

      <TableContainer>
        <Table
          size="small"
          sx={{
            mt: 1,
            '& td:first-of-type, & th:first-of-type': {
              pl: 3,
            },
            '& td:last-of-type, & th:last-of-type': {
              pr: 3,
            },
            '& th': {
              background: 'transparent',
              color: 'text.primary',
              fontWeight: 700,
              py: 2,
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>{t('sms:recipient')}</TableCell>
              <TableCell>{t('common:status')}</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data?.recipients.map(
              ({ id, recipient, recipientPhoneNumber, smsSuccess }) => {
                const name = displayName(recipient);

                return (
                  <TableRow key={JSON.stringify(id)}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        {name ? (
                          <>
                            <Avatar
                              src={recipient?.avatarUrl}
                              name={name || recipientPhoneNumber}
                              sx={{
                                mr: 1.5,
                              }}
                            />
                            <Stack>
                              <Typography component="span" variant="subtitle2">
                                {name}
                              </Typography>
                              <Typography
                                component="span"
                                variant="body2"
                                sx={{ color: 'text.secondary' }}
                              >
                                {recipientPhoneNumber}
                              </Typography>
                            </Stack>
                          </>
                        ) : (
                          <Typography variant="subtitle2">
                            {recipientPhoneNumber}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        color: smsSuccess ? 'success.main' : 'error.main',
                      }}
                    >
                      {smsSuccess ? t('sms:sent') : t('sms:failed')}
                    </TableCell>
                  </TableRow>
                );
              }
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          {t('common:actions.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
