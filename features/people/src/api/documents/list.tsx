import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient, UseQueryReturnType } from '@tyro/api';
import { peopleKeys } from '../keys';

const documents = graphql(/* GraphQL */ `
  // TODO: add query after api ready
`);

const documentsQuery = {
  queryKey: peopleKeys.documents.all(),
  queryFn: async () => gqlClient.request(documents),
};

export function getDocuments() {
  return queryClient.fetchQuery(documentsQuery);
}

export function useDocuments(studentId: number | undefined) {
  // return useQuery({
  //   ...documentsQuery,
  //   select: ({ core_studentDocuments }) => core_studentDocuments,
  // });
  return {
    data: [
      {
        id: 0,
        name: 'document 1',
        type: 'docx',
        uploaded: '2023-02-17',
      },
      {
        id: 1,
        name: 'document 2',
        type: 'pdf',
        uploaded: '2023-02-12',
      },
      {
        id: 3,
        name: 'document 3',
        type: 'csv',
        uploaded: '2023-02-02',
      },
    ],
  };
}

export type ReturnTypeFromUseDocuments = UseQueryReturnType<
  typeof useDocuments
>[number];
