import { useMutation, useQuery } from '@tanstack/react-query';
import { AssignLabelInput, gqlClient, graphql, InputMaybe, LabelInput, UnreadCountFilter } from '@tyro/api';
import { labelsMap, LABEL_TYPE } from '../constants';
import { MailLabel } from '../types';

const labels = graphql(/* GraphQL */ `
  query label($filter: LabelFilter){
    label(filter: $filter){
      id
      name
      personPartyId
      colour
      custom
    }
  }
`);

const label = graphql(/* GraphQL */ `
  mutation labelMutation($input: LabelInput){
    label(input: $input){
      id
      name
      personPartyId
      colour
      custom
    }
  }
`);

const unreadCount = graphql(/* GraphQL */ `
  query unreadCount($filter: UnreadCountFilter){
    unreadCount(filter: $filter){
      labelId
      count
    }
  }
`);

const assignLabels = graphql(/* GraphQl */ `
  mutation assignLabel($input: AssignLabelInput){
    assignLabel(input: $input){
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
      recipients{
        id
        recipientPartyId
        recipientType
        name
      }
      labels{
        id
        name
        personPartyId
        colour
        custom
      }
      threads{
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
        recipients{
          id
          recipientPartyId
          recipientType
          name
        }
        labels{
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

export function useLabels() {
  return useQuery({
    queryKey: ['label'],
    queryFn: async () => gqlClient.request(labels, {}),
    select: ({ label }) => {
      return label?.map(item => ({
        originalId: item?.id,
        id: (item?.id && item?.id < 5) ? labelsMap[item?.id] : undefined,
        type: !item?.custom ? LABEL_TYPE.SYSTEM : LABEL_TYPE.CUSTOM,
        name: (item?.name === 'Outbox' ? 'sent' : !item?.custom ? item?.name.toLowerCase() : item?.name) ?? '',
        unreadCount: 0,
        color: item?.colour,
      }) ?? []) as MailLabel[];
    }
  });
}

export function useUnreadCount(filter: InputMaybe<UnreadCountFilter>) {
  return useQuery({
    queryKey: ['unreadCount', filter],
    queryFn: async () => gqlClient.request(unreadCount, { filter: filter }),
    select: ({ unreadCount }) => {
      let totalUnreadCount = 0;
      unreadCount?.forEach(item => {
        if (item?.count && item.labelId === 1) {
          totalUnreadCount += item?.count
        }
      });
      return { unreadCount, totalUnreadCount };
    }});
};

export function useCreateLabel(){
  return useMutation({
    mutationKey: ['label'],
    mutationFn: async (input: InputMaybe<LabelInput>) => gqlClient.request(label, { input: input }),
  });
};

export function useAssignLabel(){
  return useMutation({
    mutationKey: ['assignLabel'],
    mutationFn: async (input: InputMaybe<AssignLabelInput>) => gqlClient.request(assignLabels, { input: input }),
  });
};
