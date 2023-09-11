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
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2OTU4NzU2NjUsImlhdCI6MTY5NDEyOTY2NSwic2VjdXJpdHlDb250ZXh0Ijp7InVzZXJfaWQiOjQyfX0.AwQ7UsJgtHPrpll5CHwbU8ffXpTM0DVy8giS_sTKGEY';
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
