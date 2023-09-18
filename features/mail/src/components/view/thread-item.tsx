import { Stack, Box, Typography } from '@mui/material';
import { Avatar, pxToRem } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { sanitize } from 'dompurify';
import { useMemo } from 'react';
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
  const senderName = `${sender?.firstName ?? ''} ${sender?.lastName ?? ''}`;
  const recipientNames = useMemo(() => {
    const to: string[] = [];
    const bcc: string[] = [];

    recipients.forEach(({ recipient, recipientType }) => {
      if (recipientType === 'BCC') {
        bcc.push(`${recipient.firstName ?? ''} ${recipient.lastName ?? ''}`);
      } else {
        to.push(`${recipient.firstName ?? ''} ${recipient.lastName ?? ''}`);
      }
    });

    return [
      to.length > 0
        ? t('mail:toRecipients', { recipients: to.join(', ') })
        : null,
      bcc.length > 0
        ? t('mail:bccRecipients', { recipients: bcc.join(', ') })
        : null,
    ]
      .filter(Boolean)
      .join(', ');
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
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar src={sender.avatarUrl} name={senderName} />
          <Stack>
            <Typography variant="subtitle2">{senderName}</Typography>
            <Typography variant="caption" color="text.secondary">
              {recipientNames}
            </Typography>
          </Stack>
        </Stack>
        <Typography
          variant="caption"
          color="text.secondary"
          lineHeight={22 / 12}
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
