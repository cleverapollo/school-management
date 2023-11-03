import {
  Button,
  Stack,
  Typography,
  Box,
  Tooltip,
  IconButton,
  Divider,
  Grid,
  Alert,
  Collapse,
  AlertTitle,
} from '@mui/material';
import {
  RHFDatePicker,
  RHFTextField,
  useFormValidator,
  useDisclosure,
  DialogTitle,
  DialogActions,
  Dialog,
  DialogContent,
} from '@tyro/core';
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
  open: boolean;
  blockForCreateRotation?: NonNullable<ReturnTypeOfUseBlockList>[number] | null;
  onClose: () => void;
};

const getDefaultRotations = (amount: number) =>
  Array.from({ length: amount }, (_, index) => ({
    iteration: index + 1,
    startDate: undefined,
    endDate: undefined,
  }));

export const CreateBlockRotationModal = ({
  open,
  blockForCreateRotation,
  onClose,
}: CreateBlockRotationViewProps) => {
  const { t } = useTranslation(['common', 'classListManager']);
  const {
    isOpen: isTipOpen,
    onClose: onCloseTip,
    onOpen: onOpenTip,
  } = useDisclosure({
    defaultIsOpen: true,
  });

  const {
    mutate: createOrUpdateBlockRotationMutation,
    isLoading: isSubmitting,
  } = useCreateOrUpdateBlockRotation(
    Boolean(blockForCreateRotation?.isRotation)
  );

  const { resolver, rules } = useFormValidator<CreateBlockRotationFormState>();

  const { control, handleSubmit, reset } =
    useForm<CreateBlockRotationFormState>({
      resolver: resolver({
        rotationName: rules.required(),
        iterations: {
          startDate: rules.validate<
            CreateBlockRotationFormState['iterations'][number]['startDate']
          >((value, throwError, formValues, index) => {
            if (index !== undefined && index > 0) {
              if (!value) {
                throwError(t('common:errorMessages.required'));
              }

              const endDateFromPreviousIteration =
                formValues.iterations?.[index - 1].endDate;
              if (
                endDateFromPreviousIteration &&
                !dayjs(value).isSame(
                  dayjs(endDateFromPreviousIteration).add(1, 'day')
                )
              ) {
                throwError(
                  t(
                    'classListManager:errorMessages.startDateMustBeTheDayAfterThePreviousEndDate'
                  )
                );
              }
            }
          }),
          endDate: rules.validate<
            CreateBlockRotationFormState['iterations'][number]['endDate']
          >((value, throwError, formValues, index) => {
            if (index !== undefined) {
              if (index + 1 < formValues.iterations.length && !value) {
                throwError(t('common:errorMessages.required'));
              }

              const iterationsStartDate =
                formValues.iterations?.[index].startDate;
              if (
                value &&
                iterationsStartDate &&
                !dayjs(value).isAfter(dayjs(iterationsStartDate))
              ) {
                throwError(t('common:errorMessages.afterStartDate'));
              }
            }
          }),
        },
      }),
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
    onOpenTip();
    if (blockForCreateRotation) {
      const rotations = blockForCreateRotation?.rotations?.length
        ? blockForCreateRotation.rotations
        : getDefaultRotations(
            blockForCreateRotation.subjectGroupIds.length > 2
              ? blockForCreateRotation.subjectGroupIds.length
              : 2
          );
      const defaultFormStateValues = {
        blockId: blockForCreateRotation?.blockId,
        rotationName: '',
        iterations: rotations?.map(({ startDate, endDate, iteration }) => ({
          startDate: startDate ? dayjs(startDate) : undefined,
          endDate: endDate ? dayjs(endDate) : undefined,
          iteration,
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
      open={open}
      onClose={handleClose}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle onClose={onClose}>
          {blockForCreateRotation?.isRotation
            ? t('classListManager:updateRotation')
            : t('classListManager:createRotation')}
        </DialogTitle>

        <DialogContent>
          <Collapse in={isTipOpen}>
            {/* @ts-expect-error */}
            <Alert severity="primary" onClose={onCloseTip} sx={{ mb: 3 }}>
              <AlertTitle>
                {t('classListManager:classListManagerTip')}
              </AlertTitle>
              {t('classListManager:classListManagerTipDescription')}
            </Alert>
          </Collapse>

          <Typography variant="body2" color="text.secondary" mb={2}>
            {t('classListManager:youAreMakingThisBlockRotating')}
          </Typography>

          <RHFTextField
            label={t('common:name')}
            controlProps={{
              name: 'rotationName',
              control,
            }}
            textFieldProps={{
              fullWidth: true,
              sx: {
                maxWidth: 360,
              },
            }}
          />

          <Typography variant="body2" color="text.secondary" mt={3} mb={2}>
            {t('classListManager:youMustSetMinimumOfTwoRotations')}
          </Typography>

          <Grid container spacing={2}>
            {fields?.map((rotation, index) => (
              <Grid item xs={12} key={rotation.id}>
                <Stack
                  direction="row"
                  gap={1}
                  sx={{
                    borderRadius: 1,
                    backgroundColor: 'background.neutral',
                    border: 1,
                    borderColor: 'divider',
                    p: 1,
                    alignItems: 'flex-start',
                  }}
                >
                  <Typography
                    sx={{
                      width: 100,
                      my: 1.5,
                    }}
                    variant="body1"
                    color="text.secondary"
                  >
                    {t('classListManager:rotationX', { number: index + 1 })}
                  </Typography>
                  <Divider
                    orientation="vertical"
                    sx={{
                      height: 40,
                      my: 0.5,
                    }}
                  />
                  <RHFDatePicker
                    label={t('common:startDate')}
                    inputProps={{
                      size: 'small',
                      variant: 'white-filled',
                      sx: {
                        flex: 1,
                      },
                    }}
                    controlProps={{
                      name: `iterations.${index}.startDate`,
                      control,
                    }}
                  />
                  <RHFDatePicker
                    label={t('common:endDate')}
                    inputProps={{
                      size: 'small',
                      variant: 'white-filled',
                      sx: {
                        flex: 1,
                      },
                    }}
                    controlProps={{
                      name: `iterations.${index}.endDate`,
                      control,
                    }}
                  />

                  <Stack
                    sx={{
                      width: 50,
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                    }}
                    direction="row"
                  >
                    {index > 1 && (
                      <>
                        <Divider
                          orientation="vertical"
                          sx={{
                            height: 40,
                            my: 0.5,
                            mx: 1,
                          }}
                        />
                        <Tooltip title={t('classListManager:deleteRotation')}>
                          <IconButton
                            aria-label={t('classListManager:deleteRotation')}
                            onClick={() => remove(index)}
                          >
                            <TrashIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </Stack>
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
        </DialogContent>

        <DialogActions>
          <Button variant="soft" onClick={handleClose}>
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
