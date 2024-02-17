import { ConfirmDialog, useToast } from '@tyro/core';
import { Options_SaveOptions, queryClient } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { Box, DialogContentText, Stack } from '@mui/material';
import { useSaveSubjectOptionsSetup } from '../../api/save-options-setup';
import { optionsKeys } from '../../api/keys';

export interface ConfirmOptionSaveDialogProps {
  changeInfo: {
    changes: Omit<Options_SaveOptions, 'validate'>;
    validations: string[];
  } | null;
  open: boolean;
  onClose: () => void;
  goBack: () => void;
}

export function ConfirmOptionSaveDialog({
  changeInfo,
  open,
  onClose,
  goBack,
}: ConfirmOptionSaveDialogProps) {
  const { t } = useTranslation(['common', 'subjectOptions']);
  const { mutateAsync: saveOptionsSetup } = useSaveSubjectOptionsSetup();
  const { toast } = useToast();

  const onSubmit = async () => {
    if (changeInfo) {
      await saveOptionsSetup(
        {
          ...changeInfo.changes,
          validate: false,
        },
        {
          onSuccess: async () => {
            await queryClient.invalidateQueries(optionsKeys.all);
            toast(t('common:snackbarMessages.updateSuccess'));
            goBack();
          },
        }
      );
    }
  };

  return (
    <ConfirmDialog
      isDelete
      open={open}
      title={t('subjectOptions:confirmSaveDialog.title')}
      content={
        <Stack spacing={2}>
          <DialogContentText>
            {t('subjectOptions:confirmSaveDialog.descriptionPreText')}
          </DialogContentText>
          <Box component="ul">
            {changeInfo?.validations.map((validation) => (
              <li key={validation}>{validation}</li>
            ))}
          </Box>
        </Stack>
      }
      confirmText={t('common:actions.continue')}
      onClose={onClose}
      onConfirm={onSubmit}
    />
  );
}
