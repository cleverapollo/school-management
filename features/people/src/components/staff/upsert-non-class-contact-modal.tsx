import { Button, Stack } from '@mui/material';
import {
  Dialog,
  DialogActions,
  DialogTitle,
  RHFSelect,
  RHFTextField,
  useFormValidator,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import React, { useEffect } from 'react';
import { Activity, Day, NonClassContactHoursFilter } from '@tyro/api';
import { ReturnTypeFromUseNonClassContactHours } from '../../api/staff/non-class-contact';
import { useUpsertNonClassContact } from '../../api/staff/upsert-non-class-contact';

export interface UpsertNonClassContactModalProps {
  onClose: () => void;
  initialState: Partial<ReturnTypeFromUseNonClassContactHours> | null;
  nonClassContactHoursQueryFilter: NonClassContactHoursFilter;
}

export type UpsertNonClassContactFormState = {
  activity: Activity;
  dayOfTheWeek: Day;
  hours: number;
  minutes: number;
};

export const UpsertNonClassContactModal = ({
  initialState,
  onClose,
  nonClassContactHoursQueryFilter,
}: UpsertNonClassContactModalProps) => {
  const { t } = useTranslation(['people', 'common']);
  const { resolver, rules } =
    useFormValidator<UpsertNonClassContactFormState>();

  const defaultFormStateValues: Partial<UpsertNonClassContactFormState> = {
    activity: initialState?.activity,
    dayOfTheWeek: initialState?.dayOfTheWeek || Day.Monday,
    hours: initialState?.hours || 0,
    minutes: initialState?.minutes || 0,
  };

  const { control, handleSubmit, reset } =
    useForm<UpsertNonClassContactFormState>({
      resolver: resolver({
        activity: rules.required(),
        dayOfTheWeek: rules.required(),
        hours: [rules.required(), rules.min(0)],
        minutes: [rules.required(), rules.max(59), rules.min(0)],
      }),
      defaultValues: defaultFormStateValues,
    });

  const { mutate, isLoading } = useUpsertNonClassContact(
    nonClassContactHoursQueryFilter
  );

  const handleClose = () => {
    onClose();
    reset();
  };

  useEffect(() => {
    reset(defaultFormStateValues);
  }, [initialState]);

  const onSubmit = handleSubmit((data) => {
    mutate(
      {
        ...initialState,
        academicNameSpaceId:
          initialState?.academicNameSpaceId ??
          nonClassContactHoursQueryFilter.academicNameSpaceId,
        staffPartyId: nonClassContactHoursQueryFilter.staffPartyId,
        activity: data.activity,
        dayOfTheWeek: data.dayOfTheWeek,
        hours: data.hours,
        minutes: data.minutes,
      },

      {
        onSuccess: () => {
          handleClose();
        },
      }
    );
  });

  return (
    <Dialog
      open={!!initialState}
      onClose={handleClose}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {initialState?.nonClassContactHoursId
          ? t('people:editNonClassContact')
          : t('people:createNonClassContact')}
      </DialogTitle>
      <form onSubmit={onSubmit}>
        <Stack spacing={3} sx={{ p: 3 }}>
          <Stack direction="row" padding={0} gap={2}>
            <RHFSelect
              fullWidth
              options={Object.values(Activity)}
              label={t('people:activity')}
              getOptionLabel={(option) => t(`people:activityValues.${option}`)}
              controlProps={{
                name: 'activity',
                control,
              }}
            />
            <RHFSelect
              fullWidth
              options={Object.values(Day)}
              label={t('people:dayOfWeek')}
              getOptionLabel={(option) => t(`people:dayOfWeekValues.${option}`)}
              controlProps={{
                name: 'dayOfTheWeek',
                control,
              }}
            />
          </Stack>
          <Stack direction="row" padding={0} gap={2}>
            <RHFTextField
              label={t('people:hours')}
              controlProps={{
                name: 'hours',
                control,
              }}
              textFieldProps={{
                type: 'number',
                fullWidth: true,
              }}
            />
            <RHFTextField
              label={t('people:minutes')}
              controlProps={{
                name: 'minutes',
                control,
              }}
              textFieldProps={{
                type: 'number',
                fullWidth: true,
              }}
            />
          </Stack>
        </Stack>

        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={handleClose}>
            {t('common:actions.cancel')}
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isLoading}>
            {t('common:actions.save')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};
