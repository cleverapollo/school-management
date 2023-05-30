import { SmsCostFilter } from '@tyro/api';

export const smsKeys = {
  all: ['sms'] as const,
  sent: () => [...smsKeys.all, 'sent'] as const,
  credit: () => [...smsKeys.all, 'credit'] as const,
  xeroItems: () => [...smsKeys.all, 'xero-items'] as const,
  cost: (filter: SmsCostFilter) => [...smsKeys.all, 'cost', filter] as const,
};
