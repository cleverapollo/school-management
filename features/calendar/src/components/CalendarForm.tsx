/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import * as Yup from 'yup';
import merge from 'lodash/merge';
import { useToast } from '@tyro/core';
import { EventInput } from '@fullcalendar/common';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Box,
  Stack,
  Button,
  Tooltip,
  TextField,
  IconButton,
  DialogActions,
  MenuItem,
  DialogTitle,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
// components
import {
  CalendarEventType,
  CreateCalendarEventsInput,
  CalendarEventAttendeeType,
} from '@tyro/api';
import { useState } from 'react';
import { useTranslation } from '@tyro/i18n';
import { Iconify } from '../../../../src/components/iconify';
import { ColorSinglePicker } from '../../../../src/components/color-utils';
import {
  RHFTextField,
  RHFSwitch,
  RHFSelect,
} from '../../../../src/components/hook-form';
import {
  useCreateCalendarEvents,
  useDeleteCalendarEvents,
} from '../api/events';
import { localDateStringToCalendarDate } from '../../../../src/utils/formatTime';
import ParticipantInput from './ParticipantInput';
import { DialogAnimate } from '../../../../src/components/animate';

// ----------------------------------------------------------------------

export const COLOR_OPTIONS = [
  '#00AB55', // theme.palette.primary.main,
  '#1890FF', // theme.palette.info.main,
  '#54D62C', // theme.palette.success.main,
  '#FFC107', // theme.palette.warning.main,
  '#FF4842', // theme.palette.error.main
  '#04297A', // theme.palette.info.darker
  '#7A0C2E', // theme.palette.error.darker
];

const getInitialValues = (
  event: EventInput,
  range: { start: Date; end: Date } | null
) => {
  const eventObject = {
    title: '',
    description: '',
    textColor: '#1890FF',
    allDay: false,
    start: range ? new Date(range.start) : new Date(),
    end: range ? new Date(range.end) : new Date(),
    location: '',
    schedule: 'norepeat',
    participants: [],
  };

  if (event || range) {
    return merge({}, eventObject, event);
  }

  return eventObject;
};

// ----------------------------------------------------------------------

type FormValuesProps = {
  title: string;
  description: string;
  textColor: string;
  allDay: boolean;
  location: string;
  schedule: string;
  start: Date | null;
  end: Date | null;
  participants: Array<{
    id?: string;
    name: string;
    avatarUrl?: string;
    email?: string;
  }>;
};

type Props = {
  event: EventInput;
  range: {
    start: Date;
    end: Date;
  } | null;
  onCancel: VoidFunction;
  isOpenModal: boolean;
};

