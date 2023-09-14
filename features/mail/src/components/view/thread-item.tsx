import { Stack, Box, Typography } from '@mui/material';
import { Avatar } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { ReturnTypeUseMail } from '../../api/mails';

interface ThreadItemProps {
  thread: Omit<ReturnTypeUseMail, 'threads'>;
  isReply?: boolean;
}

export function ThreadItem({
  thread: { sender, recipients, body },
  isReply,
}: ThreadItemProps) {
  const { t } = useTranslation(['mail']);
  const senderName = `${sender?.firstName ?? ''} ${sender?.lastName ?? ''}`;
  const recipientNames = recipients.map(({ name }) => name).join(', ');

  return (
    <Stack
      sx={{
        ...(isReply && {
          borderTop: '1px solid',
          borderColor: 'divider',
        }),
      }}
    >
      <Stack direction="row" py={2} px={2} spacing={1.5} alignItems="center">
        <Avatar src={sender.avatarUrl} name={senderName} />
        <Stack>
          <Typography variant="subtitle2">{senderName}</Typography>
          <Typography variant="caption" color="text.secondary">
            {t('mail:toRecipients', { recipients: recipientNames })}
          </Typography>
        </Stack>
      </Stack>
      <Box
        pl={8.5}
        pr={2}
        sx={{
          '& p': {
            margin: 0,
          },
        }}
        dangerouslySetInnerHTML={{ __html: body ?? '' }}
      />
    </Stack>
  );
}
