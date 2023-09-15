import { Label, LabelType } from '@tyro/api';
import { ReturnTypeFromUseLabels } from '../api/labels';

export const SystemLabelMapping = {
  [LabelType.Inbox]: 'inbox',
  [LabelType.Outbox]: 'sent',
  [LabelType.Trash]: 'bin',
} as const;

export type SystemLabels =
  (typeof SystemLabelMapping)[keyof typeof SystemLabelMapping];

export function getLabelId(label: Pick<Label, 'type' | 'id'>) {
  return label.type === LabelType.Custom
    ? label.id
    : SystemLabelMapping[label.type];
}

export function getLabelById(
  labelId: SystemLabels | string,
  labels: ReturnTypeFromUseLabels[] = []
): ReturnTypeFromUseLabels | undefined {
  const matchedSystemLabel = Object.entries(SystemLabelMapping).find(
    ([, value]) => value === labelId
  );

  return labels.find(({ type, originalId }) =>
    matchedSystemLabel
      ? type === matchedSystemLabel[0]
      : originalId === Number(labelId)
  );
}
