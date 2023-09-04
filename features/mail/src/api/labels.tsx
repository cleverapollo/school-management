import { useMutation, useQuery } from '@tanstack/react-query';
import {
  AssignLabelInput,
  gqlClient,
  graphql,
  LabelInput,
  UnreadCountFilter,
  queryClient,
  LabelFilter,
  UseQueryReturnType,
} from '@tyro/api';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { getLabelId } from '../constants';
import { mailKeys } from './keys';

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

const unreadCount = graphql(/* GraphQL */ `
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

const labelsQuery = (filter: LabelFilter) => ({
  queryKey: mailKeys.labels(filter),
  queryFn: () => gqlClient.request(labels, { filter }),
});

export function getLabels(filter: LabelFilter) {
  return queryClient.fetchQuery(labelsQuery(filter));
}

export function useLabels(filter: LabelFilter) {
  return useQuery({
    ...labelsQuery(filter),
    select: ({ communications_label }) =>
      communications_label?.map((item) => ({
        ...item,
        originalId: item?.id,
        id: getLabelId(item?.id || 0),
      })),
  });
}

const unreadCountQuery = (filter: UnreadCountFilter) => ({
  queryKey: mailKeys.unreadCount(filter),
  queryFn: () => gqlClient.request(unreadCount, { filter }),
});

export function getUnreadCountQuery(filter: UnreadCountFilter) {
  return queryClient.fetchQuery(unreadCountQuery(filter));
}

export function useUnreadCount(filter: UnreadCountFilter) {
  return useQuery({
    ...unreadCountQuery(filter),
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
  const { t } = useTranslation(['common']);
  const { toast } = useToast();

  return useMutation({
    mutationFn: (input: LabelInput) =>
      gqlClient.request(updateLabel, { input }),
    onSuccess: async (_data, input) => {
      await queryClient.invalidateQueries(mailKeys.labels({}));
      toast(
        input?.id
          ? t('common:snackbarMessages.updateSuccess')
          : t('common:snackbarMessages.createSuccess')
      );
    },
  });
}

export function useAssignLabel() {
  return useMutation({
    mutationFn: (input: AssignLabelInput) =>
      gqlClient.request(assignLabels, { input }),
  });
}

export type ReturnTypeFromUseLabels = UseQueryReturnType<
  typeof useLabels
>[number];
