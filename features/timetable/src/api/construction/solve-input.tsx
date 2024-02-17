import { useQuery } from '@tanstack/react-query';

import {
  gqlClient,
  graphql,
  queryClient,
  TtSolve_SolveParams,
} from '@tyro/api';

import { timetableKeys } from '../keys';

const solveInput = graphql(/* GraphQL */ `
  query ttsolve_getSolverInput($filter: TtSolve_SolveParams!) {
    ttsolve_getSolverInput(filter: $filter) {
      input
    }
  }
`);

const solveInputQuery = (filter: TtSolve_SolveParams) => ({
  queryKey: timetableKeys.solveInput(filter),
  queryFn: async () =>
    gqlClient.request(solveInput, {
      filter,
    }),
});

export async function getTtSolveInput(filter: TtSolve_SolveParams) {
  return queryClient.fetchQuery(solveInputQuery(filter));
}

export function useTtSolveInput(filter: TtSolve_SolveParams, enabled = true) {
  return useQuery({
    ...solveInputQuery(filter),
    select: ({ ttsolve_getSolverInput }) => ttsolve_getSolverInput,
    enabled,
  });
}
