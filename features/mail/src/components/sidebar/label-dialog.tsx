import {
  RHFTextField,
  useFormValidator,
  RHFColorPicker,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@tyro/core';
import { useForm } from 'react-hook-form';
import { Stack, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Colour, LabelInput } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useEffect } from 'react';
import { ReturnTypeFromUseLabels, useCreateLabel } from '../../api/labels';

type FormValuesProps = {
  name: string;
  colour: Colour;
};

type LabelFormProps = {
  open: boolean;
  labelInfo: Partial<ReturnTypeFromUseLabels> | null;
  onClose: () => void;
};

export function LabelDialog({ open, labelInfo, onClose }: LabelFormProps) {
  const { t } = useTranslation(['mail', 'common']);
  const { resolver, rules } = useFormValidator<FormValuesProps>();
  const isEdit = Boolean(labelInfo?.id);

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValuesProps>({
    resolver: resolver({
      name: rules.required(),
    }),
  });

  const { mutateAsync: createLabel } = useCreateLabel();

  const onSubmit = handleSubmit(async ({ name, colour }) => {
    const newLabel: LabelInput = {
      ...(labelInfo?.originalId && { id: labelInfo.originalId }),
      name,
      colour,
    };

    await createLabel(newLabel);
    onClose();
  });

  useEffect(() => {
    if (labelInfo) {
      reset({
        name: labelInfo?.name ?? '',
        colour: labelInfo?.colour ?? Colour.Red,
      });
    }
  }, [labelInfo]);

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={onSubmit}>
        <DialogTitle onClose={onClose}>
          {isEdit ? t('mail:editLabel') : t('mail:newLabel')}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3}>
            <RHFTextField controlProps={{ name: 'name', control }} />
            <RHFColorPicker controlProps={{ name: 'colour', control }} />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="soft" color="inherit" onClick={onClose}>
            {t('common:actions.cancel')}
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            {isEdit ? t('common:actions.save') : t('common:actions.add')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
