import { FormHelperText, FormControl, Stack } from '@mui/material';

import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { useTranslation } from '@tyro/i18n';
import { ParentalAttendanceRequestType } from '@tyro/api';

import {
  FieldValues,
  UseControllerProps,
  useController,
} from 'react-hook-form';

dayjs.extend(LocalizedFormat);

type AbsentRequestDateEditorProps<TField extends FieldValues> = {
  from?: string;
  to?: string;
  requestType?: ParentalAttendanceRequestType;
  controlProps: UseControllerProps<TField>;
};

export const AbsentRequestDateEditor = <TField extends FieldValues>({
  from,
  to,
  requestType,
  controlProps,
}: AbsentRequestDateEditorProps<TField>) => {
  const { t } = useTranslation(['common']);
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController(controlProps);

  const [startDate, endDate] = useMemo(
    () => (Array.isArray(value) ? value : [dayjs(), dayjs()]),
    [value]
  );

  useEffect(() => {
    if (from && to && onChange) {
      onChange([dayjs(from), dayjs(to)]);
    }
  }, [from, to, onChange]);

  return (
    <FormControl fullWidth error={!!error}>
      {requestType === ParentalAttendanceRequestType.SingleDay && (
        <DatePicker
          value={startDate ?? null}
          onChange={(newStartDate) => {
            onChange([newStartDate, newStartDate]);
          }}
        />
      )}

      {requestType === ParentalAttendanceRequestType.PartialDay && (
        <Stack
          direction="row"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
          mt={1}
        >
          <DatePicker
            value={startDate ?? null}
            onChange={(newStartDate) => {
              const newDate = newStartDate?.format('YYYY-MM-DD');
              if (newDate) {
                const startTime = startDate?.format('HH:mm:ss');
                const endTime = endDate?.format('HH:mm:ss');
                onChange([
                  dayjs(`${newDate}T${startTime}`),
                  dayjs(`${newDate}T${endTime}`),
                ]);
              }
            }}
          />
          <TimePicker
            label={t('common:from')}
            value={startDate ?? null}
            onChange={(newStartDate) => {
              onChange([newStartDate, value?.[1] ?? null]);
            }}
          />
          <TimePicker
            label={t('common:to')}
            value={endDate ?? null}
            onChange={(newEndDate) => {
              onChange([value?.[0] ?? null, newEndDate]);
            }}
          />
        </Stack>
      )}

      {requestType === ParentalAttendanceRequestType.MultiDay && (
        <Stack
          direction="row"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
          mt={1}
        >
          <DatePicker
            label={t('common:from')}
            value={startDate ?? null}
            onChange={(newStartDate) => {
              onChange([newStartDate, value?.[1] ?? null]);
            }}
          />
          <DatePicker
            label={t('common:to')}
            value={endDate ?? null}
            onChange={(newEndDate) => {
              onChange([value?.[0] ?? null, newEndDate]);
            }}
          />
        </Stack>
      )}
      {error && <FormHelperText error>{error?.message}</FormHelperText>}
    </FormControl>
  );
};
