export const academicNamspaceKeys = {
  all: ['coreAcademicNamespace'] as const,
  activeAcademicNamespace: () =>
    [...academicNamspaceKeys.all, 'activeActiveAcademicNamespace'] as const,
  createOrUpdateAcademicNamespace: () =>
    [...academicNamspaceKeys.all, 'createOrUpdateAcademicNamespace'] as const,
};
