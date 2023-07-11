import {
  Button,
  DialogTitle,
  Stack,
  DialogActions,
  Dialog,
  Typography,
  Box,
  Tooltip,
  IconButton,
  Divider,
  Grid,
} from '@mui/material';
import { RHFDatePicker, RHFTextField, useFormValidator } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useForm, useFieldArray } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { Core_EnableBlockRotationInput } from '@tyro/api';
import { useEffect } from 'react';
import { AddIcon, TrashIcon } from '@tyro/icons';
import dayjs from 'dayjs';
import { useCreateOrUpdateBlockRotation } from '../../api/blocks';

export type BlockRotationIterationInput = {
  startDate?: dayjs.Dayjs;
  endDate?: dayjs.Dayjs;
  iteration: number;
};

export type CreateBlockRotationFormState = Pick<
  Core_EnableBlockRotationInput,
  'blockId' | 'rotationName'
> & {
  iterations: BlockRotationIterationInput[];
};

export type CreateBlockRotationViewProps = {
  initialCreateBlockRotationState?: CreateBlockRotationFormState | undefined;
  onClose: () => void;
};

export const CreateBlockRotationModal = ({
  initialCreateBlockRotationState,
  onClose,
}: CreateBlockRotationViewProps) => {
  const { t } = useTranslation(['common', 'classListManager']);

  const {
    mutate: createOrUpdateBlockRotationMutation,
    isLoading: isSubmitting,
    isSuccess: isSubmitSuccessful,
  } = useCreateOrUpdateBlockRotation();

  const { resolver, rules } = useFormValidator<CreateBlockRotationFormState>();

  const { control, handleSubmit, reset } =
    useForm<CreateBlockRotationFormState>({
      resolver: resolver({
        rotationName: rules.required(),
        iterations: rules.minLength(2),
      }),
      defaultValues: {},
      mode: 'onChange',
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'iterations',
  });

  const onSubmit = ({
    blockId,
    rotationName,
    ...restData
  }: CreateBlockRotationFormState) => {
    const iterationsInput = restData.iterations.map((item) => ({
      startDate: item.startDate?.format('YYYY-MM-DD'),
      endDate: dayjs(item.endDate)?.format('YYYY-MM-DD'),
    }));
    createOrUpdateBlockRotationMutation(
      {
        blockId,
        iterations: iterationsInput,
        rotationName,
      },
      {
        onSuccess: onClose,
      }
    );
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  const handleAddNewRotationIteration = () => {
    append({ iteration: fields.length + 1 } as BlockRotationIterationInput);
  };

  const handleDeleteRotationIteration = (index: number) => {
    remove(index);
  };

  useEffect(() => {
    if (initialCreateBlockRotationState) {
      const defaultFormStateValues: Partial<CreateBlockRotationFormState> = {
        blockId: initialCreateBlockRotationState?.blockId,
        rotationName: '',
        iterations: initialCreateBlockRotationState?.iterations,
      };
      reset({
        ...defaultFormStateValues,
        ...initialCreateBlockRotationState,
      });
    }
  }, [initialCreateBlockRotationState]);

  useEffect(() => {
    reset();
  }, [isSubmitSuccessful]);

  return (
    <Dialog
      open={!!initialCreateBlockRotationState}
      onClose={handleClose}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {initialCreateBlockRotationState?.iterations &&
        initialCreateBlockRotationState?.iterations.length > 0
          ? t('classListManager:updateRotation')
          : t('classListManager:createRotation')}
      </DialogTitle>
      <Stack direction="column" px={3}>
        <Typography variant="body2" color="text.secondary">
          {t('classListManager:youAreMakingThisBlockRotating')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('classListManager:addStudentsToRotation')}
        </Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2} p={3}>
          <Grid item xs={6}>
            <RHFTextField<CreateBlockRotationFormState>
              label={t('common:name')}
              controlProps={{
                name: 'rotationName',
                control,
              }}
              textFieldProps={{
                fullWidth: true,
              }}
            />
          </Grid>

          {fields?.map((rotation, index) => (
            <Grid item xs={12} key={rotation.id}>
              <Stack
                direction="row"
                gap={1}
                sx={{
                  borderRadius: 1,
                  backgroundColor: 'slate.50',
                  border: 1,
                  borderColor: 'slate.200',
                  p: 1,
                  alignItems: 'center',
                  height: 50,
                }}
              >
                <Typography
                  sx={{ width: '50%' }}
                  variant="body1"
                  color="text.secondary"
                >
                  {t('classListManager:rotation')} {index + 1}
                </Typography>
                <Divider
                  orientation="vertical"
                  sx={{
                    height: 40,
                    color: 'slate.200',
                  }}
                />
                <RHFDatePicker<CreateBlockRotationFormState>
                  label={t('common:startDate')}
                  inputProps={{
                    fullWidth: true,
                    size: 'small',
                    sx: { backgroundColor: 'white' },
                  }}
                  controlProps={{
                    name: `iterations.${index}.startDate`,
                    control,
                  }}
                />
                <RHFDatePicker<CreateBlockRotationFormState>
                  label={t('common:endDate')}
                  inputProps={{
                    fullWidth: true,
                    size: 'small',
                    sx: { backgroundColor: 'white' },
                  }}
                  controlProps={{
                    name: `iterations.${index}.endDate`,
                    control,
                  }}
                />
                <Divider
                  orientation="vertical"
                  sx={{
                    height: 40,
                    color: 'slate.200',
                    opacity: index > 1 ? 1 : 0,
                  }}
                />
                <Tooltip
                  title={index > 1 ? t('classListManager:createRotation') : ''}
                >
                  <span>
                    <IconButton
                      sx={{ opacity: index > 1 ? 1 : 0 }}
                      aria-label={t('classListManager:deleteRotation')}
                      onClick={() => handleDeleteRotationIteration(index)}
                      disabled={index <= 1}
                      color="default"
                    >
                      <TrashIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Stack>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Box display="flex" alignItems="center">
              <Button
                variant="text"
                onClick={handleAddNewRotationIteration}
                startIcon={<AddIcon />}
              >
                {t('classListManager:addAnotherRotation')}
              </Button>
            </Box>
          </Grid>
        </Grid>

        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={handleClose}>
            {t('common:actions.cancel')}
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            {t('common:actions.save')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};
