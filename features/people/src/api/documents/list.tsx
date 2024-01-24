import { useQuery } from '@tanstack/react-query';
import {
  FileTransferFilter,
  gqlClient,
  graphql,
  queryClient,
  UseQueryReturnType,
  FileTransferFeature,
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

const documentsQuery = (studentId: number | undefined) => {
  const filter = {
    referenceId: studentId ? `${studentId}` : undefined,
    feature: FileTransferFeature.StudentDocs,
  };

  return {
    queryKey: peopleKeys.students.documents(filter),
    queryFn: async () => gqlClient.request(documents, { filter }),
  };
};

export function getDocuments(studentId: number | undefined) {
  return queryClient.fetchQuery(documentsQuery(studentId));
}

export function useDocuments(studentId: number | undefined) {
  return useQuery({
    ...documentsQuery(studentId),
    select: ({ file_transfer_list }) => file_transfer_list,
  });
}

export type ReturnTypeFromUseDocuments = UseQueryReturnType<
  typeof useDocuments
>[number];
