import {
  Box,
  IconButton,
  Popover,
  Stack,
  Typography,
  styled,
  Tooltip,
} from '@mui/material';
import {
  CloseIcon,
  EditIcon,
  ExternalLinkIcon,
  LocationIcon,
  PersonCheckmarkIcon,
  UserGroupTwoIcon,
} from '@tyro/icons';
import { useTranslation } from '@tyro/i18n';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { Avatar, orderByValue, usePreferredNameLayout } from '@tyro/core';
import { useCallback, useMemo } from 'react';
import { CalendarEventAttendeeType, CalendarEventType } from '@tyro/api';
import { Link } from 'react-router-dom';
import { Attendee } from '../../../@types/calendar';
import { ExtendedEventInput } from '../../../api/events';
import { getPartyAvatarUrl, getPartyName } from '../../../utils/get-party-name';
import { CalendarEditEventFormState } from './edit-event-details-modal';

dayjs.extend(LocalizedFormat);

interface CalendarDetailsPopoverProps {
  eventElementRef: HTMLElement | null;
  event: ExtendedEventInput | undefined;
  onClose: () => void;
  onEdit: (eventToEdit: Partial<CalendarEditEventFormState>) => void;
}

const IconContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: 48,
  justifyContent: 'center',
  alignItems: 'center',
  color: theme.palette.text.primary,
}));

function FormattedDateAndTime({
  allDay,
  startDateTime,
  endDateTime,
}: {
  allDay: boolean;
  startDateTime: string | Date;
  endDateTime: string | Date;
}) {
  const start = dayjs(startDateTime);
  const end = dayjs(endDateTime);

  if (allDay) {
    return <>{start.format('LL')}</>;
  }

  const dash = (
    <Box
      component="span"
      sx={{
        mx: 0.25,
      }}
    >
      -
    </Box>
  );

  if (start.isSame(end, 'day')) {
    return (
      <>
        {start.format('LL [⋅] LT')} {dash} {end.format('LT')}
      </>
    );
  }

  return (
    <>
      {start.format('LLL')} {dash} {end.format('LLL')}
    </>
  );
}

function getAttendeeAvatarSrc(partyInfo: Attendee['partyInfo']) {
  if (!partyInfo) return undefined;

  switch (partyInfo.__typename) {
    case 'GeneralGroup':
    case 'SubjectGroup':
      return partyInfo.avatarUrl ?? undefined;
    case 'Staff':
    case 'Student':
      return partyInfo.person.avatarUrl ?? undefined;
    default:
      return undefined;
  }
}

