import { Box, Button, IconButton, Stack } from '@mui/material';
import { Editor } from '@tiptap/react';
import { useTranslation } from '@tyro/i18n';
import { TextIcon } from '@tyro/icons';
import { MailEditorTextPopover } from './text-popover';

interface MailEditorToolbarProps {
  editor: Editor | null;
  onSend: () => void;
}

export function MailEditorToolbar({ editor, onSend }: MailEditorToolbarProps) {
  const { t } = useTranslation(['common']);

  return (
    <Stack py={2} px={3} direction="row" alignItems="center" spacing={1}>
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
  );
}
