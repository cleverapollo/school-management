import { Calendar_CalendarEventsQuery } from '@tyro/api';

export type PartyResource = Extract<
  NonNullable<
    Calendar_CalendarEventsQuery['calendar_calendarEvents']
  >['resources'][number],
  { __typename: 'PartyCalendar' }
>;

export type Attendee = PartyResource['events'][number]['attendees'][number];

type ParticipantsPartyInfo = Extract<
  Attendee['partyInfo'],
  { __typename: 'Student' }
>;

export type CalendarEvent = PartyResource['events'][number];
export interface Participants extends Omit<Attendee, 'partyInfo'> {
  partyInfo: ParticipantsPartyInfo;
}

export interface IndividualAttendee extends Omit<Attendee, 'partyInfo'> {
  partyInfo: Extract<
    Attendee['partyInfo'],
    { __typename: 'Student' | 'Staff' | 'Person' }
  >;
}
