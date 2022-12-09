import {useQuery} from '@tanstack/react-query';
import {gqlClient, graphql} from '@tyro/api';

const coreAcademicNamespaces = graphql(/* GraphQL */ `
    query core_academicNamespaces{
        core_academicNamespaces{
            academicNamespaceId
            type
            name
            year
            description
        }
    }
`);

export function useCoreAcademicNamespace() {
    return useQuery({
        queryKey: ['coreAcademicNamespace'],
        queryFn: async () =>
            gqlClient.request(coreAcademicNamespaces),
        select: ({core_academicNamespaces}) => {
            return core_academicNamespaces
        }
    });
}

