import { AcademicNamespace, EmulateHeaders, queryClient } from '@tyro/api';

export const changeAcademicNamespace = (
  academicNamespace: AcademicNamespace
) => {
  if (academicNamespace.isActiveDefaultNamespace) {
    localStorage.removeItem(EmulateHeaders.ACADEMIC_NAMESPACE_ID);
  } else {
    localStorage.setItem(
      EmulateHeaders.ACADEMIC_NAMESPACE_ID,
      String(academicNamespace.academicNamespaceId)
    );
  }

  queryClient.clear();
  window.location.reload();
};
