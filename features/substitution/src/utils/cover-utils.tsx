import { ReturnTypeFromUseEventsForCover } from '../api/staff-work-events-for-cover';
import { CoverEvent } from '../hooks/use-cover-table';

export function getCurrentCoverRoom({ event, substitution }: CoverEvent) {
  return (
    substitution?.substituteRoom?.name ??
    event.rooms?.map(({ name }) => name).join(', ') ??
    ''
  );
}

export type StaffAttendee = {
  partyInfo: Extract<
    ReturnTypeFromUseEventsForCover[number]['substitutionEventsByDay'][number]['substitutionEventsByPeriod'][number]['event']['attendees'][number]['partyInfo'],
    { __typename: 'Staff' }
  >;
};

export function getAdditionalStaff(eventInfo: CoverEvent) {
  const { substitution } = eventInfo;
  const { substituteStaff } = substitution ?? {};

  return eventInfo?.event?.attendees
    ?.filter((attendee) => {
      const partyInfo = attendee?.partyInfo;
      const partyId =
        partyInfo?.__typename === 'Staff'
          ? partyInfo.person?.partyId
          : undefined;
      return (
        partyId &&
        partyId !== eventInfo.staffPartyId &&
        partyId !== substituteStaff?.partyId
      );
    })
    .map((attendee) => {
      const staffAttendee = attendee as StaffAttendee;
      return staffAttendee?.partyInfo?.person;
    });
}
