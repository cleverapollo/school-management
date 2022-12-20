import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql } from '@tyro/api';
import { capitalize } from 'lodash';
import { MailLabel, MailLabelId } from '../types';

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

export const labelsMap: Record<number, MailLabelId> = {
  1: 'inbox',
  2: 'sent',
  3: 'trash',
  4: 'important',
  5: 'starred',
}

export function useLabels() {
  return useQuery({
    queryKey: ['label'],
    queryFn: async () => gqlClient.request(labels, {}),
    select: ({ label }) => {
      return label?.map(item => ({
        id: labelsMap[item?.id],//item?.name === 'Outbox' ? 'sent' : item?.name.toLowerCase() as MailLabelId,
        type: !item?.custom ? 'system' : 'custom',
        name: (item?.name === 'Outbox' ? 'sent' : item?.name.toLowerCase()) ?? '',
        unreadCount: 1,
        color: item?.colour,
      }) ?? []) as MailLabel[];
    }
  });
}
