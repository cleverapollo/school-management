import { useMemo } from 'react';
import { useCoreAcademicNamespace } from '../api/academic-namespaces';
import { EmulateHeaders } from '../utils';

export function useAcademicNamespace() {
  const { data, ...rest } = useCoreAcademicNamespace();

  return useMemo(() => {
    const emulationNamespace = localStorage.getItem(
      EmulateHeaders.ACADEMIC_NAMESPACE_ID
    );
    const activeAcademicNamespace = data?.find((namespace) =>
      emulationNamespace
        ? namespace?.academicNamespaceId === Number(emulationNamespace)
        : namespace?.isActiveDefaultNamespace
    );

    return {
      activeAcademicNamespace,
      allNamespaces: data,
      ...rest,
    };
  }, [data, rest]);
}
