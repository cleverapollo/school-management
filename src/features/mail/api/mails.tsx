import { useQuery, useMutation } from '@tanstack/react-query';
import { gqlClient, graphql } from '@tyro/api';
import { InputMaybe, MailFilter, MailStarredInput, SendMailInput } from '@tyro/api/src/gql/graphql';

const mails = graphql(/* GraphQL */ `
  query mail($filter: MailFilter){
    mail(filter: $filter){
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

const sendMail = graphql(/* GraphQL */ `
  mutation sendMail($input: SendMailInput){
    sendMail(input: $input){
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

const starMail = graphql(/* GraphQL */ `
  mutation starred($input: MailStarredInput){
    starred(input: $input)
  }
`);

export function useMails() {
  return useQuery({
    queryKey: ['mail'],
    queryFn: async () =>
      gqlClient.request(mails, { filter: { pagination: { limit: 50 }, partyId: 1800, labelId: 1, id: 1 } }),
    select: ({ mail }) => {
      return mail;
    }
  });
}

export function useSendMail(input: InputMaybe<SendMailInput>) {
  return useMutation({
    mutationKey: ['sendMail', input],
    mutationFn: async () => gqlClient.request(sendMail, { input: input }),
  });
}

export function useStarMail(input: InputMaybe<MailStarredInput>) {
  return useMutation({
    mutationKey: ['starMail', input],
    mutationFn: async () => gqlClient.request(starMail, { input: input }),
  });
}
