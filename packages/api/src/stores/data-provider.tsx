import { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import cubejs from '@cubejs-client/core';
import { CubeProvider } from '@cubejs-client/react';
import { queryClient } from '../query-client';

type DataProviderProps = {
  children: ReactNode;
};

const API_URL = 'https://app.tyro-dev.com';
const CUBEJS_TOKEN =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2ODY0ODQzODYsImlhdCI6MTY4NDczODM4Nn0.RQSYR0RWcoBARldwUbIJOGNMeJGc89JAJrvSW2dEXLI';
const cubejsApi = cubejs(CUBEJS_TOKEN, {
  apiUrl: `${API_URL}/cubejs-api/v1`,
});

export function DataProvider({ children }: DataProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <CubeProvider cubejsApi={cubejsApi}>{children}</CubeProvider>
    </QueryClientProvider>
  );
}
