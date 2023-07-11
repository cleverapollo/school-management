import { StaffFilter, StudentFilter } from '@tyro/api';

export const peopleKeys = {
  all: ['people'] as const,
  contacts: {
    all: () => [...peopleKeys.all, 'contacts'] as const,
    personalDetails: (contactId: number | undefined) =>
      [...peopleKeys.contacts.all(), 'personal', contactId] as const,
    students: (contactId: number | undefined) =>
      [...peopleKeys.contacts.all(), 'students', contactId] as const,
    upsertContact: () =>
      [...peopleKeys.contacts.all(), 'upsertContact'] as const,
  },
  staff: {
    all: () => [...peopleKeys.all, 'staff'] as const,
    details: (filter: StaffFilter) =>
      [...peopleKeys.staff.all(), filter] as const,
    forSelect: (filter: StaffFilter) =>
      [...peopleKeys.staff.all(), 'select', filter] as const,
    status: (staffId: number | undefined) =>
      [...peopleKeys.staff.all(), 'status', staffId] as const,
    subjectGroups: (filter: StaffFilter) =>
      [...peopleKeys.staff.all(), 'classes', filter] as const,
    upsertStaff: () => [...peopleKeys.staff.all(), 'upsertStaff'] as const,
    personalDetails: (filter: StaffFilter) =>
      [...peopleKeys.staff.all(), 'personal', filter] as const,
    employmentCapacities: () =>
      [...peopleKeys.staff.all(), 'employmentCapacities'] as const,
    staffPosts: () => [...peopleKeys.staff.all(), 'staffPosts'] as const,
  },
  students: {
    all: () => [...peopleKeys.all, 'students'] as const,
    details: (studentId: number | undefined) =>
      [...peopleKeys.students.all(), studentId] as const,
    personalDetails: (studentId: number | undefined) =>
      [...peopleKeys.students.all(), 'personal', studentId] as const,
    forSelect: (filter: StudentFilter) =>
      [...peopleKeys.students.all(), 'select', filter] as const,
    status: (studentId: number | undefined) =>
      [...peopleKeys.students.all(), 'status', studentId] as const,
    contacts: (studentId: number | undefined) =>
      [...peopleKeys.students.all(), 'contacts', studentId] as const,
    subjectGroups: (studentId: number | undefined) =>
      [...peopleKeys.students.all(), 'classes', studentId] as const,
    updateStudent: () =>
      [...peopleKeys.students.all(), 'updateStudent'] as const,
    medical: (studentId: number | undefined) =>
      [...peopleKeys.students.all(), 'medical', studentId] as const,
    upsertStudentMedicalCondition: () =>
      [...peopleKeys.students.all(), 'upsertStudentMedicalCondition'] as const,
    studentsForSiblingSearch: () =>
      [...peopleKeys.students.all(), 'studentsForSiblingSearch'] as const,
  },
};
