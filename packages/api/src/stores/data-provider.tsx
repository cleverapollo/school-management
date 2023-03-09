import { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import cubejs from '@cubejs-client/core';
import { CubeProvider } from '@cubejs-client/react';
import { queryClient } from '../query-client';

type DataProviderProps = {
  children: ReactNode;
};

const API_URL = 'https://cubejs-api.azurewebsites.net';
const CUBEJS_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzU4NzE1MTQsImV4cCI6MTY4NDUxMTUxNH0.uKYnd0anQJuuUhyB79V4a2YhsIlxwk6A5OIYFqdzHvU';
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
