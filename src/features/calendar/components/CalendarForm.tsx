import * as Yup from 'yup';
import merge from 'lodash/merge';
import { useSnackbar } from 'notistack';
import { EventInput } from '@fullcalendar/common';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Stack, Button, Tooltip, TextField, IconButton, DialogActions, MenuItem, DialogTitle } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
// components
import Iconify from '../../../components/Iconify';
import { ColorSinglePicker } from '../../../components/color-utils';
import { FormProvider, RHFTextField, RHFSwitch, RHFSelect } from '../../../components/hook-form';
import { useCreateCalendarEvents, useDeleteCalendarEvents } from '../api/events';
import { CalendarEventType, CreateCalendarEventsInput, CalendarEventAttendeeType, Maybe } from '@tyro/api/src/gql/graphql';
import { localDateStringToCalendarDate } from '../../../utils/formatTime';
import { useState } from 'react';
import ParticipantInput from './ParticipantInput';
import { DialogAnimate } from '../../../components/animate';

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

const getInitialValues = (event: EventInput, range: { start: Date; end: Date } | null) => {
  const _event = {
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
    return merge({}, _event, event);
  }

  return _event;
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

//ToDo: add this options to the request
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

//ToDo: remove this, when search api for location will be implemented
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
  partyId: string;
  type: CalendarEventAttendeeType;
  partyInfo?: {
    firstName?: string;
    lastName?: string;
    name?: string;
  }
}

export default function CalendarForm({ event, range, onCancel, isOpenModal }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const { mutate: deleteCalendarEvent } = useDeleteCalendarEvents();

  const isCreating = Object.keys(event).length === 0;

  const EventSchema = Yup.object().shape({
    title: Yup.string().max(255).required('Title is required'),
    description: Yup.string().max(500),
    start: Yup.date(),
    end: Yup.date().when('start', (start) =>
      start ?
        Yup.date().min(start, 'End date must be later than start date') :
        Yup.date()
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

  const onSubmit = async (data: FormValuesProps) => {
    try {
      //ToDo: after backend is finished, change mocks for real data
      const dataEvent: CreateCalendarEventsInput = {
        events: [{
        startDate: localDateStringToCalendarDate(data.start?.toLocaleDateString() ?? ''),
        startTime: data.allDay ? '00:00:00' : data.start?.toLocaleTimeString(),
        endDate: localDateStringToCalendarDate(data.end?.toLocaleDateString() ?? ''),
        endTime: data.allDay ? '23:59:00' : data.end?.toLocaleTimeString(),
        rooms: [
          { roomId: +data.location },
        ],
        //ToDo: fix fields below after backend will be ready
        calendarIds: [1],
        type: CalendarEventType.Lesson,
        lessonInfo: {
          lessonId: 1,
          subjectGroupId: 2270,
        },
        attendees: [
          {
            partyId: "610",
            type: CalendarEventAttendeeType.Organiser,
          },
          {
            "partyId": "2270",
            "type": CalendarEventAttendeeType.Attendee,
          },
          ...participants,
        ],
        }
      ]};

      if (!event.id) {
        enqueueSnackbar('Create success!');
        createCalendarEvent(dataEvent);
        onCancel();
        reset();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!event.id) return;
    try {
      onCancel();
      deleteCalendarEvent(event.id);
      enqueueSnackbar('Delete success!');
    } catch (error) {
      console.error(error);
    }
  };

  return (
  <DialogAnimate open={isOpenModal} onClose={onCancel} sx={{ maxWidth: '750px !important' }}>
    <DialogTitle>{'Add Event'}</DialogTitle>
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} sx={{ p: 3 }}>
        <RHFTextField name="title" label="Title" customControl={control}/>

        <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
        <Controller
          name="start"
          control={control}
          render={({ field }) => (
            <MobileDateTimePicker
              {...field}
              label="Start date"
              inputFormat="dd/MM/yyyy hh:mm a"
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          )}
        />
        <Box sx={{ width: '15%' }}/>

        <Controller
          name="end"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <MobileDateTimePicker
              {...field}
              label="End date"
              inputFormat="dd/MM/yyyy hh:mm a"
              renderInput={(params) => (
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

        <RHFSwitch name="allDay" label="All day" customControl={control}/>

        <Box sx={{ width: '40%' }}>
          <RHFSelect name="schedule" label="Schedule" customControl={control}>
            {Options.map((option) => <MenuItem value={option.name}>{option.label}</MenuItem>)}
          </RHFSelect>
        </Box>

        <ParticipantInput participants={participants} setParticipants={setParticipants}/>

        <RHFSelect name="location" label="Location" customControl={control}>
          {LocationOptions.map((option) => <MenuItem value={option.name}>{option.label}</MenuItem>)}
        </RHFSelect>

        <RHFTextField name="description" label="Description" multiline rows={4} customControl={control}/>

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
          Cancel
        </Button>

        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          Add
        </LoadingButton>
      </DialogActions>
    </form>
  </DialogAnimate>
  );
}
