import { Button, Stack, Typography } from '@mui/material';
import { Editor } from '@tiptap/react';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  useFormValidator,
  RHFTextField,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface EditLinkModalProps {
  editor: Editor | null;
  isOpen: boolean;
  onClose: () => void;
}

type FormValues = {
  href: string;
};

function getSelectedText(editor: Editor | null) {
  if (!editor) return '';
  const { from, to } = editor.state.selection;
  return editor.state.doc.textBetween(from, to);
}

export function EditLinkModal({ editor, isOpen, onClose }: EditLinkModalProps) {
  const { t } = useTranslation(['common', 'mail']);

  const { resolver, rules } = useFormValidator<FormValues>();

  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: resolver({
      href: [
        rules.required(),
        rules.validate<string>((value, throwError) => {
          if (!/^https?:\/\//.test(value)) {
            throwError(t('mail:validationMessages.invalidLink'));
          }
        }),
      ],
    }),
  });

  const onSave = handleSubmit(({ href }) => {
    if (!editor) return;
    const selectedText = getSelectedText(editor);

    if (selectedText) {
      editor.chain().focus().extendMarkRange('link').setLink({ href }).run();
    } else {
      editor.commands.insertContent(
        `<a href="${href}" target="_blank" rel="noopener noreferrer">${href}</a> `
      );
    }
    onClose();
  });

  useEffect(() => {
    if (editor && isOpen) {
      const link = (editor?.getAttributes('link').href ?? '') as string;
      reset({
        href: link,
      });
    }
  }, [editor, isOpen]);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle onClose={onClose}>{t('mail:editLink')}</DialogTitle>
      <DialogContent>
        <Stack sx={{ mt: 1 }} gap={2}>
          <RHFTextField
            controlProps={{ control, name: 'href' }}
            label={t('mail:urlToLinkTo')}
          />
          <Typography variant="caption" color="textSecondary">
            {t('mail:copyUrlRecommendation')}
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          {t('common:actions.cancel')}
        </Button>
        <Button variant="contained" onClick={onSave}>
          {t('common:actions.update')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
