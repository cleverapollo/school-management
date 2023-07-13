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
  open: NonNullable<ReturnTypeOfUseBlockList>[number] | undefined;
  blockForCreateRotation?:
    | NonNullable<ReturnTypeOfUseBlockList>[number]
    | undefined;
  onClose: () => void;
};

export const CreateBlockRotationModal = ({
  open,
  blockForCreateRotation,
  onClose,
}: CreateBlockRotationViewProps) => {
  const { t } = useTranslation(['common', 'classListManager']);

  const {
    mutate: createOrUpdateBlockRotationMutation,
    isLoading: isSubmitting,
    isSuccess: isSubmitSuccessful,
  } = useCreateOrUpdateBlockRotation(
    Boolean(blockForCreateRotation?.isRotation)
  );

  const { resolver, rules } = useFormValidator<CreateBlockRotationFormState>();

  const { control, handleSubmit, reset } =
    useForm<CreateBlockRotationFormState>({
      resolver: resolver({
        rotationName: rules.required(),
        iterations: {
          startDate: [rules.required(), rules.date()],
          endDate: [
            rules.required(),
            rules.date(),
            rules.afterStartDate(`iterations.0.startDate`),
          ],
          iteration: rules.minLength(2),
        },
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

  useEffect(() => {
    if (blockForCreateRotation) {
      const defaultFormStateValues: Partial<CreateBlockRotationFormState> = {
        blockId: blockForCreateRotation?.blockId,
        rotationName: '',
        iterations: blockForCreateRotation?.rotations?.map((item) => ({
          startDate: item.startDate ? dayjs(item.startDate) : undefined,
          endDate: item.endDate ? dayjs(item.endDate) : undefined,
          iteration: item.iteration,
        })),
      };
      reset({
        ...defaultFormStateValues,
        ...blockForCreateRotation,
      });
    }
  }, [blockForCreateRotation]);

  return (
    <Dialog
      open={!!open}
      onClose={handleClose}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {blockForCreateRotation?.isRotation
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
                  backgroundColor: 'background.neutral',
                  border: 1,
                  borderColor: 'slate.200',
                  p: 1,
                  alignItems: 'center',
                }}
              >
                <Typography
                  sx={{ width: '50%' }}
                  variant="body1"
                  color="text.secondary"
                >
                  {t('classListManager:rotationX', { number: index + 1 })}
                </Typography>
                <Divider
                  orientation="vertical"
                  sx={{
                    height: 40,
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
                {index > 1 && (
                  <Stack
                    sx={{
                      width: 50,
                      justifyContent: 'flex-end',
                    }}
                    direction="row"
                  >
                    <Divider
                      orientation="vertical"
                      sx={{
                        height: 40,
                      }}
                    />
                    <Tooltip
                      title={
                        index > 1 ? t('classListManager:createRotation') : ''
                      }
                    >
                      <span>
                        <IconButton
                          aria-label={t('classListManager:deleteRotation')}
                          onClick={() => remove(index)}
                          color="default"
                        >
                          <TrashIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Stack>
                )}
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
