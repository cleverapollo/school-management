export const coreApiKeys = {
  all: ['core'] as const,
  yearGroups: {
    all: () => [...coreApiKeys.all, 'yearGroups'] as const,
  },
  academicNamespaces: {
    all: () => [...coreApiKeys.all, 'academicNamespaces'] as const,
  },
  programmeStages: {
    all: () => [...coreApiKeys.all, 'programmeStages'] as const,
  },
};
