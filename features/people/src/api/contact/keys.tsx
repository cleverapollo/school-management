export const peopleContactKeys = {
  all: ['peopleContact'] as const,
  createContact: () => [...peopleContactKeys.all, 'createEvent'] as const,
};
