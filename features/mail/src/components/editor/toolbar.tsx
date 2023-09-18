import { Button, FormControlLabel, Stack, Switch } from '@mui/material';
import { Editor } from '@tiptap/react';
import { useTranslation } from '@tyro/i18n';
import { MailEditorTextPopover } from './text-popover';

interface MailEditorToolbarProps {
  editor: Editor | null;
  onSend: () => void;
  onCanReplyChange?: (canReply: boolean) => void;
}

export function MailEditorToolbar({
  editor,
  onSend,
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
        <Button variant="contained" onClick={onSend}>
          {t('common:actions.send')}
        </Button>

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
          control={<Switch defaultChecked />}
          label={t('mail:canReply')}
          onChange={(_e, checked) => onCanReplyChange(checked)}
        />
      )}
    </Stack>
  );
}
