export const smsKeys = {
  all: ['sms'] as const,
  sent: () => [...smsKeys.all, 'sent'] as const,
};
