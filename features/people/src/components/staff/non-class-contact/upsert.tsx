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
import { useEffect } from 'react';
import {
  Activity,
  Day,
  Ncch_Programme,
  NonClassContactHoursFilter,
} from '@tyro/api';
import { ReturnTypeFromUseNonClassContactHours } from '../../../api/staff/non-class-contact';
import { useUpsertNonClassContact } from '../../../api/staff/upsert-non-class-contact';

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
  programme?: Ncch_Programme;
  description?: string;
};

const dayOfWeekOptions = [
  Day.Monday,
  Day.Tuesday,
  Day.Wednesday,
  Day.Thursday,
  Day.Friday,
  Day.Saturday,
];

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
    dayOfTheWeek: initialState?.dayOfTheWeek,
    hours: initialState?.hours || 0,
    minutes: initialState?.minutes || 0,
    description: '',
  };

  const { control, handleSubmit, watch, reset } =
    useForm<UpsertNonClassContactFormState>({
      resolver: resolver({
        activity: rules.required(),
        dayOfTheWeek: rules.required(),
        hours: [rules.required(), rules.min(0)],
        minutes: [rules.required(), rules.max(59), rules.min(0)],
        programme: rules.validate((value, _throwError, formValues) => {
          if (formValues.activity === Activity.ProgrammeCoordination) {
            const requiredFunc = rules.required();

            requiredFunc(value);
          }
        }),
        description: rules.maxLength(35),
      }),
      defaultValues: defaultFormStateValues,
    });

  const [selectedActivity] = watch(['activity']);

  const isProgrammeCoordinationSelected =
    selectedActivity === Activity.ProgrammeCoordination;
  const isOtherActivitySelected = selectedActivity === Activity.OtherActivity;

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
        ...data,
        academicNameSpaceId:
          initialState?.academicNameSpaceId ??
          nonClassContactHoursQueryFilter.academicNameSpaceId,
        staffPartyId: nonClassContactHoursQueryFilter.staffPartyId,
      },
      {
        onSuccess: handleClose,
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
      <DialogTitle onClose={onClose}>
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
              label={t('common:activity')}
              getOptionLabel={(option) => t(`people:activityValues.${option}`)}
              controlProps={{
                name: 'activity',
                control,
              }}
            />
            <RHFSelect
              fullWidth
              options={dayOfWeekOptions}
              label={t('common:dayOfWeek')}
              getOptionLabel={(option) => t(`common:dayOfWeekValues.${option}`)}
              controlProps={{
                name: 'dayOfTheWeek',
                control,
              }}
            />
          </Stack>
          <Stack direction="row" padding={0} gap={2}>
            <RHFTextField
              label={t('common:hours')}
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
              label={t('common:minutes')}
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
          {(isProgrammeCoordinationSelected || isOtherActivitySelected) && (
            <Stack padding={0} gap={2}>
              <RHFSelect
                fullWidth
                options={Object.values(Ncch_Programme)}
                label={t('people:personal.programme')}
                getOptionLabel={(option) => t(`people:programValues.${option}`)}
                controlProps={{
                  name: 'programme',
                  control,
                }}
              />
              {isOtherActivitySelected && (
                <RHFTextField
                  label={t('common:details')}
                  controlProps={{
                    name: 'description',
                    control,
                  }}
                  textFieldProps={{
                    fullWidth: true,
                    multiline: true,
                    rows: 3,
                  }}
                />
              )}
            </Stack>
          )}
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
