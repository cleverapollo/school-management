import {
  Button,
  DialogTitle,
  Stack,
  DialogActions,
  Dialog,
} from '@mui/material';
import {
  RHFAutocomplete,
  RHFColorPicker,
  RHFTextField,
  ValidationError,
  useFormValidator,
  validations,
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
} from '@tyro/api';
import {
  CalendarParty,
  useParticipantsSearchProps,
} from '../../../../hooks/use-participants-search-props';
import { ScheduleEventFormState, ScheduleEvent } from './schedule-event';
import {
  RoomLocationOptions,
  RoomLocationOption,
} from './room-location-options';
import { useCreateCalendarEvent } from '../../../../api/add-event';

export interface CalendarEditEventFormState extends ScheduleEventFormState {
  eventId?: string;
  name: string;
  description: string;
  colour: Colour;
  location: RoomLocationOption;
  participants: CalendarParty[];
}

type CalendarEventViewProps = {
  initialEventState?: Partial<CalendarEditEventFormState> | null;
  onClose: () => void;
};

const MINIMUM_DURATION = 5;

export const CalendarEditEventDetailsModal = ({
  initialEventState,
  onClose,
}: CalendarEventViewProps) => {
  const { t } = useTranslation(['calendar', 'common']);

  const { mutate: createCalendarEventMutation, isLoading: isSubmitting } =
    useCreateCalendarEvent();

  const { resolver, rules } = useFormValidator<CalendarEditEventFormState>();
  const { control, handleSubmit, setValue } =
    useForm<CalendarEditEventFormState>({
      resolver: resolver({
        name: rules.required(),
        allDayEvent: rules.required(),
        startDate: [rules.required(), rules.date()],
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
                dayjs(endTime).diff(startTime, 'minutes') < MINIMUM_DURATION
              ) {
                throwError(
                  t('calendar:errorMessages.minEventDuration', {
                    time: MINIMUM_DURATION,
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
                  validations.required(endDate);
                } catch (error) {
                  throwError(t('common:errorMessages.required'));
                }
              }
            }
          ),
        ],
        participants: rules.required(),
        location: rules.required(),
        colour: rules.required(),
      }),
      defaultValues: {
        startDate: dayjs(),
        startTime: dayjs(),
        endTime: dayjs().add(MINIMUM_DURATION, 'minutes'),
        recurrenceEnum: RecurrenceEnum.NoRecurrence,
        colour: Colour.Red,
      },
    });

  const participantsProps = useParticipantsSearchProps();

  const onSubmit = ({
    startDate,
    startTime,
    endTime,
    endDate,
    occurrences,
    participants,
    location,
    ...restData
  }: CalendarEditEventFormState) => {
    createCalendarEventMutation(
      {
        events: [
          {
            ...restData,
            type: CalendarEventType.General,
            startDate: startDate.format('YYYY-MM-DD'),
            startTime: startTime.format('HH:mm'),
            endTime: endTime.format('HH:mm'),
            endDate: endDate ? endDate.format('YYYY-MM-DD') : null,
            occurrences: occurrences ? Number(occurrences) : null,
            attendees: participants.map(({ partyId }) => ({
              partyId,
              type: CalendarEventAttendeeType.Attendee,
              // TODO: remove when tags are non mandatory
              tags: [],
            })),
            rooms: [
              {
                roomId: location.roomId,
                // TODO: remove when tags are non mandatory
                tags: [],
              },
            ],
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
    <Dialog open={!!initialEventState} onClose={onClose}>
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

          <ScheduleEvent
            minimumDuration={MINIMUM_DURATION}
            setValue={setValue}
            control={control}
          />

          <RHFAutocomplete<CalendarEditEventFormState, CalendarParty>
            {...participantsProps}
            controlProps={{
              name: 'participants',
              control,
            }}
          />

          <RoomLocationOptions control={control} />

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
          {/* {!isCreating && (
              <Tooltip title="Delete Event">
                <IconButton onClick={handleDelete}>
                  <Iconify icon="eva:trash-2-outline" width={20} height={20} />
                </IconButton>
              </Tooltip>
            )} */}

          <Button variant="outlined" color="inherit" onClick={onClose}>
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
    </Dialog>
  );
};
