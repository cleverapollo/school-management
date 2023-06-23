import { EmulateHeaders } from '@tyro/api';

export const changeAcademicNamespace = (academicNamespaceId: number) => {
  localStorage.setItem(
    EmulateHeaders.ACADEMIC_NAMESPACE_ID,
    String(academicNamespaceId)
  );
  window.location.reload();
};
