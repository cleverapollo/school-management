import LoadingButton from '@mui/lab/LoadingButton';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material';
import {
  ParentalAttendanceRequestStatus,
  ParentalAttendanceRequestType,
} from '@tyro/api';
import {
  RHFDatePicker,
  RHFDateTimePicker,
  RHFRadioGroup,
  RHFSelect,
  RHFTextField,
  RHFTimePicker,
  ValidationError,
  useFormValidator,
  usePreferredNameLayout,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
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

const validateDate = (
  value: unknown,
  error: (errorMessage: string) => ValidationError,
  condition: boolean,
  t: TFunction<
    ('common' | 'attendance')[],
    undefined,
    ('common' | 'attendance')[]
  >
) => {
  if (condition && !value) {
    error(t('common:errorMessages.required'));
  }
};

export const CreateAbsentRequestModal = ({
  onClose,
}: CreateAbsentRequestModalProps) => {
  const { t } = useTranslation(['common', 'attendance']);
  const { data: attendanceCodes = [] } = useAttendanceCodes({});
  const { data: students = [] } = useStudents();

  const { resolver, rules } = useFormValidator<CreateAbsentRequestFormState>();
  const { control, handleSubmit, reset, watch } =
    useForm<CreateAbsentRequestFormState>({
      resolver: resolver({
        date: rules.validate((value, error, formValues) =>
          validateDate(
            value,
            error,
            [
              ParentalAttendanceRequestType.PartialDay,
              ParentalAttendanceRequestType.SingleDay,
            ].includes(formValues.requestType),
            t
          )
        ),
        startTime: rules.validate((value: dayjs.Dayjs, error, formValues) =>
          validateDate(
            value,
            error,
            ParentalAttendanceRequestType.PartialDay === formValues.requestType,
            t
          )
        ),
        endTime: rules.validate((value: dayjs.Dayjs, error, formValues) =>
          validateDate(
            value,
            error,
            ParentalAttendanceRequestType.PartialDay === formValues.requestType,
            t
          )
        ),
        from: rules.validate((value, error, formValues) =>
          validateDate(
            value,
            error,
            ParentalAttendanceRequestType.MultiDay === formValues.requestType,
            t
          )
        ),
        to: rules.validate((value, error, formValues) =>
          validateDate(
            value,
            error,
            ParentalAttendanceRequestType.MultiDay === formValues.requestType,
            t
          )
        ),
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
          attendanceCodeId: data.attendanceCodeId,
          from: from.toISOString(),
          to: to.toISOString(),
          parentNote: data.parentNote,
          requestType: data.requestType,
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
            <RHFSelect
              fullWidth
              optionIdKey="partyId"
              options={students}
              label={t('common:student')}
              getOptionLabel={(option) => displayName(option.person)}
              controlProps={{
                name: 'studentId',
                control,
              }}
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
              <Stack gap={2} direction="column">
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
                  label={t('common:startTime')}
                  controlProps={{
                    name: 'startTime',
                    control,
                    rules: {
                      required: true,
                    },
                  }}
                />
                <RHFTimePicker
                  label={t('common:endTime')}
                  controlProps={{
                    name: 'endTime',
                    control,
                    rules: {
                      required: true,
                    },
                  }}
                />
              </Stack>
            )}
            {requestType === ParentalAttendanceRequestType.MultiDay && (
              <Stack gap={2} direction="column">
                <RHFDateTimePicker
                  label={t('common:startDate')}
                  controlProps={{
                    name: 'from',
                    control,
                    rules: {
                      required: true,
                    },
                  }}
                  inputProps={{ sx: { flexGrow: 1 } }}
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
                  inputProps={{ sx: { flexGrow: 1 } }}
                />
              </Stack>
            )}
            <RHFSelect
              fullWidth
              optionIdKey="id"
              options={attendanceCodes}
              label={t('attendance:attendance')}
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
