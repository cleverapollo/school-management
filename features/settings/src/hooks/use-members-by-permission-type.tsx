import {
  useContactsForSelect,
  useStaffForSelect,
  useStudentsForSelect,
} from '@tyro/people';
import { MemberType } from '@tyro/api';

export const useMembersByPermissionType = (memberType: MemberType) => {
  const { data: studentsData = [] } = useStudentsForSelect({});
  const { data: contactsData = [] } = useContactsForSelect();
  const { data: staffData = [] } = useStaffForSelect({});

  switch (memberType) {
    case MemberType.Student:
      return studentsData;
    case MemberType.Contact:
      return contactsData;
    case MemberType.Staff:
      return staffData;
    default:
      return [];
  }
};

export type MemberOption = ReturnType<
  typeof useMembersByPermissionType
>[number];
