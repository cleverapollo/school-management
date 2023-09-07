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
    <Box sx={{ py: 2, px: 3, display: 'flex', alignItems: 'center' }}>
      <Button variant="contained" onClick={onSend}>
        {t('common:actions.send')}
      </Button>

      <Stack direction="row" spacing={1} sx={{ ml: 1 }}>
        <MailEditorTextPopover editor={editor} />
        {/* Look at adding back in with attachments in v2 */}
        {/* <IconButton size="small" sx={{ ml: 2, mr: 1 }}>
              <AddPhotoIcon />
            </IconButton>

            <IconButton size="small">
              <AttachmentIcon />
            </IconButton> */}
      </Stack>
    </Box>
  );
}