export function CalendarDetailsPopover({
  eventElementRef,
  onClose,
  onEdit,
  event,
}: CalendarDetailsPopoverProps) {
  const { t } = useTranslation(['common', 'calendar']);
  const { displayName } = usePreferredNameLayout();

  const sortedParticipants = useMemo(
    () =>
      orderByValue(
        event?.originalEvent?.attendees ?? [],
        (participant) => participant.type,
        {
          [CalendarEventAttendeeType.Organiser]: 0,
          [CalendarEventAttendeeType.Additional]: 1,
          [CalendarEventAttendeeType.Attendee]: 2,
        }
      ),
    [event?.originalEvent?.attendees]
  );

  const handleEdit = useCallback(() => {
    if (event) {
      const { startTime, endTime, rooms, ...restData } = event.originalEvent;

      onEdit({
        ...restData,
        // TODO: pass down the recurrenceEnum, and occurrences when BE sends them.
        startDate: dayjs(startTime),
        startTime: dayjs(startTime),
        endDate: dayjs(endTime),
        endTime: dayjs(endTime),
        locations: rooms,
        participants: sortedParticipants.map(
          ({ partyId, partyInfo, type }) => ({
            partyId,
            attendeeType: type,
            avatarUrl: getPartyAvatarUrl(partyInfo),
            text: getPartyName(partyInfo, displayName),
          })
        ),
      });
    }
  }, [event, onEdit, sortedParticipants]);

  return (
    <Popover
      open={!!eventElementRef}
      anchorEl={eventElementRef}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'center',
        horizontal: 'right',
      }}
      slotProps={{
        paper: {
          sx: { p: 1, minWidth: 280 },
        },
      }}
    >
      <Stack direction="row" justifyContent="flex-end">
        {event?.originalEvent?.type === CalendarEventType.Lesson && (
          <Tooltip title={t('calendar:takeAttendance')}>
            <IconButton
              component={Link}
              aria-label={t('calendar:takeAttendance')}
              size="small"
              to={`/groups/subject/${
                event?.originalEvent?.lessonInfo?.subjectGroupId ?? ''
              }/attendance?eventStartTime=${event?.originalEvent?.startTime}`}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 24,
                  height: 24,
                }}
              >
                <PersonCheckmarkIcon
                  sx={{
                    width: 16,
                    height: 16,
                  }}
                />
              </Box>
            </IconButton>
          </Tooltip>
        )}

        {event?.originalEvent?.type === CalendarEventType.Lesson && (
          <Tooltip title={t('calendar:goToSubjectGroup')}>
            <IconButton
              component={Link}
              aria-label={t('calendar:goToSubjectGroup')}
              size="small"
              to={`/groups/subject/${
                event?.originalEvent?.lessonInfo?.subjectGroupId ?? ''
              }`}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 24,
                  height: 24,
                }}
              >
                <ExternalLinkIcon
                  sx={{
                    width: 16,
                    height: 16,
                  }}
                />
              </Box>
            </IconButton>
          </Tooltip>
        )}

        {event?.editable && (
          <Tooltip title={t('common:actions.edit')}>
            <IconButton
              aria-label={t('common:actions.edit')}
              size="small"
              onClick={handleEdit}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        )}

        <IconButton
          aria-label={t('common:actions.close')}
          size="small"
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </Stack>
      <Stack direction="row" paddingRight={1.5}>
        <IconContainer
          sx={{
            height: 28,
          }}
        >
          <Box
            sx={{
              backgroundColor: event?.borderColor,
              width: 16,
              height: 16,
              borderRadius: 0.75,
            }}
          />
        </IconContainer>
        <Stack>
          <Typography variant="h6" component="h2">
            {event?.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            <FormattedDateAndTime
              allDay={Boolean(event?.allDay)}
              startDateTime={event?.start ?? ''}
              endDateTime={event?.end ?? ''}
            />
          </Typography>
        </Stack>
      </Stack>
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          my: 2,
        }}
      >
        <IconContainer>
          <LocationIcon aria-label={t('calendar:room')} />
        </IconContainer>
        <Typography variant="body2" color="text.secondary">
          {event?.room ?? '-'}
        </Typography>
      </Stack>
      <Stack
        direction="row"
        sx={{
          mt: 1.5,
          mb: 2,
        }}
      >
        <IconContainer sx={{ height: 30 }}>
          <UserGroupTwoIcon aria-label={t('calendar:participants')} />
        </IconContainer>
        <Stack>
          <Typography component="h3" variant="subtitle2" sx={{ py: 0.5 }}>
            {t('calendar:numberOfParticipants', {
              count: sortedParticipants.length ?? 0,
            })}
          </Typography>
          {sortedParticipants.length > 0 && (
            <Stack spacing={1.25} sx={{ mt: 0.5 }}>
              {sortedParticipants.map(({ partyId, partyInfo }) => {
                const partyName = getPartyName(partyInfo, displayName);
                return (
                  <Stack
                    direction="row"
                    key={partyId}
                    spacing={1}
                    alignItems="center"
                  >
                    <Avatar
                      name={partyName}
                      src={getAttendeeAvatarSrc(partyInfo)}
                      sx={{
                        width: 32,
                        height: 32,
                        fontSize: '0.75rem',
                      }}
                    />
                    <Stack>
                      <Typography variant="body2" color="text.primary">
                        {partyName}
                      </Typography>
                      {partyInfo?.__typename && (
                        <Typography variant="caption" color="text.secondary">
                          {t(`calendar:attendeeType.${partyInfo.__typename}`)}
                        </Typography>
                      )}
                    </Stack>
                  </Stack>
                );
              })}
            </Stack>
          )}
        </Stack>
      </Stack>
    </Popover>
  );
}