// ToDo: add this options to the request
const Options = [
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

// ToDo: remove this, when search api for location will be implemented
const LocationOptions = [
  {
    name: '1',
    label: 'Room 1',
  },
  {
    name: '2',
    label: 'Room 2',
  },
  {
    name: '3',
    label: 'Room 3',
  },
];

export interface Participant {
  partyId: number;
  type: CalendarEventAttendeeType;
  partyInfo?: {
    firstName?: string;
    lastName?: string;
    name?: string;
  };
}

export default function CalendarForm({
  event,
  range,
  onCancel,
  isOpenModal,
}: Props) {
  const { t } = useTranslation(['calendar', 'common']);
  const { toast } = useToast();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const { mutate: deleteCalendarEvent } = useDeleteCalendarEvents();

  const isCreating = Object.keys(event).length === 0;

  const EventSchema = Yup.object().shape({
    title: Yup.string().max(255).required(t('calendar:errorMessages.title')),
    description: Yup.string().max(500),
    start: Yup.date(),
    end: Yup.date().when('start', (start) =>
      start
        ? Yup.date().min(start, t('calendar:errorMessages.date'))
        : Yup.date()
    ),
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValuesProps>({
    resolver: yupResolver(EventSchema),
    defaultValues: getInitialValues(event, range),
  });

  const { mutate: createCalendarEvent } = useCreateCalendarEvents();

  const onSubmit = (data: FormValuesProps) => {
    try {
      // ToDo: after backend is finished, change mocks for real data
      const dataEvent: CreateCalendarEventsInput = {
        events: [
          {
            startDate: localDateStringToCalendarDate(
              data.start?.toLocaleDateString() ?? ''
            ),
            startTime: data.allDay
              ? '00:00:00'
              : data.start?.toLocaleTimeString(),
            endDate: localDateStringToCalendarDate(
              data.end?.toLocaleDateString() ?? ''
            ),
            endTime: data.allDay ? '23:59:00' : data.end?.toLocaleTimeString(),
            rooms: [{ roomId: +data.location }],
            // ToDo: fix fields below after backend will be ready
            calendarIds: [1],
            type: CalendarEventType.Lesson,
            lessonInfo: {
              lessonId: 1,
              subjectGroupId: 2270,
            },
            attendees: [
              {
                partyId: 610,
                type: CalendarEventAttendeeType.Organiser,
              },
              {
                partyId: 2270,
                type: CalendarEventAttendeeType.Attendee,
              },
              ...participants,
            ],
          },
        ],
      };

      if (!event.id) {
        toast(t('common:snackbarMessages.createSuccess'));
        createCalendarEvent(dataEvent);
        onCancel();
        reset();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = () => {
    if (!event.id) return;
    try {
      onCancel();
      deleteCalendarEvent(event.id);
      toast(t('common:snackbarMessages.deleteSuccess'));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DialogAnimate
      open={isOpenModal}
      onClose={onCancel}
      sx={{ maxWidth: '750px !important' }}
    >
      <DialogTitle>Add Event</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} sx={{ p: 3 }}>
          {/* @ts-ignore */}
          <RHFTextField name="title" label={t('calendar:inputLabels.title')} customControl={control} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Controller
              name="start"
              control={control}
              render={({ field }) => (
                <MobileDateTimePicker
                  {...field}
                  label={t('calendar:inputLabels.startDate')}
                  inputFormat="dd/MM/yyyy hh:mm a"
                  // @ts-ignore
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              )}
            />
            <Box sx={{ width: '15%' }} />

            <Controller
              name="end"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <MobileDateTimePicker
                  {...field}
                  label={t('calendar:inputLabels.endDate')}
                  inputFormat="dd/MM/yyyy hh:mm a"
                  renderInput={(params) => (
                    // @ts-ignore
                    <TextField
                      {...params}
                      fullWidth
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              )}
            />
          </Box>

          {/* @ts-ignore */}
          <RHFSwitch name="allDay" label={t('calendar:inputLabels.allDay')} customControl={control} />

          <Box sx={{ width: '40%' }}>
            {/* @ts-ignore */}
            <RHFSelect name="schedule" label={t('calendar:inputLabels.schedule')} customControl={control}>
              {Options.map((option) => (
                <MenuItem value={option.name}>{option.label}</MenuItem>
              ))}
            </RHFSelect>
          </Box>

          <ParticipantInput
            participants={participants}
            setParticipants={setParticipants}
          />

          {/* @ts-ignore */}
          <RHFSelect name="location" label={t('calendar:inputLabels.location')} customControl={control}>
            {LocationOptions.map((option) => (
              <MenuItem value={option.name}>{option.label}</MenuItem>
            ))}
          </RHFSelect>

          <RHFTextField
            name="description"
            label={t('calendar:inputLabels.description')}
            multiline
            rows={4}
            // @ts-ignore
            customControl={control}
          />

          <Controller
            name="textColor"
            control={control}
            render={({ field }) => (
              <ColorSinglePicker
                value={field.value}
                onChange={field.onChange}
                colors={COLOR_OPTIONS}
              />
            )}
          />
        </Stack>

        <DialogActions>
          {!isCreating && (
            <Tooltip title="Delete Event">
              <IconButton onClick={handleDelete}>
                <Iconify icon="eva:trash-2-outline" width={20} height={20} />
              </IconButton>
            </Tooltip>
          )}
          <Box sx={{ flexGrow: 1 }} />

          <Button variant="outlined" color="inherit" onClick={onCancel}>
            {t('common:actions.cancel')}
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            {t('common:actions.add')}
          </LoadingButton>
        </DialogActions>
      </form>
    </DialogAnimate>
  );
}
