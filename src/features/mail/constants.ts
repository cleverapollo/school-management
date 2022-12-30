import { MailLabelId } from "./types";

export const labelsMap: Record<number, MailLabelId> = {
  1: 'inbox',
  2: 'sent',
  3: 'trash',
  4: 'important',
  0: 'starred',
}

export enum LABEL_TYPE {
  SYSTEM = 'system',
  CUSTOM = 'custom',
}

export const DEFAULT_PAGINATION_LIMIT = 50;
