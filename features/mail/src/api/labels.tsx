import { useMutation, useQuery } from '@tanstack/react-query';
import {
  AssignLabelInput,
  gqlClient,
  graphql,
  InputMaybe,
  LabelInput,
  UnreadCountFilter,
  queryClient,
} from '@tyro/api';
import { labelsMap, LabelType } from '../constants';
import { MailLabel } from '../types';

const labels = graphql(/* GraphQL */ `
  query communications_label($filter: LabelFilter) {
    communications_label(filter: $filter) {
      id
      name
      personPartyId
      colour
      custom
    }
  }
`);

const updateLabel = graphql(/* GraphQL */ `
  mutation update_communications_label($input: LabelInput) {
    communications_saveLabel(input: $input) {
      id
      name
      personPartyId
      colour
      custom
    }
  }
`);

const unreadCountQuery = graphql(/* GraphQL */ `
  query communications_unreadCount($filter: UnreadCountFilter) {
    communications_unreadCount(filter: $filter) {
      labelId
      count
    }
  }
`);

const assignLabels = graphql(/* GraphQl */ `
  mutation communications_assignLabel($input: AssignLabelInput) {
    communications_assignLabel(input: $input) {
      id
      rootMailId
      threadId
      subject
      body
      senderPartyId
      sentOn
      latestMessage
      canReply
      starred
      readOn
      recipients {
        id
        recipientPartyId
        recipientType
        name
      }
      labels {
        id
        name
        personPartyId
        colour
        custom
      }
      threads {
        id
        rootMailId
        threadId
        subject
        body
        senderPartyId
        sentOn
        latestMessage
        canReply
        starred
        readOn
        recipients {
          id
          recipientPartyId
          recipientType
          name
        }
        labels {
          id
          name
          personPartyId
          colour
          custom
        }
      }
    }
  }
`);

export const labelsKeys = {
  all: ['label'] as const,
};

const calendarEventsQuery = {
  queryKey: labelsKeys.all,
  queryFn: async () => gqlClient.request(labels, {}),
};

export function getLabels() {
  return queryClient.fetchQuery(calendarEventsQuery);
}

export function useLabels() {
  return useQuery({
    ...calendarEventsQuery,
    select: ({ communications_label }) =>
      communications_label?.map(
        (item) =>
          ({
            originalId: item?.id,
            id: item?.id && item?.id < 5 ? labelsMap[item?.id] : undefined,
            type: !item?.custom ? LabelType.SYSTEM : LabelType.CUSTOM,
            name:
              (item?.name === 'Outbox'
                ? 'sent'
                : !item?.custom
                ? item?.name.toLowerCase()
                : item?.name) ?? '',
            unreadCount: 0,
            color: item?.colour,
          } ?? [])
      ) as MailLabel[],
  });
}

export function useUnreadCount(filter: InputMaybe<UnreadCountFilter>) {
  return useQuery({
    queryKey: ['unreadCount', filter],
    queryFn: async () => gqlClient.request(unreadCountQuery, { filter }),
    select: ({ communications_unreadCount }) => {
      const totalUnreadCount = communications_unreadCount?.reduce(
        (acc, item) =>
          Number.isInteger(item?.count) && item?.labelId === 1
            ? acc + item.count
            : acc,
        0
      );
      return { unreadCount: communications_unreadCount, totalUnreadCount };
    },
    enabled: !!filter?.personPartyId,
  });
}

export function useCreateLabel() {
  return useMutation({
    mutationKey: ['label'],
    mutationFn: async (input: InputMaybe<LabelInput>) =>
      gqlClient.request(updateLabel, { input }),
  });
}

export function useAssignLabel() {
  return useMutation({
    mutationKey: ['assignLabel'],
    mutationFn: async (input: InputMaybe<AssignLabelInput>) =>
      gqlClient.request(assignLabels, { input }),
  });
}
