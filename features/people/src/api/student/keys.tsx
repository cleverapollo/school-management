import { StudentFilter } from '@tyro/api';

export const peopleStudentsKeys = {
  all: ['peopleStudents'] as const,
  details: (studentId: number | undefined) =>
    [...peopleStudentsKeys.all, studentId] as const,
  personalDetails: (studentId: number | undefined) =>
    [...peopleStudentsKeys.all, 'personal', studentId] as const,
  forSelect: (filter: StudentFilter) =>
    [...peopleStudentsKeys.all, 'select', filter] as const,
  status: (studentId: number | undefined) =>
    [...peopleStudentsKeys.all, 'status', studentId] as const,
  contacts: (studentId: number | undefined) =>
    [...peopleStudentsKeys.all, 'contacts', studentId] as const,
  subjectGroups: (studentId: number | undefined) =>
    [...peopleStudentsKeys.all, 'classes', studentId] as const,
};
