import { MailLabelId } from './types';

export const labelsMap: Record<number, MailLabelId> = {
  1: 'inbox',
  2: 'sent',
  3: 'trash',
  4: 'drafts',
  0: 'starred',
};

export enum LabelType {
  SYSTEM = 'system',
  CUSTOM = 'custom',
}

export const DEFAULT_PAGINATION_LIMIT = 50;
