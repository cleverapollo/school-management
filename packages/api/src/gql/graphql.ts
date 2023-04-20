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
  /** An RFC-3339 compliant Full Date Scalar */
  Date: string;
  /** An RFC-3339 compliant DateTime Scalar */
  DateTime: string;
  /** A 64-bit signed integer */
  Long: number;
  /** 24-hour clock time value string in the format `hh:mm:ss` or `hh:mm:ss.sss`. */
  Time: any;
};

export type AcademicNamespace = {
  __typename?: 'AcademicNamespace';
  academicNamespaceId: Scalars['Int'];
  description?: Maybe<Scalars['String']>;
  isActiveDefaultNamespace: Scalars['Boolean'];
  name: Scalars['String'];
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

export type ActivePlan = {
  __typename?: 'ActivePlan';
  active?: Maybe<Scalars['Boolean']>;
  studentPartyId?: Maybe<Scalars['Long']>;
};

export type ActiveSupportPlanFilter = {
  studentPartyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
};

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
  createdBy?: Maybe<Person>;
  createdByPartyId: Scalars['Long'];
  createdOn: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  endDate: Scalars['Date'];
  extraFields?: Maybe<Array<Maybe<AssessmentExtraField>>>;
  gradeSets?: Maybe<Array<Maybe<AssessmentGradeSet>>>;
  gradeType?: Maybe<GradeType>;
  id: Scalars['Long'];
  name: Scalars['String'];
  passFailThreshold?: Maybe<Scalars['Int']>;
  publish: Scalars['Boolean'];
  publishLearner: Scalars['Boolean'];
  startDate: Scalars['Date'];
  yearGroupEnrollmentPartyIds?: Maybe<Array<Maybe<Scalars['Long']>>>;
  yearGroupIds?: Maybe<Array<Maybe<Scalars['Int']>>>;
  /** deep linked */
  years?: Maybe<Array<Maybe<YearGroup>>>;
};

export type AssessmentComment = {
  __typename?: 'AssessmentComment';
  assessmentId?: Maybe<Scalars['Long']>;
  comment?: Maybe<Scalars['String']>;
  commentBankCommentId?: Maybe<Scalars['Long']>;
  commenterPartyId?: Maybe<Scalars['Long']>;
  commenterUserType?: Maybe<CommenterUserType>;
  id: Scalars['Long'];
  studentPartyId?: Maybe<Scalars['Long']>;
  subjectGroupPartyId?: Maybe<Scalars['Long']>;
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
  assessmentId?: Maybe<Scalars['Long']>;
  commentBankId?: Maybe<Scalars['Long']>;
  commentLength?: Maybe<Scalars['Int']>;
  extraFieldType?: Maybe<ExtraFieldType>;
  gradeSetId?: Maybe<Scalars['Long']>;
  id: Scalars['Long'];
  name?: Maybe<Scalars['String']>;
  selectOptions?: Maybe<Array<Maybe<Scalars['String']>>>;
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
  assessmentId: Scalars['Long'];
  comment?: Maybe<Scalars['String']>;
  extraFields?: Maybe<Array<Maybe<ResultExtraField>>>;
  grade?: Maybe<Scalars['String']>;
  gradeNameTextId?: Maybe<Scalars['Int']>;
  id: Scalars['Long'];
  result?: Maybe<Scalars['Int']>;
  studentPartyId: Scalars['Long'];
  subjectGroupId?: Maybe<Scalars['Long']>;
  targetGrade?: Maybe<Scalars['String']>;
  targetGradeNameTextId?: Maybe<Scalars['Int']>;
  targetResult?: Maybe<Scalars['Int']>;
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
  subject: Scalars['String'];
  subjectGroupId: Scalars['Long'];
  subjectGroupName: Scalars['String'];
  years: Array<Scalars['String']>;
};

export type AssessmentSubjectGroupsFilter = {
  assessmentId?: InputMaybe<Scalars['Long']>;
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
  code: Scalars['String'];
  codeType: AttendanceCodeType;
  id: Scalars['Int'];
  name: Scalars['String'];
  nameTextId?: Maybe<Scalars['Int']>;
  visibleForContact: Scalars['Boolean'];
  visibleForTeacher: Scalars['Boolean'];
};

