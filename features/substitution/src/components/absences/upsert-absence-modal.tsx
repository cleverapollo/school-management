import { useEffect } from 'react';
import { LoadingButton } from '@mui/lab';
import { useFieldArray, useForm } from 'react-hook-form';
import {
  Box,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  Stack,
  Tooltip,
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import {
  RHFMultiDatePicker,
  RHFSwitch,
  RHFTextField,
  RHFTimePicker,
  useFormValidator,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { StaffAutocomplete } from '@tyro/people';
import { AddIcon, TrashIcon } from '@tyro/icons';
import { Swm_UpsertStaffAbsenceDate } from '@tyro/api';
import {
  ReturnTypeFromUseStaffWorkAbsences,
  useSaveStaffAbsence,
} from '../../api/staff-work-absences';
import {
  AbsenceTypeAutoComplete,
  StaffWorkAbsenceTypeOption,
} from './absence-type-autocomplete';

export interface UpsertAbsenceModalProps {
  initialAbsenceData: Partial<ReturnTypeFromUseStaffWorkAbsences> | null;
  open: boolean;
  onClose: () => void;
}

type AbsenceDate = {
  dates: Array<Dayjs>;
  isFullDay: boolean;
  startTime?: Dayjs;
  endTime?: Dayjs;
};

interface UpsertAbsenceFormState {
  staff: NonNullable<ReturnTypeFromUseStaffWorkAbsences['staff']>;
  absenceType: StaffWorkAbsenceTypeOption;
  note: string;
  dates: Array<AbsenceDate>;
}

function mapAbsenceDates(datesToMap: Array<AbsenceDate>) {
  return datesToMap.reduce<Swm_UpsertStaffAbsenceDate[]>(
    (acc, { isFullDay, dates, startTime, endTime }) => {
      const individualDates: string[] = [];
      const partialAbsence = !isFullDay;
      const leavesAt =
        partialAbsence && startTime ? startTime.format('HH:mm') : undefined;
      const returnsAt =
        partialAbsence && endTime ? endTime.format('HH:mm') : undefined;

      dates
        .sort((a, b) => a.unix() - b.unix())
        .forEach((date, index) => {
          console.log();
          const previousDate = dates[index - 1];
          const nextDate = dates[index + 1];
          const isPreviousDateJustBefore = previousDate?.isSame(
            date.subtract(1, 'day')
          );
          const isNextDateJustAfter = nextDate?.isSame(date.add(1, 'day'));

          if (isPreviousDateJustBefore && !isNextDateJustAfter) {
            acc[acc.length - 1].continuousEndDate = date.format('YYYY-MM-DD');
          } else if (!isPreviousDateJustBefore && isNextDateJustAfter) {
            acc.push({
              continuousStartDate: date.format('YYYY-MM-DD'),
              continuousEndDate: date.format('YYYY-MM-DD'),
              partialAbsence,
              leavesAt,
              returnsAt,
            });
          } else if (!isPreviousDateJustBefore && !isNextDateJustAfter) {
            individualDates.push(date.format('YYYY-MM-DD'));
          }
        });

      if (individualDates.length > 0) {
        acc.push({
          individualDates,
          partialAbsence,
          leavesAt,
          returnsAt,
        });
      }

      return acc;
    },
    []
  );
}

const defaultFormValue = {
  dates: [
    {
      isFullDay: true,
      dates: [],
    },
  ],
};

export function UpsertAbsenceModal({
  initialAbsenceData,
  open,
  onClose,
}: UpsertAbsenceModalProps) {
  const { t } = useTranslation(['common', 'substitution']);
  const { resolver, rules } = useFormValidator<UpsertAbsenceFormState>();

  const { mutateAsync: saveStaffAbsence, isLoading } = useSaveStaffAbsence();

  const { control, handleSubmit, reset, watch } =
    useForm<UpsertAbsenceFormState>({
      resolver: resolver({
        staff: rules.required(),
        absenceType: rules.required(),
        note: rules.required(),
        dates: {
          dates: [rules.required(), rules.minLength(1)],
          startTime: rules.validate(
            (value, _throwError, formValues, fieldArrayIndex) => {
              const { isFullDay } = formValues.dates[Number(fieldArrayIndex!)];
              if (!isFullDay) {
                const requiredFunc = rules.required();
                const dateFunc = rules.date();

                requiredFunc(value);
                return dateFunc(value);
              }
            }
          ),
          endTime: rules.validate(
            (value, _throwError, formValues, fieldArrayIndex) => {
              const fieldArrayValues =
                formValues.dates[Number(fieldArrayIndex!)];
              if (!fieldArrayValues.isFullDay) {
                const requiredFunc = rules.required();
                const dateFunc = rules.date();
                const afterStartDateFunc = rules.afterStartDate(
                  // @ts-expect-error
                  'startTime',
                  t('common:errorMessages.afterStartTime')
                );

                requiredFunc(value);
                dateFunc(value);
                // @ts-expect-error
                return afterStartDateFunc(value, fieldArrayValues);
              }
            }
          ),
        },
      }),
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'dates',
  });

  const onSubmit = handleSubmit(({ staff, absenceType, note, dates }) => {
    const mappedDates = mapAbsenceDates(dates);

    return saveStaffAbsence(
      [
        {
          staffPartyId: staff.partyId,
          dates: mappedDates,
          absenceTypeId: absenceType.absenceTypeId,
          absenceReasonText: note,
          substitutionRequired: true,
        },
      ],
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  });

  useEffect(() => {
    if (initialAbsenceData) {
      reset({
        ...defaultFormValue,
      });
    }
  }, [initialAbsenceData]);

  const dates = watch('dates');

  return (
    <Dialog open={!!open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Absence</DialogTitle>
      <form onSubmit={onSubmit}>
        <Stack spacing={3} sx={{ p: 3 }}>
          <Stack direction="row" spacing={2}>
            <StaffAutocomplete<UpsertAbsenceFormState>
              controlProps={{
                name: 'staff',
                control,
              }}
            />
            <AbsenceTypeAutoComplete<UpsertAbsenceFormState>
              label={t('substitution:reason')}
              controlProps={{
                name: 'absenceType',
                control,
              }}
            />
          </Stack>

          <RHFTextField<UpsertAbsenceFormState>
            label={t('substitution:note')}
            controlProps={{
              name: 'note',
              control,
            }}
            textFieldProps={{
              multiline: true,
              rows: 3,
            }}
          />

          <Stack spacing={2}>
            {fields.map((field, index) => {
              const { isFullDay, startTime } = dates[index];
              return (
                <Stack
                  key={field.id}
                  sx={{
                    backgroundColor: 'background.neutral',
                    p: 2,
                    pt: 1,
                    borderRadius: 1,
                  }}
                  spacing={2}
                >
                  <Stack direction="row" justifyContent="space-between">
                    <RHFSwitch<UpsertAbsenceFormState>
                      label={t('common:allDay')}
                      switchProps={{ color: 'primary' }}
                      controlProps={{
                        name: `dates.${index}.isFullDay`,
                        control,
                      }}
                    />
                    {index > 0 && (
                      <Tooltip describeChild title={t('common:actions.remove')}>
                        <IconButton
                          aria-label={t('common:actions.remove')}
                          onClick={() => {
                            remove(index);
                          }}
                          color="primary"
                        >
                          <TrashIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Stack>

                  <RHFMultiDatePicker<UpsertAbsenceFormState, Dayjs>
                    label={t('common:dates')}
                    inputProps={{
                      fullWidth: true,
                    }}
                    controlProps={{
                      name: `dates.${index}.dates`,
                      control,
                    }}
                  />

                  <Collapse in={!isFullDay}>
                    <Stack direction="row" gap={1} width="100%">
                      <RHFTimePicker<UpsertAbsenceFormState>
                        label={t('common:startTime')}
                        inputProps={{
                          fullWidth: true,
                        }}
                        controlProps={{
                          name: `dates.${index}.startTime`,
                          control,
                        }}
                      />
                      <RHFTimePicker<UpsertAbsenceFormState>
                        label={t('common:endTime')}
                        timePickerProps={{
                          minTime: startTime ? dayjs(startTime) : undefined,
                        }}
                        inputProps={{
                          fullWidth: true,
                        }}
                        controlProps={{
                          name: `dates.${index}.endTime`,
                          control,
                        }}
                      />
                    </Stack>
                  </Collapse>
                </Stack>
              );
            })}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <Button
                variant="text"
                onClick={() => {
                  append({
                    isFullDay: true,
                    dates: [],
                  });
                }}
                startIcon={<AddIcon />}
              >
                {t('common:addDate')}
              </Button>
            </Box>
          </Stack>
        </Stack>

        <DialogActions>
          <Button variant="soft" color="inherit" onClick={onClose}>
            {t('common:actions.cancel')}
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isLoading}>
            {t('common:actions.save')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
