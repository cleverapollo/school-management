import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Stack } from '@mui/material';
import {
  ParentalAttendanceRequestStatus,
  ParentalAttendanceRequestType,
  Person,
  useUser,
} from '@tyro/api';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  getNumber,
  RHFAutocomplete,
  RHFDatePicker,
  RHFRadioGroup,
  RHFSelect,
  RHFTextField,
  RHFTimePicker,
  useFormValidator,
  usePreferredNameLayout,
  RHFDateRangePicker,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useContactStudents, usePeopleAutocompleteProps } from '@tyro/people';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { useForm } from 'react-hook-form';
import { useMemo } from 'react';
import { useAttendanceCodes, useCreateOrUpdateAbsentRequest } from '../../api';

dayjs.extend(LocalizedFormat);

export interface CreateAbsentRequestModalProps {
  onClose: () => void;
}

export type CreateAbsentRequestFormState = {
  student: Person;
  attendanceCodeId: number;
  startDate: dayjs.Dayjs;
  dateRange: [dayjs.Dayjs, dayjs.Dayjs];
  startTime: dayjs.Dayjs;
  endTime: dayjs.Dayjs;
  parentNote: string;
  requestType: ParentalAttendanceRequestType;
};

function isNotNull<T>(value: T): value is NonNullable<T> {
  return value !== null;
}

export const CreateAbsentRequestModal = ({
  onClose,
}: CreateAbsentRequestModalProps) => {
  const { user } = useUser();
  const { t } = useTranslation(['common', 'attendance']);
  const { data: attendanceCodes = [] } = useAttendanceCodes({
    visibleForContacts: true,
  });

  const partyId = getNumber(user?.profiles?.[0]?.partyId);
  const { data: contactStudents, isLoading: isLoadingContactStudents } =
    useContactStudents(partyId);
  const autocompleteProps = usePeopleAutocompleteProps();

  const studentsOptions = useMemo(
    () =>
      contactStudents?.relationships?.filter(isNotNull).map((relation) => ({
        ...relation.student.person,
        partyId: getNumber(relation.student.partyId) || 0,
      })) || [],
    [contactStudents]
  );

  const { resolver, rules } = useFormValidator<CreateAbsentRequestFormState>();
  const { control, handleSubmit, reset, watch } =
    useForm<CreateAbsentRequestFormState>({
      resolver: resolver({
        startDate: [rules.date(), rules.required()],
        dateRange: [rules.date(), rules.required()],
        startTime: [
          rules.required(),
          rules.date(t('common:errorMessages.invalidTime')),
        ],
        endTime: [
          rules.required(),
          rules.date(t('common:errorMessages.invalidTime')),
          rules.afterStartDate(
            'startTime',
            t('common:errorMessages.afterStartTime')
          ),
        ],
        student: rules.required(),
        attendanceCodeId: rules.required(),
        parentNote: rules.required(),
        requestType: rules.required(),
      }),
    });

  const { mutate, isLoading } = useCreateOrUpdateAbsentRequest();
  const { displayName } = usePreferredNameLayout();

  const onSubmit = ({
    startDate,
    dateRange,
    startTime,
    endTime,
    requestType,
    student,
    ...data
  }: CreateAbsentRequestFormState) => {
    let from = dayjs();
    let to = dayjs();

    switch (requestType) {
      case ParentalAttendanceRequestType.PartialDay: {
        const date = startDate.get('date');
        const month = startDate.get('month');
        const year = startDate.get('year');

        from = startTime
          .set('date', date)
          .set('month', month)
          .set('year', year);
        to = endTime.set('date', date).set('month', month).set('year', year);
        break;
      }
      case ParentalAttendanceRequestType.SingleDay:
        from = startDate.startOf('day');
        to = startDate.endOf('day');
        break;
      case ParentalAttendanceRequestType.MultiDay:
        from = dateRange[0].startOf('day');
        to = dateRange[1].endOf('day');
        break;
      default:
        break;
    }

    mutate(
      [
        {
          ...data,
          requestType,
          from: from.format('YYYY-MM-DDTHH:mm:ss'),
          to: to.format('YYYY-MM-DDTHH:mm:ss'),
          status: ParentalAttendanceRequestStatus.Pending,
          studentPartyId: student.partyId,
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
      <DialogTitle onClose={onClose}>
        {t('attendance:createAbsentRequest')}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack direction="column" sx={{ mt: 2 }} gap={2}>
            <RHFAutocomplete
              loading={isLoadingContactStudents}
              {...autocompleteProps}
              fullWidth
              optionIdKey="partyId"
              options={studentsOptions}
              label={t('common:student')}
              getOptionLabel={(option) => displayName(option)}
              controlProps={{
                name: 'student',
                control,
              }}
            />
            <RHFRadioGroup
              radioGroupProps={{ sx: { flexDirection: 'row' } }}
              label={t('attendance:requestType')}
              options={[
                ParentalAttendanceRequestType.SingleDay,
                ParentalAttendanceRequestType.PartialDay,
                ParentalAttendanceRequestType.MultiDay,
              ].map((option) => ({
                value: option,
                label: t(`attendance:dayTypeOptions.${option}`),
              }))}
              controlProps={{
                name: 'requestType',
                control,
              }}
            />
            {requestType === ParentalAttendanceRequestType.SingleDay && (
              <RHFDatePicker
                label={t('common:date')}
                controlProps={{
                  name: 'startDate',
                  control,
                }}
                inputProps={{ sx: { flexGrow: 1 } }}
              />
            )}
            {requestType === ParentalAttendanceRequestType.PartialDay && (
              <>
                <RHFDatePicker
                  label={t('common:date')}
                  controlProps={{
                    name: 'startDate',
                    control,
                  }}
                  inputProps={{ sx: { flexGrow: 1 } }}
                />
                <RHFTimePicker
                  label={t('attendance:leavesAtTime')}
                  controlProps={{
                    name: 'startTime',
                    control,
                  }}
                />
                <RHFTimePicker
                  label={t('attendance:returnAtTime')}
                  controlProps={{
                    name: 'endTime',
                    control,
                  }}
                />
              </>
            )}
            {requestType === ParentalAttendanceRequestType.MultiDay && (
              <RHFDateRangePicker
                controlProps={{
                  name: 'dateRange',
                  control,
                }}
              />
            )}
            <RHFSelect
              fullWidth
              optionIdKey="id"
              options={attendanceCodes ?? []}
              getOptionLabel={(option) => option.description || option.name}
              label={t('attendance:reasonForAbsence')}
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
