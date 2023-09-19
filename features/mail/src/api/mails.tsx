import { useQuery, useMutation } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  InputMaybe,
  MailStarredInput,
  SendMailInput,
  MailReadInput,
} from '@tyro/api';
import { DEFAULT_PAGINATION_LIMIT } from '../constants';

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

export function useMails(labelId: number, profileId?: number | null) {
  const starredFilter = {
    filter: {
      pagination: { limit: DEFAULT_PAGINATION_LIMIT },
      partyId: profileId,
      starred: true,
    },
  };
  return useQuery({
    queryKey: ['mail'],
    queryFn: async () =>
      gqlClient.request(
        mails,
        labelId === 0
          ? starredFilter
          : {
              filter: {
                pagination: { limit: DEFAULT_PAGINATION_LIMIT },
                partyId: profileId,
                labelId,
              },
            }
      ),
    select: ({ communications_mail }) => communications_mail,
  });
}

export function useSendMail(input: InputMaybe<SendMailInput>) {
  return useMutation({
    mutationKey: ['sendMail', input],
    mutationFn: async () => gqlClient.request(sendMail, { input }),
  });
}

export function useStarMail() {
  return useMutation({
    mutationKey: ['starMail'],
    mutationFn: async (input: InputMaybe<MailStarredInput>) =>
      gqlClient.request(starMail, { input }),
  });
}

export function useReadMail() {
  return useMutation({
    mutationKey: ['readMail'],
    mutationFn: async (input: InputMaybe<MailReadInput>) =>
      gqlClient.request(readMail, { input }),
  });
}
