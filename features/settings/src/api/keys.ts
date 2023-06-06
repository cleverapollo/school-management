import { SmsCostFilter } from '@tyro/api';

export const academicNamspaceKeys = {
    all: ['coreAcademicNamespace'] as const,
    activeAcademicNamespace: () =>
        [
            ...academicNamspaceKeys.all,
            'core_setActiveActiveAcademicNamespace',
        ] as const,
    createOrUpdateAcademicNamespace: () =>
        [
            ...academicNamspaceKeys.all,
            'createOrUpdateAcademicNamespace',
        ] as const,
};
