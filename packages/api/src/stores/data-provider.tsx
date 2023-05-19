import { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import cubejs from '@cubejs-client/core';
import { CubeProvider } from '@cubejs-client/react';
import { queryClient } from '../query-client';

type DataProviderProps = {
  children: ReactNode;
};

const API_URL = 'http://localhost:4000';
const CUBEJS_TOKEN =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2ODQ2NzA2NjEsImlhdCI6MTY4NDQ3OTg2MX0.f8ASX8B6D5yqBOmk9go58H_dmyyK5oznGZ4GAKfl460';
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
