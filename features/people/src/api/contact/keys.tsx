export const peopleContactsKeys = {
  all: ['peopleContacts'] as const,
  personalDetails: (contactId: number | undefined) =>
    [...peopleContactsKeys.all, 'personal', contactId] as const,
  students: (contactId: number | undefined) =>
    [...peopleContactsKeys.all, 'students', contactId] as const,
  createContact: () => [...peopleContactsKeys.all, 'createEvent'] as const,
};
