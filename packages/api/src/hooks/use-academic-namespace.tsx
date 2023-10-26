import { useCoreAcademicNamespace, getCoreAcademicNamespace } from '../api';
import { EmulateHeaders } from '../utils';

function getActiveAcademicNamespace(
  data: ReturnType<typeof useCoreAcademicNamespace>['data']
) {
  const emulationNamespace = localStorage.getItem(
    EmulateHeaders.ACADEMIC_NAMESPACE_ID
  );

  return data?.find((namespace) =>
    emulationNamespace
      ? namespace.academicNamespaceId === Number(emulationNamespace)
      : namespace?.isActiveDefaultNamespace
  );
}

export async function getAcademicNamespace() {
  const { core_academicNamespaces: data } = await getCoreAcademicNamespace();
  const activeAcademicNamespace = getActiveAcademicNamespace(data);

  return {
    activeAcademicNamespace,
    allNamespaces: data,
  };
}

export function useAcademicNamespace() {
  const { data, ...rest } = useCoreAcademicNamespace();
  const activeAcademicNamespace = getActiveAcademicNamespace(data);

  return {
    activeAcademicNamespace,
    allNamespaces: data,
    ...rest,
  };
}

export type ReturnTypeFromUseAcademicNamespace = ReturnType<
  typeof useAcademicNamespace
>;
