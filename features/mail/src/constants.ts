export type SystemLabels = 'inbox' | 'sent' | 'trash' | 'starred';

export const labelsMap: Record<number, SystemLabels> = {
  1: 'inbox',
  2: 'sent',
  3: 'trash',
  0: 'starred',
} as const;

export function getLabelId(originalId: number): SystemLabels | number {
  return labelsMap[originalId] || originalId;
}

export const DEFAULT_PAGINATION_LIMIT = 50;
