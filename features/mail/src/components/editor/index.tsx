import { Box } from '@mui/material';
import { Editor, EditorContent } from '@tiptap/react';

interface MailEditorProps {
  editor: Editor | null;
}

export function MailEditor({ editor }: MailEditorProps) {
  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        my: 2,
        mx: 3,

        '.tiptap': {
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,

          '&:focus': {
            outline: 'none',
          },

          '& p': {
            margin: 0,
          },
        },
      }}
      component={EditorContent}
      editor={editor}
    />
  );
}
