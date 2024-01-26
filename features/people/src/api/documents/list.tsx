import { useQuery } from '@tanstack/react-query';
import {
  FileTransferFilter,
  gqlClient,
  graphql,
  queryClient,
  UseQueryReturnType,
} from '@tyro/api';
import { peopleKeys } from '../keys';

const documents = graphql(/* GraphQL */ `
  query file_transfer_list($filter: FileTransferFilter) {
    file_transfer_list(filter: $filter) {
      id
      feature
      fileName
      fileUrl
      referenceId
    }
  }
`);

const documentsQuery = (filter: FileTransferFilter) => ({
  queryKey: peopleKeys.students.documents(filter),
  queryFn: async () => gqlClient.request(documents, { filter }),
});

export function getDocuments(filter: FileTransferFilter) {
  return queryClient.fetchQuery(documentsQuery(filter));
}

export function useDocuments(filter: FileTransferFilter) {
  return useQuery({
    ...documentsQuery(filter),
    select: ({ file_transfer_list }) => file_transfer_list,
  });
}

export type ReturnTypeFromUseDocuments = UseQueryReturnType<
  typeof useDocuments
>[number];
