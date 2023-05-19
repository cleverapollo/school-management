export const BYTE_SIZE_PER_SMS = 160;
export const getByteSize = (message: unknown) =>
  typeof message === 'string' ? new Blob([message ?? '']).size : 0;
