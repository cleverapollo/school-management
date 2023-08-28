import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Stack } from '@mui/material';
import {
  ParentalAttendanceRequestStatus,
  ParentalAttendanceRequestType,
} from '@tyro/api';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  RHFAutocomplete,
  RHFDatePicker,
  RHFDateTimePicker,
  RHFRadioGroup,
  RHFSelect,
  RHFTextField,
  RHFTimePicker,
  useFormValidator,
  usePreferredNameLayout,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useStudents } from '@tyro/people';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { useForm } from 'react-hook-form';
import { useAttendanceCodes, useCreateOrUpdateAbsentRequest } from '../../api';

dayjs.extend(LocalizedFormat);

export interface CreateAbsentRequestModalProps {
  onClose: () => void;
}

export type CreateAbsentRequestFormState = {
  studentId: number;
  attendanceCodeId: number;
  date: dayjs.Dayjs;
  startTime: dayjs.Dayjs;
  endTime: dayjs.Dayjs;
  from: dayjs.Dayjs;
  to: dayjs.Dayjs;
  parentNote: string;
  requestType: ParentalAttendanceRequestType;
};

export const CreateAbsentRequestModal = ({
  onClose,
}: CreateAbsentRequestModalProps) => {
  const { t } = useTranslation(['common', 'attendance']);
  const { data: attendanceCodes = [] } = useAttendanceCodes({
    visibleForContacts: true,
  });
  const { data: students = [] } = useStudents();

  const { resolver, rules } = useFormValidator<CreateAbsentRequestFormState>();
  const { control, handleSubmit, reset, watch } =
    useForm<CreateAbsentRequestFormState>({
      resolver: resolver({
        date: rules.validate((value, error, formValues) => {
          if (
            [
              ParentalAttendanceRequestType.PartialDay,
              ParentalAttendanceRequestType.SingleDay,
            ].includes(formValues.requestType) &&
            !value
          ) {
            error(t('common:errorMessages.required'));
          }
        }),
        startTime: rules.validate((value: dayjs.Dayjs, error, formValues) => {
          if (
            ParentalAttendanceRequestType.PartialDay ===
              formValues.requestType &&
            !value
          ) {
            error(t('common:errorMessages.required'));
          }
        }),
        endTime: rules.validate((value: dayjs.Dayjs, error, formValues) => {
          if (
            ParentalAttendanceRequestType.PartialDay ===
              formValues.requestType &&
            !value
          ) {
            error(t('common:errorMessages.required'));
          }
        }),
        from: rules.validate((value, error, formValues) => {
          if (
            ParentalAttendanceRequestType.MultiDay === formValues.requestType &&
            !value
          ) {
            error(t('common:errorMessages.required'));
          }
        }),
        to: rules.validate((value, error, formValues) => {
          if (
            ParentalAttendanceRequestType.MultiDay === formValues.requestType &&
            !value
          ) {
            error(t('common:errorMessages.required'));
          }
        }),
        studentId: rules.required(),
        attendanceCodeId: rules.required(),
        parentNote: rules.required(),
        requestType: rules.required(),
      }),
    });

  const { mutate, isLoading } = useCreateOrUpdateAbsentRequest();
  const { displayName } = usePreferredNameLayout();

  const onSubmit = (data: CreateAbsentRequestFormState) => {
    let from = dayjs();
    let to = dayjs();

    const date = data.date?.get('date');
    const month = data.date?.get('month');
    const year = data.date?.get('year');

    switch (data.requestType) {
      case ParentalAttendanceRequestType.MultiDay:
        from = data.from;
        to = data.to;
        break;
      case ParentalAttendanceRequestType.PartialDay:
        from = data.startTime
          .set('date', date)
          .set('month', month)
          .set('year', year);
        to = data.endTime
          .set('date', date)
          .set('month', month)
          .set('year', year);
        break;
      case ParentalAttendanceRequestType.SingleDay:
        from = data.date.startOf('day');
        to = data.date.endOf('day');
        break;
      default:
        break;
    }

    mutate(
      [
        {
          ...data,
          from: from.toISOString(),
          to: to.toISOString(),
          status: ParentalAttendanceRequestStatus.Pending,
          studentPartyId: data.studentId,
        },
      ],
      {
        onSuccess: () => {
          onClose();
          reset();
        },
      }
    );
  };

  const requestType = watch('requestType');

  return (
    <Dialog open onClose={onClose} scroll="paper" fullWidth maxWidth="sm">
      <DialogTitle>{t('attendance:createAbsentRequest')}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack direction="column" sx={{ mt: 2 }} gap={2}>
            <RHFAutocomplete
              fullWidth
              optionIdKey="partyId"
              options={students}
              label={t('common:student')}
              getOptionLabel={(option) => displayName(option.person)}
              controlProps={{
                name: 'studentId',
                control,
              }}
              renderAvatarAdornment={(value, renderAdornment) =>
                renderAdornment({
                  name: displayName(value.person),
                  src: value.person.avatarUrl,
                })
              }
              renderAvatarTags={(option, renderTag) =>
                renderTag({
                  name: displayName(option.person),
                  src: option.person.avatarUrl ?? undefined,
                })
              }
              renderAvatarOption={(option, renderOption) =>
                renderOption({
                  name: displayName(option.person),
                  src: option.person.avatarUrl ?? undefined,
                })
              }
            />
            <RHFRadioGroup
              radioGroupProps={{ sx: { flexDirection: 'row' } }}
              label={t('attendance:requestType')}
              options={Object.values(ParentalAttendanceRequestType).map(
                (option) => ({
                  value: option,
                  label: t(`attendance:absenceRequestType.${option}`),
                })
              )}
              controlProps={{
                name: 'requestType',
                control,
              }}
            />
            {requestType === ParentalAttendanceRequestType.SingleDay && (
              <RHFDatePicker
                label={t('common:date')}
                controlProps={{
                  name: 'date',
                  control,
                  rules: { required: true },
                }}
                inputProps={{ sx: { flexGrow: 1 } }}
              />
            )}
            {requestType === ParentalAttendanceRequestType.PartialDay && (
              <>
                <RHFDatePicker
                  label={t('common:date')}
                  controlProps={{
                    name: 'date',
                    control,
                    rules: { required: true },
                  }}
                  inputProps={{ sx: { flexGrow: 1 } }}
                />
                <RHFTimePicker
                  label={t('attendance:leavesAtTime')}
                  controlProps={{
                    name: 'startTime',
                    control,
                    rules: {
                      required: true,
                    },
                  }}
                />
                <RHFTimePicker
                  label={t('attendance:returnAtTime')}
                  controlProps={{
                    name: 'endTime',
                    control,
                    rules: {
                      required: true,
                    },
                  }}
                />
              </>
            )}
            {requestType === ParentalAttendanceRequestType.MultiDay && (
              <>
                <RHFDateTimePicker
                  label={t('common:startDate')}
                  controlProps={{
                    name: 'from',
                    control,
                    rules: {
                      required: true,
                    },
                  }}
                />
                <RHFDateTimePicker
                  label={t('common:endDate')}
                  controlProps={{
                    name: 'to',
                    control,
                    rules: {
                      required: true,
                    },
                  }}
                />
              </>
            )}
            <RHFSelect
              fullWidth
              optionIdKey="id"
              options={attendanceCodes}
              label={t('attendance:reasonForAbsence')}
              getOptionLabel={(option) => option.name}
              controlProps={{
                name: 'attendanceCodeId',
                control,
              }}
            />
            <RHFTextField
              label={t('attendance:note')}
              controlProps={{
                name: 'parentNote',
                control,
              }}
              textFieldProps={{
                fullWidth: true,
                multiline: true,
                rows: 4,
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={onClose}>
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
