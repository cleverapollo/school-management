import { Communications_MailQuery } from '@tyro/api';
import { getTextFromHtml } from './html-formatters';

type BasicReturnedMail =
  Communications_MailQuery['communications_mail'][number];

export function getMailSummary(mail: BasicReturnedMail): string {
  const { threads = [], body } = mail;

  if (threads.length > 0) {
    const lastThread = threads[threads.length - 1];
    return getTextFromHtml(lastThread.body ?? '');
  }

  return getTextFromHtml(body ?? '');
}

export function getInboxSendersSummary(
  mail: BasicReturnedMail,
  profileId: number | null | undefined
) {
  const { threads = [], sender } = mail;
  const senders = new Map<number, string>();

  senders.set(
    sender.partyId,
    `${sender.firstName ?? ''} ${sender.lastName ?? ''}`
  );

  if (threads.length > 0) {
    threads.forEach((thread) => {
      if (thread.sender.partyId !== profileId) {
        senders.set(
          thread.sender.partyId,
          `${thread.sender.firstName ?? ''} ${thread.sender.lastName ?? ''}`
        );
      }
    });
  }

  return Array.from(senders.values()).join(', ');
}

export function getOutboxRecipientsSummary(
  mail: BasicReturnedMail,
  profileId: number | null | undefined
) {
  const { threads = [], recipients } = mail;
  const fullRecipients = new Map<string, string>();

  recipients.forEach((recipient) => {
    fullRecipients.set(JSON.stringify(recipient), recipient.name ?? '');
  });

  if (threads.length > 0) {
    threads.forEach((thread) => {
      thread.recipients.forEach((recipient) => {
        if (recipient.recipientPartyId !== profileId) {
          fullRecipients.set(JSON.stringify(recipient), recipient.name ?? '');
        }
      });
    });
  }

  return Array.from(fullRecipients.values()).join(', ');
}
