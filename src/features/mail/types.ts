import { Mail as MailType } from '@tyro/api';

// ----------------------------------------------------------------------

export type MailState = {
  isLoading: boolean;
  error: Error | string | null;
  mails: {
    byId: Record<string, Mail>;
    allIds: string[];
  };
  labels: MailLabel[];
};

export type MailLabelId =
  | 'inbox'
  | 'sent'
  | 'trash'
  | 'starred'
  | 'important';

export type MailLabel = {
  originalId?: number;
  id?: MailLabelId;
  type: string;
  name: string;
  unreadCount: number;
  color?: string;
};

export type Mail = {
  id: string;
  labelIds: string[];
  folder: string | undefined;
  isImportant: boolean;
  isStarred: boolean;
  isUnread: boolean;
  subject: string;
  message: string;
  createdAt: Date | string | number;
  files: string[];
  from: {
    name: string;
    email: string;
    avatar: null | string;
  };
  to: {
    name: string;
    email: string;
    avatar: null | string;
  }[];
};

export interface Mails {
  byId: Record<string, MailType>; 
  allIds: string[];
}
