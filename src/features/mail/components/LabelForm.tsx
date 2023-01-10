import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, Button, DialogActions } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { ColorSinglePicker } from '../../../components/color-utils';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import { LabelInput, Maybe } from '@tyro/api';
import { useEffect, useState } from 'react';
import { useCreateLabel } from '../api/labels';

// ----------------------------------------------------------------------

const COLOR_OPTIONS = [
  '#00AB55', // theme.palette.primary.main,
  '#1890FF', // theme.palette.info.main,
  '#54D62C', // theme.palette.success.main,
  '#FFC107', // theme.palette.warning.main,
  '#FF4842', // theme.palette.error.main
  '#04297A', // theme.palette.info.darker
  '#7A0C2E', // theme.palette.error.darker
];

// ----------------------------------------------------------------------

interface FormValuesProps{
  labelName: string;
  color: string;
};

type LabelFormProps = {
  labelInfo: Maybe<LabelInput>;
  onCancel: VoidFunction;
};

const getInitialValues = (labelInfo: Maybe<LabelInput>) => {
  const defaultLabelInfo: FormValuesProps = {
    labelName: labelInfo?.name ?? '',
    color: labelInfo?.colour || COLOR_OPTIONS[0],
  }

  return defaultLabelInfo;
}

export default function LabelForm({ labelInfo, onCancel }: LabelFormProps) {
  const { enqueueSnackbar } = useSnackbar();

  const [labelData, setLabeData] = useState<Maybe<LabelInput>>(null);


  const EventSchema = Yup.object().shape({
    labelName: Yup.string().required('Label name is required'),
  });

  const methods = useForm({
    resolver: yupResolver(EventSchema),
    defaultValues: getInitialValues(labelInfo),
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const mutation = useCreateLabel(labelData ?? {} as LabelInput);
  useEffect(() => {
    if (labelData) {
      mutation.mutate();
      if (labelData.id) {
        enqueueSnackbar('Update success!');
      } else {
        enqueueSnackbar('Create success!');
      }
      onCancel();
      reset();
    }
  }, [labelData]);

  const onSubmit = async (data: FormValuesProps) => {
    try {
      const newLabel: LabelInput = Object.assign(
        {
          name: data.labelName,
          colour: data.color
        }, 
        labelInfo?.id ? { id: labelInfo.id } : {}
      );

      setLabeData(newLabel);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} sx={{ p: 3 }}>
        <RHFTextField name="labelName" label="Label name" />

        <Controller
          name="color"
          control={control}
          render={({ field }) => (
            <ColorSinglePicker
              value={field.value}
              onChange={field.onChange}
              colors={COLOR_OPTIONS}
            />
          )}
        />
      </Stack>

      <DialogActions>

        <Button variant="outlined" color="inherit" onClick={onCancel}>
          Cancel
        </Button>

        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          {labelInfo?.id ? 'Save' : 'Add'}
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
}
