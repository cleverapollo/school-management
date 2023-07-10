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
} from '@mui/material';
import { RHFDatePicker, RHFTextField, useFormValidator } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import {
  AttendanceCodeType,
  Core_EnableBlockRotationInput,
  Core_EnableBlockRotationIterationInput,
  SaveAttendanceCodeInput,
  TuslaCode,
} from '@tyro/api';
import React, { useEffect, useState } from 'react';
import { AddIcon, CloseIcon, InfoCircleIcon, TrashIcon } from '@tyro/icons';
import dayjs from 'dayjs';
import {
  ReturnTypeOfUseBlockList,
  useCreateOrUpdateBlockRotation,
} from '../../api/blocks';

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
  initialCreateBlockRotationState?:
    | NonNullable<ReturnTypeOfUseBlockList>[number]
    | undefined;
  onClose: () => void;
};

export const CreateBlockRotationModal = ({
  initialCreateBlockRotationState,
  onClose,
}: CreateBlockRotationViewProps) => {
  const { t } = useTranslation(['common', 'attendance']);

  const [iterations, setIterations] = useState<BlockRotationIterationInput[]>(
    []
  );
  const {
    mutate: createOrUpdateBlockRotationMutation,
    isLoading: isSubmitting,
    isSuccess: isSubmitSuccessful,
  } = useCreateOrUpdateBlockRotation();

  const { resolver, rules } = useFormValidator<CreateBlockRotationFormState>();

  const defaultFormStateValues: Partial<CreateBlockRotationFormState> = {
    blockId: initialCreateBlockRotationState?.blockId,
    rotationName: 'Test Name',
    iterations: initialCreateBlockRotationState?.rotations?.map((item) => ({
      startDate: item.startDate ? dayjs(item.startDate) : undefined,
      endDate: item.endDate ? dayjs(item.endDate) : undefined,
      iteration: item.iteration,
    })),
  };

  // const attendanceCodesWithoutSelf = attendanceCodes.filter(
  //   (attendanceCode) =>
  //     attendanceCode?.code !== initialAttendanceCodeState?.code
  // );

  const { control, handleSubmit, reset, watch, setValue } =
    useForm<CreateBlockRotationFormState>({
      resolver: resolver({}),
      defaultValues: defaultFormStateValues,
      mode: 'onChange',
    });

  const onSubmit = ({ ...restData }: CreateBlockRotationFormState) => {
    console.log('restData', restData);
    const iterations = restData.iterations.map((item) => ({
      startDate: item.startDate?.format('YYYY-MM-DD'),
      endDate: dayjs(item.endDate)?.format('YYYY-MM-DD'),
    }));
    console.log('iterations', iterations);
    createOrUpdateBlockRotationMutation(
      {
        blockId: restData.blockId,
        iterations,
        rotationName: 'Test Name',
      },
      {
        onSuccess: onClose,
      }
    );
  };

  useEffect(() => {
    if (initialCreateBlockRotationState) {
      reset({
        ...defaultFormStateValues,
        ...initialCreateBlockRotationState,
      });
      setIterations(
        initialCreateBlockRotationState?.rotations?.map((item) => ({
          startDate: item.startDate ? dayjs(item.startDate) : undefined,
          endDate: item.endDate ? dayjs(item.endDate) : undefined,
          iteration: item.iteration,
        }))
      );
    }
  }, [initialCreateBlockRotationState]);

  useEffect(() => {
    reset();
  }, [isSubmitSuccessful]);

  const handleClose = () => {
    onClose();
    reset();
  };

  // const [iterations] = watch(['iterations']);

  // useEffect(() => {
  //   if (code) {
  //     setValue('description', t(`attendance:tuslaCodeDescription.${code}`));
  //   } else {
  //     setValue('description', undefined);
  //   }
  // }, [code]);

  const handleAddNewRotationIteration = () => {
    const newIterations = [...iterations];
    newIterations.push({
      startDate: undefined,
      endDate: undefined,
      iteration: newIterations.length + 1,
    });
    setIterations(newIterations);
  };

  const handleDeleteRotationIteration = (iteration: number) => {
    let newIterations = [...iterations];
    newIterations = newIterations.filter(
      (item) => item.iteration !== iteration
    );
    newIterations = newIterations.map((item, index) => ({
      ...item,
      iteration: index + 1,
    }));
    setIterations(newIterations);
  };

  return (
    <Dialog
      open={!!initialCreateBlockRotationState}
      onClose={handleClose}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {initialCreateBlockRotationState?.rotations &&
        initialCreateBlockRotationState?.rotations.length > 0
          ? 'Update Rotation'
          : 'Create Rotation'}
      </DialogTitle>
      <Stack direction="column" px={3}>
        <Typography variant="body2" color="text.secondary">
          You are making this block of classes a rotating block based on dates
          set here.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Add Students to the rotations after setting Rotation dates.
        </Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={3} p={3}>
          <Box sx={{ width: '50%' }}>
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
          </Box>

          {iterations?.map((rotation, index) => (
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
                Rotation {rotation?.iteration}
              </Typography>
              <Divider
                orientation="vertical"
                sx={{
                  height: 40,
                  borderRight: 1,
                  borderColor: 'slate.200',
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
                  borderRight: 1,
                  borderColor: 'slate.200',
                  opacity: rotation?.iteration > 2 ? 1 : 0,
                }}
              />
              <Tooltip title={rotation?.iteration > 2 ? 'Create Rotation' : ''}>
                <span>
                  <IconButton
                    sx={{ opacity: rotation?.iteration > 2 ? 1 : 0 }}
                    aria-label="Delete Rotation"
                    onClick={() =>
                      handleDeleteRotationIteration(rotation.iteration ?? 0)
                    }
                    disabled={rotation?.iteration <= 2}
                    color="default"
                  >
                    <TrashIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
          ))}
          <Box display="flex" alignItems="center">
            <Button
              variant="text"
              onClick={handleAddNewRotationIteration}
              startIcon={<AddIcon />}
            >
              Add Another Rotation
            </Button>
          </Box>
        </Stack>

        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={handleClose}>
            {t('common:actions.cancel')}
          </Button>

          <LoadingButton type="submit" variant="contained" loading={false}>
            {t('common:actions.save')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};
