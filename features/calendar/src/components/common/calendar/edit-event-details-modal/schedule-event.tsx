import { Stack, InputAdornment, Box } from '@mui/material';
import {
  RHFDatePicker,
  RHFRadioGroup,
  RHFSelect,
  RHFSwitch,
  RHFTextField,
  RHFTimePicker,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import dayjs from 'dayjs';
import { CreateCalendarEventInput, RecurrenceEnum } from '@tyro/api';
import { Control, useWatch } from 'react-hook-form';
import { MINIMUM_EVENT_DURATION } from './constants';

type EndsOption = {
  value: 'on' | 'after';
  label: string;
};

const recurrenceOptions: RecurrenceEnum[] = [
  RecurrenceEnum.NoRecurrence,
  RecurrenceEnum.Daily,
  RecurrenceEnum.Weekly,
  RecurrenceEnum.Biweekly,
  RecurrenceEnum.Monthly,
];

export type ScheduleEventFormState = Pick<
  CreateCalendarEventInput,
  'allDayEvent' | 'recurrenceEnum' | 'occurrences'
> & {
  startDate: dayjs.Dayjs;
  startTime: dayjs.Dayjs;
  endTime: dayjs.Dayjs;
  endDate: dayjs.Dayjs | null;
  ends: EndsOption['value'];
};

type ScheduleEventProps<TField extends ScheduleEventFormState> = {
  control: TField extends ScheduleEventFormState ? Control<TField> : never;
};

export const ScheduleEvent = <TField extends ScheduleEventFormState>({
  control,
}: ScheduleEventProps<TField>) => {
  const { t } = useTranslation(['common', 'calendar']);

  const { allDayEvent, startDate, startTime, recurrenceEnum, ends } = useWatch({
    control,
  });

  return (
    <>
      <Stack direction="column" gap={1.5}>
        {/* <RHFSwitch<ScheduleEventFormState>
          label={t('common:allDay')}
          switchProps={{ color: 'primary' }}
          controlProps={{ name: 'allDayEvent', control }}
        /> */}

        <Stack direction="row" gap={1}>
          <RHFDatePicker<ScheduleEventFormState>
            label={t('calendar:inputLabels.startDate')}
            inputProps={{ fullWidth: true }}
            controlProps={{ name: 'startDate', control }}
          />

          {!allDayEvent && (
            <Stack direction="row" gap={1} width="100%">
              <RHFTimePicker<ScheduleEventFormState>
                label={t('common:startTime')}
                controlProps={{ name: 'startTime', control }}
              />
              <RHFTimePicker<ScheduleEventFormState>
                label={t('common:endTime')}
                timePickerProps={{
                  minTime: dayjs(startTime as dayjs.Dayjs).add(
                    MINIMUM_EVENT_DURATION,
                    'minutes'
                  ),
                }}
                controlProps={{ name: 'endTime', control }}
              />
            </Stack>
          )}
        </Stack>
      </Stack>

      <RHFSelect<ScheduleEventFormState, RecurrenceEnum>
        label={t('calendar:inputLabels.schedule')}
        options={recurrenceOptions}
        getOptionLabel={(option) =>
          t(`calendar:inputLabels.recurrenceEnum.${option}`, {
            day: dayjs(startDate as dayjs.Dayjs).format('dddd'),
          })
        }
        controlProps={{
          name: 'recurrenceEnum',
          control,
        }}
      />

      {recurrenceEnum && recurrenceEnum !== RecurrenceEnum.NoRecurrence && (
        <RHFRadioGroup<ScheduleEventFormState, EndsOption>
          label={t('calendar:inputLabels.ends')}
          radioGroupProps={{ sx: { gap: 1 } }}
          options={[
            {
              value: 'on',
              label: t('calendar:inputLabels.endsOn'),
            },
            {
              value: 'after',
              label: t('calendar:inputLabels.endsAfter'),
            },
          ]}
          renderOption={(option, renderRadio) => (
            <Stack key={option.value} direction="row">
              {renderRadio({
                sx: {
                  width: '92px',
                },
              })}
              <Box width="168px">
                {option.value === 'on' && (
                  <RHFDatePicker<ScheduleEventFormState>
                    inputProps={{
                      variant: 'filled',
                      size: 'small',
                      hiddenLabel: true,
                      disabled: option.value !== ends,
                    }}
                    controlProps={{
                      name: 'endDate',
                      control,
                    }}
                  />
                )}
                {option.value === 'after' && (
                  <RHFTextField
                    textFieldProps={{
                      variant: 'filled',
                      size: 'small',
                      type: 'number',
                      hiddenLabel: true,
                      placeholder: '5',
                      disabled: option.value !== ends,
                      InputProps: {
                        endAdornment: (
                          <InputAdornment position="start">
                            {t('calendar:inputLabels.occurrences')}
                          </InputAdornment>
                        ),
                      },
                    }}
                    controlProps={{
                      name: 'occurrences',
                      control,
                    }}
                  />
                )}
              </Box>
            </Stack>
          )}
          controlProps={{
            name: 'ends',
            control,
          }}
        />
      )}
    </>
  );
};
