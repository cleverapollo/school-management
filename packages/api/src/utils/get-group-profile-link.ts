import { PartyGroup, PartyGroupType } from '../gql/graphql';

export function getGroupProfileLink(
  group: (Pick<PartyGroup, 'partyId'> & { type: PartyGroupType }) | undefined
) {
  switch (group?.type) {
    case PartyGroupType.YearGroup:
      return `/groups/year/${group.partyId}`;
    case PartyGroupType.ClassGroup:
      return `/groups/class/${group.partyId}`;
    case PartyGroupType.SubjectGroup:
      return `/groups/subject/${group.partyId}`;
    case PartyGroupType.SupportGroup:
      return `/groups/support/${group.partyId}`;
    case PartyGroupType.CustomGroup:
      return `/groups/custom/${group.partyId}`;
    default:
      return null;
  }
}
