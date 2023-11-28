import {
  useQuery,
  useMutation,
  useInfiniteQuery,
  InfiniteData,
  QueryFunctionContext,
} from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  InputMaybe,
  MailStarredInput,
  SendMailInput,
  MailReadInput,
  MailFilter,
  queryClient,
  UseQueryReturnType,
  Communications_MailQuery,
} from '@tyro/api';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useCallback } from 'react';
import {
  getInboxSendersSummary,
  getInboxMailSummary,
  getOutboxMailSummary,
  getOutboxRecipientsSummary,
  isMailUnread,
} from '../utils/get-summaries';
import { mailKeys } from './keys';

const DEFAULT_PAGINATION_LIMIT = 50;

const mails = graphql(/* GraphQL */ `
  query communications_mail($filter: MailFilter) {
    communications_mail(filter: $filter) {
      id
      rootMailId
      threadId
      subject
      body
      senderPartyId
      sender {
        partyId
        title {
          id
          nameTextId
          name
        }
        firstName
        lastName
        avatarUrl
        type
      }
      sentOn
      latestMessage
      canReply
      starred
      readOn
      recipients {
        id
        recipientPartyId
        recipientType
        recipient {
          partyId
          title {
            id
            nameTextId
            name
          }
          firstName
          lastName
          avatarUrl
          type
        }
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
        sender {
          partyId
          title {
            id
            nameTextId
            name
          }
          firstName
          lastName
          avatarUrl
          type
        }
        recipients {
          id
          recipientPartyId
          recipientType
          recipient {
            partyId
            title {
              id
              nameTextId
              name
            }
            firstName
            lastName
            avatarUrl
            type
          }
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

const sendMail = graphql(/* GraphQL */ `
  mutation communications_sendMail($input: SendMailInput) {
    communications_sendMail(input: $input) {
      id
    }
  }
`);

const starMail = graphql(/* GraphQL */ `
  mutation communications_starred($input: MailStarredInput) {
    communications_starred(input: $input)
  }
`);

const readMail = graphql(`
  mutation communications_read($input: MailReadInput) {
    communications_read(input: $input)
  }
`);

const mailListQuery = (labelId: number, profileId?: number | null) => {
  const filter = {
    pagination: { limit: DEFAULT_PAGINATION_LIMIT },
    partyId: profileId,
    labelId,
  };

  return {
    queryKey: mailKeys.filteredList(filter),
    queryFn: async ({ pageParam = undefined }: QueryFunctionContext) =>
      gqlClient.request(mails, {
        filter: {
          ...filter,
          pagination: {
            ...filter.pagination,
            lastId: pageParam as number | undefined,
          },
        },
      }),
  };
};

export function getMailList(labelId: number, profileId?: number | null) {
  return queryClient.fetchInfiniteQuery({
    ...mailListQuery(labelId, profileId),
  });
}

export function useMailList(labelId: number, profileId?: number | null) {
  return useInfiniteQuery({
    ...mailListQuery(labelId, profileId),
    getNextPageParam: ({ communications_mail }) =>
      communications_mail.length === DEFAULT_PAGINATION_LIMIT
        ? communications_mail[communications_mail.length - 1].id
        : undefined,
    enabled: !!labelId,
    refetchInterval: 1000 * 60 * 2,
    select: useCallback(
      (data: InfiniteData<Communications_MailQuery>) => ({
        ...data,
        pages: data.pages.map(({ communications_mail }) =>
          communications_mail.map((mail) => ({
            ...mail,
            inboxSummary: getInboxMailSummary(mail, profileId),
            outboxSummary: getOutboxMailSummary(mail, profileId),
            inboxSenderSummary: getInboxSendersSummary(mail, profileId),
            outboxRecipientSummary: getOutboxRecipientsSummary(mail, profileId),
            isMailUnread: isMailUnread(mail, profileId),
          }))
        ),
      }),
      [profileId]
    ),
  });
}

const mailQuery = (filter: MailFilter) => ({
  queryKey: mailKeys.mail(filter),
  queryFn: async () => gqlClient.request(mails, { filter }),
});

export function getMail(mailId: number) {
  return queryClient.fetchQuery(
    mailQuery({
      id: mailId,
      pagination: { limit: 1 },
    })
  );
}

export function useMail(mailId: number) {
  return useQuery({
    ...mailQuery({
      id: mailId,
      pagination: { limit: 1 },
    }),
    staleTime: 0,
    select: ({ communications_mail }) => communications_mail[0],
  });
}

export function useSendMail() {
  const { toast } = useToast();
  const { t } = useTranslation(['mail']);

  return useMutation({
    mutationFn: async (input: SendMailInput) =>
      gqlClient.request(sendMail, { input }),
    onSuccess: async () => {
      await queryClient.invalidateQueries(mailKeys.all);
      toast(t('mail:mailSentSuccess'));
    },
    onError: () => {
      toast(t('mail:mailSentError'));
    },
  });
}

export function useStarMail() {
  return useMutation({
    mutationFn: async (input: InputMaybe<MailStarredInput>) =>
      gqlClient.request(starMail, { input }),
    onSuccess: () => {
      queryClient.invalidateQueries(mailKeys.all);
    },
  });
}

export function useReadMail() {
  return useMutation({
    mutationFn: async (input: MailReadInput) =>
      gqlClient.request(readMail, { input }),
    onSuccess: () => {
      queryClient.invalidateQueries(mailKeys.unreadCounts());
      queryClient.invalidateQueries(mailKeys.lists());
    },
  });
}

export type ReturnTypeUseMailList = UseQueryReturnType<
  typeof useMailList
>['pages'][number][number];

export type ReturnTypeUseMail = UseQueryReturnType<typeof useMail>;
