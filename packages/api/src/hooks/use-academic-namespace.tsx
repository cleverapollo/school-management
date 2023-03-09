import { useMemo } from 'react';
import { useCoreAcademicNamespace } from '../api/academic-namespaces';

export function useAcademicNamespace() {
  const { data, ...rest } = useCoreAcademicNamespace();

  return useMemo(() => {
    const activeAcademicNamespace = data?.find(
      (namespace) => namespace?.isActiveDefaultNamespace
    );

    return {
      activeAcademicNamespace,
      allNamespaces: data,
      ...rest,
    };
  }, [data, rest]);
}
