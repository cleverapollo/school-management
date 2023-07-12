import {
  useContactsForSelect,
  useStaffForSelect,
  useStudentsForSelect,
} from '@tyro/people';
import { MemberType } from '@tyro/api';
import { useCallback } from 'react';

export const useMembersByPermissionType = () => {
  const { data: studentsData = [] } = useStudentsForSelect({});
  const { data: contactsData = [] } = useContactsForSelect();
  const { data: staffData = [] } = useStaffForSelect({});

  const getMembersByMemberType = useCallback(
    (memberType: MemberType) => {
      switch (memberType) {
        case MemberType.Student:
          return studentsData;
        case MemberType.Contact:
          return contactsData;
        case MemberType.Staff:
        case MemberType.Admin:
          return staffData;
        default:
          return [];
      }
    },
    [studentsData, contactsData, staffData]
  );

  return {
    getMembersByMemberType,
  };
};

export type MemberOption = ReturnType<
  ReturnType<typeof useMembersByPermissionType>['getMembersByMemberType']
>[number];
