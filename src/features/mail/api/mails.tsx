import { useQuery, useMutation } from '@tanstack/react-query';
import { gqlClient, graphql, Exact } from '@tyro/api';
import { InputMaybe, MailFilter, MailStarredInput, SendMailInput, MailReadInput } from '@tyro/api/src/gql/graphql';
import { labelsMap } from './labels';

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

const readMail = graphql(`
  mutation read($input: MailReadInput){
    read(input: $input)
  }
`);

export function useMails(labelName: string) {
  let labelId: number = 1;
  Object.values(labelsMap).forEach((label, index) => {
    if(label.toLowerCase() === labelName.toLowerCase()){
      labelId = index + 1;
    }
  });
  const starredFilter = { filter: { pagination: { limit: 50} , partyId: 5, starred: true}};
  return useQuery({
    queryKey: ['mail'],
    queryFn: async () =>
      gqlClient.request(mails, labelName === 'Starred' ? starredFilter : { filter: { pagination: { limit: 50 }, 
        partyId: 5, labelId: labelId, 
        //id: 1
      } }
      ),
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

export function useReadMail(input: InputMaybe<MailReadInput>) {
  return useMutation({
    mutationKey: ['readMail', input],
    mutationFn: async () => gqlClient.request(readMail, { input: input }),
  });
}
