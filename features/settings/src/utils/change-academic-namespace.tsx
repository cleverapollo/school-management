import { EmulateHeaders, queryClient } from '@tyro/api';

export const changeAcademicNamespace = (academicNamespaceId: number) => {
  localStorage.setItem(
    EmulateHeaders.ACADEMIC_NAMESPACE_ID,
    String(academicNamespaceId)
  );
  queryClient.invalidateQueries();
};
