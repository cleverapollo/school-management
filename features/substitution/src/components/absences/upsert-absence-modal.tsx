import React, { useEffect } from 'react';
import { LoadingButton } from '@mui/lab';
import { useFieldArray, useForm } from 'react-hook-form';
import {
  Box,
  Button,
  Collapse,
  DialogContent,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import {
  RHFCheckbox,
  RHFDatePicker,
  RHFMultiDatePicker,
  RHFSwitch,
  RHFTextField,
  RHFTimePicker,
  useFormValidator,
  Dialog,
  DialogActions,
  DialogTitle,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { RHFStaffAutocomplete, useStaffSubjectGroups } from '@tyro/people';
import { AddIcon, TrashIcon } from '@tyro/icons';
import {
  Person,
  StaffGroupMembershipRoles,
  Swm_UpsertStaffAbsenceDate,
} from '@tyro/api';
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
  staff: ReturnTypeFromUseStaffWorkAbsences['staff'];
  absenceType: StaffWorkAbsenceTypeOption | null;
  note: string;
  dates: Array<AbsenceDate>;
  isLongTermLeave: boolean;
  longTermLeaveGroups: Array<{
    groupId: number;
    coveringStaff: Person | undefined | null;
  }>;
  startDate: Dayjs;
  endDate: Dayjs;
}

const defaultFormValues = {
  staff: null,
  absenceType: null,
  note: '',
  dates: [
    {
      isFullDay: true,
      dates: [],
    },
  ],
  isLongTermLeave: false,
  longTermLeaveGroups: [],
  startDate: dayjs(),
  endDate: dayjs(),
};

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

export function UpsertAbsenceModal({
  initialAbsenceData,
  open,
  onClose,
}: UpsertAbsenceModalProps) {
  const { t } = useTranslation(['common', 'substitution']);
  const { resolver, rules } = useFormValidator<UpsertAbsenceFormState>();
  const isEditAbsence = !!initialAbsenceData?.absenceId;

  const { mutateAsync: saveStaffAbsence, isLoading } = useSaveStaffAbsence();

  const { control, handleSubmit, reset, watch } =
    useForm<UpsertAbsenceFormState>({
      resolver: resolver({
        staff: rules.required(),
        absenceType: rules.required(),
        startDate: rules.required(),
        endDate: [rules.required(), rules.afterStartDate('startDate')],
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
      defaultValues: defaultFormValues,
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'dates',
  });

  const { fields: ltlGroups, replace: replaceLtlGroups } = useFieldArray({
    control,
    name: 'longTermLeaveGroups',
  });

  const [selectedStaff, datesValue, isLongTermLeaveValue] = watch([
    'staff',
    'dates',
    'isLongTermLeave',
  ]);

  const { data: subjectGroupsData } = useStaffSubjectGroups(
    {
      partyIds: [selectedStaff?.partyId || 0],
    },
    {
      staffRoles: [
        StaffGroupMembershipRoles.Teacher,
        StaffGroupMembershipRoles.LongTermSubstitute,
      ],
    },
    !!selectedStaff
  );

  const closeModal = () => {
    reset(defaultFormValues);
    onClose();
  };

  const onSubmit = handleSubmit(
    ({
      staff,
      absenceType,
      note,
      dates,
      isLongTermLeave,
      longTermLeaveGroups,
      startDate,
      endDate,
    }) => {
      if (isLongTermLeave) {
        return saveStaffAbsence(
          [
            {
              staffAbsenceId: initialAbsenceData?.absenceId,
              staffPartyId: staff?.partyId ?? 0,
              dates: [
                {
                  continuousStartDate: startDate.format('YYYY-MM-DD'),
                  continuousEndDate: endDate.format('YYYY-MM-DD'),
                  partialAbsence: false,
                },
              ],
              absenceTypeId: absenceType?.absenceTypeId ?? 0,
              absenceReasonText: note,
              substitutionRequired: true,
              isLongTermLeave,
              longTermLeaveGroups: longTermLeaveGroups.map(
                ({ groupId, coveringStaff }) => ({
                  groupId,
                  coveringStaffId: coveringStaff?.partyId,
                })
              ),
            },
          ],
          {
            onSuccess: closeModal,
          }
        );
      }

      const mappedDates = mapAbsenceDates(dates);
      return saveStaffAbsence(
        [
          {
            staffAbsenceId: initialAbsenceData?.absenceId,
            staffPartyId: staff?.partyId ?? 0,
            dates: mappedDates,
            absenceTypeId: absenceType?.absenceTypeId ?? 0,
            absenceReasonText: note,
            substitutionRequired: true,
          },
        ],
        {
          onSuccess: closeModal,
        }
      );
    }
  );

  useEffect(() => {
    if (initialAbsenceData) {
      let dates: Partial<UpsertAbsenceFormState> = {
        dates: [
          {
            isFullDay: true,
            dates: [],
          },
        ],
      };

      if (initialAbsenceData?.dates) {
        dates = initialAbsenceData.isLongTermLeave
          ? {
              startDate: dayjs(initialAbsenceData.dates[0].continuousStartDate),
              endDate: dayjs(initialAbsenceData.dates[0].continuousEndDate),
            }
          : {
              dates: initialAbsenceData.dates.map(
                ({
                  partialAbsence,
                  individualDates,
                  continuousStartDate,
                  continuousEndDate,
                  leavesAt,
                  returnsAt,
                }) => {
                  let mappedDates =
                    individualDates?.map((date) => dayjs(date)) ?? [];

                  if (continuousStartDate && continuousEndDate) {
                    let currentDate = dayjs(continuousStartDate);
                    mappedDates = [];

                    while (currentDate.isSameOrBefore(continuousEndDate)) {
                      mappedDates.push(currentDate);
                      currentDate = currentDate.add(1, 'day');
                    }
                  }

                  return {
                    isFullDay: !partialAbsence,
                    dates: mappedDates,
                    startTime: leavesAt ? dayjs(leavesAt, 'HH:mm') : undefined,
                    endTime: returnsAt ? dayjs(returnsAt, 'HH:mm') : undefined,
                  };
                }
              ),
            };
      }

      reset({
        ...dates,
        staff: initialAbsenceData?.staff ?? undefined,
        absenceType: initialAbsenceData?.absenceType,
        note: initialAbsenceData?.absenceReasonText ?? '',
        isLongTermLeave: initialAbsenceData?.isLongTermLeave ?? false,
        longTermLeaveGroups:
          initialAbsenceData?.longTermLeaveGroups?.map(
            ({ groupId, coveringStaff }) => ({
              groupId,
              coveringStaff: coveringStaff?.person,
            })
          ) ?? [],
      });
    }
  }, [initialAbsenceData]);

  useEffect(() => {
    const initialDataOrderDoesNotMatch =
      subjectGroupsData &&
      initialAbsenceData?.longTermLeaveGroups &&
      subjectGroupsData.some(
        (group, index) =>
          group.partyId !==
          initialAbsenceData?.longTermLeaveGroups?.[index]?.groupId
      );
    const hasMarkedAsLongTermLeave =
      !initialAbsenceData?.longTermLeaveGroups &&
      isLongTermLeaveValue &&
      subjectGroupsData;

    if (initialDataOrderDoesNotMatch || hasMarkedAsLongTermLeave) {
      const updatedPartyIds = subjectGroupsData.map((group) => ({
        groupId: group.partyId,
        coveringStaff: null,
      }));

      replaceLtlGroups(updatedPartyIds);
    }
  }, [
    initialAbsenceData?.longTermLeaveGroups,
    subjectGroupsData,
    isLongTermLeaveValue,
  ]);

  return (
    <Dialog open={open} onClose={closeModal} fullWidth maxWidth="md">
      <DialogTitle onClose={closeModal}>
        {isEditAbsence
          ? t('substitution:editStaffAbsence')
          : t('substitution:createStaffAbsence')}
      </DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent sx={{ pt: 0.75 }}>
          <Stack spacing={3}>
            <Stack direction="row" spacing={2}>
              <RHFStaffAutocomplete
                controlProps={{
                  name: 'staff',
                  control,
                }}
                disabled={isEditAbsence}
              />
              <AbsenceTypeAutoComplete
                label={t('substitution:reason')}
                controlProps={{
                  name: 'absenceType',
                  control,
                }}
              />
            </Stack>
            <RHFCheckbox
              label={
                <Stack direction="row" gap={2}>
                  {t('substitution:applyLongTermLeave')}
                </Stack>
              }
              controlLabelProps={{
                sx: { mb: 2 },
              }}
              checkboxProps={{
                color: 'primary',
                disabled: isEditAbsence,
              }}
              controlProps={{ name: 'isLongTermLeave', control }}
            />
            <RHFTextField
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

            {!isLongTermLeaveValue && (
              <Stack spacing={2}>
                {fields.map((field, index) => {
                  const { isFullDay, startTime } = datesValue[index];
                  return (
                    <Stack
                      key={field.id}
                      sx={({ palette }) => ({
                        backgroundColor: 'background.neutral',
                        p: 2,
                        pt: 1,
                        borderRadius: 1,
                        border: `1px solid ${palette.divider}`,
                      })}
                      spacing={2}
                    >
                      <Stack direction="row" justifyContent="space-between">
                        <RHFSwitch<UpsertAbsenceFormState>
                          label={t('common:allDay')}
                          switchProps={{
                            color: 'primary',
                          }}
                          controlProps={{
                            name: `dates.${index}.isFullDay`,
                            control,
                          }}
                        />
                        {index > 0 && (
                          <Tooltip
                            describeChild
                            title={t('common:actions.remove')}
                          >
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

                      <RHFMultiDatePicker
                        label={t('common:dates')}
                        inputProps={{
                          fullWidth: true,
                          variant: 'white-filled',
                        }}
                        controlProps={{
                          name: `dates.${index}.dates`,
                          control,
                        }}
                      />

                      <Collapse in={!isFullDay}>
                        <Stack direction="row" gap={1} width="100%">
                          <RHFTimePicker
                            label={t('common:startTime')}
                            inputProps={{
                              fullWidth: true,
                              variant: 'white-filled',
                            }}
                            controlProps={{
                              name: `dates.${index}.startTime`,
                              control,
                            }}
                          />
                          <RHFTimePicker
                            label={t('common:endTime')}
                            timePickerProps={{
                              minTime: startTime ? dayjs(startTime) : undefined,
                            }}
                            inputProps={{
                              fullWidth: true,
                              variant: 'white-filled',
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
            )}

            {isLongTermLeaveValue &&
              subjectGroupsData &&
              subjectGroupsData.length > 0 && (
                <>
                  <Stack direction="row" spacing={2}>
                    <RHFDatePicker
                      label={t('common:startDate')}
                      inputProps={{ fullWidth: true }}
                      controlProps={{ name: 'startDate', control }}
                    />
                    <RHFDatePicker
                      label={t('common:endDate')}
                      inputProps={{ fullWidth: true }}
                      controlProps={{ name: 'endDate', control }}
                    />
                  </Stack>

                  <Stack
                    spacing={2}
                    sx={({ palette }) => ({
                      backgroundColor: 'background.neutral',
                      p: 2,
                      pt: 1,
                      borderRadius: 1,
                      border: `1px solid ${palette.divider}`,
                    })}
                  >
                    <Typography variant="subtitle1" color="text.secondary">
                      {t('substitution:selectCoverStaff')}
                    </Typography>
                    {ltlGroups?.map((field, index) => {
                      const subjectGroup = subjectGroupsData[index];
                      return (
                        <Stack
                          key={field.id}
                          direction="row"
                          justifyContent="space-evenly"
                        >
                          <Typography
                            variant="subtitle1"
                            color="text.secondary"
                            sx={{
                              width: '50%',
                              my: 1.5,
                            }}
                          >
                            {subjectGroup?.name}
                          </Typography>
                          <RHFStaffAutocomplete
                            key={field.id}
                            label={subjectGroup?.name}
                            sx={{
                              backgroundColor: 'white',
                            }}
                            controlProps={{
                              name: `longTermLeaveGroups.${index}.coveringStaff`,
                              control,
                            }}
                          />
                        </Stack>
                      );
                    })}
                  </Stack>
                </>
              )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="soft" color="inherit" onClick={closeModal}>
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
