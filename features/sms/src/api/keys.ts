import { SmsCostFilter } from '@tyro/api';

export const smsKeys = {
  all: ['sms'] as const,
  sent: () => [...smsKeys.all, 'sent'] as const,
  cost: (filter: SmsCostFilter) => [...smsKeys.all, 'cost', filter] as const,
};
