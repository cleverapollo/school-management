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
  Date: any;
  DateTime: any;
  /** A 64-bit signed integer */
  Long: any;
  /** 24-hour clock time value string in the format `hh:mm:ss` or `hh:mm:ss.sss`. */
  Time: any;
  _FieldSet: any;
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

export enum AcademicNamespaceTypeasd {
  WaitingList = 'WAITING_LIST',
  Year = 'YEAR'
}

export type Assessment = {
  __typename?: 'Assessment';
  academicNamespaceId?: Maybe<Scalars['Int']>;
  assessmentType?: Maybe<AssessmentType>;
  captureHouseMasterComment?: Maybe<Scalars['Boolean']>;
  capturePrincipalComment?: Maybe<Scalars['Boolean']>;
  captureTarget?: Maybe<Scalars['Boolean']>;
  captureTutorComment?: Maybe<Scalars['Boolean']>;
  captureYearHeadComment?: Maybe<Scalars['Boolean']>;
  commentBank?: Maybe<AssessmentCommentBank>;
  commentType?: Maybe<CommentType>;
  description?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['Date']>;
  gradeSets?: Maybe<Array<Maybe<AssessmentGradeSet>>>;
  gradeType?: Maybe<GradeType>;
  id?: Maybe<Scalars['Long']>;
  name?: Maybe<Scalars['String']>;
  passFailThreshold?: Maybe<Scalars['Int']>;
  publish?: Maybe<Scalars['Boolean']>;
  publishLearner?: Maybe<Scalars['Boolean']>;
  startDate?: Maybe<Scalars['Date']>;
  years?: Maybe<Array<Maybe<AssessmentYear>>>;
};

export type AssessmentComment = {
  __typename?: 'AssessmentComment';
  assessmentId?: Maybe<Scalars['Long']>;
  comment?: Maybe<Scalars['String']>;
  commentBankComment?: Maybe<Scalars['String']>;
  commenterUserType?: Maybe<CommenterUserType>;
  id?: Maybe<Scalars['Long']>;
  studentPartyId?: Maybe<Scalars['Long']>;
};

export type AssessmentCommentBank = {
  __typename?: 'AssessmentCommentBank';
  commentBankId?: Maybe<Scalars['Long']>;
  commentBankName?: Maybe<Scalars['String']>;
};

export type AssessmentFilter = {
  id?: InputMaybe<Scalars['Long']>;
};

export type AssessmentGradeSet = {
  __typename?: 'AssessmentGradeSet';
  gradeSetId?: Maybe<Scalars['Long']>;
  gradeSetName?: Maybe<Scalars['String']>;
};

export type AssessmentResult = {
  __typename?: 'AssessmentResult';
  assessmentId?: Maybe<Scalars['Long']>;
  comment?: Maybe<Scalars['String']>;
  commentBankCommentId?: Maybe<Scalars['Long']>;
  grade?: Maybe<Scalars['String']>;
  gradeNameTextId?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Long']>;
  result?: Maybe<Scalars['Int']>;
  studentPartyId?: Maybe<Scalars['Long']>;
  targetGrade?: Maybe<Scalars['String']>;
  targetGradeNameTextId?: Maybe<Scalars['Int']>;
  targetResult?: Maybe<Scalars['Int']>;
};

export type AssessmentResultFilter = {
  assessmentId?: InputMaybe<Scalars['Long']>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
  studentPartyId?: InputMaybe<Scalars['Long']>;
};

export enum AssessmentType {
  InClass = 'IN_CLASS',
  StateCba = 'STATE_CBA',
  Term = 'TERM'
}

export type AssessmentYear = {
  __typename?: 'AssessmentYear';
  id?: Maybe<Scalars['Long']>;
  name?: Maybe<Scalars['String']>;
  year?: Maybe<Scalars['Int']>;
};

export type AssignLabelInput = {
  labelId: Scalars['Long'];
  mailId: Scalars['Long'];
  threadId: Scalars['Long'];
};

export type AttendanceCode = {
  __typename?: 'AttendanceCode';
  active: Scalars['Boolean'];
  code: Scalars['String'];
  id: Scalars['Int'];
  name: Scalars['String'];
  nameTextId?: Maybe<Scalars['Int']>;
  visibleForContact: Scalars['Boolean'];
  visibleForTeacher: Scalars['Boolean'];
};

export type AttendanceCodeFilter = {
  active?: InputMaybe<Scalars['Boolean']>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  visibleForContacts?: InputMaybe<Scalars['Boolean']>;
  visibleForTeachers?: InputMaybe<Scalars['Boolean']>;
};

export type Calendar = {
  __typename?: 'Calendar';
  academicNamespaceId: Scalars['Int'];
  endDate: Scalars['Date'];
  id?: Maybe<Scalars['Int']>;
  startDate: Scalars['Date'];
};

export type CalendarEvent = {
  __typename?: 'CalendarEvent';
  attendees?: Maybe<Array<Maybe<CalendarEventAttendee>>>;
  calendarIds: Array<Maybe<Scalars['Int']>>;
  endTime?: Maybe<Scalars['DateTime']>;
  exclusions?: Maybe<Array<Maybe<CalendarEventAttendee>>>;
  lessonInfo?: Maybe<CalendarEventLessonRaw>;
  roomIds?: Maybe<Array<Maybe<Scalars['Int']>>>;
  rooms?: Maybe<Array<Maybe<Room>>>;
  startTime?: Maybe<Scalars['DateTime']>;
  type: CalendarEventType;
};

export type CalendarEventAttendee = {
  __typename?: 'CalendarEventAttendee';
  partyId: Scalars['Long'];
  partyInfo?: Maybe<Party>;
  type: CalendarEventAttendeeType;
};

export enum CalendarEventAttendeeType {
  Additional = 'ADDITIONAL',
  Attendee = 'ATTENDEE',
  Organiser = 'ORGANISER'
}

export type CalendarEventFilter = {
  endDate: Scalars['Date'];
  partyIds: Array<InputMaybe<Scalars['Long']>>;
  startDate: Scalars['Date'];
};

export type CalendarEventLessonRaw = {
  __typename?: 'CalendarEventLessonRaw';
  lessonId?: Maybe<Scalars['Int']>;
  subjectGroupId: Scalars['Long'];
};

