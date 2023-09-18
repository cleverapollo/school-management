import { Communications_MailQuery, Person } from '@tyro/api';
import { getTextFromHtml } from './html-formatters';

type BasicReturnedMail =
  Communications_MailQuery['communications_mail'][number];

export function getInboxMailSummary(
  mail: BasicReturnedMail,
  profileId: number | null | undefined
): string {
  const { threads = [], body } = mail;

  if (threads.length > 0) {
    const lastThread = [...threads]
      .reverse()
      .find((thread) => thread.sender.partyId !== profileId);

    if (lastThread) {
      return getTextFromHtml(lastThread?.body ?? '');
    }
  }

  return getTextFromHtml(body ?? '');
}

export function getOutboxMailSummary(
  mail: BasicReturnedMail,
  profileId: number | null | undefined
): string {
  const { threads = [], body } = mail;

  if (threads.length > 0) {
    const lastThread = [...threads]
      .reverse()
      .find((thread) => thread.sender.partyId === profileId);

    if (lastThread) {
      return getTextFromHtml(lastThread?.body ?? '');
    }
  }

  return getTextFromHtml(body ?? '');
}

export function getInboxSendersSummary(
  mail: BasicReturnedMail,
  profileId: number | null | undefined
) {
  const { threads = [], sender } = mail;
  const senders = new Map<number, Person>();

  if (sender.partyId !== profileId) {
    senders.set(sender.partyId, sender);
  }

  if (threads.length > 0) {
    threads.forEach((thread) => {
      senders.set(thread.sender.partyId, thread.sender);
    });
  }

  if (senders.size === 0) {
    // Used in rare cases where the mail is sent to the user itself
    senders.set(sender.partyId, sender);
  }

  return Array.from(senders.values());
}

export function getOutboxRecipientsSummary(
  mail: BasicReturnedMail,
  profileId: number | null | undefined
) {
  const { threads = [], recipients } = mail;
  const fullRecipients = new Map<number, Person>();

  recipients.forEach(({ recipientPartyId, recipient }) => {
    if (recipientPartyId !== profileId) {
      fullRecipients.set(recipientPartyId, recipient);
    }
  });

  if (threads.length > 0) {
    threads.forEach((thread) => {
      thread.recipients.forEach(({ recipientPartyId, recipient }) => {
        if (recipientPartyId !== profileId) {
          fullRecipients.set(recipientPartyId, recipient);
        }
      });
    });
  }

  return Array.from(fullRecipients.values());
}

export function isMailUnread(
  mail: BasicReturnedMail,
  profileId: number | null | undefined
) {
  return (
    (!mail.readOn && mail.sender.partyId !== profileId) ||
    mail.threads.some(
      (thread) => !thread.readOn && thread.sender.partyId !== profileId
    )
  );
}
