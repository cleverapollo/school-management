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

export function useLabels() {
  return useQuery({
    queryKey: ['label'],
    queryFn: async () => gqlClient.request(labels, {}),
    select: ({ label }) => {
      return label?.map(item => ({
        id: item?.name === 'Outbox' ? 'sent' : item?.name.toLowerCase() as MailLabelId,
        type: '',
        name: item?.name ?? '',
        unreadCount: 1,
        color: item?.colour,
      }) ?? []) as MailLabel[];
    }
  });
}
