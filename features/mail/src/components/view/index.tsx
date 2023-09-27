import { Box, Divider, FormHelperText, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from '@tyro/i18n';
import { useParams } from 'react-router-dom';
import {
  RecipientType,
  Person,
  PartyPersonType,
  SearchType,
  SendMailRecipientInput,
} from '@tyro/api';
import { useMail, useReadMail, useSendMail } from '../../api/mails';
import { useMailEditor } from '../../hooks/use-mail-editor';
import { MailEditor } from '../editor';
import { MailEditorToolbar } from '../editor/toolbar';
import { ThreadItem } from './thread-item';
import { MailViewToolbar } from './toolbar';
import { getTextFromHtml } from '../../utils/html-formatters';
import { useMailSettings } from '../../store/mail-settings';

function getSearchTypeFromPartyType(
  partyType: PartyPersonType | undefined | null
): SearchType {
  switch (partyType) {
    case PartyPersonType.Student:
      return SearchType.Student;
    case PartyPersonType.Contact:
      return SearchType.Contact;
    default: // Staff
      return SearchType.Staff;
  }
}

export function MailView() {
  const { t } = useTranslation(['mail']);
  const { mailId } = useParams<{ mailId: string }>();
  const mailIdNumber = Number(mailId);
  const [replyError, setReplyError] = useState<string | null>(null);
  const { activeProfileId } = useMailSettings();

  const { data: mail } = useMail(mailIdNumber);
  const { mutate: markAsRead } = useReadMail();

  const editor = useMailEditor({
    placeholder: t('mail:replyPlaceholder'),
  });
  const { mutateAsync: sendMail, isLoading: isSending } = useSendMail();

  const onReply = () => {
    const body = editor?.getHTML() ?? '';

    if (getTextFromHtml(body).length === 0) {
      setReplyError(t('mail:replyEmptyError'));
      return;
    }

    const latestThread =
      mail?.threads[(mail?.threads?.length ?? 0) - 1] ?? mail;

    const recipients = [
      ...(latestThread?.senderPartyId !== activeProfileId
        ? [
            {
              recipientPartyId: latestThread?.senderPartyId ?? 0,
              recipientPartyType: getSearchTypeFromPartyType(
                latestThread?.sender.type
              ),
              recipientType: RecipientType.To,
            },
          ]
        : []),
      ...(
        latestThread?.recipients?.filter(
          ({ recipientType, recipientPartyId }) =>
            recipientType === RecipientType.To &&
            recipientPartyId !== activeProfileId
        ) ?? []
      ).map((recipient) => ({
        recipientPartyId: recipient.recipientPartyId,
        recipientPartyType: getSearchTypeFromPartyType(
          recipient.recipient.type
        ),
        recipientType: RecipientType.To,
      })),
    ];

    sendMail(
      {
        threadId: mail?.threadId ?? 0,
        subject: mail?.subject ?? '',
        recipients,
        body,
        canReply: true,
      },
      {
        onSuccess: () => {
          editor?.commands.clearContent();
        },
      }
    );
  };

  useEffect(() => {
    const threadMissingReadOn =
      mail?.id &&
      (!mail?.readOn || mail?.threads?.some((thread) => !thread.readOn));
    if (threadMissingReadOn) {
      markAsRead({
        mailId: mail.id,
        threadId: mail.threadId,
      });
    }
  }, [mail?.readOn, mail?.threads]);

  return (
    <Stack flexGrow={1} overflow="hidden">
      <MailViewToolbar mail={mail} />
      <Divider />
      <Stack
        sx={{
          overflowY: 'auto',
          justifyContent: 'space-between',
          flexGrow: 1,
        }}
      >
        <Box>
          {mail && <ThreadItem thread={mail} />}
          {mail?.threads.map((thread) => (
            <ThreadItem isReply key={thread.id} thread={thread} />
          ))}
        </Box>
        {mail?.canReply && (
          <Stack>
            <MailEditor
              editor={editor}
              sx={{
                backgroundColor: 'background.neutral',
                border: '1px solid',
                borderColor: 'divider',
                minHeight: 180,
                borderRadius: 1.5,
                mt: 4,
                mb: 0,
                p: 2,
              }}
            />
            {replyError && (
              <FormHelperText error sx={{ mt: 1, px: 3 }}>
                {replyError}
              </FormHelperText>
            )}
            <MailEditorToolbar
              editor={editor}
              onSend={onReply}
              isSending={isSending}
            />
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}
