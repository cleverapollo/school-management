import {
  StaffFilter,
  StudentFilter,
  CalendarEventFilter,
  EventAttendanceFilter,
  StudentSessionAttendanceFilter,
  CalendarAttendanceFilter,
  CalendarDayBellTimeFilter,
  NonClassContactHoursFilter,
  Notes_NotesFilter,
  Core_PeopleFilter,
  Notes_BehaviourFilter,
  Notes_BehaviourCategoryFilter,
  SubjectGroupRelationshipFilter,
  Print_PersonsGroupMemberships,
} from '@tyro/api';

export const peopleKeys = {
  all: ['people'] as const,
  common: {
    basedOnPartyIds: (filter: Core_PeopleFilter) =>
      [...peopleKeys.all, 'basedOnPartyIds', filter] as const,
  },
  print: (filter: Print_PersonsGroupMemberships) => [
    ...peopleKeys.all,
    'print',
    filter,
  ],
  contacts: {
    all: () => [...peopleKeys.all, 'contacts'] as const,
    personalDetails: (contactId: number | undefined) =>
      [...peopleKeys.contacts.all(), 'personal', contactId] as const,
    students: (contactId: number | undefined) =>
      [...peopleKeys.contacts.all(), 'students', contactId] as const,
    forSelect: () => [...peopleKeys.contacts.all(), 'select'] as const,
  },
  notes: {
    all: () => [...peopleKeys.all, 'notes'] as const,
    noteTags: () => [...peopleKeys.notes.all(), 'noteTags'] as const,
    behaviourTags: () => [...peopleKeys.notes.all(), 'behaviourTags'] as const,
    behaviourCategories: () =>
      [...peopleKeys.notes.all(), 'behaviourCategories'] as const,
  },
  staff: {
    all: () => [...peopleKeys.all, 'staff'] as const,
    details: (filter: StaffFilter) =>
      [...peopleKeys.staff.all(), filter] as const,
    forSelect: (filter: StaffFilter) =>
      [...peopleKeys.staff.all(), 'select', filter] as const,
    status: (staffId: number | undefined) =>
      [...peopleKeys.staff.all(), 'status', staffId] as const,
    subjectGroups: (
      filter: StaffFilter,
      subjectGroupMembershipFilter: SubjectGroupRelationshipFilter | undefined
    ) =>
      [
        ...peopleKeys.staff.all(),
        'classes',
        filter,
        subjectGroupMembershipFilter,
      ] as const,
    personalDetails: (filter: StaffFilter) =>
      [...peopleKeys.staff.all(), 'personal', filter] as const,
    employmentCapacities: () =>
      [...peopleKeys.staff.all(), 'employmentCapacities'] as const,
    staffPosts: () => [...peopleKeys.staff.all(), 'staffPosts'] as const,
    nonClassContacts: (filter: NonClassContactHoursFilter) =>
      [...peopleKeys.staff.all(), 'nonClassContacts', filter] as const,
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
    notes: (filter: Notes_NotesFilter) =>
      [...peopleKeys.students.all(), 'notes', filter] as const,
    behaviours: (studentId: number | undefined) =>
      [...peopleKeys.students.all(), 'behaviours', studentId] as const,
    subjectGroups: (studentIds: number[]) =>
      [...peopleKeys.students.all(), 'classes', studentIds] as const,
    medical: (studentId: number | undefined) =>
      [...peopleKeys.students.all(), 'medical', studentId] as const,
    aen: (studentId: number | undefined) =>
      [...peopleKeys.students.all(), 'aen', studentId] as const,
    medicalConditions: () =>
      [...peopleKeys.students.all(), 'medicalConditions'] as const,
    studentsForSiblingSearch: () =>
      [...peopleKeys.students.all(), 'studentsForSiblingSearch'] as const,
    personalTitlesList: () =>
      [...peopleKeys.students.all(), 'personalTitlesList'] as const,
    sessionAttendance: (filter: StudentSessionAttendanceFilter) =>
      [...peopleKeys.students.all(), 'sessionAttendance', filter] as const,
    tableSessionAttendance: (filter: StudentSessionAttendanceFilter) =>
      [...peopleKeys.students.all(), 'tableSessionAttendance', filter] as const,
    studentDailyCalendarTimetableInformation: (filter: CalendarEventFilter) =>
      [
        ...peopleKeys.students.all(),
        'studentDailyCalendarTimetableInformation',
        filter,
      ] as const,
    timetableEventInformation: (filter: CalendarEventFilter) =>
      [
        ...peopleKeys.students.all(),
        'timetableEventInformation',
        filter,
      ] as const,
    eventAttendance: (filter: EventAttendanceFilter) =>
      [...peopleKeys.students.all(), 'eventAttendance', filter] as const,
    studentCalendarAttendance: (filter: CalendarAttendanceFilter) =>
      [
        ...peopleKeys.students.all(),
        'studentCalendarAttendance',
        filter,
      ] as const,
    calendarBellTimes: (filter: CalendarDayBellTimeFilter) =>
      [...peopleKeys.students.all(), 'calendarBellTimes', filter] as const,
    individualStudentBehaviours: (filter: Notes_BehaviourFilter) =>
      [
        ...peopleKeys.students.all(),
        'individualStudentBehaviours',
        filter,
      ] as const,
    individualStudentBehavioursCategories: (filter: Notes_BehaviourFilter) =>
      [
        ...peopleKeys.students.all(),
        'individualStudentBehavioursCategories',
        filter,
      ] as const,
    behaviourLevels: (filter: Notes_BehaviourCategoryFilter) =>
      [...peopleKeys.students.all(), 'behaviourLevels', filter] as const,
  },
};
