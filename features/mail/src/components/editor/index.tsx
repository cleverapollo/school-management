import { Box } from '@mui/material';
import { BoxProps } from '@mui/system';
import { Editor, EditorContent } from '@tiptap/react';

interface MailEditorProps {
  editor: Editor | null;
  sx?: BoxProps['sx'];
}

export function MailEditor({ editor, sx }: MailEditorProps) {
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
            '&.is-editor-empty:first-child::before': {
              color: 'text.disabled',
              content: 'attr(data-placeholder)',
              float: 'left',
              height: 0,
              pointerEvents: 'none',
            },
          },
        },
        ...sx,
      }}
      component={EditorContent}
      editor={editor}
    />
  );
}
