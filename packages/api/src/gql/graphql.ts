/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** An arbitrary precision signed decimal */
  BigDecimal: number;
  /** An RFC-3339 compliant Full Date Scalar */
  Date: string;
  /** An RFC-3339 compliant DateTime Scalar */
  DateTime: string;
  /** A 64-bit signed integer */
  Long: number;
  /** An object scalar */
  Object: any;
  /** 24-hour clock time value string in the format `hh:mm:ss` or `hh:mm:ss.sss`. */
  Time: string;
};

export type AcademicNamespace = {
  __typename?: 'AcademicNamespace';
  academicNamespaceId: Scalars['Int'];
  description?: Maybe<Scalars['String']>;
  endDate: Scalars['Date'];
  isActiveDefaultNamespace: Scalars['Boolean'];
  name: Scalars['String'];
  startDate: Scalars['Date'];
  type: AcademicNamespaceType;
  year: Scalars['Int'];
};

export type AcademicNamespaceFilter = {
  academicNamespaceIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export enum AcademicNamespaceType {
  WaitingList = 'WAITING_LIST',
  Year = 'YEAR'
}

export enum AccessUserType {
  Contact = 'CONTACT',
  Staff = 'STAFF',
  Student = 'STUDENT'
}

export type ActivePlan = {
  __typename?: 'ActivePlan';
  active?: Maybe<Scalars['Boolean']>;
  studentPartyId?: Maybe<Scalars['Long']>;
};

export type ActiveSupportPlanFilter = {
  studentPartyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
};

export enum Activity {
  GuidanceAndCounselling = 'GUIDANCE_AND_COUNSELLING',
  HomeSchoolLiaison = 'HOME_SCHOOL_LIAISON',
  OtherActivity = 'OTHER_ACTIVITY',
  ProgrammeCoordination = 'PROGRAMME_COORDINATION',
  Support = 'SUPPORT',
  TimetabledHoursInOtherSchools = 'TIMETABLED_HOURS_IN_OTHER_SCHOOLS'
}

export type Address = {
  __typename?: 'Address';
  active?: Maybe<Scalars['Boolean']>;
  city?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  line1?: Maybe<Scalars['String']>;
  line2?: Maybe<Scalars['String']>;
  line3?: Maybe<Scalars['String']>;
  partyId: Scalars['Long'];
  postCode?: Maybe<Scalars['String']>;
  primaryAddress?: Maybe<Scalars['Boolean']>;
};

export type Assessment = {
  __typename?: 'Assessment';
  academicNamespaceId: Scalars['Int'];
  assessmentType: AssessmentType;
  captureHouseMasterComment: Scalars['Boolean'];
  capturePrincipalComment: Scalars['Boolean'];
  captureTarget: Scalars['Boolean'];
  captureTutorComment: Scalars['Boolean'];
  captureYearHeadComment: Scalars['Boolean'];
  commentBank?: Maybe<AssessmentCommentBank>;
  commentLength?: Maybe<Scalars['Int']>;
  commentType: CommentType;
  /** deep linked */
  createdBy: Person;
  createdByPartyId: Scalars['Long'];
  createdOn: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  endDate: Scalars['Date'];
  externalSystemId?: Maybe<Scalars['String']>;
  extraFields?: Maybe<Array<AssessmentExtraField>>;
  gradeSets?: Maybe<Array<AssessmentGradeSet>>;
  gradeType?: Maybe<GradeType>;
  id: Scalars['Long'];
  name: Scalars['String'];
  passFailThreshold?: Maybe<Scalars['Int']>;
  publish: Scalars['Boolean'];
  publishLearner: Scalars['Boolean'];
  startDate: Scalars['Date'];
  yearGroupEnrollmentPartyIds?: Maybe<Array<Scalars['Long']>>;
  yearGroupIds?: Maybe<Array<Scalars['Int']>>;
  /** deep linked */
  years?: Maybe<Array<YearGroup>>;
};

export type AssessmentComment = {
  __typename?: 'AssessmentComment';
  assessmentId: Scalars['Long'];
  comment?: Maybe<Scalars['String']>;
  commentBankCommentId?: Maybe<Scalars['Long']>;
  commenterPartyId: Scalars['Long'];
  commenterUserType: CommenterUserType;
  id: Scalars['Long'];
  studentPartyId: Scalars['Long'];
  subjectGroupPartyId: Scalars['Long'];
};

export type AssessmentCommentBank = {
  __typename?: 'AssessmentCommentBank';
  commentBankId: Scalars['Long'];
  commentBankName?: Maybe<Scalars['String']>;
};

export type AssessmentCommentFilter = {
  assessmentId?: InputMaybe<Scalars['Long']>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
  studentPartyId?: InputMaybe<Scalars['Long']>;
};

export type AssessmentExtraField = {
  __typename?: 'AssessmentExtraField';
  assessmentId: Scalars['Long'];
  commentBankId?: Maybe<Scalars['Long']>;
  commentBankName?: Maybe<Scalars['String']>;
  commentLength?: Maybe<Scalars['Int']>;
  externalSystemId?: Maybe<Scalars['String']>;
  extraFieldType: ExtraFieldType;
  gradeSetId?: Maybe<Scalars['Long']>;
  id: Scalars['Long'];
  name: Scalars['String'];
  selectOptions?: Maybe<Array<Scalars['String']>>;
};

export type AssessmentFilter = {
  academicNameSpaceId?: InputMaybe<Scalars['Int']>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
};

export type AssessmentGradeSet = {
  __typename?: 'AssessmentGradeSet';
  gradeSetId: Scalars['Long'];
  gradeSetName?: Maybe<Scalars['String']>;
};

export type AssessmentResult = {
  __typename?: 'AssessmentResult';
  assessmentId?: Maybe<Scalars['Long']>;
  externalSystemId?: Maybe<Scalars['String']>;
  extraFields?: Maybe<Array<ResultExtraField>>;
  gradeId?: Maybe<Scalars['Long']>;
  gradeNameTextId?: Maybe<Scalars['Int']>;
  gradeResult?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Long']>;
  result?: Maybe<Scalars['Int']>;
  student: Person;
  studentClassGroup: Scalars['String'];
  studentPartyId: Scalars['Long'];
  studentProgramme?: Maybe<Programme>;
  studentStudyLevel?: Maybe<StudyLevel>;
  subjectGroup: SubjectGroup;
  subjectGroupId: Scalars['Long'];
  targetGrade?: Maybe<Scalars['String']>;
  targetGradeNameTextId?: Maybe<Scalars['Int']>;
  targetGradeResult?: Maybe<Scalars['String']>;
  targetResult?: Maybe<Scalars['Int']>;
  teacherComment?: Maybe<AssessmentComment>;
};

export type AssessmentResultFilter = {
  assessmentId?: InputMaybe<Scalars['Long']>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
  studentPartyId?: InputMaybe<Scalars['Long']>;
  subjectGroupIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
};

export type AssessmentSubjectGroup = {
  __typename?: 'AssessmentSubjectGroup';
  commentsEntered: Scalars['Int'];
  commentsTotal: Scalars['Int'];
  resultsEntered: Scalars['Int'];
  resultsTotal: Scalars['Int'];
  subjectGroup: SubjectGroup;
};

export type AssessmentSubjectGroupsFilter = {
  assessmentId?: InputMaybe<Scalars['Long']>;
  subjectGroupIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
};

export enum AssessmentType {
  InClass = 'IN_CLASS',
  StateCba = 'STATE_CBA',
  Term = 'TERM'
}

export type AssignLabelInput = {
  labelId: Scalars['Long'];
  mailId: Scalars['Long'];
  threadId: Scalars['Long'];
};

export type AttendanceCode = {
  __typename?: 'AttendanceCode';
  active: Scalars['Boolean'];
  code?: Maybe<TuslaCode>;
  codeType: AttendanceCodeType;
  custom: Scalars['Boolean'];
  description?: Maybe<Scalars['String']>;
  descriptionTextId?: Maybe<Scalars['Int']>;
  id: Scalars['Int'];
  name: Scalars['String'];
  nameTextId?: Maybe<Scalars['Int']>;
  sessionCodeType: AttendanceCodeType;
  visibleForContact: Scalars['Boolean'];
  visibleForTeacher: Scalars['Boolean'];
};

export type AttendanceCodeFilter = {
  active?: InputMaybe<Scalars['Boolean']>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  teachingGroupCodes?: InputMaybe<Scalars['Boolean']>;
  visibleForContacts?: InputMaybe<Scalars['Boolean']>;
  visibleForTeachers?: InputMaybe<Scalars['Boolean']>;
};

export enum AttendanceCodeType {
  ExplainedAbsence = 'EXPLAINED_ABSENCE',
  Late = 'LATE',
  NotTaken = 'NOT_TAKEN',
  Present = 'PRESENT',
  UnexplainedAbsence = 'UNEXPLAINED_ABSENCE'
}

export type AttendanceEventId = {
  /**  the date for which this event is scheduled */
  date?: InputMaybe<Scalars['Date']>;
  /**  the calendar event id that this attendance event related to */
  eventId?: InputMaybe<Scalars['Int']>;
};

export type Attendance_BulkAttendanceAction = {
  __typename?: 'Attendance_BulkAttendanceAction';
  attendanceCode: AttendanceCode;
  attendanceCodeId: Scalars['Int'];
  attendanceForPartyIds: Array<Scalars['Long']>;
  createdBy: AuditPerson;
  createdByPartyId: Scalars['Long'];
  createdByUserId: Scalars['Int'];
  createdOn: Scalars['DateTime'];
  endDate?: Maybe<Scalars['Date']>;
  id: Scalars['Int'];
  leavesAt: Scalars['Time'];
  note?: Maybe<Scalars['String']>;
  partial: Scalars['Boolean'];
  parties: Array<Maybe<Party>>;
  returnsAt?: Maybe<Scalars['Time']>;
  startDate: Scalars['Date'];
};

export type Attendance_BulkAttendanceActionFilter = {
  from?: InputMaybe<Scalars['Date']>;
  partyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
  to?: InputMaybe<Scalars['Date']>;
};

export type Attendance_SaveBulkAttendanceInput = {
  attendanceCodeId: Scalars['Int'];
  attendanceForPartyIds: Array<Scalars['Long']>;
  multiDate?: InputMaybe<Attendance_SaveBulkAttendanceMultiDateInput>;
  note?: InputMaybe<Scalars['String']>;
  partialDate?: InputMaybe<Attendance_SaveBulkAttendancePartialDateInput>;
  /**  either singleDate or multiDate or partialDate should be provided */
  singleDate?: InputMaybe<Attendance_SaveBulkAttendanceSingleDateInput>;
};

export type Attendance_SaveBulkAttendanceMultiDateInput = {
  endDate: Scalars['Date'];
  startDate: Scalars['Date'];
};

export type Attendance_SaveBulkAttendancePartialDateInput = {
  date: Scalars['Date'];
  leavesAt: Scalars['Time'];
  returnsAt: Scalars['Time'];
};

export type Attendance_SaveBulkAttendanceSingleDateInput = {
  date: Scalars['Date'];
};

export type AuditId = {
  __typename?: 'AuditId';
  partyId?: Maybe<Scalars['Long']>;
  userId?: Maybe<Scalars['Int']>;
};

export type AuditPerson = {
  __typename?: 'AuditPerson';
  partyId?: Maybe<Scalars['Long']>;
  person?: Maybe<Person>;
  userId?: Maybe<Scalars['Int']>;
};

export type BellTimeFilter = {
  ids: Array<InputMaybe<Scalars['Int']>>;
};

export type BlockFilter = {
  blockIds?: InputMaybe<Array<Scalars['String']>>;
  classGroupIds?: InputMaybe<Array<Scalars['Long']>>;
  yearGroupIds?: InputMaybe<Array<Scalars['Int']>>;
};

export type BlockRotation = {
  __typename?: 'BlockRotation';
  endDate: Scalars['Date'];
  iteration: Scalars['Int'];
  startDate: Scalars['Date'];
  subjectGroupIds: Array<Scalars['Long']>;
};

export type CalculateGradeFilter = {
  programmeShortName: Scalars['String'];
  result: Scalars['Int'];
  studyLevel: StudyLevel;
};

export type CalculatedGrade = {
  __typename?: 'CalculatedGrade';
  grade?: Maybe<Scalars['String']>;
};

export type Calendar = {
  __typename?: 'Calendar';
  academicEndDate: Scalars['Date'];
  academicNamespaceId: Scalars['Int'];
  academicStartDate: Scalars['Date'];
  /**  end Date of the Calendar this will typically be after the end of the academic year */
  endDate: Scalars['Date'];
  id: Scalars['Int'];
  /**  start Date of the Calendar this will typically be the before start of the academic year */
  startDate: Scalars['Date'];
};

export type CalendarAttendance = {
  __typename?: 'CalendarAttendance';
  attendances: Array<CalendarAttendanceDay>;
  totalAbsent: Scalars['Int'];
  totalLate: Scalars['Int'];
  totalNotTaken: Scalars['Int'];
  totalPartial: Scalars['Int'];
  totalPresent: Scalars['Int'];
  totalUnexplained: Scalars['Int'];
};

export type CalendarAttendanceDay = {
  __typename?: 'CalendarAttendanceDay';
  date: Scalars['Date'];
  partiallyTaken: Scalars['Boolean'];
  status: AttendanceCodeType;
};

export type CalendarAttendanceFilter = {
  from: Scalars['Date'];
  partyId: Scalars['Long'];
  to: Scalars['Date'];
};

export type CalendarDayBellTime = {
  __typename?: 'CalendarDayBellTime';
  bellTimeIds?: Maybe<Array<Scalars['Int']>>;
  /** deep linked */
  bellTimes?: Maybe<Array<Calendar_BellTime>>;
  date: Scalars['Date'];
  dayType: DayType;
};

export type CalendarDayBellTimeFilter = {
  bellTimeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  calendarId?: InputMaybe<Scalars['Int']>;
  fromDate: Scalars['Date'];
  toDate: Scalars['Date'];
};

/**  Information about the grid for a specific date */
export type CalendarDayInfo = {
  __typename?: 'CalendarDayInfo';
  date: Scalars['Date'];
  dayType: SchoolDayType;
  endTime?: Maybe<Scalars['DateTime']>;
  periods: Array<CalendarGridPeriodInfo>;
  startTime?: Maybe<Scalars['DateTime']>;
};

export type CalendarDayInfoFilter = {
  calendarIds?: InputMaybe<Array<Scalars['Int']>>;
  fromDate: Scalars['Date'];
  toDate: Scalars['Date'];
};

export type CalendarDayInfoId = {
  __typename?: 'CalendarDayInfoId';
  date?: Maybe<Scalars['Date']>;
  eventId: Scalars['Int'];
};

export type CalendarEvent = {
  __typename?: 'CalendarEvent';
  allDayEvent: Scalars['Boolean'];
  attendees: Array<CalendarEventAttendee>;
  calendarEventId: CalendarEventId;
  calendarIds: Array<Maybe<Scalars['Int']>>;
  colour?: Maybe<Colour>;
  createdByUserId: Scalars['Int'];
  description?: Maybe<Scalars['String']>;
  editable: Scalars['Boolean'];
  endTime: Scalars['DateTime'];
  eventId: Scalars['Int'];
  exclusions: Array<CalendarEventAttendee>;
  extensions?: Maybe<CalendarEventExtension>;
  lessonInfo?: Maybe<CalendarEventLessonRaw>;
  name: Scalars['String'];
  roomIds: Array<Scalars['Int']>;
  rooms: Array<Room>;
  startTime: Scalars['DateTime'];
  tags: Array<CalendarTag>;
  type: CalendarEventType;
};

export type CalendarEventAttendee = {
  __typename?: 'CalendarEventAttendee';
  isAugment: Scalars['Boolean'];
  partyId: Scalars['Long'];
  /**  deep linked */
  partyInfo?: Maybe<Party>;
  type: CalendarEventAttendeeType;
};

export enum CalendarEventAttendeeType {
  Additional = 'ADDITIONAL',
  Attendee = 'ATTENDEE',
  Organiser = 'ORGANISER'
}

export type CalendarEventExtension = {
  __typename?: 'CalendarEventExtension';
  doeNotUser?: Maybe<Scalars['String']>;
  /**  attendance for this event. The list is empty if no attendance has been taken */
  eventAttendance?: Maybe<Array<Maybe<EventAttendance>>>;
};

export type CalendarEventFilter = {
  calendarIds?: InputMaybe<Array<Scalars['Int']>>;
  endDate: Scalars['Date'];
  eventIds?: InputMaybe<Array<Scalars['Int']>>;
  individualEventFilter?: InputMaybe<IndividualEventFilter>;
  resources: CalendarResourceFilter;
  startDate: Scalars['Date'];
};

export type CalendarEventId = {
  __typename?: 'CalendarEventId';
  date?: Maybe<Scalars['Date']>;
  eventId: Scalars['Int'];
};

export type CalendarEventIdInput = {
  date: Scalars['Date'];
  eventId: Scalars['Int'];
};

export type CalendarEventIteratorFilter = {
  calendarIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  eventStartTime?: InputMaybe<Scalars['DateTime']>;
  iterator?: InputMaybe<Iterator>;
  partyId: Scalars['Long'];
};

export type CalendarEventLessonRaw = {
  __typename?: 'CalendarEventLessonRaw';
  lessonId?: Maybe<Scalars['Int']>;
  subjectGroupId: Scalars['Long'];
};

export type CalendarEventRaw = {
  __typename?: 'CalendarEventRaw';
  attendeeAugments: Array<Calendar_EventAttendeeAugment>;
  calendarIds: Array<Scalars['Int']>;
  colour?: Maybe<Colour>;
  createdByUserId: Scalars['Int'];
  description?: Maybe<Scalars['String']>;
  eventId: Scalars['Int'];
  lessonInfo?: Maybe<CalendarEventLessonRaw>;
  name: Scalars['String'];
  roomAugments: Array<Calendar_EventRoomAugment>;
  schedule: Array<CalendarEventRawSchedule>;
  source?: Maybe<CalendarEventSource>;
  sourceId?: Maybe<Scalars['String']>;
  tags: Array<CalendarTag>;
  type: CalendarEventType;
};

export type CalendarEventRawAttendee = {
  __typename?: 'CalendarEventRawAttendee';
  /**  ... Defaults to event End Date. Used in cases where attendee will not be attending all events */
  endDate?: Maybe<Scalars['Date']>;
  partyId: Scalars['Long'];
  /**  ... Defaults to event Recurrence Rule. Used in cases where attendee will not be attending all events */
  recurrenceRule?: Maybe<Scalars['String']>;
  /**  ... Defaults to event Start Date. Used in cases where attendee will not be attending all events */
  startDate?: Maybe<Scalars['Date']>;
  type: CalendarEventAttendeeType;
};

export type CalendarEventRawExcludedAttendee = {
  __typename?: 'CalendarEventRawExcludedAttendee';
  endDate?: Maybe<Scalars['Date']>;
  /**  either this or other date fields can be set */
  individualDates?: Maybe<Array<Maybe<Scalars['Date']>>>;
  partyId: Scalars['Long'];
  /**  ... Defaults to event Recurrence Rule.  Used in cases where attendee will not excluded from all events */
  recurrenceRule?: Maybe<Scalars['String']>;
  /**  ... Defaults to event Start Date. Used in cases where attendee will not excluded from all events */
  startDate?: Maybe<Scalars['Date']>;
};

export type CalendarEventRawExcludedRoom = {
  __typename?: 'CalendarEventRawExcludedRoom';
  /**  ... Defaults to event End Date. Used in cases where attendee will not be attending all events */
  endDate?: Maybe<Scalars['Date']>;
  /**  ... Defaults to event Recurrence Rule. Used in cases where attendee will not be attending all events */
  recurrenceRule?: Maybe<Scalars['String']>;
  roomId: Scalars['Int'];
  /**  ... Defaults to event Start Date. Used in cases where attendee will not be attending all events */
  startDate?: Maybe<Scalars['Date']>;
};

export type CalendarEventRawFilter = {
  calendarId?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  eventId?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  eventSources?: InputMaybe<Array<Calender_EventSourceInput>>;
};

export type CalendarEventRawRoom = {
  __typename?: 'CalendarEventRawRoom';
  /**  ... Defaults to event End Date. Used in cases where attendee will not be attending all events */
  endDate?: Maybe<Scalars['Date']>;
  /**  ... Defaults to event Recurrence Rule. Used in cases where attendee will not be attending all events */
  recurrenceRule?: Maybe<Scalars['String']>;
  roomId: Scalars['Int'];
  /**  ... Defaults to event Start Date. Used in cases where attendee will not be attending all events */
  startDate?: Maybe<Scalars['Date']>;
};

export type CalendarEventRawSchedule = {
  __typename?: 'CalendarEventRawSchedule';
  allDayEvent?: Maybe<Scalars['Boolean']>;
  attendees: Array<CalendarEventRawAttendee>;
  /**  end date of the recurrence */
  endDate?: Maybe<Scalars['Date']>;
  endTime: Scalars['Time'];
  eventId: Scalars['Int'];
  exclusions: Array<CalendarEventRawExcludedAttendee>;
  /**  iCal/rfc5545 recurrence rule for event. Null means single */
  recurrenceRule?: Maybe<Scalars['String']>;
  roomExclusions: Array<CalendarEventRawExcludedRoom>;
  rooms?: Maybe<Array<Maybe<CalendarEventRawRoom>>>;
  scheduleId: Scalars['Int'];
  startDate: Scalars['Date'];
  startTime: Scalars['Time'];
};

export enum CalendarEventSource {
  Manual = 'MANUAL',
  Timetable = 'TIMETABLE'
}

export enum CalendarEventType {
  General = 'GENERAL',
  Lesson = 'LESSON'
}

export type CalendarFilter = {
  calendarId?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export type CalendarGrid = {
  __typename?: 'CalendarGrid';
  calendarId: Scalars['Int'];
  days?: Maybe<Array<Maybe<CalendarGridDay>>>;
  /**  date grid is active from. default to calendar dates if null */
  fromDate?: Maybe<Scalars['Date']>;
  gridIdx: Scalars['Int'];
  gridVersion: Scalars['Int'];
  /**  date grid is active to. default to calendar dates if null */
  toDate?: Maybe<Scalars['Date']>;
};

export type CalendarGridDay = {
  __typename?: 'CalendarGridDay';
  dayIdx: Scalars['Int'];
  endTime: Scalars['Time'];
  isoDayOfWeek: Scalars['Int'];
  periods: Array<CalendarGridPeriod>;
  startTime: Scalars['Time'];
};

export type CalendarGridDayRaw = {
  __typename?: 'CalendarGridDayRaw';
  /**  iso day of week. 1 monday .. 7 sunday */
  dayOfWeek: Scalars['Int'];
  /**  the distinct number and order for the days */
  idx: Scalars['Int'];
  periods: Array<CalendarGridPeriodRaw>;
};

export type CalendarGridFilter = {
  gridIds?: InputMaybe<Array<Scalars['Int']>>;
};

export type CalendarGridPeriod = {
  __typename?: 'CalendarGridPeriod';
  endTime: Scalars['Time'];
  /**  periods are sequential with no gapes between them */
  periodIdx: Scalars['Int'];
  startTime: Scalars['Time'];
  type: CalendarGridPeriodType;
};

export type CalendarGridPeriodInfo = {
  __typename?: 'CalendarGridPeriodInfo';
  endTime: Scalars['DateTime'];
  /**  periods are sequential with no gapes between them */
  startTime: Scalars['DateTime'];
  type: CalendarGridPeriodType;
};

export type CalendarGridPeriodRaw = {
  __typename?: 'CalendarGridPeriodRaw';
  endTime: Scalars['Time'];
  /**  the distinct number and order for the periods */
  idx: Scalars['Int'];
  /**  periods are sequential with no gapes between them */
  startTime: Scalars['Time'];
  type: CalendarGridPeriodType;
};

export enum CalendarGridPeriodType {
  Break = 'BREAK',
  Class = 'CLASS'
}

/** ## Raw information about the grid. i.e. it is not tied to a date */
export type CalendarGridRaw = {
  __typename?: 'CalendarGridRaw';
  idx: Scalars['Int'];
  versions?: Maybe<Array<Maybe<CalendarGridVersionRaw>>>;
};

export type CalendarGridVersionRaw = {
  __typename?: 'CalendarGridVersionRaw';
  days?: Maybe<Array<Maybe<CalendarGridDayRaw>>>;
  idx: Scalars['Int'];
  /**  date grid is val from. null means the start of the calendar date */
  validFrom?: Maybe<Scalars['Date']>;
  version: Scalars['Int'];
};

export type CalendarResourceFilter = {
  partyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
  roomIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export enum CalendarResourceTypeEnum {
  Party = 'PARTY',
  Room = 'ROOM'
}

export type CalendarTag = {
  __typename?: 'CalendarTag';
  context: Calendar_TagContext;
  label: Scalars['String'];
};

export type CalendarTagInput = {
  context?: InputMaybe<Calendar_TagContext>;
  label: Scalars['String'];
};

export type Calendar_AugmentEvent = {
  addAttendees?: InputMaybe<Array<InputMaybe<Calendar_AugmentEventAddAttendee>>>;
  addRooms?: InputMaybe<Array<InputMaybe<Calendar_AugmentEventAddRoom>>>;
  augmentId: CalendarTagInput;
  eventId: Scalars['Int'];
  excludeAttendees?: InputMaybe<Array<InputMaybe<Calendar_AugmentEventExcludeAttendee>>>;
  excludeRooms?: InputMaybe<Array<InputMaybe<Calendar_AugmentEventExcludeRoom>>>;
  tags?: InputMaybe<Array<CalendarTagInput>>;
};

export type Calendar_AugmentEventAddAttendee = {
  continuousEndDate?: InputMaybe<Scalars['Date']>;
  continuousStartDate?: InputMaybe<Scalars['Date']>;
  /**   set either dates or continuousStartDate and continuousEndDate */
  dates: Array<Scalars['Date']>;
  partyId: Scalars['Long'];
  type: CalendarEventAttendeeType;
};

export type Calendar_AugmentEventAddRoom = {
  continuousEndDate?: InputMaybe<Scalars['Date']>;
  continuousStartDate?: InputMaybe<Scalars['Date']>;
  /**   set either dates or continuousStartDate and continuousEndDate */
  dates: Array<Scalars['Date']>;
  roomId: Scalars['Int'];
};

export type Calendar_AugmentEventExcludeAttendee = {
  continuousEndDate?: InputMaybe<Scalars['Date']>;
  continuousStartDate?: InputMaybe<Scalars['Date']>;
  /**   set either dates or continuousStartDate and continuousEndDate */
  dates: Array<Scalars['Date']>;
  partyId: Scalars['Long'];
};

export type Calendar_AugmentEventExcludeRoom = {
  continuousEndDate?: InputMaybe<Scalars['Date']>;
  continuousStartDate?: InputMaybe<Scalars['Date']>;
  /**   set either dates or continuousStartDate and continuousEndDate */
  dates: Array<Scalars['Date']>;
  roomId: Scalars['Int'];
};

export type Calendar_AugmentEvents = {
  augments: Array<Calendar_AugmentEvent>;
};

export type Calendar_BellTime = {
  __typename?: 'Calendar_BellTime';
  id: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
  nameTextId: Scalars['Int'];
  time: Scalars['Time'];
};

export type Calendar_CreateBellTimeInput = {
  name: Array<TranslationInput>;
  time: Scalars['Time'];
};

export type Calendar_CreateCalendarDayInput = {
  date: Scalars['Date'];
  dayType: DayType;
  description?: InputMaybe<Scalars['String']>;
  /**  if day is a school day type, day type id must be provided */
  schoolDayTypeId?: InputMaybe<Scalars['Int']>;
};

export type Calendar_CreateSchoolDayTypeInput = {
  bellTimeIds: Array<Scalars['Int']>;
  description?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
};

export type Calendar_DatetimeFilterCondition = {
  afterTime?: InputMaybe<Scalars['Time']>;
  attendeePartyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
  beforeTime?: InputMaybe<Scalars['Time']>;
  /**  filters for only these dates within the range */
  dateArray?: InputMaybe<Array<Scalars['Date']>>;
  eventIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  roomIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export type Calendar_DeleteEvent = {
  deleteBySource: Array<Calender_EventSourceInput>;
};

export type Calendar_DeleteEventAugments = {
  augments: Array<Scalars['String']>;
};

export type Calendar_EditEvent = {
  /**  if present will replace existing values else no update */
  attendees?: InputMaybe<Array<CreateCalendarEventAttendeeInput>>;
  /**  either eventId or eventSource and eventSourceId must be provided */
  eventId?: InputMaybe<Scalars['Int']>;
  /**  if present will replace existing values else no update */
  exclusions?: InputMaybe<Array<CreateCalendarEventAttendeeInput>>;
  /**  if present will replace existing values else no update */
  rooms?: InputMaybe<Array<CreateCalendarEventRoomInput>>;
  /**  if present will replace existing values else no update */
  schedule?: InputMaybe<Calendar_EditEventSchedule>;
  sourceId?: InputMaybe<Calender_EventSourceInput>;
};

export type Calendar_EditEventSchedule = {
  /**  end date of the recurrence. This is set Or occurrences is set */
  endDate?: InputMaybe<Scalars['Date']>;
  endTime: Scalars['Time'];
  /**  number of occurrences. This is set Or endDate is set */
  occurrences?: InputMaybe<Scalars['Int']>;
  /**  Tyro Enum for iCal/rfc5545 recurrence rule for event. Null means single. Set either this or recurrenceRule */
  recurrenceEnum?: InputMaybe<RecurrenceEnum>;
  /**  iCal/rfc5545 recurrence rule for event. Null means single. Set either this or recurrenceEnum */
  recurrenceRule?: InputMaybe<Scalars['String']>;
  /**
   *  this should take into account the effective start date and the day of the week of the event
   *  the date has to be set here there may ne multi week timetables and we cannot infer the date from nextOrSame day after the effective from date
   */
  startDate: Scalars['Date'];
  startTime: Scalars['Time'];
};

export enum Calendar_EditEventSource {
  Timetable = 'TIMETABLE'
}

export type Calendar_EditEvents = {
  calendarId: Scalars['Int'];
  editSource: Calendar_EditEventSource;
  /**  defaults to tomorrow if not present */
  effectiveFromDate?: InputMaybe<Scalars['Date']>;
  events: Array<Calendar_EditEvent>;
};

export type Calendar_EventAttendeeAugment = {
  __typename?: 'Calendar_EventAttendeeAugment';
  endDate?: Maybe<Scalars['Date']>;
  inclusionType: Calendar_InclusionType;
  individualDates: Array<Scalars['Date']>;
  partyId: Scalars['Long'];
  startDate?: Maybe<Scalars['Date']>;
  tags: Array<CalendarTag>;
  type: CalendarEventAttendeeType;
};

export type Calendar_EventIteratorResult = {
  __typename?: 'Calendar_EventIteratorResult';
  event?: Maybe<CalendarEvent>;
  eventsOnSameDayForSameGroup?: Maybe<Array<CalendarEvent>>;
};

export type Calendar_EventRoomAugment = {
  __typename?: 'Calendar_EventRoomAugment';
  endDate?: Maybe<Scalars['Date']>;
  inclusionType: Calendar_InclusionType;
  individualDates: Array<Scalars['Date']>;
  roomId: Scalars['Int'];
  startDate?: Maybe<Scalars['Date']>;
  tags: Array<CalendarTag>;
};

export enum Calendar_InclusionType {
  Exclude = 'EXCLUDE',
  Include = 'INCLUDE'
}

export type Calendar_SchoolDayType = {
  __typename?: 'Calendar_SchoolDayType';
  bellTimeIds: Array<Scalars['Int']>;
  bellTimes: Array<Calendar_BellTime>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
  time: Scalars['Time'];
};

export enum Calendar_TagContext {
  Augment = 'AUGMENT',
  EventType = 'EVENT_TYPE',
  Substitution = 'SUBSTITUTION'
}

export type Calendar_UpdateDays = {
  calendarId?: InputMaybe<Scalars['Int']>;
  days?: InputMaybe<Array<InputMaybe<Calendar_CreateCalendarDayInput>>>;
};

export type Calender_EventSourceInput = {
  source: CalendarEventSource;
  sourceId: Scalars['String'];
};

export type CatalogueSuccess = {
  __typename?: 'CatalogueSuccess';
  message?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type ChairPerson = {
  __typename?: 'ChairPerson';
  chairPersonId?: Maybe<Scalars['Int']>;
  endDate?: Maybe<Scalars['Date']>;
  forename?: Maybe<Scalars['String']>;
  phoneNo?: Maybe<Scalars['String']>;
  startDate?: Maybe<Scalars['Date']>;
  surname?: Maybe<Scalars['String']>;
};

export type ClashingParty = {
  __typename?: 'ClashingParty';
  clash: Array<Scalars['String']>;
  party: Party;
  partyId: Scalars['Long'];
};

export type ClashingRooms = {
  __typename?: 'ClashingRooms';
  clash: Array<Scalars['String']>;
  room: Room;
  roomId: Scalars['Int'];
};

export type ClassGroupInfo = {
  __typename?: 'ClassGroupInfo';
  yearGroupId: Scalars['Int'];
};

export type ClassGroupInfoInput = {
  yearGroupId: Scalars['Int'];
};

export enum Colour {
  Amber = 'amber',
  Blue = 'blue',
  Cyan = 'cyan',
  Emerald = 'emerald',
  Fuchsia = 'fuchsia',
  Green = 'green',
  Lime = 'lime',
  Orange = 'orange',
  Pink = 'pink',
  Purple = 'purple',
  Red = 'red',
  Rose = 'rose',
  Sky = 'sky',
  Teal = 'teal',
  Violet = 'violet',
  Yellow = 'yellow'
}

export type Comment = {
  __typename?: 'Comment';
  active: Scalars['Boolean'];
  comment: Scalars['String'];
  externalSystemId?: Maybe<Scalars['String']>;
  id: Scalars['Long'];
};

export type CommentBank = {
  __typename?: 'CommentBank';
  active: Scalars['Boolean'];
  comments?: Maybe<Array<Comment>>;
  description?: Maybe<Scalars['String']>;
  externalSystemId?: Maybe<Scalars['String']>;
  id: Scalars['Long'];
  name: Scalars['String'];
};

export type CommentBankFilter = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
};

export enum CommentType {
  Both = 'BOTH',
  CommentBank = 'COMMENT_BANK',
  FreeForm = 'FREE_FORM',
  None = 'NONE'
}

export enum CommenterUserType {
  HouseMaster = 'HOUSE_MASTER',
  Principal = 'PRINCIPAL',
  Teacher = 'TEACHER',
  Tutor = 'TUTOR',
  YearHead = 'YEAR_HEAD'
}

export enum Context {
  All = 'ALL',
  Calendar = 'CALENDAR',
  Mail = 'MAIL',
  Party = 'PARTY',
  SessionAttendance = 'SESSION_ATTENDANCE',
  Sms = 'SMS'
}

export type CoreBlock = {
  __typename?: 'CoreBlock';
  blockId: Scalars['String'];
  classGroupIds: Array<Scalars['Long']>;
  description?: Maybe<Scalars['String']>;
  isRotation: Scalars['Boolean'];
  name: Scalars['String'];
  rotations: Array<BlockRotation>;
  subjectGroupIds: Array<Scalars['Long']>;
  subjectGroupNamesJoined?: Maybe<Scalars['String']>;
  yearGroupIds: Array<Scalars['Int']>;
};

export type Core_ContactInput = {
  contactPartyId: Scalars['Long'];
  relationshipType: StudentContactType;
  studentPartyId: Scalars['Long'];
};

export type Core_CustomGroupDefinition = {
  __typename?: 'Core_CustomGroupDefinition';
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Long']>;
  name: Scalars['String'];
  organiserIds?: Maybe<Array<Scalars['Long']>>;
  organisers?: Maybe<Array<Person>>;
  staffDynamic?: Maybe<Core_CustomGroupQuery>;
  staffIdsStatic?: Maybe<Array<Scalars['Long']>>;
  staffStatic?: Maybe<Array<Person>>;
  studentIdsStatic?: Maybe<Array<Scalars['Long']>>;
  studentsDynamic?: Maybe<Core_CustomGroupQuery>;
  studentsStatic?: Maybe<Array<Student>>;
};

export type Core_CustomGroupDefinitionFilter = {
  partyId: Scalars['Long'];
};

export type Core_CustomGroupFieldOptions = {
  __typename?: 'Core_CustomGroupFieldOptions';
  staff: Array<Core_QueryBuilderField>;
  student: Array<Core_QueryBuilderField>;
};

export type Core_CustomGroupQuery = {
  __typename?: 'Core_CustomGroupQuery';
  params: Array<Scalars['String']>;
  query: Scalars['String'];
};

export type Core_CustomGroupQueryInput = {
  params: Array<Scalars['String']>;
  query: Scalars['String'];
};

export type Core_EnableBlockRotationInput = {
  blockId: Scalars['String'];
  iterations: Array<Core_EnableBlockRotationIterationInput>;
  rotationName: Scalars['String'];
};

export type Core_EnableBlockRotationIterationInput = {
  endDate?: InputMaybe<Scalars['Date']>;
  startDate?: InputMaybe<Scalars['Date']>;
};

export type Core_LinkContacts = {
  upsert?: InputMaybe<Array<InputMaybe<Core_ContactInput>>>;
};

export type Core_LinkSiblings = {
  delete?: InputMaybe<Array<InputMaybe<Core_SiblingInput>>>;
  upsert?: InputMaybe<Array<InputMaybe<Core_SiblingInput>>>;
};

export type Core_LinkSiblingsAndContacts = {
  /**  add these contacts with default permissions if they are not already linked */
  linkContacts: Array<Core_LinkSiblingsAndContactsContactInfo>;
  linkSiblings: Array<Scalars['Long']>;
  studentPartyId: Scalars['Long'];
  unlinkSiblings: Array<Scalars['Long']>;
};

export type Core_LinkSiblingsAndContactsContactInfo = {
  contactPartyId?: InputMaybe<Scalars['Long']>;
  relationshipType?: InputMaybe<StudentContactType>;
};

export type Core_ModifyBlockClassGroup = {
  blockId: Scalars['String'];
  change: Core_ModifyMembershipEnum;
  classGroupId: Scalars['Long'];
};

export type Core_ModifyBlocks = {
  changeClassGroups?: InputMaybe<Array<Core_ModifyBlockClassGroup>>;
};

export enum Core_ModifyMembershipEnum {
  Add = 'ADD',
  Remove = 'REMOVE'
}

export type Core_ModifyMemberships = {
  staffGroupMemberships?: InputMaybe<Array<Core_ModifyStaffSubjectGroupMembership>>;
  studentSubjectGroupMemberships?: InputMaybe<Array<Core_ModifyStudentSubjectGroupMembership>>;
};

export type Core_ModifyStaffSubjectGroupMembership = {
  change: Core_ModifyMembershipEnum;
  fromDate?: InputMaybe<Scalars['Date']>;
  groupPartyId: Scalars['Long'];
  /**
   *  mandatory on adding a member
   *  on delete will only remove if the role matches the existing role or will delete all if blank
   */
  roles?: InputMaybe<Array<InputMaybe<StaffGroupMembershipRoles>>>;
  staffPartyId: Scalars['Long'];
  toDate?: InputMaybe<Scalars['Date']>;
};

export type Core_ModifyStudentSubjectGroupMembership = {
  change: Core_ModifyMembershipEnum;
  fromDate?: InputMaybe<Scalars['Date']>;
  groupPartyId: Scalars['Long'];
  studentPartyId: Scalars['Long'];
  toDate?: InputMaybe<Scalars['Date']>;
};

export type Core_NonEnrolledSibling = {
  __typename?: 'Core_NonEnrolledSibling';
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  partyId: Scalars['Long'];
};

/**
 * type Core_UserAccess {
 *     personPartyId: Long!
 *     #deep linked
 *     person: Person!
 *     email: String
 *     webLastLogin: DateTime
 *     mobileLastLogin: DateTime
 *     status: UserAccessStatus
 *     invitationId: Long
 *     invitingPersonPartyId: Long
 *     #deep linked
 *     invitingPerson: Person
 *     invitedOn: DateTime
 * }
 */
export type Core_PartyInAcademicNamespace = {
  __typename?: 'Core_PartyInAcademicNamespace';
  academicNamespaceId: Scalars['Int'];
  partyId: Scalars['Long'];
};

/**
 * input Core_UserAccessFilter {
 *     partyIds: [Long]
 *     userType: UserType!
 * }
 */
export type Core_PartyInAcademicNamespaceFilter = {
  academicNamespaceId?: InputMaybe<Scalars['Int']>;
  partyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
};

export type Core_QueryBuilderField = {
  __typename?: 'Core_QueryBuilderField';
  defaultValue?: Maybe<Scalars['String']>;
  label: Scalars['String'];
  name: Scalars['String'];
  operators: Array<Core_QueryBuilderOperator>;
  valueEditorType: Core_QueryBuilderValueTypeEditor;
};

export type Core_QueryBuilderOperator = {
  __typename?: 'Core_QueryBuilderOperator';
  label: Scalars['String'];
  name: Scalars['String'];
};

export enum Core_QueryBuilderValueTypeEditor {
  Autocomplete = 'autocomplete',
  Checkbox = 'checkbox',
  Date = 'date',
  Datetime = 'datetime',
  Multiselect = 'multiselect',
  Radio = 'radio',
  Select = 'select',
  SwitchToggle = 'switch_toggle',
  Text = 'text',
  Textarea = 'textarea',
  Time = 'time'
}

export type Core_SiblingInput = {
  studentPartyId1: Scalars['Long'];
  studentPartyId2: Scalars['Long'];
};

export type Core_Siblings = {
  __typename?: 'Core_Siblings';
  enrolledSiblings: Array<Student>;
  enrolledSiblingsPartyIds: Array<Scalars['Long']>;
  nonEnrolledSiblings: Array<Core_NonEnrolledSibling>;
  studentPartyId: Scalars['Long'];
};

export type Core_SiblingsFilter = {
  studentId: Array<Scalars['Long']>;
};

export type Core_SwitchSubjectGroupType = {
  subjectGroupPartyId: Array<InputMaybe<Scalars['Long']>>;
  type: SubjectGroupType;
};

export type Core_UpdateStudentContactRelationshipInput = {
  allowAccessToStudentData?: InputMaybe<Scalars['Boolean']>;
  allowedToContact?: InputMaybe<Scalars['Boolean']>;
  contactPartyId: Scalars['Long'];
  includeInSms?: InputMaybe<Scalars['Boolean']>;
  includeInTmail?: InputMaybe<Scalars['Boolean']>;
  legalGuardian?: InputMaybe<Scalars['Boolean']>;
  pickupRights?: InputMaybe<Scalars['Boolean']>;
  priority?: InputMaybe<Scalars['Int']>;
  relationshipType?: InputMaybe<StudentContactType>;
  studentPartyId: Scalars['Long'];
};

export type Core_UpsertCustomGroupDefinition = {
  description?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Long']>;
  name: Scalars['String'];
  organisers?: InputMaybe<Array<Scalars['Long']>>;
  staffDynamic?: InputMaybe<Core_CustomGroupQueryInput>;
  staffStatic?: InputMaybe<Array<Scalars['Long']>>;
  studentsDynamic?: InputMaybe<Core_CustomGroupQueryInput>;
  studentsStatic?: InputMaybe<Array<Scalars['Long']>>;
};

export type CreateCalendarEventAttendeeInput = {
  partyId: Scalars['Long'];
  /**  ... Defaults to event Recurrence Rule. Used in cases where attendee will not be attending all events */
  recurrenceRule?: InputMaybe<Scalars['String']>;
  /**  ... Defaults to event Start Date. Used in cases where attendee will not be attending all events */
  startDate?: InputMaybe<Scalars['Date']>;
  tags: Array<CalendarTagInput>;
  type: CalendarEventAttendeeType;
};

export type CreateCalendarEventExcludedAttendeeInput = {
  partyId: Scalars['Int'];
  /**  ... Defaults to event Recurrence Rule.  Used in cases where attendee will not excluded from all events */
  recurrenceRule?: InputMaybe<Scalars['String']>;
  /**  ... Defaults to event Start Date. Used in cases where attendee will not excluded from all events */
  startDate?: InputMaybe<Scalars['Date']>;
};

export type CreateCalendarEventInput = {
  allDayEvent?: InputMaybe<Scalars['Boolean']>;
  attendees?: InputMaybe<Array<CreateCalendarEventAttendeeInput>>;
  calendarIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  colour?: InputMaybe<Colour>;
  description?: InputMaybe<Scalars['String']>;
  /**  end date of the recurrence. This is set Or occurrences is set */
  endDate?: InputMaybe<Scalars['Date']>;
  endTime: Scalars['Time'];
  /**  defaults to manual */
  eventSource?: InputMaybe<CalendarEventSource>;
  eventSourceId?: InputMaybe<Scalars['String']>;
  exclusions?: InputMaybe<Array<CreateCalendarEventAttendeeInput>>;
  lessonInfo?: InputMaybe<CreateCalendarEventLessonInput>;
  name?: InputMaybe<Scalars['String']>;
  /**  number of occurrences. This is set Or endDate is set */
  occurrences?: InputMaybe<Scalars['Int']>;
  /**  Tyro Enum for iCal/rfc5545 recurrence rule for event. Null means single. Set either this or recurrenceRule */
  recurrenceEnum?: InputMaybe<RecurrenceEnum>;
  /**  iCal/rfc5545 recurrence rule for event. Null means single. Set either this or recurrenceEnum */
  recurrenceRule?: InputMaybe<Scalars['String']>;
  rooms?: InputMaybe<Array<CreateCalendarEventRoomInput>>;
  startDate: Scalars['Date'];
  startTime: Scalars['Time'];
  tags?: InputMaybe<Array<CalendarTagInput>>;
  type: CalendarEventType;
};

export type CreateCalendarEventLessonInput = {
  lessonId?: InputMaybe<Scalars['Int']>;
  subjectGroupId: Scalars['Long'];
};

export type CreateCalendarEventRoomInput = {
  /**  ... Defaults to event Recurrence Rule. Used in cases where attendee will not be attending all events */
  recurrenceRule?: InputMaybe<Scalars['String']>;
  roomId?: InputMaybe<Scalars['Int']>;
  /**  ... Defaults to event Start Date. Used in cases where attendee will not be attending all events */
  startDate?: InputMaybe<Scalars['Date']>;
  tags: Array<CalendarTagInput>;
};

export type CreateCalendarEventsInput = {
  allowClashes?: InputMaybe<Scalars['Boolean']>;
  events: Array<InputMaybe<CreateCalendarEventInput>>;
};

export type CreateCalendarInput = {
  academicNamespaceId: Scalars['Int'];
  calendarDayInput?: InputMaybe<Array<Calendar_CreateCalendarDayInput>>;
  endDate: Scalars['Date'];
  startDate: Scalars['Date'];
};

export type CreateGeneralGroupAcademicNamespacesInput = {
  academicNamespaceId: Scalars['Int'];
  classGroupInfo?: InputMaybe<ClassGroupInfoInput>;
  nameOverride?: InputMaybe<Scalars['String']>;
  staffMembers?: InputMaybe<Array<InputMaybe<StaffGroupMembershipInput>>>;
  studentMembers?: InputMaybe<Array<InputMaybe<CreateGeneralGroupStudentMembershipInput>>>;
};

export type CreateGeneralGroupInput = {
  academicNamespaces: Array<CreateGeneralGroupAcademicNamespacesInput>;
  archived?: InputMaybe<Scalars['Boolean']>;
  externalSystemInfo?: InputMaybe<Array<InputMaybe<ExternalSystemInfo>>>;
  generalGroupType: GeneralGroupType;
  includeInTimetable?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
};

export type CreateGeneralGroupStudentMembershipInput = {
  fromDate?: InputMaybe<Scalars['Date']>;
  partyId: Scalars['Long'];
  toDate?: InputMaybe<Scalars['Date']>;
};

export type CreateGroupAcademicNamespacesInput = {
  academicNamespaceId: Scalars['Int'];
  nameOverride?: InputMaybe<Scalars['String']>;
};

export type CreateGroupMembershipInput = {
  academicNamespaceId: Scalars['Int'];
  fromDate?: InputMaybe<Scalars['Date']>;
  partyId?: InputMaybe<Scalars['Long']>;
  studyLevel?: InputMaybe<StudyLevel>;
  toDate?: InputMaybe<Scalars['Date']>;
};

export type CreateProfileForGlobalUserInput = {
  globalUserId: Scalars['Int'];
  isActive?: InputMaybe<Scalars['Boolean']>;
  partyPersonId: Scalars['Long'];
  profileTypeId: Scalars['Int'];
};

export type CreateProfileType = {
  description: Array<InputMaybe<TranslationInput>>;
  name: Array<InputMaybe<TranslationInput>>;
  profileType?: InputMaybe<UserType>;
  roles: Array<InputMaybe<Scalars['Int']>>;
  uniqueName: Scalars['String'];
};

export type CreateProgramStageStaffMembership = {
  academicNamespaceId: Scalars['Int'];
  programmeId: Scalars['Int'];
  programmeStageId: Scalars['Int'];
  roles?: InputMaybe<Array<InputMaybe<StaffProgrammeStageMembershipRoles>>>;
  staffId: Scalars['Long'];
};

export type CreateRoleInput = {
  description: Array<InputMaybe<TranslationInput>>;
  name: Array<InputMaybe<TranslationInput>>;
  permissions: Array<InputMaybe<PermissionForGroup>>;
  uniqueName: Scalars['String'];
};

export type CreateStaffGroupMembershipInput = {
  academicNamespaceId: Scalars['Int'];
  fromDate?: InputMaybe<Scalars['Date']>;
  partyId?: InputMaybe<Scalars['Long']>;
  roles?: InputMaybe<Array<InputMaybe<StaffGroupMembershipRoles>>>;
  toDate?: InputMaybe<Scalars['Date']>;
};

export type CreateStudentEnrollment = {
  academicNamespaceId: Scalars['Int'];
  programmeId: Scalars['Int'];
  programmeStageId: Scalars['Int'];
  studentId: Scalars['Long'];
  yearGroupId: Scalars['Int'];
};

export type CreateStudentInput = {
  addresses?: InputMaybe<Array<InputMaybe<InputAddress>>>;
  birthCertFirstName?: InputMaybe<Scalars['String']>;
  birthCertSurname?: InputMaybe<Scalars['String']>;
  dateOfBirth?: InputMaybe<Scalars['Date']>;
  emails?: InputMaybe<Array<InputMaybe<InputEmailAddress>>>;
  exitDate?: InputMaybe<Scalars['Date']>;
  externalSystemInfo?: InputMaybe<ExternalSystemInfo>;
  firstName?: InputMaybe<Scalars['String']>;
  gender?: InputMaybe<Gender>;
  lastName?: InputMaybe<Scalars['String']>;
  leavingReason?: InputMaybe<Scalars['String']>;
  leftEarly?: InputMaybe<Scalars['Boolean']>;
  middleName?: InputMaybe<Scalars['String']>;
  nationality?: InputMaybe<Scalars['String']>;
  phoneNumbers?: InputMaybe<Array<InputMaybe<InputPhoneNumber>>>;
  repeatYear?: InputMaybe<Scalars['Boolean']>;
  startDate?: InputMaybe<Scalars['Date']>;
  studentIre?: InputMaybe<CreateStudentIreInput>;
  studentIrePP?: InputMaybe<CreateStudentIrePpInput>;
};

export type CreateStudentIreInput = {
  countryOfBirth?: InputMaybe<Scalars['String']>;
  pps?: InputMaybe<Scalars['String']>;
  religion?: InputMaybe<Scalars['String']>;
};

export type CreateStudentIrePpInput = {
  boardingDays?: InputMaybe<Scalars['String']>;
  borderIndicator?: InputMaybe<Scalars['Boolean']>;
  deceased?: InputMaybe<Scalars['Boolean']>;
  deceasedDate?: InputMaybe<Scalars['Date']>;
  deleted?: InputMaybe<Scalars['Boolean']>;
  destinationRollNo?: InputMaybe<Scalars['String']>;
  dpin?: InputMaybe<Scalars['Long']>;
  examEntrant?: InputMaybe<Scalars['Boolean']>;
  examNumber?: InputMaybe<Scalars['String']>;
  languageSupportApplicant?: InputMaybe<Scalars['Boolean']>;
  lockerNumber?: InputMaybe<Scalars['String']>;
  medicalCard?: InputMaybe<Scalars['Boolean']>;
  mothersMaidenName?: InputMaybe<Scalars['String']>;
  previousSchoolRollNumber?: InputMaybe<Scalars['String']>;
  previousSchoolType?: InputMaybe<Scalars['String']>;
  shortTermPupil?: InputMaybe<Scalars['Boolean']>;
  shortTermPupilNumWeeks?: InputMaybe<Scalars['Int']>;
  travellerHeritage?: InputMaybe<Scalars['Boolean']>;
};

export type CreateSubjectGroupInput = {
  academicNamespaces: Array<CreateGroupAcademicNamespacesInput>;
  archived?: InputMaybe<Scalars['Boolean']>;
  externalSystemInfo?: InputMaybe<Array<InputMaybe<ExternalSystemInfo>>>;
  includeInTimetable?: InputMaybe<Scalars['Boolean']>;
  irePP?: InputMaybe<Array<InputMaybe<CreateSubjectGroupIrePpInput>>>;
  membershipTypes: Array<SubjectGroupMembershipTypeInput>;
  name: Scalars['String'];
  staffMembers?: InputMaybe<Array<InputMaybe<CreateStaffGroupMembershipInput>>>;
  studentMembers?: InputMaybe<Array<InputMaybe<CreateGroupMembershipInput>>>;
  subjectGroupType?: InputMaybe<SubjectGroupType>;
  subjects: Array<InputMaybe<Scalars['Int']>>;
};

export type CreateSubjectGroupIrePpInput = {
  academicNamespaceId: Scalars['Int'];
  level?: InputMaybe<StudyLevel>;
};

export type CreateSubjectInput = {
  description?: InputMaybe<Array<InputMaybe<TranslationInput>>>;
  id?: InputMaybe<Scalars['Int']>;
  name: Array<InputMaybe<TranslationInput>>;
  nationalCode: Scalars['String'];
  shortCode: Array<InputMaybe<TranslationInput>>;
  subjectSource?: InputMaybe<SubjectSource>;
};

export type CreateTenantInput = {
  __typename?: 'CreateTenantInput';
  imgUrl?: Maybe<Scalars['String']>;
  location?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  region: Scalars['Int'];
  tenant: Scalars['Int'];
  type?: Maybe<Scalars['String']>;
};

export type CreateYearGroupStaffMembership = {
  academicNamespaceId: Scalars['Int'];
  roles?: InputMaybe<Array<InputMaybe<StaffYearGroupMembershipRoles>>>;
  staffId: Scalars['Long'];
  yearGroupId: Scalars['Int'];
};

export type CurrentAttendance = {
  __typename?: 'CurrentAttendance';
  attendanceCodeName?: Maybe<Scalars['String']>;
  codeType?: Maybe<AttendanceCodeType>;
};

export type CurrentStudentLocation = {
  __typename?: 'CurrentStudentLocation';
  currentAttendance?: Maybe<CurrentAttendance>;
  eventId?: Maybe<Scalars['Int']>;
  lesson?: Maybe<Scalars['String']>;
  room?: Maybe<Array<Maybe<Room>>>;
  studentPartyId?: Maybe<Scalars['Long']>;
  teacher?: Maybe<Scalars['String']>;
};

export type CurrentTimetableEvent = {
  __typename?: 'CurrentTimetableEvent';
  eventId?: Maybe<Scalars['Int']>;
  lesson?: Maybe<Scalars['String']>;
  partyId?: Maybe<Scalars['Long']>;
  room: Array<Room>;
  teacher?: Maybe<Scalars['String']>;
};

export type DashboardAssessment = {
  __typename?: 'DashboardAssessment';
  assessmentType: AssessmentType;
  description?: Maybe<Scalars['String']>;
  endDate: Scalars['Date'];
  id: Scalars['Long'];
  name: Scalars['String'];
  results?: Maybe<Array<DashboardAssessmentResult>>;
  startDate: Scalars['Date'];
};

export type DashboardAssessmentFilter = {
  studentPartyId?: InputMaybe<Scalars['Long']>;
};

export type DashboardAssessmentResult = {
  __typename?: 'DashboardAssessmentResult';
  assessmentId: Scalars['Long'];
  grade?: Maybe<Scalars['String']>;
  id: Scalars['Long'];
  result?: Maybe<Scalars['Int']>;
  studentPartyId: Scalars['Long'];
  studyLevel?: Maybe<StudyLevel>;
  subject: Scalars['String'];
  subjectGroupId: Scalars['Long'];
};

export enum Day {
  Friday = 'FRIDAY',
  Monday = 'MONDAY',
  Saturday = 'SATURDAY',
  Thursday = 'THURSDAY',
  Tuesday = 'TUESDAY',
  Wednesday = 'WEDNESDAY'
}

export enum DayType {
  Holiday = 'HOLIDAY',
  Partial = 'PARTIAL',
  SchoolDay = 'SCHOOL_DAY',
  StaffDay = 'STAFF_DAY'
}

export type DeactivateProfiles = {
  partyIds: Array<Scalars['Long']>;
};

export type DeleteDiscountInput = {
  id: Scalars['Int'];
};

export type DeleteFeeInput = {
  id: Scalars['Int'];
};

export type DeleteFileTransferInput = {
  feature: FileTransferFeature;
  id: Scalars['Int'];
};

export type DeleteNonClassContactHoursInput = {
  nonClassContactHoursId: Scalars['Int'];
  staffPartyId: Scalars['Int'];
};

export type DeleteStudentMedicalConditionInput = {
  id: Scalars['Int'];
  studentPartyId: Scalars['Long'];
};

export type DeleteStudentMedicalContactInput = {
  id: Scalars['Int'];
  studentPartyId: Scalars['Long'];
};

export type DeviceRegistration = {
  __typename?: 'DeviceRegistration';
  deviceId: Scalars['String'];
  deviceMake: Scalars['String'];
  deviceType: DeviceType;
  globalUserId: Scalars['Int'];
  id: Scalars['Long'];
  osVersion: Scalars['String'];
  personPartyId?: Maybe<Scalars['Long']>;
};

export type DeviceRegistrationFilter = {
  deviceIds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  globalUserIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
};

export enum DeviceType {
  Android = 'ANDROID',
  Ios = 'IOS'
}

export type Discount = {
  __typename?: 'Discount';
  description?: Maybe<Scalars['String']>;
  discountType: DiscountType;
  id: Scalars['Int'];
  name: Scalars['String'];
  validFor: ValidFor;
  value: Scalars['Float'];
};

export type DiscountFilter = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export enum DiscountType {
  Fixed = 'FIXED',
  Percentage = 'PERCENTAGE'
}

export type EmailAddress = {
  __typename?: 'EmailAddress';
  active?: Maybe<Scalars['Boolean']>;
  email?: Maybe<Scalars['String']>;
  emailId?: Maybe<Scalars['Int']>;
  partyId: Scalars['Long'];
  primaryEmail?: Maybe<Scalars['Boolean']>;
};

export type EnrollmentHistory = {
  __typename?: 'EnrollmentHistory';
  academicNamespace: Scalars['String'];
  academicNamespaceId: Scalars['Int'];
  classGroupId: Scalars['Long'];
  classGroupName: Scalars['String'];
  studentPartyId: Scalars['Long'];
};

export type EnrollmentIre_AutoAssignBlockMembershipInput = {
  assignmentType?: InputMaybe<EnrollmentIre_AutoAssignBlockMembershipType>;
  blockId: Scalars['String'];
};

export enum EnrollmentIre_AutoAssignBlockMembershipType {
  ByGender = 'BY_GENDER'
}

export type EnrollmentIre_AutoAssignCoreMembershipInput = {
  assignmentType?: InputMaybe<EnrollmentIre_AutoAssignCoreMembershipType>;
  yearGroupEnrollmentId: Scalars['Long'];
};

export enum EnrollmentIre_AutoAssignCoreMembershipType {
  ByGender = 'BY_GENDER'
}

/** ###  ire enrollment */
export type EnrollmentIre_BlockEnrollmentFilter = {
  blockId: Scalars['String'];
};

/**
 *  Within a block switch a student to a new subject group.
 *  For ADD Type
 *  Student will be added to chosen subject group and removed from the current subject group(within block) unless the subject group is set as allow duplicates
 *  For REMOVE Type
 *  Student will be remove from the subject group. They will then appear as unassigned(for this block). No further action taken
 */
export type EnrollmentIre_BlockMembershipChange = {
  studentId: Scalars['Long'];
  subjectGroupId: Scalars['Long'];
  type?: InputMaybe<EnrollmentIre_MembershipChangeEnum>;
};

export type EnrollmentIre_BlockMembershipStudent = {
  __typename?: 'EnrollmentIre_BlockMembershipStudent';
  classGroupName?: Maybe<Scalars['String']>;
  gender?: Maybe<Gender>;
  isDuplicate: Scalars['Boolean'];
  partyId: Scalars['Long'];
  person: Person;
};

export type EnrollmentIre_BlockMembershipSubjectGroup = {
  __typename?: 'EnrollmentIre_BlockMembershipSubjectGroup';
  avatarUrl?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  partyId: Scalars['Long'];
  staff: Array<Person>;
  students: Array<EnrollmentIre_BlockMembershipStudent>;
  subjects: Array<Subject>;
};

/**
 * ####
 * ###  ire enrollment
 */
export type EnrollmentIre_BlockMemberships = {
  __typename?: 'EnrollmentIre_BlockMemberships';
  block: CoreBlock;
  blockId: Scalars['String'];
  groups: Array<EnrollmentIre_BlockMembershipsDetails>;
  isRotation: Scalars['Boolean'];
};

export type EnrollmentIre_BlockMembershipsDetails = {
  __typename?: 'EnrollmentIre_BlockMembershipsDetails';
  rotationIteration: Scalars['Int'];
  subjectGroups: Array<EnrollmentIre_BlockMembershipSubjectGroup>;
  unenrolledStudents: Array<EnrollmentIre_BlockMembershipStudent>;
};

export type EnrollmentIre_ChangeProgrammeStage = {
  programmeStageId: Scalars['Int'];
  studentPartyId: Scalars['Long'];
};

export type EnrollmentIre_CoreEnrollmentFilter = {
  yearGroupEnrollmentId: Scalars['Long'];
};

export type EnrollmentIre_CoreMembershipChange = {
  classGroupId: Scalars['Long'];
  studentId: Scalars['Long'];
  type?: InputMaybe<EnrollmentIre_MembershipChangeEnum>;
};

export type EnrollmentIre_CoreMemberships = {
  __typename?: 'EnrollmentIre_CoreMemberships';
  classGroupIds: Array<Scalars['Long']>;
  classGroups: Array<GeneralGroup>;
  unenrolledStudentIds: Array<Scalars['Long']>;
  unenrolledStudents: Array<Student>;
  yearGroupEnrollment?: Maybe<YearGroupEnrollment>;
};

export enum EnrollmentIre_MembershipChangeEnum {
  Add = 'ADD',
  Remove = 'REMOVE'
}

/** ## Enrollment Ire */
export type EnrollmentIre_UpsertBlockMembership = {
  blockId: Scalars['String'];
  membershipChange: Array<EnrollmentIre_BlockMembershipChange>;
};

/**
 *  For ADD Type
 *  Student will be added to chosen class group and add to linked core subject groups for that class. They will be removed from the current Class Group and associated core Subject Groups. Duplicates are not allows
 *  For REMOVE Type
 *  Student will be removed from the current Class Group and associated core Subject Groups. They will then appear as unassigned (for any class group)
 */
export type EnrollmentIre_UpsertCoreMembership = {
  membershipChange: Array<EnrollmentIre_CoreMembershipChange>;
  /**
   *  @deprecated(reason: "This was used in the old implementation. It is no longer used.")
   *  todo handle graphql deprecated annotation internally
   */
  yearGroupEnrollmentId: Scalars['Long'];
};

export type EnrolmentHistoryFilter = {
  partyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
};

export type EventAttendance = {
  __typename?: 'EventAttendance';
  adminSubmitted: Scalars['Boolean'];
  attendanceCode: AttendanceCode;
  attendanceCodeId: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  createdBy: Person;
  createdByPartyId: Scalars['Long'];
  date: Scalars['Date'];
  eventId: Scalars['Int'];
  id: Scalars['Long'];
  note?: Maybe<Scalars['String']>;
  personPartyId: Scalars['Long'];
  updatedAt?: Maybe<Scalars['DateTime']>;
  updatedBy: Person;
  updatedByPartyId: Scalars['Long'];
};

export type EventAttendanceFilter = {
  date?: InputMaybe<Scalars['Date']>;
  eventIds?: InputMaybe<Array<AttendanceEventId>>;
  personPartyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
};

export type EventAttendanceReport = {
  __typename?: 'EventAttendanceReport';
  attendances: Array<EventAttendanceReportPerson>;
  periods: Array<EventAttendanceReportPeriod>;
};

export type EventAttendanceReportEntry = {
  __typename?: 'EventAttendanceReportEntry';
  attendanceCode?: Maybe<AttendanceCode>;
  attendanceCodeId?: Maybe<Scalars['Int']>;
  time: Scalars['Time'];
};

export type EventAttendanceReportFilter = {
  classGroupId: Scalars['Long'];
  date: Scalars['Date'];
};

export type EventAttendanceReportPeriod = {
  __typename?: 'EventAttendanceReportPeriod';
  time: Scalars['Time'];
};

export type EventAttendanceReportPerson = {
  __typename?: 'EventAttendanceReportPerson';
  attendances: Array<EventAttendanceReportEntry>;
  classGroup: GeneralGroup;
  classGroupId: Scalars['Long'];
  percentage: Scalars['Int'];
  possible: Scalars['Int'];
  present: Scalars['Int'];
  student: Person;
  studentPartyId: Scalars['Long'];
};

export type ExampleObjectExtension = {
  __typename?: 'ExampleObjectExtension';
  value?: Maybe<Scalars['String']>;
};

export type ExpandedParties = {
  __typename?: 'ExpandedParties';
  partyId?: Maybe<Array<Maybe<Scalars['Long']>>>;
};

export type ExpandedPartiesFilter = {
  partyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
};

export enum ExternalSystemEntityType {
  Contact = 'CONTACT',
  Group = 'GROUP',
  Room = 'ROOM',
  Staff = 'STAFF',
  Student = 'STUDENT'
}

export type ExternalSystemInfo = {
  /**  Used if external system has one to one mapping */
  externalId?: InputMaybe<Scalars['String']>;
  /**  Used if external system has many entities that we are mapping to one */
  externalIdArray?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  externalSystemEntityType?: InputMaybe<ExternalSystemEntityType>;
  externalSystemProvider?: InputMaybe<ExternalSystemProvider>;
};

export enum ExternalSystemProvider {
  Vsware = 'VSWARE'
}

export enum ExtraFieldType {
  CommentBank = 'COMMENT_BANK',
  FreeForm = 'FREE_FORM',
  GradeSet = 'GRADE_SET',
  Select = 'SELECT'
}

export enum Feature {
  Assessment = 'ASSESSMENT',
  Attendance = 'ATTENDANCE',
  Calendar = 'CALENDAR',
  Communications = 'COMMUNICATIONS',
  Fees = 'FEES',
  GeneralAdmin = 'GENERAL_ADMIN',
  Groups = 'GROUPS',
  Notes = 'NOTES',
  People = 'PEOPLE',
  PrintingAndExporting = 'PRINTING_AND_EXPORTING',
  Search = 'SEARCH',
  Settings = 'SETTINGS',
  StaffWorkManagement = 'STAFF_WORK_MANAGEMENT',
  Substitution = 'SUBSTITUTION',
  Timetable = 'TIMETABLE',
  TimetableConstruction = 'TIMETABLE_CONSTRUCTION',
  Users = 'USERS',
  Wellbeing = 'WELLBEING'
}

export type Fee = {
  __typename?: 'Fee';
  amount: Scalars['Float'];
  description?: Maybe<Scalars['String']>;
  discounts?: Maybe<Array<Maybe<Discount>>>;
  dueDate: Scalars['Date'];
  feeType: FeeType;
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type FeeFilter = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export enum FeeType {
  Standard = 'STANDARD',
  Voluntary = 'VOLUNTARY'
}

export enum FileTransferFeature {
  PartyPhotos = 'PARTY_PHOTOS',
  StudentDocs = 'STUDENT_DOCS',
  Temporary = 'TEMPORARY'
}

export type FileTransferFilter = {
  feature?: InputMaybe<FileTransferFeature>;
  referenceId?: InputMaybe<Scalars['String']>;
};

export type FileTransferResponse = {
  __typename?: 'FileTransferResponse';
  feature: FileTransferFeature;
  fileName: Scalars['String'];
  fileUrl: Scalars['String'];
  id: Scalars['Int'];
  referenceId: Scalars['String'];
};

/**  set either times OR recurrence OR atTimesOfEvents */
export type FindFreeResourcesFilter = {
  allRooms?: InputMaybe<Scalars['Boolean']>;
  atTimesOfEvents?: InputMaybe<Array<CalendarEventIdInput>>;
  /**  Optionally search for in particular calendars. If not specified, all calendars will be searched. */
  calendarIds?: InputMaybe<Array<Scalars['Int']>>;
  /**  Check against recurrence rules whether the resources are free or not. Times is set OR recurrence is set. */
  recurrence?: InputMaybe<FindFreeResourcesRecurrence>;
  resources: CalendarResourceFilter;
  /**  Check against these timeslots whether the resources are free or not. Times is set OR recurrence is set. */
  times?: InputMaybe<Array<InputMaybe<FindFreeResourcesTime>>>;
};

export type FindFreeResourcesRecurrence = {
  endDate?: InputMaybe<Scalars['Date']>;
  endTime: Scalars['Time'];
  fromDate: Scalars['Date'];
  occurrences?: InputMaybe<Scalars['Int']>;
  recurrence: RecurrenceEnum;
  startTime: Scalars['Time'];
};

export type FindFreeResourcesTime = {
  endTime: Scalars['Time'];
  fromDate: Scalars['Date'];
  startTime: Scalars['Time'];
  toDate: Scalars['Date'];
};

export type FreeCalendarResources = {
  __typename?: 'FreeCalendarResources';
  clashingParties: Array<ClashingParty>;
  clashingRooms: Array<ClashingRooms>;
  freeParties: Array<Party>;
  freePartyIds: Array<Scalars['Long']>;
  freeRoomIds: Array<Scalars['Int']>;
  freeRooms: Array<Room>;
};

export enum Gender {
  Female = 'FEMALE',
  Male = 'MALE'
}

export type GeneralGroup = Party & PartyGroup & {
  __typename?: 'GeneralGroup';
  avatarUrl?: Maybe<Scalars['String']>;
  blocks: Array<CoreBlock>;
  classGroupInfo?: Maybe<ClassGroupInfo>;
  /**     deep linked */
  contactMembers?: Maybe<Group>;
  /**     deep linked */
  contacts: Array<Person>;
  generalGroupType: GeneralGroupType;
  includeInTimetable?: Maybe<Scalars['Boolean']>;
  name: Scalars['String'];
  partyId: Scalars['Long'];
  programmeStages: Array<ProgrammeStage>;
  /**     deep linked */
  relatedSubjectGroups: Array<SubjectGroup>;
  /**     deep linked */
  staff: Array<Person>;
  /**     deep linked */
  staffMembers?: Maybe<Group>;
  /**     deep linked */
  studentMembers?: Maybe<Group>;
  /**     deep linked */
  students: Array<Student>;
  /**     deep linked */
  tutors: Array<Person>;
  /**     deep linked */
  yearGroupLeads: Array<Person>;
  /**     deep linked */
  yearGroups: Array<YearGroupEnrollment>;
};

export type GeneralGroupFilter = {
  groupTypes?: InputMaybe<Array<InputMaybe<GeneralGroupType>>>;
  isIncludeInTimetabling?: InputMaybe<Scalars['Boolean']>;
  partyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
};

export enum GeneralGroupType {
  ClassGroup = 'CLASS_GROUP',
  CustomGroup = 'CUSTOM_GROUP',
  DynamicGroup = 'DYNAMIC_GROUP',
  GeneralGroup = 'GENERAL_GROUP',
  StaticGroup = 'STATIC_GROUP'
}

export type GlobalUser = {
  __typename?: 'GlobalUser';
  activeProfileId?: Maybe<Scalars['Int']>;
  defaultProfileId?: Maybe<Scalars['Int']>;
  email?: Maybe<Scalars['String']>;
  /**   Integer id, String email, String name, Integer defaultProfileId, List<Profile> profiles */
  id: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
  profiles?: Maybe<Array<Maybe<Profile>>>;
};

export type Grade = {
  __typename?: 'Grade';
  active: Scalars['Boolean'];
  end: Scalars['Int'];
  externalSystemId?: Maybe<Scalars['String']>;
  id: Scalars['Long'];
  name: Scalars['String'];
  nameTextId: Scalars['Int'];
  passFailThreshold?: Maybe<Scalars['Int']>;
  start: Scalars['Int'];
  studyLevels?: Maybe<Array<Maybe<GradeSetStudyLevel>>>;
};

export type GradeSet = {
  __typename?: 'GradeSet';
  active: Scalars['Boolean'];
  customGradeSet: Scalars['Boolean'];
  description?: Maybe<Scalars['String']>;
  descriptionTextId?: Maybe<Scalars['Int']>;
  externalSystemId?: Maybe<Scalars['String']>;
  grades?: Maybe<Array<Grade>>;
  id: Scalars['Long'];
  isCba: Scalars['Boolean'];
  name: Scalars['String'];
  nameTextId: Scalars['Int'];
  passFailThreshold?: Maybe<Scalars['Int']>;
  years?: Maybe<Array<Scalars['Int']>>;
};

export type GradeSetFilter = {
  id?: InputMaybe<Scalars['Long']>;
};

export enum GradeSetStudyLevel {
  Common = 'COMMON',
  Foundation = 'FOUNDATION',
  Higher = 'HIGHER',
  NotApplicable = 'NOT_APPLICABLE',
  Ordinary = 'ORDINARY'
}

export enum GradeType {
  Both = 'BOTH',
  GradeSet = 'GRADE_SET',
  None = 'NONE',
  Percentage = 'PERCENTAGE'
}

export type Group = {
  __typename?: 'Group';
  groupPartyId: Scalars['Long'];
  memberCount: Scalars['Int'];
  memberIds: Array<Scalars['Long']>;
  /**     deep linked */
  members: Array<GroupMembership>;
};

export type GroupMembership = {
  __typename?: 'GroupMembership';
  fromDate?: Maybe<Scalars['Date']>;
  partyId: Scalars['Long'];
  /**     deep linked */
  person?: Maybe<Person>;
  roles?: Maybe<Array<Maybe<Scalars['String']>>>;
  toDate?: Maybe<Scalars['Date']>;
};

export type GroupProgrammeStage = {
  __typename?: 'GroupProgrammeStage';
  programmeId?: Maybe<Scalars['Int']>;
  programmeStage?: Maybe<ProgrammeStage>;
  programmeStageId?: Maybe<Scalars['Int']>;
};

export type ImportSubjectInput = {
  colour?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Array<InputMaybe<TranslationInput>>>;
  id?: InputMaybe<Scalars['Int']>;
  name: Array<InputMaybe<TranslationInput>>;
  nationalCode: Scalars['String'];
  region: Scalars['Int'];
  shortCode: Array<InputMaybe<TranslationInput>>;
  subjectSource?: InputMaybe<SubjectSource>;
};

export type IndividualEventFilter = {
  filterConditionsIncludeAugments?: InputMaybe<Scalars['Boolean']>;
  filterConditionsIncludeExclusions?: InputMaybe<Scalars['Boolean']>;
  orConditions?: InputMaybe<Array<Calendar_DatetimeFilterCondition>>;
};

export type InputAddress = {
  active: Scalars['Boolean'];
  addressId?: InputMaybe<Scalars['Int']>;
  city?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  line1?: InputMaybe<Scalars['String']>;
  line2?: InputMaybe<Scalars['String']>;
  line3?: InputMaybe<Scalars['String']>;
  postCode?: InputMaybe<Scalars['String']>;
  primaryAddress?: InputMaybe<Scalars['Boolean']>;
};

export type InputEmailAddress = {
  active: Scalars['Boolean'];
  email?: InputMaybe<Scalars['String']>;
  emailId?: InputMaybe<Scalars['Int']>;
  primaryEmail?: InputMaybe<Scalars['Boolean']>;
};

export type InputNextOfKin = {
  firstName?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
  phoneNumbers?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type InputPhoneNumber = {
  active: Scalars['Boolean'];
  areaCode?: InputMaybe<Scalars['String']>;
  countryCode?: InputMaybe<Scalars['String']>;
  label?: InputMaybe<Scalars['String']>;
  number?: InputMaybe<Scalars['String']>;
  phoneNumberId?: InputMaybe<Scalars['Int']>;
  primaryPhoneNumber?: InputMaybe<Scalars['Boolean']>;
};

export type InputStaffEmergencyContact = {
  additionalNumber?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
  primaryNumber?: InputMaybe<Scalars['String']>;
};

export type InviteUser = {
  email: Scalars['String'];
  givenName: Scalars['String'];
  personPartyId: Scalars['Long'];
  resend: Scalars['Boolean'];
  surname: Scalars['String'];
  userType: UserType;
};

export type InviteUsersResponse = {
  __typename?: 'InviteUsersResponse';
  userAccesses: Array<UserAccess>;
  validations?: Maybe<Array<Maybe<UserAccessValidation>>>;
};

export enum Iterator {
  Closest = 'CLOSEST',
  Next = 'NEXT',
  Previous = 'PREVIOUS'
}

export type Label = {
  __typename?: 'Label';
  colour?: Maybe<Colour>;
  custom?: Maybe<Scalars['Boolean']>;
  id: Scalars['Long'];
  name: Scalars['String'];
  personPartyId: Scalars['Long'];
  type: LabelType;
};

export type LabelFilter = {
  id?: InputMaybe<Scalars['Long']>;
  personPartyId?: InputMaybe<Scalars['Long']>;
};

export type LabelInput = {
  colour?: InputMaybe<Colour>;
  id?: InputMaybe<Scalars['Long']>;
  name: Scalars['String'];
};

export enum LabelType {
  Custom = 'Custom',
  Inbox = 'Inbox',
  Outbox = 'Outbox',
  Trash = 'Trash'
}

export type ListString = {
  __typename?: 'ListString';
  values: Array<Scalars['String']>;
};

export type Locale = {
  __typename?: 'Locale';
  id: Scalars['Int'];
  locale: Scalars['String'];
  name: Scalars['String'];
};

export type Mail = {
  __typename?: 'Mail';
  body?: Maybe<Scalars['String']>;
  canReply: Scalars['Boolean'];
  id: Scalars['Long'];
  labels: Array<Label>;
  latestMessage?: Maybe<Scalars['DateTime']>;
  readOn?: Maybe<Scalars['DateTime']>;
  recipients: Array<Recipient>;
  rootMailId: Scalars['Long'];
  sender: Person;
  senderPartyId: Scalars['Long'];
  sentOn: Scalars['DateTime'];
  starred?: Maybe<Scalars['Boolean']>;
  subject: Scalars['String'];
  threadId: Scalars['Long'];
  threads: Array<Mail>;
};

export type MailFilter = {
  id?: InputMaybe<Scalars['Long']>;
  labelId?: InputMaybe<Scalars['Long']>;
  pagination: Pagination;
  partyId?: InputMaybe<Scalars['Long']>;
  starred?: InputMaybe<Scalars['Boolean']>;
};

export type MailReadInput = {
  mailId: Scalars['Long'];
  threadId: Scalars['Long'];
};

export type MailStarredInput = {
  mailId: Scalars['Long'];
  starred: Scalars['Boolean'];
  threadId: Scalars['Long'];
};

export enum MemberType {
  Admin = 'ADMIN',
  Contact = 'CONTACT',
  External = 'EXTERNAL',
  Staff = 'STAFF',
  Student = 'STUDENT',
  ThirdParty = 'THIRD_PARTY'
}

export type Mutation = {
  __typename?: 'Mutation';
  admin__resetTenantCache: Success;
  asd?: Maybe<Scalars['String']>;
  assessment_saveAssessment?: Maybe<Assessment>;
  assessment_saveAssessmentComments?: Maybe<Array<AssessmentComment>>;
  assessment_saveAssessmentResults?: Maybe<Array<AssessmentResult>>;
  assessment_saveCommentBank?: Maybe<CommentBank>;
  assessment_saveGradeSet?: Maybe<GradeSet>;
  attendance_saveAttendanceCode: Array<AttendanceCode>;
  attendance_saveBulkAttendance?: Maybe<Success>;
  attendance_saveEventAttendance: Array<EventAttendance>;
  attendance_saveParentalAttendanceRequest: Array<ParentalAttendanceRequest>;
  attendance_saveStudentSessionAttendance: Array<StudentSessionAttendance>;
  attendance_withdrawParentalAttendanceRequest?: Maybe<Success>;
  calendar_createCalendarEvents?: Maybe<Array<Maybe<CalendarEventRaw>>>;
  calendar_updateCalendarDays?: Maybe<Success>;
  calendar_upsertBellTime?: Maybe<Success>;
  catalogue_createSubjects: Array<Subject>;
  catalogue_upsertSubjects?: Maybe<CatalogueSuccess>;
  communications_assignLabel?: Maybe<Mail>;
  communications_read?: Maybe<Scalars['String']>;
  communications_readNotification?: Maybe<Success>;
  communications_registerDevice?: Maybe<DeviceRegistration>;
  communications_saveLabel?: Maybe<Label>;
  communications_saveNotificationTemplate?: Maybe<NotificationTemplate>;
  communications_sendMail?: Maybe<Mail>;
  communications_sendNotification?: Maybe<NotificationSentResponse>;
  communications_sendSms?: Maybe<Scalars['String']>;
  communications_smsTopUp?: Maybe<SmsTopUpResponse>;
  communications_starred?: Maybe<Scalars['String']>;
  core_enableBlockRotations?: Maybe<Success>;
  core_linkSiblingsAndContacts: Success;
  core_modifyBlocks: Success;
  core_modifyGroupMemberships: Success;
  core_setActiveActiveAcademicNamespace?: Maybe<AcademicNamespace>;
  core_switchSubjectGroupType: Success;
  core_updateClassGroups?: Maybe<Success>;
  core_updateStaff: Success;
  core_updateStudentContactRelationships?: Maybe<Success>;
  core_updateStudentContacts: Success;
  core_updateStudents?: Maybe<Success>;
  core_updateSubjectGroups?: Maybe<Success>;
  core_updateYearGroupEnrollments?: Maybe<Success>;
  core_upsertAcademicNamespace?: Maybe<AcademicNamespace>;
  core_upsertCustomGroupDefinition: Success;
  core_upsertRooms: Array<Room>;
  core_upsertStaff?: Maybe<Array<Maybe<Staff>>>;
  core_upsertStudentContact: StudentContact;
  delete_file_transfer?: Maybe<Success>;
  eire_deleteNonClassContactHours?: Maybe<Success>;
  eire_upsertNonClassContactHours?: Maybe<Success>;
  enrollment_ire_autoAssignBlocks: Success;
  enrollment_ire_autoAssignCore: Success;
  enrollment_ire_changeProgrammeStage: Success;
  enrollment_ire_upsertBlockMemberships: EnrollmentIre_BlockMemberships;
  enrollment_ire_upsertCoreMemberships: EnrollmentIre_CoreMemberships;
  fees_deleteDiscount?: Maybe<Scalars['String']>;
  fees_deleteFee?: Maybe<Scalars['String']>;
  fees_saveDiscount?: Maybe<Discount>;
  fees_saveFee?: Maybe<Fee>;
  notes_deleteBehaviourCategory?: Maybe<Success>;
  notes_deleteNote?: Maybe<Success>;
  notes_upsertBehaviourCategory?: Maybe<Success>;
  notes_upsertBehaviourTags: Array<Notes_Tag>;
  notes_upsertNotes: Array<Notes_Note>;
  notes_upsertNotesTags: Array<Notes_Tag>;
  ppod_savePPODCredentials: PpodCredentials;
  swm_applySubstitutions: Success;
  swm_deleteAbsence: Success;
  swm_deleteSubstitutions: Success;
  swm_upsertAbsence: Array<Swm_StaffAbsence>;
  swm_upsertAbsenceType: Array<Swm_StaffAbsenceType>;
  tt_addLesson: Success;
  tt_cloneTimetable: TtTimetable;
  tt_editLessonInstance: Array<TtIndividualViewLesson>;
  tt_publish: Tt_PublishResult;
  tt_removeLesson: Success;
  tt_reset: Success;
  tt_swap: Success;
  tt_updateTimetableGroup: Success;
  tt_upsertSubjectGroup: Success;
  users_createProfileForGlobalUser?: Maybe<Profile>;
  users_deactivateProfiles?: Maybe<Success>;
  users_inviteUsers?: Maybe<InviteUsersResponse>;
  users_savePermissionGroup?: Maybe<PermissionGroup>;
  wellbeing_deleteStudentAen: Success;
  wellbeing_deleteStudentMedicalCondition: StudentMedical;
  wellbeing_deleteStudentMedicalContact: StudentMedical;
  wellbeing_savePriorityStudent?: Maybe<PriorityStudent>;
  wellbeing_saveStudentSupportFile?: Maybe<StudentSupportFile>;
  wellbeing_saveStudentSupportPlan?: Maybe<StudentSupportPlan>;
  wellbeing_saveStudentSupportPlanReview?: Maybe<StudentSupportPlanReview>;
  wellbeing_upsertStudentAen: Success;
  wellbeing_upsertStudentMedicalCondition: StudentMedical;
  wellbeing_upsertStudentMedicalContact: StudentMedical;
};


export type MutationAdmin__ResetTenantCacheArgs = {
  input?: InputMaybe<Scalars['Int']>;
};


export type MutationAssessment_SaveAssessmentArgs = {
  input?: InputMaybe<SaveAssessmentInput>;
};


export type MutationAssessment_SaveAssessmentCommentsArgs = {
  input?: InputMaybe<Array<InputMaybe<SaveAssessmentCommentInput>>>;
};


export type MutationAssessment_SaveAssessmentResultsArgs = {
  input?: InputMaybe<Array<InputMaybe<SaveAssessmentResultInput>>>;
};


export type MutationAssessment_SaveCommentBankArgs = {
  input?: InputMaybe<SaveCommentBankInput>;
};


export type MutationAssessment_SaveGradeSetArgs = {
  input?: InputMaybe<SaveGradeSetInput>;
};


export type MutationAttendance_SaveAttendanceCodeArgs = {
  input?: InputMaybe<Array<InputMaybe<SaveAttendanceCodeInput>>>;
};


export type MutationAttendance_SaveBulkAttendanceArgs = {
  input?: InputMaybe<Attendance_SaveBulkAttendanceInput>;
};


export type MutationAttendance_SaveEventAttendanceArgs = {
  input?: InputMaybe<Array<InputMaybe<SaveEventAttendanceInput>>>;
};


export type MutationAttendance_SaveParentalAttendanceRequestArgs = {
  input?: InputMaybe<Array<InputMaybe<SaveParentalAttendanceRequest>>>;
};


export type MutationAttendance_SaveStudentSessionAttendanceArgs = {
  input?: InputMaybe<SaveStudentSessionAttendanceInput>;
};


export type MutationAttendance_WithdrawParentalAttendanceRequestArgs = {
  input?: InputMaybe<WithdrawParentalAttendanceRequest>;
};


export type MutationCalendar_CreateCalendarEventsArgs = {
  input?: InputMaybe<CreateCalendarEventsInput>;
};


export type MutationCalendar_UpdateCalendarDaysArgs = {
  input?: InputMaybe<Calendar_UpdateDays>;
};


export type MutationCalendar_UpsertBellTimeArgs = {
  input?: InputMaybe<Calendar_CreateBellTimeInput>;
};


export type MutationCatalogue_CreateSubjectsArgs = {
  input?: InputMaybe<CreateSubjectInput>;
};


export type MutationCatalogue_UpsertSubjectsArgs = {
  input: Array<UpsertSubject>;
};


export type MutationCommunications_AssignLabelArgs = {
  input?: InputMaybe<AssignLabelInput>;
};


export type MutationCommunications_ReadArgs = {
  input?: InputMaybe<MailReadInput>;
};


export type MutationCommunications_ReadNotificationArgs = {
  input?: InputMaybe<NotificationReadInput>;
};


export type MutationCommunications_RegisterDeviceArgs = {
  input?: InputMaybe<RegisterDeviceInput>;
};


export type MutationCommunications_SaveLabelArgs = {
  input?: InputMaybe<LabelInput>;
};


export type MutationCommunications_SaveNotificationTemplateArgs = {
  input?: InputMaybe<SaveNotificationTemplateInput>;
};


export type MutationCommunications_SendMailArgs = {
  input?: InputMaybe<SendMailInput>;
};


export type MutationCommunications_SendNotificationArgs = {
  input?: InputMaybe<SendPushNotificationInput>;
};


export type MutationCommunications_SendSmsArgs = {
  input?: InputMaybe<SendSmsInput>;
};


export type MutationCommunications_SmsTopUpArgs = {
  input?: InputMaybe<SmsTopUpInput>;
};


export type MutationCommunications_StarredArgs = {
  input?: InputMaybe<MailStarredInput>;
};


export type MutationCore_EnableBlockRotationsArgs = {
  input?: InputMaybe<Core_EnableBlockRotationInput>;
};


export type MutationCore_LinkSiblingsAndContactsArgs = {
  input: Core_LinkSiblingsAndContacts;
};


export type MutationCore_ModifyBlocksArgs = {
  input: Core_ModifyBlocks;
};


export type MutationCore_ModifyGroupMembershipsArgs = {
  input: Core_ModifyMemberships;
};


export type MutationCore_SetActiveActiveAcademicNamespaceArgs = {
  input?: InputMaybe<SetActiveAcademicNamespace>;
};


export type MutationCore_SwitchSubjectGroupTypeArgs = {
  input: Core_SwitchSubjectGroupType;
};


export type MutationCore_UpdateClassGroupsArgs = {
  input?: InputMaybe<Array<InputMaybe<UpdateClassGroupGroupInput>>>;
};


export type MutationCore_UpdateStaffArgs = {
  input: Array<UpdateStaffInput>;
};


export type MutationCore_UpdateStudentContactRelationshipsArgs = {
  input?: InputMaybe<Array<InputMaybe<Core_UpdateStudentContactRelationshipInput>>>;
};


export type MutationCore_UpdateStudentContactsArgs = {
  input: Array<UpdateStudentContactInput>;
};


export type MutationCore_UpdateStudentsArgs = {
  input?: InputMaybe<Array<InputMaybe<UpdateStudentInput>>>;
};


export type MutationCore_UpdateSubjectGroupsArgs = {
  input?: InputMaybe<Array<InputMaybe<UpdateSubjectGroupInput>>>;
};


export type MutationCore_UpdateYearGroupEnrollmentsArgs = {
  input?: InputMaybe<Array<InputMaybe<UpdateYearGroupEnrollmentInput>>>;
};


export type MutationCore_UpsertAcademicNamespaceArgs = {
  input?: InputMaybe<SaveAcademicNamespaceInput>;
};


export type MutationCore_UpsertCustomGroupDefinitionArgs = {
  input: Core_UpsertCustomGroupDefinition;
};


export type MutationCore_UpsertRoomsArgs = {
  input?: InputMaybe<Array<InputMaybe<UpsertRoomInput>>>;
};


export type MutationCore_UpsertStaffArgs = {
  input?: InputMaybe<Array<InputMaybe<UpsertStaffInput>>>;
};


export type MutationCore_UpsertStudentContactArgs = {
  input: UpsertStudentContactInput;
};


export type MutationDelete_File_TransferArgs = {
  input: DeleteFileTransferInput;
};


export type MutationEire_DeleteNonClassContactHoursArgs = {
  input?: InputMaybe<DeleteNonClassContactHoursInput>;
};


export type MutationEire_UpsertNonClassContactHoursArgs = {
  input?: InputMaybe<SaveNonClassContactHoursInput>;
};


export type MutationEnrollment_Ire_AutoAssignBlocksArgs = {
  input: EnrollmentIre_AutoAssignBlockMembershipInput;
};


export type MutationEnrollment_Ire_AutoAssignCoreArgs = {
  input: EnrollmentIre_AutoAssignCoreMembershipInput;
};


export type MutationEnrollment_Ire_ChangeProgrammeStageArgs = {
  input: Array<EnrollmentIre_ChangeProgrammeStage>;
};


export type MutationEnrollment_Ire_UpsertBlockMembershipsArgs = {
  input: EnrollmentIre_UpsertBlockMembership;
};


export type MutationEnrollment_Ire_UpsertCoreMembershipsArgs = {
  input: EnrollmentIre_UpsertCoreMembership;
};


export type MutationFees_DeleteDiscountArgs = {
  input?: InputMaybe<DeleteDiscountInput>;
};


export type MutationFees_DeleteFeeArgs = {
  input?: InputMaybe<DeleteFeeInput>;
};


export type MutationFees_SaveDiscountArgs = {
  input?: InputMaybe<SaveDiscountInput>;
};


export type MutationFees_SaveFeeArgs = {
  input?: InputMaybe<SaveFeeInput>;
};


export type MutationNotes_DeleteBehaviourCategoryArgs = {
  input?: InputMaybe<Array<InputMaybe<Notes_BehaviourCategoryInput>>>;
};


export type MutationNotes_DeleteNoteArgs = {
  input?: InputMaybe<Notes_DeleteNotes>;
};


export type MutationNotes_UpsertBehaviourCategoryArgs = {
  input?: InputMaybe<Array<InputMaybe<Notes_BehaviourCategoryInput>>>;
};


export type MutationNotes_UpsertBehaviourTagsArgs = {
  input?: InputMaybe<Array<InputMaybe<Notes_UpsertBehaviourTagInput>>>;
};


export type MutationNotes_UpsertNotesArgs = {
  input?: InputMaybe<Array<InputMaybe<Notes_UpsertNote>>>;
};


export type MutationNotes_UpsertNotesTagsArgs = {
  input?: InputMaybe<Array<InputMaybe<Notes_UpsertNotesTagInput>>>;
};


export type MutationPpod_SavePpodCredentialsArgs = {
  input?: InputMaybe<SavePpodCredentials>;
};


export type MutationSwm_ApplySubstitutionsArgs = {
  input?: InputMaybe<Swm_InsertSubstitution>;
};


export type MutationSwm_DeleteAbsenceArgs = {
  input: Swm_DeleteStaffAbsence;
};


export type MutationSwm_DeleteSubstitutionsArgs = {
  input?: InputMaybe<Swm_DeleteSubstitution>;
};


export type MutationSwm_UpsertAbsenceArgs = {
  input: Array<Swm_UpsertStaffAbsence>;
};


export type MutationSwm_UpsertAbsenceTypeArgs = {
  input?: InputMaybe<Array<InputMaybe<Swm_UpsertStaffAbsenceType>>>;
};


export type MutationTt_AddLessonArgs = {
  input?: InputMaybe<Tt_AddLessonInput>;
};


export type MutationTt_CloneTimetableArgs = {
  input: TtCloneTimetableInput;
};


export type MutationTt_EditLessonInstanceArgs = {
  input: TtEditLessonPeriodInstanceWrapper;
};


export type MutationTt_PublishArgs = {
  input: TtPublishTimetableInput;
};


export type MutationTt_RemoveLessonArgs = {
  input?: InputMaybe<Array<Tt_RemoveLessonInput>>;
};


export type MutationTt_ResetArgs = {
  input: Tt_Reset;
};


export type MutationTt_SwapArgs = {
  input: TtSwapsInput;
};


export type MutationTt_UpdateTimetableGroupArgs = {
  input: Tt_UpdateTimetableGroupInput;
};


export type MutationTt_UpsertSubjectGroupArgs = {
  input?: InputMaybe<Tt_UpsertSubjectGroup>;
};


export type MutationUsers_CreateProfileForGlobalUserArgs = {
  input?: InputMaybe<CreateProfileForGlobalUserInput>;
};


export type MutationUsers_DeactivateProfilesArgs = {
  input?: InputMaybe<DeactivateProfiles>;
};


export type MutationUsers_InviteUsersArgs = {
  input?: InputMaybe<Array<InputMaybe<InviteUser>>>;
};


export type MutationUsers_SavePermissionGroupArgs = {
  input?: InputMaybe<SavePermissionGroup>;
};


export type MutationWellbeing_DeleteStudentAenArgs = {
  input: Wellbeing_DeleteStudentAenInput;
};


export type MutationWellbeing_DeleteStudentMedicalConditionArgs = {
  input: DeleteStudentMedicalConditionInput;
};


export type MutationWellbeing_DeleteStudentMedicalContactArgs = {
  input: DeleteStudentMedicalContactInput;
};


export type MutationWellbeing_SavePriorityStudentArgs = {
  input?: InputMaybe<SavePriorityStudentInput>;
};


export type MutationWellbeing_SaveStudentSupportFileArgs = {
  input?: InputMaybe<SaveStudentSupportFileInput>;
};


export type MutationWellbeing_SaveStudentSupportPlanArgs = {
  input?: InputMaybe<SaveStudentSupportPlanInput>;
};


export type MutationWellbeing_SaveStudentSupportPlanReviewArgs = {
  input?: InputMaybe<SaveStudentSupportPlanReviewInput>;
};


export type MutationWellbeing_UpsertStudentAenArgs = {
  input: Wellbeing_UpsertStudentAenInput;
};


export type MutationWellbeing_UpsertStudentMedicalConditionArgs = {
  input: UpsertStudentMedicalConditionInput;
};


export type MutationWellbeing_UpsertStudentMedicalContactArgs = {
  input: UpsertStudentMedicalContactInput;
};

export type MyLabelsFilter = {
  personPartyId: Scalars['Long'];
};

export enum Ncch_Programme {
  Jcsp = 'JCSP',
  JuniorCycle = 'JUNIOR_CYCLE',
  Lcvp = 'LCVP',
  LeavingCertificate = 'LEAVING_CERTIFICATE',
  LeavingCertificateApplied = 'LEAVING_CERTIFICATE_APPLIED',
  TransitionYear = 'TRANSITION_YEAR',
  Vpt2 = 'VPT2',
  Vtos = 'VTOS'
}

export type NextOfKin = {
  __typename?: 'NextOfKin';
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  phoneNumbers?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type NonClassContactHours = {
  __typename?: 'NonClassContactHours';
  academicNameSpaceId: Scalars['Int'];
  activity: Activity;
  dayOfTheWeek: Day;
  description?: Maybe<Scalars['String']>;
  hours: Scalars['Int'];
  minutes: Scalars['Int'];
  nonClassContactHoursId: Scalars['Int'];
  programme?: Maybe<Ncch_Programme>;
  staffPartyId: Scalars['Int'];
};

export type NonClassContactHoursFilter = {
  academicNameSpaceId: Scalars['Int'];
  staffPartyId: Scalars['Int'];
};

export type Notes_BehaviourCategory = {
  __typename?: 'Notes_BehaviourCategory';
  behaviourCategoryId: Scalars['Int'];
  behaviourType: Notes_BehaviourType;
  colour: Colour;
  description: Scalars['String'];
  name: Scalars['String'];
  tagIds: Array<Scalars['Int']>;
  tags: Array<Notes_Tag>;
};

export type Notes_BehaviourCategoryFilter = {
  categoryIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  type?: InputMaybe<Notes_BehaviourType>;
};

export type Notes_BehaviourCategoryInput = {
  behaviourType: Notes_BehaviourType;
  colour: Colour;
  description: Scalars['String'];
  id?: InputMaybe<Scalars['Int']>;
  name: Scalars['String'];
  tags?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export type Notes_BehaviourFilter = {
  behaviourType: Notes_BehaviourType;
  partyId: Scalars['Long'];
};

export enum Notes_BehaviourType {
  Negative = 'NEGATIVE',
  Neutral = 'NEUTRAL',
  Positive = 'POSITIVE'
}

export type Notes_DeleteNotes = {
  noteIds: Array<Scalars['Long']>;
};

export type Notes_Note = {
  __typename?: 'Notes_Note';
  associatedGroups?: Maybe<Array<Maybe<PartyGroup>>>;
  associatedPartiesIds?: Maybe<Array<Maybe<Scalars['Long']>>>;
  associatedPeople?: Maybe<Array<Maybe<Person>>>;
  createdBy: Scalars['Long'];
  createdByPerson?: Maybe<Person>;
  createdOn: Scalars['DateTime'];
  id?: Maybe<Scalars['Long']>;
  incidentDate?: Maybe<Scalars['DateTime']>;
  note?: Maybe<Scalars['String']>;
  priorityEndDate?: Maybe<Scalars['Date']>;
  priorityNote?: Maybe<Scalars['Boolean']>;
  priorityStartDate?: Maybe<Scalars['Date']>;
  referencedParties: Array<Person>;
  referencedPartiesIds: Array<Scalars['Long']>;
  tags: Array<Notes_Tag>;
  tagsIds: Array<Scalars['Int']>;
};

export type Notes_NotesFilter = {
  associatedPartyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
  noteIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
  noteType?: InputMaybe<Notes_TagCategory>;
  partyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
  priority?: InputMaybe<Scalars['Boolean']>;
};

export type Notes_PriorityFilter = {
  partyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
};

export type Notes_StudentBehaviour = {
  __typename?: 'Notes_StudentBehaviour';
  associatedParties: Array<Maybe<Party>>;
  associatedPartyIds?: Maybe<Array<Maybe<Scalars['Long']>>>;
  category: Scalars['String'];
  details: Scalars['String'];
  incidentDate: Scalars['Date'];
  noteId: Scalars['Long'];
  takenBy: Person;
  takenByPartyId: Scalars['Long'];
};

export type Notes_StudentBehaviourCategory = {
  __typename?: 'Notes_StudentBehaviourCategory';
  behaviourCategoryId: Scalars['Int'];
  colour: Colour;
  count: Scalars['Int'];
  name: Scalars['String'];
};

export type Notes_StudentBehaviourOverview = {
  __typename?: 'Notes_StudentBehaviourOverview';
  behaviours?: Maybe<Array<Maybe<Notes_StudentBehaviour>>>;
  categories: Array<Maybe<Notes_StudentBehaviourCategory>>;
};

export type Notes_Tag = {
  __typename?: 'Notes_Tag';
  behaviourType?: Maybe<Notes_BehaviourType>;
  category: Notes_TagCategory;
  description?: Maybe<Scalars['String']>;
  descriptionTextId: Scalars['Int'];
  id: Scalars['Int'];
  name: Scalars['String'];
  nameTextId: Scalars['Int'];
  tag_l1?: Maybe<Scalars['String']>;
  tag_l2?: Maybe<Scalars['String']>;
  tag_l3?: Maybe<Scalars['String']>;
};

export enum Notes_TagCategory {
  Behaviour = 'BEHAVIOUR',
  Misc = 'MISC',
  Note = 'NOTE'
}

export type Notes_TagFilter = {
  categories?: InputMaybe<Array<InputMaybe<Notes_TagCategory>>>;
  tagIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export type Notes_UpsertBehaviourTagInput = {
  behaviourType?: InputMaybe<Notes_BehaviourType>;
  description?: InputMaybe<Array<InputMaybe<TranslationInput>>>;
  id?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Array<InputMaybe<TranslationInput>>>;
  tag_l2: Scalars['String'];
  tag_l3?: InputMaybe<Scalars['String']>;
};

export type Notes_UpsertNote = {
  associatedParties?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
  createdBy?: InputMaybe<Scalars['Long']>;
  createdOn?: InputMaybe<Scalars['DateTime']>;
  id?: InputMaybe<Scalars['Long']>;
  incidentDate?: InputMaybe<Scalars['DateTime']>;
  note?: InputMaybe<Scalars['String']>;
  priorityEndDate?: InputMaybe<Scalars['Date']>;
  priorityNote?: InputMaybe<Scalars['Boolean']>;
  priorityStartDate?: InputMaybe<Scalars['Date']>;
  referencedParties: Array<Scalars['Long']>;
  tags: Array<Scalars['Int']>;
};

export type Notes_UpsertNotesTagInput = {
  description?: InputMaybe<Array<InputMaybe<TranslationInput>>>;
  id?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Array<InputMaybe<TranslationInput>>>;
  tag_l1: Scalars['String'];
  tag_l2?: InputMaybe<Scalars['String']>;
  tag_l3?: InputMaybe<Scalars['String']>;
};

export type Notification = {
  __typename?: 'Notification';
  id: Scalars['Long'];
  notificationType: NotificationType;
  recipients: Array<NotificationRecipient>;
  sentOn: Scalars['DateTime'];
  text: Scalars['String'];
  title: Scalars['String'];
};

export type NotificationError = {
  __typename?: 'NotificationError';
  error?: Maybe<Scalars['String']>;
  personPartyId?: Maybe<Scalars['Long']>;
};

export type NotificationFilter = {
  globalUserId?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['Long']>;
  status?: InputMaybe<NotificationStatus>;
};

export type NotificationMetaData = {
  __typename?: 'NotificationMetaData';
  mailId?: Maybe<Scalars['Long']>;
  partyId?: Maybe<Scalars['Long']>;
};

export type NotificationMetaDataInput = {
  mailId?: InputMaybe<Scalars['Long']>;
  partyId?: InputMaybe<Scalars['Long']>;
};

export type NotificationReadInput = {
  notificationId: Scalars['Long'];
};

export type NotificationRecipient = {
  __typename?: 'NotificationRecipient';
  metaData?: Maybe<NotificationMetaData>;
  readOn?: Maybe<Scalars['DateTime']>;
  recipientGlobalUserId: Scalars['Int'];
  recipientPartyId: Scalars['Long'];
  status?: Maybe<NotificationStatus>;
};

export type NotificationSentResponse = {
  __typename?: 'NotificationSentResponse';
  errors?: Maybe<Array<Maybe<NotificationError>>>;
  numNotificationsSent?: Maybe<Scalars['Int']>;
};

export enum NotificationStatus {
  Abandoned = 'Abandoned',
  Canceled = 'Canceled',
  Completed = 'Completed',
  Enqueued = 'Enqueued',
  NoTargetFound = 'NoTargetFound',
  Processing = 'Processing',
  Scheduled = 'Scheduled',
  Unknown = 'Unknown'
}

export type NotificationTemplate = {
  __typename?: 'NotificationTemplate';
  id: Scalars['Long'];
  name: Scalars['String'];
  text: Scalars['String'];
  title: Scalars['String'];
};

export type NotificationTemplateFilter = {
  id?: InputMaybe<Scalars['Long']>;
};

export enum NotificationType {
  Absence = 'ABSENCE',
  Assessment = 'ASSESSMENT',
  Fee = 'FEE',
  Individual = 'INDIVIDUAL',
  Mail = 'MAIL',
  Substitution = 'SUBSTITUTION',
  Timetable = 'TIMETABLE',
  Wellbeing = 'WELLBEING'
}

export type NotificationsUnreadCount = {
  __typename?: 'NotificationsUnreadCount';
  count: Scalars['Int'];
};

export type Owner = {
  __typename?: 'Owner';
  addressLine1?: Maybe<Scalars['String']>;
  addressLine2?: Maybe<Scalars['String']>;
  addressLine3?: Maybe<Scalars['String']>;
  addressLine4?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['Date']>;
  forename?: Maybe<Scalars['String']>;
  ownerId?: Maybe<Scalars['Int']>;
  startDate?: Maybe<Scalars['Date']>;
  surname?: Maybe<Scalars['String']>;
};

export type PpodCredentials = {
  __typename?: 'PPODCredentials';
  lastSyncSuccessful: Scalars['Boolean'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type PpodFilter = {
  transactionId?: InputMaybe<Scalars['String']>;
};

export type PpodStudent = {
  address?: InputMaybe<InputAddress>;
  birthCertForename?: InputMaybe<Scalars['String']>;
  birthCertSurname?: InputMaybe<Scalars['String']>;
  boarding?: InputMaybe<Scalars['Boolean']>;
  boardingDays?: InputMaybe<Scalars['String']>;
  countryOfBirth?: InputMaybe<Scalars['String']>;
  dateOfBirth?: InputMaybe<Scalars['Date']>;
  deceased?: InputMaybe<Scalars['Boolean']>;
  deceasedDate?: InputMaybe<Scalars['Date']>;
  deleted?: InputMaybe<Scalars['Boolean']>;
  destinationRollNo?: InputMaybe<Scalars['String']>;
  dpin?: InputMaybe<Scalars['Long']>;
  enrolment?: InputMaybe<PpodStudentEnrolment>;
  examEntrant?: InputMaybe<Scalars['Boolean']>;
  forename?: InputMaybe<Scalars['String']>;
  gender?: InputMaybe<Scalars['String']>;
  leavingReason?: InputMaybe<Scalars['String']>;
  leftEarly?: InputMaybe<Scalars['Boolean']>;
  medicalCard?: InputMaybe<Scalars['Boolean']>;
  mothersMaidenName?: InputMaybe<Scalars['String']>;
  nationality?: InputMaybe<Scalars['String']>;
  ppsn?: InputMaybe<Scalars['String']>;
  previousSchoolRollNum?: InputMaybe<Scalars['String']>;
  previousSchoolType?: InputMaybe<Scalars['String']>;
  shortTermPupil?: InputMaybe<Scalars['Boolean']>;
  shortTermPupilNumWeeks?: InputMaybe<Scalars['Int']>;
  surname?: InputMaybe<Scalars['String']>;
  travellerStatus?: InputMaybe<Scalars['Boolean']>;
};

export type PpodStudentEnrolment = {
  academicYear?: InputMaybe<Scalars['Int']>;
  endDate?: InputMaybe<Scalars['Date']>;
  enrolmentDate?: InputMaybe<Scalars['Date']>;
  programmeCode?: InputMaybe<Scalars['Int']>;
  programmeYear?: InputMaybe<Scalars['Int']>;
  repeatYear?: InputMaybe<Scalars['Boolean']>;
};

export type Pagination = {
  lastId?: InputMaybe<Scalars['Long']>;
  lastMessage?: InputMaybe<Scalars['DateTime']>;
  limit: Scalars['Int'];
};

export type ParentalAttendanceRequest = {
  __typename?: 'ParentalAttendanceRequest';
  adminNote?: Maybe<Scalars['String']>;
  approvedBy?: Maybe<Person>;
  approvedByPartyId?: Maybe<Scalars['Long']>;
  attendanceCode: AttendanceCode;
  attendanceCodeId: Scalars['Int'];
  attendanceNote?: Maybe<Scalars['String']>;
  classGroup?: Maybe<GeneralGroup>;
  /**     contact: Person! */
  contact?: Maybe<StudentContact>;
  contactPartyId: Scalars['Long'];
  createdOn: Scalars['DateTime'];
  from: Scalars['DateTime'];
  id: Scalars['Long'];
  parentNote: Scalars['String'];
  requestType: ParentalAttendanceRequestType;
  status: ParentalAttendanceRequestStatus;
  student: Person;
  studentPartyId: Scalars['Long'];
  to: Scalars['DateTime'];
};

export type ParentalAttendanceRequestFilter = {
  contactPartyId?: InputMaybe<Scalars['Long']>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
  status?: InputMaybe<ParentalAttendanceRequestStatus>;
  studentPartyId?: InputMaybe<Scalars['Long']>;
};

export enum ParentalAttendanceRequestStatus {
  Approved = 'APPROVED',
  Denied = 'DENIED',
  Pending = 'PENDING'
}

export enum ParentalAttendanceRequestType {
  MultiDay = 'MULTI_DAY',
  PartialDay = 'PARTIAL_DAY',
  SingleDay = 'SINGLE_DAY'
}

export type Party = {
  partyId: Scalars['Long'];
};

export type PartyCalendar = ResourceCalendar & {
  __typename?: 'PartyCalendar';
  events: Array<CalendarEvent>;
  partyInfo?: Maybe<Party>;
  resourceId: Scalars['Long'];
  type: CalendarResourceTypeEnum;
};

export type PartyFilter = {
  filterPartyTypes?: InputMaybe<Array<InputMaybe<PartyType>>>;
  limit?: InputMaybe<Scalars['Int']>;
  nameFuzzySearch?: InputMaybe<Scalars['String']>;
  partyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
};

export type PartyGroup = {
  avatarUrl?: Maybe<Scalars['String']>;
  includeInTimetable?: Maybe<Scalars['Boolean']>;
  name: Scalars['String'];
  partyId: Scalars['Long'];
};

export type PartyPerson = {
  person: Person;
};

export enum PartyPersonType {
  Contact = 'CONTACT',
  Staff = 'STAFF',
  Student = 'STUDENT'
}

export enum PartyType {
  ClassGroup = 'CLASS_GROUP',
  Contact = 'CONTACT',
  CustomGroup = 'CUSTOM_GROUP',
  GeneralGroup = 'GENERAL_GROUP',
  ProgrammeStage = 'PROGRAMME_STAGE',
  Staff = 'STAFF',
  Student = 'STUDENT',
  SubjectGroup = 'SUBJECT_GROUP',
  YearGroup = 'YEAR_GROUP'
}

export type PartyTypeFilter = {
  partyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
};

export type Permission = {
  __typename?: 'Permission';
  description: Scalars['String'];
  descriptionTextId: Scalars['Int'];
  id: Scalars['String'];
  name: Scalars['String'];
  nameTextId: Scalars['Int'];
};

export type PermissionForGroup = {
  permission?: InputMaybe<Scalars['String']>;
  permissionType?: InputMaybe<PermissionType>;
};

export type PermissionGroup = {
  __typename?: 'PermissionGroup';
  custom?: Maybe<Scalars['Boolean']>;
  description: Scalars['String'];
  descriptionTextId?: Maybe<Scalars['Int']>;
  id: Scalars['Int'];
  memberPartyIds: Array<Scalars['Long']>;
  memberType: MemberType;
  name: Scalars['String'];
  nameTextId?: Maybe<Scalars['Int']>;
  permissionSets: Array<PermissionGroupPermissionSet>;
};

export type PermissionGroupFilter = {
  custom?: InputMaybe<Scalars['Boolean']>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export type PermissionGroupPermissionSet = {
  __typename?: 'PermissionGroupPermissionSet';
  feature?: Maybe<Feature>;
  id: Scalars['String'];
  permissionType?: Maybe<PermissionType>;
  toggle?: Maybe<Scalars['Boolean']>;
};

export type PermissionSet = {
  __typename?: 'PermissionSet';
  contact: Scalars['Boolean'];
  description: Scalars['String'];
  descriptionTextId: Scalars['Int'];
  feature?: Maybe<Feature>;
  id: Scalars['String'];
  name: Scalars['String'];
  nameTextId: Scalars['Int'];
  permissionType?: Maybe<PermissionType>;
  permissions?: Maybe<Array<Permission>>;
  staff: Scalars['Boolean'];
  student: Scalars['Boolean'];
  toggle?: Maybe<Scalars['Boolean']>;
};

export type PermissionSetFilter = {
  contact?: InputMaybe<Scalars['Boolean']>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  staff?: InputMaybe<Scalars['Boolean']>;
  student?: InputMaybe<Scalars['Boolean']>;
};

export enum PermissionType {
  All = 'ALL',
  GroupAdmin = 'GROUP_ADMIN',
  MemberOfGroup = 'MEMBER_OF_GROUP',
  Self = 'SELF'
}

export type PermissionsFilter = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type Person = {
  __typename?: 'Person';
  avatarUrl?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  partyId: Scalars['Long'];
  title?: Maybe<PersonalTitle>;
  type?: Maybe<PartyPersonType>;
};

export type PersonFilter = {
  partyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
  profilePartyType?: InputMaybe<PartyPersonType>;
};

export type PersonalInformation = {
  __typename?: 'PersonalInformation';
  addresses?: Maybe<Array<Maybe<Address>>>;
  birthCertFirstName?: Maybe<Scalars['String']>;
  birthCertLastName?: Maybe<Scalars['String']>;
  dateOfBirth?: Maybe<Scalars['Date']>;
  emails?: Maybe<Array<Maybe<EmailAddress>>>;
  firstName: Scalars['String'];
  gender?: Maybe<Gender>;
  ire?: Maybe<PersonalInformationIre>;
  lastName: Scalars['String'];
  middleName?: Maybe<Scalars['String']>;
  mothersMaidenName?: Maybe<Scalars['String']>;
  nationality?: Maybe<Scalars['String']>;
  nextOfKin?: Maybe<NextOfKin>;
  personalInformationId?: Maybe<Scalars['Int']>;
  phoneNumbers?: Maybe<Array<Maybe<PhoneNumber>>>;
  preferredFirstName?: Maybe<Scalars['String']>;
  preferredLastName?: Maybe<Scalars['String']>;
  primaryAddress?: Maybe<Address>;
  primaryEmail?: Maybe<EmailAddress>;
  primaryPhoneNumber?: Maybe<PhoneNumber>;
};

export type PersonalInformationFilter = {
  partyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
};

export type PersonalInformationInput = {
  dateOfBirth?: InputMaybe<Scalars['Date']>;
  firstName: Scalars['String'];
  gender?: InputMaybe<Gender>;
  ire?: InputMaybe<PersonalInformationIreInput>;
  lastName: Scalars['String'];
  middleName?: InputMaybe<Scalars['String']>;
};

export type PersonalInformationIre = {
  __typename?: 'PersonalInformationIre';
  countryOfBirth?: Maybe<Scalars['String']>;
  ppsNumber?: Maybe<Scalars['String']>;
  religion?: Maybe<Scalars['String']>;
};

export type PersonalInformationIreInput = {
  countryOfBirth?: InputMaybe<Scalars['String']>;
  ppsNumber?: InputMaybe<Scalars['String']>;
  religion?: InputMaybe<Scalars['String']>;
};

export type PersonalTitle = {
  __typename?: 'PersonalTitle';
  id: Scalars['Int'];
  name: Scalars['String'];
  nameTextId: Scalars['Int'];
};

export type PhoneNumber = {
  __typename?: 'PhoneNumber';
  active?: Maybe<Scalars['Boolean']>;
  areaCode?: Maybe<Scalars['String']>;
  countryCode?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  number?: Maybe<Scalars['String']>;
  partyId: Scalars['Long'];
  phoneNumberId?: Maybe<Scalars['Int']>;
  primaryPhoneNumber?: Maybe<Scalars['Boolean']>;
};

export type PrimarySchoolIre = {
  __typename?: 'PrimarySchoolIre';
  rollNumber: Scalars['String'];
  schoolName: Scalars['String'];
};

export type PrimarySchoolIreFilter = {
  rollNumbers?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export enum Print_TimetableLayout {
  Combined = 'COMBINED',
  DaysOnXAxis = 'DAYS_ON_X_AXIS',
  PeriodsOnXAxis = 'PERIODS_ON_X_AXIS'
}

export type Print_TimetableOptions = {
  fontSize?: InputMaybe<Scalars['Int']>;
  individualStudents: Scalars['Boolean'];
  layout: Print_TimetableLayout;
  partyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
  periodDisplayInCell: Print_TimetablePeriodDisplayInCell;
  periodDisplayOnAxis: Print_TimetablePeriodDisplayOnAxis;
  printWithColour: Scalars['Boolean'];
  roomIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  showGroupNames: Scalars['Boolean'];
  showRooms: Scalars['Boolean'];
  subjectFormat: Print_TimetableSubjectFormat;
  teacherDisplayOption: Print_TimetableStaffFormat;
};

export enum Print_TimetablePeriodDisplayInCell {
  Hide = 'HIDE',
  PeriodNumber = 'PERIOD_NUMBER',
  Time = 'TIME'
}

export enum Print_TimetablePeriodDisplayOnAxis {
  PeriodNumber = 'PERIOD_NUMBER',
  Time = 'TIME'
}

export enum Print_TimetableStaffFormat {
  DisplayCode = 'DISPLAY_CODE',
  Full = 'FULL',
  Hide = 'HIDE'
}

export enum Print_TimetableSubjectFormat {
  Code = 'CODE',
  Full = 'FULL',
  Short = 'SHORT'
}

export type PriorityStudent = {
  __typename?: 'PriorityStudent';
  from?: Maybe<Scalars['DateTime']>;
  id?: Maybe<Scalars['Long']>;
  note?: Maybe<Scalars['String']>;
  studentPartyId?: Maybe<Scalars['Long']>;
  to?: Maybe<Scalars['DateTime']>;
};

export type PriorityStudentFilter = {
  active?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['Long']>;
  studentPartyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
};

export type Profile = {
  __typename?: 'Profile';
  avatarUrl?: Maybe<Scalars['String']>;
  globalUserId?: Maybe<Scalars['Int']>;
  id: Scalars['Int'];
  nickName?: Maybe<Scalars['String']>;
  partyId?: Maybe<Scalars['Long']>;
  permissionIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  permissions?: Maybe<Array<Permission>>;
  profileType?: Maybe<ProfileType>;
  profileTypeId?: Maybe<Scalars['Int']>;
  tenant: Tenant;
  tenantId?: Maybe<Scalars['Int']>;
};

export type ProfileFilter = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  partyPersonIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
};

export type ProfileType = {
  __typename?: 'ProfileType';
  description: Scalars['String'];
  descriptionTextId?: Maybe<Scalars['Int']>;
  id: Scalars['Int'];
  name: Scalars['String'];
  nameTextId?: Maybe<Scalars['Int']>;
  userType: UserType;
};

export type ProfileTypeFilter = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export type Programme = {
  __typename?: 'Programme';
  description?: Maybe<Scalars['String']>;
  descriptionTextId?: Maybe<Scalars['Int']>;
  id: Scalars['Int'];
  name: Scalars['String'];
  nameTextId?: Maybe<Scalars['Int']>;
  nationalCode?: Maybe<Scalars['String']>;
  shortName?: Maybe<Scalars['String']>;
  shortNameTextId?: Maybe<Scalars['Int']>;
  stageIds?: Maybe<Array<Maybe<Scalars['Int']>>>;
  /** deep linked */
  stages?: Maybe<Array<Maybe<ProgrammeStage>>>;
};

export type ProgrammeFilter = {
  programmeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export type ProgrammeStage = {
  __typename?: 'ProgrammeStage';
  description?: Maybe<Scalars['String']>;
  descriptionTextId?: Maybe<Scalars['Int']>;
  id: Scalars['Int'];
  name: Scalars['String'];
  nameTextId?: Maybe<Scalars['Int']>;
  nationalCode: Scalars['Int'];
  programme?: Maybe<Programme>;
  programmeId: Scalars['Int'];
  shortName?: Maybe<Scalars['String']>;
  shortNameTextId?: Maybe<Scalars['Int']>;
  yearGroupId: Scalars['Int'];
};

export type ProgrammeStageEnrollment = Party & PartyGroup & {
  __typename?: 'ProgrammeStageEnrollment';
  academicNamespaceId: Scalars['Int'];
  avatarUrl?: Maybe<Scalars['String']>;
  includeInTimetable?: Maybe<Scalars['Boolean']>;
  name: Scalars['String'];
  partyId: Scalars['Long'];
  programmeId: Scalars['Int'];
  programmeStage?: Maybe<ProgrammeStage>;
  programmeStageEnrollmentPartyId: Scalars['Long'];
  programmeStageId: Scalars['Int'];
};

export type ProgrammeStageEnrollmentFilter = {
  programmeStageEnrollmentPartyId?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
};

export type ProgrammeStageFilter = {
  programmeStageIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export type Query = {
  __typename?: 'Query';
  admin__party_people?: Maybe<Array<Person>>;
  admin__tenants?: Maybe<Array<Maybe<Tenant>>>;
  asd?: Maybe<Scalars['String']>;
  assessment_assessment?: Maybe<Array<Assessment>>;
  assessment_assessmentComment?: Maybe<Array<AssessmentComment>>;
  assessment_assessmentResult?: Maybe<Array<AssessmentResult>>;
  assessment_assessmentSubjectGroups?: Maybe<Array<AssessmentSubjectGroup>>;
  assessment_calculateGrade: CalculatedGrade;
  assessment_commentBank?: Maybe<Array<CommentBank>>;
  assessment_dashboardAssessment?: Maybe<Array<DashboardAssessment>>;
  assessment_gradeSet?: Maybe<Array<GradeSet>>;
  attendance_attendanceCodes: Array<AttendanceCode>;
  attendance_bulkAttendanceActions: Array<Attendance_BulkAttendanceAction>;
  attendance_calendarAttendance: CalendarAttendance;
  attendance_eventAttendance: Array<EventAttendance>;
  attendance_eventAttendanceReport: EventAttendanceReport;
  attendance_parentalAttendanceRequests: Array<ParentalAttendanceRequest>;
  attendance_sessionAttendanceList: Array<SessionAttendanceList>;
  attendance_studentSessionAttendance: Array<StudentSessionAttendance>;
  calendar_bellTimes: Array<Calendar_BellTime>;
  calendar_calendarDayBellTimes: Array<CalendarDayBellTime>;
  calendar_calendarEvents?: Maybe<ResourceCalendarWrapper>;
  /**  depricated */
  calendar_calendarEventsIterator?: Maybe<CalendarEvent>;
  calendar_calendarEventsIterator_v2?: Maybe<Calendar_EventIteratorResult>;
  calendar_dayInfo: Array<CalendarDayInfo>;
  /**    Checks whether the searched for calendar resources are free or not at particular times */
  calendar_findFreeResources: FreeCalendarResources;
  catalogue_personalTitles: Array<PersonalTitle>;
  catalogue_programmeStages: Array<ProgrammeStage>;
  catalogue_staffCapacities: Array<StaffCapacity>;
  catalogue_staffPosts: Array<StaffPost>;
  catalogue_subjects: Array<Subject>;
  catalogue_years: Array<YearGroup>;
  communications_label: Array<Label>;
  communications_mail: Array<Mail>;
  communications_notificationCount?: Maybe<NotificationsUnreadCount>;
  communications_notificationTemplates: Array<NotificationTemplate>;
  communications_notifications: Array<Notification>;
  communications_registeredDevices: Array<DeviceRegistration>;
  communications_sms: Array<Sms>;
  communications_smsCost?: Maybe<SmsCost>;
  communications_smsCredit?: Maybe<SmsCredit>;
  communications_smsXeroItem: Array<XeroItem>;
  communications_unreadCount: Array<UnreadCount>;
  composite_permissionGroups: Array<Maybe<PermissionGroup>>;
  composite_studentStatus: StudentStatus;
  core_academicNamespaces?: Maybe<Array<AcademicNamespace>>;
  core_blocks: Array<CoreBlock>;
  core_customGroupDefinition: Core_CustomGroupDefinition;
  core_customGroupFieldOptions: Core_CustomGroupFieldOptions;
  core_parties: Array<Party>;
  core_rooms?: Maybe<Array<Room>>;
  core_staff: Array<Staff>;
  core_studentContacts?: Maybe<Array<StudentContact>>;
  core_students: Array<Student>;
  core_subjectGroupStudents?: Maybe<SubjectGroupStudent>;
  core_yearGroupEnrollments: Array<YearGroupEnrollment>;
  eire_nonClassContactHours?: Maybe<Array<Maybe<NonClassContactHours>>>;
  enrollment_ire_blockMemberships: EnrollmentIre_BlockMemberships;
  enrollment_ire_coreMemberships: EnrollmentIre_CoreMemberships;
  fees_discounts?: Maybe<Array<Maybe<Discount>>>;
  fees_fees?: Maybe<Array<Maybe<Fee>>>;
  file_transfer_list?: Maybe<Array<FileTransferResponse>>;
  generalGroups?: Maybe<Array<GeneralGroup>>;
  myAuthDetails?: Maybe<GlobalUser>;
  notes_behaviour?: Maybe<Notes_StudentBehaviourOverview>;
  notes_behaviourCategories: Array<Notes_BehaviourCategory>;
  notes_notes: Array<Notes_Note>;
  notes_tags: Array<Notes_Tag>;
  permissions?: Maybe<Array<Maybe<Permission>>>;
  ppod_PPODCredentials?: Maybe<PpodCredentials>;
  ppod_syncRequests: Array<SyncRequest>;
  print_printTimetable: TemporaryDownload;
  profileTypes?: Maybe<Array<Maybe<ProfileType>>>;
  profiles?: Maybe<Array<Maybe<ProfileType>>>;
  reporting_reports: Array<Reporting_ReportInfoTopLevel>;
  reporting_runReport?: Maybe<Reporting_TableReport>;
  reporting_runReportExpand?: Maybe<Reporting_TableReport>;
  search_search: Array<Search>;
  subjectGroups?: Maybe<Array<SubjectGroup>>;
  swm_absenceTypes: Array<Swm_StaffAbsenceType>;
  swm_absences: Array<Swm_StaffAbsence>;
  /**  note will return all events that require substitution */
  swm_eventsForSubstitutions: Array<Swm_CalendarSubstitution>;
  /**  note will only return timetabled lessons that occur on the grid */
  swm_eventsForSubstitutionsByStaffByPeriod: Swm_StaffSubstitutionEventByDay;
  swm_substitutionLookup: Swm_SubstitutionLookup;
  swm_substitutionTypes: Array<Swm_SubstitutionType>;
  swm_substitutions: Array<Swm_Substitution>;
  tt_addLessonOptions: Tt_AddLessonOptions;
  tt_editLessonOptions: Tt_AddLessonOptions;
  tt_groups: Array<Tt_Groups>;
  tt_individualLessons: Array<TtIndividualViewLesson>;
  tt_resourceTimetableView: TtResourceTimetableView;
  tt_swapRoomOptions: TtSwapRoomOptions;
  tt_swapTeacherOptions: TtSwapTeacherOptions;
  tt_timetables: Array<TtTimetable>;
  users_permissionGroups?: Maybe<Array<Maybe<PermissionGroup>>>;
  users_permissionSets?: Maybe<Array<Maybe<PermissionSet>>>;
  users_schoolInfo?: Maybe<SchoolInfo>;
  users_userAccess: Array<UserAccess>;
  wellbeing_activeSupportPlan?: Maybe<Array<Maybe<ActivePlan>>>;
  wellbeing_priorityStudent?: Maybe<Array<Maybe<PriorityStudent>>>;
  wellbeing_studentAen: Wellbeing_StudentAen;
  wellbeing_studentMedical?: Maybe<StudentMedical>;
  wellbeing_studentMedicalConditionLookup?: Maybe<ListString>;
  wellbeing_studentSupportFile?: Maybe<Array<Maybe<StudentSupportFile>>>;
  wellbeing_studentSupportPlan?: Maybe<Array<Maybe<StudentSupportPlan>>>;
  wellbeing_studentSupportPlanReview?: Maybe<Array<Maybe<StudentSupportPlanReview>>>;
};


export type QueryAdmin__Party_PeopleArgs = {
  tenant: Scalars['Int'];
};


export type QueryAdmin__TenantsArgs = {
  filter?: InputMaybe<TenantsFilter>;
};


export type QueryAssessment_AssessmentArgs = {
  filter?: InputMaybe<AssessmentFilter>;
};


export type QueryAssessment_AssessmentCommentArgs = {
  filter?: InputMaybe<AssessmentCommentFilter>;
};


export type QueryAssessment_AssessmentResultArgs = {
  filter?: InputMaybe<AssessmentResultFilter>;
};


export type QueryAssessment_AssessmentSubjectGroupsArgs = {
  filter?: InputMaybe<AssessmentSubjectGroupsFilter>;
};


export type QueryAssessment_CalculateGradeArgs = {
  filter?: InputMaybe<CalculateGradeFilter>;
};


export type QueryAssessment_CommentBankArgs = {
  filter?: InputMaybe<CommentBankFilter>;
};


export type QueryAssessment_DashboardAssessmentArgs = {
  filter?: InputMaybe<DashboardAssessmentFilter>;
};


export type QueryAssessment_GradeSetArgs = {
  filter?: InputMaybe<GradeSetFilter>;
};


export type QueryAttendance_AttendanceCodesArgs = {
  filter?: InputMaybe<AttendanceCodeFilter>;
};


export type QueryAttendance_BulkAttendanceActionsArgs = {
  filter?: InputMaybe<Attendance_BulkAttendanceActionFilter>;
};


export type QueryAttendance_CalendarAttendanceArgs = {
  filter?: InputMaybe<CalendarAttendanceFilter>;
};


export type QueryAttendance_EventAttendanceArgs = {
  filter?: InputMaybe<EventAttendanceFilter>;
};


export type QueryAttendance_EventAttendanceReportArgs = {
  filter?: InputMaybe<EventAttendanceReportFilter>;
};


export type QueryAttendance_ParentalAttendanceRequestsArgs = {
  filter?: InputMaybe<ParentalAttendanceRequestFilter>;
};


export type QueryAttendance_SessionAttendanceListArgs = {
  filter?: InputMaybe<SessionAttendanceListFilter>;
};


export type QueryAttendance_StudentSessionAttendanceArgs = {
  filter?: InputMaybe<StudentSessionAttendanceFilter>;
};


export type QueryCalendar_BellTimesArgs = {
  filter?: InputMaybe<BellTimeFilter>;
};


export type QueryCalendar_CalendarDayBellTimesArgs = {
  filter?: InputMaybe<CalendarDayBellTimeFilter>;
};


export type QueryCalendar_CalendarEventsArgs = {
  filter?: InputMaybe<CalendarEventFilter>;
};


export type QueryCalendar_CalendarEventsIteratorArgs = {
  filter?: InputMaybe<CalendarEventIteratorFilter>;
};


export type QueryCalendar_CalendarEventsIterator_V2Args = {
  filter?: InputMaybe<CalendarEventIteratorFilter>;
};


export type QueryCalendar_DayInfoArgs = {
  filter?: InputMaybe<CalendarDayInfoFilter>;
};


export type QueryCalendar_FindFreeResourcesArgs = {
  filter?: InputMaybe<FindFreeResourcesFilter>;
};


export type QueryCatalogue_SubjectsArgs = {
  filter?: InputMaybe<SubjectFilter>;
};


export type QueryCatalogue_YearsArgs = {
  filter?: InputMaybe<YearGroupFilter>;
};


export type QueryCommunications_LabelArgs = {
  filter?: InputMaybe<LabelFilter>;
};


export type QueryCommunications_MailArgs = {
  filter?: InputMaybe<MailFilter>;
};


export type QueryCommunications_NotificationTemplatesArgs = {
  filter?: InputMaybe<NotificationTemplateFilter>;
};


export type QueryCommunications_NotificationsArgs = {
  filter?: InputMaybe<NotificationFilter>;
};


export type QueryCommunications_RegisteredDevicesArgs = {
  filter?: InputMaybe<DeviceRegistrationFilter>;
};


export type QueryCommunications_SmsArgs = {
  filter?: InputMaybe<SmsFilter>;
};


export type QueryCommunications_SmsCostArgs = {
  filter?: InputMaybe<SmsCostFilter>;
};


export type QueryCommunications_UnreadCountArgs = {
  filter?: InputMaybe<UnreadCountFilter>;
};


export type QueryComposite_PermissionGroupsArgs = {
  filter?: InputMaybe<PermissionGroupFilter>;
};


export type QueryComposite_StudentStatusArgs = {
  filter?: InputMaybe<StudentStatusFilter>;
};


export type QueryCore_AcademicNamespacesArgs = {
  filter?: InputMaybe<AcademicNamespaceFilter>;
};


export type QueryCore_BlocksArgs = {
  filter?: InputMaybe<BlockFilter>;
};


export type QueryCore_CustomGroupDefinitionArgs = {
  filter: Core_CustomGroupDefinitionFilter;
};


export type QueryCore_PartiesArgs = {
  filter?: InputMaybe<PartyFilter>;
};


export type QueryCore_RoomsArgs = {
  filter?: InputMaybe<RoomFilter>;
};


export type QueryCore_StaffArgs = {
  filter?: InputMaybe<StaffFilter>;
};


export type QueryCore_StudentContactsArgs = {
  filter?: InputMaybe<StudentContactFilter>;
};


export type QueryCore_StudentsArgs = {
  filter?: InputMaybe<StudentFilter>;
};


export type QueryCore_SubjectGroupStudentsArgs = {
  filter?: InputMaybe<SubjectGroupStudentFilter>;
};


export type QueryCore_YearGroupEnrollmentsArgs = {
  filter?: InputMaybe<YearGroupEnrollmentFilter>;
};


export type QueryEire_NonClassContactHoursArgs = {
  filter?: InputMaybe<NonClassContactHoursFilter>;
};


export type QueryEnrollment_Ire_BlockMembershipsArgs = {
  filter: EnrollmentIre_BlockEnrollmentFilter;
};


export type QueryEnrollment_Ire_CoreMembershipsArgs = {
  filter: EnrollmentIre_CoreEnrollmentFilter;
};


export type QueryFees_DiscountsArgs = {
  filter?: InputMaybe<DiscountFilter>;
};


export type QueryFees_FeesArgs = {
  filter?: InputMaybe<FeeFilter>;
};


export type QueryFile_Transfer_ListArgs = {
  filter?: InputMaybe<FileTransferFilter>;
};


export type QueryGeneralGroupsArgs = {
  filter?: InputMaybe<GeneralGroupFilter>;
};


export type QueryNotes_BehaviourArgs = {
  filter?: InputMaybe<Notes_BehaviourFilter>;
};


export type QueryNotes_BehaviourCategoriesArgs = {
  filter?: InputMaybe<Notes_BehaviourCategoryFilter>;
};


export type QueryNotes_NotesArgs = {
  filter?: InputMaybe<Notes_NotesFilter>;
};


export type QueryNotes_TagsArgs = {
  filter?: InputMaybe<Notes_TagFilter>;
};


export type QueryPpod_SyncRequestsArgs = {
  filter?: InputMaybe<SyncRequestsFilter>;
};


export type QueryPrint_PrintTimetableArgs = {
  filter?: InputMaybe<Print_TimetableOptions>;
};


export type QueryProfileTypesArgs = {
  filter?: InputMaybe<ProfileTypeFilter>;
};


export type QueryProfilesArgs = {
  filter?: InputMaybe<ProfileFilter>;
};


export type QueryReporting_RunReportArgs = {
  filter?: InputMaybe<Reporting_ReportFilter>;
};


export type QueryReporting_RunReportExpandArgs = {
  filter?: InputMaybe<Reporting_ReportFilterExpand>;
};


export type QuerySearch_SearchArgs = {
  filter?: InputMaybe<SearchFilter>;
};


export type QuerySubjectGroupsArgs = {
  filter?: InputMaybe<SubjectGroupFilter>;
};


export type QuerySwm_AbsenceTypesArgs = {
  filter?: InputMaybe<Swm_StaffAbsenceTypeFilter>;
};


export type QuerySwm_AbsencesArgs = {
  filter?: InputMaybe<Swm_StaffAbsenceFilter>;
};


export type QuerySwm_EventsForSubstitutionsArgs = {
  filter?: InputMaybe<Swm_EventsForSubstitutionFilter>;
};


export type QuerySwm_EventsForSubstitutionsByStaffByPeriodArgs = {
  filter?: InputMaybe<Swm_EventsForSubstitutionFilter>;
};


export type QuerySwm_SubstitutionLookupArgs = {
  filter?: InputMaybe<Swm_SubstitutionLookupFilter>;
};


export type QuerySwm_SubstitutionTypesArgs = {
  filter?: InputMaybe<Swm_StaffSubstitutionTypeFilter>;
};


export type QuerySwm_SubstitutionsArgs = {
  filter?: InputMaybe<Swm_SubstitutionsFilter>;
};


export type QueryTt_AddLessonOptionsArgs = {
  filter?: InputMaybe<Tt_AddLessonFilter>;
};


export type QueryTt_EditLessonOptionsArgs = {
  filter?: InputMaybe<Tt_EditLessonFilter>;
};


export type QueryTt_GroupsArgs = {
  filter: Tt_GroupsFilter;
};


export type QueryTt_IndividualLessonsArgs = {
  filter?: InputMaybe<TtIndividualViewLessonFilter>;
};


export type QueryTt_ResourceTimetableViewArgs = {
  filter: TtResourceTimetableViewFilter;
};


export type QueryTt_SwapRoomOptionsArgs = {
  filter?: InputMaybe<TtSwapRoomFilter>;
};


export type QueryTt_SwapTeacherOptionsArgs = {
  filter?: InputMaybe<TtSwapTeacherFilter>;
};


export type QueryTt_TimetablesArgs = {
  filter?: InputMaybe<TtTimetableFilter>;
};


export type QueryUsers_PermissionGroupsArgs = {
  filter?: InputMaybe<PermissionGroupFilter>;
};


export type QueryUsers_PermissionSetsArgs = {
  filter?: InputMaybe<PermissionSetFilter>;
};


export type QueryUsers_UserAccessArgs = {
  filter?: InputMaybe<UserAccessFilter>;
};


export type QueryWellbeing_ActiveSupportPlanArgs = {
  filter?: InputMaybe<ActiveSupportPlanFilter>;
};


export type QueryWellbeing_PriorityStudentArgs = {
  filter?: InputMaybe<PriorityStudentFilter>;
};


export type QueryWellbeing_StudentAenArgs = {
  filter: StudentAenFilter;
};


export type QueryWellbeing_StudentMedicalArgs = {
  filter?: InputMaybe<StudentMedicalFilter>;
};


export type QueryWellbeing_StudentSupportFileArgs = {
  filter?: InputMaybe<StudentSupportFileFilter>;
};


export type QueryWellbeing_StudentSupportPlanArgs = {
  filter?: InputMaybe<StudentSupportPlanFilter>;
};


export type QueryWellbeing_StudentSupportPlanReviewArgs = {
  filter?: InputMaybe<StudentSupportPlanReviewFilter>;
};

export type Recipient = {
  __typename?: 'Recipient';
  id: Scalars['Long'];
  recipient: Person;
  recipientPartyId: Scalars['Long'];
  recipientType: RecipientType;
};

export type RecipientInput = {
  recipientPartyId: Scalars['Long'];
  recipientPartyType: SmsRecipientType;
};

export enum RecipientType {
  Bcc = 'BCC',
  Cc = 'CC',
  To = 'TO'
}

export enum RecurrenceEnum {
  Biweekly = 'BIWEEKLY',
  Daily = 'DAILY',
  Monthly = 'MONTHLY',
  NoRecurrence = 'NO_RECURRENCE',
  Weekly = 'WEEKLY'
}

export type RegisterDeviceInput = {
  deviceId: Scalars['String'];
  deviceMake: Scalars['String'];
  deviceType: DeviceType;
  osVersion: Scalars['String'];
};

export enum ReportLink {
  StudentAttendanceScreen = 'STUDENT_ATTENDANCE_SCREEN'
}

export type Reporting_ReportFilter = {
  filters?: InputMaybe<Array<InputMaybe<Reporting_TableFilterInput>>>;
  reportId: Scalars['String'];
};

export type Reporting_ReportFilterExpand = {
  filter: Reporting_ReportFilter;
  id: Scalars['Object'];
};

export type Reporting_ReportInfo = {
  __typename?: 'Reporting_ReportInfo';
  id: Scalars['String'];
  name: Scalars['String'];
  /**  has aggregated rows which can be expanded to show individual rows */
  supportsExpandRow: Scalars['Boolean'];
  /**  flag to say whether its released */
  visibleToSchools: Scalars['Boolean'];
};

export type Reporting_ReportInfoTopLevel = {
  __typename?: 'Reporting_ReportInfoTopLevel';
  info: Reporting_ReportInfo;
  reports: Array<Reporting_ReportInfo>;
};

export type Reporting_TableFilter = {
  __typename?: 'Reporting_TableFilter';
  defaultValue?: Maybe<Scalars['Object']>;
  id: Scalars['String'];
  inputType: Reporting_TableFilterType;
  label: Scalars['String'];
  maxValue?: Maybe<Scalars['Object']>;
  minValue?: Maybe<Scalars['Object']>;
  required: Scalars['Boolean'];
  values?: Maybe<Array<Maybe<Reporting_TableFilterValues>>>;
};

export type Reporting_TableFilterInput = {
  filterId: Scalars['String'];
  filterValue?: InputMaybe<Scalars['Object']>;
};

export enum Reporting_TableFilterType {
  Checkbox = 'CHECKBOX',
  Date = 'DATE',
  Input = 'INPUT',
  InputNumber = 'INPUT_NUMBER',
  MultiSelect = 'MULTI_SELECT',
  Select = 'SELECT'
}

export type Reporting_TableFilterValues = {
  __typename?: 'Reporting_TableFilterValues';
  id?: Maybe<Scalars['Object']>;
  value?: Maybe<Scalars['String']>;
};

export type Reporting_TableReport = {
  __typename?: 'Reporting_TableReport';
  data?: Maybe<Array<Maybe<Scalars['Object']>>>;
  debug?: Maybe<Reporting_TableReportDebug>;
  fields: Array<Reporting_TableReportField>;
  filters: Array<Reporting_TableFilter>;
  id: Scalars['String'];
  info: Reporting_ReportInfo;
  innerReports: Array<Reporting_ReportInfo>;
  links?: Maybe<Array<Maybe<Reporting_TableReportLink>>>;
};

export type Reporting_TableReportDataColumn = {
  __typename?: 'Reporting_TableReportDataColumn';
  value?: Maybe<Scalars['Object']>;
};

export type Reporting_TableReportDebug = {
  __typename?: 'Reporting_TableReportDebug';
  sql?: Maybe<Scalars['String']>;
};

export type Reporting_TableReportField = {
  __typename?: 'Reporting_TableReportField';
  checkExpandedRows: Scalars['Boolean'];
  hideMenu: Scalars['Boolean'];
  id: Scalars['String'];
  label: Scalars['String'];
  visibleByDefault: Scalars['Boolean'];
};

export type Reporting_TableReportLink = {
  __typename?: 'Reporting_TableReportLink';
  linkId?: Maybe<Scalars['Object']>;
  linkLabel?: Maybe<Scalars['String']>;
  linkType?: Maybe<ReportLink>;
};

export type ResourceCalendar = {
  events: Array<CalendarEvent>;
  resourceId: Scalars['Long'];
  type: CalendarResourceTypeEnum;
};

export type ResourceCalendarWrapper = {
  __typename?: 'ResourceCalendarWrapper';
  resources: Array<ResourceCalendar>;
};

export type ResultExtraField = {
  __typename?: 'ResultExtraField';
  assessmentExtraFieldId: Scalars['Long'];
  assessmentResultId: Scalars['Long'];
  commentBankCommentId?: Maybe<Scalars['Long']>;
  extraFieldType: ExtraFieldType;
  gradeNameTextId?: Maybe<Scalars['Int']>;
  gradeSetGradeId?: Maybe<Scalars['Long']>;
  id: Scalars['Long'];
  result?: Maybe<Scalars['String']>;
};

export type Room = {
  __typename?: 'Room';
  capacity?: Maybe<Scalars['Int']>;
  description?: Maybe<Scalars['String']>;
  disabled: Scalars['Boolean'];
  externalSystemId?: Maybe<Scalars['String']>;
  includeInTimetable: Scalars['Boolean'];
  location?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  pools: Array<Scalars['String']>;
  roomId: Scalars['Int'];
};

export type RoomCalendar = ResourceCalendar & {
  __typename?: 'RoomCalendar';
  events: Array<CalendarEvent>;
  resourceId: Scalars['Long'];
  room?: Maybe<Room>;
  type: CalendarResourceTypeEnum;
};

export type RoomFilter = {
  isIncludeInTimetabling?: InputMaybe<Scalars['Boolean']>;
  roomIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export enum RoomState {
  Inherited = 'INHERITED',
  Pinned = 'PINNED',
  SetBySolver = 'SET_BY_SOLVER',
  SetByUser = 'SET_BY_USER'
}

export type Swm_CalendarSubstitution = {
  __typename?: 'SWM_CalendarSubstitution';
  absenceId?: Maybe<Scalars['Int']>;
  event: CalendarEvent;
  key: Swm_CalendarSubstitutionKey;
  staffPartyId: Scalars['Long'];
  substitution?: Maybe<Swm_Substitution>;
};

export type Swm_CalendarSubstitutionKey = {
  __typename?: 'SWM_CalendarSubstitutionKey';
  date: Scalars['Date'];
  eventId: Scalars['Int'];
};

export type Swm_DeleteStaffAbsence = {
  staffAbsenceIds: Array<InputMaybe<Scalars['Int']>>;
};

export type Swm_DeleteSubstitution = {
  substitutionIds: Array<Scalars['Int']>;
};

export type Swm_EventsForSubstitutionFilter = {
  fromDate: Scalars['Date'];
  staffPartyIds?: InputMaybe<Array<Scalars['Long']>>;
  toDate: Scalars['Date'];
};

export type Swm_EventsForSubstitutionStaff = {
  __typename?: 'SWM_EventsForSubstitutionStaff';
  staff: Staff;
  substitutionEventsByDay: Array<Swm_EventsForSubstitutionStaffByDay>;
};

export type Swm_EventsForSubstitutionStaffByDay = {
  __typename?: 'SWM_EventsForSubstitutionStaffByDay';
  date?: Maybe<Scalars['Date']>;
  dayInfo: CalendarDayInfo;
  staffPartyId: Scalars['Long'];
  substitutionEventsByPeriod: Array<Swm_CalendarSubstitution>;
};

export type Swm_InsertSubstitution = {
  events: Array<Swm_InsertSubstitutionEvent>;
};

export type Swm_InsertSubstitutionEvent = {
  absenceId?: InputMaybe<Scalars['Int']>;
  date: Scalars['Date'];
  eventId: Scalars['Int'];
  note?: InputMaybe<Scalars['String']>;
  originalStaffId: Scalars['Long'];
  substituteRoomId?: InputMaybe<Scalars['Int']>;
  substituteStaffId: Scalars['Long'];
  substitutionTypeId: Scalars['Int'];
};

export type Swm_StaffAbsence = {
  __typename?: 'SWM_StaffAbsence';
  absenceId: Scalars['Int'];
  absenceReasonText?: Maybe<Scalars['String']>;
  absenceType: Swm_StaffAbsenceType;
  absenceTypeId: Scalars['Int'];
  dates: Array<Swm_StaffAbsenceDate>;
  fromAbsenceRequestId?: Maybe<Scalars['Int']>;
  isLongTermLeave: Scalars['Boolean'];
  longTermLeaveGroups: Array<Swm_StaffAbsenceLongTermLeaveGroup>;
  longTermLeaveGroupsApplied?: Maybe<Scalars['Int']>;
  longTermLeaveGroupsRequired?: Maybe<Scalars['Int']>;
  staff?: Maybe<Person>;
  staffPartyId: Scalars['Long'];
  substitutionRequired?: Maybe<Scalars['Boolean']>;
};

/**
 *  either  continuousStartDate AND continuousEndDate are set
 *  OR individualDates is set
 */
export type Swm_StaffAbsenceDate = {
  __typename?: 'SWM_StaffAbsenceDate';
  continuousEndDate?: Maybe<Scalars['Date']>;
  continuousStartDate?: Maybe<Scalars['Date']>;
  individualDates?: Maybe<Array<Scalars['Date']>>;
  leavesAt?: Maybe<Scalars['Time']>;
  /**  if is a partial absence wither leavesAt or  returnsAt must be set */
  partialAbsence: Scalars['Boolean'];
  returnsAt?: Maybe<Scalars['Time']>;
};

export type Swm_StaffAbsenceFilter = {
  fromDate?: InputMaybe<Scalars['Date']>;
  isLongTermLeave?: InputMaybe<Scalars['Boolean']>;
  staffAbsenceIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  staffPartyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
  toDate?: InputMaybe<Scalars['Date']>;
};

export type Swm_StaffAbsenceLongTermLeaveGroup = {
  __typename?: 'SWM_StaffAbsenceLongTermLeaveGroup';
  coveringStaff?: Maybe<Staff>;
  coveringStaffId?: Maybe<Scalars['Long']>;
  group: PartyGroup;
  groupId: Scalars['Long'];
};

export type Swm_StaffAbsenceRequest = {
  __typename?: 'SWM_StaffAbsenceRequest';
  absenceReasonText?: Maybe<Scalars['String']>;
  absenceRequestStatus?: Maybe<Swm_StaffAbsenceRequestStatusEnum>;
  absenceTypeId: Scalars['Int'];
  fromAbsenceRequestId?: Maybe<Scalars['Int']>;
  fromDate?: Maybe<Scalars['Date']>;
  rejectionReasonText?: Maybe<Scalars['String']>;
  staffPartyId: Scalars['Long'];
  toDate?: Maybe<Scalars['Date']>;
};

export type Swm_StaffAbsenceRequestFilter = {
  fromDate?: InputMaybe<Scalars['Date']>;
  staffPartyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
  staffRequestIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  toDate?: InputMaybe<Scalars['Date']>;
};

export enum Swm_StaffAbsenceRequestStatusEnum {
  Approved = 'APPROVED',
  Pending = 'PENDING',
  Rejected = 'REJECTED'
}

export type Swm_StaffAbsenceType = {
  __typename?: 'SWM_StaffAbsenceType';
  absenceTypeId: Scalars['Int'];
  availableForRequests: Scalars['Boolean'];
  code: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  descriptionTextId?: Maybe<Scalars['Int']>;
  name: Scalars['String'];
  nameTextId?: Maybe<Scalars['Int']>;
};

export type Swm_StaffAbsenceTypeFilter = {
  absenceTypeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export type Swm_StaffSubstitutionEventByDay = {
  __typename?: 'SWM_StaffSubstitutionEventByDay';
  eventsByStaff: Array<Swm_EventsForSubstitutionStaff>;
};

export type Swm_StaffSubstitutionTypeFilter = {
  substitutionTypeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export type Swm_Substitution = {
  __typename?: 'SWM_Substitution';
  absenceId?: Maybe<Scalars['Int']>;
  eventDate: Scalars['Date'];
  eventId: Scalars['Int'];
  note?: Maybe<Scalars['String']>;
  originalStaff: Person;
  originalStaffPartyId: Scalars['Long'];
  substituteRoom?: Maybe<Room>;
  substituteRoomId?: Maybe<Scalars['Int']>;
  substituteStaff: Person;
  substituteStaffId: Scalars['Long'];
  substitutionId?: Maybe<Scalars['Int']>;
  substitutionType: Swm_SubstitutionType;
  substitutionTypeId: Scalars['Int'];
};

export type Swm_SubstitutionLookup = {
  __typename?: 'SWM_SubstitutionLookup';
  clashingRooms: Array<ClashingRooms>;
  freeRooms: Array<Room>;
  staff: Array<Swm_SubstitutionLookupStaff>;
};

/** either times or substitutionEvents must be set */
export type Swm_SubstitutionLookupFilter = {
  staffPartyIds?: InputMaybe<Array<Scalars['Long']>>;
  substitutionEventIds?: InputMaybe<Array<CalendarEventIdInput>>;
  times?: InputMaybe<Array<FindFreeResourcesTime>>;
};

export type Swm_SubstitutionLookupRoom = {
  __typename?: 'SWM_SubstitutionLookupRoom';
  available: Scalars['Boolean'];
  clashingEvents?: Maybe<Array<Scalars['String']>>;
  room: Room;
  roomId: Scalars['Int'];
};

export type Swm_SubstitutionLookupStaff = {
  __typename?: 'SWM_SubstitutionLookupStaff';
  available: Scalars['Boolean'];
  clashingEvents?: Maybe<Array<Scalars['String']>>;
  staff: Staff;
  staffPartyId: Scalars['Long'];
  substitutionStats: Swm_SubstitutionSummaryForWeek;
};

export type Swm_SubstitutionSummary = {
  __typename?: 'SWM_SubstitutionSummary';
  substitutionCountThisWeek: Scalars['Int'];
  substitutionCountThisYear: Scalars['Int'];
  substitutionTimeThisWeekMinutes: Scalars['Int'];
  substitutionTimeThisYearMinutes: Scalars['Int'];
};

export type Swm_SubstitutionSummaryFilter = {
  date: Scalars['Date'];
  staffPartyIds?: InputMaybe<Array<Scalars['Long']>>;
};

export type Swm_SubstitutionSummaryForWeek = {
  __typename?: 'SWM_SubstitutionSummaryForWeek';
  casualWeekCount: Scalars['Int'];
  casualWeekMinutes: Scalars['Int'];
  sandsWeekCount: Scalars['Int'];
  sandsWeekMinutes: Scalars['Int'];
  sandsYearCount: Scalars['Int'];
  sandsYearMinutes: Scalars['Int'];
  totalWeekCount: Scalars['Int'];
  totalWeekMinutes: Scalars['Int'];
  totalYearCount: Scalars['Int'];
  totalYearMinutes: Scalars['Int'];
};

export type Swm_SubstitutionTime = {
  __typename?: 'SWM_SubstitutionTime';
  endTime: Scalars['Time'];
  isoDayOfWeek: Scalars['Int'];
  startTime: Scalars['Time'];
};

export type Swm_SubstitutionType = {
  __typename?: 'SWM_SubstitutionType';
  code: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  descriptionTextId?: Maybe<Scalars['Int']>;
  name: Scalars['String'];
  nameTextId: Scalars['Int'];
  substitutionTypeId: Scalars['Int'];
};

export type Swm_SubstitutionsFilter = {
  fromDate: Scalars['Date'];
  staffPartyIds?: InputMaybe<Array<Scalars['Long']>>;
  toDate: Scalars['Date'];
};

export type Swm_UpsertStaffAbsence = {
  absenceReasonText?: InputMaybe<Scalars['String']>;
  absenceTypeId: Scalars['Int'];
  dates: Array<Swm_UpsertStaffAbsenceDate>;
  fromAbsenceRequestId?: InputMaybe<Scalars['Int']>;
  /**  default false */
  isLongTermLeave?: InputMaybe<Scalars['Boolean']>;
  /**  can only be set if isLongTermLeave is true */
  longTermLeaveGroups?: InputMaybe<Array<Swm_UpsertStaffAbsenceLongTermLeaveGroupInput>>;
  staffAbsenceId?: InputMaybe<Scalars['Int']>;
  staffPartyId: Scalars['Long'];
  substitutionRequired?: InputMaybe<Scalars['Boolean']>;
};

/**
 *  either  continuousStartDate AND continuousEndDate are set
 *  OR individualDates is set
 */
export type Swm_UpsertStaffAbsenceDate = {
  continuousEndDate?: InputMaybe<Scalars['Date']>;
  continuousStartDate?: InputMaybe<Scalars['Date']>;
  individualDates?: InputMaybe<Array<Scalars['Date']>>;
  leavesAt?: InputMaybe<Scalars['Time']>;
  /**  if is a partial absence wither leavesAt or  returnsAt must be set */
  partialAbsence: Scalars['Boolean'];
  returnsAt?: InputMaybe<Scalars['Time']>;
};

export type Swm_UpsertStaffAbsenceLongTermLeaveGroupInput = {
  coveringStaffId?: InputMaybe<Scalars['Long']>;
  groupId: Scalars['Long'];
};

export type Swm_UpsertStaffAbsenceRequest = {
  absenceReasonText?: InputMaybe<Scalars['String']>;
  absenceRequestStatus?: InputMaybe<Swm_StaffAbsenceRequestStatusEnum>;
  absenceTypeId: Scalars['Int'];
  fromAbsenceRequestId?: InputMaybe<Scalars['Int']>;
  fromDate?: InputMaybe<Scalars['Date']>;
  rejectionReasonText?: InputMaybe<Scalars['String']>;
  staffAbsenceRequestId?: InputMaybe<Scalars['Int']>;
  status?: InputMaybe<Swm_StaffAbsenceRequestStatusEnum>;
  toDate?: InputMaybe<Scalars['Date']>;
};

export type Swm_UpsertStaffAbsenceType = {
  absenceTypeId?: InputMaybe<Scalars['Int']>;
  availableForRequests: Scalars['Boolean'];
  code: Scalars['String'];
  description: Array<InputMaybe<TranslationInput>>;
  name: Array<InputMaybe<TranslationInput>>;
};

export type Swm_UpsertStaffSubstitutionType = {
  code: Scalars['String'];
  description: Array<InputMaybe<TranslationInput>>;
  name: Array<InputMaybe<TranslationInput>>;
  substitutionTypeId?: InputMaybe<Scalars['Int']>;
};

/**    -------------- Inputs --------------- */
export type SaveAcademicNamespaceInput = {
  description?: InputMaybe<Scalars['String']>;
  endDate: Scalars['Date'];
  id?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  startDate: Scalars['Date'];
  type?: InputMaybe<AcademicNamespaceType>;
  year: Scalars['Int'];
};

export type SaveAssessmentCommentInput = {
  assessmentId: Scalars['Long'];
  comment?: InputMaybe<Scalars['String']>;
  commentBankCommentId?: InputMaybe<Scalars['Long']>;
  commenterPartyId?: InputMaybe<Scalars['Long']>;
  commenterUserType: CommenterUserType;
  id?: InputMaybe<Scalars['Long']>;
  studentPartyId: Scalars['Long'];
  subjectGroupPartyId: Scalars['Long'];
};

export type SaveAssessmentInput = {
  assessmentType: AssessmentType;
  captureHouseMasterComment?: InputMaybe<Scalars['Boolean']>;
  capturePrincipalComment?: InputMaybe<Scalars['Boolean']>;
  captureTarget: Scalars['Boolean'];
  captureTutorComment?: InputMaybe<Scalars['Boolean']>;
  captureYearHeadComment?: InputMaybe<Scalars['Boolean']>;
  commentBankId?: InputMaybe<Scalars['Long']>;
  commentLength?: InputMaybe<Scalars['Int']>;
  commentType: CommentType;
  createdBy?: InputMaybe<Scalars['Long']>;
  description?: InputMaybe<Scalars['String']>;
  endDate: Scalars['Date'];
  externalSystemId?: InputMaybe<Scalars['String']>;
  extraFields?: InputMaybe<Array<InputMaybe<SaveExtraFieldInput>>>;
  gradeSetIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
  gradeType?: InputMaybe<GradeType>;
  id?: InputMaybe<Scalars['Long']>;
  name: Scalars['String'];
  passFailThreshold?: InputMaybe<Scalars['Int']>;
  publish?: InputMaybe<Scalars['Boolean']>;
  publishLearner?: InputMaybe<Scalars['Boolean']>;
  startDate: Scalars['Date'];
  years?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export type SaveAssessmentResultInput = {
  assessmentId: Scalars['Long'];
  extraFields?: InputMaybe<Array<SaveResultExtraFieldInput>>;
  gradeResult?: InputMaybe<Scalars['String']>;
  gradeSetGradeId?: InputMaybe<Scalars['Long']>;
  id?: InputMaybe<Scalars['Long']>;
  result?: InputMaybe<Scalars['Int']>;
  studentPartyId: Scalars['Long'];
  studentStudyLevel?: InputMaybe<StudyLevel>;
  subjectGroupId: Scalars['Long'];
  targetGradeResult?: InputMaybe<Scalars['String']>;
  targetGradeSetGradeId?: InputMaybe<Scalars['Long']>;
  targetResult?: InputMaybe<Scalars['Int']>;
  teacherComment?: InputMaybe<SaveAssessmentCommentInput>;
};

export type SaveAttendanceCodeInput = {
  code?: InputMaybe<TuslaCode>;
  codeType?: InputMaybe<AttendanceCodeType>;
  description?: InputMaybe<Array<InputMaybe<TranslationInput>>>;
  id?: InputMaybe<Scalars['Int']>;
  isActive?: InputMaybe<Scalars['Boolean']>;
  name: Array<InputMaybe<TranslationInput>>;
  visibleForContact?: InputMaybe<Scalars['Boolean']>;
  visibleForTeacher?: InputMaybe<Scalars['Boolean']>;
};

export type SaveChairPerson = {
  chairPersonId?: InputMaybe<Scalars['Int']>;
  endDate?: InputMaybe<Scalars['Date']>;
  forename?: InputMaybe<Scalars['String']>;
  phoneNo?: InputMaybe<Scalars['String']>;
  startDate?: InputMaybe<Scalars['Date']>;
  surname?: InputMaybe<Scalars['String']>;
};

export type SaveCommentBankInput = {
  active?: InputMaybe<Scalars['Boolean']>;
  comments: Array<SaveCommentInput>;
  description?: InputMaybe<Scalars['String']>;
  externalSystemId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Long']>;
  name: Scalars['String'];
};

export type SaveCommentInput = {
  active?: InputMaybe<Scalars['Boolean']>;
  comment?: InputMaybe<Scalars['String']>;
  externalSystemId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Long']>;
};

export type SaveDiscountInput = {
  description?: InputMaybe<Scalars['String']>;
  discountType?: InputMaybe<DiscountType>;
  id?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  validFor?: InputMaybe<ValidFor>;
  value?: InputMaybe<Scalars['Float']>;
};

export type SaveEventAttendanceInput = {
  adminSubmitted?: InputMaybe<Scalars['Boolean']>;
  attendanceCodeId: Scalars['Int'];
  date: Scalars['Date'];
  eventId: Scalars['Int'];
  id?: InputMaybe<Scalars['Long']>;
  note?: InputMaybe<Scalars['String']>;
  personPartyId: Scalars['Long'];
};

export type SaveExtraFieldInput = {
  commentBankId?: InputMaybe<Scalars['Long']>;
  commentLength?: InputMaybe<Scalars['Int']>;
  externalSystemId?: InputMaybe<Scalars['String']>;
  extraFieldType: ExtraFieldType;
  gradeSetId?: InputMaybe<Scalars['Long']>;
  id?: InputMaybe<Scalars['Long']>;
  name: Scalars['String'];
  selectOptions?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type SaveFeeInput = {
  amount?: InputMaybe<Scalars['Float']>;
  description?: InputMaybe<Scalars['String']>;
  discountIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  dueDate?: InputMaybe<Scalars['Date']>;
  feeType?: InputMaybe<FeeType>;
  id?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
};

export type SaveGradeInput = {
  active?: InputMaybe<Scalars['Boolean']>;
  end: Scalars['Int'];
  externalSystemId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Long']>;
  name: Array<TranslationInput>;
  passFailThreshold?: InputMaybe<Scalars['Int']>;
  start: Scalars['Int'];
  studyLevels?: InputMaybe<Array<InputMaybe<GradeSetStudyLevel>>>;
};

export type SaveGradeSetInput = {
  active?: InputMaybe<Scalars['Boolean']>;
  customGradeSet?: InputMaybe<Scalars['Boolean']>;
  description: Array<TranslationInput>;
  externalSystemId?: InputMaybe<Scalars['String']>;
  grades: Array<SaveGradeInput>;
  id?: InputMaybe<Scalars['Long']>;
  isCba?: InputMaybe<Scalars['Boolean']>;
  name: Array<TranslationInput>;
  passFailThreshold?: InputMaybe<Scalars['Int']>;
  years?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export type SaveNonClassContactHoursInput = {
  academicNameSpaceId: Scalars['Int'];
  activity: Activity;
  dayOfTheWeek: Day;
  description?: InputMaybe<Scalars['String']>;
  hours: Scalars['Int'];
  minutes: Scalars['Int'];
  nonClassContactHoursId?: InputMaybe<Scalars['Int']>;
  programme?: InputMaybe<Ncch_Programme>;
  staffPartyId: Scalars['Int'];
};

export type SaveNotificationTemplateInput = {
  id?: InputMaybe<Scalars['Long']>;
  name: Scalars['String'];
  text: Scalars['String'];
  title: Scalars['String'];
};

export type SaveOwner = {
  addressLine1?: InputMaybe<Scalars['String']>;
  addressLine2?: InputMaybe<Scalars['String']>;
  addressLine3?: InputMaybe<Scalars['String']>;
  addressLine4?: InputMaybe<Scalars['String']>;
  endDate?: InputMaybe<Scalars['Date']>;
  forename?: InputMaybe<Scalars['String']>;
  ownerId?: InputMaybe<Scalars['Int']>;
  startDate?: InputMaybe<Scalars['Date']>;
  surname?: InputMaybe<Scalars['String']>;
};

export type SavePpodCredentials = {
  password: Scalars['String'];
  username: Scalars['String'];
};

export type SavePpodSchoolInfo = {
  address1?: InputMaybe<Scalars['String']>;
  address2?: InputMaybe<Scalars['String']>;
  address3?: InputMaybe<Scalars['String']>;
  address4?: InputMaybe<Scalars['String']>;
  boardOfManagement?: InputMaybe<Scalars['Boolean']>;
  boardingFeeFiveDay?: InputMaybe<Scalars['BigDecimal']>;
  boardingFeeSixOrSevenDay?: InputMaybe<Scalars['BigDecimal']>;
  chairPeople?: InputMaybe<Array<InputMaybe<SaveChairPerson>>>;
  coOperatingSchoolRollNo1?: InputMaybe<Scalars['String']>;
  coOperatingSchoolRollNo2?: InputMaybe<Scalars['String']>;
  county?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  fax?: InputMaybe<Scalars['String']>;
  irishClassification?: InputMaybe<Scalars['String']>;
  localAuthority?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  octoberReturnsContact?: InputMaybe<Scalars['String']>;
  octoberReturnsEmail?: InputMaybe<Scalars['String']>;
  octoberReturnsFaxNo?: InputMaybe<Scalars['String']>;
  octoberReturnsPhoneNo?: InputMaybe<Scalars['String']>;
  owners?: InputMaybe<Array<InputMaybe<SaveOwner>>>;
  parentAssociation?: InputMaybe<Scalars['Boolean']>;
  phone?: InputMaybe<Scalars['String']>;
  principal?: InputMaybe<Scalars['String']>;
  rollNo?: InputMaybe<Scalars['String']>;
  schoolGender?: InputMaybe<Scalars['String']>;
  studentCouncil?: InputMaybe<Scalars['Boolean']>;
  trustees?: InputMaybe<Array<InputMaybe<SaveTrustee>>>;
  website?: InputMaybe<Scalars['String']>;
};

export type SaveParentalAttendanceRequest = {
  adminNote?: InputMaybe<Scalars['String']>;
  attendanceCodeId: Scalars['Int'];
  attendanceNote?: InputMaybe<Scalars['String']>;
  from: Scalars['DateTime'];
  id?: InputMaybe<Scalars['Long']>;
  parentNote: Scalars['String'];
  requestType: ParentalAttendanceRequestType;
  status: ParentalAttendanceRequestStatus;
  studentPartyId: Scalars['Long'];
  to: Scalars['DateTime'];
};

export type SavePermissionGroup = {
  description: Array<InputMaybe<TranslationInput>>;
  id?: InputMaybe<Scalars['Int']>;
  memberPartyIds?: InputMaybe<Array<Scalars['Long']>>;
  memberType: MemberType;
  name: Array<InputMaybe<TranslationInput>>;
  permissionSets?: InputMaybe<Array<SavePermissionGroupSet>>;
};

export type SavePermissionGroupSet = {
  id: Scalars['String'];
  permissionType?: InputMaybe<PermissionType>;
  toggle?: InputMaybe<Scalars['Boolean']>;
};

export type SavePriorityStudentInput = {
  from?: InputMaybe<Scalars['DateTime']>;
  id?: InputMaybe<Scalars['Long']>;
  note?: InputMaybe<Scalars['String']>;
  studentPartyId?: InputMaybe<Scalars['Long']>;
  to?: InputMaybe<Scalars['DateTime']>;
};

export type SaveResultExtraFieldInput = {
  assessmentExtraFieldId: Scalars['Long'];
  commentBankCommentId?: InputMaybe<Scalars['Long']>;
  gradeSetGradeId?: InputMaybe<Scalars['Long']>;
  id?: InputMaybe<Scalars['Long']>;
  result?: InputMaybe<Scalars['String']>;
};

export type SaveStudentSessionAttendanceInput = {
  adminSubmitted?: InputMaybe<Scalars['Boolean']>;
  applyCodes?: InputMaybe<SessionAttendanceFlag>;
  attendances: Array<StudentSessionAttendanceInput>;
};

export type SaveStudentSupportFileInput = {
  actionsNeeded?: InputMaybe<Scalars['Boolean']>;
  actionsNeededComments?: InputMaybe<Scalars['String']>;
  actionsNeededDate?: InputMaybe<Scalars['Date']>;
  basicNeedsChecklist?: InputMaybe<Scalars['Boolean']>;
  basicNeedsChecklistComments?: InputMaybe<Scalars['String']>;
  basicNeedsChecklistDate?: InputMaybe<Scalars['Date']>;
  classroomWorkDifferentiated?: InputMaybe<Scalars['Boolean']>;
  classroomWorkDifferentiatedComments?: InputMaybe<Scalars['String']>;
  classroomWorkDifferentiatedDate?: InputMaybe<Scalars['Date']>;
  dateClosed: Scalars['Date'];
  dateOpened: Scalars['Date'];
  guardiansConsulted?: InputMaybe<Scalars['Boolean']>;
  guardiansConsultedComments?: InputMaybe<Scalars['String']>;
  guardiansConsultedDate?: InputMaybe<Scalars['Date']>;
  hearing?: InputMaybe<Scalars['Boolean']>;
  hearingComments?: InputMaybe<Scalars['String']>;
  hearingDate?: InputMaybe<Scalars['Date']>;
  id?: InputMaybe<Scalars['Int']>;
  learningEnvironmentAdapted?: InputMaybe<Scalars['Boolean']>;
  learningEnvironmentAdaptedComments?: InputMaybe<Scalars['String']>;
  learningEnvironmentAdaptedDate?: InputMaybe<Scalars['Date']>;
  learningScreening?: InputMaybe<Scalars['Boolean']>;
  learningScreeningComments?: InputMaybe<Scalars['String']>;
  learningScreeningDate?: InputMaybe<Scalars['Date']>;
  medical?: InputMaybe<Scalars['Boolean']>;
  medicalComments?: InputMaybe<Scalars['String']>;
  medicalDate?: InputMaybe<Scalars['Date']>;
  name: Scalars['String'];
  observationOfLearning?: InputMaybe<Scalars['Boolean']>;
  observationOfLearningComments?: InputMaybe<Scalars['String']>;
  observationOfLearningDate?: InputMaybe<Scalars['Date']>;
  otherInterventions?: InputMaybe<Scalars['Boolean']>;
  otherInterventionsComments?: InputMaybe<Scalars['String']>;
  otherInterventionsDate?: InputMaybe<Scalars['Date']>;
  outsideProfessionals?: InputMaybe<Scalars['Boolean']>;
  outsideProfessionalsComments?: InputMaybe<Scalars['String']>;
  outsideProfessionalsDate?: InputMaybe<Scalars['Date']>;
  previousSchoolInfo?: InputMaybe<Scalars['Boolean']>;
  previousSchoolInfoComments?: InputMaybe<Scalars['String']>;
  previousSchoolInfoDate?: InputMaybe<Scalars['Date']>;
  pupilInterview?: InputMaybe<Scalars['Boolean']>;
  pupilInterviewComments?: InputMaybe<Scalars['String']>;
  pupilInterviewDate?: InputMaybe<Scalars['Date']>;
  schoolEnvironmentAdapted?: InputMaybe<Scalars['Boolean']>;
  schoolEnvironmentAdaptedComments?: InputMaybe<Scalars['String']>;
  schoolEnvironmentAdaptedDate?: InputMaybe<Scalars['Date']>;
  studentPartyId: Scalars['Long'];
  subjects?: InputMaybe<Array<InputMaybe<SaveStudentSupportFileSubjectInput>>>;
  vision?: InputMaybe<Scalars['Boolean']>;
  visionComments?: InputMaybe<Scalars['String']>;
  visionDate?: InputMaybe<Scalars['Date']>;
};

export type SaveStudentSupportFileSubjectInput = {
  id?: InputMaybe<Scalars['Int']>;
  subjectId: Scalars['Int'];
};

export type SaveStudentSupportPlanInput = {
  endDate: Scalars['Date'];
  guardiansSignatureObtained?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['Int']>;
  planType: StudentSupportPlanType;
  possibleConcerns?: InputMaybe<Scalars['String']>;
  priorityConcerns?: InputMaybe<Scalars['String']>;
  resourcesNeeded?: InputMaybe<Scalars['String']>;
  review?: InputMaybe<SaveStudentSupportPlanReviewInput>;
  staff?: InputMaybe<Array<InputMaybe<SaveStudentSupportPlanStaffInput>>>;
  staffSignatureObtained?: InputMaybe<Scalars['Boolean']>;
  startDate: Scalars['Date'];
  strategies?: InputMaybe<Scalars['String']>;
  strengthsAndInterests?: InputMaybe<Scalars['String']>;
  studentSupportFileId: Scalars['Int'];
  targets?: InputMaybe<Array<InputMaybe<SaveStudentSupportPlanTargetInput>>>;
};

export type SaveStudentSupportPlanReviewAttendeeInput = {
  id?: InputMaybe<Scalars['Int']>;
  personPartyId: Scalars['Long'];
};

export type SaveStudentSupportPlanReviewInput = {
  attendees?: InputMaybe<Array<InputMaybe<SaveStudentSupportPlanReviewAttendeeInput>>>;
  date: Scalars['Date'];
  guardiansComments: Scalars['String'];
  guardiansSignatureObtained?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['Int']>;
  originalConcernsChanges: Scalars['String'];
  recommendedActions: Scalars['String'];
  staffSignatureObtained?: InputMaybe<Scalars['Boolean']>;
  studentSupportPlanId: Scalars['Int'];
  studentsComments: Scalars['String'];
  studentsNeedsChanges: Scalars['String'];
  successfulAreas: Scalars['String'];
};

export type SaveStudentSupportPlanStaffInput = {
  id?: InputMaybe<Scalars['Int']>;
  lead?: InputMaybe<Scalars['Boolean']>;
  staffPartyId: Scalars['Long'];
};

export type SaveStudentSupportPlanTargetInput = {
  comments: Scalars['String'];
  id?: InputMaybe<Scalars['Int']>;
  status: TargetStatus;
  target: Scalars['String'];
};

export type SaveTrustee = {
  addressLine1?: InputMaybe<Scalars['String']>;
  addressLine2?: InputMaybe<Scalars['String']>;
  addressLine3?: InputMaybe<Scalars['String']>;
  addressLine4?: InputMaybe<Scalars['String']>;
  endDate?: InputMaybe<Scalars['Date']>;
  forename?: InputMaybe<Scalars['String']>;
  startDate?: InputMaybe<Scalars['Date']>;
  surname?: InputMaybe<Scalars['String']>;
  trusteeId?: InputMaybe<Scalars['Int']>;
};

export type SchoolAddress = {
  __typename?: 'SchoolAddress';
  address1?: Maybe<Scalars['String']>;
  address2?: Maybe<Scalars['String']>;
  address3?: Maybe<Scalars['String']>;
  address4?: Maybe<Scalars['String']>;
  county?: Maybe<Scalars['String']>;
  localAuthority?: Maybe<Scalars['String']>;
};

export enum SchoolDayType {
  NonSchoolDay = 'NON_SCHOOL_DAY',
  Partial = 'PARTIAL',
  PublicHoliday = 'PUBLIC_HOLIDAY',
  SchoolDay = 'SCHOOL_DAY'
}

export type SchoolInfo = {
  __typename?: 'SchoolInfo';
  addresses?: Maybe<Array<Maybe<SchoolAddress>>>;
  boardOfManagement?: Maybe<Scalars['Boolean']>;
  boardingFeeFiveDay?: Maybe<Scalars['BigDecimal']>;
  boardingFeeSixOrSevenDay?: Maybe<Scalars['BigDecimal']>;
  chairPeople?: Maybe<Array<Maybe<ChairPerson>>>;
  coOperatingSchoolRollNo1?: Maybe<Scalars['String']>;
  coOperatingSchoolRollNo2?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  fax?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  irishClassification?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  octoberReturnsContact?: Maybe<Scalars['String']>;
  octoberReturnsEmail?: Maybe<Scalars['String']>;
  octoberReturnsFaxNo?: Maybe<Scalars['String']>;
  octoberReturnsPhoneNo?: Maybe<Scalars['String']>;
  owners?: Maybe<Array<Maybe<Owner>>>;
  parentAssociation?: Maybe<Scalars['Boolean']>;
  phones?: Maybe<Array<Maybe<SchoolPhoneNo>>>;
  principal?: Maybe<Scalars['String']>;
  rollNo?: Maybe<Scalars['String']>;
  schoolGender?: Maybe<Scalars['String']>;
  studentCouncil?: Maybe<Scalars['Boolean']>;
  trustees?: Maybe<Array<Maybe<Trustee>>>;
  website?: Maybe<Scalars['String']>;
};

export type SchoolInfoFilter = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export type SchoolPhoneNo = {
  __typename?: 'SchoolPhoneNo';
  phone?: Maybe<Scalars['String']>;
};

export type Search = {
  __typename?: 'Search';
  avatarUrl?: Maybe<Scalars['String']>;
  meta: SearchMeta;
  partyId: Scalars['Long'];
  text: Scalars['String'];
  type: SearchType;
};

export type SearchFilter = {
  context?: InputMaybe<Array<InputMaybe<Context>>>;
  /**  optional filter to include only certain types of results */
  includeSearchType?: InputMaybe<Array<SearchType>>;
  text?: InputMaybe<Scalars['String']>;
};

export type SearchMeta = {
  __typename?: 'SearchMeta';
  groupType?: Maybe<GeneralGroupType>;
  studentPartyId?: Maybe<Scalars['Long']>;
};

export enum SearchType {
  Contact = 'CONTACT',
  CustomGroup = 'CUSTOM_GROUP',
  GeneralGroup = 'GENERAL_GROUP',
  GeneralGroupContact = 'GENERAL_GROUP_CONTACT',
  GeneralGroupStaff = 'GENERAL_GROUP_STAFF',
  GeneralGroupStudent = 'GENERAL_GROUP_STUDENT',
  Room = 'ROOM',
  Staff = 'STAFF',
  Student = 'STUDENT',
  SubjectGroup = 'SUBJECT_GROUP',
  SubjectGroupContact = 'SUBJECT_GROUP_CONTACT',
  SubjectGroupStaff = 'SUBJECT_GROUP_STAFF',
  SubjectGroupStudent = 'SUBJECT_GROUP_STUDENT',
  YearGroupContact = 'YEAR_GROUP_CONTACT',
  YearGroupEnrollment = 'YEAR_GROUP_ENROLLMENT',
  YearGroupStaff = 'YEAR_GROUP_STAFF'
}

export type SecurityRole = {
  __typename?: 'SecurityRole';
  description: Scalars['String'];
  descriptionTextId: Scalars['Int'];
  id: Scalars['Int'];
  name: Scalars['String'];
  nameTextId: Scalars['Int'];
  permissionKeys?: Maybe<Array<Maybe<Scalars['String']>>>;
  permissions?: Maybe<Array<Maybe<Permission>>>;
};

export type SecurityRoleFilter = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export type SendMailInput = {
  body: Scalars['String'];
  canReply: Scalars['Boolean'];
  recipients: Array<InputMaybe<SendMailRecipientInput>>;
  subject: Scalars['String'];
  threadId?: InputMaybe<Scalars['Long']>;
};

export type SendMailRecipientInput = {
  recipientPartyId: Scalars['Long'];
  recipientPartyType: SearchType;
  recipientType: RecipientType;
};

export type SendPushNotificationInput = {
  metadata?: InputMaybe<NotificationMetaDataInput>;
  notificationType: NotificationType;
  partyIds: Array<Scalars['Long']>;
  text: Scalars['String'];
  title: Scalars['String'];
};

export type SendSmsInput = {
  canReply: Scalars['Boolean'];
  mobileNumbers?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  recipients?: InputMaybe<Array<InputMaybe<RecipientInput>>>;
  text: Scalars['String'];
};

export type Session = {
  __typename?: 'Session';
  active: Scalars['Boolean'];
  id: Scalars['Int'];
  name: Scalars['String'];
  nameTextId?: Maybe<Scalars['Int']>;
  time: Scalars['Time'];
};

export enum SessionAttendanceFlag {
  AbsentCodesOnly = 'ABSENT_CODES_ONLY',
  AllCodes = 'ALL_CODES'
}

export type SessionAttendanceList = {
  __typename?: 'SessionAttendanceList';
  attendanceCode: AttendanceCode;
  attendanceCodeId: Scalars['Int'];
  bellTime: Calendar_BellTime;
  bellTimeId: Scalars['Int'];
  classGroup?: Maybe<GeneralGroup>;
  date: Scalars['Date'];
  id: Scalars['Long'];
  note?: Maybe<Scalars['String']>;
  student: Person;
  studentPartyId: Scalars['Long'];
};

export type SessionAttendanceListFilter = {
  attendanceCodeIds: Array<Scalars['Int']>;
  from: Scalars['Date'];
  studentPartyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
  to: Scalars['Date'];
};

export type SessionAttendanceStatus = {
  __typename?: 'SessionAttendanceStatus';
  codeType: AttendanceCodeType;
  name?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  studentPartyId: Scalars['Long'];
};

export type SetActiveAcademicNamespace = {
  academicNamespaceId: Scalars['Int'];
};

export type Sms = {
  __typename?: 'Sms';
  body: Scalars['String'];
  canReply: Scalars['Boolean'];
  groupRecipientIds?: Maybe<Array<Scalars['Long']>>;
  groupRecipients?: Maybe<Array<PartyGroup>>;
  id: Scalars['Long'];
  name: Scalars['String'];
  numRecipients: Scalars['Int'];
  recipientIds?: Maybe<Array<Scalars['Long']>>;
  recipientType: SearchType;
  recipients: Array<SmsRecipient>;
  /** deep linked */
  sender: Person;
  senderPartyId: Scalars['Long'];
  sentOn: Scalars['DateTime'];
  totalCost: Scalars['BigDecimal'];
};

export type SmsCost = {
  __typename?: 'SmsCost';
  total?: Maybe<Scalars['BigDecimal']>;
};

export type SmsCostFilter = {
  recipients?: InputMaybe<Array<InputMaybe<RecipientInput>>>;
};

export type SmsCredit = {
  __typename?: 'SmsCredit';
  smsCredit: Scalars['Float'];
};

export type SmsFilter = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
};

export type SmsGroupRecipient = {
  __typename?: 'SmsGroupRecipient';
  groupPartyId: Scalars['Long'];
  name: Scalars['String'];
};

export type SmsRecipient = {
  __typename?: 'SmsRecipient';
  deliveredOn?: Maybe<Scalars['DateTime']>;
  id?: Maybe<SmsRecipientId>;
  /** deep linked */
  recipient?: Maybe<Person>;
  recipientPartyId: Scalars['Long'];
  recipientPhoneNumber: Scalars['String'];
  smsStatus: SmsStatus;
};

export type SmsRecipientId = {
  __typename?: 'SmsRecipientId';
  recipientPartyId: Scalars['Long'];
  smsId: Scalars['Long'];
  tenant: Scalars['Int'];
};

export enum SmsRecipientType {
  ClassGroupStaff = 'CLASS_GROUP_STAFF',
  Contact = 'CONTACT',
  GeneralGroupContact = 'GENERAL_GROUP_CONTACT',
  GeneralGroupStaff = 'GENERAL_GROUP_STAFF',
  Staff = 'STAFF',
  Student = 'STUDENT',
  StudentTeachers = 'STUDENT_TEACHERS',
  SubjectGroupContact = 'SUBJECT_GROUP_CONTACT',
  SubjectGroupStaff = 'SUBJECT_GROUP_STAFF',
  YearGroupContact = 'YEAR_GROUP_CONTACT',
  YearGroupStaff = 'YEAR_GROUP_STAFF'
}

export type SmsSentResponse = {
  __typename?: 'SmsSentResponse';
  numSmsSent: Scalars['Int'];
  smsSentCost: Scalars['Float'];
};

export enum SmsStatus {
  Failed = 'FAILED',
  Pending = 'PENDING',
  Scheduled = 'SCHEDULED',
  Success = 'SUCCESS'
}

export type SmsTopUpInput = {
  amount: Scalars['Float'];
  code: Scalars['String'];
};

export type SmsTopUpResponse = {
  __typename?: 'SmsTopUpResponse';
  invoiceAmount: Scalars['Float'];
  invoiceNumber: Scalars['String'];
  smsCredit: Scalars['Float'];
};

export type Staff = Party & PartyPerson & {
  __typename?: 'Staff';
  availableForSubstitution: Scalars['Boolean'];
  availableForSupportClasses: Scalars['Boolean'];
  availableForTeaching: Scalars['Boolean'];
  carRegistrationNumber?: Maybe<Scalars['String']>;
  competencies?: Maybe<Array<Maybe<Scalars['Int']>>>;
  /**     deep linked */
  competencySubjects: Array<Subject>;
  dateOfBirth?: Maybe<Scalars['Date']>;
  displayCode?: Maybe<Scalars['String']>;
  emergencyContact?: Maybe<StaffEmergencyContact>;
  employmentCapacity?: Maybe<StaffCapacity>;
  endDate?: Maybe<Scalars['Date']>;
  extensions?: Maybe<StaffGraphqlExtension>;
  jobSharing?: Maybe<Scalars['Boolean']>;
  makeAndModel?: Maybe<Scalars['String']>;
  noLongerStaffMember?: Maybe<Scalars['Boolean']>;
  parking?: Maybe<Scalars['String']>;
  partyId: Scalars['Long'];
  payrollNumber?: Maybe<Scalars['String']>;
  person: Person;
  personalInformation?: Maybe<PersonalInformation>;
  position?: Maybe<Scalars['String']>;
  qualifications?: Maybe<Scalars['String']>;
  staffIre?: Maybe<StaffIre>;
  startDate?: Maybe<Scalars['Date']>;
  subjectGroups: Array<SubjectGroup>;
};

export type StaffCapacity = {
  __typename?: 'StaffCapacity';
  id: Scalars['String'];
  name: Scalars['String'];
  nameTextId: Scalars['Int'];
};

export type StaffEmergencyContact = {
  __typename?: 'StaffEmergencyContact';
  additionalNumber?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  primaryNumber?: Maybe<Scalars['String']>;
};

export type StaffFilter = {
  availableForSubstitution?: InputMaybe<Scalars['Boolean']>;
  availableForTeaching?: InputMaybe<Scalars['Boolean']>;
  noLongerStaffMember?: InputMaybe<Scalars['Boolean']>;
  partyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
};

export type StaffGraphqlExtension = {
  __typename?: 'StaffGraphqlExtension';
  doeNotUser?: Maybe<Scalars['String']>;
  notes?: Maybe<Array<Maybe<Notes_Note>>>;
  substitutionSummary?: Maybe<Swm_SubstitutionSummary>;
  /**  Gives a summary of the timetable for a particular teacher */
  timetableSummary?: Maybe<Tt_TeacherTimetableSummary>;
};

export type StaffGroupMembershipInput = {
  fromDate?: InputMaybe<Scalars['Date']>;
  partyId: Scalars['Long'];
  roles?: InputMaybe<Array<InputMaybe<StaffGroupMembershipRoles>>>;
  toDate?: InputMaybe<Scalars['Date']>;
};

export enum StaffGroupMembershipRoles {
  GroupAdmin = 'GROUP_ADMIN',
  LongTermSubstitute = 'LONG_TERM_SUBSTITUTE',
  ShortTermSubstitute = 'SHORT_TERM_SUBSTITUTE',
  Support = 'SUPPORT',
  Teacher = 'TEACHER',
  Tutor = 'TUTOR'
}

export type StaffIre = {
  __typename?: 'StaffIre';
  includeDtrReturns?: Maybe<Scalars['Boolean']>;
  otherSchool1?: Maybe<Scalars['String']>;
  otherSchool2?: Maybe<Scalars['String']>;
  previousSchool1?: Maybe<Scalars['String']>;
  previousSchool2?: Maybe<Scalars['String']>;
  qualifications2?: Maybe<Scalars['String']>;
  qualifications3?: Maybe<Scalars['String']>;
  qualifications4?: Maybe<Scalars['String']>;
  staffPost?: Maybe<StaffPost>;
  teacherCouncilNumber?: Maybe<Scalars['String']>;
  teacherReferenceNumber?: Maybe<Scalars['String']>;
};

export type StaffPost = {
  __typename?: 'StaffPost';
  id: Scalars['Int'];
  name: Scalars['String'];
  nameTextId: Scalars['Int'];
};

export enum StaffProgrammeStageMembershipRoles {
  GroupAdmin = 'GROUP_ADMIN',
  ProgrammeLead = 'PROGRAMME_LEAD',
  Support = 'SUPPORT'
}

export enum StaffYearGroupMembershipRoles {
  GroupAdmin = 'GROUP_ADMIN',
  Support = 'SUPPORT',
  YearGroupLead = 'YEAR_GROUP_LEAD'
}

export type Student = Party & PartyPerson & {
  __typename?: 'Student';
  avatarUrl?: Maybe<Scalars['String']>;
  /**  deep linked */
  classGroup?: Maybe<GeneralGroup>;
  /**  deep linked */
  contacts?: Maybe<Array<StudentContact>>;
  endDate?: Maybe<Scalars['Date']>;
  /**  deep linked */
  enrolmentHistory?: Maybe<Array<EnrollmentHistory>>;
  extensions?: Maybe<StudentGraphqlExtension>;
  externalSystemId?: Maybe<Scalars['String']>;
  guardianshipNote?: Maybe<Scalars['String']>;
  leftEarly?: Maybe<Scalars['Boolean']>;
  partyId: Scalars['Long'];
  /**  deep linked */
  person: Person;
  /**  deep linked */
  personalInformation?: Maybe<PersonalInformation>;
  programmeStages?: Maybe<Array<ProgrammeStage>>;
  siblings?: Maybe<Core_Siblings>;
  startDate?: Maybe<Scalars['Date']>;
  studentIrePP?: Maybe<StudentIrePp>;
  subjectGroups: Array<SubjectGroup>;
  /**  deep linked */
  tutors: Array<Person>;
  yearGroupLeads: Array<Person>;
  yearGroups: Array<YearGroupEnrollment>;
};

export type StudentAenFilter = {
  studentPartyId: Scalars['Long'];
};

export type StudentBellTimeAttendance = {
  __typename?: 'StudentBellTimeAttendance';
  adminSubmitted: Scalars['Boolean'];
  attendanceCode?: Maybe<AttendanceCode>;
  bellTime: Calendar_BellTime;
  bellTimeId: Scalars['Int'];
  createdBy: Person;
  createdByPartyId: Scalars['Long'];
  note?: Maybe<Scalars['String']>;
  updatedBy: Person;
  updatedByPartyId: Scalars['Long'];
};

export type StudentContact = Party & PartyPerson & {
  __typename?: 'StudentContact';
  occupation?: Maybe<Scalars['String']>;
  partyId: Scalars['Long'];
  person: Person;
  /**  deep linked */
  personalInformation?: Maybe<PersonalInformation>;
  relationships?: Maybe<Array<Maybe<StudentContactRelationshipInfo>>>;
  requiresInterpreter?: Maybe<Scalars['Boolean']>;
  spokenLanguages?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type StudentContactFilter = {
  allowAccessToStudentData?: InputMaybe<Scalars['Boolean']>;
  studentContactPartyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
  studentPartyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
};

export type StudentContactRelationshipInfo = {
  __typename?: 'StudentContactRelationshipInfo';
  allowAccessToStudentData: Scalars['Boolean'];
  allowedToContact: Scalars['Boolean'];
  contactPartyId: Scalars['Long'];
  includeInSms: Scalars['Boolean'];
  /**  include in in  app email */
  includeInTmail: Scalars['Boolean'];
  legalGuardian: Scalars['Boolean'];
  pickupRights: Scalars['Boolean'];
  priority: Scalars['Int'];
  relationshipType: StudentContactType;
  student: Student;
  studentPartyId: Scalars['Long'];
};

export enum StudentContactType {
  Aunty = 'AUNTY',
  FamilyFriend = 'FAMILY_FRIEND',
  Father = 'FATHER',
  GrandFather = 'GRAND_FATHER',
  GrandMother = 'GRAND_MOTHER',
  Mother = 'MOTHER',
  Neighbour = 'NEIGHBOUR',
  Other = 'OTHER',
  Sibling = 'SIBLING',
  SocialWorker = 'SOCIAL_WORKER',
  StepFather = 'STEP_FATHER',
  StepMother = 'STEP_MOTHER',
  Uncle = 'UNCLE'
}

export type StudentDateAttendance = {
  __typename?: 'StudentDateAttendance';
  bellTimeAttendance: Array<StudentBellTimeAttendance>;
  date: Scalars['Date'];
};

export type StudentFilter = {
  examNumbers?: InputMaybe<Array<Scalars['String']>>;
  externalSystemIds?: InputMaybe<Array<Scalars['String']>>;
  leftSchool?: InputMaybe<Scalars['Boolean']>;
  partyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
};

export type StudentGraphqlExtension = {
  __typename?: 'StudentGraphqlExtension';
  doeNotUser?: Maybe<Scalars['String']>;
  exampleExtension?: Maybe<Scalars['String']>;
  objectExample?: Maybe<ExampleObjectExtension>;
  priority?: Maybe<Scalars['Boolean']>;
};

export type StudentIre = {
  __typename?: 'StudentIre';
  countryOfBirth?: Maybe<Scalars['String']>;
  pps?: Maybe<Scalars['String']>;
  religion?: Maybe<Scalars['String']>;
};

export type StudentIrePp = {
  __typename?: 'StudentIrePP';
  boardingDays?: Maybe<Scalars['String']>;
  borderIndicator?: Maybe<Scalars['Boolean']>;
  deceased?: Maybe<Scalars['Boolean']>;
  deceasedDate?: Maybe<Scalars['Date']>;
  deleted?: Maybe<Scalars['Boolean']>;
  destinationRollNo?: Maybe<Scalars['String']>;
  dpin?: Maybe<Scalars['Long']>;
  examEntrant?: Maybe<Scalars['Boolean']>;
  examNumber?: Maybe<Scalars['String']>;
  languageSupportApplicant?: Maybe<Scalars['Boolean']>;
  lockerNumber?: Maybe<Scalars['String']>;
  medicalCard?: Maybe<Scalars['Boolean']>;
  previousSchoolName?: Maybe<Scalars['String']>;
  previousSchoolRollNumber?: Maybe<Scalars['String']>;
  previousSchoolType?: Maybe<Scalars['String']>;
  reasonForLeaving?: Maybe<StudentLeavingReason>;
  repeatYear?: Maybe<Scalars['Boolean']>;
  shortTermPupil?: Maybe<Scalars['Boolean']>;
  shortTermPupilNumWeeks?: Maybe<Scalars['Int']>;
  travellerHeritage?: Maybe<Scalars['Boolean']>;
};

export enum StudentLeavingReason {
  Another_2NdLevelSchoolInTheState = 'ANOTHER_2ND_LEVEL_SCHOOL_IN_THE_STATE',
  ApprenticeshipInvolvingSomeTraining = 'APPRENTICESHIP_INVOLVING_SOME_TRAINING',
  ANonRecognisedSecondLevelSchoolInTheState = 'A_NON_RECOGNISED_SECOND_LEVEL_SCHOOL_IN_THE_STATE',
  Deceased = 'DECEASED',
  EmigrationOtherThan_6And_7Above = 'EMIGRATION_OTHER_THAN_6_AND_7_ABOVE',
  Employment = 'EMPLOYMENT',
  FullTimeVocationalTrainingInTheState = 'FULL_TIME_VOCATIONAL_TRAINING_IN_THE_STATE',
  FurtherEducationOutsideTheState = 'FURTHER_EDUCATION_OUTSIDE_THE_STATE',
  Other = 'OTHER',
  OutsideTheStateAndNotInFurtherEducation = 'OUTSIDE_THE_STATE_AND_NOT_IN_FURTHER_EDUCATION',
  PursuingSeniorCycleInPrivateInstitution = 'PURSUING_SENIOR_CYCLE_IN_PRIVATE_INSTITUTION',
  SchoolNotNotifiedOrNotAwareOfReasonForLeaving = 'SCHOOL_NOT_NOTIFIED_OR_NOT_AWARE_OF_REASON_FOR_LEAVING',
  ThirdLevelCollegeInTheState = 'THIRD_LEVEL_COLLEGE_IN_THE_STATE',
  YouthreachCourse = 'YOUTHREACH_COURSE'
}

export type StudentMedical = {
  __typename?: 'StudentMedical';
  conditions: Array<StudentMedicalCondition>;
  medicalContacts: Array<StudentMedicalContact>;
  student?: Maybe<Student>;
  studentPartyId: Scalars['Long'];
};

export type StudentMedicalCondition = {
  __typename?: 'StudentMedicalCondition';
  description?: Maybe<Scalars['String']>;
  emergencyPlan?: Maybe<Scalars['String']>;
  equipment: Array<StudentMedicalConditionEquipment>;
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type StudentMedicalConditionEquipment = {
  __typename?: 'StudentMedicalConditionEquipment';
  expiryDate?: Maybe<Scalars['Date']>;
  firstResponders: Array<Staff>;
  firstRespondersIds: Array<Scalars['Long']>;
  id: Scalars['Int'];
  location?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  notes?: Maybe<Scalars['String']>;
};

export type StudentMedicalContact = {
  __typename?: 'StudentMedicalContact';
  additionalPhone?: Maybe<Scalars['String']>;
  addressLine1?: Maybe<Scalars['String']>;
  addressLine2?: Maybe<Scalars['String']>;
  addressLine3?: Maybe<Scalars['String']>;
  county?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  lastName?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  occupation?: Maybe<Scalars['String']>;
  personalTitle?: Maybe<Scalars['String']>;
  personalTitleId?: Maybe<Scalars['Int']>;
  postcode?: Maybe<Scalars['String']>;
  primaryPhone?: Maybe<Scalars['String']>;
};

export type StudentMedicalFilter = {
  studentPartyId: Scalars['Long'];
};

export type StudentSessionAttendance = {
  __typename?: 'StudentSessionAttendance';
  adminSubmitted: Scalars['Boolean'];
  classGroup?: Maybe<GeneralGroup>;
  dateAttendance: Array<StudentDateAttendance>;
  student: Person;
  studentPartyId: Scalars['Long'];
};

export type StudentSessionAttendanceFilter = {
  from: Scalars['Date'];
  partyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
  to: Scalars['Date'];
};

export type StudentSessionAttendanceInput = {
  attendanceCodeId?: InputMaybe<Scalars['Int']>;
  bellTimeId: Scalars['Int'];
  date: Scalars['Date'];
  id?: InputMaybe<Scalars['Long']>;
  note?: InputMaybe<Scalars['String']>;
  studentPartyId: Scalars['Long'];
};

export type StudentStatus = {
  __typename?: 'StudentStatus';
  activeSupportPlan?: Maybe<Scalars['Boolean']>;
  currentLocation?: Maybe<CurrentStudentLocation>;
  priorityStudent?: Maybe<Scalars['Boolean']>;
  sessionAttendance?: Maybe<Array<Maybe<SessionAttendanceStatus>>>;
  studentPartyId: Scalars['Long'];
};

export type StudentStatusFilter = {
  studentPartyId?: InputMaybe<Scalars['Long']>;
};

export type StudentSupportFile = {
  __typename?: 'StudentSupportFile';
  actionsNeeded?: Maybe<Scalars['Boolean']>;
  actionsNeededComments?: Maybe<Scalars['String']>;
  actionsNeededDate?: Maybe<Scalars['Date']>;
  basicNeedsChecklist?: Maybe<Scalars['Boolean']>;
  basicNeedsChecklistComments?: Maybe<Scalars['String']>;
  basicNeedsChecklistDate?: Maybe<Scalars['Date']>;
  classroomWorkDifferentiated?: Maybe<Scalars['Boolean']>;
  classroomWorkDifferentiatedComments?: Maybe<Scalars['String']>;
  classroomWorkDifferentiatedDate?: Maybe<Scalars['Date']>;
  creatorPartyId: Scalars['Long'];
  dateClosed: Scalars['Date'];
  dateOpened: Scalars['Date'];
  guardiansConsulted?: Maybe<Scalars['Boolean']>;
  guardiansConsultedComments?: Maybe<Scalars['String']>;
  guardiansConsultedDate?: Maybe<Scalars['Date']>;
  hearing?: Maybe<Scalars['Boolean']>;
  hearingComments?: Maybe<Scalars['String']>;
  hearingDate?: Maybe<Scalars['Date']>;
  id: Scalars['Int'];
  learningEnvironmentAdapted?: Maybe<Scalars['Boolean']>;
  learningEnvironmentAdaptedComments?: Maybe<Scalars['String']>;
  learningEnvironmentAdaptedDate?: Maybe<Scalars['Date']>;
  learningScreening?: Maybe<Scalars['Boolean']>;
  learningScreeningComments?: Maybe<Scalars['String']>;
  learningScreeningDate?: Maybe<Scalars['Date']>;
  medical?: Maybe<Scalars['Boolean']>;
  medicalComments?: Maybe<Scalars['String']>;
  medicalDate?: Maybe<Scalars['Date']>;
  name: Scalars['String'];
  observationOfLearning?: Maybe<Scalars['Boolean']>;
  observationOfLearningComments?: Maybe<Scalars['String']>;
  observationOfLearningDate?: Maybe<Scalars['Date']>;
  otherInterventions?: Maybe<Scalars['Boolean']>;
  otherInterventionsComments?: Maybe<Scalars['String']>;
  otherInterventionsDate?: Maybe<Scalars['Date']>;
  outsideProfessionals?: Maybe<Scalars['Boolean']>;
  outsideProfessionalsComments?: Maybe<Scalars['String']>;
  outsideProfessionalsDate?: Maybe<Scalars['Date']>;
  previousSchoolInfo?: Maybe<Scalars['Boolean']>;
  previousSchoolInfoComments?: Maybe<Scalars['String']>;
  previousSchoolInfoDate?: Maybe<Scalars['Date']>;
  pupilInterview?: Maybe<Scalars['Boolean']>;
  pupilInterviewComments?: Maybe<Scalars['String']>;
  pupilInterviewDate?: Maybe<Scalars['Date']>;
  schoolEnvironmentAdapted?: Maybe<Scalars['Boolean']>;
  schoolEnvironmentAdaptedComments?: Maybe<Scalars['String']>;
  schoolEnvironmentAdaptedDate?: Maybe<Scalars['Date']>;
  studentPartyId: Scalars['Long'];
  subjects?: Maybe<Array<Maybe<StudentSupportFileSubject>>>;
  vision?: Maybe<Scalars['Boolean']>;
  visionComments?: Maybe<Scalars['String']>;
  visionDate?: Maybe<Scalars['Date']>;
};

export type StudentSupportFileFilter = {
  id?: InputMaybe<Scalars['Int']>;
  studentPartyId?: InputMaybe<Scalars['Long']>;
};

export type StudentSupportFileSubject = {
  __typename?: 'StudentSupportFileSubject';
  id: Scalars['Int'];
  subjectId: Scalars['Int'];
};

export type StudentSupportPlan = {
  __typename?: 'StudentSupportPlan';
  endDate: Scalars['Date'];
  guardiansSignatureObtained?: Maybe<Scalars['Boolean']>;
  id: Scalars['Int'];
  planType: StudentSupportPlanType;
  possibleConcerns?: Maybe<Scalars['String']>;
  priorityConcerns?: Maybe<Scalars['String']>;
  resourcesNeeded?: Maybe<Scalars['String']>;
  staff?: Maybe<Array<Maybe<StudentSupportPlanStaff>>>;
  staffSignatureObtained?: Maybe<Scalars['Boolean']>;
  startDate: Scalars['Date'];
  strategies?: Maybe<Scalars['String']>;
  strengthsAndInterests?: Maybe<Scalars['String']>;
  studentSupportFileId: Scalars['Int'];
  targets?: Maybe<Array<Maybe<StudentSupportPlanTarget>>>;
};

export type StudentSupportPlanFilter = {
  id?: InputMaybe<Scalars['Int']>;
  studentSupportFileId?: InputMaybe<Scalars['Int']>;
};

export type StudentSupportPlanReview = {
  __typename?: 'StudentSupportPlanReview';
  attendees?: Maybe<Array<Maybe<StudentSupportPlanReviewAttendee>>>;
  date: Scalars['Date'];
  guardiansComments: Scalars['String'];
  guardiansSignatureObtained?: Maybe<Scalars['Boolean']>;
  id: Scalars['Int'];
  originalConcernsChanges: Scalars['String'];
  recommendedActions: Scalars['String'];
  staffSignatureObtained?: Maybe<Scalars['Boolean']>;
  studentSupportPlanId: Scalars['Int'];
  studentsComments: Scalars['String'];
  studentsNeedsChanges: Scalars['String'];
  successfulAreas: Scalars['String'];
};

export type StudentSupportPlanReviewAttendee = {
  __typename?: 'StudentSupportPlanReviewAttendee';
  id: Scalars['Int'];
  personPartyId: Scalars['Long'];
  studentSupportPlanReviewId: Scalars['Int'];
};

export type StudentSupportPlanReviewFilter = {
  id?: InputMaybe<Scalars['Int']>;
  studentSupportPlanId?: InputMaybe<Scalars['Int']>;
};

export type StudentSupportPlanStaff = {
  __typename?: 'StudentSupportPlanStaff';
  id: Scalars['Int'];
  lead?: Maybe<Scalars['Boolean']>;
  staffPartyId: Scalars['Long'];
  studentSupportPlanId: Scalars['Int'];
};

export type StudentSupportPlanTarget = {
  __typename?: 'StudentSupportPlanTarget';
  comments: Scalars['String'];
  id: Scalars['Int'];
  status: TargetStatus;
  studentSupportPlanId: Scalars['Int'];
  target: Scalars['String'];
};

export enum StudentSupportPlanType {
  ClassRoom = 'CLASS_ROOM',
  School = 'SCHOOL',
  SchoolPlus = 'SCHOOL_PLUS'
}

export enum StudyLevel {
  Common = 'COMMON',
  Foundation = 'FOUNDATION',
  Higher = 'HIGHER',
  NotApplicable = 'NOT_APPLICABLE',
  Ordinary = 'ORDINARY'
}

export type Subject = {
  __typename?: 'Subject';
  active: Scalars['Boolean'];
  colour?: Maybe<Colour>;
  description?: Maybe<Scalars['String']>;
  descriptionTextId?: Maybe<Scalars['Int']>;
  icon?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  inUseHistorically: Scalars['Boolean'];
  name: Scalars['String'];
  nameTextId?: Maybe<Scalars['Int']>;
  nationalCode?: Maybe<Scalars['String']>;
  shortCode: Scalars['String'];
  shortCodeTextId?: Maybe<Scalars['Int']>;
  subjectSource: SubjectSource;
};

export type SubjectFilter = {
  /**  Only show subject which are currently in use. default HISTORIC */
  filterUsage?: InputMaybe<SubjectUsage>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export type SubjectGroup = Party & PartyGroup & {
  __typename?: 'SubjectGroup';
  academicNamespace?: Maybe<Scalars['Int']>;
  /**  name as stored in database */
  actualName: Scalars['String'];
  alsoInAcademicNamespaces: Array<Scalars['Int']>;
  avatarUrl?: Maybe<Scalars['String']>;
  includeInTimetable?: Maybe<Scalars['Boolean']>;
  irePP?: Maybe<SubjectGroupIrePp>;
  /**  this will return the actual name or the subject depending on the user type. Contacts/Students -> Subject name eveeryone else -> actual name */
  name: Scalars['String'];
  partyId: Scalars['Long'];
  programmeStages: Array<ProgrammeStage>;
  staff: Array<Person>;
  /**     deep linked */
  staffMembers?: Maybe<Group>;
  /**     deep linked */
  studentMembers?: Maybe<Group>;
  studentMembershipType?: Maybe<SubjectGroupStudentMembershipType>;
  students: Array<Student>;
  subjectGroupType: SubjectGroupType;
  subjectIds?: Maybe<Array<Maybe<Scalars['Int']>>>;
  /**     deep linked */
  subjects: Array<Subject>;
  yearGroups: Array<YearGroupEnrollment>;
};

export type SubjectGroupFilter = {
  isIncludeInTimetabling?: InputMaybe<Scalars['Boolean']>;
  partyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
  type?: InputMaybe<Array<SubjectGroupType>>;
};

export type SubjectGroupIrePp = {
  __typename?: 'SubjectGroupIrePP';
  level?: Maybe<StudyLevel>;
};

export type SubjectGroupMembershipTypeInput = {
  academicNamespaceId: Scalars['Int'];
  blockId?: InputMaybe<Scalars['String']>;
  classGroupId?: InputMaybe<Scalars['Long']>;
  membershipType: SubjectGroupStudentMembershipTypeEnum;
};

export type SubjectGroupStudent = {
  __typename?: 'SubjectGroupStudent';
  fromDate?: Maybe<Scalars['Date']>;
  studentPartyId: Scalars['Long'];
  studyLevel?: Maybe<StudyLevel>;
  subjectGroupId: Scalars['Long'];
  toDate?: Maybe<Scalars['Date']>;
};

export type SubjectGroupStudentFilter = {
  studentPartyIds: Array<Scalars['Long']>;
  subjectGroupIds: Array<InputMaybe<Scalars['Long']>>;
};

export type SubjectGroupStudentMembershipType = {
  __typename?: 'SubjectGroupStudentMembershipType';
  blockId?: Maybe<Scalars['String']>;
  classGroupId?: Maybe<Scalars['Long']>;
  classGroupName?: Maybe<Scalars['String']>;
  type: SubjectGroupStudentMembershipTypeEnum;
};

export enum SubjectGroupStudentMembershipTypeEnum {
  Block = 'BLOCK',
  Core = 'CORE',
  Freeform = 'FREEFORM',
  Unknown = 'UNKNOWN'
}

export enum SubjectGroupType {
  SubjectGroup = 'SUBJECT_GROUP',
  SupportGroup = 'SUPPORT_GROUP'
}

export enum SubjectSource {
  Custom = 'CUSTOM',
  National = 'NATIONAL'
}

export enum SubjectUsage {
  Active = 'ACTIVE',
  All = 'ALL',
  Historic = 'HISTORIC'
}

export type Success = {
  __typename?: 'Success';
  success?: Maybe<Scalars['Boolean']>;
};

export type SyncRequest = {
  __typename?: 'SyncRequest';
  /** deep linked */
  createdBy: AuditPerson;
  createdByPartyId?: Maybe<Scalars['Long']>;
  createdByUserId: Scalars['Int'];
  failureReason?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  requestedOn: Scalars['DateTime'];
  /** deep linked */
  requester: Person;
  requesterPartyId: Scalars['Long'];
  syncRequestStatus: SyncRequestStatus;
};

export enum SyncRequestStatus {
  Error = 'ERROR',
  Fail = 'FAIL',
  InProgress = 'IN_PROGRESS',
  Success = 'SUCCESS'
}

export type SyncRequestsFilter = {
  from?: InputMaybe<Scalars['DateTime']>;
  id?: InputMaybe<Scalars['Int']>;
  to?: InputMaybe<Scalars['DateTime']>;
};

export type TtCloneTimetableInput = {
  readOnly?: InputMaybe<Scalars['Boolean']>;
  timetableId: Scalars['Int'];
};

/** ## Creates or replaces grid on calendar */
export type TtCreateTimetable = {
  blocksIds?: InputMaybe<Array<Scalars['String']>>;
  classGroupBlockLinks?: InputMaybe<Array<TtUpsertBlockClassGroupLink>>;
  classGroupsPartyIds?: InputMaybe<Array<Scalars['Long']>>;
  description?: InputMaybe<Scalars['String']>;
  grids?: InputMaybe<Array<InputMaybe<TtUpsertGrid>>>;
  isLiveTimetable?: InputMaybe<Scalars['Boolean']>;
  lessons?: InputMaybe<Array<TtUpsertLessons>>;
  name: Scalars['String'];
  subjectGroups?: InputMaybe<Array<TtUpsertTimetableGroups>>;
};

export type TtEditLessonInstance = {
  id?: InputMaybe<TtEditLessonPeriodInstanceId>;
  roomId?: InputMaybe<Scalars['Int']>;
  teachersPartyIds?: InputMaybe<Array<Scalars['Long']>>;
  timeslot?: InputMaybe<TtEditLessonInstanceTimeslot>;
};

export type TtEditLessonInstanceTimeslot = {
  dayIdx: Scalars['Int'];
  periodIdx: Scalars['Int'];
};

export type TtEditLessonPeriodInstanceId = {
  lessonIdx: Scalars['Int'];
  lessonInstanceIdx: Scalars['Int'];
  timetableGroupId: Scalars['Long'];
};

export type TtEditLessonPeriodInstanceWrapper = {
  allowClashes: Scalars['Boolean'];
  lessonsInstances: Array<TtEditLessonInstance>;
  timetableId: Scalars['Int'];
};

/** ## Creates or replaces grid on calendar */
export type TtGrid = {
  __typename?: 'TTGrid';
  /**  date grid is val from. null means the start of the calendar date */
  days?: Maybe<Array<Maybe<TtGridDay>>>;
  description?: Maybe<Scalars['String']>;
  idx: Scalars['Int'];
  name: Scalars['String'];
  timetableId: Scalars['Int'];
};

export type TtGridDay = {
  __typename?: 'TTGridDay';
  /**  iso day of week. 1 monday .. 7 sunday */
  dayOfWeek: Scalars['Int'];
  /**  the distinct number and order for the days */
  idx: Scalars['Int'];
  periods: Array<TtGridPeriod>;
};

export type TtGridFilter = {
  timetableId: Scalars['Int'];
};

export type TtGridPeriod = {
  __typename?: 'TTGridPeriod';
  endTime: Scalars['Time'];
  /**  the distinct number and order for the periods */
  idx: Scalars['Int'];
  /**  periods are sequential with no gapes between them */
  startTime: Scalars['Time'];
  type: TtGridPeriodType;
};

export enum TtGridPeriodType {
  Break = 'BREAK',
  Class = 'CLASS'
}

export enum TtGroupStudentMembershipTypeEnum {
  Block = 'BLOCK',
  Core = 'CORE',
  Freeform = 'FREEFORM',
  NoStudents = 'NO_STUDENTS'
}

/**  View all lesson individually. i.e. a lesson with spread 2 will com back as 2 individual lessons */
export type TtIndividualViewLesson = {
  __typename?: 'TTIndividualViewLesson';
  /**  the distinct number and order for the periods */
  id: TtIndividualViewLessonId;
  partyGroup: PartyGroup;
  room?: Maybe<Room>;
  roomId?: Maybe<Scalars['Int']>;
  roomState: RoomState;
  spread: Scalars['Int'];
  teacherIds: Array<Scalars['Long']>;
  teacherState: TeacherState;
  teachers: Array<Staff>;
  timeslotId?: Maybe<TtTimeslotId>;
  timeslotInfo?: Maybe<TtTimeslotInfo>;
};

export type TtIndividualViewLessonFilter = {
  lessonInstances?: InputMaybe<Array<TtEditLessonPeriodInstanceId>>;
  timeslots?: InputMaybe<Array<TtTimeslotIdInput>>;
  timetableGroupIds?: InputMaybe<Array<Scalars['Long']>>;
  timetableId: Scalars['Int'];
};

/**
 * type TTTimetableView {
 *     timetableId: Int! @NotNull
 *     lessons: [TTTimetableLesson!]!
 * }
 *  View lessons with Teaching Group Information etc
 * type TTTimetableLesson {
 *     # the distinct number and order for the periods
 *     id: TTIndividualViewLessonId! @NotNull
 *     partyGroup: PartyGroup! @NotNull
 *     gridIdx: Int! @NotNull
 *     dayIdx: Int! @NotNull
 *     periodIdx: Int! @NotNull
 *     roomId: Int
 *     room: Room
 *     teacherIds: [Long!]!
 *     teachers: [Staff!]!
 *     spread: Int!
 * }
 */
export type TtIndividualViewLessonId = {
  __typename?: 'TTIndividualViewLessonId';
  lessonIdx: Scalars['Int'];
  lessonInstanceIdx: Scalars['Int'];
  timetableGroupId: Scalars['Long'];
};

export type TtPublishDiff = {
  __typename?: 'TTPublishDiff';
  groupDiffs: Array<TtPublishDiffGroup>;
  lessonDiffs: Array<TtPublishDiffLesson>;
};

export type TtPublishDiffGroup = {
  __typename?: 'TTPublishDiffGroup';
  newGroup: Tt_Groups;
  oldGroup: Tt_Groups;
  teachersChanged: Scalars['Boolean'];
  type: Tt_DiffType;
};

export type TtPublishDiffLesson = {
  __typename?: 'TTPublishDiffLesson';
  newLesson: TtIndividualViewLesson;
  oldLesson: TtIndividualViewLesson;
  roomChanged: Scalars['Boolean'];
  teachersChanged: Scalars['Boolean'];
  timeslotChanged: Scalars['Boolean'];
  type: Tt_DiffType;
};

export type TtPublishTimetableInput = {
  /**  date from which the timetable is valid. Defaults to tomorrow. Must not be today or before */
  effectiveFromDate?: InputMaybe<Scalars['Date']>;
  /**  defaults to false. This will delete all existing timetable lessons in calendar and republish them */
  fullRepublish?: InputMaybe<Scalars['Boolean']>;
  /**  used to publish specific lessons. Will only publish lessons that are in this list and not update the publish stats */
  republishLessonsInstances?: InputMaybe<Array<TtEditLessonPeriodInstanceId>>;
  timetableId: Scalars['Int'];
};

export type TtResourceTimeslotView = {
  __typename?: 'TTResourceTimeslotView';
  lessons: Array<TtIndividualViewLesson>;
  timeslotIds?: Maybe<TtTimeslotId>;
  timeslots?: Maybe<TtTimeslotInfo>;
};

/**  View timetable resouces such as rooms , teachers and years */
export type TtResourceTimetableView = {
  __typename?: 'TTResourceTimetableView';
  timeslots: Array<TtResourceTimeslotView>;
};

export type TtResourceTimetableViewFilter = {
  partyIds: Array<Scalars['Long']>;
  roomIds: Array<Scalars['Int']>;
  timetableId: Scalars['Int'];
};

export type TtSwapRoomFilter = {
  gridIdx: Scalars['Int'];
  lessonToSwap: Array<TtEditLessonPeriodInstanceId>;
  timetableId: Scalars['Int'];
};

export type TtSwapRoomOptions = {
  __typename?: 'TTSwapRoomOptions';
  rooms: Array<TtSwapRoomRoomInfo>;
  timeslots: Array<TtTimeslot>;
};

/**  Lesson being held in room in the same order as the timeslots in TTSwapRoomView. If no lesson is held a null value is present */
export type TtSwapRoomRoomInfo = {
  __typename?: 'TTSwapRoomRoomInfo';
  lessonOnTimeslots: Array<Maybe<TtIndividualViewLesson>>;
  room: Room;
  roomId: Scalars['Int'];
};

export type TtSwapRoomsInput = {
  lessonInstanceId: TtEditLessonPeriodInstanceId;
  swapToRoomId: Scalars['Int'];
  timeslotId: TtTimeslotIdInput;
};

export type TtSwapTeacherFilter = {
  gridIdx: Scalars['Int'];
  lessonToSwap: Array<TtEditLessonPeriodInstanceId>;
  timetableId: Scalars['Int'];
};

export type TtSwapTeacherOptions = {
  __typename?: 'TTSwapTeacherOptions';
  teachers: Array<TtSwapTeacherTeacherInfo>;
  timeslots: Array<TtTimeslot>;
};

/**  Lesson being held in room in the same order as the timeslots in TTSwapRoomView. If no lesson is held a null value is present */
export type TtSwapTeacherTeacherInfo = {
  __typename?: 'TTSwapTeacherTeacherInfo';
  lessonOnTimeslots: Array<Maybe<TtIndividualViewLesson>>;
  staffId: Scalars['Long'];
  teacher: Staff;
};

export type TtSwapTeachersInput = {
  lessonInstanceId: TtEditLessonPeriodInstanceId;
  /**  the staff id of the teacher on the source lesson. This is used in the case that the source lesson has multiple teachers */
  swapFromStaffId: Scalars['Long'];
  /**  this teacher will now become the new teacher of the source lesson */
  swapToStaffId: Scalars['Long'];
  timeslotId: TtTimeslotIdInput;
};

export type TtSwapsInput = {
  roomsSwaps?: InputMaybe<Array<TtSwapRoomsInput>>;
  teacherSwaps?: InputMaybe<Array<TtSwapTeachersInput>>;
  timetableId: Scalars['Int'];
};

export type TtTimeslot = {
  __typename?: 'TTTimeslot';
  id: TtTimeslotId;
  info: TtTimeslotInfo;
};

export type TtTimeslotId = {
  __typename?: 'TTTimeslotId';
  dayIdx: Scalars['Int'];
  gridIdx: Scalars['Int'];
  periodIdx: Scalars['Int'];
};

export type TtTimeslotIdInput = {
  dayIdx: Scalars['Int'];
  gridIdx: Scalars['Int'];
  periodIdx: Scalars['Int'];
};

export type TtTimeslotInfo = {
  __typename?: 'TTTimeslotInfo';
  dayOfWeek: Scalars['Int'];
  endTime: Scalars['Time'];
  periodType: TtGridPeriodType;
  startTime: Scalars['Time'];
};

export type TtTimetable = {
  __typename?: 'TTTimetable';
  clonedAt?: Maybe<Scalars['DateTime']>;
  clonedFromId?: Maybe<Scalars['Int']>;
  clonedFromName?: Maybe<Scalars['Int']>;
  created: Scalars['DateTime'];
  liveStatus?: Maybe<Tt_LiveStatus>;
  name: Scalars['String'];
  readOnly: Scalars['Boolean'];
  readOnlyReplicaAtCreationId: Scalars['Int'];
  timetableId: Scalars['Int'];
  updatedAt: Scalars['DateTime'];
};

export type TtTimetableFilter = {
  /**  the live timetable in timetable edit with unpublished changed */
  liveTimetable?: InputMaybe<Scalars['Boolean']>;
  /**  the last published version of the timetable */
  publishedTimetable?: InputMaybe<Scalars['Boolean']>;
  timetableId?: InputMaybe<Scalars['Int']>;
};

export type TtUpsertBlockClassGroupLink = {
  blockId: Scalars['String'];
  classGroupPartyIds: Array<Scalars['Long']>;
};

export type TtUpsertGrid = {
  days?: InputMaybe<Array<InputMaybe<TtUpsertGridDay>>>;
  description?: InputMaybe<Scalars['String']>;
  idx: Scalars['Int'];
  name: Scalars['String'];
  timetableId: Scalars['Int'];
  /**  date grid is val from. null means the start of the calendar date */
  validFrom?: InputMaybe<Scalars['Date']>;
};

export type TtUpsertGridDay = {
  /**  iso day of week. 1 monday .. 7 sunday */
  dayOfWeek: Scalars['Int'];
  /**  the distinct number and order for the days */
  idx: Scalars['Int'];
  periods: Array<TtUpsertGridPeriod>;
};

export type TtUpsertGridPeriod = {
  endTime: Scalars['Time'];
  /**  the distinct number and order for the periods */
  idx: Scalars['Int'];
  /**  periods are sequential with no gapes between them */
  startTime: Scalars['Time'];
  type: TtGridPeriodType;
};

export type TtUpsertLessonPeriod = {
  dayIdx?: InputMaybe<Scalars['Int']>;
  lessonPeriodIdx: Scalars['Int'];
  periodIdx: Scalars['Int'];
  roomId?: InputMaybe<Scalars['Int']>;
  teachersPartyIds?: InputMaybe<Array<Scalars['Long']>>;
};

export type TtUpsertLessons = {
  lessonIdx: Scalars['Int'];
  periods?: InputMaybe<Array<TtUpsertLessonPeriod>>;
  spread: Scalars['Int'];
  subjectGroupPartyId: Scalars['Long'];
};

export type TtUpsertTimetableGroups = {
  blockId?: InputMaybe<Scalars['String']>;
  classGroupId?: InputMaybe<Scalars['Long']>;
  /**
   *  Whats the student membership makeup of the group if
   *  if CORE than the class group id must be provided
   *  if BLOCK than the block id must be provided
   *  if NO_STUDENTS than no class group or block id should be provided
   */
  membershipType: TtGroupStudentMembershipTypeEnum;
  teachersPartyIds: Array<Scalars['Long']>;
  /**  Can timetable different types of groups such as a subject group or a staff group for meetings */
  timetableGroupPartyId: Scalars['Long'];
};

export enum Tt_DiffType {
  Deleted = 'DELETED',
  New = 'NEW',
  Updated = 'UPDATED'
}

export type Tt_Groups = {
  __typename?: 'TT_Groups';
  lessons: Array<TtIndividualViewLesson>;
  partyGroup: PartyGroup;
  partyId: Scalars['Long'];
  studentMembershipType: TtGroupStudentMembershipTypeEnum;
  teachers: Array<Staff>;
  teachersIds: Array<Scalars['Long']>;
};

export type Tt_GroupsFilter = {
  partyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
  timetableId: Scalars['Int'];
};

export type Tt_LiveStatus = {
  __typename?: 'TT_LiveStatus';
  lastPublishedDate?: Maybe<Scalars['DateTime']>;
  lessonChanges: Scalars['Int'];
  publishDiff?: Maybe<TtPublishDiff>;
  publishHistory: Array<Tt_Published>;
  timetableGroupChanges: Scalars['Int'];
  timetableId: Scalars['Int'];
  totalChanges: Scalars['Int'];
};

export type Tt_PublishResult = {
  __typename?: 'TT_PublishResult';
  lessonsUpdated: Scalars['Int'];
  success: Scalars['Boolean'];
  teachingGroupsUpdated: Scalars['Int'];
};

export type Tt_Published = {
  __typename?: 'TT_Published';
  cloneId: Scalars['Int'];
  datetime: Scalars['DateTime'];
  lessonChanges: Scalars['Int'];
  readOnlyReplicaOfTimetableCreationBeforeChanges: Scalars['Int'];
  timetableGroupChanges: Scalars['Int'];
  timetableId: Scalars['Int'];
};

export type Tt_Reset = {
  groups?: InputMaybe<Array<Tt_ResetGroup>>;
  lessons?: InputMaybe<Array<Tt_ResetLesson>>;
  timetableId: Scalars['Int'];
};

export type Tt_ResetGroup = {
  timetableGroupPartyId: Scalars['Long'];
};

export type Tt_ResetLesson = {
  lessonId: TtEditLessonPeriodInstanceId;
};

export type Tt_TeacherTimetableSummary = {
  __typename?: 'TT_TeacherTimetableSummary';
  fulltimePeriods: Scalars['Int'];
  staffId: Scalars['Long'];
};

export type Tt_TeacherTimetableSummaryFilter = {
  staffIds?: InputMaybe<Array<Scalars['Long']>>;
  timetableFilter: TtTimetableFilter;
};

export type Tt_UpdateTimetableGroupInput = {
  timetableId: Scalars['Int'];
  /**  defaults to false. This will delete all existing timetable lessons in calendar and republish them */
  updates: Array<Tt_UpdateTimetableGroupRowInput>;
};

export type Tt_UpdateTimetableGroupRowInput = {
  teachersPartyIds: Array<Scalars['Long']>;
  timetableGroupPartyId: Scalars['Long'];
};

export enum TargetStatus {
  Achieved = 'ACHIEVED',
  InProgress = 'IN_PROGRESS',
  NotAchieved = 'NOT_ACHIEVED',
  NotApplicable = 'NOT_APPLICABLE'
}

export enum TeacherState {
  Inherited = 'INHERITED',
  Pinned = 'PINNED',
  SetBySolver = 'SET_BY_SOLVER',
  SetByUser = 'SET_BY_USER'
}

export type TemporaryDownload = {
  __typename?: 'TemporaryDownload';
  html?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type Tenant = {
  __typename?: 'Tenant';
  imgUrl?: Maybe<Scalars['String']>;
  location?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  tenant: Scalars['Int'];
  type?: Maybe<Scalars['String']>;
};

export type TenantsFilter = {
  tenants?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export type TranslationInput = {
  locale?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

export type Trustee = {
  __typename?: 'Trustee';
  addressLine1?: Maybe<Scalars['String']>;
  addressLine2?: Maybe<Scalars['String']>;
  addressLine3?: Maybe<Scalars['String']>;
  addressLine4?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['Date']>;
  forename?: Maybe<Scalars['String']>;
  startDate?: Maybe<Scalars['Date']>;
  surname?: Maybe<Scalars['String']>;
  trusteeId?: Maybe<Scalars['Int']>;
};

export type Tt_AddLessonFilter = {
  timeslot: TtTimeslotIdInput;
  /**
   *  todo optional filter to which is used to set the context from which you are ading a lesson. this should be party id
   *  if 'Duty' is your context then it will return only duty groups. 6th year will return 6th year groups. A staff id will return all groups
   */
  timetableGroupIds?: InputMaybe<Array<Scalars['Long']>>;
  timetableId: Scalars['Int'];
};

export type Tt_AddLessonInput = {
  dayIdx: Scalars['Int'];
  gridIdx: Scalars['Int'];
  periodIdx: Scalars['Int'];
  roomId?: InputMaybe<Scalars['Int']>;
  teachersPartyIds?: InputMaybe<Array<Scalars['Long']>>;
  timetableGroupId: Scalars['Long'];
  timetableId: Scalars['Int'];
};

export type Tt_AddLessonOptions = {
  __typename?: 'Tt_AddLessonOptions';
  freeRoomIds: Array<Scalars['Int']>;
  freeRooms: Array<Room>;
  freeStaff: Array<Staff>;
  freeStaffIds: Array<Scalars['Long']>;
  freeTimetableGroupIds: Array<Scalars['Long']>;
  freeTimetableGroups: Array<PartyGroup>;
};

export type Tt_EditLessonFilter = {
  lessonInstance: TtEditLessonPeriodInstanceId;
  timetableId: Scalars['Int'];
};

export type Tt_EditLessonOptions = {
  __typename?: 'Tt_EditLessonOptions';
  freeRoomIds: Array<Scalars['Int']>;
  freeRooms: Array<Room>;
  freeStaff: Array<Staff>;
  freeStaffIds: Array<Scalars['Long']>;
};

export type Tt_RemoveLessonInput = {
  lessonIdx: Scalars['Int'];
  lessonInstanceIdx: Scalars['Int'];
  timetableGroupId: Scalars['Long'];
  timetableId: Scalars['Int'];
};

export type Tt_UpsertSubjectGroup = {
  blockId?: InputMaybe<Scalars['String']>;
  classGroupId?: InputMaybe<Scalars['Long']>;
  id?: InputMaybe<Scalars['Long']>;
  membershipType: TtGroupStudentMembershipTypeEnum;
  name: Scalars['String'];
  subjectGroupType: SubjectGroupType;
  subjectIds?: InputMaybe<Array<Scalars['Int']>>;
  teachers?: InputMaybe<Array<Scalars['Long']>>;
  timetableId: Scalars['Int'];
};

export enum TuslaCode {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F',
  G = 'G',
  H = 'H'
}

export type UnreadCount = {
  __typename?: 'UnreadCount';
  count: Scalars['Int'];
  labelId: Scalars['Long'];
  labelType: LabelType;
};

export type UnreadCountFilter = {
  personPartyId: Scalars['Long'];
};

export type UpdateClassGroupGroupInput = {
  classGroupPartyId: Scalars['Long'];
  name?: InputMaybe<Scalars['String']>;
  tutor?: InputMaybe<Scalars['Long']>;
};

export type UpdateStaffInput = {
  availableForSubstitution?: InputMaybe<Scalars['Boolean']>;
  availableForSupportClasses?: InputMaybe<Scalars['Boolean']>;
  availableForTeaching?: InputMaybe<Scalars['Boolean']>;
  carRegistrationNumber?: InputMaybe<Scalars['String']>;
  displayCode?: InputMaybe<Scalars['String']>;
  employmentCapacity?: InputMaybe<Scalars['String']>;
  gender?: InputMaybe<Gender>;
  includeDtrReturns?: InputMaybe<Scalars['Boolean']>;
  jobSharing?: InputMaybe<Scalars['Boolean']>;
  makeAndModel?: InputMaybe<Scalars['String']>;
  noLongerStaffMember?: InputMaybe<Scalars['Boolean']>;
  otherSchool1?: InputMaybe<Scalars['String']>;
  otherSchool2?: InputMaybe<Scalars['String']>;
  parking?: InputMaybe<Scalars['String']>;
  payrollNumber?: InputMaybe<Scalars['String']>;
  position?: InputMaybe<Scalars['String']>;
  ppsNumber?: InputMaybe<Scalars['String']>;
  previousSchool1?: InputMaybe<Scalars['String']>;
  previousSchool2?: InputMaybe<Scalars['String']>;
  primaryEmail?: InputMaybe<Scalars['String']>;
  qualifications?: InputMaybe<Scalars['String']>;
  qualifications2?: InputMaybe<Scalars['String']>;
  qualifications3?: InputMaybe<Scalars['String']>;
  qualifications4?: InputMaybe<Scalars['String']>;
  staffPartyId: Scalars['Long'];
  staffPost?: InputMaybe<Scalars['Int']>;
  teacherCouncilNumber?: InputMaybe<Scalars['String']>;
  teacherReferenceNumber?: InputMaybe<Scalars['String']>;
};

export type UpdateStudentContactInput = {
  contactPartyId: Scalars['Long'];
  primaryEmail?: InputMaybe<Scalars['String']>;
};

export type UpdateStudentInput = {
  avatarUrl?: InputMaybe<Scalars['String']>;
  dateOfLeaving?: InputMaybe<Scalars['Date']>;
  examNumber?: InputMaybe<Scalars['String']>;
  guardianshipNote?: InputMaybe<Scalars['String']>;
  leavingReason?: InputMaybe<StudentLeavingReason>;
  leftEarly?: InputMaybe<Scalars['Boolean']>;
  lockerNumber?: InputMaybe<Scalars['String']>;
  preferredFirstName?: InputMaybe<Scalars['String']>;
  preferredLastName?: InputMaybe<Scalars['String']>;
  primaryEmail?: InputMaybe<Scalars['String']>;
  primaryPhoneNumber?: InputMaybe<Scalars['String']>;
  studentPartyId: Scalars['Long'];
};

export type UpdateSubjectGroupInput = {
  irePP?: InputMaybe<UpdateSubjectGroupIrePpInput>;
  name?: InputMaybe<Scalars['String']>;
  subjectGroupPartyId: Scalars['Long'];
  subjectIds?: InputMaybe<Array<Scalars['Int']>>;
  teachers?: InputMaybe<Array<UpdateSubjectGroupTeachersInput>>;
};

export type UpdateSubjectGroupIrePpInput = {
  level?: InputMaybe<StudyLevel>;
};

export type UpdateSubjectGroupTeachersInput = {
  roles: Array<StaffGroupMembershipRoles>;
  staffPartyId: Scalars['Long'];
};

export type UpdateYearGroupEnrollmentInput = {
  yearGroupEnrollmentPartyId: Scalars['Long'];
  yearGroupLead?: InputMaybe<Scalars['Long']>;
};

export type UpsertBlockInput = {
  blockId: Scalars['String'];
  description?: InputMaybe<Scalars['String']>;
  generalGroupIds: Array<Scalars['Long']>;
  name: Scalars['String'];
};

/** ## Creates or replaces grid on calendar */
export type UpsertCalendarGrid = {
  days?: InputMaybe<Array<InputMaybe<UpsertGridDay>>>;
  idx: Scalars['Int'];
  /**  date grid is val from. null means the start of the calendar date */
  validFrom?: InputMaybe<Scalars['Date']>;
};

export type UpsertGridDay = {
  /**  iso day of week. 1 monday .. 7 sunday */
  dayOfWeek: Scalars['Int'];
  /**  the distinct number and order for the days */
  idx: Scalars['Int'];
  periods: Array<UpsertGridPeriod>;
};

export type UpsertGridPeriod = {
  endTime: Scalars['Time'];
  /**  the distinct number and order for the periods */
  idx: Scalars['Int'];
  /**  periods are sequential with no gapes between them */
  startTime: Scalars['Time'];
  type: CalendarGridPeriodType;
};

export type UpsertRoomInput = {
  capacity?: InputMaybe<Scalars['Int']>;
  description?: InputMaybe<Scalars['String']>;
  disabled?: InputMaybe<Scalars['Boolean']>;
  externalSystemId?: InputMaybe<Scalars['String']>;
  includeInTimetable?: InputMaybe<Scalars['Boolean']>;
  location?: InputMaybe<Scalars['String']>;
  /** mandatory on create */
  name?: InputMaybe<Scalars['String']>;
  pools?: InputMaybe<Array<Scalars['String']>>;
  roomId?: InputMaybe<Scalars['Int']>;
};

export type UpsertStaffInput = {
  addresses?: InputMaybe<Array<InputMaybe<InputAddress>>>;
  availableForSubstitution?: InputMaybe<Scalars['Boolean']>;
  availableForSupportClasses?: InputMaybe<Scalars['Boolean']>;
  availableForTeaching?: InputMaybe<Scalars['Boolean']>;
  carRegistrationNumber?: InputMaybe<Scalars['String']>;
  competencies?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  dateOfBirth?: InputMaybe<Scalars['Date']>;
  displayCode?: InputMaybe<Scalars['String']>;
  emails?: InputMaybe<Array<InputMaybe<InputEmailAddress>>>;
  emergencyContact?: InputMaybe<InputStaffEmergencyContact>;
  employmentCapacity?: InputMaybe<Scalars['String']>;
  endDate?: InputMaybe<Scalars['Date']>;
  externalSystemInfo?: InputMaybe<ExternalSystemInfo>;
  firstName?: InputMaybe<Scalars['String']>;
  gender?: InputMaybe<Gender>;
  id?: InputMaybe<Scalars['Long']>;
  jobSharing?: InputMaybe<Scalars['Boolean']>;
  lastName?: InputMaybe<Scalars['String']>;
  makeAndModel?: InputMaybe<Scalars['String']>;
  middleName?: InputMaybe<Scalars['String']>;
  nextOfKin?: InputMaybe<InputNextOfKin>;
  noLongerStaff?: InputMaybe<Scalars['Boolean']>;
  parking?: InputMaybe<Scalars['String']>;
  payrollNumber?: InputMaybe<Scalars['String']>;
  personalInformationId?: InputMaybe<Scalars['Int']>;
  phoneNumbers?: InputMaybe<Array<InputMaybe<InputPhoneNumber>>>;
  position?: InputMaybe<Scalars['String']>;
  qualifications?: InputMaybe<Scalars['String']>;
  staffIre?: InputMaybe<UpsertStaffIreInput>;
  startDate?: InputMaybe<Scalars['Date']>;
  titleId?: InputMaybe<Scalars['Int']>;
};

export type UpsertStaffIreInput = {
  countryOfBirth?: InputMaybe<Scalars['String']>;
  includeDtrReturns?: InputMaybe<Scalars['Boolean']>;
  otherSchool1?: InputMaybe<Scalars['String']>;
  otherSchool2?: InputMaybe<Scalars['String']>;
  position?: InputMaybe<Scalars['String']>;
  pps?: InputMaybe<Scalars['String']>;
  previousSchool1?: InputMaybe<Scalars['String']>;
  previousSchool2?: InputMaybe<Scalars['String']>;
  qualifications2?: InputMaybe<Scalars['String']>;
  qualifications3?: InputMaybe<Scalars['String']>;
  qualifications4?: InputMaybe<Scalars['String']>;
  religion?: InputMaybe<Scalars['String']>;
  staffPost?: InputMaybe<Scalars['Int']>;
  teacherCouncilNumber?: InputMaybe<Scalars['String']>;
  teacherReferenceNumber?: InputMaybe<Scalars['String']>;
};

export type UpsertStudentContactInput = {
  addresses?: InputMaybe<Array<InputMaybe<InputAddress>>>;
  contactPartyId?: InputMaybe<Scalars['Long']>;
  emails?: InputMaybe<Array<InputMaybe<InputEmailAddress>>>;
  occupation?: InputMaybe<Scalars['String']>;
  personal: PersonalInformationInput;
  phoneNumbers?: InputMaybe<Array<InputMaybe<InputPhoneNumber>>>;
  requiresInterpreter?: InputMaybe<Scalars['Boolean']>;
  spokenLanguages?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  studentRelationships: Array<InputMaybe<UpsertStudentContactRelationshipInfoInput>>;
  titleId?: InputMaybe<Scalars['Int']>;
};

export type UpsertStudentContactRelationshipInfoInput = {
  allowAccessToStudentData: Scalars['Boolean'];
  allowedToContact: Scalars['Boolean'];
  includeInSms: Scalars['Boolean'];
  includeInTmail: Scalars['Boolean'];
  legalGuardian: Scalars['Boolean'];
  pickupRights: Scalars['Boolean'];
  priority: Scalars['Int'];
  relationshipType: StudentContactType;
  studentPartyId: Scalars['Long'];
};

export type UpsertStudentMedicalConditionEquipmentInput = {
  expiryDate?: InputMaybe<Scalars['Date']>;
  firstRespondersIds?: InputMaybe<Array<Scalars['Long']>>;
  id?: InputMaybe<Scalars['Int']>;
  location?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  notes?: InputMaybe<Scalars['String']>;
};

export type UpsertStudentMedicalConditionInput = {
  description?: InputMaybe<Scalars['String']>;
  emergencyPlan?: InputMaybe<Scalars['String']>;
  equipment?: InputMaybe<Array<UpsertStudentMedicalConditionEquipmentInput>>;
  id?: InputMaybe<Scalars['Int']>;
  name: Scalars['String'];
  studentPartyId: Scalars['Long'];
};

export type UpsertStudentMedicalContactInput = {
  additionalPhone?: InputMaybe<Scalars['String']>;
  addressLine1?: InputMaybe<Scalars['String']>;
  addressLine2?: InputMaybe<Scalars['String']>;
  addressLine3?: InputMaybe<Scalars['String']>;
  county?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Int']>;
  lastName?: InputMaybe<Scalars['String']>;
  notes?: InputMaybe<Scalars['String']>;
  occupation?: InputMaybe<Scalars['String']>;
  personalTitleId?: InputMaybe<Scalars['Int']>;
  postcode?: InputMaybe<Scalars['String']>;
  primaryPhone?: InputMaybe<Scalars['String']>;
  studentPartyId: Scalars['Long'];
};

export type UpsertSubject = {
  colour?: InputMaybe<Colour>;
  subjectId?: InputMaybe<Scalars['Int']>;
};

export type UserAccess = {
  __typename?: 'UserAccess';
  contactStudents?: Maybe<Array<Maybe<Person>>>;
  invitationId?: Maybe<Scalars['Long']>;
  invitedOn?: Maybe<Scalars['DateTime']>;
  invitingPersonPartyId?: Maybe<Scalars['Long']>;
  invitingPersonalInfo?: Maybe<PersonalInformation>;
  mobileLastLogin?: Maybe<Scalars['DateTime']>;
  personPartyId: Scalars['Long'];
  personalInfo: PersonalInformation;
  status?: Maybe<UserAccessStatus>;
  webLastLogin?: Maybe<Scalars['DateTime']>;
  yearGroup?: Maybe<YearGroupEnrollment>;
  yearGroupContacts?: Maybe<Array<Maybe<YearGroupEnrollment>>>;
};

export type UserAccessFilter = {
  partyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
  userType: AccessUserType;
};

export enum UserAccessStatus {
  Active = 'ACTIVE',
  Disabled = 'DISABLED',
  InviteSent = 'INVITE_SENT'
}

export type UserAccessValidation = {
  __typename?: 'UserAccessValidation';
  associatedUsers: Array<Scalars['String']>;
  message: Scalars['String'];
};

export type UserPermission = {
  __typename?: 'UserPermission';
  id: Scalars['String'];
  permissionType?: Maybe<PermissionType>;
};

export enum UserType {
  Admin = 'ADMIN',
  Contact = 'CONTACT',
  External = 'EXTERNAL',
  Student = 'STUDENT',
  Teacher = 'TEACHER',
  ThirdParty = 'THIRD_PARTY',
  Tyro = 'TYRO'
}

export enum ValidFor {
  All = 'ALL',
  Sibling = 'SIBLING'
}

export type Wellbeing_DeleteStudentAenInput = {
  id: Scalars['Int'];
  studentPartyId: Scalars['Long'];
};

export type Wellbeing_StudentAen = {
  __typename?: 'Wellbeing_StudentAen';
  entries: Array<Wellbeing_StudentAenEntry>;
  student?: Maybe<Student>;
  studentPartyId: Scalars['Long'];
};

export type Wellbeing_StudentAenEntry = {
  __typename?: 'Wellbeing_StudentAenEntry';
  contact?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['Date']>;
  id: Scalars['Int'];
  note?: Maybe<Scalars['String']>;
  provision?: Maybe<Scalars['String']>;
  snaSupport?: Maybe<Scalars['String']>;
  startDate?: Maybe<Scalars['Date']>;
  studentPartyId: Scalars['Long'];
  type?: Maybe<Scalars['String']>;
  typeNote?: Maybe<Scalars['String']>;
};

export type Wellbeing_UpsertStudentAenInput = {
  contact?: InputMaybe<Scalars['String']>;
  endDate?: InputMaybe<Scalars['Date']>;
  id?: InputMaybe<Scalars['Int']>;
  note?: InputMaybe<Scalars['String']>;
  provision?: InputMaybe<Scalars['String']>;
  snaSupport?: InputMaybe<Scalars['String']>;
  startDate?: InputMaybe<Scalars['Date']>;
  studentPartyId: Scalars['Long'];
  type?: InputMaybe<Scalars['String']>;
  typeNote?: InputMaybe<Scalars['String']>;
};

export type WithdrawParentalAttendanceRequest = {
  id: Scalars['Long'];
};

export type XeroContact = {
  __typename?: 'XeroContact';
  smsCredit: Scalars['Float'];
  xeroContactId: Scalars['String'];
};

export type XeroItem = {
  __typename?: 'XeroItem';
  code?: Maybe<Scalars['String']>;
  cost?: Maybe<Scalars['BigDecimal']>;
};

export type YearGroup = {
  __typename?: 'YearGroup';
  description?: Maybe<Scalars['String']>;
  descriptionTextId?: Maybe<Scalars['Int']>;
  name: Scalars['String'];
  nameTextId: Scalars['Int'];
  nationalCode: Scalars['String'];
  shortName: Scalars['String'];
  shortNameTextId: Scalars['Int'];
  yearGroupId: Scalars['Int'];
};

export type YearGroupEnrollment = Party & PartyGroup & {
  __typename?: 'YearGroupEnrollment';
  academicNamespaceId: Scalars['Int'];
  avatarUrl?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  includeInTimetable?: Maybe<Scalars['Boolean']>;
  name: Scalars['String'];
  nationalCode: Scalars['String'];
  partyId: Scalars['Long'];
  shortName: Scalars['String'];
  studentMembers: Group;
  students: Array<Student>;
  yearGroupEnrollmentPartyId: Scalars['Long'];
  yearGroupId: Scalars['Int'];
  yearGroupLeads: Array<Person>;
};

export type YearGroupEnrollmentFilter = {
  academicNamespaceIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  yearGroupEnrollmentPartyId?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
  yearGroupIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export type YearGroupFilter = {
  years?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export enum Sdsd {
  Term = 'TERM'
}

export type SearchQueryQueryVariables = Exact<{
  filter?: InputMaybe<SearchFilter>;
}>;


export type SearchQueryQuery = { __typename?: 'Query', search_search: Array<{ __typename?: 'Search', partyId: number, type: SearchType, text: string, avatarUrl?: string | null, meta: { __typename?: 'SearchMeta', studentPartyId?: number | null } }> };

export type AssessmentSubjectGroupsQueryVariables = Exact<{
  filter?: InputMaybe<AssessmentSubjectGroupsFilter>;
}>;


export type AssessmentSubjectGroupsQuery = { __typename?: 'Query', assessment_assessmentSubjectGroups?: Array<{ __typename?: 'AssessmentSubjectGroup', resultsTotal: number, resultsEntered: number, commentsEntered: number, commentsTotal: number, subjectGroup: { __typename?: 'SubjectGroup', partyId: number, name: string, subjects: Array<{ __typename?: 'Subject', name: string }>, staff: Array<{ __typename?: 'Person', firstName?: string | null, lastName?: string | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null }>, yearGroups: Array<{ __typename?: 'YearGroupEnrollment', yearGroupId: number, name: string }> } }> | null };

export type AssessmentsListQueryVariables = Exact<{
  filter?: InputMaybe<AssessmentFilter>;
}>;


export type AssessmentsListQuery = { __typename?: 'Query', assessment_assessment?: Array<{ __typename?: 'Assessment', id: number, name: string, assessmentType: AssessmentType, academicNamespaceId: number, publish: boolean, startDate: string, endDate: string, years?: Array<{ __typename?: 'YearGroup', yearGroupId: number, name: string }> | null, createdBy: { __typename?: 'Person', type?: PartyPersonType | null, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null } }> | null };

export type AssessmentQueryVariables = Exact<{
  filter?: InputMaybe<AssessmentFilter>;
}>;


export type AssessmentQuery = { __typename?: 'Query', assessment_assessment?: Array<{ __typename?: 'Assessment', id: number, name: string, assessmentType: AssessmentType, academicNamespaceId: number, publish: boolean, createdOn: string, gradeType?: GradeType | null, passFailThreshold?: number | null, captureTarget: boolean, commentType: CommentType, commentLength?: number | null, capturePrincipalComment: boolean, captureYearHeadComment: boolean, captureHouseMasterComment: boolean, publishLearner: boolean, startDate: string, endDate: string, captureTutorComment: boolean, years?: Array<{ __typename?: 'YearGroup', yearGroupId: number, name: string }> | null, gradeSets?: Array<{ __typename?: 'AssessmentGradeSet', gradeSetId: number, gradeSetName?: string | null }> | null, commentBank?: { __typename?: 'AssessmentCommentBank', commentBankId: number, commentBankName?: string | null } | null, extraFields?: Array<{ __typename?: 'AssessmentExtraField', id: number, name: string, assessmentId: number, extraFieldType: ExtraFieldType, gradeSetId?: number | null, commentBankId?: number | null, commentBankName?: string | null, selectOptions?: Array<string> | null, commentLength?: number | null }> | null, createdBy: { __typename?: 'Person', type?: PartyPersonType | null, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null } }> | null };

export type CommentBankAssessmentQueryVariables = Exact<{
  filter?: InputMaybe<CommentBankFilter>;
}>;


export type CommentBankAssessmentQuery = { __typename?: 'Query', assessment_commentBank?: Array<{ __typename?: 'CommentBank', id: number, name: string }> | null };

export type CommentBanksWithCommentsQueryVariables = Exact<{
  filter?: InputMaybe<CommentBankFilter>;
}>;


export type CommentBanksWithCommentsQuery = { __typename?: 'Query', assessment_commentBank?: Array<{ __typename?: 'CommentBank', id: number, name: string, comments?: Array<{ __typename?: 'Comment', id: number, comment: string, active: boolean }> | null }> | null };

export type SaveAssessmentMutationVariables = Exact<{
  input?: InputMaybe<SaveAssessmentInput>;
}>;


export type SaveAssessmentMutation = { __typename?: 'Mutation', assessment_saveAssessment?: { __typename?: 'Assessment', name: string, startDate: string, endDate: string, years?: Array<{ __typename?: 'YearGroup', name: string }> | null } | null };

export type DashboardAssessmentQueryVariables = Exact<{
  filter?: InputMaybe<DashboardAssessmentFilter>;
}>;


export type DashboardAssessmentQuery = { __typename?: 'Query', assessment_dashboardAssessment?: Array<{ __typename?: 'DashboardAssessment', id: number, name: string, description?: string | null, assessmentType: AssessmentType, startDate: string, endDate: string, results?: Array<{ __typename?: 'DashboardAssessmentResult', id: number, subject: string, result?: number | null, grade?: string | null, studyLevel?: StudyLevel | null }> | null }> | null };

export type Assessment_CalculateGradeQueryVariables = Exact<{
  filter?: InputMaybe<CalculateGradeFilter>;
}>;


export type Assessment_CalculateGradeQuery = { __typename?: 'Query', assessment_calculateGrade: { __typename?: 'CalculatedGrade', grade?: string | null } };

export type Assessment_AssessmentResultQueryVariables = Exact<{
  filter?: InputMaybe<AssessmentResultFilter>;
}>;


export type Assessment_AssessmentResultQuery = { __typename?: 'Query', assessment_assessmentResult?: Array<{ __typename?: 'AssessmentResult', id?: number | null, assessmentId?: number | null, studentPartyId: number, studentClassGroup: string, studentStudyLevel?: StudyLevel | null, result?: number | null, targetResult?: number | null, gradeResult?: string | null, gradeNameTextId?: number | null, targetGradeResult?: string | null, targetGradeNameTextId?: number | null, student: { __typename?: 'Person', firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null }, studentProgramme?: { __typename?: 'Programme', shortName?: string | null } | null, subjectGroup: { __typename?: 'SubjectGroup', partyId: number, name: string }, teacherComment?: { __typename?: 'AssessmentComment', id: number, assessmentId: number, studentPartyId: number, comment?: string | null, commentBankCommentId?: number | null, commenterUserType: CommenterUserType, commenterPartyId: number, subjectGroupPartyId: number } | null, extraFields?: Array<{ __typename?: 'ResultExtraField', id: number, extraFieldType: ExtraFieldType, assessmentResultId: number, assessmentExtraFieldId: number, result?: string | null, gradeSetGradeId?: number | null, gradeNameTextId?: number | null, commentBankCommentId?: number | null }> | null }> | null };

export type Assessment_SaveAssessmentResultsMutationVariables = Exact<{
  input?: InputMaybe<Array<SaveAssessmentResultInput> | SaveAssessmentResultInput>;
}>;


export type Assessment_SaveAssessmentResultsMutation = { __typename?: 'Mutation', assessment_saveAssessmentResults?: Array<{ __typename?: 'AssessmentResult', id?: number | null }> | null };

export type Attendance_ParentalAttendanceRequestsQueryVariables = Exact<{
  filter?: InputMaybe<ParentalAttendanceRequestFilter>;
}>;


export type Attendance_ParentalAttendanceRequestsQuery = { __typename?: 'Query', attendance_parentalAttendanceRequests: Array<{ __typename?: 'ParentalAttendanceRequest', id: number, adminNote?: string | null, approvedByPartyId?: number | null, attendanceCodeId: number, contactPartyId: number, from: string, parentNote: string, requestType: ParentalAttendanceRequestType, status: ParentalAttendanceRequestStatus, studentPartyId: number, to: string, createdOn: string, attendanceCode: { __typename?: 'AttendanceCode', id: number, code?: TuslaCode | null, name: string, description?: string | null }, approvedBy?: { __typename?: 'Person', firstName?: string | null, lastName?: string | null } | null, classGroup?: { __typename?: 'GeneralGroup', name: string } | null, contact?: { __typename?: 'StudentContact', person: { __typename?: 'Person', avatarUrl?: string | null, firstName?: string | null, lastName?: string | null }, relationships?: Array<{ __typename?: 'StudentContactRelationshipInfo', relationshipType: StudentContactType, studentPartyId: number } | null> | null } | null, student: { __typename?: 'Person', avatarUrl?: string | null, firstName?: string | null, lastName?: string | null } }> };

export type Attendance_SaveParentalAttendanceRequestMutationVariables = Exact<{
  input?: InputMaybe<Array<InputMaybe<SaveParentalAttendanceRequest>> | InputMaybe<SaveParentalAttendanceRequest>>;
}>;


export type Attendance_SaveParentalAttendanceRequestMutation = { __typename?: 'Mutation', attendance_saveParentalAttendanceRequest: Array<{ __typename?: 'ParentalAttendanceRequest', id: number }> };

export type Attendance_WithdrawParentalAttendanceRequestMutationVariables = Exact<{
  input?: InputMaybe<WithdrawParentalAttendanceRequest>;
}>;


export type Attendance_WithdrawParentalAttendanceRequestMutation = { __typename?: 'Mutation', attendance_withdrawParentalAttendanceRequest?: { __typename?: 'Success', success?: boolean | null } | null };

export type Attendance_AttendanceCodesQueryVariables = Exact<{
  filter?: InputMaybe<AttendanceCodeFilter>;
}>;


export type Attendance_AttendanceCodesQuery = { __typename?: 'Query', attendance_attendanceCodes: Array<{ __typename?: 'AttendanceCode', id: number, name: string, description?: string | null, code?: TuslaCode | null, active: boolean, visibleForTeacher: boolean, visibleForContact: boolean, nameTextId?: number | null, codeType: AttendanceCodeType, sessionCodeType: AttendanceCodeType }> };

export type Attendance_SaveAttendanceCodeMutationVariables = Exact<{
  input?: InputMaybe<Array<InputMaybe<SaveAttendanceCodeInput>> | InputMaybe<SaveAttendanceCodeInput>>;
}>;


export type Attendance_SaveAttendanceCodeMutation = { __typename?: 'Mutation', attendance_saveAttendanceCode: Array<{ __typename?: 'AttendanceCode', id: number }> };

export type Attendance_SaveEventAttendanceMutationVariables = Exact<{
  input?: InputMaybe<Array<InputMaybe<SaveEventAttendanceInput>> | InputMaybe<SaveEventAttendanceInput>>;
}>;


export type Attendance_SaveEventAttendanceMutation = { __typename?: 'Mutation', attendance_saveEventAttendance: Array<{ __typename?: 'EventAttendance', id: number, eventId: number, attendanceCodeId: number, personPartyId: number, date: string }> };

export type Attendance_BulkAttendanceActionsQueryVariables = Exact<{
  filter: Attendance_BulkAttendanceActionFilter;
}>;


export type Attendance_BulkAttendanceActionsQuery = { __typename?: 'Query', attendance_bulkAttendanceActions: Array<{ __typename?: 'Attendance_BulkAttendanceAction', id: number, attendanceForPartyIds: Array<number>, attendanceCodeId: number, startDate: string, endDate?: string | null, leavesAt: string, returnsAt?: string | null, partial: boolean, note?: string | null, createdOn: string, parties: Array<{ __typename: 'GeneralGroup', partyId: number, generalGroupType: GeneralGroupType, name: string, classGroupInfo?: { __typename: 'ClassGroupInfo' } | null } | { __typename?: 'ProgrammeStageEnrollment' } | { __typename: 'Staff', person: { __typename?: 'Person', firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null } } | { __typename: 'Student', person: { __typename?: 'Person', firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null } } | { __typename: 'StudentContact', person: { __typename?: 'Person', firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null } } | { __typename: 'SubjectGroup', partyId: number, actualName: string, name: string, avatarUrl?: string | null } | { __typename?: 'YearGroupEnrollment' } | null>, attendanceCode: { __typename?: 'AttendanceCode', id: number, name: string, description?: string | null, code?: TuslaCode | null, active: boolean, visibleForTeacher: boolean, visibleForContact: boolean, nameTextId?: number | null, descriptionTextId?: number | null, codeType: AttendanceCodeType, sessionCodeType: AttendanceCodeType, custom: boolean }, createdBy: { __typename?: 'AuditPerson', userId?: number | null, partyId?: number | null, person?: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null } | null } }> };

export type Attendance_SaveBulkAttendanceMutationVariables = Exact<{
  input?: InputMaybe<Attendance_SaveBulkAttendanceInput>;
}>;


export type Attendance_SaveBulkAttendanceMutation = { __typename?: 'Mutation', attendance_saveBulkAttendance?: { __typename?: 'Success', success?: boolean | null } | null };

export type Attendance_CalendarAttendanceQueryVariables = Exact<{
  filter?: InputMaybe<CalendarAttendanceFilter>;
}>;


export type Attendance_CalendarAttendanceQuery = { __typename?: 'Query', attendance_calendarAttendance: { __typename?: 'CalendarAttendance', totalPresent: number, totalLate: number, totalAbsent: number, totalUnexplained: number, totalNotTaken: number, attendances: Array<{ __typename?: 'CalendarAttendanceDay', date: string, status: AttendanceCodeType }> } };

export type Calendar_CalendarDayBellTimesQueryVariables = Exact<{
  filter?: InputMaybe<CalendarDayBellTimeFilter>;
}>;


export type Calendar_CalendarDayBellTimesQuery = { __typename?: 'Query', calendar_calendarDayBellTimes: Array<{ __typename?: 'CalendarDayBellTime', date: string, bellTimeIds?: Array<number> | null, bellTimes?: Array<{ __typename?: 'Calendar_BellTime', id: number, time: string, name?: string | null }> | null }> };

export type Calendar_CalendarInformationQueryVariables = Exact<{
  filter?: InputMaybe<CalendarEventFilter>;
}>;


export type Calendar_CalendarInformationQuery = { __typename?: 'Query', calendar_calendarEvents?: { __typename?: 'ResourceCalendarWrapper', resources: Array<{ __typename?: 'PartyCalendar', events: Array<{ __typename?: 'CalendarEvent', eventId: number, startTime: string, endTime: string, type: CalendarEventType, colour?: Colour | null, name: string, lessonInfo?: { __typename?: 'CalendarEventLessonRaw', subjectGroupId: number } | null, extensions?: { __typename?: 'CalendarEventExtension', eventAttendance?: Array<{ __typename?: 'EventAttendance', id: number, eventId: number, attendanceCodeId: number, personPartyId: number, date: string, note?: string | null, createdByPartyId: number, updatedByPartyId: number, attendanceCode: { __typename?: 'AttendanceCode', name: string }, createdBy: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null }, updatedBy: { __typename?: 'Person', firstName?: string | null, lastName?: string | null, partyId: number, avatarUrl?: string | null } } | null> | null } | null }> } | { __typename?: 'RoomCalendar', events: Array<{ __typename?: 'CalendarEvent', eventId: number, startTime: string, endTime: string, type: CalendarEventType, colour?: Colour | null, name: string, lessonInfo?: { __typename?: 'CalendarEventLessonRaw', subjectGroupId: number } | null, extensions?: { __typename?: 'CalendarEventExtension', eventAttendance?: Array<{ __typename?: 'EventAttendance', id: number, eventId: number, attendanceCodeId: number, personPartyId: number, date: string, note?: string | null, createdByPartyId: number, updatedByPartyId: number, attendanceCode: { __typename?: 'AttendanceCode', name: string }, createdBy: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null }, updatedBy: { __typename?: 'Person', firstName?: string | null, lastName?: string | null, partyId: number, avatarUrl?: string | null } } | null> | null } | null }> }> } | null };

export type StudentSessionAttendanceQueryVariables = Exact<{
  filter?: InputMaybe<StudentSessionAttendanceFilter>;
}>;


export type StudentSessionAttendanceQuery = { __typename?: 'Query', attendance_studentSessionAttendance: Array<{ __typename?: 'StudentSessionAttendance', studentPartyId: number, dateAttendance: Array<{ __typename?: 'StudentDateAttendance', date: string, bellTimeAttendance: Array<{ __typename?: 'StudentBellTimeAttendance', bellTimeId: number, note?: string | null, createdByPartyId: number, updatedByPartyId: number, bellTime: { __typename?: 'Calendar_BellTime', time: string, name?: string | null }, attendanceCode?: { __typename?: 'AttendanceCode', id: number, name: string, description?: string | null, code?: TuslaCode | null, codeType: AttendanceCodeType } | null, createdBy: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null }, updatedBy: { __typename?: 'Person', firstName?: string | null, lastName?: string | null, partyId: number, avatarUrl?: string | null } }> }>, student: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null }, classGroup?: { __typename?: 'GeneralGroup', name: string, staff: Array<{ __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null }> } | null }> };

export type SaveStudentSessionAttendanceMutationVariables = Exact<{
  input?: InputMaybe<SaveStudentSessionAttendanceInput>;
}>;


export type SaveStudentSessionAttendanceMutation = { __typename?: 'Mutation', attendance_saveStudentSessionAttendance: Array<{ __typename?: 'StudentSessionAttendance', studentPartyId: number, student: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null }, classGroup?: { __typename?: 'GeneralGroup', partyId: number, name: string } | null, dateAttendance: Array<{ __typename?: 'StudentDateAttendance', date: string, bellTimeAttendance: Array<{ __typename?: 'StudentBellTimeAttendance', bellTimeId: number, note?: string | null, attendanceCode?: { __typename?: 'AttendanceCode', id: number, name: string, description?: string | null, code?: TuslaCode | null, active: boolean, visibleForTeacher: boolean, visibleForContact: boolean, nameTextId?: number | null, descriptionTextId?: number | null, codeType: AttendanceCodeType } | null }> }> }> };

export type Attendance_SessionAttendanceReportQueryVariables = Exact<{
  filter?: InputMaybe<SessionAttendanceListFilter>;
}>;


export type Attendance_SessionAttendanceReportQuery = { __typename?: 'Query', attendance_sessionAttendanceList: Array<{ __typename?: 'SessionAttendanceList', id: number, studentPartyId: number, attendanceCodeId: number, date: string, note?: string | null, attendanceCode: { __typename?: 'AttendanceCode', code?: TuslaCode | null, name: string }, student: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null }, bellTime: { __typename?: 'Calendar_BellTime', time: string, name?: string | null }, classGroup?: { __typename?: 'GeneralGroup', name: string } | null }> };

export type Attendance_StudentSessionAttendanceQueryVariables = Exact<{
  filter?: InputMaybe<StudentSessionAttendanceFilter>;
}>;


export type Attendance_StudentSessionAttendanceQuery = { __typename?: 'Query', attendance_studentSessionAttendance: Array<{ __typename?: 'StudentSessionAttendance', studentPartyId: number, student: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null }, classGroup?: { __typename?: 'GeneralGroup', name: string } | null, dateAttendance: Array<{ __typename?: 'StudentDateAttendance', date: string, bellTimeAttendance: Array<{ __typename?: 'StudentBellTimeAttendance', bellTimeId: number, note?: string | null, attendanceCode?: { __typename?: 'AttendanceCode', id: number, name: string, codeType: AttendanceCodeType } | null }> }> }> };

export type Attendance_SaveStudentSessionAttendanceMutationVariables = Exact<{
  input?: InputMaybe<SaveStudentSessionAttendanceInput>;
}>;


export type Attendance_SaveStudentSessionAttendanceMutation = { __typename?: 'Mutation', attendance_saveStudentSessionAttendance: Array<{ __typename?: 'StudentSessionAttendance', studentPartyId: number }> };

export type SessionPartySearchQueryQueryVariables = Exact<{
  filter?: InputMaybe<SearchFilter>;
}>;


export type SessionPartySearchQueryQuery = { __typename?: 'Query', search_search: Array<{ __typename?: 'Search', partyId: number, type: SearchType, text: string, avatarUrl?: string | null }> };

export type TableSessionAttendanceViewQueryVariables = Exact<{
  filter?: InputMaybe<StudentSessionAttendanceFilter>;
}>;


export type TableSessionAttendanceViewQuery = { __typename?: 'Query', attendance_studentSessionAttendance: Array<{ __typename?: 'StudentSessionAttendance', dateAttendance: Array<{ __typename?: 'StudentDateAttendance', date: string, bellTimeAttendance: Array<{ __typename?: 'StudentBellTimeAttendance', bellTimeId: number, note?: string | null, createdByPartyId: number, updatedByPartyId: number, bellTime: { __typename?: 'Calendar_BellTime', time: string, name?: string | null }, attendanceCode?: { __typename?: 'AttendanceCode', id: number, name: string, description?: string | null, code?: TuslaCode | null, codeType: AttendanceCodeType } | null, createdBy: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null }, updatedBy: { __typename?: 'Person', firstName?: string | null, lastName?: string | null, partyId: number, avatarUrl?: string | null } }> }> }> };

export type Calendar_FindFreeResourcesQueryVariables = Exact<{
  filter?: InputMaybe<FindFreeResourcesFilter>;
}>;


export type Calendar_FindFreeResourcesQuery = { __typename?: 'Query', calendar_findFreeResources: { __typename?: 'FreeCalendarResources', freeRooms: Array<{ __typename?: 'Room', roomId: number, name: string }>, clashingRooms: Array<{ __typename?: 'ClashingRooms', room: { __typename?: 'Room', roomId: number, name: string } }> } };

export type Calendar_CreateCalendarEventsMutationVariables = Exact<{
  input: CreateCalendarEventsInput;
}>;


export type Calendar_CreateCalendarEventsMutation = { __typename?: 'Mutation', calendar_createCalendarEvents?: Array<{ __typename?: 'CalendarEventRaw', eventId: number } | null> | null };

export type CalendarSearchQueryQueryVariables = Exact<{
  filter?: InputMaybe<SearchFilter>;
}>;


export type CalendarSearchQueryQuery = { __typename?: 'Query', search_search: Array<{ __typename?: 'Search', partyId: number, type: SearchType, text: string, avatarUrl?: string | null }> };

export type Calendar_CalendarEventsQueryVariables = Exact<{
  filter: CalendarEventFilter;
}>;


export type Calendar_CalendarEventsQuery = { __typename?: 'Query', calendar_calendarEvents?: { __typename?: 'ResourceCalendarWrapper', resources: Array<{ __typename: 'PartyCalendar', resourceId: number, partyInfo?: { __typename: 'GeneralGroup', name: string, avatarUrl?: string | null } | { __typename: 'ProgrammeStageEnrollment', name: string, avatarUrl?: string | null } | { __typename: 'Staff', person: { __typename?: 'Person', avatarUrl?: string | null, firstName?: string | null, lastName?: string | null } } | { __typename: 'Student', person: { __typename?: 'Person', avatarUrl?: string | null, firstName?: string | null, lastName?: string | null } } | { __typename: 'StudentContact', person: { __typename?: 'Person', avatarUrl?: string | null, firstName?: string | null, lastName?: string | null } } | { __typename: 'SubjectGroup', name: string, avatarUrl?: string | null } | { __typename: 'YearGroupEnrollment', name: string, avatarUrl?: string | null } | null, events: Array<{ __typename?: 'CalendarEvent', name: string, eventId: number, calendarIds: Array<number | null>, startTime: string, endTime: string, type: CalendarEventType, colour?: Colour | null, description?: string | null, allDayEvent: boolean, editable: boolean, lessonInfo?: { __typename?: 'CalendarEventLessonRaw', subjectGroupId: number, lessonId?: number | null } | null, exclusions: Array<{ __typename?: 'CalendarEventAttendee', partyId: number, type: CalendarEventAttendeeType }>, attendees: Array<{ __typename?: 'CalendarEventAttendee', partyId: number, type: CalendarEventAttendeeType, partyInfo?: { __typename: 'GeneralGroup', name: string, avatarUrl?: string | null, partyId: number } | { __typename: 'ProgrammeStageEnrollment', name: string, avatarUrl?: string | null, partyId: number } | { __typename: 'Staff', partyId: number, person: { __typename?: 'Person', firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null } } | { __typename: 'Student', partyId: number, person: { __typename?: 'Person', firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null } } | { __typename: 'StudentContact', partyId: number, person: { __typename?: 'Person', firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null } } | { __typename: 'SubjectGroup', name: string, avatarUrl?: string | null, partyId: number } | { __typename: 'YearGroupEnrollment', name: string, avatarUrl?: string | null, partyId: number } | null }>, rooms: Array<{ __typename?: 'Room', roomId: number, name: string }>, tags: Array<{ __typename?: 'CalendarTag', label: string, context: Calendar_TagContext }> }> } | { __typename?: 'RoomCalendar', resourceId: number, room?: { __typename?: 'Room', name: string } | null, events: Array<{ __typename?: 'CalendarEvent', name: string, eventId: number, calendarIds: Array<number | null>, startTime: string, endTime: string, type: CalendarEventType, colour?: Colour | null, description?: string | null, allDayEvent: boolean, editable: boolean, lessonInfo?: { __typename?: 'CalendarEventLessonRaw', subjectGroupId: number, lessonId?: number | null } | null, exclusions: Array<{ __typename?: 'CalendarEventAttendee', partyId: number, type: CalendarEventAttendeeType }>, attendees: Array<{ __typename?: 'CalendarEventAttendee', partyId: number, type: CalendarEventAttendeeType, partyInfo?: { __typename: 'GeneralGroup', name: string, avatarUrl?: string | null, partyId: number } | { __typename: 'ProgrammeStageEnrollment', name: string, avatarUrl?: string | null, partyId: number } | { __typename: 'Staff', partyId: number, person: { __typename?: 'Person', firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null } } | { __typename: 'Student', partyId: number, person: { __typename?: 'Person', firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null } } | { __typename: 'StudentContact', partyId: number, person: { __typename?: 'Person', firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null } } | { __typename: 'SubjectGroup', name: string, avatarUrl?: string | null, partyId: number } | { __typename: 'YearGroupEnrollment', name: string, avatarUrl?: string | null, partyId: number } | null }>, rooms: Array<{ __typename?: 'Room', roomId: number, name: string }>, tags: Array<{ __typename?: 'CalendarTag', label: string, context: Calendar_TagContext }> }> }> } | null };

export type Calendar_PartyTimetableQueryVariables = Exact<{
  filter: CalendarEventFilter;
}>;


export type Calendar_PartyTimetableQuery = { __typename?: 'Query', calendar_calendarEvents?: { __typename?: 'ResourceCalendarWrapper', resources: Array<{ __typename?: 'PartyCalendar', resourceId: number, events: Array<{ __typename?: 'CalendarEvent', eventId: number, startTime: string, endTime: string, type: CalendarEventType, attendees: Array<{ __typename?: 'CalendarEventAttendee', type: CalendarEventAttendeeType, partyInfo?: { __typename: 'GeneralGroup', partyId: number } | { __typename: 'ProgrammeStageEnrollment', partyId: number } | { __typename: 'Staff', partyId: number, person: { __typename?: 'Person', firstName?: string | null, lastName?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null } } | { __typename: 'Student', partyId: number } | { __typename: 'StudentContact', partyId: number } | { __typename: 'SubjectGroup', name: string, partyId: number } | { __typename: 'YearGroupEnrollment', partyId: number } | null }>, rooms: Array<{ __typename?: 'Room', name: string }> }> } | { __typename?: 'RoomCalendar', resourceId: number, events: Array<{ __typename?: 'CalendarEvent', eventId: number, startTime: string, endTime: string, type: CalendarEventType, attendees: Array<{ __typename?: 'CalendarEventAttendee', type: CalendarEventAttendeeType, partyInfo?: { __typename: 'GeneralGroup', partyId: number } | { __typename: 'ProgrammeStageEnrollment', partyId: number } | { __typename: 'Staff', partyId: number, person: { __typename?: 'Person', firstName?: string | null, lastName?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null } } | { __typename: 'Student', partyId: number } | { __typename: 'StudentContact', partyId: number } | { __typename: 'SubjectGroup', name: string, partyId: number } | { __typename: 'YearGroupEnrollment', partyId: number } | null }>, rooms: Array<{ __typename?: 'Room', name: string }> }> }> } | null };

export type TimetableInfoQueryVariables = Exact<{
  filter?: InputMaybe<CalendarDayInfoFilter>;
}>;


export type TimetableInfoQuery = { __typename?: 'Query', calendar_dayInfo: Array<{ __typename?: 'CalendarDayInfo', date: string, startTime?: string | null, endTime?: string | null, dayType: SchoolDayType, periods: Array<{ __typename?: 'CalendarGridPeriodInfo', startTime: string, endTime: string, type: CalendarGridPeriodType }> }> };

export type Core_BlocksQueryVariables = Exact<{
  filter?: InputMaybe<BlockFilter>;
}>;


export type Core_BlocksQuery = { __typename?: 'Query', core_blocks: Array<{ __typename?: 'CoreBlock', blockId: string, name: string, description?: string | null, subjectGroupNamesJoined?: string | null, subjectGroupIds: Array<number>, isRotation: boolean, rotations: Array<{ __typename?: 'BlockRotation', iteration: number, startDate: string, endDate: string }> }> };

export type Enrollment_Ire_BlockMembershipsQueryVariables = Exact<{
  filter: EnrollmentIre_BlockEnrollmentFilter;
}>;


export type Enrollment_Ire_BlockMembershipsQuery = { __typename?: 'Query', enrollment_ire_blockMemberships: { __typename?: 'EnrollmentIre_BlockMemberships', blockId: string, isRotation: boolean, block: { __typename?: 'CoreBlock', blockId: string, name: string, description?: string | null, classGroupIds: Array<number>, subjectGroupIds: Array<number> }, groups: Array<{ __typename?: 'EnrollmentIre_BlockMembershipsDetails', rotationIteration: number, unenrolledStudents: Array<{ __typename?: 'EnrollmentIre_BlockMembershipStudent', isDuplicate: boolean, classGroupName?: string | null, gender?: Gender | null, person: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null } }>, subjectGroups: Array<{ __typename?: 'EnrollmentIre_BlockMembershipSubjectGroup', partyId: number, name: string, students: Array<{ __typename?: 'EnrollmentIre_BlockMembershipStudent', isDuplicate: boolean, classGroupName?: string | null, gender?: Gender | null, person: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null } }>, staff: Array<{ __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null }> }> }> } };

export type Enrollment_Ire_UpsertBlockMembershipsMutationVariables = Exact<{
  input: EnrollmentIre_UpsertBlockMembership;
}>;


export type Enrollment_Ire_UpsertBlockMembershipsMutation = { __typename?: 'Mutation', enrollment_ire_upsertBlockMemberships: { __typename?: 'EnrollmentIre_BlockMemberships', blockId: string } };

export type Core_EnableBlockRotationsMutationVariables = Exact<{
  input: Core_EnableBlockRotationInput;
}>;


export type Core_EnableBlockRotationsMutation = { __typename?: 'Mutation', core_enableBlockRotations?: { __typename?: 'Success', success?: boolean | null } | null };

export type Enrollment_Ire_AutoAssignBlocksMutationVariables = Exact<{
  input: EnrollmentIre_AutoAssignBlockMembershipInput;
}>;


export type Enrollment_Ire_AutoAssignBlocksMutation = { __typename?: 'Mutation', enrollment_ire_autoAssignBlocks: { __typename?: 'Success', success?: boolean | null } };

export type Enrollment_Ire_CoreMembershipsQueryVariables = Exact<{
  filter: EnrollmentIre_CoreEnrollmentFilter;
}>;


export type Enrollment_Ire_CoreMembershipsQuery = { __typename?: 'Query', enrollment_ire_coreMemberships: { __typename?: 'EnrollmentIre_CoreMemberships', yearGroupEnrollment?: { __typename?: 'YearGroupEnrollment', yearGroupId: number, name: string } | null, unenrolledStudents: Array<{ __typename?: 'Student', personalInformation?: { __typename?: 'PersonalInformation', gender?: Gender | null } | null, person: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null } }>, classGroups: Array<{ __typename?: 'GeneralGroup', partyId: number, name: string, students: Array<{ __typename?: 'Student', personalInformation?: { __typename?: 'PersonalInformation', gender?: Gender | null } | null, person: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null } }>, staff: Array<{ __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null }> }> } };

export type Enrollment_Ire_UpsertCoreMembershipsMutationVariables = Exact<{
  input: EnrollmentIre_UpsertCoreMembership;
}>;


export type Enrollment_Ire_UpsertCoreMembershipsMutation = { __typename?: 'Mutation', enrollment_ire_upsertCoreMemberships: { __typename?: 'EnrollmentIre_CoreMemberships', yearGroupEnrollment?: { __typename?: 'YearGroupEnrollment', yearGroupId: number } | null } };

export type Enrollment_Ire_AutoAssignCoreMutationVariables = Exact<{
  input: EnrollmentIre_AutoAssignCoreMembershipInput;
}>;


export type Enrollment_Ire_AutoAssignCoreMutation = { __typename?: 'Mutation', enrollment_ire_autoAssignCore: { __typename?: 'Success', success?: boolean | null } };

export type Core_BlocksListQueryVariables = Exact<{
  filter?: InputMaybe<BlockFilter>;
}>;


export type Core_BlocksListQuery = { __typename?: 'Query', core_blocks: Array<{ __typename?: 'CoreBlock', blockId: string, name: string, description?: string | null, subjectGroupNamesJoined?: string | null, subjectGroupIds: Array<number>, isRotation: boolean }> };

export type ClassGroupsListQueryVariables = Exact<{
  filter: GeneralGroupFilter;
}>;


export type ClassGroupsListQuery = { __typename?: 'Query', generalGroups?: Array<{ __typename?: 'GeneralGroup', partyId: number, name: string, avatarUrl?: string | null, generalGroupType: GeneralGroupType, studentMembers?: { __typename?: 'Group', memberCount: number } | null, programmeStages: Array<{ __typename?: 'ProgrammeStage', programme?: { __typename?: 'Programme', name: string } | null }>, tutors: Array<{ __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null }>, yearGroupLeads: Array<{ __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null }>, yearGroups: Array<{ __typename?: 'YearGroupEnrollment', yearGroupId: number, name: string }> }> | null };

export type ClassGroupsByIdQueryVariables = Exact<{
  filter: GeneralGroupFilter;
}>;


export type ClassGroupsByIdQuery = { __typename?: 'Query', generalGroups?: Array<{ __typename?: 'GeneralGroup', partyId: number, name: string, students: Array<{ __typename?: 'Student', person: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', nameTextId: number, id: number, name: string } | null } }>, relatedSubjectGroups: Array<{ __typename?: 'SubjectGroup', name: string, partyId: number, avatarUrl?: string | null, studentMembershipType?: { __typename?: 'SubjectGroupStudentMembershipType', type: SubjectGroupStudentMembershipTypeEnum } | null, subjects: Array<{ __typename?: 'Subject', name: string, colour?: Colour | null }>, programmeStages: Array<{ __typename?: 'ProgrammeStage', name: string }>, staff: Array<{ __typename?: 'Person', type?: PartyPersonType | null, firstName?: string | null, lastName?: string | null, title?: { __typename?: 'PersonalTitle', id: number, nameTextId: number, name: string } | null }>, irePP?: { __typename?: 'SubjectGroupIrePP', level?: StudyLevel | null } | null, studentMembers?: { __typename?: 'Group', memberCount: number } | null }>, blocks: Array<{ __typename?: 'CoreBlock', blockId: string }> }> | null };

export type Core_UpdateClassGroupsMutationVariables = Exact<{
  input?: InputMaybe<Array<UpdateClassGroupGroupInput> | UpdateClassGroupGroupInput>;
}>;


export type Core_UpdateClassGroupsMutation = { __typename?: 'Mutation', core_updateClassGroups?: { __typename?: 'Success', success?: boolean | null } | null };

export type Core_CustomGroupDefinitionQueryVariables = Exact<{
  filter: Core_CustomGroupDefinitionFilter;
}>;


export type Core_CustomGroupDefinitionQuery = { __typename?: 'Query', core_customGroupDefinition: { __typename?: 'Core_CustomGroupDefinition', id?: number | null, name: string, organisers?: Array<{ __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null }> | null, staffStatic?: Array<{ __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null }> | null, studentsStatic?: Array<{ __typename?: 'Student', partyId: number, person: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null }, classGroup?: { __typename?: 'GeneralGroup', name: string } | null }> | null } };

export type SaveCustomGroupDefinitionMutationVariables = Exact<{
  input: Core_UpsertCustomGroupDefinition;
}>;


export type SaveCustomGroupDefinitionMutation = { __typename?: 'Mutation', core_upsertCustomGroupDefinition: { __typename?: 'Success', success?: boolean | null } };

export type CustomGroupsListQueryVariables = Exact<{
  filter: GeneralGroupFilter;
}>;


export type CustomGroupsListQuery = { __typename?: 'Query', generalGroups?: Array<{ __typename?: 'GeneralGroup', partyId: number, name: string, avatarUrl?: string | null, studentMembers?: { __typename?: 'Group', memberCount: number } | null, staffMembers?: { __typename?: 'Group', memberCount: number } | null, contactMembers?: { __typename?: 'Group', memberCount: number } | null }> | null };

export type CustomGroupByIdQueryVariables = Exact<{
  filter: GeneralGroupFilter;
}>;


export type CustomGroupByIdQuery = { __typename?: 'Query', generalGroups?: Array<{ __typename?: 'GeneralGroup', partyId: number, name: string, avatarUrl?: string | null, students: Array<{ __typename?: 'Student', partyId: number, classGroup?: { __typename?: 'GeneralGroup', name: string } | null, person: { __typename?: 'Person', firstName?: string | null, lastName?: string | null, avatarUrl?: string | null } }> }> | null };

export type Core_ModifyBlocksMutationVariables = Exact<{
  input: Core_ModifyBlocks;
}>;


export type Core_ModifyBlocksMutation = { __typename?: 'Mutation', core_modifyBlocks: { __typename?: 'Success', success?: boolean | null } };

export type Core_ModifyGroupMembershipsMutationVariables = Exact<{
  input: Core_ModifyMemberships;
}>;


export type Core_ModifyGroupMembershipsMutation = { __typename?: 'Mutation', core_modifyGroupMemberships: { __typename?: 'Success', success?: boolean | null } };

export type Calendar_CalendarEventsIteratorQueryVariables = Exact<{
  filter: CalendarEventIteratorFilter;
}>;


export type Calendar_CalendarEventsIteratorQuery = { __typename?: 'Query', calendar_calendarEventsIterator_v2?: { __typename?: 'Calendar_EventIteratorResult', event?: { __typename?: 'CalendarEvent', eventId: number, calendarIds: Array<number | null>, startTime: string, endTime: string, type: CalendarEventType, attendees: Array<{ __typename?: 'CalendarEventAttendee', partyId: number, type: CalendarEventAttendeeType, partyInfo?: { __typename?: 'GeneralGroup', partyId: number } | { __typename?: 'ProgrammeStageEnrollment', partyId: number } | { __typename?: 'Staff', partyId: number, person: { __typename?: 'Person', firstName?: string | null, lastName?: string | null, avatarUrl?: string | null } } | { __typename?: 'Student', partyId: number } | { __typename?: 'StudentContact', partyId: number } | { __typename?: 'SubjectGroup', partyId: number } | { __typename?: 'YearGroupEnrollment', partyId: number } | null }>, rooms: Array<{ __typename?: 'Room', name: string }>, extensions?: { __typename?: 'CalendarEventExtension', eventAttendance?: Array<{ __typename?: 'EventAttendance', eventId: number, note?: string | null, attendanceCodeId: number, personPartyId: number, adminSubmitted: boolean, attendanceCode: { __typename?: 'AttendanceCode', name: string }, createdBy: { __typename?: 'Person', firstName?: string | null, lastName?: string | null } } | null> | null } | null } | null, eventsOnSameDayForSameGroup?: Array<{ __typename?: 'CalendarEvent', name: string, eventId: number, startTime: string, endTime: string, extensions?: { __typename?: 'CalendarEventExtension', eventAttendance?: Array<{ __typename?: 'EventAttendance', attendanceCodeId: number } | null> | null } | null }> | null } | null };

export type SubjectGroupsQueryVariables = Exact<{
  filter: SubjectGroupFilter;
}>;


export type SubjectGroupsQuery = { __typename?: 'Query', subjectGroups?: Array<{ __typename?: 'SubjectGroup', partyId: number, name: string, avatarUrl?: string | null, subjects: Array<{ __typename?: 'Subject', name: string, colour?: Colour | null }>, studentMembers?: { __typename?: 'Group', memberCount: number } | null, staff: Array<{ __typename?: 'Person', firstName?: string | null, lastName?: string | null, avatarUrl?: string | null }>, irePP?: { __typename?: 'SubjectGroupIrePP', level?: StudyLevel | null } | null, programmeStages: Array<{ __typename?: 'ProgrammeStage', programme?: { __typename?: 'Programme', name: string } | null }>, yearGroups: Array<{ __typename?: 'YearGroupEnrollment', name: string }>, studentMembershipType?: { __typename?: 'SubjectGroupStudentMembershipType', type: SubjectGroupStudentMembershipTypeEnum } | null }> | null };

export type SubjectGroupByIdQueryVariables = Exact<{
  filter: SubjectGroupFilter;
}>;


export type SubjectGroupByIdQuery = { __typename?: 'Query', subjectGroups?: Array<{ __typename?: 'SubjectGroup', partyId: number, name: string, avatarUrl?: string | null, yearGroups: Array<{ __typename?: 'YearGroupEnrollment', name: string }>, subjects: Array<{ __typename?: 'Subject', name: string, colour?: Colour | null }>, studentMembershipType?: { __typename?: 'SubjectGroupStudentMembershipType', type: SubjectGroupStudentMembershipTypeEnum } | null, staff: Array<{ __typename?: 'Person', firstName?: string | null, lastName?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null }>, students: Array<{ __typename?: 'Student', partyId: number, classGroup?: { __typename?: 'GeneralGroup', name: string } | null, person: { __typename?: 'Person', firstName?: string | null, lastName?: string | null, avatarUrl?: string | null } }> }> | null };

export type Core_UpdateSubjectGroupsMutationVariables = Exact<{
  input?: InputMaybe<Array<UpdateSubjectGroupInput> | UpdateSubjectGroupInput>;
}>;


export type Core_UpdateSubjectGroupsMutation = { __typename?: 'Mutation', core_updateSubjectGroups?: { __typename?: 'Success', success?: boolean | null } | null };

export type Core_SwitchSubjectGroupTypeMutationVariables = Exact<{
  input: Core_SwitchSubjectGroupType;
}>;


export type Core_SwitchSubjectGroupTypeMutation = { __typename?: 'Mutation', core_switchSubjectGroupType: { __typename?: 'Success', success?: boolean | null } };

export type SupportGroupsQueryVariables = Exact<{
  filter: SubjectGroupFilter;
}>;


export type SupportGroupsQuery = { __typename?: 'Query', subjectGroups?: Array<{ __typename?: 'SubjectGroup', partyId: number, name: string, avatarUrl?: string | null, subjects: Array<{ __typename?: 'Subject', name: string, colour?: Colour | null }>, studentMembers?: { __typename?: 'Group', memberCount: number } | null, staff: Array<{ __typename?: 'Person', firstName?: string | null, lastName?: string | null, avatarUrl?: string | null }>, irePP?: { __typename?: 'SubjectGroupIrePP', level?: StudyLevel | null } | null, programmeStages: Array<{ __typename?: 'ProgrammeStage', programme?: { __typename?: 'Programme', name: string } | null }>, yearGroups: Array<{ __typename?: 'YearGroupEnrollment', name: string }> }> | null };

export type SupportGroupByIdQueryVariables = Exact<{
  filter: SubjectGroupFilter;
}>;


export type SupportGroupByIdQuery = { __typename?: 'Query', subjectGroups?: Array<{ __typename?: 'SubjectGroup', partyId: number, name: string, avatarUrl?: string | null, yearGroups: Array<{ __typename?: 'YearGroupEnrollment', name: string }>, subjects: Array<{ __typename?: 'Subject', name: string, colour?: Colour | null }>, staff: Array<{ __typename?: 'Person', firstName?: string | null, lastName?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null }>, students: Array<{ __typename?: 'Student', partyId: number, classGroup?: { __typename?: 'GeneralGroup', name: string } | null, person: { __typename?: 'Person', firstName?: string | null, lastName?: string | null, avatarUrl?: string | null } }> }> | null };

export type YearGroupsListQueryVariables = Exact<{
  filter?: InputMaybe<YearGroupEnrollmentFilter>;
}>;


export type YearGroupsListQuery = { __typename?: 'Query', core_yearGroupEnrollments: Array<{ __typename?: 'YearGroupEnrollment', yearGroupEnrollmentPartyId: number, name: string, nationalCode: string, yearGroupId: number, shortName: string, description?: string | null, yearGroupLeads: Array<{ __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null }>, studentMembers: { __typename?: 'Group', memberCount: number } }> };

export type YearGroupByIdQueryVariables = Exact<{
  filter?: InputMaybe<YearGroupEnrollmentFilter>;
}>;


export type YearGroupByIdQuery = { __typename?: 'Query', core_yearGroupEnrollments: Array<{ __typename?: 'YearGroupEnrollment', yearGroupEnrollmentPartyId: number, name: string, students: Array<{ __typename?: 'Student', partyId: number, person: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null }, classGroup?: { __typename?: 'GeneralGroup', name: string } | null, tutors: Array<{ __typename?: 'Person', firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null }> }> }> };

export type Core_UpdateYearGroupEnrollmentsMutationVariables = Exact<{
  input?: InputMaybe<Array<UpdateYearGroupEnrollmentInput> | UpdateYearGroupEnrollmentInput>;
}>;


export type Core_UpdateYearGroupEnrollmentsMutation = { __typename?: 'Mutation', core_updateYearGroupEnrollments?: { __typename?: 'Success', success?: boolean | null } | null };

export type Communications_LabelQueryVariables = Exact<{
  filter?: InputMaybe<LabelFilter>;
}>;


export type Communications_LabelQuery = { __typename?: 'Query', communications_label: Array<{ __typename?: 'Label', id: number, name: string, personPartyId: number, colour?: Colour | null, custom?: boolean | null, type: LabelType }> };

export type Update_Communications_LabelMutationVariables = Exact<{
  input?: InputMaybe<LabelInput>;
}>;


export type Update_Communications_LabelMutation = { __typename?: 'Mutation', communications_saveLabel?: { __typename?: 'Label', id: number, name: string, personPartyId: number, colour?: Colour | null, custom?: boolean | null } | null };

export type Communications_UnreadCountQueryVariables = Exact<{
  filter?: InputMaybe<UnreadCountFilter>;
}>;


export type Communications_UnreadCountQuery = { __typename?: 'Query', communications_unreadCount: Array<{ __typename?: 'UnreadCount', labelId: number, labelType: LabelType, count: number }> };

export type Communications_AssignLabelMutationVariables = Exact<{
  input?: InputMaybe<AssignLabelInput>;
}>;


export type Communications_AssignLabelMutation = { __typename?: 'Mutation', communications_assignLabel?: { __typename?: 'Mail', id: number } | null };

export type MailSearchQueryQueryVariables = Exact<{
  filter?: InputMaybe<SearchFilter>;
}>;


export type MailSearchQueryQuery = { __typename?: 'Query', search_search: Array<{ __typename?: 'Search', partyId: number, type: SearchType, text: string, avatarUrl?: string | null }> };

export type Communications_MailQueryVariables = Exact<{
  filter?: InputMaybe<MailFilter>;
}>;


export type Communications_MailQuery = { __typename?: 'Query', communications_mail: Array<{ __typename?: 'Mail', id: number, rootMailId: number, threadId: number, subject: string, body?: string | null, senderPartyId: number, sentOn: string, latestMessage?: string | null, canReply: boolean, starred?: boolean | null, readOn?: string | null, sender: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, nameTextId: number, name: string } | null }, recipients: Array<{ __typename?: 'Recipient', id: number, recipientPartyId: number, recipientType: RecipientType, recipient: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, nameTextId: number, name: string } | null } }>, labels: Array<{ __typename?: 'Label', id: number, name: string, personPartyId: number, colour?: Colour | null, custom?: boolean | null }>, threads: Array<{ __typename?: 'Mail', id: number, rootMailId: number, threadId: number, subject: string, body?: string | null, senderPartyId: number, sentOn: string, latestMessage?: string | null, canReply: boolean, starred?: boolean | null, readOn?: string | null, sender: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, nameTextId: number, name: string } | null }, recipients: Array<{ __typename?: 'Recipient', id: number, recipientPartyId: number, recipientType: RecipientType, recipient: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, nameTextId: number, name: string } | null } }>, labels: Array<{ __typename?: 'Label', id: number, name: string, personPartyId: number, colour?: Colour | null, custom?: boolean | null }> }> }> };

export type Communications_SendMailMutationVariables = Exact<{
  input?: InputMaybe<SendMailInput>;
}>;


export type Communications_SendMailMutation = { __typename?: 'Mutation', communications_sendMail?: { __typename?: 'Mail', id: number } | null };

export type Communications_StarredMutationVariables = Exact<{
  input?: InputMaybe<MailStarredInput>;
}>;


export type Communications_StarredMutation = { __typename?: 'Mutation', communications_starred?: string | null };

export type Communications_ReadMutationVariables = Exact<{
  input?: InputMaybe<MailReadInput>;
}>;


export type Communications_ReadMutation = { __typename?: 'Mutation', communications_read?: string | null };

export type Notes_BehaviourCategoriesQueryVariables = Exact<{
  filter?: InputMaybe<Notes_BehaviourCategoryFilter>;
}>;


export type Notes_BehaviourCategoriesQuery = { __typename?: 'Query', notes_behaviourCategories: Array<{ __typename?: 'Notes_BehaviourCategory', behaviourType: Notes_BehaviourType, behaviourCategoryId: number, name: string, description: string, colour: Colour, tags: Array<{ __typename?: 'Notes_Tag', id: number, category: Notes_TagCategory, name: string, nameTextId: number, description?: string | null, descriptionTextId: number, tag_l1?: string | null, tag_l2?: string | null, tag_l3?: string | null, behaviourType?: Notes_BehaviourType | null }> }> };

export type Notes_Tags_BehavioursQueryVariables = Exact<{
  filter: Notes_TagFilter;
}>;


export type Notes_Tags_BehavioursQuery = { __typename?: 'Query', notes_tags: Array<{ __typename?: 'Notes_Tag', id: number, name: string, description?: string | null, behaviourType?: Notes_BehaviourType | null, tag_l2?: string | null }> };

export type Notes_DeleteBehaviourMutationVariables = Exact<{
  input: Notes_DeleteNotes;
}>;


export type Notes_DeleteBehaviourMutation = { __typename?: 'Mutation', notes_deleteNote?: { __typename?: 'Success', success?: boolean | null } | null };

export type Notes_BehaviourQueryVariables = Exact<{
  filter?: InputMaybe<Notes_BehaviourFilter>;
}>;


export type Notes_BehaviourQuery = { __typename?: 'Query', notes_behaviour?: { __typename?: 'Notes_StudentBehaviourOverview', behaviours?: Array<{ __typename?: 'Notes_StudentBehaviour', noteId: number, incidentDate: string, associatedPartyIds?: Array<number | null> | null, category: string, details: string, takenByPartyId: number, associatedParties: Array<{ __typename: 'GeneralGroup', partyId: number } | { __typename: 'ProgrammeStageEnrollment', partyId: number } | { __typename: 'Staff', partyId: number } | { __typename: 'Student', partyId: number } | { __typename: 'StudentContact', partyId: number } | { __typename: 'SubjectGroup', partyId: number, subjects: Array<{ __typename?: 'Subject', name: string, colour?: Colour | null }> } | { __typename: 'YearGroupEnrollment', partyId: number } | null>, takenBy: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null } } | null> | null } | null };

export type Notes_CategoriesQueryVariables = Exact<{
  filter?: InputMaybe<Notes_BehaviourFilter>;
}>;


export type Notes_CategoriesQuery = { __typename?: 'Query', notes_behaviour?: { __typename?: 'Notes_StudentBehaviourOverview', categories: Array<{ __typename?: 'Notes_StudentBehaviourCategory', behaviourCategoryId: number, name: string, colour: Colour, count: number } | null> } | null };

export type Notes_Notes_BehaviourQueryVariables = Exact<{
  filter: Notes_NotesFilter;
}>;


export type Notes_Notes_BehaviourQuery = { __typename?: 'Query', notes_notes: Array<{ __typename?: 'Notes_Note', id?: number | null, note?: string | null, createdOn: string, createdBy: number, incidentDate?: string | null, createdByPerson?: { __typename?: 'Person', firstName?: string | null, lastName?: string | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null } | null, tags: Array<{ __typename?: 'Notes_Tag', id: number, name: string, category: Notes_TagCategory, behaviourType?: Notes_BehaviourType | null, descriptionTextId: number, nameTextId: number }>, associatedGroups?: Array<{ __typename: 'GeneralGroup', partyId: number } | { __typename: 'ProgrammeStageEnrollment', partyId: number } | { __typename: 'SubjectGroup', partyId: number, subjects: Array<{ __typename?: 'Subject', name: string, colour?: Colour | null }> } | { __typename: 'YearGroupEnrollment', partyId: number } | null> | null }> };

export type Notes_UpsertBehaviourTagsMutationVariables = Exact<{
  input?: InputMaybe<Array<InputMaybe<Notes_UpsertBehaviourTagInput>> | InputMaybe<Notes_UpsertBehaviourTagInput>>;
}>;


export type Notes_UpsertBehaviourTagsMutation = { __typename?: 'Mutation', notes_upsertBehaviourTags: Array<{ __typename?: 'Notes_Tag', id: number }> };

export type Notes_UpsertNotesMutationVariables = Exact<{
  input?: InputMaybe<Array<InputMaybe<Notes_UpsertNote>> | InputMaybe<Notes_UpsertNote>>;
}>;


export type Notes_UpsertNotesMutation = { __typename?: 'Mutation', notes_upsertNotes: Array<{ __typename?: 'Notes_Note', id?: number | null }> };

export type Catalogue_PersonalTitlesQueryVariables = Exact<{ [key: string]: never; }>;


export type Catalogue_PersonalTitlesQuery = { __typename?: 'Query', catalogue_personalTitles: Array<{ __typename?: 'PersonalTitle', id: number, name: string }> };

export type Core_StudentContactsQueryVariables = Exact<{ [key: string]: never; }>;


export type Core_StudentContactsQuery = { __typename?: 'Query', core_studentContacts?: Array<{ __typename?: 'StudentContact', partyId: number, person: { __typename?: 'Person', avatarUrl?: string | null, firstName?: string | null, lastName?: string | null }, personalInformation?: { __typename?: 'PersonalInformation', primaryAddress?: { __typename?: 'Address', line1?: string | null, line2?: string | null, line3?: string | null, city?: string | null, country?: string | null, postCode?: string | null } | null, primaryPhoneNumber?: { __typename?: 'PhoneNumber', number?: string | null } | null, primaryEmail?: { __typename?: 'EmailAddress', email?: string | null } | null } | null, relationships?: Array<{ __typename?: 'StudentContactRelationshipInfo', student: { __typename?: 'Student', person: { __typename?: 'Person', avatarUrl?: string | null, firstName?: string | null, lastName?: string | null } } } | null> | null }> | null };

export type Core_StudentContactsForSelectQueryVariables = Exact<{ [key: string]: never; }>;


export type Core_StudentContactsForSelectQuery = { __typename?: 'Query', core_studentContacts?: Array<{ __typename?: 'StudentContact', person: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', nameTextId: number, id: number, name: string } | null } }> | null };

export type Core_StudentContacts_PersonalQueryVariables = Exact<{
  filter: StudentContactFilter;
}>;


export type Core_StudentContacts_PersonalQuery = { __typename?: 'Query', core_studentContacts?: Array<{ __typename?: 'StudentContact', partyId: number, occupation?: string | null, requiresInterpreter?: boolean | null, spokenLanguages?: Array<string | null> | null, person: { __typename?: 'Person', avatarUrl?: string | null, firstName?: string | null, lastName?: string | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null }, personalInformation?: { __typename?: 'PersonalInformation', firstName: string, lastName: string, preferredFirstName?: string | null, middleName?: string | null, gender?: Gender | null, dateOfBirth?: string | null, nationality?: string | null, mothersMaidenName?: string | null, ire?: { __typename?: 'PersonalInformationIre', ppsNumber?: string | null, religion?: string | null, countryOfBirth?: string | null } | null, primaryAddress?: { __typename?: 'Address', id?: number | null, line1?: string | null, line2?: string | null, line3?: string | null, city?: string | null, country?: string | null, postCode?: string | null } | null, primaryPhoneNumber?: { __typename?: 'PhoneNumber', phoneNumberId?: number | null, number?: string | null, areaCode?: string | null, countryCode?: string | null } | null, phoneNumbers?: Array<{ __typename?: 'PhoneNumber', phoneNumberId?: number | null, primaryPhoneNumber?: boolean | null, number?: string | null, areaCode?: string | null, countryCode?: string | null } | null> | null, primaryEmail?: { __typename?: 'EmailAddress', emailId?: number | null, email?: string | null } | null } | null, relationships?: Array<{ __typename?: 'StudentContactRelationshipInfo', relationshipType: StudentContactType, studentPartyId: number, priority: number, allowedToContact: boolean, includeInSms: boolean, includeInTmail: boolean, pickupRights: boolean, legalGuardian: boolean, allowAccessToStudentData: boolean } | null> | null }> | null };

export type Core_StudentContacts_StudentsQueryVariables = Exact<{
  filter: StudentContactFilter;
}>;


export type Core_StudentContacts_StudentsQuery = { __typename?: 'Query', core_studentContacts?: Array<{ __typename?: 'StudentContact', partyId: number, relationships?: Array<{ __typename?: 'StudentContactRelationshipInfo', studentPartyId: number, relationshipType: StudentContactType, priority: number, allowedToContact: boolean, includeInSms: boolean, includeInTmail: boolean, pickupRights: boolean, legalGuardian: boolean, allowAccessToStudentData: boolean, student: { __typename?: 'Student', partyId: number, person: { __typename?: 'Person', firstName?: string | null, lastName?: string | null, avatarUrl?: string | null }, classGroup?: { __typename?: 'GeneralGroup', name: string } | null } } | null> | null }> | null };

export type Core_UpsertStudentContactMutationVariables = Exact<{
  input: UpsertStudentContactInput;
}>;


export type Core_UpsertStudentContactMutation = { __typename?: 'Mutation', core_upsertStudentContact: { __typename?: 'StudentContact', partyId: number } };

export type Notes_DeleteNoteMutationVariables = Exact<{
  input: Notes_DeleteNotes;
}>;


export type Notes_DeleteNoteMutation = { __typename?: 'Mutation', notes_deleteNote?: { __typename?: 'Success', success?: boolean | null } | null };

export type Notes_NotesQueryVariables = Exact<{
  filter: Notes_NotesFilter;
}>;


export type Notes_NotesQuery = { __typename?: 'Query', notes_notes: Array<{ __typename?: 'Notes_Note', id?: number | null, note?: string | null, createdOn: string, createdBy: number, createdByPerson?: { __typename?: 'Person', firstName?: string | null, lastName?: string | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null } | null, tags: Array<{ __typename?: 'Notes_Tag', id: number, name: string, category: Notes_TagCategory, descriptionTextId: number, nameTextId: number }> }> };

export type Notes_TagsQueryVariables = Exact<{
  filter: Notes_TagFilter;
}>;


export type Notes_TagsQuery = { __typename?: 'Query', notes_tags: Array<{ __typename?: 'Notes_Tag', id: number, name: string, description?: string | null, category: Notes_TagCategory, tag_l1?: string | null }> };

export type Notes_UpsertNotesTagsMutationVariables = Exact<{
  input?: InputMaybe<Array<InputMaybe<Notes_UpsertNotesTagInput>> | InputMaybe<Notes_UpsertNotesTagInput>>;
}>;


export type Notes_UpsertNotesTagsMutation = { __typename?: 'Mutation', notes_upsertNotesTags: Array<{ __typename?: 'Notes_Tag', id: number }> };

export type Eire_DeleteNonClassContactHoursMutationVariables = Exact<{
  input: DeleteNonClassContactHoursInput;
}>;


export type Eire_DeleteNonClassContactHoursMutation = { __typename?: 'Mutation', eire_deleteNonClassContactHours?: { __typename?: 'Success', success?: boolean | null } | null };

export type Catalogue_StaffCapacitiesQueryVariables = Exact<{ [key: string]: never; }>;


export type Catalogue_StaffCapacitiesQuery = { __typename?: 'Query', catalogue_staffCapacities: Array<{ __typename?: 'StaffCapacity', id: string, name: string }> };

export type Core_StaffQueryVariables = Exact<{
  filter?: InputMaybe<StaffFilter>;
}>;


export type Core_StaffQuery = { __typename?: 'Query', core_staff: Array<{ __typename?: 'Staff', partyId: number, startDate?: string | null, endDate?: string | null, carRegistrationNumber?: string | null, parking?: string | null, position?: string | null, person: { __typename?: 'Person', firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null }, employmentCapacity?: { __typename?: 'StaffCapacity', name: string } | null, personalInformation?: { __typename?: 'PersonalInformation', gender?: Gender | null, primaryPhoneNumber?: { __typename?: 'PhoneNumber', number?: string | null } | null, primaryEmail?: { __typename?: 'EmailAddress', email?: string | null } | null, ire?: { __typename?: 'PersonalInformationIre', ppsNumber?: string | null } | null } | null, staffIre?: { __typename?: 'StaffIre', teacherCouncilNumber?: string | null, staffPost?: { __typename?: 'StaffPost', id: number, name: string } | null } | null }> };

export type Core_StaffInfoForSelectQueryVariables = Exact<{
  filter?: InputMaybe<StaffFilter>;
}>;


export type Core_StaffInfoForSelectQuery = { __typename?: 'Query', core_staff: Array<{ __typename?: 'Staff', person: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', nameTextId: number, id: number, name: string } | null } }> };

export type Eire_NonClassContactHoursQueryVariables = Exact<{
  filter?: InputMaybe<NonClassContactHoursFilter>;
}>;


export type Eire_NonClassContactHoursQuery = { __typename?: 'Query', eire_nonClassContactHours?: Array<{ __typename?: 'NonClassContactHours', academicNameSpaceId: number, activity: Activity, dayOfTheWeek: Day, description?: string | null, hours: number, minutes: number, nonClassContactHoursId: number, programme?: Ncch_Programme | null, staffPartyId: number } | null> | null };

export type Core_Staff_PersonalQueryVariables = Exact<{
  filter?: InputMaybe<StaffFilter>;
}>;


export type Core_Staff_PersonalQuery = { __typename?: 'Query', core_staff: Array<{ __typename?: 'Staff', partyId: number, startDate?: string | null, endDate?: string | null, noLongerStaffMember?: boolean | null, payrollNumber?: string | null, displayCode?: string | null, carRegistrationNumber?: string | null, makeAndModel?: string | null, parking?: string | null, jobSharing?: boolean | null, qualifications?: string | null, competencies?: Array<number | null> | null, availableForTeaching: boolean, availableForSubstitution: boolean, availableForSupportClasses: boolean, position?: string | null, person: { __typename?: 'Person', firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null }, personalInformation?: { __typename?: 'PersonalInformation', gender?: Gender | null, dateOfBirth?: string | null, ire?: { __typename?: 'PersonalInformationIre', ppsNumber?: string | null } | null, primaryAddress?: { __typename?: 'Address', id?: number | null, line1?: string | null, line2?: string | null, line3?: string | null, city?: string | null, country?: string | null, postCode?: string | null } | null, primaryPhoneNumber?: { __typename?: 'PhoneNumber', phoneNumberId?: number | null, number?: string | null, areaCode?: string | null, countryCode?: string | null } | null, phoneNumbers?: Array<{ __typename?: 'PhoneNumber', phoneNumberId?: number | null, primaryPhoneNumber?: boolean | null, number?: string | null, areaCode?: string | null, countryCode?: string | null } | null> | null, primaryEmail?: { __typename?: 'EmailAddress', emailId?: number | null, email?: string | null } | null, emails?: Array<{ __typename?: 'EmailAddress', emailId?: number | null, email?: string | null, primaryEmail?: boolean | null } | null> | null, nextOfKin?: { __typename?: 'NextOfKin', firstName?: string | null, lastName?: string | null, phoneNumbers?: Array<string | null> | null } | null } | null, staffIre?: { __typename?: 'StaffIre', teacherCouncilNumber?: string | null, staffPost?: { __typename?: 'StaffPost', id: number, name: string } | null } | null, employmentCapacity?: { __typename?: 'StaffCapacity', id: string, name: string } | null, emergencyContact?: { __typename?: 'StaffEmergencyContact', firstName?: string | null, lastName?: string | null, primaryNumber?: string | null, additionalNumber?: string | null } | null, competencySubjects: Array<{ __typename?: 'Subject', id: number, name: string, colour?: Colour | null }> }> };

export type Catalogue_StaffPostsQueryVariables = Exact<{ [key: string]: never; }>;


export type Catalogue_StaffPostsQuery = { __typename?: 'Query', catalogue_staffPosts: Array<{ __typename?: 'StaffPost', id: number, name: string }> };

export type Core_Staff_SubjectGroupsQueryVariables = Exact<{
  filter?: InputMaybe<StaffFilter>;
}>;


export type Core_Staff_SubjectGroupsQuery = { __typename?: 'Query', core_staff: Array<{ __typename?: 'Staff', subjectGroups: Array<{ __typename?: 'SubjectGroup', partyId: number, name: string, avatarUrl?: string | null, subjects: Array<{ __typename?: 'Subject', name: string, colour?: Colour | null }>, irePP?: { __typename?: 'SubjectGroupIrePP', level?: StudyLevel | null } | null, studentMembers?: { __typename?: 'Group', memberCount: number } | null }> }> };

export type Eire_UpsertNonClassContactHoursMutationVariables = Exact<{
  input?: InputMaybe<SaveNonClassContactHoursInput>;
}>;


export type Eire_UpsertNonClassContactHoursMutation = { __typename?: 'Mutation', eire_upsertNonClassContactHours?: { __typename?: 'Success', success?: boolean | null } | null };

export type Core_UpsertStaffMutationVariables = Exact<{
  input?: InputMaybe<Array<InputMaybe<UpsertStaffInput>> | InputMaybe<UpsertStaffInput>>;
}>;


export type Core_UpsertStaffMutation = { __typename?: 'Mutation', core_upsertStaff?: Array<{ __typename?: 'Staff', partyId: number } | null> | null };

export type Wellbeing_DeleteStudentAenMutationVariables = Exact<{
  input: Wellbeing_DeleteStudentAenInput;
}>;


export type Wellbeing_DeleteStudentAenMutation = { __typename?: 'Mutation', wellbeing_deleteStudentAen: { __typename?: 'Success', success?: boolean | null } };

export type Wellbeing_StudentAenQueryVariables = Exact<{
  filter: StudentAenFilter;
}>;


export type Wellbeing_StudentAenQuery = { __typename?: 'Query', wellbeing_studentAen: { __typename?: 'Wellbeing_StudentAen', studentPartyId: number, entries: Array<{ __typename?: 'Wellbeing_StudentAenEntry', id: number, studentPartyId: number, startDate?: string | null, endDate?: string | null, type?: string | null, typeNote?: string | null, contact?: string | null, snaSupport?: string | null, provision?: string | null, note?: string | null }> } };

export type Wellbeing_UpsertStudentAenMutationVariables = Exact<{
  input: Wellbeing_UpsertStudentAenInput;
}>;


export type Wellbeing_UpsertStudentAenMutation = { __typename?: 'Mutation', wellbeing_upsertStudentAen: { __typename?: 'Success', success?: boolean | null } };

export type Enrollment_Ire_ChangeProgrammeStageMutationVariables = Exact<{
  input: Array<EnrollmentIre_ChangeProgrammeStage> | EnrollmentIre_ChangeProgrammeStage;
}>;


export type Enrollment_Ire_ChangeProgrammeStageMutation = { __typename?: 'Mutation', enrollment_ire_changeProgrammeStage: { __typename?: 'Success', success?: boolean | null } };

export type Wellbeing_DeleteStudentMedicalConditionMutationVariables = Exact<{
  input: DeleteStudentMedicalConditionInput;
}>;


export type Wellbeing_DeleteStudentMedicalConditionMutation = { __typename?: 'Mutation', wellbeing_deleteStudentMedicalCondition: { __typename?: 'StudentMedical', studentPartyId: number, conditions: Array<{ __typename?: 'StudentMedicalCondition', id: number, name: string, description?: string | null }> } };

export type Wellbeing_DeleteStudentMedicalContactMutationVariables = Exact<{
  input: DeleteStudentMedicalContactInput;
}>;


export type Wellbeing_DeleteStudentMedicalContactMutation = { __typename?: 'Mutation', wellbeing_deleteStudentMedicalContact: { __typename?: 'StudentMedical', studentPartyId: number, medicalContacts: Array<{ __typename?: 'StudentMedicalContact', id?: number | null }> } };

export type Wellbeing_StudentMedicalConditionLookupQueryVariables = Exact<{ [key: string]: never; }>;


export type Wellbeing_StudentMedicalConditionLookupQuery = { __typename?: 'Query', wellbeing_studentMedicalConditionLookup?: { __typename?: 'ListString', values: Array<string> } | null };

export type Wellbeing_StudentMedicalQueryVariables = Exact<{
  filter?: InputMaybe<StudentMedicalFilter>;
}>;


export type Wellbeing_StudentMedicalQuery = { __typename?: 'Query', wellbeing_studentMedical?: { __typename?: 'StudentMedical', studentPartyId: number, student?: { __typename?: 'Student', contacts?: Array<{ __typename?: 'StudentContact', partyId: number, person: { __typename?: 'Person', firstName?: string | null, lastName?: string | null }, personalInformation?: { __typename?: 'PersonalInformation', preferredFirstName?: string | null, preferredLastName?: string | null, primaryPhoneNumber?: { __typename?: 'PhoneNumber', number?: string | null } | null } | null, relationships?: Array<{ __typename?: 'StudentContactRelationshipInfo', relationshipType: StudentContactType } | null> | null }> | null, siblings?: { __typename?: 'Core_Siblings', enrolledSiblings: Array<{ __typename?: 'Student', partyId: number, person: { __typename?: 'Person', firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, nameTextId: number, name: string } | null }, classGroup?: { __typename?: 'GeneralGroup', name: string } | null }>, nonEnrolledSiblings: Array<{ __typename?: 'Core_NonEnrolledSibling', partyId: number, firstName?: string | null, lastName?: string | null }> } | null } | null, conditions: Array<{ __typename?: 'StudentMedicalCondition', id: number, name: string, description?: string | null, emergencyPlan?: string | null, equipment: Array<{ __typename?: 'StudentMedicalConditionEquipment', id: number, name: string, expiryDate?: string | null, location?: string | null, notes?: string | null }> }>, medicalContacts: Array<{ __typename?: 'StudentMedicalContact', id?: number | null, personalTitle?: string | null, firstName?: string | null, lastName?: string | null, occupation?: string | null, addressLine1?: string | null, addressLine2?: string | null, addressLine3?: string | null, county?: string | null, postcode?: string | null, primaryPhone?: string | null, email?: string | null }> } | null };

export type Wellbeing_UpsertStudentMedicalConditionMutationVariables = Exact<{
  input: UpsertStudentMedicalConditionInput;
}>;


export type Wellbeing_UpsertStudentMedicalConditionMutation = { __typename?: 'Mutation', wellbeing_upsertStudentMedicalCondition: { __typename?: 'StudentMedical', studentPartyId: number, conditions: Array<{ __typename?: 'StudentMedicalCondition', id: number, name: string, description?: string | null, equipment: Array<{ __typename?: 'StudentMedicalConditionEquipment', id: number, name: string, location?: string | null }> }> } };

export type Wellbeing_UpsertStudentMedicalContactMutationVariables = Exact<{
  input: UpsertStudentMedicalContactInput;
}>;


export type Wellbeing_UpsertStudentMedicalContactMutation = { __typename?: 'Mutation', wellbeing_upsertStudentMedicalContact: { __typename?: 'StudentMedical', studentPartyId: number, medicalContacts: Array<{ __typename?: 'StudentMedicalContact', id?: number | null, personalTitleId?: number | null, firstName?: string | null, lastName?: string | null, addressLine1?: string | null, addressLine2?: string | null, addressLine3?: string | null, county?: string | null, postcode?: string | null, primaryPhone?: string | null, email?: string | null, occupation?: string | null }> } };

export type Core_Student_ContactsQueryVariables = Exact<{
  filter: StudentFilter;
}>;


export type Core_Student_ContactsQuery = { __typename?: 'Query', core_students: Array<{ __typename?: 'Student', partyId: number, contacts?: Array<{ __typename?: 'StudentContact', partyId: number, person: { __typename?: 'Person', firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null }, personalInformation?: { __typename?: 'PersonalInformation', gender?: Gender | null, nationality?: string | null, primaryAddress?: { __typename?: 'Address', line1?: string | null, line2?: string | null, line3?: string | null, city?: string | null, country?: string | null, postCode?: string | null } | null, primaryPhoneNumber?: { __typename?: 'PhoneNumber', number?: string | null, areaCode?: string | null, countryCode?: string | null } | null, primaryEmail?: { __typename?: 'EmailAddress', email?: string | null } | null } | null, relationships?: Array<{ __typename?: 'StudentContactRelationshipInfo', relationshipType: StudentContactType, priority: number, allowedToContact: boolean, includeInSms: boolean, includeInTmail: boolean, pickupRights: boolean, legalGuardian: boolean, allowAccessToStudentData: boolean } | null> | null }> | null }> };

export type Core_Student_SubjectGroupsQueryVariables = Exact<{
  filter: StudentFilter;
}>;


export type Core_Student_SubjectGroupsQuery = { __typename?: 'Query', core_students: Array<{ __typename?: 'Student', partyId: number, subjectGroups: Array<{ __typename?: 'SubjectGroup', partyId: number, name: string, avatarUrl?: string | null, subjects: Array<{ __typename?: 'Subject', name: string, colour?: Colour | null }>, staff: Array<{ __typename?: 'Person', firstName?: string | null, lastName?: string | null, avatarUrl?: string | null }>, irePP?: { __typename?: 'SubjectGroupIrePP', level?: StudyLevel | null } | null }> }> };

export type Core_Student_PersonalQueryVariables = Exact<{
  filter: StudentFilter;
}>;


export type Core_Student_PersonalQuery = { __typename?: 'Query', core_students: Array<{ __typename?: 'Student', partyId: number, startDate?: string | null, leftEarly?: boolean | null, endDate?: string | null, guardianshipNote?: string | null, person: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null }, personalInformation?: { __typename?: 'PersonalInformation', firstName: string, lastName: string, preferredFirstName?: string | null, preferredLastName?: string | null, middleName?: string | null, gender?: Gender | null, dateOfBirth?: string | null, birthCertFirstName?: string | null, birthCertLastName?: string | null, nationality?: string | null, mothersMaidenName?: string | null, ire?: { __typename?: 'PersonalInformationIre', ppsNumber?: string | null, religion?: string | null, countryOfBirth?: string | null } | null, primaryAddress?: { __typename?: 'Address', line1?: string | null, line2?: string | null, line3?: string | null, city?: string | null, country?: string | null, postCode?: string | null } | null, addresses?: Array<{ __typename?: 'Address', line1?: string | null, line2?: string | null, line3?: string | null, city?: string | null, country?: string | null, postCode?: string | null, primaryAddress?: boolean | null } | null> | null, primaryPhoneNumber?: { __typename?: 'PhoneNumber', number?: string | null, areaCode?: string | null, countryCode?: string | null } | null, primaryEmail?: { __typename?: 'EmailAddress', email?: string | null } | null } | null, studentIrePP?: { __typename?: 'StudentIrePP', medicalCard?: boolean | null, travellerHeritage?: boolean | null, languageSupportApplicant?: boolean | null, borderIndicator?: boolean | null, examNumber?: string | null, lockerNumber?: string | null, previousSchoolRollNumber?: string | null, dpin?: number | null, examEntrant?: boolean | null, repeatYear?: boolean | null, boardingDays?: string | null, shortTermPupil?: boolean | null, shortTermPupilNumWeeks?: number | null, reasonForLeaving?: StudentLeavingReason | null, destinationRollNo?: string | null, previousSchoolName?: string | null, previousSchoolType?: string | null } | null, classGroup?: { __typename?: 'GeneralGroup', name: string } | null, tutors: Array<{ __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null }>, yearGroupLeads: Array<{ __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null }>, yearGroups: Array<{ __typename?: 'YearGroupEnrollment', name: string }>, programmeStages?: Array<{ __typename?: 'ProgrammeStage', name: string, programme?: { __typename?: 'Programme', name: string } | null }> | null, siblings?: { __typename?: 'Core_Siblings', enrolledSiblings: Array<{ __typename?: 'Student', partyId: number, person: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, title?: { __typename?: 'PersonalTitle', id: number, nameTextId: number, name: string } | null }, classGroup?: { __typename?: 'GeneralGroup', name: string } | null }>, nonEnrolledSiblings: Array<{ __typename?: 'Core_NonEnrolledSibling', partyId: number, firstName?: string | null, lastName?: string | null }> } | null }> };

export type QQueryVariables = Exact<{
  filter?: InputMaybe<StudentStatusFilter>;
}>;


export type QQuery = { __typename?: 'Query', composite_studentStatus: { __typename?: 'StudentStatus', studentPartyId: number, priorityStudent?: boolean | null, activeSupportPlan?: boolean | null, sessionAttendance?: Array<{ __typename?: 'SessionAttendanceStatus', name?: string | null, status?: string | null } | null> | null, currentLocation?: { __typename?: 'CurrentStudentLocation', studentPartyId?: number | null, eventId?: number | null, lesson?: string | null, teacher?: string | null, room?: Array<{ __typename?: 'Room', roomId: number, name: string, capacity?: number | null } | null> | null, currentAttendance?: { __typename?: 'CurrentAttendance', attendanceCodeName?: string | null, codeType?: AttendanceCodeType | null } | null } | null } };

export type StudentsForSiblingSearchQueryVariables = Exact<{ [key: string]: never; }>;


export type StudentsForSiblingSearchQuery = { __typename?: 'Query', core_students: Array<{ __typename?: 'Student', partyId: number, person: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, nameTextId: number, name: string } | null }, classGroup?: { __typename?: 'GeneralGroup', name: string } | null, contacts?: Array<{ __typename?: 'StudentContact', partyId: number, person: { __typename?: 'Person', firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null } }> | null }> };

export type Core_StudentsQueryVariables = Exact<{ [key: string]: never; }>;


export type Core_StudentsQuery = { __typename?: 'Query', core_students: Array<{ __typename?: 'Student', partyId: number, person: { __typename?: 'Person', avatarUrl?: string | null, firstName?: string | null, lastName?: string | null }, classGroup?: { __typename?: 'GeneralGroup', name: string, staff: Array<{ __typename?: 'Person', firstName?: string | null, lastName?: string | null }> } | null, personalInformation?: { __typename?: 'PersonalInformation', preferredFirstName?: string | null, primaryPhoneNumber?: { __typename?: 'PhoneNumber', number?: string | null } | null, primaryEmail?: { __typename?: 'EmailAddress', email?: string | null } | null } | null, studentIrePP?: { __typename?: 'StudentIrePP', examNumber?: string | null, previousSchoolName?: string | null } | null, tutors: Array<{ __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null }>, yearGroupLeads: Array<{ __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null }>, yearGroups: Array<{ __typename?: 'YearGroupEnrollment', name: string }>, programmeStages?: Array<{ __typename?: 'ProgrammeStage', id: number, name: string, programme?: { __typename?: 'Programme', name: string } | null }> | null }> };

export type Core_StudentQueryVariables = Exact<{
  filter: StudentFilter;
}>;


export type Core_StudentQuery = { __typename?: 'Query', core_students: Array<{ __typename?: 'Student', partyId: number, person: { __typename?: 'Person', avatarUrl?: string | null, firstName?: string | null, lastName?: string | null }, classGroup?: { __typename?: 'GeneralGroup', name: string, staff: Array<{ __typename?: 'Person', firstName?: string | null, lastName?: string | null }> } | null, yearGroupLeads: Array<{ __typename?: 'Person', firstName?: string | null, lastName?: string | null, avatarUrl?: string | null }>, yearGroups: Array<{ __typename?: 'YearGroupEnrollment', shortName: string }>, tutors: Array<{ __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null }> }> };

export type Core_StudentsInfoForSelectQueryVariables = Exact<{
  filter?: InputMaybe<StudentFilter>;
}>;


export type Core_StudentsInfoForSelectQuery = { __typename?: 'Query', core_students: Array<{ __typename?: 'Student', person: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null }, classGroup?: { __typename?: 'GeneralGroup', name: string } | null, yearGroups: Array<{ __typename?: 'YearGroupEnrollment', name: string }> }> };

export type UpdateCoreStudentsMutationVariables = Exact<{
  input: Array<InputMaybe<UpdateStudentInput>> | InputMaybe<UpdateStudentInput>;
}>;


export type UpdateCoreStudentsMutation = { __typename?: 'Mutation', core_updateStudents?: { __typename?: 'Success', success?: boolean | null } | null };

export type Core_LinkSiblingsAndContactsMutationVariables = Exact<{
  input: Core_LinkSiblingsAndContacts;
}>;


export type Core_LinkSiblingsAndContactsMutation = { __typename?: 'Mutation', core_linkSiblingsAndContacts: { __typename?: 'Success', success?: boolean | null } };

export type Core_UpdateStudentContactRelationshipsMutationVariables = Exact<{
  input?: InputMaybe<Array<InputMaybe<Core_UpdateStudentContactRelationshipInput>> | InputMaybe<Core_UpdateStudentContactRelationshipInput>>;
}>;


export type Core_UpdateStudentContactRelationshipsMutation = { __typename?: 'Mutation', core_updateStudentContactRelationships?: { __typename?: 'Success', success?: boolean | null } | null };

export type UpdateStudentMutationVariables = Exact<{
  input: Array<InputMaybe<UpdateStudentInput>> | InputMaybe<UpdateStudentInput>;
}>;


export type UpdateStudentMutation = { __typename?: 'Mutation', core_updateStudents?: { __typename?: 'Success', success?: boolean | null } | null };

export type PrintTimetableQueryVariables = Exact<{
  filter: Print_TimetableOptions;
}>;


export type PrintTimetableQuery = { __typename?: 'Query', print_printTimetable: { __typename?: 'TemporaryDownload', url?: string | null, html?: string | null } };

export type Reporting_ReportsQueryVariables = Exact<{ [key: string]: never; }>;


export type Reporting_ReportsQuery = { __typename?: 'Query', reporting_reports: Array<{ __typename?: 'Reporting_ReportInfoTopLevel', info: { __typename?: 'Reporting_ReportInfo', id: string, name: string }, reports: Array<{ __typename?: 'Reporting_ReportInfo', id: string, name: string }> }> };

export type Reporting_RunReportExpandQueryVariables = Exact<{
  filter?: InputMaybe<Reporting_ReportFilterExpand>;
}>;


export type Reporting_RunReportExpandQuery = { __typename?: 'Query', reporting_runReportExpand?: { __typename?: 'Reporting_TableReport', id: string, data?: Array<any | null> | null, fields: Array<{ __typename?: 'Reporting_TableReportField', id: string, label: string, visibleByDefault: boolean }> } | null };

export type Reporting_RunReportQueryVariables = Exact<{
  filter?: InputMaybe<Reporting_ReportFilter>;
}>;


export type Reporting_RunReportQuery = { __typename?: 'Query', reporting_runReport?: { __typename?: 'Reporting_TableReport', id: string, data?: Array<any | null> | null, info: { __typename?: 'Reporting_ReportInfo', name: string, supportsExpandRow: boolean }, innerReports: Array<{ __typename?: 'Reporting_ReportInfo', id: string, name: string }>, filters: Array<{ __typename?: 'Reporting_TableFilter', id: string, inputType: Reporting_TableFilterType, label: string, defaultValue?: any | null, required: boolean, minValue?: any | null, maxValue?: any | null, values?: Array<{ __typename?: 'Reporting_TableFilterValues', id?: any | null, value?: string | null } | null> | null }>, fields: Array<{ __typename?: 'Reporting_TableReportField', id: string, label: string, visibleByDefault: boolean, checkExpandedRows: boolean, hideMenu: boolean }> } | null };

export type Core_UpsertAcademicNamespaceMutationVariables = Exact<{
  input?: InputMaybe<SaveAcademicNamespaceInput>;
}>;


export type Core_UpsertAcademicNamespaceMutation = { __typename?: 'Mutation', core_upsertAcademicNamespace?: { __typename?: 'AcademicNamespace', academicNamespaceId: number } | null };

export type Core_SetActiveActiveAcademicNamespaceMutationVariables = Exact<{
  input?: InputMaybe<SetActiveAcademicNamespace>;
}>;


export type Core_SetActiveActiveAcademicNamespaceMutation = { __typename?: 'Mutation', core_setActiveActiveAcademicNamespace?: { __typename?: 'AcademicNamespace', academicNamespaceId: number, type: AcademicNamespaceType, name: string, year: number, description?: string | null, isActiveDefaultNamespace: boolean } | null };

export type Core_UpsertRoomsMutationVariables = Exact<{
  input?: InputMaybe<Array<InputMaybe<UpsertRoomInput>> | InputMaybe<UpsertRoomInput>>;
}>;


export type Core_UpsertRoomsMutation = { __typename?: 'Mutation', core_upsertRooms: Array<{ __typename?: 'Room', roomId: number }> };

export type Core_Staff_Form_BQueryVariables = Exact<{
  filter?: InputMaybe<StaffFilter>;
}>;


export type Core_Staff_Form_BQuery = { __typename?: 'Query', core_staff: Array<{ __typename?: 'Staff', partyId: number, payrollNumber?: string | null, jobSharing?: boolean | null, qualifications?: string | null, person: { __typename?: 'Person', firstName?: string | null, lastName?: string | null }, personalInformation?: { __typename?: 'PersonalInformation', gender?: Gender | null, ire?: { __typename?: 'PersonalInformationIre', ppsNumber?: string | null } | null } | null, employmentCapacity?: { __typename?: 'StaffCapacity', id: string, name: string } | null, staffIre?: { __typename?: 'StaffIre', teacherCouncilNumber?: string | null, teacherReferenceNumber?: string | null, includeDtrReturns?: boolean | null, qualifications2?: string | null, qualifications3?: string | null, qualifications4?: string | null, otherSchool1?: string | null, otherSchool2?: string | null, previousSchool1?: string | null, previousSchool2?: string | null, staffPost?: { __typename?: 'StaffPost', id: number, name: string } | null } | null }> };

export type Core_UpdateStaffMutationVariables = Exact<{
  input: Array<UpdateStaffInput> | UpdateStaffInput;
}>;


export type Core_UpdateStaffMutation = { __typename?: 'Mutation', core_updateStaff: { __typename?: 'Success', success?: boolean | null } };

export type SavePermissionGroupMutationVariables = Exact<{
  input?: InputMaybe<SavePermissionGroup>;
}>;


export type SavePermissionGroupMutation = { __typename?: 'Mutation', users_savePermissionGroup?: { __typename?: 'PermissionGroup', id: number } | null };

export type Composite_PermissionGroupsQueryVariables = Exact<{
  filter: PermissionGroupFilter;
}>;


export type Composite_PermissionGroupsQuery = { __typename?: 'Query', composite_permissionGroups: Array<{ __typename?: 'PermissionGroup', id: number, name: string, description: string, memberType: MemberType, memberPartyIds: Array<number>, custom?: boolean | null, permissionSets: Array<{ __typename?: 'PermissionGroupPermissionSet', id: string, toggle?: boolean | null, permissionType?: PermissionType | null, feature?: Feature | null }> } | null> };

export type Users_PermissionSetsQueryVariables = Exact<{
  filter: PermissionSetFilter;
}>;


export type Users_PermissionSetsQuery = { __typename?: 'Query', users_permissionSets?: Array<{ __typename?: 'PermissionSet', id: string, name: string, description: string, permissionType?: PermissionType | null, toggle?: boolean | null, feature?: Feature | null } | null> | null };

export type Ppod_PpodCredentialsQueryVariables = Exact<{ [key: string]: never; }>;


export type Ppod_PpodCredentialsQuery = { __typename?: 'Query', ppod_PPODCredentials?: { __typename?: 'PPODCredentials', username: string, password: string, lastSyncSuccessful: boolean } | null };

export type Ppod_SavePpodCredentialsMutationVariables = Exact<{
  input: SavePpodCredentials;
}>;


export type Ppod_SavePpodCredentialsMutation = { __typename?: 'Mutation', ppod_savePPODCredentials: { __typename?: 'PPODCredentials', username: string, password: string } };

export type Users_SchoolInfoQueryVariables = Exact<{ [key: string]: never; }>;


export type Users_SchoolInfoQuery = { __typename?: 'Query', users_schoolInfo?: { __typename?: 'SchoolInfo', id?: number | null, rollNo?: string | null, name?: string | null, email?: string | null, website?: string | null, fax?: string | null, principal?: string | null, boardingFeeFiveDay?: number | null, boardingFeeSixOrSevenDay?: number | null, schoolGender?: string | null, parentAssociation?: boolean | null, studentCouncil?: boolean | null, boardOfManagement?: boolean | null, irishClassification?: string | null, coOperatingSchoolRollNo1?: string | null, coOperatingSchoolRollNo2?: string | null, octoberReturnsContact?: string | null, octoberReturnsPhoneNo?: string | null, octoberReturnsFaxNo?: string | null, octoberReturnsEmail?: string | null, phones?: Array<{ __typename?: 'SchoolPhoneNo', phone?: string | null } | null> | null, addresses?: Array<{ __typename?: 'SchoolAddress', address1?: string | null, address2?: string | null, address3?: string | null, address4?: string | null, county?: string | null, localAuthority?: string | null } | null> | null, chairPeople?: Array<{ __typename?: 'ChairPerson', chairPersonId?: number | null, forename?: string | null, surname?: string | null, phoneNo?: string | null, startDate?: string | null, endDate?: string | null } | null> | null, owners?: Array<{ __typename?: 'Owner', ownerId?: number | null, forename?: string | null, surname?: string | null, addressLine1?: string | null, addressLine2?: string | null, addressLine3?: string | null, addressLine4?: string | null, startDate?: string | null, endDate?: string | null } | null> | null, trustees?: Array<{ __typename?: 'Trustee', trusteeId?: number | null, forename?: string | null, surname?: string | null, addressLine1?: string | null, addressLine2?: string | null, addressLine3?: string | null, addressLine4?: string | null, startDate?: string | null, endDate?: string | null } | null> | null } | null };

export type Ppod_SyncRequestsQueryVariables = Exact<{
  filter: SyncRequestsFilter;
}>;


export type Ppod_SyncRequestsQuery = { __typename?: 'Query', ppod_syncRequests: Array<{ __typename?: 'SyncRequest', id: number, syncRequestStatus: SyncRequestStatus, requesterPartyId: number, failureReason?: string | null, requestedOn: string, requester: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null } }> };

export type Core_RoomsQueryVariables = Exact<{ [key: string]: never; }>;


export type Core_RoomsQuery = { __typename?: 'Query', core_rooms?: Array<{ __typename?: 'Room', roomId: number, name: string, capacity?: number | null, description?: string | null, pools: Array<string>, includeInTimetable: boolean, externalSystemId?: string | null, location?: string | null, disabled: boolean }> | null };

export type CatalogueSubjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type CatalogueSubjectsQuery = { __typename?: 'Query', catalogue_subjects: Array<{ __typename?: 'Subject', id: number, name: string, description?: string | null, shortCode: string, nationalCode?: string | null, subjectSource: SubjectSource, colour?: Colour | null, icon?: string | null }> };

export type Catalogue_UpsertSubjectsMutationVariables = Exact<{
  input: Array<UpsertSubject> | UpsertSubject;
}>;


export type Catalogue_UpsertSubjectsMutation = { __typename?: 'Mutation', catalogue_upsertSubjects?: { __typename?: 'CatalogueSuccess', success: boolean, message?: string | null } | null };

export type Users_InviteUsersMutationVariables = Exact<{
  input?: InputMaybe<Array<InputMaybe<InviteUser>> | InputMaybe<InviteUser>>;
}>;


export type Users_InviteUsersMutation = { __typename?: 'Mutation', users_inviteUsers?: { __typename?: 'InviteUsersResponse', userAccesses: Array<{ __typename?: 'UserAccess', personPartyId: number, webLastLogin?: string | null, mobileLastLogin?: string | null, status?: UserAccessStatus | null, invitationId?: number | null, invitingPersonPartyId?: number | null, invitedOn?: string | null }>, validations?: Array<{ __typename?: 'UserAccessValidation', message: string, associatedUsers: Array<string> } | null> | null } | null };

export type Core_UpdateStudentContactsMutationVariables = Exact<{
  input: Array<UpdateStudentContactInput> | UpdateStudentContactInput;
}>;


export type Core_UpdateStudentContactsMutation = { __typename?: 'Mutation', core_updateStudentContacts: { __typename?: 'Success', success?: boolean | null } };

export type Core_UpdateStudentMutationVariables = Exact<{
  input: Array<UpdateStudentInput> | UpdateStudentInput;
}>;


export type Core_UpdateStudentMutation = { __typename?: 'Mutation', core_updateStudents?: { __typename?: 'Success', success?: boolean | null } | null };

export type Users_UserAccessQueryVariables = Exact<{
  filter?: InputMaybe<UserAccessFilter>;
}>;


export type Users_UserAccessQuery = { __typename?: 'Query', users_userAccess: Array<{ __typename?: 'UserAccess', personPartyId: number, webLastLogin?: string | null, mobileLastLogin?: string | null, status?: UserAccessStatus | null, invitedOn?: string | null, personalInfo: { __typename?: 'PersonalInformation', firstName: string, lastName: string, primaryEmail?: { __typename?: 'EmailAddress', email?: string | null } | null }, contactStudents?: Array<{ __typename?: 'Person', firstName?: string | null, lastName?: string | null } | null> | null, yearGroup?: { __typename?: 'YearGroupEnrollment', shortName: string } | null, yearGroupContacts?: Array<{ __typename?: 'YearGroupEnrollment', shortName: string } | null> | null }> };

export type SendSmsMutationVariables = Exact<{
  input?: InputMaybe<SendSmsInput>;
}>;


export type SendSmsMutation = { __typename?: 'Mutation', communications_sendSms?: string | null };

export type Communications_SmsQueryVariables = Exact<{
  filter?: InputMaybe<SmsFilter>;
}>;


export type Communications_SmsQuery = { __typename?: 'Query', communications_sms: Array<{ __typename?: 'Sms', id: number, name: string, body: string, sentOn: string, canReply: boolean, numRecipients: number, totalCost: number, sender: { __typename?: 'Person', firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null }, recipients: Array<{ __typename?: 'SmsRecipient', recipientPhoneNumber: string, smsStatus: SmsStatus, id?: { __typename?: 'SmsRecipientId', tenant: number, smsId: number, recipientPartyId: number } | null, recipient?: { __typename?: 'Person', firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null } | null }> }> };

export type Communications_SmsCostQueryVariables = Exact<{
  filter?: InputMaybe<SmsCostFilter>;
}>;


export type Communications_SmsCostQuery = { __typename?: 'Query', communications_smsCost?: { __typename?: 'SmsCost', total?: number | null } | null };

export type Communications_SmsCreditQueryVariables = Exact<{ [key: string]: never; }>;


export type Communications_SmsCreditQuery = { __typename?: 'Query', communications_smsCredit?: { __typename?: 'SmsCredit', smsCredit: number } | null };

export type Communications_SmsXeroItemQueryVariables = Exact<{ [key: string]: never; }>;


export type Communications_SmsXeroItemQuery = { __typename?: 'Query', communications_smsXeroItem: Array<{ __typename?: 'XeroItem', code?: string | null, cost?: number | null }> };

export type Communications_SmsTopUpMutationVariables = Exact<{
  input?: InputMaybe<SmsTopUpInput>;
}>;


export type Communications_SmsTopUpMutation = { __typename?: 'Mutation', communications_smsTopUp?: { __typename?: 'SmsTopUpResponse', smsCredit: number } | null };

export type Swm_ApplySubstitutionsMutationVariables = Exact<{
  input: Swm_InsertSubstitution;
}>;


export type Swm_ApplySubstitutionsMutation = { __typename?: 'Mutation', swm_applySubstitutions: { __typename?: 'Success', success?: boolean | null } };

export type Swm_DeleteSubstitutionsMutationVariables = Exact<{
  input: Swm_DeleteSubstitution;
}>;


export type Swm_DeleteSubstitutionsMutation = { __typename?: 'Mutation', swm_deleteSubstitutions: { __typename?: 'Success', success?: boolean | null } };

export type Swm_AbsenceTypesQueryVariables = Exact<{
  filter?: InputMaybe<Swm_StaffAbsenceTypeFilter>;
}>;


export type Swm_AbsenceTypesQuery = { __typename?: 'Query', swm_absenceTypes: Array<{ __typename?: 'SWM_StaffAbsenceType', absenceTypeId: number, name: string, nameTextId?: number | null, description?: string | null, descriptionTextId?: number | null, code: string, availableForRequests: boolean }> };

export type Swm_UpsertAbsenceTypeMutationVariables = Exact<{
  input?: InputMaybe<Array<InputMaybe<Swm_UpsertStaffAbsenceType>> | InputMaybe<Swm_UpsertStaffAbsenceType>>;
}>;


export type Swm_UpsertAbsenceTypeMutation = { __typename?: 'Mutation', swm_upsertAbsenceType: Array<{ __typename?: 'SWM_StaffAbsenceType', absenceTypeId: number }> };

export type Swm_AbsencesQueryVariables = Exact<{
  filter?: InputMaybe<Swm_StaffAbsenceFilter>;
}>;


export type Swm_AbsencesQuery = { __typename?: 'Query', swm_absences: Array<{ __typename?: 'SWM_StaffAbsence', absenceId: number, absenceTypeId: number, staffPartyId: number, isLongTermLeave: boolean, longTermLeaveGroupsRequired?: number | null, longTermLeaveGroupsApplied?: number | null, absenceReasonText?: string | null, substitutionRequired?: boolean | null, absenceType: { __typename?: 'SWM_StaffAbsenceType', name: string, code: string }, staff?: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null } | null, dates: Array<{ __typename?: 'SWM_StaffAbsenceDate', continuousStartDate?: string | null, continuousEndDate?: string | null, individualDates?: Array<string> | null, partialAbsence: boolean, leavesAt?: string | null, returnsAt?: string | null }>, longTermLeaveGroups: Array<{ __typename?: 'SWM_StaffAbsenceLongTermLeaveGroup', groupId: number, coveringStaffId?: number | null, group: { __typename?: 'GeneralGroup', name: string, avatarUrl?: string | null } | { __typename?: 'ProgrammeStageEnrollment', name: string, avatarUrl?: string | null } | { __typename?: 'SubjectGroup', name: string, avatarUrl?: string | null } | { __typename?: 'YearGroupEnrollment', name: string, avatarUrl?: string | null }, coveringStaff?: { __typename?: 'Staff', person: { __typename?: 'Person', firstName?: string | null, lastName?: string | null } } | null }> }> };

export type Swm_UpsertAbsenceMutationVariables = Exact<{
  input: Array<Swm_UpsertStaffAbsence> | Swm_UpsertStaffAbsence;
}>;


export type Swm_UpsertAbsenceMutation = { __typename?: 'Mutation', swm_upsertAbsence: Array<{ __typename?: 'SWM_StaffAbsence', staffPartyId: number, absenceTypeId: number, fromAbsenceRequestId?: number | null, absenceReasonText?: string | null }> };

export type Swm_DeleteAbsenceMutationVariables = Exact<{
  input: Swm_DeleteStaffAbsence;
}>;


export type Swm_DeleteAbsenceMutation = { __typename?: 'Mutation', swm_deleteAbsence: { __typename?: 'Success', success?: boolean | null } };

export type Swm_SubstitutionLookupQueryVariables = Exact<{
  filter?: InputMaybe<Swm_SubstitutionLookupFilter>;
}>;


export type Swm_SubstitutionLookupQuery = { __typename?: 'Query', swm_substitutionLookup: { __typename?: 'SWM_SubstitutionLookup', staff: Array<{ __typename?: 'SWM_SubstitutionLookupStaff', available: boolean, clashingEvents?: Array<string> | null, staff: { __typename?: 'Staff', person: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null }, extensions?: { __typename?: 'StaffGraphqlExtension', timetableSummary?: { __typename?: 'TT_TeacherTimetableSummary', fulltimePeriods: number } | null, substitutionSummary?: { __typename?: 'SWM_SubstitutionSummary', substitutionCountThisWeek: number, substitutionTimeThisWeekMinutes: number, substitutionCountThisYear: number, substitutionTimeThisYearMinutes: number } | null } | null }, substitutionStats: { __typename?: 'SWM_SubstitutionSummaryForWeek', sandsWeekCount: number, sandsWeekMinutes: number, sandsYearCount: number, sandsYearMinutes: number, casualWeekCount: number, casualWeekMinutes: number } }>, freeRooms: Array<{ __typename?: 'Room', roomId: number, name: string, pools: Array<string> }>, clashingRooms: Array<{ __typename?: 'ClashingRooms', clash: Array<string>, room: { __typename?: 'Room', roomId: number, name: string, pools: Array<string> } }> } };

export type Swm_EventsForSubstitutionsByStaffByPeriodQueryVariables = Exact<{
  filter?: InputMaybe<Swm_EventsForSubstitutionFilter>;
}>;


export type Swm_EventsForSubstitutionsByStaffByPeriodQuery = { __typename?: 'Query', swm_eventsForSubstitutionsByStaffByPeriod: { __typename?: 'SWM_StaffSubstitutionEventByDay', eventsByStaff: Array<{ __typename?: 'SWM_EventsForSubstitutionStaff', staff: { __typename?: 'Staff', person: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null } }, substitutionEventsByDay: Array<{ __typename?: 'SWM_EventsForSubstitutionStaffByDay', dayInfo: { __typename?: 'CalendarDayInfo', date: string, startTime?: string | null, endTime?: string | null, dayType: SchoolDayType, periods: Array<{ __typename?: 'CalendarGridPeriodInfo', startTime: string, endTime: string, type: CalendarGridPeriodType }> }, substitutionEventsByPeriod: Array<{ __typename?: 'SWM_CalendarSubstitution', absenceId?: number | null, staffPartyId: number, event: { __typename?: 'CalendarEvent', eventId: number, startTime: string, endTime: string, type: CalendarEventType, allDayEvent: boolean, colour?: Colour | null, name: string, description?: string | null, attendees: Array<{ __typename?: 'CalendarEventAttendee', partyInfo?: { __typename: 'GeneralGroup' } | { __typename: 'ProgrammeStageEnrollment' } | { __typename: 'Staff', person: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null } } | { __typename: 'Student' } | { __typename: 'StudentContact' } | { __typename: 'SubjectGroup' } | { __typename: 'YearGroupEnrollment' } | null }>, rooms: Array<{ __typename?: 'Room', name: string, roomId: number }>, tags: Array<{ __typename?: 'CalendarTag', label: string, context: Calendar_TagContext }> }, substitution?: { __typename?: 'SWM_Substitution', substitutionId?: number | null, note?: string | null, originalStaff: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null }, substituteStaff: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null }, substitutionType: { __typename?: 'SWM_SubstitutionType', name: string, description?: string | null, code: string }, substituteRoom?: { __typename?: 'Room', name: string, roomId: number } | null } | null }> }> }> } };

export type Swm_SubstitutionTypesQueryVariables = Exact<{
  filter?: InputMaybe<Swm_StaffSubstitutionTypeFilter>;
}>;


export type Swm_SubstitutionTypesQuery = { __typename?: 'Query', swm_substitutionTypes: Array<{ __typename?: 'SWM_SubstitutionType', substitutionTypeId: number, name: string, description?: string | null, code: string }> };

export type Tt_TimetablesQueryVariables = Exact<{
  filter?: InputMaybe<TtTimetableFilter>;
}>;


export type Tt_TimetablesQuery = { __typename?: 'Query', tt_timetables: Array<{ __typename?: 'TTTimetable', timetableId: number, name: string, liveStatus?: { __typename?: 'TT_LiveStatus', totalChanges: number, lessonChanges: number, timetableGroupChanges: number, lastPublishedDate?: string | null } | null }> };

export type Tt_AddLessonMutationVariables = Exact<{
  input?: InputMaybe<Tt_AddLessonInput>;
}>;


export type Tt_AddLessonMutation = { __typename?: 'Mutation', tt_addLesson: { __typename?: 'Success', success?: boolean | null } };

export type Tt_AddLessonOptionsQueryVariables = Exact<{
  filter?: InputMaybe<Tt_AddLessonFilter>;
}>;


export type Tt_AddLessonOptionsQuery = { __typename?: 'Query', tt_addLessonOptions: { __typename?: 'Tt_AddLessonOptions', freeStaffIds: Array<number>, freeTimetableGroupIds: Array<number>, freeRoomIds: Array<number>, freeStaff: Array<{ __typename?: 'Staff', person: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, nameTextId: number, name: string } | null } }>, freeTimetableGroups: Array<{ __typename?: 'GeneralGroup', partyId: number, name: string, avatarUrl?: string | null } | { __typename?: 'ProgrammeStageEnrollment', partyId: number, name: string, avatarUrl?: string | null } | { __typename?: 'SubjectGroup', partyId: number, name: string, avatarUrl?: string | null } | { __typename?: 'YearGroupEnrollment', partyId: number, name: string, avatarUrl?: string | null }>, freeRooms: Array<{ __typename?: 'Room', roomId: number, name: string, capacity?: number | null, description?: string | null, pools: Array<string>, includeInTimetable: boolean, externalSystemId?: string | null, location?: string | null, disabled: boolean }> } };

export type Tt_SwapTeacherOptionsQueryVariables = Exact<{
  filter: TtSwapTeacherFilter;
}>;


export type Tt_SwapTeacherOptionsQuery = { __typename?: 'Query', tt_swapTeacherOptions: { __typename?: 'TTSwapTeacherOptions', timeslots: Array<{ __typename?: 'TTTimeslot', id: { __typename?: 'TTTimeslotId', gridIdx: number, dayIdx: number, periodIdx: number }, info: { __typename?: 'TTTimeslotInfo', dayOfWeek: number, startTime: string, endTime: string } }>, teachers: Array<{ __typename?: 'TTSwapTeacherTeacherInfo', staffId: number, teacher: { __typename?: 'Staff', person: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, nameTextId: number, name: string } | null } }, lessonOnTimeslots: Array<{ __typename?: 'TTIndividualViewLesson', id: { __typename?: 'TTIndividualViewLessonId', lessonIdx: number, lessonInstanceIdx: number, timetableGroupId: number }, partyGroup: { __typename?: 'GeneralGroup', name: string } | { __typename?: 'ProgrammeStageEnrollment', name: string } | { __typename?: 'SubjectGroup', name: string } | { __typename?: 'YearGroupEnrollment', name: string } } | null> }> } };

export type Tt_SwapRoomOptionsQueryVariables = Exact<{
  filter: TtSwapRoomFilter;
}>;


export type Tt_SwapRoomOptionsQuery = { __typename?: 'Query', tt_swapRoomOptions: { __typename?: 'TTSwapRoomOptions', timeslots: Array<{ __typename?: 'TTTimeslot', id: { __typename?: 'TTTimeslotId', gridIdx: number, dayIdx: number, periodIdx: number }, info: { __typename?: 'TTTimeslotInfo', dayOfWeek: number, startTime: string, endTime: string } }>, rooms: Array<{ __typename?: 'TTSwapRoomRoomInfo', roomId: number, room: { __typename?: 'Room', name: string, capacity?: number | null, description?: string | null, pools: Array<string> }, lessonOnTimeslots: Array<{ __typename?: 'TTIndividualViewLesson', id: { __typename?: 'TTIndividualViewLessonId', lessonIdx: number, lessonInstanceIdx: number, timetableGroupId: number }, partyGroup: { __typename?: 'GeneralGroup', name: string } | { __typename?: 'ProgrammeStageEnrollment', name: string } | { __typename?: 'SubjectGroup', name: string } | { __typename?: 'YearGroupEnrollment', name: string } } | null> }> } };

export type Tt_RemoveLessonMutationVariables = Exact<{
  input?: InputMaybe<Array<Tt_RemoveLessonInput> | Tt_RemoveLessonInput>;
}>;


export type Tt_RemoveLessonMutation = { __typename?: 'Mutation', tt_removeLesson: { __typename?: 'Success', success?: boolean | null } };

export type Tt_EditLessonOptionsQueryVariables = Exact<{
  filter?: InputMaybe<Tt_EditLessonFilter>;
}>;


export type Tt_EditLessonOptionsQuery = { __typename?: 'Query', tt_editLessonOptions: { __typename?: 'Tt_AddLessonOptions', freeStaffIds: Array<number>, freeTimetableGroupIds: Array<number>, freeRoomIds: Array<number>, freeStaff: Array<{ __typename?: 'Staff', person: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, nameTextId: number, name: string } | null } }>, freeTimetableGroups: Array<{ __typename?: 'GeneralGroup', partyId: number, name: string, avatarUrl?: string | null } | { __typename?: 'ProgrammeStageEnrollment', partyId: number, name: string, avatarUrl?: string | null } | { __typename?: 'SubjectGroup', partyId: number, name: string, avatarUrl?: string | null } | { __typename?: 'YearGroupEnrollment', partyId: number, name: string, avatarUrl?: string | null }>, freeRooms: Array<{ __typename?: 'Room', roomId: number, name: string, capacity?: number | null, description?: string | null, pools: Array<string>, includeInTimetable: boolean, externalSystemId?: string | null, location?: string | null, disabled: boolean }> } };

export type Tt_PublishMutationVariables = Exact<{
  input: TtPublishTimetableInput;
}>;


export type Tt_PublishMutation = { __typename?: 'Mutation', tt_publish: { __typename?: 'TT_PublishResult', success: boolean } };

export type Tt_ResetMutationVariables = Exact<{
  input: Tt_Reset;
}>;


export type Tt_ResetMutation = { __typename?: 'Mutation', tt_reset: { __typename?: 'Success', success?: boolean | null } };

export type Tt_ResourceTimetableViewQueryVariables = Exact<{
  filter: TtResourceTimetableViewFilter;
}>;


export type Tt_ResourceTimetableViewQuery = { __typename?: 'Query', tt_resourceTimetableView: { __typename?: 'TTResourceTimetableView', timeslots: Array<{ __typename?: 'TTResourceTimeslotView', timeslotIds?: { __typename?: 'TTTimeslotId', gridIdx: number, dayIdx: number, periodIdx: number } | null, timeslots?: { __typename?: 'TTTimeslotInfo', dayOfWeek: number, startTime: string, endTime: string, periodType: TtGridPeriodType } | null, lessons: Array<{ __typename?: 'TTIndividualViewLesson', spread: number, id: { __typename?: 'TTIndividualViewLessonId', lessonIdx: number, lessonInstanceIdx: number, timetableGroupId: number }, timeslotId?: { __typename?: 'TTTimeslotId', gridIdx: number, dayIdx: number, periodIdx: number } | null, timeslotInfo?: { __typename?: 'TTTimeslotInfo', startTime: string, endTime: string } | null, partyGroup: { __typename: 'GeneralGroup', partyId: number, name: string, avatarUrl?: string | null } | { __typename: 'ProgrammeStageEnrollment', partyId: number, name: string, avatarUrl?: string | null } | { __typename: 'SubjectGroup', partyId: number, name: string, avatarUrl?: string | null, subjects: Array<{ __typename?: 'Subject', name: string, colour?: Colour | null }> } | { __typename: 'YearGroupEnrollment', partyId: number, name: string, avatarUrl?: string | null }, room?: { __typename?: 'Room', roomId: number, name: string } | null, teachers: Array<{ __typename?: 'Staff', person: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null } }> }> }> } };

export type Tt_GroupsQueryVariables = Exact<{
  filter: Tt_GroupsFilter;
}>;


export type Tt_GroupsQuery = { __typename?: 'Query', tt_groups: Array<{ __typename?: 'TT_Groups', studentMembershipType: TtGroupStudentMembershipTypeEnum, partyGroup: { __typename: 'GeneralGroup', name: string, partyId: number, avatarUrl?: string | null } | { __typename: 'ProgrammeStageEnrollment', name: string, partyId: number, avatarUrl?: string | null } | { __typename: 'SubjectGroup', subjectGroupType: SubjectGroupType, subjectIds?: Array<number | null> | null, name: string, partyId: number, avatarUrl?: string | null, yearGroups: Array<{ __typename?: 'YearGroupEnrollment', name: string }>, subjects: Array<{ __typename?: 'Subject', colour?: Colour | null }>, studentMembershipType?: { __typename?: 'SubjectGroupStudentMembershipType', type: SubjectGroupStudentMembershipTypeEnum, classGroupId?: number | null, blockId?: string | null, classGroupName?: string | null } | null } | { __typename: 'YearGroupEnrollment', name: string, partyId: number, avatarUrl?: string | null }, teachers: Array<{ __typename?: 'Staff', person: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, nameTextId: number, name: string } | null } }>, lessons: Array<{ __typename?: 'TTIndividualViewLesson', spread: number, id: { __typename?: 'TTIndividualViewLessonId', lessonIdx: number, lessonInstanceIdx: number, timetableGroupId: number }, timeslotId?: { __typename?: 'TTTimeslotId', gridIdx: number, dayIdx: number, periodIdx: number } | null, timeslotInfo?: { __typename?: 'TTTimeslotInfo', startTime: string, endTime: string } | null, partyGroup: { __typename: 'GeneralGroup', partyId: number, name: string, avatarUrl?: string | null } | { __typename: 'ProgrammeStageEnrollment', partyId: number, name: string, avatarUrl?: string | null } | { __typename: 'SubjectGroup', partyId: number, name: string, avatarUrl?: string | null, subjects: Array<{ __typename?: 'Subject', name: string, colour?: Colour | null }> } | { __typename: 'YearGroupEnrollment', partyId: number, name: string, avatarUrl?: string | null }, room?: { __typename?: 'Room', roomId: number, name: string } | null, teachers: Array<{ __typename?: 'Staff', person: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null } }> }> }> };

export type Tt_SwapMutationVariables = Exact<{
  input: TtSwapsInput;
}>;


export type Tt_SwapMutation = { __typename?: 'Mutation', tt_swap: { __typename?: 'Success', success?: boolean | null } };

export type Tt_UnpublishedChangesQueryVariables = Exact<{
  filter?: InputMaybe<TtTimetableFilter>;
}>;


export type Tt_UnpublishedChangesQuery = { __typename?: 'Query', tt_timetables: Array<{ __typename?: 'TTTimetable', timetableId: number, liveStatus?: { __typename?: 'TT_LiveStatus', totalChanges: number, publishDiff?: { __typename?: 'TTPublishDiff', lessonDiffs: Array<{ __typename?: 'TTPublishDiffLesson', type: Tt_DiffType, roomChanged: boolean, teachersChanged: boolean, timeslotChanged: boolean, newLesson: { __typename?: 'TTIndividualViewLesson', spread: number, id: { __typename?: 'TTIndividualViewLessonId', lessonIdx: number, lessonInstanceIdx: number, timetableGroupId: number }, timeslotId?: { __typename?: 'TTTimeslotId', gridIdx: number, dayIdx: number, periodIdx: number } | null, timeslotInfo?: { __typename?: 'TTTimeslotInfo', startTime: string, endTime: string } | null, partyGroup: { __typename: 'GeneralGroup', partyId: number, name: string, avatarUrl?: string | null } | { __typename: 'ProgrammeStageEnrollment', partyId: number, name: string, avatarUrl?: string | null } | { __typename: 'SubjectGroup', partyId: number, name: string, avatarUrl?: string | null, subjects: Array<{ __typename?: 'Subject', name: string, colour?: Colour | null }> } | { __typename: 'YearGroupEnrollment', partyId: number, name: string, avatarUrl?: string | null }, room?: { __typename?: 'Room', roomId: number, name: string } | null, teachers: Array<{ __typename?: 'Staff', person: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null } }> }, oldLesson: { __typename?: 'TTIndividualViewLesson', spread: number, id: { __typename?: 'TTIndividualViewLessonId', lessonIdx: number, lessonInstanceIdx: number, timetableGroupId: number }, timeslotId?: { __typename?: 'TTTimeslotId', gridIdx: number, dayIdx: number, periodIdx: number } | null, timeslotInfo?: { __typename?: 'TTTimeslotInfo', startTime: string, endTime: string } | null, partyGroup: { __typename: 'GeneralGroup', partyId: number, name: string, avatarUrl?: string | null } | { __typename: 'ProgrammeStageEnrollment', partyId: number, name: string, avatarUrl?: string | null } | { __typename: 'SubjectGroup', partyId: number, name: string, avatarUrl?: string | null, subjects: Array<{ __typename?: 'Subject', name: string, colour?: Colour | null }> } | { __typename: 'YearGroupEnrollment', partyId: number, name: string, avatarUrl?: string | null }, room?: { __typename?: 'Room', roomId: number, name: string } | null, teachers: Array<{ __typename?: 'Staff', person: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null } }> } }>, groupDiffs: Array<{ __typename?: 'TTPublishDiffGroup', type: Tt_DiffType, teachersChanged: boolean, newGroup: { __typename?: 'TT_Groups', partyId: number, partyGroup: { __typename: 'GeneralGroup', partyId: number, name: string, avatarUrl?: string | null } | { __typename: 'ProgrammeStageEnrollment', partyId: number, name: string, avatarUrl?: string | null } | { __typename: 'SubjectGroup', partyId: number, name: string, avatarUrl?: string | null, subjects: Array<{ __typename?: 'Subject', name: string, colour?: Colour | null }> } | { __typename: 'YearGroupEnrollment', partyId: number, name: string, avatarUrl?: string | null }, teachers: Array<{ __typename?: 'Staff', person: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null } }> }, oldGroup: { __typename?: 'TT_Groups', partyId: number, partyGroup: { __typename: 'GeneralGroup', partyId: number, name: string, avatarUrl?: string | null } | { __typename: 'ProgrammeStageEnrollment', partyId: number, name: string, avatarUrl?: string | null } | { __typename: 'SubjectGroup', partyId: number, name: string, avatarUrl?: string | null, subjects: Array<{ __typename?: 'Subject', name: string, colour?: Colour | null }> } | { __typename: 'YearGroupEnrollment', partyId: number, name: string, avatarUrl?: string | null }, teachers: Array<{ __typename?: 'Staff', person: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null } }> } }> } | null } | null }> };

export type Tt_UpdateTimetableGroupMutationVariables = Exact<{
  input: Tt_UpdateTimetableGroupInput;
}>;


export type Tt_UpdateTimetableGroupMutation = { __typename?: 'Mutation', tt_updateTimetableGroup: { __typename?: 'Success', success?: boolean | null } };

export type Tt_UpsertTimetableGroupMutationVariables = Exact<{
  input: Tt_UpsertSubjectGroup;
}>;


export type Tt_UpsertTimetableGroupMutation = { __typename?: 'Mutation', tt_upsertSubjectGroup: { __typename?: 'Success', success?: boolean | null } };

export type Tt_EditLessonInstanceMutationVariables = Exact<{
  input: TtEditLessonPeriodInstanceWrapper;
}>;


export type Tt_EditLessonInstanceMutation = { __typename?: 'Mutation', tt_editLessonInstance: Array<{ __typename?: 'TTIndividualViewLesson', id: { __typename?: 'TTIndividualViewLessonId', lessonIdx: number, lessonInstanceIdx: number, timetableGroupId: number } }> };

export type Admin__Party_PeopleQueryVariables = Exact<{
  tenant: Scalars['Int'];
}>;


export type Admin__Party_PeopleQuery = { __typename?: 'Query', admin__party_people?: Array<{ __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null }> | null };

export type Admin__TenantsQueryVariables = Exact<{ [key: string]: never; }>;


export type Admin__TenantsQuery = { __typename?: 'Query', admin__tenants?: Array<{ __typename?: 'Tenant', tenant: number, name: string, imgUrl?: string | null } | null> | null };

export type Admin__ResetTenantCacheMutationVariables = Exact<{
  input?: InputMaybe<Scalars['Int']>;
}>;


export type Admin__ResetTenantCacheMutation = { __typename?: 'Mutation', admin__resetTenantCache: { __typename?: 'Success', success?: boolean | null } };

export type Core_AcademicNamespacesQueryVariables = Exact<{ [key: string]: never; }>;


export type Core_AcademicNamespacesQuery = { __typename?: 'Query', core_academicNamespaces?: Array<{ __typename?: 'AcademicNamespace', academicNamespaceId: number, type: AcademicNamespaceType, name: string, year: number, description?: string | null, isActiveDefaultNamespace: boolean, startDate: string, endDate: string }> | null };

export type Catalogue_ProgrammeStagesQueryVariables = Exact<{ [key: string]: never; }>;


export type Catalogue_ProgrammeStagesQuery = { __typename?: 'Query', catalogue_programmeStages: Array<{ __typename?: 'ProgrammeStage', id: number, name: string }> };

export type YearsQueryVariables = Exact<{
  filter?: InputMaybe<YearGroupFilter>;
}>;


export type YearsQuery = { __typename?: 'Query', catalogue_years: Array<{ __typename?: 'YearGroup', yearGroupId: number, name: string }> };

export type MyAuthDetailsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyAuthDetailsQuery = { __typename?: 'Query', myAuthDetails?: { __typename?: 'GlobalUser', id: number, email?: string | null, name?: string | null, defaultProfileId?: number | null, activeProfileId?: number | null, profiles?: Array<{ __typename?: 'Profile', id: number, nickName?: string | null, avatarUrl?: string | null, permissionIds?: Array<string | null> | null, partyId?: number | null, tenant: { __typename?: 'Tenant', tenant: number, name: string, imgUrl?: string | null }, profileType?: { __typename?: 'ProfileType', name: string, description: string, userType: UserType } | null } | null> | null } | null };


export const SearchQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"searchQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"search_search"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentPartyId"}}]}}]}}]}}]} as unknown as DocumentNode<SearchQueryQuery, SearchQueryQueryVariables>;
export const AssessmentSubjectGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"assessmentSubjectGroups"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AssessmentSubjectGroupsFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assessment_assessmentSubjectGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subjectGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"subjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"staff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"yearGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"yearGroupId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"resultsTotal"}},{"kind":"Field","name":{"kind":"Name","value":"resultsEntered"}},{"kind":"Field","name":{"kind":"Name","value":"commentsEntered"}},{"kind":"Field","name":{"kind":"Name","value":"commentsTotal"}}]}}]}}]} as unknown as DocumentNode<AssessmentSubjectGroupsQuery, AssessmentSubjectGroupsQueryVariables>;
export const AssessmentsListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"assessmentsList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AssessmentFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assessment_assessment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"assessmentType"}},{"kind":"Field","name":{"kind":"Name","value":"academicNamespaceId"}},{"kind":"Field","name":{"kind":"Name","value":"years"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"yearGroupId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"publish"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}}]} as unknown as DocumentNode<AssessmentsListQuery, AssessmentsListQueryVariables>;
export const AssessmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"assessment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AssessmentFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assessment_assessment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"assessmentType"}},{"kind":"Field","name":{"kind":"Name","value":"academicNamespaceId"}},{"kind":"Field","name":{"kind":"Name","value":"years"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"yearGroupId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"publish"}},{"kind":"Field","name":{"kind":"Name","value":"createdOn"}},{"kind":"Field","name":{"kind":"Name","value":"gradeType"}},{"kind":"Field","name":{"kind":"Name","value":"gradeSets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gradeSetId"}},{"kind":"Field","name":{"kind":"Name","value":"gradeSetName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"passFailThreshold"}},{"kind":"Field","name":{"kind":"Name","value":"captureTarget"}},{"kind":"Field","name":{"kind":"Name","value":"commentType"}},{"kind":"Field","name":{"kind":"Name","value":"commentLength"}},{"kind":"Field","name":{"kind":"Name","value":"commentBank"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commentBankId"}},{"kind":"Field","name":{"kind":"Name","value":"commentBankName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"capturePrincipalComment"}},{"kind":"Field","name":{"kind":"Name","value":"captureYearHeadComment"}},{"kind":"Field","name":{"kind":"Name","value":"captureHouseMasterComment"}},{"kind":"Field","name":{"kind":"Name","value":"publish"}},{"kind":"Field","name":{"kind":"Name","value":"publishLearner"}},{"kind":"Field","name":{"kind":"Name","value":"extraFields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"assessmentId"}},{"kind":"Field","name":{"kind":"Name","value":"extraFieldType"}},{"kind":"Field","name":{"kind":"Name","value":"gradeSetId"}},{"kind":"Field","name":{"kind":"Name","value":"commentBankId"}},{"kind":"Field","name":{"kind":"Name","value":"commentBankName"}},{"kind":"Field","name":{"kind":"Name","value":"selectOptions"}},{"kind":"Field","name":{"kind":"Name","value":"commentLength"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"captureTutorComment"}}]}}]}}]} as unknown as DocumentNode<AssessmentQuery, AssessmentQueryVariables>;
export const CommentBankAssessmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"commentBankAssessment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CommentBankFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assessment_commentBank"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CommentBankAssessmentQuery, CommentBankAssessmentQueryVariables>;
export const CommentBanksWithCommentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"commentBanksWithComments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CommentBankFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assessment_commentBank"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"comments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}}]}}]}}]} as unknown as DocumentNode<CommentBanksWithCommentsQuery, CommentBanksWithCommentsQueryVariables>;
export const SaveAssessmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"saveAssessment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SaveAssessmentInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assessment_saveAssessment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"years"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}}]}}]}}]} as unknown as DocumentNode<SaveAssessmentMutation, SaveAssessmentMutationVariables>;
export const DashboardAssessmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"dashboardAssessment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DashboardAssessmentFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assessment_dashboardAssessment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"assessmentType"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"result"}},{"kind":"Field","name":{"kind":"Name","value":"grade"}},{"kind":"Field","name":{"kind":"Name","value":"studyLevel"}}]}}]}}]}}]} as unknown as DocumentNode<DashboardAssessmentQuery, DashboardAssessmentQueryVariables>;
export const Assessment_CalculateGradeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"assessment_calculateGrade"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CalculateGradeFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assessment_calculateGrade"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"grade"}}]}}]}}]} as unknown as DocumentNode<Assessment_CalculateGradeQuery, Assessment_CalculateGradeQueryVariables>;
export const Assessment_AssessmentResultDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"assessment_assessmentResult"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AssessmentResultFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assessment_assessmentResult"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"assessmentId"}},{"kind":"Field","name":{"kind":"Name","value":"studentPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"student"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"studentClassGroup"}},{"kind":"Field","name":{"kind":"Name","value":"studentProgramme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shortName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subjectGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"studentStudyLevel"}},{"kind":"Field","name":{"kind":"Name","value":"result"}},{"kind":"Field","name":{"kind":"Name","value":"targetResult"}},{"kind":"Field","name":{"kind":"Name","value":"gradeResult"}},{"kind":"Field","name":{"kind":"Name","value":"gradeNameTextId"}},{"kind":"Field","name":{"kind":"Name","value":"targetGradeResult"}},{"kind":"Field","name":{"kind":"Name","value":"targetGradeNameTextId"}},{"kind":"Field","name":{"kind":"Name","value":"teacherComment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"assessmentId"}},{"kind":"Field","name":{"kind":"Name","value":"studentPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"commentBankCommentId"}},{"kind":"Field","name":{"kind":"Name","value":"commenterUserType"}},{"kind":"Field","name":{"kind":"Name","value":"commenterPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"subjectGroupPartyId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"extraFields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"extraFieldType"}},{"kind":"Field","name":{"kind":"Name","value":"assessmentResultId"}},{"kind":"Field","name":{"kind":"Name","value":"assessmentExtraFieldId"}},{"kind":"Field","name":{"kind":"Name","value":"result"}},{"kind":"Field","name":{"kind":"Name","value":"gradeSetGradeId"}},{"kind":"Field","name":{"kind":"Name","value":"gradeNameTextId"}},{"kind":"Field","name":{"kind":"Name","value":"commentBankCommentId"}}]}}]}}]}}]} as unknown as DocumentNode<Assessment_AssessmentResultQuery, Assessment_AssessmentResultQueryVariables>;
export const Assessment_SaveAssessmentResultsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"assessment_saveAssessmentResults"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SaveAssessmentResultInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assessment_saveAssessmentResults"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<Assessment_SaveAssessmentResultsMutation, Assessment_SaveAssessmentResultsMutationVariables>;
export const Attendance_ParentalAttendanceRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"attendance_parentalAttendanceRequests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ParentalAttendanceRequestFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attendance_parentalAttendanceRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"adminNote"}},{"kind":"Field","name":{"kind":"Name","value":"attendanceCode"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"approvedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"approvedByPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"attendanceCodeId"}},{"kind":"Field","name":{"kind":"Name","value":"contactPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"from"}},{"kind":"Field","name":{"kind":"Name","value":"parentNote"}},{"kind":"Field","name":{"kind":"Name","value":"requestType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"studentPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"to"}},{"kind":"Field","name":{"kind":"Name","value":"classGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"contact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"relationships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"relationshipType"}},{"kind":"Field","name":{"kind":"Name","value":"studentPartyId"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdOn"}},{"kind":"Field","name":{"kind":"Name","value":"student"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]}}]} as unknown as DocumentNode<Attendance_ParentalAttendanceRequestsQuery, Attendance_ParentalAttendanceRequestsQueryVariables>;
export const Attendance_SaveParentalAttendanceRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"attendance_saveParentalAttendanceRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SaveParentalAttendanceRequest"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attendance_saveParentalAttendanceRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<Attendance_SaveParentalAttendanceRequestMutation, Attendance_SaveParentalAttendanceRequestMutationVariables>;
export const Attendance_WithdrawParentalAttendanceRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"attendance_withdrawParentalAttendanceRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"WithdrawParentalAttendanceRequest"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attendance_withdrawParentalAttendanceRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<Attendance_WithdrawParentalAttendanceRequestMutation, Attendance_WithdrawParentalAttendanceRequestMutationVariables>;
export const Attendance_AttendanceCodesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"attendance_attendanceCodes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AttendanceCodeFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attendance_attendanceCodes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"visibleForTeacher"}},{"kind":"Field","name":{"kind":"Name","value":"visibleForContact"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}},{"kind":"Field","name":{"kind":"Name","value":"codeType"}},{"kind":"Field","name":{"kind":"Name","value":"sessionCodeType"}}]}}]}}]} as unknown as DocumentNode<Attendance_AttendanceCodesQuery, Attendance_AttendanceCodesQueryVariables>;
export const Attendance_SaveAttendanceCodeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"attendance_saveAttendanceCode"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SaveAttendanceCodeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attendance_saveAttendanceCode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<Attendance_SaveAttendanceCodeMutation, Attendance_SaveAttendanceCodeMutationVariables>;
export const Attendance_SaveEventAttendanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"attendance_saveEventAttendance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SaveEventAttendanceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attendance_saveEventAttendance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"attendanceCodeId"}},{"kind":"Field","name":{"kind":"Name","value":"personPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"date"}}]}}]}}]} as unknown as DocumentNode<Attendance_SaveEventAttendanceMutation, Attendance_SaveEventAttendanceMutationVariables>;
export const Attendance_BulkAttendanceActionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"attendance_bulkAttendanceActions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Attendance_BulkAttendanceActionFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attendance_bulkAttendanceActions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attendanceForPartyIds"}},{"kind":"Field","name":{"kind":"Name","value":"parties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PartyPerson"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SubjectGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"actualName"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GeneralGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"generalGroupType"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"classGroupInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"attendanceCodeId"}},{"kind":"Field","name":{"kind":"Name","value":"attendanceCode"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"visibleForTeacher"}},{"kind":"Field","name":{"kind":"Name","value":"visibleForContact"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}},{"kind":"Field","name":{"kind":"Name","value":"descriptionTextId"}},{"kind":"Field","name":{"kind":"Name","value":"codeType"}},{"kind":"Field","name":{"kind":"Name","value":"sessionCodeType"}},{"kind":"Field","name":{"kind":"Name","value":"custom"}}]}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"leavesAt"}},{"kind":"Field","name":{"kind":"Name","value":"returnsAt"}},{"kind":"Field","name":{"kind":"Name","value":"partial"}},{"kind":"Field","name":{"kind":"Name","value":"note"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdOn"}}]}}]}}]} as unknown as DocumentNode<Attendance_BulkAttendanceActionsQuery, Attendance_BulkAttendanceActionsQueryVariables>;
export const Attendance_SaveBulkAttendanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"attendance_saveBulkAttendance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Attendance_SaveBulkAttendanceInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attendance_saveBulkAttendance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<Attendance_SaveBulkAttendanceMutation, Attendance_SaveBulkAttendanceMutationVariables>;
export const Attendance_CalendarAttendanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"attendance_calendarAttendance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarAttendanceFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attendance_calendarAttendance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalPresent"}},{"kind":"Field","name":{"kind":"Name","value":"totalLate"}},{"kind":"Field","name":{"kind":"Name","value":"totalAbsent"}},{"kind":"Field","name":{"kind":"Name","value":"totalUnexplained"}},{"kind":"Field","name":{"kind":"Name","value":"totalNotTaken"}},{"kind":"Field","name":{"kind":"Name","value":"attendances"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]} as unknown as DocumentNode<Attendance_CalendarAttendanceQuery, Attendance_CalendarAttendanceQueryVariables>;
export const Calendar_CalendarDayBellTimesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"calendar_calendarDayBellTimes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarDayBellTimeFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendar_calendarDayBellTimes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"bellTimeIds"}},{"kind":"Field","name":{"kind":"Name","value":"bellTimes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<Calendar_CalendarDayBellTimesQuery, Calendar_CalendarDayBellTimesQueryVariables>;
export const Calendar_CalendarInformationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"calendar_calendarInformation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarEventFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendar_calendarEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resources"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"lessonInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subjectGroupId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"colour"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"extensions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventAttendance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"attendanceCodeId"}},{"kind":"Field","name":{"kind":"Name","value":"attendanceCode"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"personPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"note"}},{"kind":"Field","name":{"kind":"Name","value":"createdByPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedByPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<Calendar_CalendarInformationQuery, Calendar_CalendarInformationQueryVariables>;
export const StudentSessionAttendanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"studentSessionAttendance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"StudentSessionAttendanceFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attendance_studentSessionAttendance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dateAttendance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"bellTimeAttendance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bellTimeId"}},{"kind":"Field","name":{"kind":"Name","value":"bellTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"attendanceCode"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"codeType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"note"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdByPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedByPartyId"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"studentPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"student"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"classGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"staff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]}}]}}]} as unknown as DocumentNode<StudentSessionAttendanceQuery, StudentSessionAttendanceQueryVariables>;
export const SaveStudentSessionAttendanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"saveStudentSessionAttendance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SaveStudentSessionAttendanceInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attendance_saveStudentSessionAttendance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"student"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"classGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dateAttendance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"bellTimeAttendance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bellTimeId"}},{"kind":"Field","name":{"kind":"Name","value":"attendanceCode"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"visibleForTeacher"}},{"kind":"Field","name":{"kind":"Name","value":"visibleForContact"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}},{"kind":"Field","name":{"kind":"Name","value":"descriptionTextId"}},{"kind":"Field","name":{"kind":"Name","value":"codeType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"note"}}]}}]}}]}}]}}]} as unknown as DocumentNode<SaveStudentSessionAttendanceMutation, SaveStudentSessionAttendanceMutationVariables>;
export const Attendance_SessionAttendanceReportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"attendance_sessionAttendanceReport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SessionAttendanceListFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attendance_sessionAttendanceList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"studentPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"attendanceCode"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"student"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bellTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"attendanceCodeId"}},{"kind":"Field","name":{"kind":"Name","value":"classGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"note"}}]}}]}}]} as unknown as DocumentNode<Attendance_SessionAttendanceReportQuery, Attendance_SessionAttendanceReportQueryVariables>;
export const Attendance_StudentSessionAttendanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"attendance_studentSessionAttendance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"StudentSessionAttendanceFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attendance_studentSessionAttendance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"student"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"classGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dateAttendance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"bellTimeAttendance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bellTimeId"}},{"kind":"Field","name":{"kind":"Name","value":"attendanceCode"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"codeType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"note"}}]}}]}}]}}]}}]} as unknown as DocumentNode<Attendance_StudentSessionAttendanceQuery, Attendance_StudentSessionAttendanceQueryVariables>;
export const Attendance_SaveStudentSessionAttendanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"attendance_saveStudentSessionAttendance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SaveStudentSessionAttendanceInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attendance_saveStudentSessionAttendance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentPartyId"}}]}}]}}]} as unknown as DocumentNode<Attendance_SaveStudentSessionAttendanceMutation, Attendance_SaveStudentSessionAttendanceMutationVariables>;
export const SessionPartySearchQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"sessionPartySearchQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"search_search"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]} as unknown as DocumentNode<SessionPartySearchQueryQuery, SessionPartySearchQueryQueryVariables>;
export const TableSessionAttendanceViewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"tableSessionAttendanceView"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"StudentSessionAttendanceFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attendance_studentSessionAttendance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dateAttendance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"bellTimeAttendance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bellTimeId"}},{"kind":"Field","name":{"kind":"Name","value":"bellTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"attendanceCode"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"codeType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"note"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdByPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"updatedByPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<TableSessionAttendanceViewQuery, TableSessionAttendanceViewQueryVariables>;
export const Calendar_FindFreeResourcesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"calendar_findFreeResources"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FindFreeResourcesFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendar_findFreeResources"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"freeRooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"clashingRooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"room"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<Calendar_FindFreeResourcesQuery, Calendar_FindFreeResourcesQueryVariables>;
export const Calendar_CreateCalendarEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"calendar_createCalendarEvents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCalendarEventsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendar_createCalendarEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventId"}}]}}]}}]} as unknown as DocumentNode<Calendar_CreateCalendarEventsMutation, Calendar_CreateCalendarEventsMutationVariables>;
export const CalendarSearchQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"calendarSearchQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"search_search"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]} as unknown as DocumentNode<CalendarSearchQueryQuery, CalendarSearchQueryQueryVariables>;
export const Calendar_CalendarEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"calendar_calendarEvents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarEventFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendar_calendarEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resources"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PartyCalendar"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"partyInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PartyGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PartyPerson"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RoomCalendar"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"room"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"calendarIds"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"allDayEvent"}},{"kind":"Field","name":{"kind":"Name","value":"editable"}},{"kind":"Field","name":{"kind":"Name","value":"lessonInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subjectGroupId"}},{"kind":"Field","name":{"kind":"Name","value":"lessonId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"exclusions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"attendees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"partyInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PartyGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PartyPerson"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"rooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"context"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<Calendar_CalendarEventsQuery, Calendar_CalendarEventsQueryVariables>;
export const Calendar_PartyTimetableDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"calendar_partyTimetable"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarEventFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendar_calendarEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resources"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"attendees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"partyInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Staff"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SubjectGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"rooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<Calendar_PartyTimetableQuery, Calendar_PartyTimetableQueryVariables>;
export const TimetableInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"timetableInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarDayInfoFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendar_dayInfo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"dayType"}},{"kind":"Field","name":{"kind":"Name","value":"periods"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<TimetableInfoQuery, TimetableInfoQueryVariables>;
export const Core_BlocksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"core_blocks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"BlockFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_blocks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"blockId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"subjectGroupNamesJoined"}},{"kind":"Field","name":{"kind":"Name","value":"subjectGroupIds"}},{"kind":"Field","name":{"kind":"Name","value":"isRotation"}},{"kind":"Field","name":{"kind":"Name","value":"rotations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"iteration"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}}]}}]}}]}}]} as unknown as DocumentNode<Core_BlocksQuery, Core_BlocksQueryVariables>;
export const Enrollment_Ire_BlockMembershipsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"enrollment_ire_blockMemberships"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EnrollmentIre_BlockEnrollmentFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enrollment_ire_blockMemberships"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"blockId"}},{"kind":"Field","name":{"kind":"Name","value":"block"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"blockId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"classGroupIds"}},{"kind":"Field","name":{"kind":"Name","value":"subjectGroupIds"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isRotation"}},{"kind":"Field","name":{"kind":"Name","value":"groups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rotationIteration"}},{"kind":"Field","name":{"kind":"Name","value":"unenrolledStudents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isDuplicate"}},{"kind":"Field","name":{"kind":"Name","value":"classGroupName"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"subjectGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"students"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isDuplicate"}},{"kind":"Field","name":{"kind":"Name","value":"classGroupName"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"staff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<Enrollment_Ire_BlockMembershipsQuery, Enrollment_Ire_BlockMembershipsQueryVariables>;
export const Enrollment_Ire_UpsertBlockMembershipsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"enrollment_ire_upsertBlockMemberships"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EnrollmentIre_UpsertBlockMembership"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enrollment_ire_upsertBlockMemberships"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"blockId"}}]}}]}}]} as unknown as DocumentNode<Enrollment_Ire_UpsertBlockMembershipsMutation, Enrollment_Ire_UpsertBlockMembershipsMutationVariables>;
export const Core_EnableBlockRotationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"core_enableBlockRotations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Core_EnableBlockRotationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_enableBlockRotations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<Core_EnableBlockRotationsMutation, Core_EnableBlockRotationsMutationVariables>;
export const Enrollment_Ire_AutoAssignBlocksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"enrollment_ire_autoAssignBlocks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EnrollmentIre_AutoAssignBlockMembershipInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enrollment_ire_autoAssignBlocks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<Enrollment_Ire_AutoAssignBlocksMutation, Enrollment_Ire_AutoAssignBlocksMutationVariables>;
export const Enrollment_Ire_CoreMembershipsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"enrollment_ire_coreMemberships"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EnrollmentIre_CoreEnrollmentFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enrollment_ire_coreMemberships"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"yearGroupEnrollment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"yearGroupId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unenrolledStudents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"personalInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gender"}}]}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"classGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"students"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"personalInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gender"}}]}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"staff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]}}]} as unknown as DocumentNode<Enrollment_Ire_CoreMembershipsQuery, Enrollment_Ire_CoreMembershipsQueryVariables>;
export const Enrollment_Ire_UpsertCoreMembershipsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"enrollment_ire_upsertCoreMemberships"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EnrollmentIre_UpsertCoreMembership"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enrollment_ire_upsertCoreMemberships"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"yearGroupEnrollment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"yearGroupId"}}]}}]}}]}}]} as unknown as DocumentNode<Enrollment_Ire_UpsertCoreMembershipsMutation, Enrollment_Ire_UpsertCoreMembershipsMutationVariables>;
export const Enrollment_Ire_AutoAssignCoreDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"enrollment_ire_autoAssignCore"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EnrollmentIre_AutoAssignCoreMembershipInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enrollment_ire_autoAssignCore"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<Enrollment_Ire_AutoAssignCoreMutation, Enrollment_Ire_AutoAssignCoreMutationVariables>;
export const Core_BlocksListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"core_blocksList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"BlockFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_blocks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"blockId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"subjectGroupNamesJoined"}},{"kind":"Field","name":{"kind":"Name","value":"subjectGroupIds"}},{"kind":"Field","name":{"kind":"Name","value":"isRotation"}}]}}]}}]} as unknown as DocumentNode<Core_BlocksListQuery, Core_BlocksListQueryVariables>;
export const ClassGroupsListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"classGroupsList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GeneralGroupFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"generalGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"studentMembers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"memberCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"generalGroupType"}},{"kind":"Field","name":{"kind":"Name","value":"programmeStages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"programme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"tutors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"yearGroupLeads"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"yearGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"yearGroupId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<ClassGroupsListQuery, ClassGroupsListQueryVariables>;
export const ClassGroupsByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"classGroupsById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GeneralGroupFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"generalGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"students"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"relatedSubjectGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"studentMembershipType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}}]}},{"kind":"Field","name":{"kind":"Name","value":"programmeStages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"staff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"irePP"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"level"}}]}},{"kind":"Field","name":{"kind":"Name","value":"studentMembers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"memberCount"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"blocks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"blockId"}}]}}]}}]}}]} as unknown as DocumentNode<ClassGroupsByIdQuery, ClassGroupsByIdQueryVariables>;
export const Core_UpdateClassGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"core_updateClassGroups"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateClassGroupGroupInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_updateClassGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<Core_UpdateClassGroupsMutation, Core_UpdateClassGroupsMutationVariables>;
export const Core_CustomGroupDefinitionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"core_customGroupDefinition"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Core_CustomGroupDefinitionFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_customGroupDefinition"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"organisers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"staffStatic"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"studentsStatic"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"classGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<Core_CustomGroupDefinitionQuery, Core_CustomGroupDefinitionQueryVariables>;
export const SaveCustomGroupDefinitionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"saveCustomGroupDefinition"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Core_UpsertCustomGroupDefinition"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_upsertCustomGroupDefinition"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<SaveCustomGroupDefinitionMutation, SaveCustomGroupDefinitionMutationVariables>;
export const CustomGroupsListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"customGroupsList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GeneralGroupFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"generalGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"studentMembers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"memberCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"staffMembers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"memberCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"contactMembers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"memberCount"}}]}}]}}]}}]} as unknown as DocumentNode<CustomGroupsListQuery, CustomGroupsListQueryVariables>;
export const CustomGroupByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"customGroupById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GeneralGroupFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"generalGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"students"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"classGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CustomGroupByIdQuery, CustomGroupByIdQueryVariables>;
export const Core_ModifyBlocksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"core_modifyBlocks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Core_ModifyBlocks"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_modifyBlocks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<Core_ModifyBlocksMutation, Core_ModifyBlocksMutationVariables>;
export const Core_ModifyGroupMembershipsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"core_modifyGroupMemberships"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Core_ModifyMemberships"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_modifyGroupMemberships"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<Core_ModifyGroupMembershipsMutation, Core_ModifyGroupMembershipsMutationVariables>;
export const Calendar_CalendarEventsIteratorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"calendar_calendarEventsIterator"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarEventIteratorFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendar_calendarEventsIterator_v2"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"calendarIds"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"attendees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"partyInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Staff"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"rooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"extensions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventAttendance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"note"}},{"kind":"Field","name":{"kind":"Name","value":"attendanceCodeId"}},{"kind":"Field","name":{"kind":"Name","value":"attendanceCode"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"personPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"adminSubmitted"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"eventsOnSameDayForSameGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"extensions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventAttendance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attendanceCodeId"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<Calendar_CalendarEventsIteratorQuery, Calendar_CalendarEventsIteratorQueryVariables>;
export const SubjectGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"subjectGroups"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SubjectGroupFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subjectGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"subjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}}]}},{"kind":"Field","name":{"kind":"Name","value":"studentMembers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"memberCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"staff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"irePP"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"level"}}]}},{"kind":"Field","name":{"kind":"Name","value":"programmeStages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"programme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"yearGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"studentMembershipType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<SubjectGroupsQuery, SubjectGroupsQueryVariables>;
export const SubjectGroupByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"subjectGroupById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SubjectGroupFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subjectGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"yearGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}}]}},{"kind":"Field","name":{"kind":"Name","value":"studentMembershipType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"staff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"students"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"classGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}}]}}]} as unknown as DocumentNode<SubjectGroupByIdQuery, SubjectGroupByIdQueryVariables>;
export const Core_UpdateSubjectGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"core_updateSubjectGroups"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateSubjectGroupInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_updateSubjectGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<Core_UpdateSubjectGroupsMutation, Core_UpdateSubjectGroupsMutationVariables>;
export const Core_SwitchSubjectGroupTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"core_switchSubjectGroupType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Core_SwitchSubjectGroupType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_switchSubjectGroupType"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<Core_SwitchSubjectGroupTypeMutation, Core_SwitchSubjectGroupTypeMutationVariables>;
export const SupportGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"supportGroups"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SubjectGroupFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subjectGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"subjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}}]}},{"kind":"Field","name":{"kind":"Name","value":"studentMembers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"memberCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"staff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"irePP"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"level"}}]}},{"kind":"Field","name":{"kind":"Name","value":"programmeStages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"programme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"yearGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<SupportGroupsQuery, SupportGroupsQueryVariables>;
export const SupportGroupByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"supportGroupById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SubjectGroupFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subjectGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"yearGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}}]}},{"kind":"Field","name":{"kind":"Name","value":"staff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"students"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"classGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}}]}}]} as unknown as DocumentNode<SupportGroupByIdQuery, SupportGroupByIdQueryVariables>;
export const YearGroupsListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"yearGroupsList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"YearGroupEnrollmentFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_yearGroupEnrollments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"yearGroupEnrollmentPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nationalCode"}},{"kind":"Field","name":{"kind":"Name","value":"yearGroupId"}},{"kind":"Field","name":{"kind":"Name","value":"shortName"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"yearGroupLeads"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"studentMembers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"memberCount"}}]}}]}}]}}]} as unknown as DocumentNode<YearGroupsListQuery, YearGroupsListQueryVariables>;
export const YearGroupByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"yearGroupById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"YearGroupEnrollmentFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_yearGroupEnrollments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"yearGroupEnrollmentPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"students"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"classGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tutors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]}}]} as unknown as DocumentNode<YearGroupByIdQuery, YearGroupByIdQueryVariables>;
export const Core_UpdateYearGroupEnrollmentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"core_updateYearGroupEnrollments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateYearGroupEnrollmentInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_updateYearGroupEnrollments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<Core_UpdateYearGroupEnrollmentsMutation, Core_UpdateYearGroupEnrollmentsMutationVariables>;
export const Communications_LabelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"communications_label"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"LabelFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communications_label"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"personPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}},{"kind":"Field","name":{"kind":"Name","value":"custom"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]} as unknown as DocumentNode<Communications_LabelQuery, Communications_LabelQueryVariables>;
export const Update_Communications_LabelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"update_communications_label"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"LabelInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communications_saveLabel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"personPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}},{"kind":"Field","name":{"kind":"Name","value":"custom"}}]}}]}}]} as unknown as DocumentNode<Update_Communications_LabelMutation, Update_Communications_LabelMutationVariables>;
export const Communications_UnreadCountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"communications_unreadCount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UnreadCountFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communications_unreadCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"labelId"}},{"kind":"Field","name":{"kind":"Name","value":"labelType"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]} as unknown as DocumentNode<Communications_UnreadCountQuery, Communications_UnreadCountQueryVariables>;
export const Communications_AssignLabelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"communications_assignLabel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AssignLabelInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communications_assignLabel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<Communications_AssignLabelMutation, Communications_AssignLabelMutationVariables>;
export const MailSearchQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"mailSearchQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"search_search"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]} as unknown as DocumentNode<MailSearchQueryQuery, MailSearchQueryQueryVariables>;
export const Communications_MailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"communications_mail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MailFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communications_mail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rootMailId"}},{"kind":"Field","name":{"kind":"Name","value":"threadId"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"senderPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"sender"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sentOn"}},{"kind":"Field","name":{"kind":"Name","value":"latestMessage"}},{"kind":"Field","name":{"kind":"Name","value":"canReply"}},{"kind":"Field","name":{"kind":"Name","value":"starred"}},{"kind":"Field","name":{"kind":"Name","value":"readOn"}},{"kind":"Field","name":{"kind":"Name","value":"recipients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"recipientPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"recipientType"}},{"kind":"Field","name":{"kind":"Name","value":"recipient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"personPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}},{"kind":"Field","name":{"kind":"Name","value":"custom"}}]}},{"kind":"Field","name":{"kind":"Name","value":"threads"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rootMailId"}},{"kind":"Field","name":{"kind":"Name","value":"threadId"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"senderPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"sentOn"}},{"kind":"Field","name":{"kind":"Name","value":"latestMessage"}},{"kind":"Field","name":{"kind":"Name","value":"canReply"}},{"kind":"Field","name":{"kind":"Name","value":"starred"}},{"kind":"Field","name":{"kind":"Name","value":"readOn"}},{"kind":"Field","name":{"kind":"Name","value":"sender"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recipients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"recipientPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"recipientType"}},{"kind":"Field","name":{"kind":"Name","value":"recipient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"personPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}},{"kind":"Field","name":{"kind":"Name","value":"custom"}}]}}]}}]}}]}}]} as unknown as DocumentNode<Communications_MailQuery, Communications_MailQueryVariables>;
export const Communications_SendMailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"communications_sendMail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SendMailInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communications_sendMail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<Communications_SendMailMutation, Communications_SendMailMutationVariables>;
export const Communications_StarredDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"communications_starred"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MailStarredInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communications_starred"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<Communications_StarredMutation, Communications_StarredMutationVariables>;
export const Communications_ReadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"communications_read"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MailReadInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communications_read"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<Communications_ReadMutation, Communications_ReadMutationVariables>;
export const Notes_BehaviourCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"notes_behaviourCategories"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Notes_BehaviourCategoryFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes_behaviourCategories"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"behaviourType"}},{"kind":"Field","name":{"kind":"Name","value":"behaviourCategoryId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"descriptionTextId"}},{"kind":"Field","name":{"kind":"Name","value":"tag_l1"}},{"kind":"Field","name":{"kind":"Name","value":"tag_l2"}},{"kind":"Field","name":{"kind":"Name","value":"tag_l3"}},{"kind":"Field","name":{"kind":"Name","value":"behaviourType"}}]}}]}}]}}]} as unknown as DocumentNode<Notes_BehaviourCategoriesQuery, Notes_BehaviourCategoriesQueryVariables>;
export const Notes_Tags_BehavioursDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"notes_tags_behaviours"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Notes_TagFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes_tags"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"behaviourType"}},{"kind":"Field","name":{"kind":"Name","value":"tag_l2"}}]}}]}}]} as unknown as DocumentNode<Notes_Tags_BehavioursQuery, Notes_Tags_BehavioursQueryVariables>;
export const Notes_DeleteBehaviourDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"notes_deleteBehaviour"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Notes_DeleteNotes"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes_deleteNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<Notes_DeleteBehaviourMutation, Notes_DeleteBehaviourMutationVariables>;
export const Notes_BehaviourDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"notes_behaviour"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Notes_BehaviourFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes_behaviour"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"behaviours"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"noteId"}},{"kind":"Field","name":{"kind":"Name","value":"incidentDate"}},{"kind":"Field","name":{"kind":"Name","value":"associatedParties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SubjectGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"associatedPartyIds"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"details"}},{"kind":"Field","name":{"kind":"Name","value":"takenByPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"takenBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]}}]} as unknown as DocumentNode<Notes_BehaviourQuery, Notes_BehaviourQueryVariables>;
export const Notes_CategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"notes_categories"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Notes_BehaviourFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes_behaviour"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"behaviourCategoryId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<Notes_CategoriesQuery, Notes_CategoriesQueryVariables>;
export const Notes_Notes_BehaviourDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"notes_notes_behaviour"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Notes_NotesFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes_notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"note"}},{"kind":"Field","name":{"kind":"Name","value":"createdOn"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"incidentDate"}},{"kind":"Field","name":{"kind":"Name","value":"createdByPerson"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"behaviourType"}},{"kind":"Field","name":{"kind":"Name","value":"descriptionTextId"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"associatedGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SubjectGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<Notes_Notes_BehaviourQuery, Notes_Notes_BehaviourQueryVariables>;
export const Notes_UpsertBehaviourTagsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"notes_upsertBehaviourTags"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Notes_UpsertBehaviourTagInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes_upsertBehaviourTags"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<Notes_UpsertBehaviourTagsMutation, Notes_UpsertBehaviourTagsMutationVariables>;
export const Notes_UpsertNotesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"notes_upsertNotes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Notes_UpsertNote"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes_upsertNotes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<Notes_UpsertNotesMutation, Notes_UpsertNotesMutationVariables>;
export const Catalogue_PersonalTitlesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"catalogue_personalTitles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"catalogue_personalTitles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<Catalogue_PersonalTitlesQuery, Catalogue_PersonalTitlesQueryVariables>;
export const Core_StudentContactsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"core_studentContacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_studentContacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"personalInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"primaryAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"line1"}},{"kind":"Field","name":{"kind":"Name","value":"line2"}},{"kind":"Field","name":{"kind":"Name","value":"line3"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"postCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryPhoneNumber"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryEmail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"relationships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"student"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<Core_StudentContactsQuery, Core_StudentContactsQueryVariables>;
export const Core_StudentContactsForSelectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"core_studentContactsForSelect"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_studentContacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<Core_StudentContactsForSelectQuery, Core_StudentContactsForSelectQueryVariables>;
export const Core_StudentContacts_PersonalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"core_studentContacts_personal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StudentContactFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_studentContacts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"personalInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"preferredFirstName"}},{"kind":"Field","name":{"kind":"Name","value":"middleName"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"ire"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ppsNumber"}},{"kind":"Field","name":{"kind":"Name","value":"religion"}},{"kind":"Field","name":{"kind":"Name","value":"countryOfBirth"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nationality"}},{"kind":"Field","name":{"kind":"Name","value":"mothersMaidenName"}},{"kind":"Field","name":{"kind":"Name","value":"primaryAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"line1"}},{"kind":"Field","name":{"kind":"Name","value":"line2"}},{"kind":"Field","name":{"kind":"Name","value":"line3"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"postCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryPhoneNumber"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"phoneNumberId"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"areaCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"phoneNumberId"}},{"kind":"Field","name":{"kind":"Name","value":"primaryPhoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"areaCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryEmail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emailId"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"occupation"}},{"kind":"Field","name":{"kind":"Name","value":"requiresInterpreter"}},{"kind":"Field","name":{"kind":"Name","value":"spokenLanguages"}},{"kind":"Field","name":{"kind":"Name","value":"relationships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"relationshipType"}},{"kind":"Field","name":{"kind":"Name","value":"studentPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"allowedToContact"}},{"kind":"Field","name":{"kind":"Name","value":"includeInSms"}},{"kind":"Field","name":{"kind":"Name","value":"includeInTmail"}},{"kind":"Field","name":{"kind":"Name","value":"pickupRights"}},{"kind":"Field","name":{"kind":"Name","value":"legalGuardian"}},{"kind":"Field","name":{"kind":"Name","value":"allowAccessToStudentData"}}]}}]}}]}}]} as unknown as DocumentNode<Core_StudentContacts_PersonalQuery, Core_StudentContacts_PersonalQueryVariables>;
export const Core_StudentContacts_StudentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"core_studentContacts_students"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StudentContactFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_studentContacts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"relationships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"relationshipType"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"allowedToContact"}},{"kind":"Field","name":{"kind":"Name","value":"includeInSms"}},{"kind":"Field","name":{"kind":"Name","value":"includeInTmail"}},{"kind":"Field","name":{"kind":"Name","value":"pickupRights"}},{"kind":"Field","name":{"kind":"Name","value":"legalGuardian"}},{"kind":"Field","name":{"kind":"Name","value":"allowAccessToStudentData"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StudentContactRelationshipInfo"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"student"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"classGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Student"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<Core_StudentContacts_StudentsQuery, Core_StudentContacts_StudentsQueryVariables>;
export const Core_UpsertStudentContactDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"core_upsertStudentContact"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpsertStudentContactInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_upsertStudentContact"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}}]}}]}}]} as unknown as DocumentNode<Core_UpsertStudentContactMutation, Core_UpsertStudentContactMutationVariables>;
export const Notes_DeleteNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"notes_deleteNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Notes_DeleteNotes"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes_deleteNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<Notes_DeleteNoteMutation, Notes_DeleteNoteMutationVariables>;
export const Notes_NotesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"notes_notes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Notes_NotesFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes_notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"note"}},{"kind":"Field","name":{"kind":"Name","value":"createdOn"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdByPerson"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"descriptionTextId"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}}]}}]}}]} as unknown as DocumentNode<Notes_NotesQuery, Notes_NotesQueryVariables>;
export const Notes_TagsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"notes_tags"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Notes_TagFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes_tags"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"tag_l1"}}]}}]}}]} as unknown as DocumentNode<Notes_TagsQuery, Notes_TagsQueryVariables>;
export const Notes_UpsertNotesTagsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"notes_upsertNotesTags"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Notes_UpsertNotesTagInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes_upsertNotesTags"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<Notes_UpsertNotesTagsMutation, Notes_UpsertNotesTagsMutationVariables>;
export const Eire_DeleteNonClassContactHoursDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"eire_deleteNonClassContactHours"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteNonClassContactHoursInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eire_deleteNonClassContactHours"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<Eire_DeleteNonClassContactHoursMutation, Eire_DeleteNonClassContactHoursMutationVariables>;
export const Catalogue_StaffCapacitiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"catalogue_staffCapacities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"catalogue_staffCapacities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<Catalogue_StaffCapacitiesQuery, Catalogue_StaffCapacitiesQueryVariables>;
export const Core_StaffDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"core_staff"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"StaffFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_staff"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"employmentCapacity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"personalInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"primaryPhoneNumber"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryEmail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ire"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ppsNumber"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"staffIre"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teacherCouncilNumber"}},{"kind":"Field","name":{"kind":"Name","value":"staffPost"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"carRegistrationNumber"}},{"kind":"Field","name":{"kind":"Name","value":"parking"}},{"kind":"Field","name":{"kind":"Name","value":"position"}}]}}]}}]} as unknown as DocumentNode<Core_StaffQuery, Core_StaffQueryVariables>;
export const Core_StaffInfoForSelectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"core_staffInfoForSelect"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"StaffFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_staff"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<Core_StaffInfoForSelectQuery, Core_StaffInfoForSelectQueryVariables>;
export const Eire_NonClassContactHoursDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"eire_nonClassContactHours"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"NonClassContactHoursFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eire_nonClassContactHours"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"academicNameSpaceId"}},{"kind":"Field","name":{"kind":"Name","value":"activity"}},{"kind":"Field","name":{"kind":"Name","value":"dayOfTheWeek"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"hours"}},{"kind":"Field","name":{"kind":"Name","value":"minutes"}},{"kind":"Field","name":{"kind":"Name","value":"nonClassContactHoursId"}},{"kind":"Field","name":{"kind":"Name","value":"programme"}},{"kind":"Field","name":{"kind":"Name","value":"staffPartyId"}}]}}]}}]} as unknown as DocumentNode<Eire_NonClassContactHoursQuery, Eire_NonClassContactHoursQueryVariables>;
export const Core_Staff_PersonalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"core_staff_personal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"StaffFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_staff"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"noLongerStaffMember"}},{"kind":"Field","name":{"kind":"Name","value":"personalInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"ire"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ppsNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"line1"}},{"kind":"Field","name":{"kind":"Name","value":"line2"}},{"kind":"Field","name":{"kind":"Name","value":"line3"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"postCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryPhoneNumber"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"phoneNumberId"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"areaCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"phoneNumberId"}},{"kind":"Field","name":{"kind":"Name","value":"primaryPhoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"areaCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryEmail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emailId"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"emails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emailId"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"primaryEmail"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nextOfKin"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"staffIre"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teacherCouncilNumber"}},{"kind":"Field","name":{"kind":"Name","value":"staffPost"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"payrollNumber"}},{"kind":"Field","name":{"kind":"Name","value":"employmentCapacity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"emergencyContact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"primaryNumber"}},{"kind":"Field","name":{"kind":"Name","value":"additionalNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"displayCode"}},{"kind":"Field","name":{"kind":"Name","value":"carRegistrationNumber"}},{"kind":"Field","name":{"kind":"Name","value":"makeAndModel"}},{"kind":"Field","name":{"kind":"Name","value":"parking"}},{"kind":"Field","name":{"kind":"Name","value":"jobSharing"}},{"kind":"Field","name":{"kind":"Name","value":"qualifications"}},{"kind":"Field","name":{"kind":"Name","value":"competencies"}},{"kind":"Field","name":{"kind":"Name","value":"availableForTeaching"}},{"kind":"Field","name":{"kind":"Name","value":"availableForSubstitution"}},{"kind":"Field","name":{"kind":"Name","value":"availableForSupportClasses"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"competencySubjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}}]}}]}}]}}]} as unknown as DocumentNode<Core_Staff_PersonalQuery, Core_Staff_PersonalQueryVariables>;
export const Catalogue_StaffPostsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"catalogue_staffPosts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"catalogue_staffPosts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<Catalogue_StaffPostsQuery, Catalogue_StaffPostsQueryVariables>;
export const Core_Staff_SubjectGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"core_staff_subjectGroups"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"StaffFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_staff"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subjectGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"subjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}}]}},{"kind":"Field","name":{"kind":"Name","value":"irePP"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"level"}}]}},{"kind":"Field","name":{"kind":"Name","value":"studentMembers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"memberCount"}}]}}]}}]}}]}}]} as unknown as DocumentNode<Core_Staff_SubjectGroupsQuery, Core_Staff_SubjectGroupsQueryVariables>;
export const Eire_UpsertNonClassContactHoursDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"eire_upsertNonClassContactHours"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SaveNonClassContactHoursInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eire_upsertNonClassContactHours"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<Eire_UpsertNonClassContactHoursMutation, Eire_UpsertNonClassContactHoursMutationVariables>;
export const Core_UpsertStaffDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"core_upsertStaff"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpsertStaffInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_upsertStaff"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}}]}}]}}]} as unknown as DocumentNode<Core_UpsertStaffMutation, Core_UpsertStaffMutationVariables>;
export const Wellbeing_DeleteStudentAenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"wellbeing_deleteStudentAen"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Wellbeing_DeleteStudentAenInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"wellbeing_deleteStudentAen"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<Wellbeing_DeleteStudentAenMutation, Wellbeing_DeleteStudentAenMutationVariables>;
export const Wellbeing_StudentAenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"wellbeing_studentAen"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StudentAenFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"wellbeing_studentAen"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"entries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"studentPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"typeNote"}},{"kind":"Field","name":{"kind":"Name","value":"contact"}},{"kind":"Field","name":{"kind":"Name","value":"snaSupport"}},{"kind":"Field","name":{"kind":"Name","value":"provision"}},{"kind":"Field","name":{"kind":"Name","value":"note"}}]}}]}}]}}]} as unknown as DocumentNode<Wellbeing_StudentAenQuery, Wellbeing_StudentAenQueryVariables>;
export const Wellbeing_UpsertStudentAenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"wellbeing_upsertStudentAen"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Wellbeing_UpsertStudentAenInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"wellbeing_upsertStudentAen"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<Wellbeing_UpsertStudentAenMutation, Wellbeing_UpsertStudentAenMutationVariables>;
export const Enrollment_Ire_ChangeProgrammeStageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"enrollment_ire_changeProgrammeStage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EnrollmentIre_ChangeProgrammeStage"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enrollment_ire_changeProgrammeStage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<Enrollment_Ire_ChangeProgrammeStageMutation, Enrollment_Ire_ChangeProgrammeStageMutationVariables>;
export const Wellbeing_DeleteStudentMedicalConditionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"wellbeing_deleteStudentMedicalCondition"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteStudentMedicalConditionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"wellbeing_deleteStudentMedicalCondition"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"conditions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}}]} as unknown as DocumentNode<Wellbeing_DeleteStudentMedicalConditionMutation, Wellbeing_DeleteStudentMedicalConditionMutationVariables>;
export const Wellbeing_DeleteStudentMedicalContactDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"wellbeing_deleteStudentMedicalContact"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteStudentMedicalContactInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"wellbeing_deleteStudentMedicalContact"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"medicalContacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<Wellbeing_DeleteStudentMedicalContactMutation, Wellbeing_DeleteStudentMedicalContactMutationVariables>;
export const Wellbeing_StudentMedicalConditionLookupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"wellbeing_studentMedicalConditionLookup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"wellbeing_studentMedicalConditionLookup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"values"}}]}}]}}]} as unknown as DocumentNode<Wellbeing_StudentMedicalConditionLookupQuery, Wellbeing_StudentMedicalConditionLookupQueryVariables>;
export const Wellbeing_StudentMedicalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"wellbeing_studentMedical"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"StudentMedicalFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"wellbeing_studentMedical"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"student"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"personalInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"preferredFirstName"}},{"kind":"Field","name":{"kind":"Name","value":"preferredLastName"}},{"kind":"Field","name":{"kind":"Name","value":"primaryPhoneNumber"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"relationships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"relationshipType"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"siblings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enrolledSiblings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"classGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"nonEnrolledSiblings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"conditions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"equipment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"expiryDate"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}},{"kind":"Field","name":{"kind":"Name","value":"emergencyPlan"}}]}},{"kind":"Field","name":{"kind":"Name","value":"medicalContacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"personalTitle"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"occupation"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine3"}},{"kind":"Field","name":{"kind":"Name","value":"county"}},{"kind":"Field","name":{"kind":"Name","value":"postcode"}},{"kind":"Field","name":{"kind":"Name","value":"primaryPhone"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]} as unknown as DocumentNode<Wellbeing_StudentMedicalQuery, Wellbeing_StudentMedicalQueryVariables>;
export const Wellbeing_UpsertStudentMedicalConditionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"wellbeing_upsertStudentMedicalCondition"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpsertStudentMedicalConditionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"wellbeing_upsertStudentMedicalCondition"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"conditions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"equipment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"location"}}]}}]}}]}}]}}]} as unknown as DocumentNode<Wellbeing_UpsertStudentMedicalConditionMutation, Wellbeing_UpsertStudentMedicalConditionMutationVariables>;
export const Wellbeing_UpsertStudentMedicalContactDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"wellbeing_upsertStudentMedicalContact"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpsertStudentMedicalContactInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"wellbeing_upsertStudentMedicalContact"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"medicalContacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"personalTitleId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine3"}},{"kind":"Field","name":{"kind":"Name","value":"county"}},{"kind":"Field","name":{"kind":"Name","value":"postcode"}},{"kind":"Field","name":{"kind":"Name","value":"primaryPhone"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"occupation"}}]}}]}}]}}]} as unknown as DocumentNode<Wellbeing_UpsertStudentMedicalContactMutation, Wellbeing_UpsertStudentMedicalContactMutationVariables>;
export const Core_Student_ContactsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"core_student_contacts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StudentFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_students"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"contacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"personalInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"nationality"}},{"kind":"Field","name":{"kind":"Name","value":"primaryAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"line1"}},{"kind":"Field","name":{"kind":"Name","value":"line2"}},{"kind":"Field","name":{"kind":"Name","value":"line3"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"postCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryPhoneNumber"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"areaCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryEmail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"relationships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"relationshipType"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"allowedToContact"}},{"kind":"Field","name":{"kind":"Name","value":"includeInSms"}},{"kind":"Field","name":{"kind":"Name","value":"includeInTmail"}},{"kind":"Field","name":{"kind":"Name","value":"pickupRights"}},{"kind":"Field","name":{"kind":"Name","value":"legalGuardian"}},{"kind":"Field","name":{"kind":"Name","value":"allowAccessToStudentData"}}]}}]}}]}}]}}]} as unknown as DocumentNode<Core_Student_ContactsQuery, Core_Student_ContactsQueryVariables>;
export const Core_Student_SubjectGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"core_student_subjectGroups"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StudentFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_students"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"subjectGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"subjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}}]}},{"kind":"Field","name":{"kind":"Name","value":"staff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"irePP"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"level"}}]}}]}}]}}]}}]} as unknown as DocumentNode<Core_Student_SubjectGroupsQuery, Core_Student_SubjectGroupsQueryVariables>;
export const Core_Student_PersonalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"core_student_personal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StudentFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_students"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"leftEarly"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"guardianshipNote"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"personalInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"preferredFirstName"}},{"kind":"Field","name":{"kind":"Name","value":"preferredLastName"}},{"kind":"Field","name":{"kind":"Name","value":"middleName"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"birthCertFirstName"}},{"kind":"Field","name":{"kind":"Name","value":"birthCertLastName"}},{"kind":"Field","name":{"kind":"Name","value":"ire"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ppsNumber"}},{"kind":"Field","name":{"kind":"Name","value":"religion"}},{"kind":"Field","name":{"kind":"Name","value":"countryOfBirth"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nationality"}},{"kind":"Field","name":{"kind":"Name","value":"mothersMaidenName"}},{"kind":"Field","name":{"kind":"Name","value":"primaryAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"line1"}},{"kind":"Field","name":{"kind":"Name","value":"line2"}},{"kind":"Field","name":{"kind":"Name","value":"line3"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"postCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"addresses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"line1"}},{"kind":"Field","name":{"kind":"Name","value":"line2"}},{"kind":"Field","name":{"kind":"Name","value":"line3"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"postCode"}},{"kind":"Field","name":{"kind":"Name","value":"primaryAddress"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryPhoneNumber"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"areaCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryEmail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"studentIrePP"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"medicalCard"}},{"kind":"Field","name":{"kind":"Name","value":"travellerHeritage"}},{"kind":"Field","name":{"kind":"Name","value":"languageSupportApplicant"}},{"kind":"Field","name":{"kind":"Name","value":"borderIndicator"}},{"kind":"Field","name":{"kind":"Name","value":"examNumber"}},{"kind":"Field","name":{"kind":"Name","value":"lockerNumber"}},{"kind":"Field","name":{"kind":"Name","value":"previousSchoolRollNumber"}},{"kind":"Field","name":{"kind":"Name","value":"dpin"}},{"kind":"Field","name":{"kind":"Name","value":"examEntrant"}},{"kind":"Field","name":{"kind":"Name","value":"repeatYear"}},{"kind":"Field","name":{"kind":"Name","value":"boardingDays"}},{"kind":"Field","name":{"kind":"Name","value":"shortTermPupil"}},{"kind":"Field","name":{"kind":"Name","value":"shortTermPupilNumWeeks"}},{"kind":"Field","name":{"kind":"Name","value":"reasonForLeaving"}},{"kind":"Field","name":{"kind":"Name","value":"destinationRollNo"}},{"kind":"Field","name":{"kind":"Name","value":"previousSchoolName"}},{"kind":"Field","name":{"kind":"Name","value":"previousSchoolType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"classGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tutors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"yearGroupLeads"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"yearGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"programmeStages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"programme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"siblings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enrolledSiblings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"classGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"nonEnrolledSiblings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]}}]}}]} as unknown as DocumentNode<Core_Student_PersonalQuery, Core_Student_PersonalQueryVariables>;
export const QDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"q"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"StudentStatusFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"composite_studentStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"sessionAttendance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"currentLocation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"room"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lesson"}},{"kind":"Field","name":{"kind":"Name","value":"teacher"}},{"kind":"Field","name":{"kind":"Name","value":"currentAttendance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attendanceCodeName"}},{"kind":"Field","name":{"kind":"Name","value":"codeType"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"priorityStudent"}},{"kind":"Field","name":{"kind":"Name","value":"activeSupportPlan"}}]}}]}}]} as unknown as DocumentNode<QQuery, QQueryVariables>;
export const StudentsForSiblingSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"studentsForSiblingSearch"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_students"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"classGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"contacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]}}]} as unknown as DocumentNode<StudentsForSiblingSearchQuery, StudentsForSiblingSearchQueryVariables>;
export const Core_StudentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"core_students"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_students"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"classGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"staff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"personalInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"preferredFirstName"}},{"kind":"Field","name":{"kind":"Name","value":"primaryPhoneNumber"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryEmail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"studentIrePP"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"examNumber"}},{"kind":"Field","name":{"kind":"Name","value":"previousSchoolName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tutors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"yearGroupLeads"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"yearGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"programmeStages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"programme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<Core_StudentsQuery, Core_StudentsQueryVariables>;
export const Core_StudentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"core_student"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StudentFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_students"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"classGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"staff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"yearGroupLeads"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"yearGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shortName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tutors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<Core_StudentQuery, Core_StudentQueryVariables>;
export const Core_StudentsInfoForSelectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"core_studentsInfoForSelect"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"StudentFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_students"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"classGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"yearGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<Core_StudentsInfoForSelectQuery, Core_StudentsInfoForSelectQueryVariables>;
export const UpdateCoreStudentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateCoreStudents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateStudentInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_updateStudents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<UpdateCoreStudentsMutation, UpdateCoreStudentsMutationVariables>;
export const Core_LinkSiblingsAndContactsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"core_linkSiblingsAndContacts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Core_LinkSiblingsAndContacts"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_linkSiblingsAndContacts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<Core_LinkSiblingsAndContactsMutation, Core_LinkSiblingsAndContactsMutationVariables>;
export const Core_UpdateStudentContactRelationshipsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"core_updateStudentContactRelationships"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Core_UpdateStudentContactRelationshipInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_updateStudentContactRelationships"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<Core_UpdateStudentContactRelationshipsMutation, Core_UpdateStudentContactRelationshipsMutationVariables>;
export const UpdateStudentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateStudent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateStudentInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_updateStudents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<UpdateStudentMutation, UpdateStudentMutationVariables>;
export const PrintTimetableDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"printTimetable"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Print_TimetableOptions"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"print_printTimetable"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"html"}}]}}]}}]} as unknown as DocumentNode<PrintTimetableQuery, PrintTimetableQueryVariables>;
export const Reporting_ReportsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"reporting_reports"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reporting_reports"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reports"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<Reporting_ReportsQuery, Reporting_ReportsQueryVariables>;
export const Reporting_RunReportExpandDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"reporting_runReportExpand"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Reporting_ReportFilterExpand"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reporting_runReportExpand"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"visibleByDefault"}}]}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]} as unknown as DocumentNode<Reporting_RunReportExpandQuery, Reporting_RunReportExpandQueryVariables>;
export const Reporting_RunReportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"reporting_runReport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Reporting_ReportFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reporting_runReport"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"supportsExpandRow"}}]}},{"kind":"Field","name":{"kind":"Name","value":"innerReports"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"filters"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"inputType"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"defaultValue"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"values"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"minValue"}},{"kind":"Field","name":{"kind":"Name","value":"maxValue"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"visibleByDefault"}},{"kind":"Field","name":{"kind":"Name","value":"checkExpandedRows"}},{"kind":"Field","name":{"kind":"Name","value":"hideMenu"}}]}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]} as unknown as DocumentNode<Reporting_RunReportQuery, Reporting_RunReportQueryVariables>;
export const Core_UpsertAcademicNamespaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"core_upsertAcademicNamespace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SaveAcademicNamespaceInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_upsertAcademicNamespace"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"academicNamespaceId"}}]}}]}}]} as unknown as DocumentNode<Core_UpsertAcademicNamespaceMutation, Core_UpsertAcademicNamespaceMutationVariables>;
export const Core_SetActiveActiveAcademicNamespaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"core_setActiveActiveAcademicNamespace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SetActiveAcademicNamespace"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_setActiveActiveAcademicNamespace"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"academicNamespaceId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isActiveDefaultNamespace"}}]}}]}}]} as unknown as DocumentNode<Core_SetActiveActiveAcademicNamespaceMutation, Core_SetActiveActiveAcademicNamespaceMutationVariables>;
export const Core_UpsertRoomsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"core_upsertRooms"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpsertRoomInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_upsertRooms"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomId"}}]}}]}}]} as unknown as DocumentNode<Core_UpsertRoomsMutation, Core_UpsertRoomsMutationVariables>;
export const Core_Staff_Form_BDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"core_staff_form_b"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"StaffFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_staff"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"personalInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"ire"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ppsNumber"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"payrollNumber"}},{"kind":"Field","name":{"kind":"Name","value":"jobSharing"}},{"kind":"Field","name":{"kind":"Name","value":"qualifications"}},{"kind":"Field","name":{"kind":"Name","value":"employmentCapacity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"staffIre"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teacherCouncilNumber"}},{"kind":"Field","name":{"kind":"Name","value":"teacherReferenceNumber"}},{"kind":"Field","name":{"kind":"Name","value":"includeDtrReturns"}},{"kind":"Field","name":{"kind":"Name","value":"staffPost"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"qualifications2"}},{"kind":"Field","name":{"kind":"Name","value":"qualifications3"}},{"kind":"Field","name":{"kind":"Name","value":"qualifications4"}},{"kind":"Field","name":{"kind":"Name","value":"otherSchool1"}},{"kind":"Field","name":{"kind":"Name","value":"otherSchool2"}},{"kind":"Field","name":{"kind":"Name","value":"previousSchool1"}},{"kind":"Field","name":{"kind":"Name","value":"previousSchool2"}}]}}]}}]}}]} as unknown as DocumentNode<Core_Staff_Form_BQuery, Core_Staff_Form_BQueryVariables>;
export const Core_UpdateStaffDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"core_updateStaff"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateStaffInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_updateStaff"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<Core_UpdateStaffMutation, Core_UpdateStaffMutationVariables>;
export const SavePermissionGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"savePermissionGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SavePermissionGroup"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users_savePermissionGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<SavePermissionGroupMutation, SavePermissionGroupMutationVariables>;
export const Composite_PermissionGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"composite_permissionGroups"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PermissionGroupFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"composite_permissionGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}},{"kind":"Field","name":{"kind":"Name","value":"memberPartyIds"}},{"kind":"Field","name":{"kind":"Name","value":"custom"}},{"kind":"Field","name":{"kind":"Name","value":"permissionSets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"toggle"}},{"kind":"Field","name":{"kind":"Name","value":"permissionType"}},{"kind":"Field","name":{"kind":"Name","value":"feature"}}]}}]}}]}}]} as unknown as DocumentNode<Composite_PermissionGroupsQuery, Composite_PermissionGroupsQueryVariables>;
export const Users_PermissionSetsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"users_permissionSets"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PermissionSetFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users_permissionSets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"permissionType"}},{"kind":"Field","name":{"kind":"Name","value":"toggle"}},{"kind":"Field","name":{"kind":"Name","value":"feature"}}]}}]}}]} as unknown as DocumentNode<Users_PermissionSetsQuery, Users_PermissionSetsQueryVariables>;
export const Ppod_PpodCredentialsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ppod_PPODCredentials"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ppod_PPODCredentials"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"password"}},{"kind":"Field","name":{"kind":"Name","value":"lastSyncSuccessful"}}]}}]}}]} as unknown as DocumentNode<Ppod_PpodCredentialsQuery, Ppod_PpodCredentialsQueryVariables>;
export const Ppod_SavePpodCredentialsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ppod_savePPODCredentials"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SavePPODCredentials"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ppod_savePPODCredentials"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"password"}}]}}]}}]} as unknown as DocumentNode<Ppod_SavePpodCredentialsMutation, Ppod_SavePpodCredentialsMutationVariables>;
export const Users_SchoolInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"users_schoolInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users_schoolInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rollNo"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"fax"}},{"kind":"Field","name":{"kind":"Name","value":"principal"}},{"kind":"Field","name":{"kind":"Name","value":"boardingFeeFiveDay"}},{"kind":"Field","name":{"kind":"Name","value":"boardingFeeSixOrSevenDay"}},{"kind":"Field","name":{"kind":"Name","value":"schoolGender"}},{"kind":"Field","name":{"kind":"Name","value":"parentAssociation"}},{"kind":"Field","name":{"kind":"Name","value":"studentCouncil"}},{"kind":"Field","name":{"kind":"Name","value":"boardOfManagement"}},{"kind":"Field","name":{"kind":"Name","value":"irishClassification"}},{"kind":"Field","name":{"kind":"Name","value":"coOperatingSchoolRollNo1"}},{"kind":"Field","name":{"kind":"Name","value":"coOperatingSchoolRollNo2"}},{"kind":"Field","name":{"kind":"Name","value":"octoberReturnsContact"}},{"kind":"Field","name":{"kind":"Name","value":"octoberReturnsPhoneNo"}},{"kind":"Field","name":{"kind":"Name","value":"octoberReturnsFaxNo"}},{"kind":"Field","name":{"kind":"Name","value":"octoberReturnsEmail"}},{"kind":"Field","name":{"kind":"Name","value":"phones"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}},{"kind":"Field","name":{"kind":"Name","value":"addresses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address1"}},{"kind":"Field","name":{"kind":"Name","value":"address2"}},{"kind":"Field","name":{"kind":"Name","value":"address3"}},{"kind":"Field","name":{"kind":"Name","value":"address4"}},{"kind":"Field","name":{"kind":"Name","value":"county"}},{"kind":"Field","name":{"kind":"Name","value":"localAuthority"}}]}},{"kind":"Field","name":{"kind":"Name","value":"chairPeople"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chairPersonId"}},{"kind":"Field","name":{"kind":"Name","value":"forename"}},{"kind":"Field","name":{"kind":"Name","value":"surname"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNo"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"owners"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ownerId"}},{"kind":"Field","name":{"kind":"Name","value":"forename"}},{"kind":"Field","name":{"kind":"Name","value":"surname"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine3"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine4"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"trustees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trusteeId"}},{"kind":"Field","name":{"kind":"Name","value":"forename"}},{"kind":"Field","name":{"kind":"Name","value":"surname"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine3"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine4"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}}]}}]}}]}}]} as unknown as DocumentNode<Users_SchoolInfoQuery, Users_SchoolInfoQueryVariables>;
export const Ppod_SyncRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ppod_syncRequests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SyncRequestsFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ppod_syncRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"syncRequestStatus"}},{"kind":"Field","name":{"kind":"Name","value":"requesterPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"requester"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"failureReason"}},{"kind":"Field","name":{"kind":"Name","value":"requestedOn"}}]}}]}}]} as unknown as DocumentNode<Ppod_SyncRequestsQuery, Ppod_SyncRequestsQueryVariables>;
export const Core_RoomsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"core_rooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_rooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"pools"}},{"kind":"Field","name":{"kind":"Name","value":"includeInTimetable"}},{"kind":"Field","name":{"kind":"Name","value":"externalSystemId"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"disabled"}}]}}]}}]} as unknown as DocumentNode<Core_RoomsQuery, Core_RoomsQueryVariables>;
export const CatalogueSubjectsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"catalogueSubjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"catalogue_subjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"shortCode"}},{"kind":"Field","name":{"kind":"Name","value":"nationalCode"}},{"kind":"Field","name":{"kind":"Name","value":"subjectSource"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}}]}}]} as unknown as DocumentNode<CatalogueSubjectsQuery, CatalogueSubjectsQueryVariables>;
export const Catalogue_UpsertSubjectsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"catalogue_upsertSubjects"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpsertSubject"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"catalogue_upsertSubjects"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<Catalogue_UpsertSubjectsMutation, Catalogue_UpsertSubjectsMutationVariables>;
export const Users_InviteUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"users_inviteUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InviteUser"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users_inviteUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userAccesses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"personPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"webLastLogin"}},{"kind":"Field","name":{"kind":"Name","value":"mobileLastLogin"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"invitationId"}},{"kind":"Field","name":{"kind":"Name","value":"invitingPersonPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"invitedOn"}}]}},{"kind":"Field","name":{"kind":"Name","value":"validations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"associatedUsers"}}]}}]}}]}}]} as unknown as DocumentNode<Users_InviteUsersMutation, Users_InviteUsersMutationVariables>;
export const Core_UpdateStudentContactsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"core_updateStudentContacts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateStudentContactInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_updateStudentContacts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<Core_UpdateStudentContactsMutation, Core_UpdateStudentContactsMutationVariables>;
export const Core_UpdateStudentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"core_updateStudent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateStudentInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_updateStudents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<Core_UpdateStudentMutation, Core_UpdateStudentMutationVariables>;
export const Users_UserAccessDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"users_userAccess"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UserAccessFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users_userAccess"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"personPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"personalInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"primaryEmail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"contactStudents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"webLastLogin"}},{"kind":"Field","name":{"kind":"Name","value":"mobileLastLogin"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"invitedOn"}},{"kind":"Field","name":{"kind":"Name","value":"yearGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shortName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"yearGroupContacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shortName"}}]}}]}}]}}]} as unknown as DocumentNode<Users_UserAccessQuery, Users_UserAccessQueryVariables>;
export const SendSmsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"sendSms"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SendSmsInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communications_sendSms"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<SendSmsMutation, SendSmsMutationVariables>;
export const Communications_SmsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"communications_sms"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SmsFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communications_sms"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"sender"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"sentOn"}},{"kind":"Field","name":{"kind":"Name","value":"canReply"}},{"kind":"Field","name":{"kind":"Name","value":"numRecipients"}},{"kind":"Field","name":{"kind":"Name","value":"totalCost"}},{"kind":"Field","name":{"kind":"Name","value":"recipients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"smsId"}},{"kind":"Field","name":{"kind":"Name","value":"recipientPartyId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recipient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recipientPhoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"smsStatus"}}]}}]}}]}}]} as unknown as DocumentNode<Communications_SmsQuery, Communications_SmsQueryVariables>;
export const Communications_SmsCostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"communications_smsCost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SmsCostFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communications_smsCost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]} as unknown as DocumentNode<Communications_SmsCostQuery, Communications_SmsCostQueryVariables>;
export const Communications_SmsCreditDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"communications_smsCredit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communications_smsCredit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"smsCredit"}}]}}]}}]} as unknown as DocumentNode<Communications_SmsCreditQuery, Communications_SmsCreditQueryVariables>;
export const Communications_SmsXeroItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"communications_smsXeroItem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communications_smsXeroItem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"cost"}}]}}]}}]} as unknown as DocumentNode<Communications_SmsXeroItemQuery, Communications_SmsXeroItemQueryVariables>;
export const Communications_SmsTopUpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"communications_smsTopUp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SmsTopUpInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communications_smsTopUp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"smsCredit"}}]}}]}}]} as unknown as DocumentNode<Communications_SmsTopUpMutation, Communications_SmsTopUpMutationVariables>;
export const Swm_ApplySubstitutionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"swm_applySubstitutions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SWM_InsertSubstitution"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"swm_applySubstitutions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<Swm_ApplySubstitutionsMutation, Swm_ApplySubstitutionsMutationVariables>;
export const Swm_DeleteSubstitutionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"swm_deleteSubstitutions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SWM_DeleteSubstitution"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"swm_deleteSubstitutions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<Swm_DeleteSubstitutionsMutation, Swm_DeleteSubstitutionsMutationVariables>;
export const Swm_AbsenceTypesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"swm_absenceTypes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SWM_StaffAbsenceTypeFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"swm_absenceTypes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"absenceTypeId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"descriptionTextId"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"availableForRequests"}}]}}]}}]} as unknown as DocumentNode<Swm_AbsenceTypesQuery, Swm_AbsenceTypesQueryVariables>;
export const Swm_UpsertAbsenceTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"swm_upsertAbsenceType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SWM_UpsertStaffAbsenceType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"swm_upsertAbsenceType"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"absenceTypeId"}}]}}]}}]} as unknown as DocumentNode<Swm_UpsertAbsenceTypeMutation, Swm_UpsertAbsenceTypeMutationVariables>;
export const Swm_AbsencesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"swm_absences"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SWM_StaffAbsenceFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"swm_absences"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"absenceId"}},{"kind":"Field","name":{"kind":"Name","value":"absenceTypeId"}},{"kind":"Field","name":{"kind":"Name","value":"staffPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"absenceType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isLongTermLeave"}},{"kind":"Field","name":{"kind":"Name","value":"longTermLeaveGroupsRequired"}},{"kind":"Field","name":{"kind":"Name","value":"longTermLeaveGroupsApplied"}},{"kind":"Field","name":{"kind":"Name","value":"staff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"absenceReasonText"}},{"kind":"Field","name":{"kind":"Name","value":"substitutionRequired"}},{"kind":"Field","name":{"kind":"Name","value":"dates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"continuousStartDate"}},{"kind":"Field","name":{"kind":"Name","value":"continuousEndDate"}},{"kind":"Field","name":{"kind":"Name","value":"individualDates"}},{"kind":"Field","name":{"kind":"Name","value":"partialAbsence"}},{"kind":"Field","name":{"kind":"Name","value":"leavesAt"}},{"kind":"Field","name":{"kind":"Name","value":"returnsAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"longTermLeaveGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"groupId"}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"coveringStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"coveringStaff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<Swm_AbsencesQuery, Swm_AbsencesQueryVariables>;
export const Swm_UpsertAbsenceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"swm_upsertAbsence"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SWM_UpsertStaffAbsence"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"swm_upsertAbsence"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"staffPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"absenceTypeId"}},{"kind":"Field","name":{"kind":"Name","value":"fromAbsenceRequestId"}},{"kind":"Field","name":{"kind":"Name","value":"absenceReasonText"}}]}}]}}]} as unknown as DocumentNode<Swm_UpsertAbsenceMutation, Swm_UpsertAbsenceMutationVariables>;
export const Swm_DeleteAbsenceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"swm_deleteAbsence"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SWM_DeleteStaffAbsence"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"swm_deleteAbsence"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<Swm_DeleteAbsenceMutation, Swm_DeleteAbsenceMutationVariables>;
export const Swm_SubstitutionLookupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"swm_substitutionLookup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SWM_SubstitutionLookupFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"swm_substitutionLookup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"staff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"staff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"extensions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timetableSummary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fulltimePeriods"}}]}},{"kind":"Field","name":{"kind":"Name","value":"substitutionSummary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"substitutionCountThisWeek"}},{"kind":"Field","name":{"kind":"Name","value":"substitutionTimeThisWeekMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"substitutionCountThisYear"}},{"kind":"Field","name":{"kind":"Name","value":"substitutionTimeThisYearMinutes"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"available"}},{"kind":"Field","name":{"kind":"Name","value":"clashingEvents"}},{"kind":"Field","name":{"kind":"Name","value":"substitutionStats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sandsWeekCount"}},{"kind":"Field","name":{"kind":"Name","value":"sandsWeekMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"sandsYearCount"}},{"kind":"Field","name":{"kind":"Name","value":"sandsYearMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"casualWeekCount"}},{"kind":"Field","name":{"kind":"Name","value":"casualWeekMinutes"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"freeRooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"pools"}}]}},{"kind":"Field","name":{"kind":"Name","value":"clashingRooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"room"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"pools"}}]}},{"kind":"Field","name":{"kind":"Name","value":"clash"}}]}}]}}]}}]} as unknown as DocumentNode<Swm_SubstitutionLookupQuery, Swm_SubstitutionLookupQueryVariables>;
export const Swm_EventsForSubstitutionsByStaffByPeriodDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"swm_eventsForSubstitutionsByStaffByPeriod"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SWM_EventsForSubstitutionFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"swm_eventsForSubstitutionsByStaffByPeriod"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventsByStaff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"staff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"substitutionEventsByDay"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dayInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"dayType"}},{"kind":"Field","name":{"kind":"Name","value":"periods"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"substitutionEventsByPeriod"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"absenceId"}},{"kind":"Field","name":{"kind":"Name","value":"staffPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"allDayEvent"}},{"kind":"Field","name":{"kind":"Name","value":"attendees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Staff"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"rooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"roomId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"context"}}]}},{"kind":"Field","name":{"kind":"Name","value":"colour"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"substitution"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"substitutionId"}},{"kind":"Field","name":{"kind":"Name","value":"originalStaff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"substituteStaff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"substitutionType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"substituteRoom"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"roomId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"note"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<Swm_EventsForSubstitutionsByStaffByPeriodQuery, Swm_EventsForSubstitutionsByStaffByPeriodQueryVariables>;
export const Swm_SubstitutionTypesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"swm_substitutionTypes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SWM_StaffSubstitutionTypeFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"swm_substitutionTypes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"substitutionTypeId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]} as unknown as DocumentNode<Swm_SubstitutionTypesQuery, Swm_SubstitutionTypesQueryVariables>;
export const Tt_TimetablesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"tt_timetables"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TTTimetableFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tt_timetables"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timetableId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"liveStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalChanges"}},{"kind":"Field","name":{"kind":"Name","value":"lessonChanges"}},{"kind":"Field","name":{"kind":"Name","value":"timetableGroupChanges"}},{"kind":"Field","name":{"kind":"Name","value":"lastPublishedDate"}}]}}]}}]}}]} as unknown as DocumentNode<Tt_TimetablesQuery, Tt_TimetablesQueryVariables>;
export const Tt_AddLessonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"tt_addLesson"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Tt_AddLessonInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tt_addLesson"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<Tt_AddLessonMutation, Tt_AddLessonMutationVariables>;
export const Tt_AddLessonOptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"tt_addLessonOptions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Tt_AddLessonFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tt_addLessonOptions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"freeStaffIds"}},{"kind":"Field","name":{"kind":"Name","value":"freeStaff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"freeTimetableGroupIds"}},{"kind":"Field","name":{"kind":"Name","value":"freeTimetableGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"freeRoomIds"}},{"kind":"Field","name":{"kind":"Name","value":"freeRooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"pools"}},{"kind":"Field","name":{"kind":"Name","value":"includeInTimetable"}},{"kind":"Field","name":{"kind":"Name","value":"externalSystemId"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"disabled"}}]}}]}}]}}]} as unknown as DocumentNode<Tt_AddLessonOptionsQuery, Tt_AddLessonOptionsQueryVariables>;
export const Tt_SwapTeacherOptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"tt_swapTeacherOptions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TTSwapTeacherFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tt_swapTeacherOptions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timeslots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gridIdx"}},{"kind":"Field","name":{"kind":"Name","value":"dayIdx"}},{"kind":"Field","name":{"kind":"Name","value":"periodIdx"}}]}},{"kind":"Field","name":{"kind":"Name","value":"info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dayOfWeek"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"teachers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"staffId"}},{"kind":"Field","name":{"kind":"Name","value":"teacher"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"lessonOnTimeslots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lessonIdx"}},{"kind":"Field","name":{"kind":"Name","value":"lessonInstanceIdx"}},{"kind":"Field","name":{"kind":"Name","value":"timetableGroupId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"partyGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<Tt_SwapTeacherOptionsQuery, Tt_SwapTeacherOptionsQueryVariables>;
export const Tt_SwapRoomOptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"tt_swapRoomOptions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TTSwapRoomFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tt_swapRoomOptions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timeslots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gridIdx"}},{"kind":"Field","name":{"kind":"Name","value":"dayIdx"}},{"kind":"Field","name":{"kind":"Name","value":"periodIdx"}}]}},{"kind":"Field","name":{"kind":"Name","value":"info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dayOfWeek"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"rooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomId"}},{"kind":"Field","name":{"kind":"Name","value":"room"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"pools"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lessonOnTimeslots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lessonIdx"}},{"kind":"Field","name":{"kind":"Name","value":"lessonInstanceIdx"}},{"kind":"Field","name":{"kind":"Name","value":"timetableGroupId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"partyGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<Tt_SwapRoomOptionsQuery, Tt_SwapRoomOptionsQueryVariables>;
export const Tt_RemoveLessonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"tt_removeLesson"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Tt_RemoveLessonInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tt_removeLesson"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<Tt_RemoveLessonMutation, Tt_RemoveLessonMutationVariables>;
export const Tt_EditLessonOptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"tt_editLessonOptions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Tt_EditLessonFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tt_editLessonOptions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"freeStaffIds"}},{"kind":"Field","name":{"kind":"Name","value":"freeStaff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"freeTimetableGroupIds"}},{"kind":"Field","name":{"kind":"Name","value":"freeTimetableGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"freeRoomIds"}},{"kind":"Field","name":{"kind":"Name","value":"freeRooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"pools"}},{"kind":"Field","name":{"kind":"Name","value":"includeInTimetable"}},{"kind":"Field","name":{"kind":"Name","value":"externalSystemId"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"disabled"}}]}}]}}]}}]} as unknown as DocumentNode<Tt_EditLessonOptionsQuery, Tt_EditLessonOptionsQueryVariables>;
export const Tt_PublishDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"tt_publish"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TTPublishTimetableInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tt_publish"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<Tt_PublishMutation, Tt_PublishMutationVariables>;
export const Tt_ResetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"tt_reset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TT_Reset"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tt_reset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<Tt_ResetMutation, Tt_ResetMutationVariables>;
export const Tt_ResourceTimetableViewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"tt_resourceTimetableView"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TTResourceTimetableViewFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tt_resourceTimetableView"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timeslots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timeslotIds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gridIdx"}},{"kind":"Field","name":{"kind":"Name","value":"dayIdx"}},{"kind":"Field","name":{"kind":"Name","value":"periodIdx"}}]}},{"kind":"Field","name":{"kind":"Name","value":"timeslots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dayOfWeek"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"periodType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lessons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lessonIdx"}},{"kind":"Field","name":{"kind":"Name","value":"lessonInstanceIdx"}},{"kind":"Field","name":{"kind":"Name","value":"timetableGroupId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"timeslotId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gridIdx"}},{"kind":"Field","name":{"kind":"Name","value":"dayIdx"}},{"kind":"Field","name":{"kind":"Name","value":"periodIdx"}}]}},{"kind":"Field","name":{"kind":"Name","value":"timeslotInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}}]}},{"kind":"Field","name":{"kind":"Name","value":"partyGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SubjectGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"room"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"teachers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"spread"}}]}}]}}]}}]}}]} as unknown as DocumentNode<Tt_ResourceTimetableViewQuery, Tt_ResourceTimetableViewQueryVariables>;
export const Tt_GroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"tt_groups"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TT_GroupsFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tt_groups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SubjectGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"yearGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"colour"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subjectGroupType"}},{"kind":"Field","name":{"kind":"Name","value":"subjectIds"}},{"kind":"Field","name":{"kind":"Name","value":"studentMembershipType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"classGroupId"}},{"kind":"Field","name":{"kind":"Name","value":"blockId"}},{"kind":"Field","name":{"kind":"Name","value":"classGroupName"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"studentMembershipType"}},{"kind":"Field","name":{"kind":"Name","value":"teachers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"lessons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lessonIdx"}},{"kind":"Field","name":{"kind":"Name","value":"lessonInstanceIdx"}},{"kind":"Field","name":{"kind":"Name","value":"timetableGroupId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"timeslotId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gridIdx"}},{"kind":"Field","name":{"kind":"Name","value":"dayIdx"}},{"kind":"Field","name":{"kind":"Name","value":"periodIdx"}}]}},{"kind":"Field","name":{"kind":"Name","value":"timeslotInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}}]}},{"kind":"Field","name":{"kind":"Name","value":"partyGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SubjectGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"room"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"teachers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"spread"}}]}}]}}]}}]} as unknown as DocumentNode<Tt_GroupsQuery, Tt_GroupsQueryVariables>;
export const Tt_SwapDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"tt_swap"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TTSwapsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tt_swap"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<Tt_SwapMutation, Tt_SwapMutationVariables>;
export const Tt_UnpublishedChangesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"tt_unpublishedChanges"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TTTimetableFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tt_timetables"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timetableId"}},{"kind":"Field","name":{"kind":"Name","value":"liveStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalChanges"}},{"kind":"Field","name":{"kind":"Name","value":"publishDiff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lessonDiffs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"newLesson"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lessonIdx"}},{"kind":"Field","name":{"kind":"Name","value":"lessonInstanceIdx"}},{"kind":"Field","name":{"kind":"Name","value":"timetableGroupId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"timeslotId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gridIdx"}},{"kind":"Field","name":{"kind":"Name","value":"dayIdx"}},{"kind":"Field","name":{"kind":"Name","value":"periodIdx"}}]}},{"kind":"Field","name":{"kind":"Name","value":"timeslotInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}}]}},{"kind":"Field","name":{"kind":"Name","value":"partyGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SubjectGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"room"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"teachers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"spread"}}]}},{"kind":"Field","name":{"kind":"Name","value":"oldLesson"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lessonIdx"}},{"kind":"Field","name":{"kind":"Name","value":"lessonInstanceIdx"}},{"kind":"Field","name":{"kind":"Name","value":"timetableGroupId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"timeslotId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gridIdx"}},{"kind":"Field","name":{"kind":"Name","value":"dayIdx"}},{"kind":"Field","name":{"kind":"Name","value":"periodIdx"}}]}},{"kind":"Field","name":{"kind":"Name","value":"timeslotInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}}]}},{"kind":"Field","name":{"kind":"Name","value":"partyGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SubjectGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"room"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"teachers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"spread"}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"roomChanged"}},{"kind":"Field","name":{"kind":"Name","value":"teachersChanged"}},{"kind":"Field","name":{"kind":"Name","value":"timeslotChanged"}}]}},{"kind":"Field","name":{"kind":"Name","value":"groupDiffs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"newGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SubjectGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"teachers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"oldGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SubjectGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"teachers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"teachersChanged"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<Tt_UnpublishedChangesQuery, Tt_UnpublishedChangesQueryVariables>;
export const Tt_UpdateTimetableGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"tt_updateTimetableGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TT_UpdateTimetableGroupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tt_updateTimetableGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<Tt_UpdateTimetableGroupMutation, Tt_UpdateTimetableGroupMutationVariables>;
export const Tt_UpsertTimetableGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"tt_upsertTimetableGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Tt_UpsertSubjectGroup"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tt_upsertSubjectGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<Tt_UpsertTimetableGroupMutation, Tt_UpsertTimetableGroupMutationVariables>;
export const Tt_EditLessonInstanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"tt_editLessonInstance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TTEditLessonPeriodInstanceWrapper"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tt_editLessonInstance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lessonIdx"}},{"kind":"Field","name":{"kind":"Name","value":"lessonInstanceIdx"}},{"kind":"Field","name":{"kind":"Name","value":"timetableGroupId"}}]}}]}}]}}]} as unknown as DocumentNode<Tt_EditLessonInstanceMutation, Tt_EditLessonInstanceMutationVariables>;
export const Admin__Party_PeopleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"admin__party_people"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tenant"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"admin__party_people"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"tenant"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tenant"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]} as unknown as DocumentNode<Admin__Party_PeopleQuery, Admin__Party_PeopleQueryVariables>;
export const Admin__TenantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"admin__tenants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"admin__tenants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"imgUrl"}}]}}]}}]} as unknown as DocumentNode<Admin__TenantsQuery, Admin__TenantsQueryVariables>;
export const Admin__ResetTenantCacheDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"admin__resetTenantCache"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"admin__resetTenantCache"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<Admin__ResetTenantCacheMutation, Admin__ResetTenantCacheMutationVariables>;
export const Core_AcademicNamespacesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"core_academicNamespaces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_academicNamespaces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"academicNamespaceId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isActiveDefaultNamespace"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}}]}}]}}]} as unknown as DocumentNode<Core_AcademicNamespacesQuery, Core_AcademicNamespacesQueryVariables>;
export const Catalogue_ProgrammeStagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"catalogue_programmeStages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"catalogue_programmeStages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<Catalogue_ProgrammeStagesQuery, Catalogue_ProgrammeStagesQueryVariables>;
export const YearsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"years"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"YearGroupFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"catalogue_years"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"yearGroupId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<YearsQuery, YearsQueryVariables>;
export const MyAuthDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"myAuthDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myAuthDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"defaultProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"activeProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"profiles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nickName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"imgUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"profileType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"userType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"permissionIds"}},{"kind":"Field","name":{"kind":"Name","value":"partyId"}}]}}]}}]}}]} as unknown as DocumentNode<MyAuthDetailsQuery, MyAuthDetailsQueryVariables>;