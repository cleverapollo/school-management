import { AccessUserType, UserType } from '@tyro/api';
import { useLocation } from 'react-router';

type PathByUser = 'staff' | 'contacts' | 'students';

export const enum OriginPath {
  modal = 'MODAL',
  access = 'ACCESS',
}

const paths = {
  [OriginPath.modal]: {
    staff: UserType.Teacher,
    contacts: UserType.Contact,
    students: UserType.Student,
  },
  [OriginPath.access]: {
    staff: AccessUserType.Staff,
    contacts: AccessUserType.Contact,
    students: AccessUserType.Student,
  },
};

export const useUserTypeFromPathname = (origin: OriginPath) => {
  const currentUrl = useLocation();

  const basePathName = currentUrl.pathname;

  const urlParamater = basePathName.substring(
    basePathName.lastIndexOf('/') + 1
  ) as PathByUser;

  const currentPath = paths[origin][urlParamater];

  return currentPath;
};
