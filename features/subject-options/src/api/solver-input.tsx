import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  UseQueryReturnType,
  SolverInputFilter,
} from '@tyro/api';
import { optionsKeys } from './keys';

const optionsSolverInput = graphql(/* GraphQL */ `
  query options_solverInput($filter: SolverInputFilter) {
    options_solverInput(filter: $filter) {
      input
    }
  }
`);

const optionsSolverInputQuery = (filter: SolverInputFilter) => ({
  queryKey: optionsKeys.solverInput(filter),
  queryFn: () => gqlClient.request(optionsSolverInput, { filter }),
});

export function useOptionsSolverInput(
  filter: SolverInputFilter,
  enabled = true
) {
  return useQuery({
    ...optionsSolverInputQuery(filter),
    select: ({ options_solverInput }) =>
      options_solverInput.input as unknown as string,
    enabled,
  });
}

export type ReturnTypeFromUseOptionsSolverInput = UseQueryReturnType<
  typeof useOptionsSolverInput
>;
