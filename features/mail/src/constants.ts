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

export function getLabelIdNumber(
  labelId: SystemLabels | number | string
): number {
  const matchedSystemLabel = Object.entries(labelsMap).find(
    ([, value]) => value === labelId
  );

  return matchedSystemLabel ? Number(matchedSystemLabel[0]) : Number(labelId);
}

export const DEFAULT_PAGINATION_LIMIT = 50;
