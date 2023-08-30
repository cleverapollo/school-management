import { Button, Stack } from '@mui/material';
import {
  RHFAutocomplete,
  RHFColorPicker,
  RHFTextField,
  ValidationError,
  useFormValidator,
  validations,
  DialogActions,
  Dialog,
  DialogTitle,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import {
  CalendarEventAttendeeType,
  CalendarEventType,
  Colour,
  RecurrenceEnum,
  CreateCalendarEventInput,
} from '@tyro/api';
import { useEffect } from 'react';
import {
  CalendarParty,
  useParticipantsSearchProps,
} from '../../../../hooks/use-participants-search-props';
import { ScheduleEventFormState, ScheduleEvent } from './schedule-event';
import {
  RoomLocationOptions,
  RoomLocationFormState,
} from './room-location-options';
import { useCreateCalendarEvent } from '../../../../api/add-event';
import { MINIMUM_EVENT_DURATION } from './constants';
import { useGetRecurrenceFilter } from './hooks/use-get-recurrence-filter';

export type CalendarEditEventFormState = Pick<
  CreateCalendarEventInput,
  'calendarIds' | 'name' | 'description' | 'colour'
> & {
  eventId?: number;
  participants: CalendarParty[];
} & RoomLocationFormState &
  ScheduleEventFormState;

export type CalendarEventViewProps = {
  initialEventState?: Partial<CalendarEditEventFormState> | null;
  onClose: () => void;
};

export const CalendarEditEventDetailsModal = ({
  initialEventState,
  onClose,
}: CalendarEventViewProps) => {
  const { t } = useTranslation(['calendar', 'common']);

  const participantsProps = useParticipantsSearchProps();

  const {
    mutate: createCalendarEventMutation,
    isLoading: isSubmitting,
    isSuccess: isSubmitSuccessful,
  } = useCreateCalendarEvent();

  const { resolver, rules } = useFormValidator<CalendarEditEventFormState>();

  const defaultFormStateValues: Partial<CalendarEditEventFormState> = {
    startDate: dayjs(),
    startTime: dayjs(),
    endTime: dayjs().add(MINIMUM_EVENT_DURATION, 'minutes'),
    recurrenceEnum: RecurrenceEnum.NoRecurrence,
    colour: Colour.Red,
  };

  const { control, handleSubmit, watch, reset } =
    useForm<CalendarEditEventFormState>({
      resolver: resolver({
        name: rules.required(),
        allDayEvent: rules.required(),
        startDate: [rules.date(), rules.required()],
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
          rules.validate<CalendarEditEventFormState['endTime']>(
            (endTime, throwError, { startTime }) => {
              if (
                dayjs(endTime).diff(startTime, 'minutes') <
                MINIMUM_EVENT_DURATION
              ) {
                throwError(
                  t('calendar:errorMessages.minEventDuration', {
                    time: MINIMUM_EVENT_DURATION,
                  })
                );
              }
            }
          ),
        ],
        recurrenceEnum: rules.required(),
        ends: rules.required(),
        occurrences: rules.validate<CalendarEditEventFormState['occurrences']>(
          (occurrences, throwError, { ends }) => {
            if (ends === 'after') {
              try {
                validations.required(
                  occurrences,
                  t('common:errorMessages.required')
                );
                validations.min(
                  occurrences ?? 0,
                  1,
                  t('common:errorMessages.min', { number: 1 })
                );
              } catch (error) {
                throwError((error as ValidationError).message);
              }
            }
          }
        ),
        endDate: [
          rules.date(),
          rules.validate<CalendarEditEventFormState['endDate']>(
            (endDate, throwError, { ends }) => {
              if (ends === 'on') {
                try {
                  validations.required(
                    endDate,
                    t('common:errorMessages.required')
                  );
                } catch (error) {
                  throwError((error as ValidationError).message);
                }
              }
            }
          ),
        ],
        participants: rules.required(),
        locations: rules.required(),
        colour: rules.required(),
      }),
      defaultValues: defaultFormStateValues,
      mode: 'onChange',
    });

  useEffect(() => {
    if (initialEventState) {
      reset({ ...defaultFormStateValues, ...initialEventState });
    }
  }, [initialEventState]);

  useEffect(() => {
    reset();
  }, [isSubmitSuccessful]);

  const handleClose = () => {
    onClose();
    reset();
  };

  const [
    allDayEvent,
    startDate,
    startTime,
    endTime,
    recurrenceEnum,
    occurrences,
    endDate,
  ] = watch([
    'allDayEvent',
    'startDate',
    'startTime',
    'endTime',
    'recurrenceEnum',
    'occurrences',
    'endDate',
  ]);

  const recurrenceFilter = useGetRecurrenceFilter({
    allDayEvent,
    startDate,
    startTime,
    endTime,
    recurrenceEnum,
    occurrences,
    endDate,
  });

  const onSubmit = ({
    participants,
    locations,
    ...restEventData
  }: CalendarEditEventFormState) => {
    if (!recurrenceFilter) return;

    console.log('location', locations);

    // TODO: edition mutation is not ready yet
    if (restEventData.eventId) {
      console.log('edit event', restEventData);
      return onClose();
    }

    createCalendarEventMutation(
      {
        events: [
          {
            ...restEventData,
            type: CalendarEventType.General,
            startDate: recurrenceFilter.fromDate,
            startTime: recurrenceFilter.startTime,
            endTime: recurrenceFilter.endTime,
            endDate: recurrenceFilter.endDate ?? null,
            occurrences: recurrenceFilter.occurrences ?? null,
            attendees: participants.map(({ partyId, attendeeType }) => ({
              partyId,
              type: attendeeType ?? CalendarEventAttendeeType.Attendee,
              // TODO: remove when tags are non mandatory
              tags: [],
            })),
            rooms: locations.map(({ roomId }) => ({
              roomId,
              // TODO: remove when tags are non mandatory
              tags: [],
            })),
            // TODO: remove when tags are non mandatory
            tags: [],
          },
        ],
      },
      {
        onSuccess: onClose,
        // TODO: handle error message from server
        onError: (error) => {
          console.error(error);
        },
      }
    );
  };

  return (
    <Dialog open={!!initialEventState} onClose={handleClose}>
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
              name: 'name',
              control,
            }}
          />

          <ScheduleEvent control={control} />

          <RHFAutocomplete<CalendarEditEventFormState, CalendarParty, true>
            {...participantsProps}
            controlProps={{
              name: 'participants',
              control,
            }}
          />

          <RoomLocationOptions
            recurrenceFilter={recurrenceFilter}
            control={control}
          />

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
              name: 'colour',
              control,
            }}
          />
        </Stack>

        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={handleClose}>
            {t('common:actions.cancel')}
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            {initialEventState?.eventId
              ? t('common:actions.edit')
              : t('common:actions.add')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};
