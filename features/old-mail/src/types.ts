import { Colour } from '@tyro/api';

export type MailLabelId = 'inbox' | 'sent' | 'trash' | 'starred' | number;

export type MailLabel = {
  originalId: number;
  id: MailLabelId;
  type: string;
  name: string;
  unreadCount: number;
  color?: Colour;
};