export type AttendanceCodeFilter = {
  active?: InputMaybe<Scalars['Boolean']>;
  custom?: InputMaybe<Scalars['Boolean']>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
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

export type Calendar = {
  __typename?: 'Calendar';
  academicNamespaceId: Scalars['Int'];
  endDate: Scalars['Date'];
  id: Scalars['Int'];
  startDate: Scalars['Date'];
};

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

export type CalendarEvent = {
  __typename?: 'CalendarEvent';
  allDayEvent: Scalars['Boolean'];
  attendees: Array<CalendarEventAttendee>;
  calendarEventId: CalendarEventId;
  calendarIds: Array<Maybe<Scalars['Int']>>;
  colour?: Maybe<Colour>;
  description?: Maybe<Scalars['String']>;
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
  resources: CalendarResourceFilter;
  startDate: Scalars['Date'];
};

export type CalendarEventId = {
  __typename?: 'CalendarEventId';
  date?: Maybe<Scalars['Date']>;
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
  calendarIds: Array<Scalars['Int']>;
  colour?: Maybe<Colour>;
  description?: Maybe<Scalars['String']>;
  eventId: Scalars['Int'];
  lessonInfo?: Maybe<CalendarEventLessonRaw>;
  name: Scalars['String'];
  schedule: Array<CalendarEventRawSchedule>;
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
  partyId: Scalars['Long'];
  /**  ... Defaults to event Recurrence Rule.  Used in cases where attendee will not excluded from all events */
  recurrenceRule?: Maybe<Scalars['String']>;
  /**  ... Defaults to event Start Date. Used in cases where attendee will not excluded from all events */
  startDate?: Maybe<Scalars['Date']>;
};

export type CalendarEventRawFilter = {
  calendarId?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  eventId?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
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
  exclusions: Array<CalendarEventRawExcludedAttendee>;
  /**  iCal/rfc5545 recurrence rule for event. Null means single */
  recurrenceRule?: Maybe<Scalars['String']>;
  rooms?: Maybe<Array<Maybe<CalendarEventRawRoom>>>;
  startDate: Scalars['Date'];
  startTime: Scalars['Time'];
};

export enum CalendarEventType {
  General = 'GENERAL',
  Lesson = 'LESSON'
}

export type CalendarFilter = {
  calendarId?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export type CalendarGrid = {
  __typename?: 'CalendarGrid';
  calendarGridId: Scalars['Int'];
  calendarId: Scalars['Int'];
  days?: Maybe<Array<Maybe<CalendarDayInfo>>>;
  /**  date grid is active from. default to calendar dates if null */
  fromDate?: Maybe<Scalars['Date']>;
  /**  date grid is active to. default to calendar dates if null */
  toDate?: Maybe<Scalars['Date']>;
};

export type CalendarGridPeriodInfo = {
  __typename?: 'CalendarGridPeriodInfo';
  endTime: Scalars['DateTime'];
  /**  periods are sequential with no gapes between them */
  startTime: Scalars['DateTime'];
  type: CalendarGridPeriodType;
};

export enum CalendarGridPeriodType {
  Break = 'BREAK',
  Class = 'CLASS'
}

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
  context?: Maybe<Scalars['String']>;
  label: Scalars['String'];
};

export type CalendarTagInput = {
  context?: InputMaybe<Scalars['String']>;
  label: Scalars['String'];
};

export type CatalogueSuccess = {
  __typename?: 'CatalogueSuccess';
  message?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
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
  active?: Maybe<Scalars['Boolean']>;
  comment?: Maybe<Scalars['String']>;
  id: Scalars['Long'];
};

export type CommentBank = {
  __typename?: 'CommentBank';
  active?: Maybe<Scalars['Boolean']>;
  comments?: Maybe<Array<Maybe<Comment>>>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['Long'];
  name?: Maybe<Scalars['String']>;
};

export type CommentBankFilter = {
  id?: InputMaybe<Scalars['Long']>;
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
  Sms = 'SMS'
}

/**    -------------- Inputs --------------- */
export type CreateAcademicNamespaceInput = {
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<AcademicNamespaceType>;
  year: Scalars['Int'];
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
  attendees?: InputMaybe<Array<InputMaybe<CreateCalendarEventAttendeeInput>>>;
  calendarIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  colour?: InputMaybe<Colour>;
  /**  end date of the recurrence */
  endDate?: InputMaybe<Scalars['Date']>;
  endTime: Scalars['Time'];
  exclusions?: InputMaybe<Array<InputMaybe<CreateCalendarEventAttendeeInput>>>;
  lessonInfo?: InputMaybe<CreateCalendarEventLessonInput>;
  /**  iCal/rfc5545 recurrence rule for event. Null means single */
  recurrenceRule?: InputMaybe<Scalars['String']>;
  rooms?: InputMaybe<Array<InputMaybe<CreateCalendarEventRoomInput>>>;
  startDate: Scalars['Date'];
  startTime: Scalars['Time'];
  tags: Array<CalendarTagInput>;
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
  type: CalendarEventAttendeeType;
};

export type CreateCalendarEventsInput = {
  allowClashes?: InputMaybe<Scalars['Boolean']>;
  events: Array<InputMaybe<CreateCalendarEventInput>>;
};

export type CreateCalendarInput = {
  academicNamespaceId: Scalars['Int'];
  endDate: Scalars['Date'];
  startDate: Scalars['Date'];
};

export type CreateGeneralGroupInput = {
  academicNamespaces?: InputMaybe<Array<InputMaybe<CreateGroupAcademicNamespacesInput>>>;
  externalSystemInfo?: InputMaybe<Array<InputMaybe<ExternalSystemInfo>>>;
  generalGroupType: GeneralGroupType;
  name?: InputMaybe<Scalars['String']>;
  staffMembers?: InputMaybe<Array<InputMaybe<CreateStaffGroupMembershipInput>>>;
  studentMembers?: InputMaybe<Array<InputMaybe<CreateGroupMembershipInput>>>;
};

export type CreateGroupAcademicNamespacesInput = {
  academicNamespaceId: Scalars['Int'];
  nameOverride?: InputMaybe<Scalars['String']>;
};

export type CreateGroupMembershipInput = {
  academicNamespaceId: Scalars['Int'];
  fromDate?: InputMaybe<Scalars['Date']>;
  partyId?: InputMaybe<Scalars['Long']>;
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

export type CreateSiblingRelationship = {
  studentPartyId1: Scalars['Long'];
  studentPartyId2: Scalars['Long'];
};

export type CreateStaffGroupMembershipInput = {
  academicNamespaceId: Scalars['Int'];
  fromDate?: InputMaybe<Scalars['Date']>;
  partyId?: InputMaybe<Scalars['Long']>;
  roles?: InputMaybe<Array<InputMaybe<StaffGroupMembershipRoles>>>;
  toDate?: InputMaybe<Scalars['Date']>;
};

export type CreateStaffInput = {
  addresses?: InputMaybe<Array<InputMaybe<InputAddress>>>;
  carRegistrationNumber?: InputMaybe<Scalars['String']>;
  dateOfBirth?: InputMaybe<Scalars['Date']>;
  displayCode?: InputMaybe<Scalars['String']>;
  emails?: InputMaybe<Array<InputMaybe<InputEmailAddress>>>;
  employmentCapacity?: InputMaybe<EmploymentCapacity>;
  externalSystemInfo?: InputMaybe<ExternalSystemInfo>;
  firstName?: InputMaybe<Scalars['String']>;
  gender?: InputMaybe<Gender>;
  includeInTimetabling?: InputMaybe<Scalars['Boolean']>;
  isTeacher?: InputMaybe<Scalars['Boolean']>;
  lastName?: InputMaybe<Scalars['String']>;
  middleName?: InputMaybe<Scalars['String']>;
  noLongerStaff?: InputMaybe<Scalars['Boolean']>;
  payrollNumber?: InputMaybe<Scalars['String']>;
  phoneNumbers?: InputMaybe<Array<InputMaybe<InputPhoneNumber>>>;
  staffIre?: InputMaybe<CreateStaffIreInput>;
  staffIreTeacher?: InputMaybe<CreateStaffTeacherIre>;
  startDate?: InputMaybe<Scalars['Date']>;
};

export type CreateStaffIreInput = {
  countryOfBirth?: InputMaybe<Scalars['String']>;
  pps?: InputMaybe<Scalars['String']>;
  religion?: InputMaybe<Scalars['String']>;
};

export type CreateStaffTeacherIre = {
  teacherCouncilNumber?: InputMaybe<Scalars['String']>;
  teachingPost?: InputMaybe<Scalars['String']>;
};

export type CreateStudentContactInput = {
  addresses?: InputMaybe<Array<InputMaybe<InputAddress>>>;
  emails?: InputMaybe<Array<InputMaybe<InputEmailAddress>>>;
  personal: PersonalInformationInput;
  phoneNumbers?: InputMaybe<Array<InputMaybe<InputPhoneNumber>>>;
  studentRelationships: Array<InputMaybe<StudentContactRelationshipInfoInput>>;
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
  dateOfBirth?: InputMaybe<Scalars['Date']>;
  emails?: InputMaybe<Array<InputMaybe<InputEmailAddress>>>;
  externalSystemInfo?: InputMaybe<ExternalSystemInfo>;
  firstName?: InputMaybe<Scalars['String']>;
  gender?: InputMaybe<Gender>;
  lastName?: InputMaybe<Scalars['String']>;
  middleName?: InputMaybe<Scalars['String']>;
  phoneNumbers?: InputMaybe<Array<InputMaybe<InputPhoneNumber>>>;
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
  borderIndicator?: InputMaybe<Scalars['Boolean']>;
  examNumber?: InputMaybe<Scalars['String']>;
  languageSupportApplicant?: InputMaybe<Scalars['Boolean']>;
  medicalCard?: InputMaybe<Scalars['Boolean']>;
  mothersMaidenName?: InputMaybe<Scalars['String']>;
  previousSchoolRollNumber?: InputMaybe<Scalars['String']>;
  travellerHeritage?: InputMaybe<Scalars['Boolean']>;
};

export type CreateSubjectGroupInput = {
  academicNamespaces?: InputMaybe<Array<InputMaybe<CreateGroupAcademicNamespacesInput>>>;
  externalSystemInfo?: InputMaybe<Array<InputMaybe<ExternalSystemInfo>>>;
  irePP?: InputMaybe<Array<InputMaybe<CreateSubjectGroupIrePpInput>>>;
  name: Scalars['String'];
  staffMembers?: InputMaybe<Array<InputMaybe<CreateStaffGroupMembershipInput>>>;
  studentMembers?: InputMaybe<Array<InputMaybe<CreateGroupMembershipInput>>>;
  subjects: Array<InputMaybe<Scalars['Int']>>;
};

export type CreateSubjectGroupIrePpInput = {
  academicNamespaceId: Scalars['Int'];
  level?: InputMaybe<SubjectGroupLevelIrePp>;
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
  endDate?: Maybe<Scalars['Date']>;
  id: Scalars['Long'];
  name: Scalars['String'];
  results?: Maybe<Array<Maybe<DashboardAssessmentResult>>>;
  startDate?: Maybe<Scalars['Date']>;
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
  subject?: Maybe<Scalars['String']>;
  subjectGroupId?: Maybe<Scalars['Long']>;
};

export type DeleteDiscountInput = {
  id: Scalars['Int'];
};

export type DeleteFeeInput = {
  id: Scalars['Int'];
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

export enum EmploymentCapacity {
  ContractsOfIndefiniteDuration = 'CONTRACTS_OF_INDEFINITE_DURATION',
  PartTime = 'PART_TIME',
  Permanent = 'PERMANENT',
  Private = 'PRIVATE',
  RegularPartTime = 'REGULAR_PART_TIME',
  Temporary = 'TEMPORARY',
  Unknown = 'UNKNOWN',
  Voluntary = 'VOLUNTARY'
}

export type EnrollmentHistory = {
  __typename?: 'EnrollmentHistory';
  academicNamespace: Scalars['String'];
  academicNamespaceId: Scalars['Int'];
  classGroupId: Scalars['Long'];
  classGroupName: Scalars['String'];
  studentPartyId: Scalars['Long'];
};

export type EnrolmentHistoryFilter = {
  partyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
};

export type EventAttendance = {
  __typename?: 'EventAttendance';
  attendanceCodeId: Scalars['Int'];
  date: Scalars['Date'];
  eventId: Scalars['Int'];
  id: Scalars['Long'];
  personPartyId: Scalars['Long'];
};

export type EventAttendanceFilter = {
  date?: InputMaybe<Scalars['Date']>;
  eventIds?: InputMaybe<Array<AttendanceEventId>>;
  personPartyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
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

export type FindFreeResourcesFilter = {
  /**  Optionally search for in particular calendars. If not specified, all calendars will be searched. */
  calendarIds?: InputMaybe<Array<Scalars['Int']>>;
  resources: CalendarResourceFilter;
  /**  Check against these timeslots whether the resrouces are free or not. */
  times: Array<InputMaybe<FindFreeResourcesTime>>;
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
  Male = 'MALE',
  Other = 'OTHER',
  Unknown = 'UNKNOWN'
}

export type GeneralGroup = Party & PartyGroup & {
  __typename?: 'GeneralGroup';
  avatarUrl?: Maybe<Scalars['String']>;
  /**     deep linked */
  contactMembers?: Maybe<Group>;
  /**     deep linked */
  contacts?: Maybe<Array<Maybe<Person>>>;
  generalGroupType: GeneralGroupType;
  name: Scalars['String'];
  partyId: Scalars['Long'];
  programmeStages?: Maybe<Array<Maybe<ProgrammeStage>>>;
  /**     deep linked */
  staff?: Maybe<Array<Maybe<Person>>>;
  /**     deep linked */
  staffMembers?: Maybe<Group>;
  /**     deep linked */
  studentMembers?: Maybe<Group>;
  /**     deep linked */
  students?: Maybe<Array<Maybe<Student>>>;
  /**     deep linked */
  tutors: Array<Person>;
  /**     deep linked */
  yearGroupLeads: Array<Person>;
  /**     deep linked */
  yearGroups: Array<YearGroupEnrollment>;
};

export type GeneralGroupFilter = {
  groupTypes?: InputMaybe<Array<InputMaybe<GeneralGroupType>>>;
  partyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
};

export enum GeneralGroupType {
  ClassGroup = 'CLASS_GROUP',
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
  active?: Maybe<Scalars['Boolean']>;
  end?: Maybe<Scalars['Int']>;
  id: Scalars['Long'];
  name?: Maybe<Scalars['String']>;
  nameTextId?: Maybe<Scalars['Int']>;
  passFailThreshold?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
  studyLevels?: Maybe<Array<Maybe<GradeSetStudyLevel>>>;
};

export type GradeSet = {
  __typename?: 'GradeSet';
  active?: Maybe<Scalars['Boolean']>;
  customGradeSet?: Maybe<Scalars['Boolean']>;
  description?: Maybe<Scalars['String']>;
  descriptionTextId?: Maybe<Scalars['Int']>;
  grades?: Maybe<Array<Maybe<Grade>>>;
  id: Scalars['Long'];
  isCba?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  nameTextId?: Maybe<Scalars['Int']>;
  passFailThreshold?: Maybe<Scalars['Int']>;
  years?: Maybe<Array<Maybe<Scalars['Int']>>>;
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
  memberIds?: Maybe<Array<Maybe<Scalars['Long']>>>;
  /**     deep linked */
  members?: Maybe<Array<Maybe<GroupMembership>>>;
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
  description?: InputMaybe<Array<InputMaybe<TranslationInput>>>;
  id?: InputMaybe<Scalars['Int']>;
  name: Array<InputMaybe<TranslationInput>>;
  nationalCode: Scalars['String'];
  region: Scalars['Int'];
  shortCode: Array<InputMaybe<TranslationInput>>;
  subjectSource?: InputMaybe<SubjectSource>;
};

export type InputAddress = {
  active?: InputMaybe<Scalars['Boolean']>;
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
  active?: InputMaybe<Scalars['Boolean']>;
  email?: InputMaybe<Scalars['String']>;
  emailId?: InputMaybe<Scalars['Int']>;
  primaryEmail?: InputMaybe<Scalars['Boolean']>;
};

export type InputPhoneNumber = {
  active?: InputMaybe<Scalars['Boolean']>;
  areaCode?: InputMaybe<Scalars['String']>;
  countryCode?: InputMaybe<Scalars['String']>;
  number?: InputMaybe<Scalars['String']>;
  phoneNumberId?: InputMaybe<Scalars['Int']>;
  primaryPhoneNumber?: InputMaybe<Scalars['Boolean']>;
};

export type InviteUser = {
  email: Scalars['String'];
  givenName: Scalars['String'];
  personPartyId: Scalars['Long'];
  surname: Scalars['String'];
  userType: UserType;
};

export enum Iterator {
  Closest = 'CLOSEST',
  Next = 'NEXT',
  Previous = 'PREVIOUS'
}

export type Label = {
  __typename?: 'Label';
  colour?: Maybe<Scalars['String']>;
  custom?: Maybe<Scalars['Boolean']>;
  id: Scalars['Long'];
  name: Scalars['String'];
  personPartyId: Scalars['Long'];
};

export type LabelFilter = {
  id?: InputMaybe<Scalars['Long']>;
  personPartyId?: InputMaybe<Scalars['Long']>;
};

export type LabelInput = {
  colour?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Long']>;
  name: Scalars['String'];
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
  labels?: Maybe<Array<Maybe<Label>>>;
  latestMessage?: Maybe<Scalars['DateTime']>;
  readOn?: Maybe<Scalars['DateTime']>;
  recipients?: Maybe<Array<Maybe<Recipient>>>;
  rootMailId: Scalars['Long'];
  senderPartyId: Scalars['Long'];
  sentOn: Scalars['DateTime'];
  starred?: Maybe<Scalars['Boolean']>;
  subject: Scalars['String'];
  threadId: Scalars['Long'];
  threads?: Maybe<Array<Maybe<Mail>>>;
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

export type Mutation = {
  __typename?: 'Mutation';
  asd?: Maybe<Scalars['String']>;
  assessment_saveAssessment?: Maybe<Assessment>;
  assessment_saveAssessmentComments?: Maybe<Array<Maybe<AssessmentComment>>>;
  assessment_saveAssessmentResults?: Maybe<Array<Maybe<AssessmentResult>>>;
  assessment_saveCommentBank?: Maybe<CommentBank>;
  assessment_saveGradeSet?: Maybe<GradeSet>;
  attendance_saveAttendanceCode?: Maybe<AttendanceCode>;
  attendance_saveEventAttendance?: Maybe<Array<Maybe<EventAttendance>>>;
  attendance_saveParentalAttendanceRequest?: Maybe<Array<Maybe<ParentalAttendanceRequest>>>;
  attendance_saveSession?: Maybe<Session>;
  attendance_saveStudentSessionAttendance?: Maybe<Array<Maybe<StudentSessionAttendance>>>;
  calendar_createCalendarEvents?: Maybe<Array<Maybe<CalendarEventRaw>>>;
  catalogue_createSubjects?: Maybe<Array<Maybe<Subject>>>;
  catalogue_upsertSubjects?: Maybe<CatalogueSuccess>;
  communications_assignLabel?: Maybe<Mail>;
  communications_read?: Maybe<Scalars['String']>;
  communications_registerDevice?: Maybe<DeviceRegistration>;
  communications_saveLabel?: Maybe<Label>;
  communications_saveNotificationTemplate?: Maybe<NotificationTemplate>;
  communications_sendMail?: Maybe<Mail>;
  communications_sendNotification?: Maybe<NotificationSentResponse>;
  communications_sendSms?: Maybe<Scalars['String']>;
  communications_smsTopUp?: Maybe<SmsTopUpResponse>;
  communications_starred?: Maybe<Scalars['String']>;
  core_setActiveActiveAcademicNamespace?: Maybe<AcademicNamespace>;
  core_updateStudents?: Maybe<Success>;
  createProfileForGlobalUser?: Maybe<Profile>;
  createRole?: Maybe<SecurityRole>;
  fees_deleteDiscount?: Maybe<Scalars['String']>;
  fees_deleteFee?: Maybe<Scalars['String']>;
  fees_saveDiscount?: Maybe<Discount>;
  fees_saveFee?: Maybe<Fee>;
  /**  staff_work_upsert_absence_type(input: [UpsertStaffAbsenceType]): [StaffAbsenceType!]! */
  staffWork_upsertAbsence: Array<StaffAbsence>;
  users_inviteUsers?: Maybe<Array<Maybe<UserInvitation>>>;
  wellbeing_savePriorityStudent?: Maybe<PriorityStudent>;
  wellbeing_saveStudentSupportFile?: Maybe<StudentSupportFile>;
  wellbeing_saveStudentSupportPlan?: Maybe<StudentSupportPlan>;
  wellbeing_saveStudentSupportPlanReview?: Maybe<StudentSupportPlanReview>;
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
  input?: InputMaybe<SaveAttendanceCodeInput>;
};


export type MutationAttendance_SaveEventAttendanceArgs = {
  input?: InputMaybe<Array<InputMaybe<SaveEventAttendanceInput>>>;
};


export type MutationAttendance_SaveParentalAttendanceRequestArgs = {
  input?: InputMaybe<Array<InputMaybe<SaveParentalAttendanceRequest>>>;
};


export type MutationAttendance_SaveSessionArgs = {
  input?: InputMaybe<SaveSessionInput>;
};


export type MutationAttendance_SaveStudentSessionAttendanceArgs = {
  input?: InputMaybe<Array<InputMaybe<SaveStudentSessionAttendanceInput>>>;
};


export type MutationCalendar_CreateCalendarEventsArgs = {
  input?: InputMaybe<CreateCalendarEventsInput>;
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


export type MutationCore_SetActiveActiveAcademicNamespaceArgs = {
  input?: InputMaybe<SetActiveAcademicNamespace>;
};


export type MutationCore_UpdateStudentsArgs = {
  input?: InputMaybe<Array<InputMaybe<UpdateStudentInput>>>;
};


export type MutationCreateProfileForGlobalUserArgs = {
  input?: InputMaybe<CreateProfileForGlobalUserInput>;
};


export type MutationCreateRoleArgs = {
  input?: InputMaybe<CreateRoleInput>;
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


export type MutationStaffWork_UpsertAbsenceArgs = {
  input: Array<UpsertStaffAbsence>;
};


export type MutationUsers_InviteUsersArgs = {
  input?: InputMaybe<Array<InputMaybe<InviteUser>>>;
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

export type MyLabelsFilter = {
  personPartyId: Scalars['Long'];
};

export type Notification = {
  __typename?: 'Notification';
  id: Scalars['Long'];
  metaData?: Maybe<NotificationMetaData>;
  notificationType: NotificationType;
  readOn?: Maybe<Scalars['DateTime']>;
  recipientId: Scalars['Long'];
  sentOn: Scalars['DateTime'];
  status?: Maybe<NotificationStatus>;
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
  partyId?: Maybe<Scalars['Long']>;
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

export type Pagination = {
  lastId?: InputMaybe<Scalars['Long']>;
  lastMessage?: InputMaybe<Scalars['DateTime']>;
  limit: Scalars['Int'];
};

export type ParentalAttendanceRequest = {
  __typename?: 'ParentalAttendanceRequest';
  adminNote?: Maybe<Scalars['String']>;
  attendanceCodeId: Scalars['Int'];
  contactPartyId: Scalars['Long'];
  from: Scalars['DateTime'];
  id: Scalars['Long'];
  parentNote: Scalars['String'];
  requestType: ParentalAttendanceRequestType;
  status: ParentalAttendanceRequestStatus;
  studentPartyId: Scalars['Long'];
  to: Scalars['DateTime'];
};

export type ParentalAttendanceRequestFilter = {
  contactPartyId?: InputMaybe<Scalars['Long']>;
  id?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
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
  name: Scalars['String'];
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
  permissionGroupType?: InputMaybe<PermissionGroupType>;
};

export enum PermissionGroupType {
  All = 'ALL',
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
  title?: Maybe<Scalars['String']>;
  titleId?: Maybe<Scalars['Int']>;
  type?: Maybe<PartyPersonType>;
};

export type PersonFilter = {
  partyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
  profilePartyType?: InputMaybe<PartyPersonType>;
};

export type PersonalInformation = {
  __typename?: 'PersonalInformation';
  addresses?: Maybe<Array<Maybe<Address>>>;
  dateOfBirth?: Maybe<Scalars['Date']>;
  emails?: Maybe<Array<Maybe<EmailAddress>>>;
  firstName: Scalars['String'];
  gender?: Maybe<Gender>;
  ire?: Maybe<PersonalInformationIre>;
  lastName: Scalars['String'];
  middleName?: Maybe<Scalars['String']>;
  mothersMaidenName?: Maybe<Scalars['String']>;
  nationality?: Maybe<Scalars['String']>;
  phoneNumbers?: Maybe<Array<Maybe<PhoneNumber>>>;
  preferredFirstName?: Maybe<Scalars['String']>;
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
  number?: Maybe<Scalars['String']>;
  partyId: Scalars['Long'];
  phoneNumberId?: Maybe<Scalars['Int']>;
  primaryPhoneNumber?: Maybe<Scalars['Boolean']>;
};

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
  permissions?: Maybe<Array<Maybe<Permission>>>;
  profileType?: Maybe<ProfileType>;
  profileTypeId?: Maybe<Scalars['Int']>;
  securityRoleIds?: Maybe<Array<Maybe<Scalars['Int']>>>;
  tenant: Tenant;
  tenantId?: Maybe<Scalars['Int']>;
};

export type ProfileFilter = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  partyPersonIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
};

export type ProfileType = {
  __typename?: 'ProfileType';
  defaultRoleIds?: Maybe<Array<Maybe<Scalars['Int']>>>;
  defaultRoles: Array<Maybe<SecurityRole>>;
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
  nationalCode?: Maybe<Scalars['String']>;
  programme?: Maybe<Programme>;
  programmeId?: Maybe<Scalars['Int']>;
  shortName?: Maybe<Scalars['String']>;
  shortNameTextId?: Maybe<Scalars['Int']>;
};

export type ProgrammeStageEnrollment = {
  __typename?: 'ProgrammeStageEnrollment';
  academicNamespaceId: Scalars['Int'];
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
  admin__party_people?: Maybe<Array<Maybe<Person>>>;
  admin__tenants?: Maybe<Array<Maybe<Tenant>>>;
  asd?: Maybe<Scalars['String']>;
  assessment_assessment?: Maybe<Array<Maybe<Assessment>>>;
  assessment_assessmentComment?: Maybe<Array<Maybe<AssessmentComment>>>;
  assessment_assessmentResult?: Maybe<Array<Maybe<AssessmentResult>>>;
  assessment_assessmentSubjectGroups?: Maybe<Array<Maybe<AssessmentSubjectGroup>>>;
  assessment_commentBank?: Maybe<Array<Maybe<CommentBank>>>;
  assessment_dashboardAssessment?: Maybe<Array<Maybe<DashboardAssessment>>>;
  assessment_gradeSet?: Maybe<Array<Maybe<GradeSet>>>;
  attendance_attendanceCodes?: Maybe<Array<Maybe<AttendanceCode>>>;
  attendance_eventAttendance?: Maybe<Array<Maybe<EventAttendance>>>;
  attendance_parentalAttendanceRequests?: Maybe<Array<Maybe<ParentalAttendanceRequest>>>;
  attendance_session?: Maybe<Array<Maybe<Session>>>;
  attendance_studentSessionAttendance?: Maybe<Array<Maybe<StudentSessionAttendance>>>;
  calendar_calendarEvents?: Maybe<ResourceCalendarWrapper>;
  calendar_calendarEventsIterator?: Maybe<CalendarEvent>;
  calendar_dayInfo: Array<CalendarDayInfo>;
  /**    Checks whether the searched for calendar resources are free or not at particular times */
  calendar_findFreeResources: Array<FreeCalendarResources>;
  catalogue_personalTitles?: Maybe<Array<Maybe<PersonalTitle>>>;
  catalogue_subjects?: Maybe<Array<Maybe<Subject>>>;
  catalogue_years?: Maybe<Array<Maybe<YearGroup>>>;
  communications_label?: Maybe<Array<Maybe<Label>>>;
  communications_mail?: Maybe<Array<Maybe<Mail>>>;
  communications_notificationTemplates?: Maybe<Array<Maybe<NotificationTemplate>>>;
  communications_notifications?: Maybe<Array<Maybe<Notification>>>;
  communications_registeredDevices?: Maybe<Array<Maybe<DeviceRegistration>>>;
  communications_smsCredit?: Maybe<SmsCredit>;
  communications_unreadCount?: Maybe<Array<Maybe<UnreadCount>>>;
  composite_studentStatus: StudentStatus;
  core_academicNamespaces?: Maybe<Array<Maybe<AcademicNamespace>>>;
  core_parties: Array<Party>;
  core_rooms?: Maybe<Array<Maybe<Room>>>;
  core_staff: Array<Staff>;
  core_studentContacts?: Maybe<Array<Maybe<StudentContact>>>;
  core_students?: Maybe<Array<Maybe<Student>>>;
  fees_discounts?: Maybe<Array<Maybe<Discount>>>;
  fees_fees?: Maybe<Array<Maybe<Fee>>>;
  generalGroups?: Maybe<Array<Maybe<GeneralGroup>>>;
  myAuthDetails?: Maybe<GlobalUser>;
  permissions?: Maybe<Array<Maybe<Permission>>>;
  profileTypes?: Maybe<Array<Maybe<ProfileType>>>;
  profiles?: Maybe<Array<Maybe<ProfileType>>>;
  roles?: Maybe<Array<Maybe<SecurityRole>>>;
  search_search: Array<Search>;
  staffWork_absenceTypes: Array<StaffAbsenceType>;
  staffWork_absences: Array<StaffAbsence>;
  staffWork_substitutions: Array<Substitution>;
  subjectGroups?: Maybe<Array<Maybe<SubjectGroup>>>;
  users_userInvitations?: Maybe<Array<Maybe<UserInvitation>>>;
  wellbeing_activeSupportPlan?: Maybe<Array<Maybe<ActivePlan>>>;
  wellbeing_priorityStudent?: Maybe<Array<Maybe<PriorityStudent>>>;
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


export type QueryAttendance_EventAttendanceArgs = {
  filter?: InputMaybe<EventAttendanceFilter>;
};


export type QueryAttendance_ParentalAttendanceRequestsArgs = {
  filter?: InputMaybe<ParentalAttendanceRequestFilter>;
};


export type QueryAttendance_SessionArgs = {
  filter?: InputMaybe<SessionFilter>;
};


export type QueryAttendance_StudentSessionAttendanceArgs = {
  filter?: InputMaybe<StudentSessionAttendanceFilter>;
};


export type QueryCalendar_CalendarEventsArgs = {
  filter?: InputMaybe<CalendarEventFilter>;
};


export type QueryCalendar_CalendarEventsIteratorArgs = {
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


export type QueryCommunications_UnreadCountArgs = {
  filter?: InputMaybe<UnreadCountFilter>;
};


export type QueryComposite_StudentStatusArgs = {
  filter?: InputMaybe<StudentStatusFilter>;
};


export type QueryCore_AcademicNamespacesArgs = {
  filter?: InputMaybe<AcademicNamespaceFilter>;
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


export type QueryFees_DiscountsArgs = {
  filter?: InputMaybe<DiscountFilter>;
};


export type QueryFees_FeesArgs = {
  filter?: InputMaybe<FeeFilter>;
};


export type QueryGeneralGroupsArgs = {
  filter?: InputMaybe<GeneralGroupFilter>;
};


export type QueryProfileTypesArgs = {
  filter?: InputMaybe<ProfileTypeFilter>;
};


export type QueryProfilesArgs = {
  filter?: InputMaybe<ProfileFilter>;
};


export type QueryRolesArgs = {
  filter?: InputMaybe<SecurityRoleFilter>;
};


export type QuerySearch_SearchArgs = {
  filter?: InputMaybe<SearchFilter>;
};


export type QueryStaffWork_AbsenceTypesArgs = {
  filter?: InputMaybe<StaffAbsenceTypeFilter>;
};


export type QueryStaffWork_AbsencesArgs = {
  filter?: InputMaybe<StaffAbsenceFilter>;
};


export type QueryStaffWork_SubstitutionsArgs = {
  filter?: InputMaybe<SubstitutionsFilter>;
};


export type QuerySubjectGroupsArgs = {
  filter?: InputMaybe<SubjectGroupFilter>;
};


export type QueryUsers_UserInvitationsArgs = {
  filter?: InputMaybe<UserInvitationFilter>;
};


export type QueryWellbeing_ActiveSupportPlanArgs = {
  filter?: InputMaybe<ActiveSupportPlanFilter>;
};


export type QueryWellbeing_PriorityStudentArgs = {
  filter?: InputMaybe<PriorityStudentFilter>;
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
  name?: Maybe<Scalars['String']>;
  recipientPartyId: Scalars['Long'];
  recipientType: RecipientType;
};

export type RecipientInput = {
  recipientPartyId: Scalars['Long'];
  recipientPartyType: SearchType;
};

export enum RecipientType {
  Bcc = 'BCC',
  Cc = 'CC',
  To = 'TO'
}

export type RegisterDeviceInput = {
  deviceId: Scalars['String'];
  deviceMake: Scalars['String'];
  deviceType: DeviceType;
  osVersion: Scalars['String'];
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
  name: Scalars['String'];
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
  roomIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export type SaveAssessmentCommentInput = {
  assessmentId: Scalars['Long'];
  comment?: InputMaybe<Scalars['String']>;
  commentBankCommentId?: InputMaybe<Scalars['Long']>;
  commenterPartyId?: InputMaybe<Scalars['Long']>;
  commenterUserType?: InputMaybe<CommenterUserType>;
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
  description?: InputMaybe<Scalars['String']>;
  endDate: Scalars['Date'];
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
  gradeSetGradeId?: InputMaybe<Scalars['Long']>;
  id?: InputMaybe<Scalars['Long']>;
  result: Scalars['Int'];
  resultExtraFields?: InputMaybe<Array<InputMaybe<SaveResultExtraFieldInput>>>;
  studentPartyId: Scalars['Long'];
  subjectGroupId: Scalars['Long'];
  targetGradeSetGradeId?: InputMaybe<Scalars['Long']>;
  targetResult?: InputMaybe<Scalars['Int']>;
};

export type SaveAttendanceCodeInput = {
  code: Scalars['String'];
  codeType?: InputMaybe<AttendanceCodeType>;
  id?: InputMaybe<Scalars['Int']>;
  isActive?: InputMaybe<Scalars['Boolean']>;
  name: Array<InputMaybe<TranslationInput>>;
  visibleForContact?: InputMaybe<Scalars['Boolean']>;
  visibleForTeacher?: InputMaybe<Scalars['Boolean']>;
};

export type SaveCommentBankInput = {
  active?: InputMaybe<Scalars['Boolean']>;
  comments: Array<SaveCommentInput>;
  description?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Long']>;
  name: Scalars['String'];
};

export type SaveCommentInput = {
  active?: InputMaybe<Scalars['Boolean']>;
  comment?: InputMaybe<Scalars['String']>;
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
  attendanceCodeId: Scalars['Int'];
  date: Scalars['Date'];
  eventId: Scalars['Int'];
  id?: InputMaybe<Scalars['Long']>;
  personPartyId: Scalars['Long'];
};

export type SaveExtraFieldInput = {
  commentBankId?: InputMaybe<Scalars['Long']>;
  commentLength?: InputMaybe<Scalars['Int']>;
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
  grades: Array<SaveGradeInput>;
  id?: InputMaybe<Scalars['Long']>;
  isCba?: InputMaybe<Scalars['Boolean']>;
  name: Array<TranslationInput>;
  passFailThreshold?: InputMaybe<Scalars['Int']>;
  years?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export type SaveNotificationTemplateInput = {
  id?: InputMaybe<Scalars['Long']>;
  name: Scalars['String'];
  text: Scalars['String'];
  title: Scalars['String'];
};

export type SaveParentalAttendanceRequest = {
  adminNote?: InputMaybe<Scalars['String']>;
  attendanceCodeId: Scalars['Int'];
  from: Scalars['DateTime'];
  id?: InputMaybe<Scalars['Long']>;
  parentNote: Scalars['String'];
  requestType: ParentalAttendanceRequestType;
  status: ParentalAttendanceRequestStatus;
  studentPartyId: Scalars['Long'];
  to: Scalars['DateTime'];
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

export type SaveSessionInput = {
  id?: InputMaybe<Scalars['Int']>;
  isActive?: InputMaybe<Scalars['Boolean']>;
  name: Array<InputMaybe<TranslationInput>>;
  time: Scalars['Time'];
};

export type SaveStudentSessionAttendanceInput = {
  attendanceCodeId: Scalars['Int'];
  date: Scalars['Date'];
  id?: InputMaybe<Scalars['Long']>;
  sessionAttendanceId: Scalars['Int'];
  studentPartyId: Scalars['Long'];
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

export enum SchoolDayType {
  NonSchoolDay = 'NON_SCHOOL_DAY',
  Partial = 'PARTIAL',
  PublicHoliday = 'PUBLIC_HOLIDAY',
  SchoolDay = 'SCHOOL_DAY'
}

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
  text?: InputMaybe<Scalars['String']>;
};

export type SearchMeta = {
  __typename?: 'SearchMeta';
  groupType?: Maybe<GeneralGroupType>;
  studentPartyId?: Maybe<Scalars['Long']>;
};

export enum SearchType {
  Contact = 'CONTACT',
  GeneralGroup = 'GENERAL_GROUP',
  GeneralGroupContact = 'GENERAL_GROUP_CONTACT',
  GeneralGroupStaff = 'GENERAL_GROUP_STAFF',
  GeneralGroupStudent = 'GENERAL_GROUP_STUDENT',
  Staff = 'STAFF',
  Student = 'STUDENT',
  SubjectGroup = 'SUBJECT_GROUP',
  SubjectGroupContact = 'SUBJECT_GROUP_CONTACT',
  SubjectGroupStaff = 'SUBJECT_GROUP_STAFF',
  SubjectGroupStudent = 'SUBJECT_GROUP_STUDENT'
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
  ids: Array<Scalars['Long']>;
  notificationType: NotificationType;
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

export type SessionAttendanceStatus = {
  __typename?: 'SessionAttendanceStatus';
  codeType: AttendanceCodeType;
  name?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  studentPartyId: Scalars['Long'];
};

export type SessionFilter = {
  active?: InputMaybe<Scalars['Boolean']>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export type SetActiveAcademicNamespace = {
  academicNamespaceId: Scalars['Int'];
};

export type SmsCredit = {
  __typename?: 'SmsCredit';
  smsCredit: Scalars['Float'];
};

export type SmsSentResponse = {
  __typename?: 'SmsSentResponse';
  numSmsSent: Scalars['Int'];
  smsSentCost: Scalars['Float'];
};

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
  carRegistrationNumber?: Maybe<Scalars['String']>;
  dateOfBirth?: Maybe<Scalars['Date']>;
  displayCode?: Maybe<Scalars['String']>;
  employmentCapacity?: Maybe<EmploymentCapacity>;
  endDate?: Maybe<Scalars['Date']>;
  includeInTimetabling?: Maybe<Scalars['Boolean']>;
  isTeacher?: Maybe<Scalars['Boolean']>;
  noLongerStaffMember?: Maybe<Scalars['Boolean']>;
  partyId: Scalars['Long'];
  payrollNumber?: Maybe<Scalars['String']>;
  person: Person;
  personalInformation?: Maybe<PersonalInformation>;
  staffIre?: Maybe<StaffIre>;
  staffIreTeacher?: Maybe<StaffTeacherIre>;
  startDate?: Maybe<Scalars['Date']>;
};

export type StaffAbsence = {
  __typename?: 'StaffAbsence';
  absenceId: Scalars['Int'];
  absenceReasonText?: Maybe<Scalars['String']>;
  absenceType: StaffAbsenceType;
  absenceTypeId: Scalars['Int'];
  fromAbsenceRequestId?: Maybe<Scalars['Int']>;
  fromDate?: Maybe<Scalars['Date']>;
  staff?: Maybe<Person>;
  staffPartyId: Scalars['Long'];
  substitutionRequired?: Maybe<Scalars['Boolean']>;
  toDate?: Maybe<Scalars['Date']>;
};

export type StaffAbsenceFilter = {
  fromDate?: InputMaybe<Scalars['Date']>;
  staffAbsenceIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  staffPartyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
  toDate?: InputMaybe<Scalars['Date']>;
};

export type StaffAbsenceRequest = {
  __typename?: 'StaffAbsenceRequest';
  absenceReasonText?: Maybe<Scalars['String']>;
  absenceRequestStatus?: Maybe<StaffAbsenceRequestStatusEnum>;
  absenceTypeId: Scalars['Int'];
  fromAbsenceRequestId?: Maybe<Scalars['Int']>;
  fromDate?: Maybe<Scalars['Date']>;
  rejectionReasonText?: Maybe<Scalars['String']>;
  staffPartyId: Scalars['Long'];
  toDate?: Maybe<Scalars['Date']>;
};

export type StaffAbsenceRequestFilter = {
  fromDate?: InputMaybe<Scalars['Date']>;
  staffPartyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
  staffRequestIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  toDate?: InputMaybe<Scalars['Date']>;
};

export enum StaffAbsenceRequestStatusEnum {
  Approved = 'APPROVED',
  Pending = 'PENDING',
  Rejected = 'REJECTED'
}

export type StaffAbsenceType = {
  __typename?: 'StaffAbsenceType';
  absenceTypeId: Scalars['Int'];
  availableForRequests: Scalars['Boolean'];
  code: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  descriptionTextId?: Maybe<Scalars['Int']>;
  name: Scalars['String'];
  nameTextId?: Maybe<Scalars['Int']>;
};

export type StaffAbsenceTypeFilter = {
  absenceTypeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export type StaffFilter = {
  partyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
};

export enum StaffGroupMembershipRoles {
  GroupAdmin = 'GROUP_ADMIN',
  Support = 'SUPPORT',
  Teacher = 'TEACHER',
  Tutor = 'TUTOR'
}

export type StaffIre = {
  __typename?: 'StaffIre';
  countryOfBirth?: Maybe<Scalars['String']>;
  pps?: Maybe<Scalars['String']>;
  religion?: Maybe<Scalars['String']>;
};

export enum StaffProgrammeStageMembershipRoles {
  GroupAdmin = 'GROUP_ADMIN',
  ProgrammeLead = 'PROGRAMME_LEAD',
  Support = 'SUPPORT'
}

export type StaffTeacherIre = {
  __typename?: 'StaffTeacherIre';
  teacherCouncilNumber?: Maybe<Scalars['String']>;
  teachingPost?: Maybe<Scalars['String']>;
};

export enum StaffYearGroupMembershipRoles {
  GroupAdmin = 'GROUP_ADMIN',
  Support = 'SUPPORT',
  YearGroupLead = 'YEAR_GROUP_LEAD'
}

export type Student = Party & PartyPerson & {
  __typename?: 'Student';
  /**  deep linked */
  classGroup?: Maybe<GeneralGroup>;
  /**  deep linked */
  contacts?: Maybe<Array<Maybe<StudentContact>>>;
  /**  deep linked */
  enrolmentHistory?: Maybe<Array<Maybe<EnrollmentHistory>>>;
  extensions?: Maybe<StudentGraphqlExtension>;
  partyId: Scalars['Long'];
  /**  deep linked */
  person: Person;
  /**  deep linked */
  personalInformation?: Maybe<PersonalInformation>;
  programmeStages?: Maybe<Array<Maybe<ProgrammeStage>>>;
  startDate?: Maybe<Scalars['Date']>;
  studentIrePP?: Maybe<StudentIrePp>;
  /**  deep linked */
  tutors: Array<Person>;
  yearGroupLeads: Array<Person>;
  yearGroups: Array<YearGroupEnrollment>;
};

export type StudentContact = Party & PartyPerson & {
  __typename?: 'StudentContact';
  occupation?: Maybe<Scalars['String']>;
  partyId: Scalars['Long'];
  person: Person;
  /**  deep linked */
  personalInformation?: Maybe<PersonalInformation>;
  relationships?: Maybe<Array<Maybe<StudentContactRelationshipInfo>>>;
};

export type StudentContactFilter = {
  studentContactPartyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
  studentPartyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
};

export type StudentContactRelationshipInfo = {
  __typename?: 'StudentContactRelationshipInfo';
  allowedToContact?: Maybe<Scalars['Boolean']>;
  contactPartyId: Scalars['Long'];
  primaryContact?: Maybe<Scalars['Boolean']>;
  relationshipType: StudentContactType;
  student: Student;
  studentPartyId: Scalars['Long'];
};

export type StudentContactRelationshipInfoInput = {
  allowedToContact?: InputMaybe<Scalars['Boolean']>;
  primaryContact?: InputMaybe<Scalars['Boolean']>;
  relationshipType: StudentContactType;
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
  Sibling = 'SIBLING',
  Uncle = 'UNCLE'
}

export type StudentFilter = {
  partyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
};

export type StudentGraphqlExtension = {
  __typename?: 'StudentGraphqlExtension';
  doeNotUser?: Maybe<Scalars['String']>;
  exampleExtension?: Maybe<Scalars['String']>;
  objectExample?: Maybe<ExampleObjectExtension>;
};

export type StudentIre = {
  __typename?: 'StudentIre';
  countryOfBirth?: Maybe<Scalars['String']>;
  pps?: Maybe<Scalars['String']>;
  religion?: Maybe<Scalars['String']>;
};

export type StudentIrePp = {
  __typename?: 'StudentIrePP';
  borderIndicator?: Maybe<Scalars['Boolean']>;
  examNumber?: Maybe<Scalars['String']>;
  languageSupportApplicant?: Maybe<Scalars['Boolean']>;
  medicalCard?: Maybe<Scalars['Boolean']>;
  previousSchoolRollNumber?: Maybe<Scalars['String']>;
  travellerHeritage?: Maybe<Scalars['Boolean']>;
};

export type StudentSessionAttendance = {
  __typename?: 'StudentSessionAttendance';
  attendanceCodeId: Scalars['Int'];
  date: Scalars['Date'];
  id: Scalars['Long'];
  sessionAttendanceId: Scalars['Int'];
  studentPartyId: Scalars['Long'];
};

export type StudentSessionAttendanceFilter = {
  date?: InputMaybe<Scalars['Date']>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
  studentPartyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
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
  alsoInAcademicNamespaces?: Maybe<Array<Maybe<Scalars['Int']>>>;
  avatarUrl?: Maybe<Scalars['String']>;
  irePP?: Maybe<SubjectGroupIrePp>;
  /**  this will return the actual name or the subject depending on the user type. Contacts/Students -> Subject name eveeryone else -> actual name */
  name: Scalars['String'];
  partyId: Scalars['Long'];
  programmeStages?: Maybe<Array<Maybe<ProgrammeStage>>>;
  staff?: Maybe<Array<Maybe<Person>>>;
  /**     deep linked */
  staffMembers?: Maybe<Group>;
  /**     deep linked */
  studentMembers?: Maybe<Group>;
  students?: Maybe<Array<Maybe<Student>>>;
  subjectIds?: Maybe<Array<Maybe<Scalars['Int']>>>;
  /**     deep linked */
  subjects?: Maybe<Array<Maybe<Subject>>>;
  yearGroups: Array<YearGroupEnrollment>;
};

export type SubjectGroupFilter = {
  partyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
};

export type SubjectGroupIrePp = {
  __typename?: 'SubjectGroupIrePP';
  level?: Maybe<SubjectGroupLevelIrePp>;
};

export enum SubjectGroupLevelIrePp {
  Common = 'COMMON',
  Foundation = 'FOUNDATION',
  Higher = 'HIGHER',
  NotApplicable = 'NOT_APPLICABLE',
  Ordinary = 'ORDINARY'
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

export type Substitution = {
  __typename?: 'Substitution';
  canSplitByDate: Scalars['Boolean'];
  canSplitByTime: Scalars['Boolean'];
  coverType?: Maybe<Scalars['String']>;
  eventCount: Scalars['Int'];
  eventType: CalendarEventType;
  events: Array<CalendarEvent>;
  fromDate: Scalars['Date'];
  name: Scalars['String'];
  originalStaff: Person;
  originalStaffPartyId: Scalars['Long'];
  subjectGroup?: Maybe<SubjectGroup>;
  subjectGroupId?: Maybe<Scalars['Long']>;
  substituteStaff?: Maybe<Person>;
  substituteStaffId?: Maybe<Scalars['Long']>;
  substitutionId?: Maybe<Scalars['Int']>;
  times: Array<SubstitutionTime>;
  toDate: Scalars['Date'];
};

export type SubstitutionTime = {
  __typename?: 'SubstitutionTime';
  endTime: Scalars['Time'];
  isoDayOfWeek: Scalars['Int'];
  startTime: Scalars['Time'];
};

/**  Either search for an absence or a party between dates */
export type SubstitutionsFilter = {
  /**  request Required Substitutions for an absence */
  absenceId?: InputMaybe<Scalars['Int']>;
  calendarEventFilter?: InputMaybe<CalendarEventFilter>;
};

export type Success = {
  __typename?: 'Success';
  success?: Maybe<Scalars['Boolean']>;
};

export enum TargetStatus {
  Achieved = 'ACHIEVED',
  InProgress = 'IN_PROGRESS',
  NotAchieved = 'NOT_ACHIEVED',
  NotApplicable = 'NOT_APPLICABLE'
}

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

export type UnreadCount = {
  __typename?: 'UnreadCount';
  count: Scalars['Int'];
  labelId: Scalars['Long'];
};

export type UnreadCountFilter = {
  personPartyId: Scalars['Long'];
};

export type UpdateStudentInput = {
  examNumber?: InputMaybe<Scalars['String']>;
  preferredName?: InputMaybe<Scalars['String']>;
  primaryEmail?: InputMaybe<Scalars['String']>;
  primaryPhoneNumber?: InputMaybe<Scalars['String']>;
  studentPartyId: Scalars['Long'];
};

/** ## Creates or replaces grid on calendar */
export type UpsertCalendarGrid = {
  calendarGridId?: InputMaybe<Scalars['Int']>;
  calendarId: Scalars['Int'];
  /**  order of these days is the order they will appear in the calendar */
  days?: InputMaybe<Array<InputMaybe<UpsertGridDay>>>;
  /**  date grid is active from. default to calendar dates if null */
  fromDate?: InputMaybe<Scalars['Date']>;
  /**  date grid is active to. default to calendar dates if null */
  toDate?: InputMaybe<Scalars['Date']>;
};

export type UpsertGridDay = {
  /**  iso day of week. 1 monday .. 7 sunday */
  dayOfWeek: Scalars['Int'];
  periods: Array<UpsertGridPeriod>;
};

export type UpsertGridPeriod = {
  endTime: Scalars['Time'];
  /**  periods are sequential with no gapes between them */
  startTime: Scalars['Time'];
  type: CalendarGridPeriodType;
};

export type UpsertRoomInput = {
  capacity?: InputMaybe<Scalars['Int']>;
  name: Scalars['String'];
  roomId?: InputMaybe<Scalars['Int']>;
};

export type UpsertStaffAbsence = {
  absenceReasonText?: InputMaybe<Scalars['String']>;
  absenceTypeId: Scalars['Int'];
  fromAbsenceRequestId?: InputMaybe<Scalars['Int']>;
  fromDate: Scalars['Date'];
  staffAbsenceId?: InputMaybe<Scalars['Int']>;
  staffPartyId: Scalars['Long'];
  substitutionRequired?: InputMaybe<Scalars['Boolean']>;
  toDate: Scalars['Date'];
};

export type UpsertStaffAbsenceRequest = {
  absenceReasonText?: InputMaybe<Scalars['String']>;
  absenceRequestStatus?: InputMaybe<StaffAbsenceRequestStatusEnum>;
  absenceTypeId: Scalars['Int'];
  fromAbsenceRequestId?: InputMaybe<Scalars['Int']>;
  fromDate?: InputMaybe<Scalars['Date']>;
  rejectionReasonText?: InputMaybe<Scalars['String']>;
  staffAbsenceRequestId?: InputMaybe<Scalars['Int']>;
  status?: InputMaybe<StaffAbsenceRequestStatusEnum>;
  toDate?: InputMaybe<Scalars['Date']>;
};

export type UpsertStaffAbsenceType = {
  absenceTypeId?: InputMaybe<Scalars['Int']>;
  availableForRequests: Scalars['Boolean'];
  code: Scalars['String'];
  description: Array<InputMaybe<TranslationInput>>;
  name: Array<InputMaybe<TranslationInput>>;
};

export type UpsertSubject = {
  colour?: InputMaybe<Colour>;
  subjectId?: InputMaybe<Scalars['Int']>;
};

export type UserInvitation = {
  __typename?: 'UserInvitation';
  hasAccepted: Scalars['Boolean'];
  id: Scalars['Long'];
  invitedOn: Scalars['DateTime'];
  invitedPersonPartyId: Scalars['Long'];
  invitingPersonPartyId: Scalars['Long'];
};

export type UserInvitationFilter = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
};

export enum UserType {
  Admin = 'ADMIN',
  Contact = 'CONTACT',
  Student = 'STUDENT',
  Teacher = 'TEACHER',
  Tyro = 'TYRO'
}

export enum ValidFor {
  All = 'ALL',
  Sibling = 'SIBLING'
}

export type XeroContact = {
  __typename?: 'XeroContact';
  smsCredit: Scalars['Float'];
  xeroContactId: Scalars['String'];
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

export type YearGroupEnrollment = {
  __typename?: 'YearGroupEnrollment';
  academicNamespaceId: Scalars['Int'];
  description?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  nationalCode: Scalars['String'];
  shortName: Scalars['String'];
  yearGroupEnrollmentPartyId: Scalars['Long'];
  yearGroupId: Scalars['Int'];
};

export type YearGroupEnrollmentFilter = {
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


export type AssessmentSubjectGroupsQuery = { __typename?: 'Query', assessment_assessmentSubjectGroups?: Array<{ __typename?: 'AssessmentSubjectGroup', subjectGroupId: number, subject: string, subjectGroupName: string, resultsTotal: number, resultsEntered: number, commentsEntered: number, commentsTotal: number } | null> | null };

export type AssessmentsListQueryVariables = Exact<{
  filter?: InputMaybe<AssessmentFilter>;
}>;


export type AssessmentsListQuery = { __typename?: 'Query', assessment_assessment?: Array<{ __typename?: 'Assessment', id: number, name: string, assessmentType: AssessmentType, academicNamespaceId: number, publish: boolean, createdOn: string, years?: Array<{ __typename?: 'YearGroup', yearGroupId: number, name: string } | null> | null, createdBy?: { __typename?: 'Person', type?: PartyPersonType | null, title?: string | null, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null } | null } | null> | null };

export type CommentBankAssessmentQueryVariables = Exact<{
  filter?: InputMaybe<CommentBankFilter>;
}>;


export type CommentBankAssessmentQuery = { __typename?: 'Query', assessment_commentBank?: Array<{ __typename?: 'CommentBank', id: number, name?: string | null } | null> | null };

export type SaveAssessmentMutationVariables = Exact<{
  input?: InputMaybe<SaveAssessmentInput>;
}>;


export type SaveAssessmentMutation = { __typename?: 'Mutation', assessment_saveAssessment?: { __typename?: 'Assessment', name: string, startDate: string, endDate: string, years?: Array<{ __typename?: 'YearGroup', name: string } | null> | null } | null };

export type DashboardAssessmentQueryVariables = Exact<{
  filter?: InputMaybe<DashboardAssessmentFilter>;
}>;


export type DashboardAssessmentQuery = { __typename?: 'Query', assessment_dashboardAssessment?: Array<{ __typename?: 'DashboardAssessment', id: number, name: string, description?: string | null, assessmentType: AssessmentType, startDate?: string | null, endDate?: string | null, results?: Array<{ __typename?: 'DashboardAssessmentResult', id: number, subject?: string | null, result?: number | null, grade?: string | null } | null> | null } | null> | null };

export type Attendance_AttendanceCodesQueryVariables = Exact<{
  filter?: InputMaybe<AttendanceCodeFilter>;
}>;


export type Attendance_AttendanceCodesQuery = { __typename?: 'Query', attendance_attendanceCodes?: Array<{ __typename?: 'AttendanceCode', id: number, name: string, codeType: AttendanceCodeType } | null> | null };

export type Attendance_SaveEventAttendanceMutationVariables = Exact<{
  input?: InputMaybe<Array<InputMaybe<SaveEventAttendanceInput>> | InputMaybe<SaveEventAttendanceInput>>;
}>;


export type Attendance_SaveEventAttendanceMutation = { __typename?: 'Mutation', attendance_saveEventAttendance?: Array<{ __typename?: 'EventAttendance', id: number, eventId: number, attendanceCodeId: number, personPartyId: number, date: string } | null> | null };

export type CalendarSearchQueryQueryVariables = Exact<{
  filter?: InputMaybe<SearchFilter>;
}>;


export type CalendarSearchQueryQuery = { __typename?: 'Query', search_search: Array<{ __typename?: 'Search', partyId: number, type: SearchType, text: string, avatarUrl?: string | null }> };

export type Calendar_CreateCalendarEventsMutationVariables = Exact<{
  input: CreateCalendarEventsInput;
}>;


export type Calendar_CreateCalendarEventsMutation = { __typename?: 'Mutation', calendar_createCalendarEvents?: Array<{ __typename?: 'CalendarEventRaw', eventId: number, calendarIds: Array<number>, type: CalendarEventType, schedule: Array<{ __typename?: 'CalendarEventRawSchedule', startTime: any, endTime: any, startDate: string, endDate?: string | null, recurrenceRule?: string | null, attendees: Array<{ __typename?: 'CalendarEventRawAttendee', partyId: number, type: CalendarEventAttendeeType, startDate?: string | null, endDate?: string | null, recurrenceRule?: string | null }>, exclusions: Array<{ __typename?: 'CalendarEventRawExcludedAttendee', partyId: number, startDate?: string | null, endDate?: string | null, recurrenceRule?: string | null }>, rooms?: Array<{ __typename?: 'CalendarEventRawRoom', roomId: number } | null> | null }>, lessonInfo?: { __typename?: 'CalendarEventLessonRaw', subjectGroupId: number, lessonId?: number | null } | null } | null> | null };

export type Calendar_CalendarEventsQueryVariables = Exact<{
  filter: CalendarEventFilter;
}>;


export type Calendar_CalendarEventsQuery = { __typename?: 'Query', calendar_calendarEvents?: { __typename?: 'ResourceCalendarWrapper', resources: Array<{ __typename: 'PartyCalendar', resourceId: number, partyInfo?: { __typename: 'GeneralGroup', name: string, avatarUrl?: string | null } | { __typename: 'Staff', person: { __typename?: 'Person', avatarUrl?: string | null, firstName?: string | null, lastName?: string | null } } | { __typename: 'Student', person: { __typename?: 'Person', avatarUrl?: string | null, firstName?: string | null, lastName?: string | null } } | { __typename: 'StudentContact', person: { __typename?: 'Person', avatarUrl?: string | null, firstName?: string | null, lastName?: string | null } } | { __typename: 'SubjectGroup', name: string, avatarUrl?: string | null } | null, events: Array<{ __typename?: 'CalendarEvent', name: string, eventId: number, calendarIds: Array<number | null>, startTime: string, endTime: string, type: CalendarEventType, colour?: Colour | null, lessonInfo?: { __typename?: 'CalendarEventLessonRaw', subjectGroupId: number, lessonId?: number | null } | null, exclusions: Array<{ __typename?: 'CalendarEventAttendee', partyId: number, type: CalendarEventAttendeeType }>, attendees: Array<{ __typename?: 'CalendarEventAttendee', partyId: number, type: CalendarEventAttendeeType, partyInfo?: { __typename: 'GeneralGroup', name: string, avatarUrl?: string | null, partyId: number } | { __typename: 'Staff', partyId: number, person: { __typename?: 'Person', title?: string | null, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null } } | { __typename: 'Student', partyId: number, person: { __typename?: 'Person', title?: string | null, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null } } | { __typename: 'StudentContact', partyId: number, person: { __typename?: 'Person', title?: string | null, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null } } | { __typename: 'SubjectGroup', name: string, avatarUrl?: string | null, partyId: number } | null }>, rooms: Array<{ __typename?: 'Room', roomId: number, name: string }> }> } | { __typename?: 'RoomCalendar', resourceId: number, room?: { __typename?: 'Room', name: string } | null, events: Array<{ __typename?: 'CalendarEvent', name: string, eventId: number, calendarIds: Array<number | null>, startTime: string, endTime: string, type: CalendarEventType, colour?: Colour | null, lessonInfo?: { __typename?: 'CalendarEventLessonRaw', subjectGroupId: number, lessonId?: number | null } | null, exclusions: Array<{ __typename?: 'CalendarEventAttendee', partyId: number, type: CalendarEventAttendeeType }>, attendees: Array<{ __typename?: 'CalendarEventAttendee', partyId: number, type: CalendarEventAttendeeType, partyInfo?: { __typename: 'GeneralGroup', name: string, avatarUrl?: string | null, partyId: number } | { __typename: 'Staff', partyId: number, person: { __typename?: 'Person', title?: string | null, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null } } | { __typename: 'Student', partyId: number, person: { __typename?: 'Person', title?: string | null, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null } } | { __typename: 'StudentContact', partyId: number, person: { __typename?: 'Person', title?: string | null, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null } } | { __typename: 'SubjectGroup', name: string, avatarUrl?: string | null, partyId: number } | null }>, rooms: Array<{ __typename?: 'Room', roomId: number, name: string }> }> }> } | null };

export type Calendar_PartyTimetableQueryVariables = Exact<{
  filter: CalendarEventFilter;
}>;


export type Calendar_PartyTimetableQuery = { __typename?: 'Query', calendar_calendarEvents?: { __typename?: 'ResourceCalendarWrapper', resources: Array<{ __typename?: 'PartyCalendar', resourceId: number, events: Array<{ __typename?: 'CalendarEvent', eventId: number, startTime: string, endTime: string, type: CalendarEventType, attendees: Array<{ __typename?: 'CalendarEventAttendee', type: CalendarEventAttendeeType, partyInfo?: { __typename: 'GeneralGroup', partyId: number } | { __typename: 'Staff', partyId: number, person: { __typename?: 'Person', title?: string | null, firstName?: string | null, lastName?: string | null, type?: PartyPersonType | null } } | { __typename: 'Student', partyId: number } | { __typename: 'StudentContact', partyId: number } | { __typename: 'SubjectGroup', name: string, partyId: number } | null }>, rooms: Array<{ __typename?: 'Room', name: string }> }> } | { __typename?: 'RoomCalendar', resourceId: number, events: Array<{ __typename?: 'CalendarEvent', eventId: number, startTime: string, endTime: string, type: CalendarEventType, attendees: Array<{ __typename?: 'CalendarEventAttendee', type: CalendarEventAttendeeType, partyInfo?: { __typename: 'GeneralGroup', partyId: number } | { __typename: 'Staff', partyId: number, person: { __typename?: 'Person', title?: string | null, firstName?: string | null, lastName?: string | null, type?: PartyPersonType | null } } | { __typename: 'Student', partyId: number } | { __typename: 'StudentContact', partyId: number } | { __typename: 'SubjectGroup', name: string, partyId: number } | null }>, rooms: Array<{ __typename?: 'Room', name: string }> }> }> } | null };

export type TimetableInfoQueryVariables = Exact<{
  filter?: InputMaybe<CalendarDayInfoFilter>;
}>;


export type TimetableInfoQuery = { __typename?: 'Query', calendar_dayInfo: Array<{ __typename?: 'CalendarDayInfo', date: string, startTime?: string | null, endTime?: string | null, dayType: SchoolDayType, periods: Array<{ __typename?: 'CalendarGridPeriodInfo', startTime: string, endTime: string, type: CalendarGridPeriodType }> }> };

export type EnrolmentGroupsListQueryVariables = Exact<{
  filter: GeneralGroupFilter;
}>;


export type EnrolmentGroupsListQuery = { __typename?: 'Query', generalGroups?: Array<{ __typename?: 'GeneralGroup', partyId: number, name: string, generalGroupType: GeneralGroupType, studentMembers?: { __typename?: 'Group', memberCount: number } | null, staffMembers?: { __typename?: 'Group', memberCount: number } | null, contactMembers?: { __typename?: 'Group', memberCount: number } | null, programmeStages?: Array<{ __typename?: 'ProgrammeStage', programme?: { __typename?: 'Programme', name: string } | null } | null> | null, tutors: Array<{ __typename?: 'Person', partyId: number, title?: string | null, firstName?: string | null, lastName?: string | null, type?: PartyPersonType | null }>, yearGroupLeads: Array<{ __typename?: 'Person', partyId: number, title?: string | null, firstName?: string | null, lastName?: string | null, type?: PartyPersonType | null }>, yearGroups: Array<{ __typename?: 'YearGroupEnrollment', name: string }> } | null> | null };

export type CustomGroupsListQueryVariables = Exact<{
  filter: GeneralGroupFilter;
}>;


export type CustomGroupsListQuery = { __typename?: 'Query', generalGroups?: Array<{ __typename?: 'GeneralGroup', partyId: number, name: string, generalGroupType: GeneralGroupType, studentMembers?: { __typename?: 'Group', memberCount: number } | null, staffMembers?: { __typename?: 'Group', memberCount: number } | null, contactMembers?: { __typename?: 'Group', memberCount: number } | null } | null> | null };

export type EnrolmentGroupsByIdQueryVariables = Exact<{
  filter: GeneralGroupFilter;
}>;


export type EnrolmentGroupsByIdQuery = { __typename?: 'Query', generalGroups?: Array<{ __typename?: 'GeneralGroup', partyId: number, name: string, students?: Array<{ __typename?: 'Student', person: { __typename?: 'Person', partyId: number, title?: string | null, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null } } | null> | null } | null> | null };

export type CustomGroupByIdQueryVariables = Exact<{
  filter: GeneralGroupFilter;
}>;


export type CustomGroupByIdQuery = { __typename?: 'Query', generalGroups?: Array<{ __typename?: 'GeneralGroup', partyId: number, name: string, students?: Array<{ __typename?: 'Student', person: { __typename?: 'Person', partyId: number, title?: string | null, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null } } | null> | null, staff?: Array<{ __typename?: 'Person', partyId: number, title?: string | null, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null } | null> | null, contacts?: Array<{ __typename?: 'Person', partyId: number, title?: string | null, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null } | null> | null } | null> | null };

export type Calendar_CalendarEventsIteratorQueryVariables = Exact<{
  filter: CalendarEventIteratorFilter;
}>;


export type Calendar_CalendarEventsIteratorQuery = { __typename?: 'Query', calendar_calendarEventsIterator?: { __typename?: 'CalendarEvent', eventId: number, calendarIds: Array<number | null>, startTime: string, endTime: string, type: CalendarEventType, attendees: Array<{ __typename?: 'CalendarEventAttendee', partyId: number, type: CalendarEventAttendeeType, partyInfo?: { __typename?: 'GeneralGroup', partyId: number } | { __typename?: 'Staff', partyId: number, person: { __typename?: 'Person', firstName?: string | null, lastName?: string | null, avatarUrl?: string | null } } | { __typename?: 'Student', partyId: number } | { __typename?: 'StudentContact', partyId: number } | { __typename?: 'SubjectGroup', partyId: number } | null }>, rooms: Array<{ __typename?: 'Room', name: string }>, extensions?: { __typename?: 'CalendarEventExtension', eventAttendance?: Array<{ __typename?: 'EventAttendance', eventId: number, attendanceCodeId: number, personPartyId: number } | null> | null } | null } | null };

export type SubjectGroupsQueryVariables = Exact<{ [key: string]: never; }>;


export type SubjectGroupsQuery = { __typename?: 'Query', subjectGroups?: Array<{ __typename?: 'SubjectGroup', partyId: number, name: string, subjects?: Array<{ __typename?: 'Subject', name: string } | null> | null, studentMembers?: { __typename?: 'Group', memberCount: number } | null, staff?: Array<{ __typename?: 'Person', firstName?: string | null, lastName?: string | null, avatarUrl?: string | null } | null> | null, irePP?: { __typename?: 'SubjectGroupIrePP', level?: SubjectGroupLevelIrePp | null } | null, programmeStages?: Array<{ __typename?: 'ProgrammeStage', programme?: { __typename?: 'Programme', name: string } | null } | null> | null } | null> | null };

export type SubjectGroupByIdQueryVariables = Exact<{
  filter: SubjectGroupFilter;
}>;


export type SubjectGroupByIdQuery = { __typename?: 'Query', subjectGroups?: Array<{ __typename?: 'SubjectGroup', partyId: number, name: string, avatarUrl?: string | null, yearGroups: Array<{ __typename?: 'YearGroupEnrollment', name: string }>, subjects?: Array<{ __typename?: 'Subject', name: string } | null> | null, staff?: Array<{ __typename?: 'Person', title?: string | null, firstName?: string | null, lastName?: string | null, type?: PartyPersonType | null } | null> | null, students?: Array<{ __typename?: 'Student', partyId: number, classGroup?: { __typename?: 'GeneralGroup', name: string } | null, person: { __typename?: 'Person', firstName?: string | null, lastName?: string | null, avatarUrl?: string | null } } | null> | null } | null> | null };

export type Communications_LabelQueryVariables = Exact<{
  filter?: InputMaybe<LabelFilter>;
}>;


export type Communications_LabelQuery = { __typename?: 'Query', communications_label?: Array<{ __typename?: 'Label', id: number, name: string, personPartyId: number, colour?: string | null, custom?: boolean | null } | null> | null };

export type Update_Communications_LabelMutationVariables = Exact<{
  input?: InputMaybe<LabelInput>;
}>;


export type Update_Communications_LabelMutation = { __typename?: 'Mutation', communications_saveLabel?: { __typename?: 'Label', id: number, name: string, personPartyId: number, colour?: string | null, custom?: boolean | null } | null };

export type Communications_UnreadCountQueryVariables = Exact<{
  filter?: InputMaybe<UnreadCountFilter>;
}>;


export type Communications_UnreadCountQuery = { __typename?: 'Query', communications_unreadCount?: Array<{ __typename?: 'UnreadCount', labelId: number, count: number } | null> | null };

export type Communications_AssignLabelMutationVariables = Exact<{
  input?: InputMaybe<AssignLabelInput>;
}>;


export type Communications_AssignLabelMutation = { __typename?: 'Mutation', communications_assignLabel?: { __typename?: 'Mail', id: number, rootMailId: number, threadId: number, subject: string, body?: string | null, senderPartyId: number, sentOn: string, latestMessage?: string | null, canReply: boolean, starred?: boolean | null, readOn?: string | null, recipients?: Array<{ __typename?: 'Recipient', id: number, recipientPartyId: number, recipientType: RecipientType, name?: string | null } | null> | null, labels?: Array<{ __typename?: 'Label', id: number, name: string, personPartyId: number, colour?: string | null, custom?: boolean | null } | null> | null, threads?: Array<{ __typename?: 'Mail', id: number, rootMailId: number, threadId: number, subject: string, body?: string | null, senderPartyId: number, sentOn: string, latestMessage?: string | null, canReply: boolean, starred?: boolean | null, readOn?: string | null, recipients?: Array<{ __typename?: 'Recipient', id: number, recipientPartyId: number, recipientType: RecipientType, name?: string | null } | null> | null, labels?: Array<{ __typename?: 'Label', id: number, name: string, personPartyId: number, colour?: string | null, custom?: boolean | null } | null> | null } | null> | null } | null };

export type Communications_MailQueryVariables = Exact<{
  filter?: InputMaybe<MailFilter>;
}>;


export type Communications_MailQuery = { __typename?: 'Query', communications_mail?: Array<{ __typename?: 'Mail', id: number, rootMailId: number, threadId: number, subject: string, body?: string | null, senderPartyId: number, sentOn: string, latestMessage?: string | null, canReply: boolean, starred?: boolean | null, readOn?: string | null, recipients?: Array<{ __typename?: 'Recipient', id: number, recipientPartyId: number, recipientType: RecipientType, name?: string | null } | null> | null, labels?: Array<{ __typename?: 'Label', id: number, name: string, personPartyId: number, colour?: string | null, custom?: boolean | null } | null> | null, threads?: Array<{ __typename?: 'Mail', id: number, rootMailId: number, threadId: number, subject: string, body?: string | null, senderPartyId: number, sentOn: string, latestMessage?: string | null, canReply: boolean, starred?: boolean | null, readOn?: string | null, recipients?: Array<{ __typename?: 'Recipient', id: number, recipientPartyId: number, recipientType: RecipientType, name?: string | null } | null> | null, labels?: Array<{ __typename?: 'Label', id: number, name: string, personPartyId: number, colour?: string | null, custom?: boolean | null } | null> | null } | null> | null } | null> | null };

export type Communications_SendMailMutationVariables = Exact<{
  input?: InputMaybe<SendMailInput>;
}>;


export type Communications_SendMailMutation = { __typename?: 'Mutation', communications_sendMail?: { __typename?: 'Mail', id: number, rootMailId: number, threadId: number, subject: string, body?: string | null, senderPartyId: number, sentOn: string, latestMessage?: string | null, canReply: boolean, starred?: boolean | null, readOn?: string | null, recipients?: Array<{ __typename?: 'Recipient', id: number, recipientPartyId: number, recipientType: RecipientType, name?: string | null } | null> | null, labels?: Array<{ __typename?: 'Label', id: number, name: string, personPartyId: number, colour?: string | null, custom?: boolean | null } | null> | null, threads?: Array<{ __typename?: 'Mail', id: number, rootMailId: number, threadId: number, subject: string, body?: string | null, senderPartyId: number, sentOn: string, latestMessage?: string | null, canReply: boolean, starred?: boolean | null, readOn?: string | null, recipients?: Array<{ __typename?: 'Recipient', id: number, recipientPartyId: number, recipientType: RecipientType, name?: string | null } | null> | null, labels?: Array<{ __typename?: 'Label', id: number, name: string, personPartyId: number, colour?: string | null, custom?: boolean | null } | null> | null } | null> | null } | null };

export type Communications_StarredMutationVariables = Exact<{
  input?: InputMaybe<MailStarredInput>;
}>;


export type Communications_StarredMutation = { __typename?: 'Mutation', communications_starred?: string | null };

export type Communications_ReadMutationVariables = Exact<{
  input?: InputMaybe<MailReadInput>;
}>;


export type Communications_ReadMutation = { __typename?: 'Mutation', communications_read?: string | null };

export type PartySearchQueryVariables = Exact<{
  filter: PartyFilter;
}>;


export type PartySearchQuery = { __typename?: 'Query', core_parties: Array<{ __typename: 'GeneralGroup', name: string, partyId: number } | { __typename: 'Staff', partyId: number, person: { __typename?: 'Person', firstName?: string | null, lastName?: string | null } } | { __typename: 'Student', partyId: number, person: { __typename?: 'Person', firstName?: string | null, lastName?: string | null } } | { __typename: 'StudentContact', partyId: number } | { __typename: 'SubjectGroup', name: string, partyId: number }> };

export type Core_StudentContactsQueryVariables = Exact<{ [key: string]: never; }>;


export type Core_StudentContactsQuery = { __typename?: 'Query', core_studentContacts?: Array<{ __typename?: 'StudentContact', partyId: number, person: { __typename?: 'Person', avatarUrl?: string | null, firstName?: string | null, lastName?: string | null }, personalInformation?: { __typename?: 'PersonalInformation', preferredFirstName?: string | null, primaryPhoneNumber?: { __typename?: 'PhoneNumber', number?: string | null } | null, primaryEmail?: { __typename?: 'EmailAddress', email?: string | null } | null } | null } | null> | null };

export type Core_StaffQueryVariables = Exact<{
  filter?: InputMaybe<StaffFilter>;
}>;


export type Core_StaffQuery = { __typename?: 'Query', core_staff: Array<{ __typename?: 'Staff', partyId: number, startDate?: string | null, endDate?: string | null, payrollNumber?: string | null, noLongerStaffMember?: boolean | null, employmentCapacity?: EmploymentCapacity | null, displayCode?: string | null, carRegistrationNumber?: string | null, person: { __typename?: 'Person', firstName?: string | null, title?: string | null, lastName?: string | null, avatarUrl?: string | null }, personalInformation?: { __typename?: 'PersonalInformation', preferredFirstName?: string | null, gender?: Gender | null, primaryPhoneNumber?: { __typename?: 'PhoneNumber', number?: string | null } | null, primaryEmail?: { __typename?: 'EmailAddress', email?: string | null } | null } | null, staffIre?: { __typename?: 'StaffIre', pps?: string | null, religion?: string | null, countryOfBirth?: string | null } | null, staffIreTeacher?: { __typename?: 'StaffTeacherIre', teachingPost?: string | null, teacherCouncilNumber?: string | null } | null }> };

export type Core_Student_ContactsQueryVariables = Exact<{
  filter: StudentFilter;
}>;


export type Core_Student_ContactsQuery = { __typename?: 'Query', core_students?: Array<{ __typename?: 'Student', partyId: number, contacts?: Array<{ __typename?: 'StudentContact', partyId: number, person: { __typename?: 'Person', firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null }, personalInformation?: { __typename?: 'PersonalInformation', gender?: Gender | null, nationality?: string | null, primaryAddress?: { __typename?: 'Address', line1?: string | null, line2?: string | null, line3?: string | null, city?: string | null, country?: string | null, postCode?: string | null } | null, primaryPhoneNumber?: { __typename?: 'PhoneNumber', number?: string | null, areaCode?: string | null, countryCode?: string | null } | null, primaryEmail?: { __typename?: 'EmailAddress', email?: string | null } | null } | null, relationships?: Array<{ __typename?: 'StudentContactRelationshipInfo', relationshipType: StudentContactType, primaryContact?: boolean | null, allowedToContact?: boolean | null } | null> | null } | null> | null } | null> | null };

export type Core_Student_PersonalQueryVariables = Exact<{
  filter: StudentFilter;
}>;


export type Core_Student_PersonalQuery = { __typename?: 'Query', core_students?: Array<{ __typename?: 'Student', partyId: number, personalInformation?: { __typename?: 'PersonalInformation', firstName: string, lastName: string, preferredFirstName?: string | null, middleName?: string | null, gender?: Gender | null, dateOfBirth?: string | null, nationality?: string | null, mothersMaidenName?: string | null, ire?: { __typename?: 'PersonalInformationIre', ppsNumber?: string | null, religion?: string | null, countryOfBirth?: string | null } | null, primaryAddress?: { __typename?: 'Address', line1?: string | null, line2?: string | null, line3?: string | null, city?: string | null, country?: string | null, postCode?: string | null } | null, primaryPhoneNumber?: { __typename?: 'PhoneNumber', number?: string | null, areaCode?: string | null, countryCode?: string | null } | null, primaryEmail?: { __typename?: 'EmailAddress', email?: string | null } | null } | null, studentIrePP?: { __typename?: 'StudentIrePP', medicalCard?: boolean | null, travellerHeritage?: boolean | null, languageSupportApplicant?: boolean | null, borderIndicator?: boolean | null, examNumber?: string | null, previousSchoolRollNumber?: string | null } | null } | null> | null };

export type QQueryVariables = Exact<{
  filter?: InputMaybe<StudentStatusFilter>;
}>;


export type QQuery = { __typename?: 'Query', composite_studentStatus: { __typename?: 'StudentStatus', studentPartyId: number, priorityStudent?: boolean | null, activeSupportPlan?: boolean | null, sessionAttendance?: Array<{ __typename?: 'SessionAttendanceStatus', name?: string | null, status?: string | null } | null> | null, currentLocation?: { __typename?: 'CurrentStudentLocation', studentPartyId?: number | null, eventId?: number | null, lesson?: string | null, teacher?: string | null, room?: Array<{ __typename?: 'Room', roomId: number, name: string, capacity?: number | null } | null> | null, currentAttendance?: { __typename?: 'CurrentAttendance', attendanceCodeName?: string | null, codeType?: AttendanceCodeType | null } | null } | null } };

export type Core_StudentsQueryVariables = Exact<{ [key: string]: never; }>;


export type Core_StudentsQuery = { __typename?: 'Query', core_students?: Array<{ __typename?: 'Student', partyId: number, person: { __typename?: 'Person', avatarUrl?: string | null, firstName?: string | null, lastName?: string | null }, classGroup?: { __typename?: 'GeneralGroup', name: string, staff?: Array<{ __typename?: 'Person', firstName?: string | null, lastName?: string | null } | null> | null } | null, personalInformation?: { __typename?: 'PersonalInformation', preferredFirstName?: string | null, primaryPhoneNumber?: { __typename?: 'PhoneNumber', number?: string | null } | null, primaryEmail?: { __typename?: 'EmailAddress', email?: string | null } | null } | null, studentIrePP?: { __typename?: 'StudentIrePP', examNumber?: string | null } | null, tutors: Array<{ __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null }>, yearGroupLeads: Array<{ __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null }>, yearGroups: Array<{ __typename?: 'YearGroupEnrollment', name: string }>, programmeStages?: Array<{ __typename?: 'ProgrammeStage', name: string, programme?: { __typename?: 'Programme', name: string } | null } | null> | null } | null> | null };

export type Core_StudentQueryVariables = Exact<{
  filter: StudentFilter;
}>;


export type Core_StudentQuery = { __typename?: 'Query', core_students?: Array<{ __typename?: 'Student', partyId: number, person: { __typename?: 'Person', avatarUrl?: string | null, firstName?: string | null, lastName?: string | null }, classGroup?: { __typename?: 'GeneralGroup', name: string, staff?: Array<{ __typename?: 'Person', firstName?: string | null, lastName?: string | null } | null> | null } | null, yearGroupLeads: Array<{ __typename?: 'Person', firstName?: string | null, lastName?: string | null, avatarUrl?: string | null }>, yearGroups: Array<{ __typename?: 'YearGroupEnrollment', shortName: string }>, tutors: Array<{ __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null }> } | null> | null };

export type UpdateCoreStudentsMutationVariables = Exact<{
  input: Array<InputMaybe<UpdateStudentInput>> | InputMaybe<UpdateStudentInput>;
}>;


export type UpdateCoreStudentsMutation = { __typename?: 'Mutation', core_updateStudents?: { __typename?: 'Success', success?: boolean | null } | null };

export type Core_SetActiveActiveAcademicNamespaceMutationVariables = Exact<{
  input?: InputMaybe<SetActiveAcademicNamespace>;
}>;


export type Core_SetActiveActiveAcademicNamespaceMutation = { __typename?: 'Mutation', core_setActiveActiveAcademicNamespace?: { __typename?: 'AcademicNamespace', academicNamespaceId: number, type: AcademicNamespaceType, name: string, year: number, description?: string | null, isActiveDefaultNamespace: boolean } | null };

export type Core_RoomsQueryVariables = Exact<{ [key: string]: never; }>;


export type Core_RoomsQuery = { __typename?: 'Query', core_rooms?: Array<{ __typename?: 'Room', roomId: number, name: string, capacity?: number | null } | null> | null };

export type CatalogueSubjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type CatalogueSubjectsQuery = { __typename?: 'Query', catalogue_subjects?: Array<{ __typename?: 'Subject', id: number, name: string, description?: string | null, shortCode: string, nationalCode?: string | null, subjectSource: SubjectSource, colour?: Colour | null, icon?: string | null } | null> | null };

export type Catalogue_UpsertSubjectsMutationVariables = Exact<{
  input: Array<UpsertSubject> | UpsertSubject;
}>;


export type Catalogue_UpsertSubjectsMutation = { __typename?: 'Mutation', catalogue_upsertSubjects?: { __typename?: 'CatalogueSuccess', success: boolean, message?: string | null } | null };

export type StaffWork_AbsenceTypesQueryVariables = Exact<{
  filter?: InputMaybe<StaffAbsenceTypeFilter>;
}>;


export type StaffWork_AbsenceTypesQuery = { __typename?: 'Query', staffWork_absenceTypes: Array<{ __typename?: 'StaffAbsenceType', absenceTypeId: number, name: string, nameTextId?: number | null, description?: string | null, descriptionTextId?: number | null, code: string, availableForRequests: boolean }> };

export type Staff_Work_AbsencesQueryVariables = Exact<{
  filter?: InputMaybe<StaffAbsenceFilter>;
}>;


export type Staff_Work_AbsencesQuery = { __typename?: 'Query', staffWork_absences: Array<{ __typename?: 'StaffAbsence', absenceId: number, fromDate?: string | null, toDate?: string | null, staff?: { __typename?: 'Person', title?: string | null, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null } | null, absenceType: { __typename?: 'StaffAbsenceType', name: string } }> };

export type StaffWork_UpsertAbsenceMutationVariables = Exact<{
  input: Array<UpsertStaffAbsence> | UpsertStaffAbsence;
}>;


export type StaffWork_UpsertAbsenceMutation = { __typename?: 'Mutation', staffWork_upsertAbsence: Array<{ __typename?: 'StaffAbsence', staffPartyId: number, absenceTypeId: number, fromDate?: string | null, toDate?: string | null, fromAbsenceRequestId?: number | null, absenceReasonText?: string | null }> };

export type Admin__Party_PeopleQueryVariables = Exact<{
  tenant: Scalars['Int'];
}>;


export type Admin__Party_PeopleQuery = { __typename?: 'Query', admin__party_people?: Array<{ __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null } | null> | null };

export type Admin__TenantsQueryVariables = Exact<{ [key: string]: never; }>;


export type Admin__TenantsQuery = { __typename?: 'Query', admin__tenants?: Array<{ __typename?: 'Tenant', tenant: number, name: string, imgUrl?: string | null } | null> | null };

export type Core_AcademicNamespacesQueryVariables = Exact<{ [key: string]: never; }>;


export type Core_AcademicNamespacesQuery = { __typename?: 'Query', core_academicNamespaces?: Array<{ __typename?: 'AcademicNamespace', academicNamespaceId: number, type: AcademicNamespaceType, name: string, year: number, description?: string | null, isActiveDefaultNamespace: boolean } | null> | null };

export type YearsQueryVariables = Exact<{
  filter?: InputMaybe<YearGroupFilter>;
}>;


export type YearsQuery = { __typename?: 'Query', catalogue_years?: Array<{ __typename?: 'YearGroup', yearGroupId: number, name: string } | null> | null };

export type MyAuthDetailsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyAuthDetailsQuery = { __typename?: 'Query', myAuthDetails?: { __typename?: 'GlobalUser', id: number, email?: string | null, name?: string | null, defaultProfileId?: number | null, activeProfileId?: number | null, profiles?: Array<{ __typename?: 'Profile', id: number, nickName?: string | null, avatarUrl?: string | null, permissionIds?: Array<string | null> | null, partyId?: number | null, tenant: { __typename?: 'Tenant', tenant: number, name: string, imgUrl?: string | null }, profileType?: { __typename?: 'ProfileType', name: string, description: string, userType: UserType } | null } | null> | null } | null };


export const SearchQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"searchQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"search_search"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentPartyId"}}]}}]}}]}}]} as unknown as DocumentNode<SearchQueryQuery, SearchQueryQueryVariables>;
export const AssessmentSubjectGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"assessmentSubjectGroups"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AssessmentSubjectGroupsFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assessment_assessmentSubjectGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subjectGroupId"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"subjectGroupName"}},{"kind":"Field","name":{"kind":"Name","value":"resultsTotal"}},{"kind":"Field","name":{"kind":"Name","value":"resultsEntered"}},{"kind":"Field","name":{"kind":"Name","value":"commentsEntered"}},{"kind":"Field","name":{"kind":"Name","value":"commentsTotal"}}]}}]}}]} as unknown as DocumentNode<AssessmentSubjectGroupsQuery, AssessmentSubjectGroupsQueryVariables>;
export const AssessmentsListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"assessmentsList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AssessmentFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assessment_assessment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"assessmentType"}},{"kind":"Field","name":{"kind":"Name","value":"academicNamespaceId"}},{"kind":"Field","name":{"kind":"Name","value":"years"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"yearGroupId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"publish"}},{"kind":"Field","name":{"kind":"Name","value":"createdOn"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}}]} as unknown as DocumentNode<AssessmentsListQuery, AssessmentsListQueryVariables>;
export const CommentBankAssessmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"commentBankAssessment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CommentBankFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assessment_commentBank"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CommentBankAssessmentQuery, CommentBankAssessmentQueryVariables>;
export const SaveAssessmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"saveAssessment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SaveAssessmentInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assessment_saveAssessment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"years"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}}]}}]}}]} as unknown as DocumentNode<SaveAssessmentMutation, SaveAssessmentMutationVariables>;
export const DashboardAssessmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"dashboardAssessment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DashboardAssessmentFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assessment_dashboardAssessment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"assessmentType"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"result"}},{"kind":"Field","name":{"kind":"Name","value":"grade"}}]}}]}}]}}]} as unknown as DocumentNode<DashboardAssessmentQuery, DashboardAssessmentQueryVariables>;
export const Attendance_AttendanceCodesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"attendance_attendanceCodes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AttendanceCodeFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attendance_attendanceCodes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"codeType"}}]}}]}}]} as unknown as DocumentNode<Attendance_AttendanceCodesQuery, Attendance_AttendanceCodesQueryVariables>;
export const Attendance_SaveEventAttendanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"attendance_saveEventAttendance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SaveEventAttendanceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attendance_saveEventAttendance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"attendanceCodeId"}},{"kind":"Field","name":{"kind":"Name","value":"personPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"date"}}]}}]}}]} as unknown as DocumentNode<Attendance_SaveEventAttendanceMutation, Attendance_SaveEventAttendanceMutationVariables>;
export const CalendarSearchQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"calendarSearchQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"search_search"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]} as unknown as DocumentNode<CalendarSearchQueryQuery, CalendarSearchQueryQueryVariables>;
export const Calendar_CreateCalendarEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"calendar_createCalendarEvents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCalendarEventsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendar_createCalendarEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"calendarIds"}},{"kind":"Field","name":{"kind":"Name","value":"schedule"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"recurrenceRule"}},{"kind":"Field","name":{"kind":"Name","value":"attendees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"recurrenceRule"}}]}},{"kind":"Field","name":{"kind":"Name","value":"exclusions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"recurrenceRule"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomId"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"lessonInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subjectGroupId"}},{"kind":"Field","name":{"kind":"Name","value":"lessonId"}}]}}]}}]}}]} as unknown as DocumentNode<Calendar_CreateCalendarEventsMutation, Calendar_CreateCalendarEventsMutationVariables>;
export const Calendar_CalendarEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"calendar_calendarEvents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarEventFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendar_calendarEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resources"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PartyCalendar"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"partyInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PartyGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PartyPerson"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RoomCalendar"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"room"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"calendarIds"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}},{"kind":"Field","name":{"kind":"Name","value":"lessonInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subjectGroupId"}},{"kind":"Field","name":{"kind":"Name","value":"lessonId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"exclusions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"attendees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"partyInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PartyGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PartyPerson"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"rooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<Calendar_CalendarEventsQuery, Calendar_CalendarEventsQueryVariables>;
export const Calendar_PartyTimetableDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"calendar_partyTimetable"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarEventFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendar_calendarEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resources"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"attendees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"partyInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Staff"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SubjectGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"rooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<Calendar_PartyTimetableQuery, Calendar_PartyTimetableQueryVariables>;
export const TimetableInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"timetableInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarDayInfoFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendar_dayInfo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"dayType"}},{"kind":"Field","name":{"kind":"Name","value":"periods"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<TimetableInfoQuery, TimetableInfoQueryVariables>;
export const EnrolmentGroupsListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"enrolmentGroupsList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GeneralGroupFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"generalGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"studentMembers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"memberCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"staffMembers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"memberCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"contactMembers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"memberCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"generalGroupType"}},{"kind":"Field","name":{"kind":"Name","value":"programmeStages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"programme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"tutors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"yearGroupLeads"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"yearGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<EnrolmentGroupsListQuery, EnrolmentGroupsListQueryVariables>;
export const CustomGroupsListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"customGroupsList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GeneralGroupFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"generalGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"studentMembers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"memberCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"staffMembers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"memberCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"contactMembers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"memberCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"generalGroupType"}}]}}]}}]} as unknown as DocumentNode<CustomGroupsListQuery, CustomGroupsListQueryVariables>;
export const EnrolmentGroupsByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"enrolmentGroupsById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GeneralGroupFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"generalGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"students"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]}}]} as unknown as DocumentNode<EnrolmentGroupsByIdQuery, EnrolmentGroupsByIdQueryVariables>;
export const CustomGroupByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"customGroupById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GeneralGroupFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"generalGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"students"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"staff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"contacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<CustomGroupByIdQuery, CustomGroupByIdQueryVariables>;
export const Calendar_CalendarEventsIteratorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"calendar_calendarEventsIterator"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarEventIteratorFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendar_calendarEventsIterator"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"calendarIds"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"attendees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"partyInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Staff"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"rooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"extensions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventAttendance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"attendanceCodeId"}},{"kind":"Field","name":{"kind":"Name","value":"personPartyId"}}]}}]}}]}}]}}]} as unknown as DocumentNode<Calendar_CalendarEventsIteratorQuery, Calendar_CalendarEventsIteratorQueryVariables>;
export const SubjectGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"subjectGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subjectGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"subjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"studentMembers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"memberCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"staff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"irePP"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"level"}}]}},{"kind":"Field","name":{"kind":"Name","value":"programmeStages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"programme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<SubjectGroupsQuery, SubjectGroupsQueryVariables>;
export const SubjectGroupByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"subjectGroupById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SubjectGroupFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subjectGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"yearGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"staff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"students"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"classGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}}]}}]} as unknown as DocumentNode<SubjectGroupByIdQuery, SubjectGroupByIdQueryVariables>;
export const Communications_LabelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"communications_label"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"LabelFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communications_label"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"personPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}},{"kind":"Field","name":{"kind":"Name","value":"custom"}}]}}]}}]} as unknown as DocumentNode<Communications_LabelQuery, Communications_LabelQueryVariables>;
export const Update_Communications_LabelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"update_communications_label"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"LabelInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communications_saveLabel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"personPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}},{"kind":"Field","name":{"kind":"Name","value":"custom"}}]}}]}}]} as unknown as DocumentNode<Update_Communications_LabelMutation, Update_Communications_LabelMutationVariables>;
export const Communications_UnreadCountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"communications_unreadCount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UnreadCountFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communications_unreadCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"labelId"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]} as unknown as DocumentNode<Communications_UnreadCountQuery, Communications_UnreadCountQueryVariables>;
export const Communications_AssignLabelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"communications_assignLabel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AssignLabelInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communications_assignLabel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rootMailId"}},{"kind":"Field","name":{"kind":"Name","value":"threadId"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"senderPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"sentOn"}},{"kind":"Field","name":{"kind":"Name","value":"latestMessage"}},{"kind":"Field","name":{"kind":"Name","value":"canReply"}},{"kind":"Field","name":{"kind":"Name","value":"starred"}},{"kind":"Field","name":{"kind":"Name","value":"readOn"}},{"kind":"Field","name":{"kind":"Name","value":"recipients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"recipientPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"recipientType"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"personPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}},{"kind":"Field","name":{"kind":"Name","value":"custom"}}]}},{"kind":"Field","name":{"kind":"Name","value":"threads"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rootMailId"}},{"kind":"Field","name":{"kind":"Name","value":"threadId"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"senderPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"sentOn"}},{"kind":"Field","name":{"kind":"Name","value":"latestMessage"}},{"kind":"Field","name":{"kind":"Name","value":"canReply"}},{"kind":"Field","name":{"kind":"Name","value":"starred"}},{"kind":"Field","name":{"kind":"Name","value":"readOn"}},{"kind":"Field","name":{"kind":"Name","value":"recipients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"recipientPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"recipientType"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"personPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}},{"kind":"Field","name":{"kind":"Name","value":"custom"}}]}}]}}]}}]}}]} as unknown as DocumentNode<Communications_AssignLabelMutation, Communications_AssignLabelMutationVariables>;
export const Communications_MailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"communications_mail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MailFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communications_mail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rootMailId"}},{"kind":"Field","name":{"kind":"Name","value":"threadId"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"senderPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"sentOn"}},{"kind":"Field","name":{"kind":"Name","value":"latestMessage"}},{"kind":"Field","name":{"kind":"Name","value":"canReply"}},{"kind":"Field","name":{"kind":"Name","value":"starred"}},{"kind":"Field","name":{"kind":"Name","value":"readOn"}},{"kind":"Field","name":{"kind":"Name","value":"recipients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"recipientPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"recipientType"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"personPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}},{"kind":"Field","name":{"kind":"Name","value":"custom"}}]}},{"kind":"Field","name":{"kind":"Name","value":"threads"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rootMailId"}},{"kind":"Field","name":{"kind":"Name","value":"threadId"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"senderPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"sentOn"}},{"kind":"Field","name":{"kind":"Name","value":"latestMessage"}},{"kind":"Field","name":{"kind":"Name","value":"canReply"}},{"kind":"Field","name":{"kind":"Name","value":"starred"}},{"kind":"Field","name":{"kind":"Name","value":"readOn"}},{"kind":"Field","name":{"kind":"Name","value":"recipients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"recipientPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"recipientType"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"personPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}},{"kind":"Field","name":{"kind":"Name","value":"custom"}}]}}]}}]}}]}}]} as unknown as DocumentNode<Communications_MailQuery, Communications_MailQueryVariables>;
export const Communications_SendMailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"communications_sendMail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SendMailInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communications_sendMail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rootMailId"}},{"kind":"Field","name":{"kind":"Name","value":"threadId"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"senderPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"sentOn"}},{"kind":"Field","name":{"kind":"Name","value":"latestMessage"}},{"kind":"Field","name":{"kind":"Name","value":"canReply"}},{"kind":"Field","name":{"kind":"Name","value":"starred"}},{"kind":"Field","name":{"kind":"Name","value":"readOn"}},{"kind":"Field","name":{"kind":"Name","value":"recipients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"recipientPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"recipientType"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"personPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}},{"kind":"Field","name":{"kind":"Name","value":"custom"}}]}},{"kind":"Field","name":{"kind":"Name","value":"threads"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rootMailId"}},{"kind":"Field","name":{"kind":"Name","value":"threadId"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"senderPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"sentOn"}},{"kind":"Field","name":{"kind":"Name","value":"latestMessage"}},{"kind":"Field","name":{"kind":"Name","value":"canReply"}},{"kind":"Field","name":{"kind":"Name","value":"starred"}},{"kind":"Field","name":{"kind":"Name","value":"readOn"}},{"kind":"Field","name":{"kind":"Name","value":"recipients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"recipientPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"recipientType"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"personPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}},{"kind":"Field","name":{"kind":"Name","value":"custom"}}]}}]}}]}}]}}]} as unknown as DocumentNode<Communications_SendMailMutation, Communications_SendMailMutationVariables>;
export const Communications_StarredDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"communications_starred"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MailStarredInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communications_starred"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<Communications_StarredMutation, Communications_StarredMutationVariables>;
export const Communications_ReadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"communications_read"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MailReadInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communications_read"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<Communications_ReadMutation, Communications_ReadMutationVariables>;
export const PartySearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"partySearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PartyFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_parties"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GeneralGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SubjectGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Student"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Staff"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]}}]}}]} as unknown as DocumentNode<PartySearchQuery, PartySearchQueryVariables>;
export const Core_StudentContactsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"core_studentContacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_studentContacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"personalInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"preferredFirstName"}},{"kind":"Field","name":{"kind":"Name","value":"primaryPhoneNumber"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryEmail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]}}]} as unknown as DocumentNode<Core_StudentContactsQuery, Core_StudentContactsQueryVariables>;
export const Core_StaffDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"core_staff"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"StaffFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_staff"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"personalInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"preferredFirstName"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"primaryPhoneNumber"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryEmail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"staffIre"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pps"}},{"kind":"Field","name":{"kind":"Name","value":"religion"}},{"kind":"Field","name":{"kind":"Name","value":"countryOfBirth"}}]}},{"kind":"Field","name":{"kind":"Name","value":"staffIreTeacher"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teachingPost"}},{"kind":"Field","name":{"kind":"Name","value":"teacherCouncilNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payrollNumber"}},{"kind":"Field","name":{"kind":"Name","value":"noLongerStaffMember"}},{"kind":"Field","name":{"kind":"Name","value":"employmentCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"displayCode"}},{"kind":"Field","name":{"kind":"Name","value":"carRegistrationNumber"}}]}}]}}]} as unknown as DocumentNode<Core_StaffQuery, Core_StaffQueryVariables>;
export const Core_Student_ContactsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"core_student_contacts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StudentFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_students"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"contacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"personalInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"nationality"}},{"kind":"Field","name":{"kind":"Name","value":"primaryAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"line1"}},{"kind":"Field","name":{"kind":"Name","value":"line2"}},{"kind":"Field","name":{"kind":"Name","value":"line3"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"postCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryPhoneNumber"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"areaCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryEmail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"relationships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"relationshipType"}},{"kind":"Field","name":{"kind":"Name","value":"primaryContact"}},{"kind":"Field","name":{"kind":"Name","value":"allowedToContact"}}]}}]}}]}}]}}]} as unknown as DocumentNode<Core_Student_ContactsQuery, Core_Student_ContactsQueryVariables>;
export const Core_Student_PersonalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"core_student_personal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StudentFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_students"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"personalInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"preferredFirstName"}},{"kind":"Field","name":{"kind":"Name","value":"middleName"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"ire"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ppsNumber"}},{"kind":"Field","name":{"kind":"Name","value":"religion"}},{"kind":"Field","name":{"kind":"Name","value":"countryOfBirth"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nationality"}},{"kind":"Field","name":{"kind":"Name","value":"mothersMaidenName"}},{"kind":"Field","name":{"kind":"Name","value":"primaryAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"line1"}},{"kind":"Field","name":{"kind":"Name","value":"line2"}},{"kind":"Field","name":{"kind":"Name","value":"line3"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"postCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryPhoneNumber"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"areaCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryEmail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"studentIrePP"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"medicalCard"}},{"kind":"Field","name":{"kind":"Name","value":"travellerHeritage"}},{"kind":"Field","name":{"kind":"Name","value":"languageSupportApplicant"}},{"kind":"Field","name":{"kind":"Name","value":"borderIndicator"}},{"kind":"Field","name":{"kind":"Name","value":"examNumber"}},{"kind":"Field","name":{"kind":"Name","value":"previousSchoolRollNumber"}}]}}]}}]}}]} as unknown as DocumentNode<Core_Student_PersonalQuery, Core_Student_PersonalQueryVariables>;
export const QDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"q"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"StudentStatusFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"composite_studentStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"sessionAttendance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"currentLocation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"room"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lesson"}},{"kind":"Field","name":{"kind":"Name","value":"teacher"}},{"kind":"Field","name":{"kind":"Name","value":"currentAttendance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attendanceCodeName"}},{"kind":"Field","name":{"kind":"Name","value":"codeType"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"priorityStudent"}},{"kind":"Field","name":{"kind":"Name","value":"activeSupportPlan"}}]}}]}}]} as unknown as DocumentNode<QQuery, QQueryVariables>;
export const Core_StudentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"core_students"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_students"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"classGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"staff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"personalInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"preferredFirstName"}},{"kind":"Field","name":{"kind":"Name","value":"primaryPhoneNumber"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryEmail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"studentIrePP"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"examNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tutors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"yearGroupLeads"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"yearGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"programmeStages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"programme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<Core_StudentsQuery, Core_StudentsQueryVariables>;
export const Core_StudentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"core_student"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StudentFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_students"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"classGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"staff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"yearGroupLeads"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"yearGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shortName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tutors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<Core_StudentQuery, Core_StudentQueryVariables>;
export const UpdateCoreStudentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateCoreStudents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateStudentInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_updateStudents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<UpdateCoreStudentsMutation, UpdateCoreStudentsMutationVariables>;
export const Core_SetActiveActiveAcademicNamespaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"core_setActiveActiveAcademicNamespace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SetActiveAcademicNamespace"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_setActiveActiveAcademicNamespace"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"academicNamespaceId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isActiveDefaultNamespace"}}]}}]}}]} as unknown as DocumentNode<Core_SetActiveActiveAcademicNamespaceMutation, Core_SetActiveActiveAcademicNamespaceMutationVariables>;
export const Core_RoomsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"core_rooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_rooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}}]}}]}}]} as unknown as DocumentNode<Core_RoomsQuery, Core_RoomsQueryVariables>;
export const CatalogueSubjectsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"catalogueSubjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"catalogue_subjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"shortCode"}},{"kind":"Field","name":{"kind":"Name","value":"nationalCode"}},{"kind":"Field","name":{"kind":"Name","value":"subjectSource"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}}]}}]} as unknown as DocumentNode<CatalogueSubjectsQuery, CatalogueSubjectsQueryVariables>;
export const Catalogue_UpsertSubjectsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"catalogue_upsertSubjects"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpsertSubject"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"catalogue_upsertSubjects"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<Catalogue_UpsertSubjectsMutation, Catalogue_UpsertSubjectsMutationVariables>;
export const StaffWork_AbsenceTypesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"staffWork_absenceTypes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"StaffAbsenceTypeFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"staffWork_absenceTypes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"absenceTypeId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"descriptionTextId"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"availableForRequests"}}]}}]}}]} as unknown as DocumentNode<StaffWork_AbsenceTypesQuery, StaffWork_AbsenceTypesQueryVariables>;
export const Staff_Work_AbsencesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"staff_work_absences"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"StaffAbsenceFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"staffWork_absences"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"absenceId"}},{"kind":"Field","name":{"kind":"Name","value":"staff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"absenceType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fromDate"}},{"kind":"Field","name":{"kind":"Name","value":"toDate"}}]}}]}}]} as unknown as DocumentNode<Staff_Work_AbsencesQuery, Staff_Work_AbsencesQueryVariables>;
export const StaffWork_UpsertAbsenceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"staffWork_upsertAbsence"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpsertStaffAbsence"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"staffWork_upsertAbsence"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"staffPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"absenceTypeId"}},{"kind":"Field","name":{"kind":"Name","value":"fromDate"}},{"kind":"Field","name":{"kind":"Name","value":"toDate"}},{"kind":"Field","name":{"kind":"Name","value":"fromAbsenceRequestId"}},{"kind":"Field","name":{"kind":"Name","value":"absenceReasonText"}}]}}]}}]} as unknown as DocumentNode<StaffWork_UpsertAbsenceMutation, StaffWork_UpsertAbsenceMutationVariables>;
export const Admin__Party_PeopleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"admin__party_people"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tenant"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"admin__party_people"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"tenant"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tenant"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]} as unknown as DocumentNode<Admin__Party_PeopleQuery, Admin__Party_PeopleQueryVariables>;
export const Admin__TenantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"admin__tenants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"admin__tenants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"imgUrl"}}]}}]}}]} as unknown as DocumentNode<Admin__TenantsQuery, Admin__TenantsQueryVariables>;
export const Core_AcademicNamespacesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"core_academicNamespaces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_academicNamespaces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"academicNamespaceId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isActiveDefaultNamespace"}}]}}]}}]} as unknown as DocumentNode<Core_AcademicNamespacesQuery, Core_AcademicNamespacesQueryVariables>;
export const YearsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"years"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"YearGroupFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"catalogue_years"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"yearGroupId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<YearsQuery, YearsQueryVariables>;
export const MyAuthDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"myAuthDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myAuthDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"defaultProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"activeProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"profiles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nickName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"imgUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"profileType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"userType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"permissionIds"}},{"kind":"Field","name":{"kind":"Name","value":"partyId"}}]}}]}}]}}]} as unknown as DocumentNode<MyAuthDetailsQuery, MyAuthDetailsQueryVariables>;