import { StaffSelectOption, StudentSelectOption } from '@tyro/people';

export enum TabOption {
  STATIC_STUDENTS = 'staticStudents',
  DYNAMIC_STUDENTS = 'dynamicStudents',
  STATIC_STAFF = 'staticStaff',
  DYNAMIC_STAFF = 'dynamicStaff',
}

export type CustomGroupFormState = {
  id?: number | null;
  name: string;
  description: string;
  organisers: StaffSelectOption[];
  staticStudents: StudentSelectOption[];
  staticStaff: StaffSelectOption[];
};
