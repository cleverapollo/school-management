/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { useToast } from '@tyro/core';
// form
import { useForm, Controller } from 'react-hook-form';
// @mui
import { Stack, Button, DialogActions, TextField, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { ColorOptions, LabelInput, Maybe } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { ColorSinglePicker } from '../../../../src/components/color-utils';
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

  const {
    reset,
    control,
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
  } = useForm<FormValuesProps>({
    defaultValues: getInitialValues(labelInfo),
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
        <TextField
          {...register('labelName', { required: true })}
          error={!!errors.labelName}
        />
        {errors.labelName?.type === 'required' && (
          <Box role="alert" sx={{ color: 'red' }}>
            {t('mail:errorMessages.labelRequired')}
          </Box>
        )}

        <Controller
          name="color"
          control={control}
          render={({ field }) => (
            <ColorSinglePicker
              value={field.value}
              onChange={field.onChange}
              colors={ColorOptions}
            />
          )}
        />
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
