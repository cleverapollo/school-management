import { Stack, Box, Typography, IconButton, Popover } from '@mui/material';
import { Avatar, useDisclosure } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { sanitize } from 'dompurify';
import { ChevronDownIcon } from '@tyro/icons';
import { useMemo, useRef } from 'react';
import { ReturnTypeUseMail } from '../../api/mails';

dayjs.extend(relativeTime);

interface ThreadItemProps {
  thread: Omit<ReturnTypeUseMail, 'threads'>;
  isReply?: boolean;
}

export function ThreadItem({
  thread: { sender, recipients, body, sentOn },
  isReply,
}: ThreadItemProps) {
  const { t } = useTranslation(['mail']);
  const anchorEl = useRef<HTMLButtonElement | null>(null);
  const { id, isOpen, onOpen, onClose } = useDisclosure();
  const senderName = `${sender?.firstName ?? ''} ${sender?.lastName ?? ''}`;
  const { recipientNames, ...recipientsByType } = useMemo(() => {
    const to: string[] = [];
    const bcc: string[] = [];

    recipients.forEach(({ recipient, recipientType }) => {
      if (recipientType === 'BCC') {
        bcc.push(`${recipient.firstName ?? ''} ${recipient.lastName ?? ''}`);
      } else {
        to.push(`${recipient.firstName ?? ''} ${recipient.lastName ?? ''}`);
      }
    });

    return {
      recipientNames: [
        to.length > 0
          ? t('mail:toRecipients', { recipients: to.join(', ') })
          : null,
        bcc.length > 0
          ? t('mail:bccRecipients', { recipients: bcc.join(', ') })
          : null,
      ]
        .filter(Boolean)
        .join(', '),
      to,
      bcc,
    };
  }, [recipients, t]);
  const sanitizedBody = useMemo(
    () => sanitize(body ?? '', { USE_PROFILES: { html: true } }),
    [body]
  );

  return (
    <Stack
      sx={{
        mb: 1.5,
        ...(isReply && {
          borderTop: '1px solid',
          borderColor: 'divider',
        }),
      }}
    >
      <Stack
        direction="row"
        py={2}
        px={2}
        spacing={1.5}
        justifyContent="space-between"
      >
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          overflow="hidden"
          flex={1}
        >
          <Avatar src={sender.avatarUrl} name={senderName} />
          <Stack flex={1} overflow="hidden">
            <Typography variant="subtitle2" component="h3">
              {senderName}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Typography variant="caption" color="text.secondary" noWrap>
                {recipientNames}
              </Typography>
              <IconButton
                ref={anchorEl}
                aria-label={t('mail:viewAllRecipients')}
                size="small"
                onClick={onOpen}
                sx={{ p: 0 }}
              >
                <ChevronDownIcon />
              </IconButton>
              <Popover
                id={id}
                open={isOpen}
                anchorEl={anchorEl.current}
                onClose={onClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                slotProps={{
                  paper: {
                    sx: {
                      maxWidth: 380,
                      maxHeight: 380,
                    },
                  },
                }}
              >
                <Stack
                  component="dl"
                  spacing={1}
                  sx={{
                    m: 0,
                    p: 2,
                  }}
                >
                  {recipientsByType.to.length > 0 && (
                    <Stack direction="row" spacing={1}>
                      <Typography variant="subtitle2" component="dt" width={30}>
                        {t('mail:to')}:
                      </Typography>
                      <Typography variant="body2" component="dd">
                        {recipientsByType.to.join(', ')}
                      </Typography>
                    </Stack>
                  )}
                  {recipientsByType.bcc.length > 0 && (
                    <Stack direction="row" spacing={1}>
                      <Typography variant="subtitle2" component="dt" width={30}>
                        {t('mail:bcc')}:
                      </Typography>
                      <Typography variant="body2" component="dd">
                        {recipientsByType.bcc.join(', ')}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </Popover>
            </Stack>
          </Stack>
        </Stack>
        <Typography
          variant="caption"
          color="text.secondary"
          lineHeight={22 / 12}
          noWrap
          flexShrink={0}
        >
          {dayjs(sentOn).format('lll')} ({dayjs(sentOn).fromNow()})
        </Typography>
      </Stack>
      <Box
        pl={8.5}
        pr={2}
        sx={{
          '& p': {
            margin: 0,
          },
        }}
        dangerouslySetInnerHTML={{ __html: sanitizedBody }}
      />
    </Stack>
  );
}
