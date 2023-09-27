import React, { useEffect, useState } from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Collapse,
  DialogContent,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Person,
  SubjectGroup,
  SubjectGroupType,
  PartyPersonType,
} from '@tyro/api';
import {
  Autocomplete,
  DateRangeSwitcher,
  Dialog,
  DialogActions,
  DialogTitle,
  RHFAutocomplete,
  RHFCheckbox,
  RHFDatePicker,
  RHFMultiDatePicker,
  RHFRadioGroup,
  RHFSelect,
  RHFSwitch,
  RHFTextField,
  RHFTimePicker,
  useFormValidator,
  usePreferredNameLayout,
} from '@tyro/core';
import { usePeopleAutocompleteProps } from '@tyro/people';
import { useForm } from 'react-hook-form';
import { CloseIcon, LightBulbIcon } from '@tyro/icons';

import { useTranslation } from '@tyro/i18n';
import { LoadingButton } from '@mui/lab';
import dayjs, { Dayjs } from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { useSubjectGroupsForBulkAttendanceQuery } from '../../api/bulk-attendance/subject-groups';
import {
  useStudentSearchQuery,
  ReturnTypeFromStudentSearchQuery,
} from '../../api/bulk-attendance/student-search';
import { useCreateBulkAttendance } from '../../api/bulk-attendance/save-bulk-attendance';

dayjs.extend(LocalizedFormat);

enum BulkAttendanceRequestType {
  MultiDay = 'MULTI_DAY',
  PartialDay = 'PARTIAL_DAY',
  SingleDay = 'SINGLE_DAY',
}

export type BulkAttendanceModalProps = {
  initialModalState: boolean;
  onClose: () => void;
};

type AttendanceDate = {
  dates: Array<Dayjs>;
  isFullDay: boolean;
  startTime?: Dayjs;
  endTime?: Dayjs;
};

export type CreateBulkAttendanceFormState = {
  attendees: Person;
  attendanceCodeId: number;
  date?: dayjs.Dayjs;
  dates?: Array<AttendanceDate>;
  startTime?: dayjs.Dayjs;
  endTime?: dayjs.Dayjs;
  note?: string;
  requestType: BulkAttendanceRequestType;
};

type AttendanceIds = [Person['partyId']];

export const BulkAttendanceModal = ({
  initialModalState,
  onClose,
}: BulkAttendanceModalProps) => {
  const { t } = useTranslation(['common', 'attendance']);
  const [openAlert, setOpenAlert] = useState(true);

  const { resolver, rules } = useFormValidator<CreateBulkAttendanceFormState>();
  const { control, handleSubmit, reset, watch } =
    useForm<CreateBulkAttendanceFormState>({
      resolver: resolver({
        date: [rules.date(), rules.required()],
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
        attendees: [rules.required()],
      }),
      mode: 'onChange',
    });

  const handleClose = () => {
    reset();
    onClose();
  };

  const { data: subjectGroupsData } = useSubjectGroupsForBulkAttendanceQuery({
    type: [SubjectGroupType.SubjectGroup],
  });
  const { data: students } = useStudentSearchQuery();
  const { mutateAsync: saveBulkAttendance } = useCreateBulkAttendance();

  const peopleAutocompleteProps =
    usePeopleAutocompleteProps<ReturnTypeFromStudentSearchQuery>();

  const requestType = watch('requestType');

  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(1, 'weeks'),
    dayjs(),
  ]);

  const onSubmit = (data: CreateBulkAttendanceFormState) => {
    console.log(data, 'Form data');
    function getAttendanceIds() {
      if (Array.isArray(data?.attendees)) {
        const { attendees } = data;
        return attendees?.map((item: Person) => item?.partyId);
      }
    }
    if (data?.requestType === BulkAttendanceRequestType.SingleDay) {
      const attendanceIdArrays = getAttendanceIds();
      const transformedData = {
        attendanceCodeId: 64, // data?.attendanceCodeId,
        attendanceForPartyIds: attendanceIdArrays ?? [],
        note: data?.note,
        singleDate: {
          date: dayjs(data?.date).format('YYYY-MM-DD'),
        },
      };
      saveBulkAttendance(transformedData);
      reset();
      onClose();
    }
    if (data?.requestType === BulkAttendanceRequestType.PartialDay) {
      const attendanceIdArrays = getAttendanceIds();
      const transformedData = {
        attendanceCodeId: 64, // data?.attendanceCodeId,
        attendanceForPartyIds: attendanceIdArrays ?? [],
        note: data?.note,
        partialDate: {
          date: dayjs(data?.date).format('YYYY-MM-DD'),
          leavesAt: dayjs(data?.startTime).format('HH:MM'),
          returnsAt: dayjs(data?.endTime).format('HH:MM'),
        },
      };
      saveBulkAttendance(transformedData);
      reset();
      onClose();
    }
  };

  return (
    <Dialog
      open={initialModalState}
      onClose={handleClose}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{t('attendance:createBulkAttendance')}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Collapse in={openAlert}>
            <Alert
              severity="error"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpenAlert(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              icon={
                <LightBulbIcon fontSize="inherit" sx={{ color: 'blue.800' }} />
              }
              sx={{
                marginBottom: 3,
                backgroundColor: 'indigo.50',
                color: 'blue.800',
              }}
            >
              <AlertTitle>
                {t('attendance:bulkAttendanceAlertTitle')}
              </AlertTitle>
              {t('attendance:bulkAttendanceAlertDescription')}
            </Alert>
          </Collapse>

          <Stack direction="column" sx={{ mt: 1 }} gap={2}>
            <RHFAutocomplete<
              CreateBulkAttendanceFormState,
              CreateBulkAttendanceFormState['attendees']
            >
              fullWidth
              multiple
              disableCloseOnSelect
              options={students ?? []}
              {...peopleAutocompleteProps}
              label="Attendees"
              controlProps={{
                name: `attendees`,
                control,
              }}
              sx={{ mt: 1 }}
            />
            <RHFRadioGroup
              radioGroupProps={{ sx: { flexDirection: 'row' } }}
              label={t('attendance:attendance')}
              options={[
                BulkAttendanceRequestType.SingleDay,
                BulkAttendanceRequestType.PartialDay,
                BulkAttendanceRequestType.MultiDay,
              ].map((option) => ({
                value: option,
                label: t(`attendance:absenceRequestType.${option}`),
              }))}
              controlProps={{
                name: 'requestType',
                control,
              }}
            />
            {requestType === BulkAttendanceRequestType.SingleDay && (
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
            {requestType === BulkAttendanceRequestType.PartialDay && (
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
            {requestType === BulkAttendanceRequestType.MultiDay && (
              <DateRangeSwitcher
                value={dateRange}
                onChange={setDateRange}
                maxDateRange={(firstSelectedDate) =>
                  firstSelectedDate.add(4, 'weeks')
                }
              />
            )}
            <RHFTextField
              label={t('attendance:note')}
              controlProps={{
                name: 'note',
                control,
              }}
              textFieldProps={{
                fullWidth: true,
                multiline: true,
                rows: 4,
              }}
            />
          </Stack>
          <DialogActions>
            <Button variant="outlined" color="inherit" onClick={onClose}>
              {t('common:actions.cancel')}
            </Button>

            <LoadingButton
              type="submit"
              variant="contained"
              //   loading={isSubmitting}
            >
              Submit
            </LoadingButton>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};
