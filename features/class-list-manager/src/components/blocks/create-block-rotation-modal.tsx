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
import { RHFDatePicker, RHFTextField } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { Core_EnableBlockRotationInput } from '@tyro/api';
import { useEffect, useState } from 'react';
import { AddIcon, TrashIcon } from '@tyro/icons';
import dayjs from 'dayjs';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
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
  const { t } = useTranslation(['common', 'classListManager']);

  const [iterations, setIterations] = useState<BlockRotationIterationInput[]>(
    []
  );
  const {
    mutate: createOrUpdateBlockRotationMutation,
    isLoading: isSubmitting,
    isSuccess: isSubmitSuccessful,
  } = useCreateOrUpdateBlockRotation();

  const defaultFormStateValues: Partial<CreateBlockRotationFormState> = {
    blockId: initialCreateBlockRotationState?.blockId,
    rotationName: '',
    iterations: initialCreateBlockRotationState?.rotations?.map((item) => ({
      startDate: item.startDate ? dayjs(item.startDate) : undefined,
      endDate: item.endDate ? dayjs(item.endDate) : undefined,
      iteration: item.iteration,
    })),
  };

  const schema = yup.object().shape<any>({
    rotationName: yup.string().required(),
    iterations: yup.array().of(
      yup.object().shape({
        startDate: yup.date().typeError('').required(''),
        endDate: yup.date().typeError('').required(''),
      })
    ),
  });

  const { control, handleSubmit, reset } =
    useForm<CreateBlockRotationFormState>({
      resolver: yupResolver(schema),
      defaultValues: defaultFormStateValues,
      mode: 'onChange',
    });

  const onSubmit = ({
    blockId,
    rotationName,
    ...restData
  }: CreateBlockRotationFormState) => {
    console.log('restData', restData);
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

  const handleAddNewRotationIteration = () => {
    const newIterations = [...iterations];
    newIterations.push({
      startDate: undefined,
      endDate: undefined,
      iteration: iterations.length + 1,
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
      <DialogTitle sx={{ textTransform: 'capitalize' }}>
        {initialCreateBlockRotationState?.rotations &&
        initialCreateBlockRotationState?.rotations.length > 0
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
                {t('classListManager:rotation')} {rotation?.iteration}
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
              <Tooltip
                sx={{ textTransform: 'capitalize' }}
                title={
                  rotation?.iteration > 2
                    ? t('classListManager:createRotation')
                    : ''
                }
              >
                <span>
                  <IconButton
                    sx={{ opacity: rotation?.iteration > 2 ? 1 : 0 }}
                    aria-label={t('classListManager:deleteRotation')}
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
              {t('classListManager:addAnotherRotation')}
            </Button>
          </Box>
        </Stack>

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
