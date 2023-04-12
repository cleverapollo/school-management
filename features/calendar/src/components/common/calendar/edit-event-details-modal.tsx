import {
  Button,
  DialogTitle,
  Stack,
  DialogActions,
  Dialog,
} from '@mui/material';
import {
  RHFColorPicker,
  RHFDateTimePicker,
  RHFSelect,
  RHFSwitch,
  RHFTextField,
  useFormValidator,
  usePreferredNameLayout,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LoadingButton } from '@mui/lab';

export interface CalendarEditEventFormState {
  eventId?: string;
  title: string;
  description: string;
  color: string;
  allDay: boolean;
  location: string;
  schedule: string;
  start: dayjs.Dayjs | null;
  end: dayjs.Dayjs | null;
  participants: Array<{
    id?: string;
    name: string;
    avatarUrl?: string;
    email?: string;
  }>;
}

type CalendarEventViewProps = {
  initialEventState?: Partial<CalendarEditEventFormState> | null;
  onCancel: () => void;
};

const scheduleOptions = [
  {
    name: 'norepeat',
    label: "Doesn't repeat",
  },
  {
    name: 'daily',
    label: 'Daily',
  },
  {
    name: 'weekly',
    label: 'Weekly on Monday',
  },
  {
    name: 'monthly',
    label: 'Monthly on the first Monday',
  },
  {
    name: 'annually',
    label: 'Annually on November 7',
  },
  {
    name: 'everyWeekday',
    label: 'Every weekday(Monday to Friday)',
  },
  {
    name: 'custom',
    label: 'Custom...',
  },
];

export const CalendarEditEventDetailsModal = ({
  initialEventState,
  onCancel,
}: CalendarEventViewProps) => {
  const { t } = useTranslation(['calendar', 'common']);
  const { displayName } = usePreferredNameLayout();
  const { resolver, rules } = useFormValidator<CalendarEditEventFormState>();

  const { reset, control, handleSubmit } = useForm<CalendarEditEventFormState>({
    resolver: resolver({
      title: rules.required(),
      description: rules.required(),
      color: rules.required(),
      allDay: rules.required(),
      location: rules.required(),
      schedule: rules.required(),
      start: rules.required(),
      end: [rules.required(), rules.afterStartDate('start')],
    }),
  });

  const onSubmit = (data: CalendarEditEventFormState) => {
    console.log(data);
  };

  useEffect(() => {
    if (initialEventState) {
      reset({
        color: 'red',
        ...initialEventState,
      });
    }
  }, [initialEventState]);

  return (
    <Dialog open={!!initialEventState} onClose={onCancel}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DialogTitle>
          {initialEventState?.eventId
            ? t('calendar:editEvent')
            : t('calendar:addEvent')}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField<CalendarEditEventFormState>
              label={t('calendar:inputLabels.title')}
              controlProps={{
                name: 'title',
                control,
              }}
            />

            <Stack direction="row" gap={2}>
              <RHFDateTimePicker<CalendarEditEventFormState>
                label={t('common:startDate')}
                controlProps={{ name: 'start', control }}
              />
              <RHFDateTimePicker<CalendarEditEventFormState>
                label={t('common:endDate')}
                controlProps={{ name: 'end', control }}
              />
            </Stack>

            <RHFSwitch<CalendarEditEventFormState>
              label={t('calendar:inputLabels.allDay')}
              switchProps={{ color: 'primary' }}
              controlProps={{ name: 'allDay', control }}
            />

            <RHFSelect<
              CalendarEditEventFormState,
              (typeof scheduleOptions)[number]
            >
              label={t('calendar:inputLabels.schedule')}
              options={scheduleOptions}
              optionIdKey="name"
              getOptionLabel={(option) => option.label}
              controlProps={{
                name: 'schedule',
                control,
              }}
            />

            {/* Look at adding participants + rooms when we get resource endpoint */}
            {/* <ParticipantInput
              participants={participants}
              setParticipants={setParticipants}
            /> */}

            {/* <RHFSelect
              name="location"
              label={t('calendar:inputLabels.location')}
              // @ts-expect-error
              customControl={control}
            >
              {LocationOptions.map((option) => (
                <MenuItem value={option.name}>{option.label}</MenuItem>
              ))}
            </RHFSelect> */}

            <RHFTextField<CalendarEditEventFormState>
              label={t('calendar:inputLabels.description')}
              controlProps={{
                name: 'description',
                control,
              }}
              textFieldProps={{
                multiline: true,
                rows: 4,
              }}
            />

            <RHFColorPicker<CalendarEditEventFormState>
              label={t('calendar:inputLabels.eventColor')}
              controlProps={{
                name: 'color',
                control,
              }}
            />
          </Stack>

          <DialogActions>
            {/* {!isCreating && (
              <Tooltip title="Delete Event">
                <IconButton onClick={handleDelete}>
                  <Iconify icon="eva:trash-2-outline" width={20} height={20} />
                </IconButton>
              </Tooltip>
            )} */}

            <Button variant="outlined" color="inherit" onClick={onCancel}>
              {t('common:actions.cancel')}
            </Button>

            <LoadingButton
              type="submit"
              variant="contained"
              // loading={isSubmitting}
            >
              {t('common:actions.add')}
            </LoadingButton>
          </DialogActions>
        </form>
      </LocalizationProvider>
    </Dialog>
  );
};
