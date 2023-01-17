import { useSnackbar } from 'notistack';
// form
import { useForm, Controller } from 'react-hook-form';
// @mui
import { Stack, Button, DialogActions, TextField, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { ColorSinglePicker } from '../../../components/color-utils';
import { LabelInput, Maybe } from '@tyro/api';
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

  const onSubmit = async (data: FormValuesProps) => {
    try {
      const newLabel: LabelInput = Object.assign(
        {
          name: data.labelName,
          colour: data.color
        }, 
        labelInfo?.id ? { id: labelInfo.id } : {}
      );

      createLabel(newLabel);
      if (labelInfo?.id) {
        enqueueSnackbar('Update success!');
      } else {
        enqueueSnackbar('Create success!');
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
          {...register("labelName", { required: true })}
          error={!!errors.labelName}
        />
        {errors.labelName?.type === 'required' && <Box role="alert" sx={{ color: 'red' }}>Label name is required</Box>}

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
    </form>
  );
}
