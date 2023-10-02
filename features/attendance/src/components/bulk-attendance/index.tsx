import React, { useEffect, useState } from 'react';
import {
  Alert,
  AlertTitle,
  Button,
  Collapse,
  IconButton,
  Stack,
} from '@mui/material';
import { Attendance_SaveBulkAttendanceInput } from '@tyro/api';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  RHFAutocomplete,
  RHFDatePicker,
  RHFDateRangePicker,
  RHFRadioGroup,
  RHFSelect,
  RHFTextField,
  RHFTimePicker,
  useFormValidator,
} from '@tyro/core';
import { useForm } from 'react-hook-form';
import { CloseIcon, LightBulbIcon } from '@tyro/icons';
import { useTranslation } from '@tyro/i18n';
import { LoadingButton } from '@mui/lab';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { ReturnTypeFromUseBulkAttendance } from '../../api/bulk-attendance/bulk-attendance';
import { useCreateBulkAttendance } from '../../api/bulk-attendance/save-bulk-attendance';
import { useAttendanceCodes } from '../../api/attendance-codes';
import {
  useSessionPartySearchProps,
  SessionParty,
} from '../../hooks/use-session-party-search-props';

dayjs.extend(LocalizedFormat);

enum BulkAttendanceRequestType {
  MultiDay = 'MULTI_DAY',
  PartialDay = 'PARTIAL_DAY',
  SingleDay = 'SINGLE_DAY',
}

export type BulkAttendanceModalProps = {
  open: boolean;
  initialModalState: Partial<ReturnTypeFromUseBulkAttendance> | null;
  onClose: () => void;
};

export type CreateBulkAttendanceFormState = {
  selectedStudentsOrGroups: SessionParty[];
  attendanceCodeId: number;
  date?: dayjs.Dayjs;
  dateRange: [dayjs.Dayjs, dayjs.Dayjs];
  startTime?: dayjs.Dayjs;
  endTime?: dayjs.Dayjs;
  note?: string;
  requestType: BulkAttendanceRequestType;
};

const defaultFormValue = {
  requestType: BulkAttendanceRequestType.SingleDay,
};

export const BulkAttendanceModal = ({
  open,
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
        selectedStudentsOrGroups: [rules.required()],
        attendanceCodeId: [rules.required()],
      }),
    });
  const requestType = watch('requestType');

  const { mutateAsync: saveBulkAttendance, isLoading: isSubmitting } =
    useCreateBulkAttendance();
  const { data: attendanceCodes = [] } = useAttendanceCodes({});

  const bulkAttendanceAutocompleteProps = useSessionPartySearchProps();

  const handleClose = () => {
    onClose();
    reset();
  };

  const onSubmit = (data: CreateBulkAttendanceFormState) => {
    const attendanceIdArrays = data.selectedStudentsOrGroups.map(
      (item) => item?.partyId
    );

    const transformedData: Attendance_SaveBulkAttendanceInput = {
      attendanceCodeId: data.attendanceCodeId,
      attendanceForPartyIds: attendanceIdArrays,
      note: data.note,
    };

    if (data?.requestType === BulkAttendanceRequestType.SingleDay) {
      transformedData.singleDate = {
        date: dayjs(data?.date).format('YYYY-MM-DD'),
      };
    }
    if (data?.requestType === BulkAttendanceRequestType.PartialDay) {
      transformedData.partialDate = {
        date: dayjs(data?.date).format('YYYY-MM-DD'),
        leavesAt: dayjs(data?.startTime).format('HH:mm'),
        returnsAt: dayjs(data?.endTime).format('HH:mm'),
      };
    }
    if (data?.requestType === BulkAttendanceRequestType.MultiDay) {
      transformedData.multiDate = {
        startDate: dayjs(data?.dateRange[0]).format('YYYY-MM-DD'),
        endDate: dayjs(data?.dateRange[1]).format('YYYY-MM-DD'),
      };
    }
    // saveBulkAttendance(transformedData, {
    //   onSuccess: handleClose,
    // });
  };

  useEffect(() => {
    if (initialModalState) {
      reset({
        ...defaultFormValue,
      });
    }
  }, [initialModalState]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{t('attendance:createBulkAttendance')}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
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
            <RHFAutocomplete<CreateBulkAttendanceFormState, SessionParty, true>
              {...bulkAttendanceAutocompleteProps}
              fullWidth
              disableCloseOnSelect
              label={t('common:search')}
              controlProps={{
                name: `selectedStudentsOrGroups`,
                control,
              }}
            />
            <RHFSelect
              fullWidth
              optionIdKey="id"
              options={attendanceCodes ?? []}
              getOptionLabel={(option) => option.name || ''}
              label={t('attendance:attendance')}
              controlProps={{
                name: 'attendanceCodeId',
                control,
              }}
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
                label: t(`attendance:dayTypeOptions.${option}`),
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
            {requestType === BulkAttendanceRequestType.MultiDay && (
              <RHFDateRangePicker
                controlProps={{
                  name: 'dateRange',
                  control,
                }}
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
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={onClose}>
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
};