export type CalendarEventRaw = {
  __typename?: 'CalendarEventRaw';
  attendees?: Maybe<Array<Maybe<CalendarEventRawAttendee>>>;
  calendarIds: Array<Maybe<Scalars['Int']>>;
  eventId: Scalars['Int'];
  exclusions?: Maybe<Array<Maybe<CalendarEventRawExcludedAttendee>>>;
  lessonInfo?: Maybe<CalendarEventLessonRaw>;
  roomIds?: Maybe<Array<Maybe<Scalars['Int']>>>;
  rooms?: Maybe<Array<Maybe<Room>>>;
  schedule: Array<Maybe<CalendarEventRawSchedule>>;
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

export type CalendarEventRawSchedule = {
  __typename?: 'CalendarEventRawSchedule';
  /**  end date of the recurrence */
  endDate?: Maybe<Scalars['Date']>;
  endTime: Scalars['Time'];
  /**  iCal/rfc5545 recurrence rule for event. Null means single */
  recurrenceRule?: Maybe<Scalars['String']>;
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

export type Comment = {
  __typename?: 'Comment';
  active?: Maybe<Scalars['Boolean']>;
  comment?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Long']>;
};

export type CommentBank = {
  __typename?: 'CommentBank';
  active?: Maybe<Scalars['Boolean']>;
  comments?: Maybe<Array<Maybe<Comment>>>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Long']>;
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

/**    -------------- Inputs --------------- */
export type CreateAcademicNamespaceInput = {
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<AcademicNamespaceType>;
  year: Scalars['Int'];
};

export type CreateAssessmentCommentInput = {
  assessmentId?: InputMaybe<Scalars['Long']>;
  comment?: InputMaybe<Scalars['String']>;
  commentBankId?: InputMaybe<Scalars['Long']>;
  commenterUserType?: InputMaybe<CommenterUserType>;
  studentPartyId?: InputMaybe<Scalars['Long']>;
};

export type CreateAssessmentInput = {
  academicNamespaceId?: InputMaybe<Scalars['Int']>;
  assessmentType?: InputMaybe<AssessmentType>;
  captureHouseMasterComment?: InputMaybe<Scalars['Boolean']>;
  capturePrincipalComment?: InputMaybe<Scalars['Boolean']>;
  captureTarget?: InputMaybe<Scalars['Boolean']>;
  captureTutorComment?: InputMaybe<Scalars['Boolean']>;
  captureYearHeadComment?: InputMaybe<Scalars['Boolean']>;
  commentBankId?: InputMaybe<Scalars['Int']>;
  commentType?: InputMaybe<CommentType>;
  description?: InputMaybe<Scalars['String']>;
  endDate?: InputMaybe<Scalars['Date']>;
  gradeSetIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
  gradeType?: InputMaybe<GradeType>;
  name?: InputMaybe<Scalars['String']>;
  passFailThreshold?: InputMaybe<Scalars['Int']>;
  publish?: InputMaybe<Scalars['Boolean']>;
  publishLearner?: InputMaybe<Scalars['Boolean']>;
  startDate?: InputMaybe<Scalars['Date']>;
  years?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export type CreateAssessmentResultInput = {
  assessmentId?: InputMaybe<Scalars['Long']>;
  commentBankCommentId?: InputMaybe<Scalars['Long']>;
  gradeSetGradeId?: InputMaybe<Scalars['Long']>;
  result?: InputMaybe<Scalars['Int']>;
  studentPartyId?: InputMaybe<Scalars['Long']>;
  targetGradeSetGradeId?: InputMaybe<Scalars['Long']>;
  targetResult?: InputMaybe<Scalars['Int']>;
};

export type CreateAttendanceCodeInput = {
  code: Scalars['String'];
  isActive?: InputMaybe<Scalars['Boolean']>;
  name: Array<InputMaybe<TranslationInput>>;
  uniqueName: Scalars['String'];
  visibleForContact?: InputMaybe<Scalars['Boolean']>;
  visibleForTeacher?: InputMaybe<Scalars['Boolean']>;
};

export type CreateCalendarEventAttendeeInput = {
  partyId: Scalars['Long'];
  /**  ... Defaults to event Recurrence Rule. Used in cases where attendee will not be attending all events */
  recurrenceRule?: InputMaybe<Scalars['String']>;
  /**  ... Defaults to event Start Date. Used in cases where attendee will not be attending all events */
  startDate?: InputMaybe<Scalars['Date']>;
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
  attendees?: InputMaybe<Array<InputMaybe<CreateCalendarEventAttendeeInput>>>;
  calendarIds: Array<InputMaybe<Scalars['Int']>>;
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
  type: CalendarEventType;
};

export type CreateCalendarEventLessonInput = {
  lessonId?: InputMaybe<Scalars['Int']>;
  subjectGroupId: Scalars['Long'];
};

export type CreateCalendarEventRoomInput = {
  roomId?: InputMaybe<Scalars['Int']>;
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

export type CreateDayAttendanceInput = {
  isActive?: InputMaybe<Scalars['Boolean']>;
  name: Array<InputMaybe<TranslationInput>>;
  time: Scalars['Time'];
  uniqueName: Scalars['String'];
};

export type CreateGeneralGroupInput = {
  academicNamespaces?: InputMaybe<Array<InputMaybe<CreateGroupAcademicNamespacesInput>>>;
  externalSystemInfo?: InputMaybe<Array<InputMaybe<ExternalSystemInfo>>>;
  generalGroupType: GeneralGroupType;
  name?: InputMaybe<Scalars['String']>;
  staffMembers?: InputMaybe<Array<InputMaybe<CreateGroupMembershipInput>>>;
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

export type CreateRoleInput = {
  description: Array<InputMaybe<TranslationInput>>;
  name: Array<InputMaybe<TranslationInput>>;
  permissions: Array<InputMaybe<PermissionForGroup>>;
  uniqueName: Scalars['String'];
};

export type CreateStaffInput = {
  carRegistrationNumber?: InputMaybe<Scalars['String']>;
  dateOfBirth?: InputMaybe<Scalars['Date']>;
  displayCode?: InputMaybe<Scalars['String']>;
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
  personal: PersonalInformationInput;
  studentRelationships: Array<InputMaybe<StudentContactRelationshipInfoInput>>;
};

export type CreateStudentEnrollment = {
  academicNamespaceId: Scalars['Int'];
  programmeId: Scalars['Int'];
  programmeStageId: Scalars['Int'];
  studentId: Scalars['Long'];
};

export type CreateStudentInput = {
  dateOfBirth?: InputMaybe<Scalars['Date']>;
  externalSystemInfo?: InputMaybe<ExternalSystemInfo>;
  firstName?: InputMaybe<Scalars['String']>;
  gender?: InputMaybe<Gender>;
  lastName?: InputMaybe<Scalars['String']>;
  middleName?: InputMaybe<Scalars['String']>;
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
  staffMembers?: InputMaybe<Array<InputMaybe<CreateGroupMembershipInput>>>;
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

export type DayAttendance = {
  __typename?: 'DayAttendance';
  active: Scalars['Boolean'];
  id: Scalars['Int'];
  name: Scalars['String'];
  nameTextId?: Maybe<Scalars['Int']>;
  time: Scalars['Time'];
};

export type DayAttendanceFilter = {
  active?: InputMaybe<Scalars['Boolean']>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export enum EmploymentCapacity {
  Agency = 'AGENCY',
  FullTime = 'FULL_TIME',
  PartTime = 'PART_TIME',
  Unknown = 'UNKNOWN'
}

export enum ErrorDetail {
  /**
   * The deadline expired before the operation could complete.
   *
   * For operations that change the state of the system, this error
   * may be returned even if the operation has completed successfully.
   * For example, a successful response from a server could have been
   * delayed long enough for the deadline to expire.
   *
   * HTTP Mapping: 504 Gateway Timeout
   * Error Type: UNAVAILABLE
   */
  DeadlineExceeded = 'DEADLINE_EXCEEDED',
  /**
   * The server detected that the client is exhibiting a behavior that
   * might be generating excessive load.
   *
   * HTTP Mapping: 429 Too Many Requests or 420 Enhance Your Calm
   * Error Type: UNAVAILABLE
   */
  EnhanceYourCalm = 'ENHANCE_YOUR_CALM',
  /**
   * The requested field is not found in the schema.
   *
   * This differs from `NOT_FOUND` in that `NOT_FOUND` should be used when a
   * query is valid, but is unable to return a result (if, for example, a
   * specific video id doesn't exist). `FIELD_NOT_FOUND` is intended to be
   * returned by the server to signify that the requested field is not known to exist.
   * This may be returned in lieu of failing the entire query.
   * See also `PERMISSION_DENIED` for cases where the
   * requested field is invalid only for the given user or class of users.
   *
   * HTTP Mapping: 404 Not Found
   * Error Type: BAD_REQUEST
   */
  FieldNotFound = 'FIELD_NOT_FOUND',
  /**
   * The client specified an invalid argument.
   *
   * Note that this differs from `FAILED_PRECONDITION`.
   * `INVALID_ARGUMENT` indicates arguments that are problematic
   * regardless of the state of the system (e.g., a malformed file name).
   *
   * HTTP Mapping: 400 Bad Request
   * Error Type: BAD_REQUEST
   */
  InvalidArgument = 'INVALID_ARGUMENT',
  /**
   * The provided cursor is not valid.
   *
   * The most common usage for this error is when a client is paginating
   * through a list that uses stateful cursors. In that case, the provided
   * cursor may be expired.
   *
   * HTTP Mapping: 404 Not Found
   * Error Type: NOT_FOUND
   */
  InvalidCursor = 'INVALID_CURSOR',
  /**
   * Unable to perform operation because a required resource is missing.
   *
   * Example: Client is attempting to refresh a list, but the specified
   * list is expired. This requires an action by the client to get a new list.
   *
   * If the user is simply trying GET a resource that is not found,
   * use the NOT_FOUND error type. FAILED_PRECONDITION.MISSING_RESOURCE
   * is to be used particularly when the user is performing an operation
   * that requires a particular resource to exist.
   *
   * HTTP Mapping: 400 Bad Request or 500 Internal Server Error
   * Error Type: FAILED_PRECONDITION
   */
  MissingResource = 'MISSING_RESOURCE',
  /**
   * Service Error.
   *
   * There is a problem with an upstream service.
   *
   * This may be returned if a gateway receives an unknown error from a service
   * or if a service is unreachable.
   * If a request times out which waiting on a response from a service,
   * `DEADLINE_EXCEEDED` may be returned instead.
   * If a service returns a more specific error Type, the specific error Type may
   * be returned instead.
   *
   * HTTP Mapping: 502 Bad Gateway
   * Error Type: UNAVAILABLE
   */
  ServiceError = 'SERVICE_ERROR',
  /**
   * Request failed due to network errors.
   *
   * HTTP Mapping: 503 Unavailable
   * Error Type: UNAVAILABLE
   */
  TcpFailure = 'TCP_FAILURE',
  /**
   * Request throttled based on server concurrency limits.
   *
   * HTTP Mapping: 503 Unavailable
   * Error Type: UNAVAILABLE
   */
  ThrottledConcurrency = 'THROTTLED_CONCURRENCY',
  /**
   * Request throttled based on server CPU limits
   *
   * HTTP Mapping: 503 Unavailable.
   * Error Type: UNAVAILABLE
   */
  ThrottledCpu = 'THROTTLED_CPU',
  /**
   * The operation is not implemented or is not currently supported/enabled.
   *
   * HTTP Mapping: 501 Not Implemented
   * Error Type: BAD_REQUEST
   */
  Unimplemented = 'UNIMPLEMENTED',
  /**
   * Unknown error.
   *
   * This error should only be returned when no other error detail applies.
   * If a client sees an unknown errorDetail, it will be interpreted as UNKNOWN.
   *
   * HTTP Mapping: 500 Internal Server Error
   */
  Unknown = 'UNKNOWN'
}

export enum ErrorType {
  /**
   * Bad Request.
   *
   * There is a problem with the request.
   * Retrying the same request is not likely to succeed.
   * An example would be a query or argument that cannot be deserialized.
   *
   * HTTP Mapping: 400 Bad Request
   */
  BadRequest = 'BAD_REQUEST',
  /**
   * The operation was rejected because the system is not in a state
   * required for the operation's execution.  For example, the directory
   * to be deleted is non-empty, an rmdir operation is applied to
   * a non-directory, etc.
   *
   * Service implementers can use the following guidelines to decide
   * between `FAILED_PRECONDITION` and `UNAVAILABLE`:
   *
   * - Use `UNAVAILABLE` if the client can retry just the failing call.
   * - Use `FAILED_PRECONDITION` if the client should not retry until
   * the system state has been explicitly fixed.  E.g., if an "rmdir"
   *      fails because the directory is non-empty, `FAILED_PRECONDITION`
   * should be returned since the client should not retry unless
   * the files are deleted from the directory.
   *
   * HTTP Mapping: 400 Bad Request or 500 Internal Server Error
   */
  FailedPrecondition = 'FAILED_PRECONDITION',
  /**
   * Internal error.
   *
   * An unexpected internal error was encountered. This means that some
   * invariants expected by the underlying system have been broken.
   * This error code is reserved for serious errors.
   *
   * HTTP Mapping: 500 Internal Server Error
   */
  Internal = 'INTERNAL',
  /**
   * The requested entity was not found.
   *
   * This could apply to a resource that has never existed (e.g. bad resource id),
   * or a resource that no longer exists (e.g. cache expired.)
   *
   * Note to server developers: if a request is denied for an entire class
   * of users, such as gradual feature rollout or undocumented allowlist,
   * `NOT_FOUND` may be used. If a request is denied for some users within
   * a class of users, such as user-based access control, `PERMISSION_DENIED`
   * must be used.
   *
   * HTTP Mapping: 404 Not Found
   */
  NotFound = 'NOT_FOUND',
  /**
   * The caller does not have permission to execute the specified
   * operation.
   *
   * `PERMISSION_DENIED` must not be used for rejections
   * caused by exhausting some resource or quota.
   * `PERMISSION_DENIED` must not be used if the caller
   * cannot be identified (use `UNAUTHENTICATED`
   * instead for those errors).
   *
   * This error Type does not imply the
   * request is valid or the requested entity exists or satisfies
   * other pre-conditions.
   *
   * HTTP Mapping: 403 Forbidden
   */
  PermissionDenied = 'PERMISSION_DENIED',
  /**
   * The request does not have valid authentication credentials.
   *
   * This is intended to be returned only for routes that require
   * authentication.
   *
   * HTTP Mapping: 401 Unauthorized
   */
  Unauthenticated = 'UNAUTHENTICATED',
  /**
   * Currently Unavailable.
   *
   * The service is currently unavailable.  This is most likely a
   * transient condition, which can be corrected by retrying with
   * a backoff.
   *
   * HTTP Mapping: 503 Unavailable
   */
  Unavailable = 'UNAVAILABLE',
  /**
   * Unknown error.
   *
   * For example, this error may be returned when
   * an error code received from another address space belongs to
   * an error space that is not known in this address space.  Also
   * errors raised by APIs that do not return enough error information
   * may be converted to this error.
   *
   * If a client sees an unknown errorType, it will be interpreted as UNKNOWN.
   * Unknown errors MUST NOT trigger any special behavior. These MAY be treated
   * by an implementation as being equivalent to INTERNAL.
   *
   * When possible, a more specific error should be provided.
   *
   * HTTP Mapping: 520 Unknown Error
   */
  Unknown = 'UNKNOWN'
}

export type EventAttendance = {
  __typename?: 'EventAttendance';
  attendanceCodeId: Scalars['Int'];
  date: Scalars['Date'];
  eventId: Scalars['Int'];
  id: Scalars['Long'];
  personPartyId: Scalars['Int'];
};

export type EventAttendanceFilter = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
  personPartyIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
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

export enum Gender {
  Female = 'FEMALE',
  Male = 'MALE',
  Other = 'OTHER',
  Unknown = 'UNKNOWN'
}

export type GeneralGroup = Party & {
  __typename?: 'GeneralGroup';
  academicNamespaceIds?: Maybe<Array<Maybe<Scalars['Int']>>>;
  contactPartyIds?: Maybe<Array<Maybe<Scalars['Long']>>>;
  contacts?: Maybe<Array<Maybe<GeneralGroupMember>>>;
  generalGroupType: GeneralGroupType;
  name: Scalars['String'];
  partyId: Scalars['Long'];
  programmeStages?: Maybe<Array<Maybe<GroupProgrammeStage>>>;
  staff?: Maybe<Array<Maybe<GeneralGroupMember>>>;
  staffPartyIds?: Maybe<Array<Maybe<Scalars['Long']>>>;
  studentCount?: Maybe<Scalars['Int']>;
  students?: Maybe<Array<Maybe<GeneralGroupMember>>>;
  studentsPartyIds?: Maybe<Array<Maybe<Scalars['Long']>>>;
};

export type GeneralGroupFilter = {
  groupTypes?: InputMaybe<Array<InputMaybe<GeneralGroupType>>>;
  partyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
};

export type GeneralGroupMember = {
  __typename?: 'GeneralGroupMember';
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  partyId?: Maybe<Scalars['Long']>;
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
  id?: Maybe<Scalars['Long']>;
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
  id?: Maybe<Scalars['Long']>;
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
  Percentage = 'PERCENTAGE'
}

export type GroupMembership = {
  __typename?: 'GroupMembership';
  fromDate?: Maybe<Scalars['Date']>;
  partyId?: Maybe<Scalars['Long']>;
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

export type Label = {
  __typename?: 'Label';
  colour?: Maybe<Scalars['String']>;
  custom?: Maybe<Scalars['Boolean']>;
  id: Scalars['Long'];
  name: Scalars['String'];
  personPartyId?: Maybe<Scalars['Int']>;
};

export type LabelFilter = {
  id?: InputMaybe<Scalars['Long']>;
  personPartyId?: InputMaybe<Scalars['Int']>;
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
  canReply?: Maybe<Scalars['Boolean']>;
  id: Scalars['Long'];
  labels?: Maybe<Array<Maybe<Label>>>;
  latestMessage?: Maybe<Scalars['DateTime']>;
  readOn?: Maybe<Scalars['DateTime']>;
  recipients?: Maybe<Array<Maybe<Recipient>>>;
  rootMailId: Scalars['Long'];
  senderPartyId?: Maybe<Scalars['Int']>;
  sentOn?: Maybe<Scalars['DateTime']>;
  starred?: Maybe<Scalars['Boolean']>;
  subject?: Maybe<Scalars['String']>;
  threadId: Scalars['Long'];
  threads?: Maybe<Array<Maybe<Mail>>>;
};

export type MailFilter = {
  id?: InputMaybe<Scalars['Long']>;
  labelId?: InputMaybe<Scalars['Long']>;
  pagination: Pagination;
  partyId?: InputMaybe<Scalars['Int']>;
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
  addRecipe?: Maybe<Recipe>;
  assignLabel?: Maybe<Mail>;
  calendar_createCalendarEvents?: Maybe<Array<Maybe<CalendarEventRaw>>>;
  core_setActiveActiveAcademicNamespace?: Maybe<AcademicNamespace>;
  createAttendanceCode?: Maybe<AttendanceCode>;
  createDayAttendance?: Maybe<DayAttendance>;
  createProfileForGlobalUser?: Maybe<Profile>;
  createRole?: Maybe<SecurityRole>;
  createSubjects?: Maybe<Array<Maybe<Subject>>>;
  label?: Maybe<Label>;
  read?: Maybe<Scalars['String']>;
  saveAssessment?: Maybe<Assessment>;
  saveAssessmentResults?: Maybe<Array<Maybe<AssessmentResult>>>;
  saveCommentBank?: Maybe<CommentBank>;
  saveGradeSet?: Maybe<GradeSet>;
  saveStudentSupportFile?: Maybe<StudentSupportFile>;
  saveStudentSupportPlan?: Maybe<StudentSupportPlan>;
  saveStudentSupportPlanReview?: Maybe<StudentSupportPlanReview>;
  sendMail?: Maybe<Mail>;
  starred?: Maybe<Scalars['String']>;
  updateAttendanceCode?: Maybe<AttendanceCode>;
  updateDayAttendance?: Maybe<DayAttendance>;
  upsertEventAttendance?: Maybe<Array<Maybe<EventAttendance>>>;
  upsertStudentDayAttendance?: Maybe<Array<Maybe<StudentDayAttendance>>>;
};


export type MutationAddRecipeArgs = {
  input?: InputMaybe<RecipeInput>;
};


export type MutationAssignLabelArgs = {
  input?: InputMaybe<AssignLabelInput>;
};


export type MutationCalendar_CreateCalendarEventsArgs = {
  input?: InputMaybe<CreateCalendarEventsInput>;
};


export type MutationCore_SetActiveActiveAcademicNamespaceArgs = {
  input?: InputMaybe<SetActiveAcademicNamespace>;
};


export type MutationCreateAttendanceCodeArgs = {
  input?: InputMaybe<CreateAttendanceCodeInput>;
};


export type MutationCreateDayAttendanceArgs = {
  input?: InputMaybe<CreateDayAttendanceInput>;
};


export type MutationCreateProfileForGlobalUserArgs = {
  input?: InputMaybe<CreateProfileForGlobalUserInput>;
};


export type MutationCreateRoleArgs = {
  input?: InputMaybe<CreateRoleInput>;
};


export type MutationCreateSubjectsArgs = {
  input?: InputMaybe<CreateSubjectInput>;
};


export type MutationLabelArgs = {
  input?: InputMaybe<LabelInput>;
};


export type MutationReadArgs = {
  input?: InputMaybe<MailReadInput>;
};


export type MutationSaveAssessmentArgs = {
  input?: InputMaybe<CreateAssessmentInput>;
};


export type MutationSaveAssessmentResultsArgs = {
  input?: InputMaybe<Array<InputMaybe<CreateAssessmentResultInput>>>;
};


export type MutationSaveCommentBankArgs = {
  input?: InputMaybe<SaveCommentBankInput>;
};


export type MutationSaveGradeSetArgs = {
  input?: InputMaybe<SaveGradeSetInput>;
};


export type MutationSaveStudentSupportFileArgs = {
  input?: InputMaybe<SaveStudentSupportFileInput>;
};


export type MutationSaveStudentSupportPlanArgs = {
  input?: InputMaybe<SaveStudentSupportPlanInput>;
};


export type MutationSaveStudentSupportPlanReviewArgs = {
  input?: InputMaybe<SaveStudentSupportPlanReviewInput>;
};


export type MutationSendMailArgs = {
  input?: InputMaybe<SendMailInput>;
};


export type MutationStarredArgs = {
  input?: InputMaybe<MailStarredInput>;
};


export type MutationUpdateAttendanceCodeArgs = {
  input?: InputMaybe<UpdateAttendanceCodeInput>;
};


export type MutationUpdateDayAttendanceArgs = {
  input?: InputMaybe<UpdateDayAttendanceInput>;
};


export type MutationUpsertEventAttendanceArgs = {
  input?: InputMaybe<Array<InputMaybe<UpsertEventAttendanceInput>>>;
};


export type MutationUpsertStudentDayAttendanceArgs = {
  input?: InputMaybe<Array<InputMaybe<UpsertStudentDayAttendanceInput>>>;
};

export type MyLabelsFilter = {
  personPartyId?: InputMaybe<Scalars['Int']>;
};

export type Pagination = {
  lastId?: InputMaybe<Scalars['Long']>;
  lastMessage?: InputMaybe<Scalars['DateTime']>;
  limit: Scalars['Int'];
};

export type Party = {
  partyId?: Maybe<Scalars['Long']>;
};

export type PartyFilter = {
  partyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
};

export enum PartyPersonType {
  Contact = 'CONTACT',
  Staff = 'STAFF',
  Student = 'STUDENT'
}

export enum PartyType {
  ClassGroup = 'CLASS_GROUP',
  Contact = 'CONTACT',
  DynamicGroup = 'DYNAMIC_GROUP',
  GeneralGroup = 'GENERAL_GROUP',
  Staff = 'STAFF',
  StaticGroup = 'STATIC_GROUP',
  Student = 'STUDENT',
  SubjectGroup = 'SUBJECT_GROUP'
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

export type Person = Party & {
  __typename?: 'Person';
  avatarUrl?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  partyId?: Maybe<Scalars['Long']>;
  type?: Maybe<PartyPersonType>;
};

export type PersonFilter = {
  partyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
  profilePartyType?: InputMaybe<PartyPersonType>;
};

export type Personal = {
  __typename?: 'Personal';
  dateOfBirth?: Maybe<Scalars['Date']>;
  firstName: Scalars['String'];
  gender?: Maybe<Gender>;
  ire?: Maybe<PersonalInformationIre>;
  lastName: Scalars['String'];
  middleName?: Maybe<Scalars['String']>;
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

export type Profile = {
  __typename?: 'Profile';
  id: Scalars['Int'];
  nickName?: Maybe<Scalars['String']>;
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
  id?: Maybe<Scalars['Int']>;
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
  id?: Maybe<Scalars['Int']>;
  name: Scalars['String'];
  nameTextId?: Maybe<Scalars['Int']>;
  nationalCode?: Maybe<Scalars['String']>;
  programme?: Maybe<Programme>;
  programmeId?: Maybe<Scalars['Int']>;
  shortName?: Maybe<Scalars['String']>;
  shortNameTextId?: Maybe<Scalars['Int']>;
};

export type ProgrammeStageFilter = {
  programmeStageIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export type Query = {
  __typename?: 'Query';
  _service: _Service;
  admin__party_people?: Maybe<Array<Maybe<Person>>>;
  admin__tenants?: Maybe<Array<Maybe<Tenant>>>;
  assessment?: Maybe<Array<Maybe<Assessment>>>;
  assessmentResult?: Maybe<Array<Maybe<AssessmentResult>>>;
  attendanceCodes?: Maybe<Array<Maybe<AttendanceCode>>>;
  calendar_calendarEvents?: Maybe<Array<Maybe<CalendarEvent>>>;
  commentBank?: Maybe<Array<Maybe<CommentBank>>>;
  core_academicNamespaces?: Maybe<Array<Maybe<AcademicNamespace>>>;
  core_rooms?: Maybe<Array<Maybe<Room>>>;
  dayAttendances?: Maybe<Array<Maybe<DayAttendance>>>;
  eventAttendance?: Maybe<Array<Maybe<EventAttendance>>>;
  generalGroups?: Maybe<Array<Maybe<GeneralGroup>>>;
  gradeSet?: Maybe<Array<Maybe<GradeSet>>>;
  label?: Maybe<Array<Maybe<Label>>>;
  mail?: Maybe<Array<Maybe<Mail>>>;
  myAuthDetails?: Maybe<GlobalUser>;
  permissions?: Maybe<Array<Maybe<Permission>>>;
  profileTypes?: Maybe<Array<Maybe<ProfileType>>>;
  profiles?: Maybe<Array<Maybe<ProfileType>>>;
  recipes?: Maybe<Array<Maybe<Recipe>>>;
  roles?: Maybe<Array<Maybe<SecurityRole>>>;
  searchRecipient?: Maybe<Array<Maybe<SearchRecipient>>>;
  studentDayAttendance?: Maybe<Array<Maybe<StudentDayAttendance>>>;
  studentSupportFile?: Maybe<Array<Maybe<StudentSupportFile>>>;
  studentSupportPlan?: Maybe<Array<Maybe<StudentSupportPlan>>>;
  studentSupportPlanReview?: Maybe<Array<Maybe<StudentSupportPlanReview>>>;
  subjectGroups?: Maybe<Array<Maybe<SubjectGroup>>>;
  subjects?: Maybe<Array<Maybe<Subject>>>;
  unreadCount?: Maybe<Array<Maybe<UnreadCount>>>;
  years?: Maybe<Array<Maybe<Year>>>;
};


export type QueryAdmin__Party_PeopleArgs = {
  tenant: Scalars['Int'];
};


export type QueryAdmin__TenantsArgs = {
  filter?: InputMaybe<TenantsFilter>;
};


export type QueryAssessmentArgs = {
  filter?: InputMaybe<AssessmentFilter>;
};


export type QueryAssessmentResultArgs = {
  filter?: InputMaybe<AssessmentResultFilter>;
};


export type QueryAttendanceCodesArgs = {
  filter?: InputMaybe<AttendanceCodeFilter>;
};


export type QueryCalendar_CalendarEventsArgs = {
  filter?: InputMaybe<CalendarEventFilter>;
};


export type QueryCommentBankArgs = {
  filter?: InputMaybe<CommentBankFilter>;
};


export type QueryCore_AcademicNamespacesArgs = {
  filter?: InputMaybe<AcademicNamespaceFilter>;
};


export type QueryCore_RoomsArgs = {
  filter?: InputMaybe<RoomFilter>;
};


export type QueryDayAttendancesArgs = {
  filter?: InputMaybe<DayAttendanceFilter>;
};


export type QueryEventAttendanceArgs = {
  filter?: InputMaybe<EventAttendanceFilter>;
};


export type QueryGeneralGroupsArgs = {
  filter?: InputMaybe<GeneralGroupFilter>;
};


export type QueryGradeSetArgs = {
  filter?: InputMaybe<GradeSetFilter>;
};


export type QueryLabelArgs = {
  filter?: InputMaybe<LabelFilter>;
};


export type QueryMailArgs = {
  filter?: InputMaybe<MailFilter>;
};


export type QueryProfileTypesArgs = {
  filter?: InputMaybe<ProfileTypeFilter>;
};


export type QueryProfilesArgs = {
  filter?: InputMaybe<ProfileFilter>;
};


export type QueryRecipesArgs = {
  nameFilter?: InputMaybe<Scalars['String']>;
};


export type QueryRolesArgs = {
  filter?: InputMaybe<SecurityRoleFilter>;
};


export type QuerySearchRecipientArgs = {
  filter?: InputMaybe<SearchFilter>;
};


export type QueryStudentDayAttendanceArgs = {
  filter?: InputMaybe<StudentDayAttendanceFilter>;
};


export type QueryStudentSupportFileArgs = {
  filter?: InputMaybe<StudentSupportFileFilter>;
};


export type QueryStudentSupportPlanArgs = {
  filter?: InputMaybe<StudentSupportPlanFilter>;
};


export type QueryStudentSupportPlanReviewArgs = {
  filter?: InputMaybe<StudentSupportPlanReviewFilter>;
};


export type QuerySubjectGroupsArgs = {
  filter?: InputMaybe<SubjectGroupFilter>;
};


export type QuerySubjectsArgs = {
  filter?: InputMaybe<SubjectFilter>;
};


export type QueryUnreadCountArgs = {
  filter?: InputMaybe<UnreadCountFilter>;
};


export type QueryYearsArgs = {
  filter?: InputMaybe<YearFilter>;
};

export type Recipe = {
  __typename?: 'Recipe';
  items: Array<Maybe<RecipeItem>>;
  name: Scalars['String'];
};

export type RecipeInput = {
  items?: InputMaybe<Array<InputMaybe<RecipeItemInput>>>;
  name?: InputMaybe<Scalars['String']>;
};

export type RecipeItem = {
  __typename?: 'RecipeItem';
  name?: Maybe<Scalars['String']>;
};

export type RecipeItemInput = {
  name?: InputMaybe<Scalars['String']>;
};

export type Recipient = {
  __typename?: 'Recipient';
  id: Scalars['Long'];
  name?: Maybe<Scalars['String']>;
  recipientPartyId?: Maybe<Scalars['Int']>;
  recipientType?: Maybe<RecipientType>;
};

export enum RecipientType {
  Bcc = 'BCC',
  Cc = 'CC',
  To = 'TO'
}

export type Room = {
  __typename?: 'Room';
  capacity?: Maybe<Scalars['Int']>;
  name: Scalars['String'];
  roomId: Scalars['Int'];
};

export type RoomFilter = {
  roomIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export type SaveCommentBankInput = {
  active?: InputMaybe<Scalars['Boolean']>;
  comments?: InputMaybe<Array<InputMaybe<SaveCommentInput>>>;
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

export type SaveCommentInput = {
  active?: InputMaybe<Scalars['Boolean']>;
  comment?: InputMaybe<Scalars['String']>;
};

export type SaveGradeInput = {
  active?: InputMaybe<Scalars['Boolean']>;
  end?: InputMaybe<Scalars['Int']>;
  name: Array<InputMaybe<TranslationInput>>;
  passFailThreshold?: InputMaybe<Scalars['Int']>;
  start?: InputMaybe<Scalars['Int']>;
  studyLevels?: InputMaybe<Array<InputMaybe<GradeSetStudyLevel>>>;
};

export type SaveGradeSetInput = {
  active?: InputMaybe<Scalars['Boolean']>;
  customGradeSet?: InputMaybe<Scalars['Boolean']>;
  description?: InputMaybe<Array<InputMaybe<TranslationInput>>>;
  grades?: InputMaybe<Array<InputMaybe<SaveGradeInput>>>;
  isCba?: InputMaybe<Scalars['Boolean']>;
  name: Array<InputMaybe<TranslationInput>>;
  passFailThreshold?: InputMaybe<Scalars['Int']>;
  years?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
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
  studentPartyId: Scalars['Int'];
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
  personPartyId: Scalars['Int'];
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
  staffPartyId: Scalars['Int'];
};

export type SaveStudentSupportPlanTargetInput = {
  comments: Scalars['String'];
  id?: InputMaybe<Scalars['Int']>;
  status: TargetStatus;
  target: Scalars['String'];
};

export type SearchFilter = {
  text?: InputMaybe<Scalars['String']>;
};

export type SearchRecipient = {
  __typename?: 'SearchRecipient';
  partyId: Scalars['Long'];
  recipient: Scalars['String'];
  recipientType: SearchRecipientType;
};

export enum SearchRecipientType {
  ClassGroup = 'CLASS_GROUP',
  Contact = 'CONTACT',
  ContactsOfClassGroup = 'CONTACTS_OF_CLASS_GROUP',
  ContactsOfDynamicGroup = 'CONTACTS_OF_DYNAMIC_GROUP',
  ContactsOfGeneralGroup = 'CONTACTS_OF_GENERAL_GROUP',
  ContactsOfSubjectGroup = 'CONTACTS_OF_SUBJECT_GROUP',
  GeneralGroup = 'GENERAL_GROUP',
  Staff = 'STAFF',
  StaffDynamicGroup = 'STAFF_DYNAMIC_GROUP',
  StaffOfGeneralGroup = 'STAFF_OF_GENERAL_GROUP',
  Student = 'STUDENT',
  StudentsOfGeneralGroup = 'STUDENTS_OF_GENERAL_GROUP',
  StudentDynamicGroup = 'STUDENT_DYNAMIC_GROUP',
  SubjectGroup = 'SUBJECT_GROUP',
  TeachersOfLearner = 'TEACHERS_OF_LEARNER'
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
  recipientPartyId: Scalars['Int'];
  recipientType: RecipientType;
};

export type SetActiveAcademicNamespace = {
  academicNamespaceId: Scalars['Int'];
};

export type Staff = {
  __typename?: 'Staff';
  carRegistrationNumber?: Maybe<Scalars['String']>;
  dateOfBirth?: Maybe<Scalars['Date']>;
  displayCode?: Maybe<Scalars['String']>;
  employmentCapacity?: Maybe<EmploymentCapacity>;
  endDate?: Maybe<Scalars['Date']>;
  firstName: Scalars['String'];
  gender?: Maybe<Gender>;
  includeInTimetabling?: Maybe<Scalars['Boolean']>;
  isTeacher?: Maybe<Scalars['Boolean']>;
  lastName: Scalars['String'];
  middleName?: Maybe<Scalars['String']>;
  noLongerStaffMember?: Maybe<Scalars['Boolean']>;
  partyId: Scalars['Long'];
  payrollNumber?: Maybe<Scalars['String']>;
  staffIre?: Maybe<StaffIre>;
  staffIreTeacher?: Maybe<StaffTeacherIre>;
  startDate?: Maybe<Scalars['Date']>;
};

export type StaffFilter = {
  partyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
};

export type StaffIre = {
  __typename?: 'StaffIre';
  countryOfBirth?: Maybe<Scalars['String']>;
  pps?: Maybe<Scalars['String']>;
  religion?: Maybe<Scalars['String']>;
};

export type StaffTeacherIre = {
  __typename?: 'StaffTeacherIre';
  teacherCouncilNumber?: Maybe<Scalars['String']>;
  teachingPost?: Maybe<Scalars['String']>;
};

export type Student = {
  __typename?: 'Student';
  firstName?: Maybe<Scalars['String']>;
  gender?: Maybe<Gender>;
  lastName?: Maybe<Scalars['String']>;
  middleName?: Maybe<Scalars['String']>;
  partyId?: Maybe<Scalars['Long']>;
  startDate?: Maybe<Scalars['Date']>;
  studentIre?: Maybe<StudentIre>;
  studentIrePP?: Maybe<StudentIrePp>;
};

export type StudentContact = {
  __typename?: 'StudentContact';
  personal?: Maybe<Personal>;
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

export type StudentDayAttendance = {
  __typename?: 'StudentDayAttendance';
  attendanceCodeId: Scalars['Int'];
  date: Scalars['Date'];
  dayAttendanceId: Scalars['Int'];
  id: Scalars['Long'];
  studentPartyId: Scalars['Int'];
};

export type StudentDayAttendanceFilter = {
  date?: InputMaybe<Scalars['Date']>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
  studentPartyIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export type StudentFilter = {
  partyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
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
  mothersMaidenName?: Maybe<Scalars['String']>;
  previousSchoolRollNumber?: Maybe<Scalars['String']>;
  travellerHeritage?: Maybe<Scalars['Boolean']>;
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
  creatorPartyId: Scalars['Int'];
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
  studentPartyId: Scalars['Int'];
  subjects?: Maybe<Array<Maybe<StudentSupportFileSubject>>>;
  vision?: Maybe<Scalars['Boolean']>;
  visionComments?: Maybe<Scalars['String']>;
  visionDate?: Maybe<Scalars['Date']>;
};

export type StudentSupportFileFilter = {
  id?: InputMaybe<Scalars['Int']>;
  studentPartyId?: InputMaybe<Scalars['Int']>;
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
  personPartyId: Scalars['Int'];
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
  staffPartyId: Scalars['Int'];
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
  description?: Maybe<Scalars['String']>;
  descriptionTextId?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  name: Scalars['String'];
  nameTextId?: Maybe<Scalars['Int']>;
  nationalCode?: Maybe<Scalars['String']>;
  shortCode?: Maybe<Scalars['String']>;
  shortCodeTextId?: Maybe<Scalars['Int']>;
  subjectSource?: Maybe<SubjectSource>;
};

export type SubjectFilter = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export type SubjectGroup = Party & {
  __typename?: 'SubjectGroup';
  academicNamespace?: Maybe<Scalars['Int']>;
  alsoInAcademicNamespaces?: Maybe<Array<Maybe<Scalars['Int']>>>;
  irePP?: Maybe<SubjectGroupIrePp>;
  name: Scalars['String'];
  partyId: Scalars['Long'];
  programmeStages?: Maybe<Array<Maybe<GroupProgrammeStage>>>;
  staff?: Maybe<Array<Maybe<GroupMembership>>>;
  studentCount?: Maybe<Scalars['Int']>;
  students?: Maybe<Array<Maybe<GroupMembership>>>;
  subjectIds?: Maybe<Array<Maybe<Scalars['Int']>>>;
  /**     deep linked */
  subjects?: Maybe<Array<Maybe<Subject>>>;
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
  Higher = 'HIGHER',
  NotApplicable = 'NOT_APPLICABLE',
  Ordinary = 'ORDINARY'
}

export enum SubjectSource {
  Custom = 'CUSTOM',
  National = 'NATIONAL'
}

export enum TargetStatus {
  Achieved = 'ACHIEVED',
  InProgress = 'IN_PROGRESS',
  NotAchieved = 'NOT_ACHIEVED',
  NotApplicable = 'NOT_APPLICABLE'
}

export type Tenant = {
  __typename?: 'Tenant';
  imgUrl: Scalars['String'];
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
  personPartyId: Scalars['Int'];
};

export type UpdateAttendanceCodeInput = {
  code: Scalars['String'];
  id: Scalars['Int'];
  isActive?: InputMaybe<Scalars['Boolean']>;
  name: Array<InputMaybe<TranslationInput>>;
  uniqueName: Scalars['String'];
  visibleForContact?: InputMaybe<Scalars['Boolean']>;
  visibleForTeacher?: InputMaybe<Scalars['Boolean']>;
};

export type UpdateDayAttendanceInput = {
  id: Scalars['Int'];
  isActive: Scalars['Boolean'];
  name: Array<InputMaybe<TranslationInput>>;
  time: Scalars['Time'];
  uniqueName: Scalars['String'];
};

export type UpsertEventAttendanceInput = {
  attendanceCodeId: Scalars['Int'];
  date: Scalars['Date'];
  eventId: Scalars['Int'];
  id?: InputMaybe<Scalars['Long']>;
  personPartyId: Scalars['Int'];
};

export type UpsertRoomInput = {
  capacity?: InputMaybe<Scalars['Int']>;
  name: Scalars['String'];
  roomId?: InputMaybe<Scalars['Int']>;
};

export type UpsertStudentDayAttendanceInput = {
  attendanceCodeId: Scalars['Int'];
  date: Scalars['Date'];
  dayAttendanceId: Scalars['Int'];
  id?: InputMaybe<Scalars['Long']>;
  studentPartyId: Scalars['Int'];
};

export enum UserType {
  Admin = 'ADMIN',
  Contact = 'CONTACT',
  Student = 'STUDENT',
  Teacher = 'TEACHER',
  Tyro = 'TYRO'
}

export type Year = {
  __typename?: 'Year';
  id?: Maybe<Scalars['Int']>;
  name: Scalars['String'];
  nameTextId?: Maybe<Scalars['Int']>;
  programmeStageIds?: Maybe<Array<Maybe<Scalars['Int']>>>;
  year?: Maybe<Scalars['Int']>;
};

export type YearFilter = {
  years?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export type _Service = {
  __typename?: '_Service';
  sdl: Scalars['String'];
};

export type MyAuthDetailsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyAuthDetailsQuery = { __typename?: 'Query', myAuthDetails?: { __typename?: 'GlobalUser', id: number, email?: string | null, name?: string | null, defaultProfileId?: number | null, activeProfileId?: number | null, profiles?: Array<{ __typename?: 'Profile', id: number, nickName?: string | null, permissionIds?: Array<string | null> | null, tenant: { __typename?: 'Tenant', tenant: number, name: string, imgUrl: string }, profileType?: { __typename?: 'ProfileType', name: string, description: string, userType: UserType } | null } | null> | null } | null };

export type Admin__Party_PeopleQueryVariables = Exact<{
  tenant: Scalars['Int'];
}>;


export type Admin__Party_PeopleQuery = { __typename?: 'Query', admin__party_people?: Array<{ __typename?: 'Person', partyId?: any | null, firstName?: string | null, lastName?: string | null, type?: PartyPersonType | null } | null> | null };

export type Admin__TenantsQueryVariables = Exact<{ [key: string]: never; }>;


export type Admin__TenantsQuery = { __typename?: 'Query', admin__tenants?: Array<{ __typename?: 'Tenant', tenant: number, name: string, imgUrl: string } | null> | null };

export type Calendar_CreateCalendarEventsMutationVariables = Exact<{
  input: CreateCalendarEventsInput;
}>;


export type Calendar_CreateCalendarEventsMutation = { __typename?: 'Mutation', calendar_createCalendarEvents?: Array<{ __typename?: 'CalendarEventRaw', eventId: number, calendarIds: Array<number | null>, type: CalendarEventType, roomIds?: Array<number | null> | null, schedule: Array<{ __typename?: 'CalendarEventRawSchedule', startTime: any, endTime: any, startDate: any, endDate?: any | null, recurrenceRule?: string | null } | null>, attendees?: Array<{ __typename?: 'CalendarEventRawAttendee', partyId: any, type: CalendarEventAttendeeType, startDate?: any | null, endDate?: any | null, recurrenceRule?: string | null } | null> | null, exclusions?: Array<{ __typename?: 'CalendarEventRawExcludedAttendee', partyId: any, startDate?: any | null, endDate?: any | null, recurrenceRule?: string | null } | null> | null, lessonInfo?: { __typename?: 'CalendarEventLessonRaw', subjectGroupId: any, lessonId?: number | null } | null } | null> | null };

export type Calendar_CalendarEventsQueryVariables = Exact<{
  filter: CalendarEventFilter;
}>;


export type Calendar_CalendarEventsQuery = { __typename?: 'Query', calendar_calendarEvents?: Array<{ __typename?: 'CalendarEvent', calendarIds: Array<number | null>, startTime?: any | null, endTime?: any | null, type: CalendarEventType, lessonInfo?: { __typename?: 'CalendarEventLessonRaw', subjectGroupId: any, lessonId?: number | null } | null, exclusions?: Array<{ __typename?: 'CalendarEventAttendee', partyId: any, type: CalendarEventAttendeeType } | null> | null, attendees?: Array<{ __typename?: 'CalendarEventAttendee', partyId: any, type: CalendarEventAttendeeType, partyInfo?: { __typename: 'GeneralGroup', name: string, partyId: any } | { __typename: 'Person', firstName?: string | null, lastName?: string | null, partyId?: any | null } | { __typename: 'SubjectGroup', name: string, partyId: any, subjects?: Array<{ __typename?: 'Subject', name: string } | null> | null } | null } | null> | null, rooms?: Array<{ __typename?: 'Room', roomId: number, name: string } | null> | null } | null> | null };

export type Core_AcademicNamespacesQueryVariables = Exact<{ [key: string]: never; }>;


export type Core_AcademicNamespacesQuery = { __typename?: 'Query', core_academicNamespaces?: Array<{ __typename?: 'AcademicNamespace', academicNamespaceId: number, type: AcademicNamespaceType, name: string, year: number, description?: string | null, isActiveDefaultNamespace: boolean } | null> | null };

export type Core_SetActiveActiveAcademicNamespaceMutationVariables = Exact<{
  input?: InputMaybe<SetActiveAcademicNamespace>;
}>;


export type Core_SetActiveActiveAcademicNamespaceMutation = { __typename?: 'Mutation', core_setActiveActiveAcademicNamespace?: { __typename?: 'AcademicNamespace', academicNamespaceId: number, type: AcademicNamespaceType, name: string, year: number, description?: string | null, isActiveDefaultNamespace: boolean } | null };

export type Core_RoomsQueryVariables = Exact<{ [key: string]: never; }>;


export type Core_RoomsQuery = { __typename?: 'Query', core_rooms?: Array<{ __typename?: 'Room', roomId: number, name: string, capacity?: number | null } | null> | null };

export type GeneralGroupsListQueryVariables = Exact<{
  filter: GeneralGroupFilter;
}>;


export type GeneralGroupsListQuery = { __typename?: 'Query', generalGroups?: Array<{ __typename?: 'GeneralGroup', partyId: any, name: string, studentCount?: number | null, generalGroupType: GeneralGroupType, programmeStages?: Array<{ __typename?: 'GroupProgrammeStage', programmeStage?: { __typename?: 'ProgrammeStage', programme?: { __typename?: 'Programme', name: string } | null } | null } | null> | null } | null> | null };

export type EnrolmentGroupsByIdQueryVariables = Exact<{
  filter: GeneralGroupFilter;
}>;


export type EnrolmentGroupsByIdQuery = { __typename?: 'Query', generalGroups?: Array<{ __typename?: 'GeneralGroup', partyId: any, name: string, students?: Array<{ __typename?: 'GeneralGroupMember', partyId?: any | null, firstName?: string | null, lastName?: string | null } | null> | null } | null> | null };

export type CustomGroupByIdQueryVariables = Exact<{
  filter: GeneralGroupFilter;
}>;


export type CustomGroupByIdQuery = { __typename?: 'Query', generalGroups?: Array<{ __typename?: 'GeneralGroup', partyId: any, name: string, students?: Array<{ __typename?: 'GeneralGroupMember', partyId?: any | null, firstName?: string | null, lastName?: string | null } | null> | null, staff?: Array<{ __typename?: 'GeneralGroupMember', partyId?: any | null, firstName?: string | null, lastName?: string | null } | null> | null } | null> | null };

export type SubjectGroupsQueryVariables = Exact<{ [key: string]: never; }>;


export type SubjectGroupsQuery = { __typename?: 'Query', subjectGroups?: Array<{ __typename?: 'SubjectGroup', partyId: any, name: string, studentCount?: number | null, subjects?: Array<{ __typename?: 'Subject', name: string } | null> | null, staff?: Array<{ __typename?: 'GroupMembership', partyId?: any | null, person?: { __typename?: 'Person', firstName?: string | null, lastName?: string | null, avatarUrl?: string | null } | null } | null> | null, irePP?: { __typename?: 'SubjectGroupIrePP', level?: SubjectGroupLevelIrePp | null } | null, programmeStages?: Array<{ __typename?: 'GroupProgrammeStage', programmeStage?: { __typename?: 'ProgrammeStage', programme?: { __typename?: 'Programme', name: string } | null } | null } | null> | null } | null> | null };

export type SubjectGroupByIdQueryVariables = Exact<{
  filter: SubjectGroupFilter;
}>;


export type SubjectGroupByIdQuery = { __typename?: 'Query', subjectGroups?: Array<{ __typename?: 'SubjectGroup', partyId: any, name: string, students?: Array<{ __typename?: 'GroupMembership', partyId?: any | null, person?: { __typename?: 'Person', firstName?: string | null, lastName?: string | null } | null } | null> | null } | null> | null };

export type StudentSubjectGroupsQueryVariables = Exact<{ [key: string]: never; }>;


export type StudentSubjectGroupsQuery = { __typename?: 'Query', subjectGroups?: Array<{ __typename?: 'SubjectGroup', partyId: any, name: string, studentCount?: number | null, subjects?: Array<{ __typename?: 'Subject', name: string } | null> | null, staff?: Array<{ __typename?: 'GroupMembership', partyId?: any | null, person?: { __typename?: 'Person', firstName?: string | null, lastName?: string | null, avatarUrl?: string | null } | null } | null> | null, irePP?: { __typename?: 'SubjectGroupIrePP', level?: SubjectGroupLevelIrePp | null } | null, programmeStages?: Array<{ __typename?: 'GroupProgrammeStage', programmeStage?: { __typename?: 'ProgrammeStage', programme?: { __typename?: 'Programme', name: string } | null } | null } | null> | null } | null> | null };


export const MyAuthDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"myAuthDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myAuthDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"defaultProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"activeProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"profiles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nickName"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"imgUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"profileType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"userType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"permissionIds"}}]}}]}}]}}]} as unknown as DocumentNode<MyAuthDetailsQuery, MyAuthDetailsQueryVariables>;
export const Admin__Party_PeopleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"admin__party_people"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tenant"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"admin__party_people"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"tenant"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tenant"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]} as unknown as DocumentNode<Admin__Party_PeopleQuery, Admin__Party_PeopleQueryVariables>;
export const Admin__TenantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"admin__tenants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"admin__tenants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"imgUrl"}}]}}]}}]} as unknown as DocumentNode<Admin__TenantsQuery, Admin__TenantsQueryVariables>;
export const Calendar_CreateCalendarEventsDocument = { "kind": "Document", "definitions": [{ "kind": "OperationDefinition", "operation": "mutation", "name": { "kind": "Name", "value": "calendar_createCalendarEvents" }, "variableDefinitions": [{ "kind": "VariableDefinition", "variable": { "kind": "Variable", "name": { "kind": "Name", "value": "input" } }, "type": { "kind": "NonNullType", "type": { "kind": "NamedType", "name": { "kind": "Name", "value": "CreateCalendarEventsInput" } } } }], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "calendar_createCalendarEvents" }, "arguments": [{ "kind": "Argument", "name": { "kind": "Name", "value": "input" }, "value": { "kind": "Variable", "name": { "kind": "Name", "value": "input" } } }], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "eventId" } }, { "kind": "Field", "name": { "kind": "Name", "value": "calendarIds" } }, { "kind": "Field", "name": { "kind": "Name", "value": "schedule" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "startTime" } }, { "kind": "Field", "name": { "kind": "Name", "value": "endTime" } }, { "kind": "Field", "name": { "kind": "Name", "value": "startDate" } }, { "kind": "Field", "name": { "kind": "Name", "value": "endDate" } }, { "kind": "Field", "name": { "kind": "Name", "value": "recurrenceRule" } }] } }, { "kind": "Field", "name": { "kind": "Name", "value": "attendees" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "partyId" } }, { "kind": "Field", "name": { "kind": "Name", "value": "type" } }, { "kind": "Field", "name": { "kind": "Name", "value": "startDate" } }, { "kind": "Field", "name": { "kind": "Name", "value": "endDate" } }, { "kind": "Field", "name": { "kind": "Name", "value": "recurrenceRule" } }] } }, { "kind": "Field", "name": { "kind": "Name", "value": "exclusions" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "partyId" } }, { "kind": "Field", "name": { "kind": "Name", "value": "startDate" } }, { "kind": "Field", "name": { "kind": "Name", "value": "endDate" } }, { "kind": "Field", "name": { "kind": "Name", "value": "recurrenceRule" } }] } }, { "kind": "Field", "name": { "kind": "Name", "value": "type" } }, { "kind": "Field", "name": { "kind": "Name", "value": "lessonInfo" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "subjectGroupId" } }, { "kind": "Field", "name": { "kind": "Name", "value": "lessonId" } }] } }, { "kind": "Field", "name": { "kind": "Name", "value": "roomIds" } }] } }] } }] } as unknown as DocumentNode<Calendar_CreateCalendarEventsMutation, Calendar_CreateCalendarEventsMutationVariables>;
export const Calendar_CalendarEventsDocument = { "kind": "Document", "definitions": [{ "kind": "OperationDefinition", "operation": "query", "name": { "kind": "Name", "value": "calendar_calendarEvents" }, "variableDefinitions": [{ "kind": "VariableDefinition", "variable": { "kind": "Variable", "name": { "kind": "Name", "value": "filter" } }, "type": { "kind": "NonNullType", "type": { "kind": "NamedType", "name": { "kind": "Name", "value": "CalendarEventFilter" } } } }], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "calendar_calendarEvents" }, "arguments": [{ "kind": "Argument", "name": { "kind": "Name", "value": "filter" }, "value": { "kind": "Variable", "name": { "kind": "Name", "value": "filter" } } }], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "calendarIds" } }, { "kind": "Field", "name": { "kind": "Name", "value": "startTime" } }, { "kind": "Field", "name": { "kind": "Name", "value": "endTime" } }, { "kind": "Field", "name": { "kind": "Name", "value": "type" } }, { "kind": "Field", "name": { "kind": "Name", "value": "lessonInfo" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "subjectGroupId" } }, { "kind": "Field", "name": { "kind": "Name", "value": "lessonId" } }] } }, { "kind": "Field", "name": { "kind": "Name", "value": "exclusions" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "partyId" } }, { "kind": "Field", "name": { "kind": "Name", "value": "type" } }] } }, { "kind": "Field", "name": { "kind": "Name", "value": "attendees" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "partyId" } }, { "kind": "Field", "name": { "kind": "Name", "value": "type" } }, { "kind": "Field", "name": { "kind": "Name", "value": "partyInfo" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "partyId" } }, { "kind": "Field", "name": { "kind": "Name", "value": "__typename" } }, { "kind": "InlineFragment", "typeCondition": { "kind": "NamedType", "name": { "kind": "Name", "value": "GeneralGroup" } }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "name" } }] } }, { "kind": "InlineFragment", "typeCondition": { "kind": "NamedType", "name": { "kind": "Name", "value": "SubjectGroup" } }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "name" } }, { "kind": "Field", "name": { "kind": "Name", "value": "subjects" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "name" } }] } }] } }, { "kind": "InlineFragment", "typeCondition": { "kind": "NamedType", "name": { "kind": "Name", "value": "Person" } }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "firstName" } }, { "kind": "Field", "name": { "kind": "Name", "value": "lastName" } }] } }] } }] } }, { "kind": "Field", "name": { "kind": "Name", "value": "rooms" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "roomId" } }, { "kind": "Field", "name": { "kind": "Name", "value": "name" } }] } }] } }] } }] } as unknown as DocumentNode<Calendar_CalendarEventsQuery, Calendar_CalendarEventsQueryVariables>;
export const Core_AcademicNamespacesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"core_academicNamespaces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_academicNamespaces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"academicNamespaceId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isActiveDefaultNamespace"}}]}}]}}]} as unknown as DocumentNode<Core_AcademicNamespacesQuery, Core_AcademicNamespacesQueryVariables>;
export const Core_SetActiveActiveAcademicNamespaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"core_setActiveActiveAcademicNamespace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SetActiveAcademicNamespace"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_setActiveActiveAcademicNamespace"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"academicNamespaceId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isActiveDefaultNamespace"}}]}}]}}]} as unknown as DocumentNode<Core_SetActiveActiveAcademicNamespaceMutation, Core_SetActiveActiveAcademicNamespaceMutationVariables>;
export const Core_RoomsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"core_rooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_rooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}}]}}]}}]} as unknown as DocumentNode<Core_RoomsQuery, Core_RoomsQueryVariables>;
export const GeneralGroupsListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"generalGroupsList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GeneralGroupFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"generalGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"studentCount"}},{"kind":"Field","name":{"kind":"Name","value":"generalGroupType"}},{"kind":"Field","name":{"kind":"Name","value":"programmeStages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"programmeStage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"programme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GeneralGroupsListQuery, GeneralGroupsListQueryVariables>;
export const EnrolmentGroupsByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"enrolmentGroupsById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GeneralGroupFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"generalGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"students"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]}}]} as unknown as DocumentNode<EnrolmentGroupsByIdQuery, EnrolmentGroupsByIdQueryVariables>;
export const CustomGroupByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"customGroupById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GeneralGroupFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"generalGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"students"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"staff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]}}]} as unknown as DocumentNode<CustomGroupByIdQuery, CustomGroupByIdQueryVariables>;
export const SubjectGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"subjectGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subjectGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"subjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"studentCount"}},{"kind":"Field","name":{"kind":"Name","value":"staff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"irePP"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"level"}}]}},{"kind":"Field","name":{"kind":"Name","value":"programmeStages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"programmeStage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"programme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<SubjectGroupsQuery, SubjectGroupsQueryVariables>;
export const SubjectGroupByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"subjectGroupById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SubjectGroupFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subjectGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"students"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]}}]}}]} as unknown as DocumentNode<SubjectGroupByIdQuery, SubjectGroupByIdQueryVariables>;
export const StudentSubjectGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"studentSubjectGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subjectGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"subjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"studentCount"}},{"kind":"Field","name":{"kind":"Name","value":"staff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"irePP"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"level"}}]}},{"kind":"Field","name":{"kind":"Name","value":"programmeStages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"programmeStage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"programme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<StudentSubjectGroupsQuery, StudentSubjectGroupsQueryVariables>;
