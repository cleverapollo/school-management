import { setUser as setSentryUser } from '@sentry/react';
import { queryClient } from '../query-client';
import { removeEmulationHeaders } from './emulate';
import { clearToken } from './jwt';

export function clearUsersData() {
  setSentryUser(null);
  clearToken();
  removeEmulationHeaders();
  queryClient.clear();
}
