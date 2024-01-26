import {
  Alert,
  AlertTitle,
  Box,
  Collapse,
  IconButton,
  Stack,
} from '@mui/material';
import {
  RHFAutocomplete,
  RHFDatePicker,
  RHFDateRangePicker,
  RHFRadioGroup,
  RHFSelect,
  RHFTextField,
  RHFTimePicker,
} from '@tyro/core';
import { CloseIcon, LightBulbIcon } from '@tyro/icons';
import { useTranslation } from '@tyro/i18n';
import { useState } from 'react';
import dayjs from 'dayjs';
import { Control, useWatch } from 'react-hook-form';
import {
  useSessionPartySearchProps,
  SessionParty,
} from '../../../hooks/use-session-party-search-props';
import { useAttendanceCodes } from '../../../api/attendance-codes';

export enum BulkAttendanceRequestType {
  MultiDay = 'MULTI_DAY',
  PartialDay = 'PARTIAL_DAY',
  SingleDay = 'SINGLE_DAY',
}

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

interface CreateBulkAttendanceStepOneFormProps {
  control: Control<CreateBulkAttendanceFormState, any>;
}

export function CreateBulkAttendanceStepOneForm({
  control,
}: CreateBulkAttendanceStepOneFormProps) {
  const { t } = useTranslation(['common', 'attendance']);
  const [openAlert, setOpenAlert] = useState(true);

  const requestType = useWatch({
    control,
    name: 'requestType',
  });

  const bulkAttendanceAutocompleteProps = useSessionPartySearchProps();
  const { data: attendanceCodes = [] } = useAttendanceCodes({});

  return (
    <Box sx={{ px: 3, pt: 1 }}>
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
          icon={<LightBulbIcon fontSize="inherit" sx={{ color: 'blue.800' }} />}
          sx={{
            marginBottom: 3,
            backgroundColor: 'indigo.50',
            color: 'blue.800',
          }}
        >
          <AlertTitle>{t('attendance:bulkAttendanceAlertTitle')}</AlertTitle>
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
    </Box>
  );
}
