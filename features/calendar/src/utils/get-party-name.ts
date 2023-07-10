import { Calendar_CalendarEventsQuery } from '@tyro/api';
import { ReturnTypeDisplayName } from '@tyro/core';
import { Attendee, PartyResource } from '../@types/calendar';

export function getPartyName(
  partyInfo: Attendee['partyInfo'] | PartyResource['partyInfo'],
  getDisplayName: ReturnTypeDisplayName
) {
  if (!partyInfo) return '';

  switch (partyInfo.__typename) {
    case 'GeneralGroup':
    case 'SubjectGroup':
    case 'YearGroupEnrollment':
    case 'ProgrammeStageEnrollment':
      return partyInfo.name;
    case 'Staff':
    case 'Student':
      return getDisplayName(partyInfo.person);
    default:
      return '';
  }
}

export function getPartyAvatarUrl(
  partyInfo: Attendee['partyInfo'] | PartyResource['partyInfo']
) {
  if (!partyInfo) return '';

  switch (partyInfo.__typename) {
    case 'GeneralGroup':
    case 'SubjectGroup':
      return partyInfo.avatarUrl;
    case 'Staff':
    case 'Student':
      return partyInfo.person.avatarUrl;
    default:
      return '';
  }
}

export function getResourceName(
  resource: NonNullable<
    Calendar_CalendarEventsQuery['calendar_calendarEvents']
  >['resources'][number],
  getDisplayName: ReturnTypeDisplayName
) {
  if (resource.__typename === 'PartyCalendar' && resource.partyInfo) {
    return getPartyName(resource.partyInfo, getDisplayName);
  }

  if (resource.__typename === 'RoomCalendar' && resource.room) {
    return resource.room.name;
  }

  return '';
}
