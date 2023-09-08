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
import { Activity, Day } from '@tyro/api';
import { ReturnTypeFromUseNonClassContactHours } from '../../api/dtr-returns/non-class-contact';
import { useUpsertNonClassContact } from '../../api/dtr-returns/upsert-non-class-contact';

export interface UpsertNonClassContactModalProps {
  onClose: () => void;
  initialState: Partial<ReturnTypeFromUseNonClassContactHours> | null;
}

export type UpsertNonClassContactFormState = {
  staffPartyId: number;
  activity: Activity;
  dayOfTheWeek: Day;
  hours: number;
  minutes: number;
};

export const UpsertNonClassContactModal = ({
  initialState,
  onClose,
}: UpsertNonClassContactModalProps) => {
  const { t } = useTranslation(['settings', 'common']);
  const { resolver, rules } =
    useFormValidator<UpsertNonClassContactFormState>();

  const defaultFormStateValues: Partial<UpsertNonClassContactFormState> = {
    staffPartyId: initialState?.staffPartyId,
    activity: initialState?.activity,
    dayOfTheWeek: initialState?.dayOfTheWeek || Day.Monday,
    hours: initialState?.hours || 0,
    minutes: initialState?.minutes || 0,
  };

  const { control, handleSubmit, reset } =
    useForm<UpsertNonClassContactFormState>({
      resolver: resolver({
        // staffPartyId: rules.required(),
        activity: rules.required(),
        dayOfTheWeek: rules.required(),
        hours: rules.required(),
        minutes: rules.required(),
      }),
      defaultValues: defaultFormStateValues,
    });

  const { mutate, isLoading } = useUpsertNonClassContact();

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
        academicNameSpaceId: initialState?.academicNameSpaceId ?? 1,
        staffPartyId: data.staffPartyId ?? 12345,
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
        {initialState?.staffPartyId
          ? t('settings:dtrReturns.editNonClassContact')
          : t('settings:dtrReturns.createNonClassContact')}
      </DialogTitle>
      <form onSubmit={onSubmit}>
        <Stack spacing={3} sx={{ p: 3 }}>
          <RHFSelect
            fullWidth
            options={[]}
            label={t('common:teacher')}
            getOptionLabel={(option) => option}
            controlProps={{
              name: 'staffPartyId',
              control,
            }}
          />
          <Stack direction="row" padding={0} gap={2}>
            <RHFSelect
              fullWidth
              options={Object.values(Activity)}
              label={t('settings:dtrReturns.activity')}
              getOptionLabel={(option) =>
                t(`settings:dtrReturns.activityValues.${option}`)
              }
              controlProps={{
                name: 'activity',
                control,
              }}
            />
            <RHFSelect
              fullWidth
              options={Object.values(Day)}
              label={t('settings:dtrReturns.dayOfWeek')}
              getOptionLabel={(option) =>
                t(`settings:dtrReturns.dayOfWeekValues.${option}`)
              }
              controlProps={{
                name: 'dayOfTheWeek',
                control,
              }}
            />
          </Stack>
          <Stack direction="row" padding={0} gap={2}>
            <RHFTextField
              label={t('settings:dtrReturns.hours')}
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
              label={t('settings:dtrReturns.minutes')}
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
