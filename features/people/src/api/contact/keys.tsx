export const peopleContactsKeys = {
  all: ['peopleContacts'] as const,
  details: (studentId: number | undefined) =>
    [...peopleContactsKeys.all, studentId] as const,
  createContact: () => [...peopleContactsKeys.all, 'createEvent'] as const,
};
