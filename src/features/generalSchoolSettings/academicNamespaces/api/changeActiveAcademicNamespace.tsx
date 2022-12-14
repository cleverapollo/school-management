import {useMutation, useQueryClient} from '@tanstack/react-query';
import { gqlClient, graphql } from '@tyro/api';
import { SetActiveAcademicNamespace } from '@tyro/api';

const core_setActiveActiveAcademicNamespace = graphql(/* GraphQL */ `
    mutation core_setActiveActiveAcademicNamespace($input: SetActiveAcademicNamespace){
        core_setActiveActiveAcademicNamespace(input: $input){
            academicNamespaceId
            type
            name
            year
            description
            isActiveDefaultNamespace
        }
    }
`);

export function useCoreSetActiveActiveAcademicNamespace() {

    return useMutation({
        mutationKey: ['coreAcademicNamespace', 'core_setActiveActiveAcademicNamespace'],
        mutationFn: async (input: SetActiveAcademicNamespace) => gqlClient.request(core_setActiveActiveAcademicNamespace, { input: input }),
    });
}
