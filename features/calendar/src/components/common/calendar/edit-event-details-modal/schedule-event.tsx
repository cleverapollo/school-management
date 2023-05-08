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
import { RecurrenceEnum } from '@tyro/api';
import {
  Control,
  Path,
  PathValue,
  UseFormSetValue,
  useWatch,
} from 'react-hook-form';
import { useEffect } from 'react';
import {
  ALL_DAY_END_TIME,
  ALL_DAY_START_TIME,
  MINIMUM_EVENT_DURATION,
} from './constants';

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

export type ScheduleEventFormState = {
  allDayEvent: boolean;
  recurrenceEnum: RecurrenceEnum;
  startDate: dayjs.Dayjs;
  startTime: dayjs.Dayjs;
  endTime: dayjs.Dayjs;
  endDate: dayjs.Dayjs | null;
  occurrences: number | null;
  ends: EndsOption['value'];
};

type ScheduleEventProps<TField extends ScheduleEventFormState> = {
  setValue: UseFormSetValue<TField>;
  control: Control<TField>;
};

export const ScheduleEvent = <TField extends ScheduleEventFormState>({
  setValue,
  control,
}: ScheduleEventProps<TField>) => {
  const { t } = useTranslation(['calendar']);

  const { allDayEvent, startDate, startTime, recurrenceEnum, ends } = useWatch({
    control,
  });

  useEffect(() => {
    const startDateAsDayjs = dayjs(startDate as dayjs.Dayjs);

    setValue(
      'startTime' as Path<TField>,
      (allDayEvent
        ? startDateAsDayjs.set('hour', ALL_DAY_START_TIME).set('minutes', 0)
        : startDateAsDayjs) as PathValue<TField, Path<TField>>
    );
    setValue(
      'endTime' as Path<TField>,
      (allDayEvent
        ? startDateAsDayjs.set('hour', ALL_DAY_END_TIME).set('minutes', 0)
        : startDateAsDayjs.add(MINIMUM_EVENT_DURATION, 'minutes')) as PathValue<
        TField,
        Path<TField>
      >
    );

    const resetEndField = (endField: 'occurrences' | 'endDate') => {
      setValue(
        endField as Path<TField>,
        null as PathValue<TField, Path<TField>>
      );
    };

    if (recurrenceEnum === RecurrenceEnum.NoRecurrence) {
      resetEndField('occurrences');
      resetEndField('endDate');
    }

    if (ends === 'after') {
      resetEndField('endDate');
    }

    if (ends === 'on') {
      resetEndField('occurrences');
    }
  }, [allDayEvent, startDate, recurrenceEnum, ends]);

  return (
    <>
      <Stack direction="column" gap={1.5}>
        <RHFSwitch<TField>
          label={t('calendar:inputLabels.allDay')}
          switchProps={{ color: 'primary' }}
          controlProps={{ name: 'allDayEvent' as Path<TField>, control }}
        />

        <Stack direction="row" gap={1}>
          <RHFDatePicker<TField>
            label={t('calendar:inputLabels.startDate')}
            inputProps={{ fullWidth: true }}
            controlProps={{ name: 'startDate' as Path<TField>, control }}
          />

          {!allDayEvent && (
            <Stack direction="row" gap={1} width="100%">
              <RHFTimePicker<TField>
                label={t('calendar:inputLabels.startTime')}
                controlProps={{ name: 'startTime' as Path<TField>, control }}
              />
              <RHFTimePicker<TField>
                label={t('calendar:inputLabels.endTime')}
                timePickerProps={{
                  minTime: dayjs(startTime as dayjs.Dayjs).add(
                    MINIMUM_EVENT_DURATION,
                    'minutes'
                  ),
                }}
                controlProps={{ name: 'endTime' as Path<TField>, control }}
              />
            </Stack>
          )}
        </Stack>
      </Stack>

      <RHFSelect<TField, RecurrenceEnum>
        label={t('calendar:inputLabels.schedule')}
        options={recurrenceOptions}
        getOptionLabel={(option) =>
          t(`calendar:inputLabels.recurrenceEnum.${option}`, {
            day: dayjs(startDate as dayjs.Dayjs).format('dddd'),
          })
        }
        controlProps={{
          name: 'recurrenceEnum' as Path<TField>,
          control,
        }}
      />

      {recurrenceEnum !== RecurrenceEnum.NoRecurrence && (
        <RHFRadioGroup<TField, EndsOption>
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
                  <RHFDatePicker<TField>
                    inputProps={{
                      variant: 'filled',
                      size: 'small',
                      hiddenLabel: true,
                      disabled: option.value !== ends,
                    }}
                    controlProps={{
                      name: 'endDate' as Path<TField>,
                      control,
                    }}
                  />
                )}
                {option.value === 'after' && (
                  <RHFTextField<TField>
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
                      name: 'occurrences' as Path<TField>,
                      control,
                    }}
                  />
                )}
              </Box>
            </Stack>
          )}
          controlProps={{
            name: 'ends' as Path<TField>,
            control,
          }}
        />
      )}
    </>
  );
};
