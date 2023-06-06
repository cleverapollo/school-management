import {
  useToast,
  RHFTextField,
  useFormValidator,
  RHFColorPicker,
} from '@tyro/core';
// form
import { useForm } from 'react-hook-form';
// @mui
import { Stack, Button, DialogActions } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { ColorOptions, LabelInput, Maybe } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useCreateLabel } from '../api/labels';

interface FormValuesProps {
  labelName: string;
  color: string;
}

type LabelFormProps = {
  labelInfo: Maybe<LabelInput>;
  onCancel: VoidFunction;
};

const getInitialValues = (labelInfo: Maybe<LabelInput>) => {
  const defaultLabelInfo: FormValuesProps = {
    labelName: labelInfo?.name ?? '',
    color: labelInfo?.colour || ColorOptions[0],
  };

  return defaultLabelInfo;
};

export default function LabelForm({ labelInfo, onCancel }: LabelFormProps) {
  const { t } = useTranslation(['mail', 'common']);
  const { toast } = useToast();

  const { resolver, rules } = useFormValidator<FormValuesProps>();

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValuesProps>({
    defaultValues: getInitialValues(labelInfo),
    resolver: resolver({
      labelName: rules.required(t('mail:errorMessages.labelRequired')),
    }),
  });

  const { mutate: createLabel } = useCreateLabel();

  const onSubmit = (data: FormValuesProps) => {
    try {
      const newLabel: LabelInput = {
        name: data.labelName,
        colour: data.color,
        ...(labelInfo?.id ? { id: labelInfo.id } : {}),
      };

      createLabel(newLabel);
      if (labelInfo?.id) {
        toast(t('common:snackbarMessages.updateSuccess'));
      } else {
        toast(t('common:snackbarMessages.createSuccess'));
      }
      onCancel();
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} sx={{ p: 3 }}>
        <RHFTextField controlProps={{ name: 'labelName', control }} />
        <RHFColorPicker controlProps={{ name: 'color', control }} />
      </Stack>

      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onCancel}>
          {t('common:actions.cancel')}
        </Button>

        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          {labelInfo?.id ? t('common:actions.save') : t('common:actions.add')}
        </LoadingButton>
      </DialogActions>
    </form>
  );
}
