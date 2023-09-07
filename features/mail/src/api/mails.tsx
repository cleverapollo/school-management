import { useQuery, useMutation } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  InputMaybe,
  MailStarredInput,
  SendMailInput,
  MailReadInput,
  MailFilter,
  queryClient,
} from '@tyro/api';
import { DEFAULT_PAGINATION_LIMIT } from '../constants';
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

const mailListQuery = (filter: MailFilter) => ({
  queryKey: mailKeys.list(filter),
  queryFn: async () => gqlClient.request(mails, { filter }),
});

export function getMailList(filter: MailFilter) {
  return queryClient.fetchQuery(mailListQuery(filter));
}

export function useMailList(labelId: number, profileId?: number | null) {
  return useQuery({
    ...mailListQuery({
      pagination: { limit: DEFAULT_PAGINATION_LIMIT },
      partyId: profileId,
      labelId,
    }),
    select: ({ communications_mail }) => communications_mail,
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
  });
}

export function useReadMail() {
  return useMutation({
    mutationFn: async (input: InputMaybe<MailReadInput>) =>
      gqlClient.request(readMail, { input }),
  });
}
