import { FormControlLabel, Stack, Switch } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Editor } from '@tiptap/react';
import { useTranslation } from '@tyro/i18n';
import { MailEditorTextPopover } from './text-popover';

interface MailEditorToolbarProps {
  editor: Editor | null;
  onSend: () => void;
  isSending: boolean;
  canReplyValue?: boolean;
  onCanReplyChange?: (canReply: boolean) => void;
}

export function MailEditorToolbar({
  editor,
  onSend,
  isSending,
  canReplyValue,
  onCanReplyChange,
}: MailEditorToolbarProps) {
  const { t } = useTranslation(['common', 'mail']);

  return (
    <Stack
      direction="row"
      py={2}
      pl={3}
      pr={1}
      alignItems="center"
      justifyContent="space-between"
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <LoadingButton variant="contained" onClick={onSend} loading={isSending}>
          {t('common:actions.send')}
        </LoadingButton>

        <MailEditorTextPopover editor={editor} />
        {/* Look at adding back in with attachments in v2 */}
        {/* <IconButton size="small" sx={{ ml: 2, mr: 1 }}>
                  <AddPhotoIcon />
                </IconButton>
  
                <IconButton size="small">
                  <AttachmentIcon />
                </IconButton> */}
      </Stack>
      {onCanReplyChange && (
        <FormControlLabel
          control={<Switch value={canReplyValue} />}
          label={t('mail:canReply')}
          checked={canReplyValue}
          onChange={(_e, checked) => onCanReplyChange(checked)}
        />
      )}
    </Stack>
  );
}
