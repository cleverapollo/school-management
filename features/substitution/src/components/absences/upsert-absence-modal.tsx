import { useEffect } from 'react';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Stack,
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { MultiDatePicker, RHFTextField, useFormValidator } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { StaffAutocomplete } from '@tyro/people';
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

type PartialDate =
  | {
      partialAbsence: true;
      partialStartTime: string;
      partialEndTime: string;
    }
  | { partialAbsence: false };

type AbsenceDate = { dates: Array<Dayjs> } & PartialDate;

interface UpsertAbsenceFormState {
  staff: ReturnTypeFromUseStaffWorkAbsences['staff'];
  absenceType: StaffWorkAbsenceTypeOption;
  note: string;
  dates: Array<AbsenceDate>;
}

export function UpsertAbsenceModal({
  initialAbsenceData,
  open,
  onClose,
}: UpsertAbsenceModalProps) {
  const { t } = useTranslation(['common', 'substitution']);
  const { resolver, rules } = useFormValidator<UpsertAbsenceFormState>();

  const { mutateAsync: saveStaffAbsence } = useSaveStaffAbsence();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<UpsertAbsenceFormState>({
    resolver: resolver({
      staff: rules.required(),
      absenceType: rules.required(),
      note: rules.required(),
      dates: {
        priority: rules.required(),
        relationshipType: rules.required(),
        student: rules.required(),
      },
    }),
  });

  const onSubmit = handleSubmit((data) => {
    console.log({ data });
  });

  useEffect(() => {
    if (initialAbsenceData) {
      console.log({ initialAbsenceData });
    }
  }, [initialAbsenceData]);

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

          <MultiDatePicker
            value={[
              dayjs(),
              dayjs().add(1, 'day'),
              dayjs().add(2, 'day'),
              dayjs().add(4, 'day'),
            ]}
            onChange={(dates) => {
              console.log({
                dates,
              });
            }}
          />
        </Stack>

        <DialogActions>
          <Button variant="soft" color="inherit" onClick={onClose}>
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
}
