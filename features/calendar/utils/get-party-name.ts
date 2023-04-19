import { Calendar_CalendarEventsQuery } from '@tyro/api';
import { ReturnTypeDisplayName } from '@tyro/core';
import { Attendee, PartyResource } from '../src/@types/calendar';

export function getPartyName(
  partyInfo: Attendee['partyInfo'] | PartyResource['partyInfo'],
  getDisplayName: ReturnTypeDisplayName
) {
  if (!partyInfo) return '';

  switch (partyInfo.__typename) {
    case 'GeneralGroup':
      return partyInfo.name;
    case 'Staff':
      return getDisplayName(partyInfo.person);
    case 'Student':
      return getDisplayName(partyInfo.person);
    case 'SubjectGroup':
      return partyInfo.name;
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
