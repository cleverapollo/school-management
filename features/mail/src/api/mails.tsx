import {
  useQuery,
  useMutation,
  useInfiniteQuery,
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
} from '@tyro/api';
import { DEFAULT_PAGINATION_LIMIT } from '../constants';
import { getTextFromHtml } from '../utils/html-formatters';
import { mailKeys } from './keys';

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

const sendMail = graphql(/* GraphQL */ `
  mutation communications_sendMail($input: SendMailInput) {
    communications_sendMail(input: $input) {
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

export function useMailList(labelId: number, profileId?: number | null) {
  const filter = {
    pagination: { limit: DEFAULT_PAGINATION_LIMIT },
    partyId: profileId,
    labelId,
  };
  const queryKey = mailKeys.list(filter);

  return useInfiniteQuery({
    queryKey,
    queryFn: async ({
      pageParam,
    }: QueryFunctionContext<typeof queryKey, number | undefined>) =>
      gqlClient.request(mails, {
        filter: {
          ...filter,
          pagination: { ...filter.pagination, lastId: pageParam },
        },
      }),
    getNextPageParam: ({ communications_mail }) =>
      communications_mail.length === DEFAULT_PAGINATION_LIMIT
        ? communications_mail[communications_mail.length - 1].id
        : undefined,
    select: (data) => ({
      ...data,
      pages: data.pages.map(({ communications_mail }) =>
        communications_mail.map((mail) => ({
          ...mail,
          summary: getTextFromHtml(mail.body ?? ''),
        }))
      ),
    }),
  });
}

const mailQuery = (filter: MailFilter) => ({
  queryKey: mailKeys.mail(filter),
  queryFn: async () => gqlClient.request(mails, { filter }),
});

export function useMail(mailId: number) {
  return useQuery({
    ...mailQuery({
      id: mailId,
      pagination: { limit: 1 },
    }),
    select: ({ communications_mail }) =>
      communications_mail.length > 0 ? communications_mail[0] : undefined,
  });
}

export function useSendMail() {
  return useMutation({
    mutationFn: async (input: SendMailInput) =>
      gqlClient.request(sendMail, { input }),
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
    mutationFn: async (input: InputMaybe<MailReadInput>) =>
      gqlClient.request(readMail, { input }),
  });
}

export type ReturnTypeUseMailList = UseQueryReturnType<
  typeof useMailList
>['pages'][number][number];

export type ReturnTypeUseMail = UseQueryReturnType<typeof useMail>;
