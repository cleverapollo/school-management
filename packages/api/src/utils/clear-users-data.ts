import { queryClient } from '../query-client';
import { removeEmulationHeaders } from './emulate';
import { clearToken } from './jwt';

export function clearUsersData() {
  clearToken();
  removeEmulationHeaders();
  queryClient.clear();
}
