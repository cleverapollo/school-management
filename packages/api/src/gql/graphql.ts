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
  /** An RFC-3339 compliant Full Time Scalar */
  Time: any;
  _FieldSet: any;
};

export type AcademicNamespace = {
  __typename?: 'AcademicNamespace';
  academicNamespaceId: Scalars['Int'];
  description?: Maybe<Scalars['String']>;
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
  recurrenceRule: Scalars['String'];
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

/**    -------------- Inputs --------------- */
export type CreateAcademicNamespaceInput = {
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<AcademicNamespaceType>;
  year: Scalars['Int'];
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
  startDate: Scalars['Date'];
  startTime: Scalars['Time'];
  type: CalendarEventType;
};

export type CreateCalendarEventLessonInput = {
  lessonId?: InputMaybe<Scalars['Int']>;
  subjectGroupId: Scalars['Long'];
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
  externalId?: InputMaybe<Scalars['String']>;
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

export type GroupMembership = {
  __typename?: 'GroupMembership';
  firstName?: Maybe<Scalars['String']>;
  fromDate?: Maybe<Scalars['Date']>;
  lastName?: Maybe<Scalars['String']>;
  partyId?: Maybe<Scalars['Long']>;
  toDate?: Maybe<Scalars['Date']>;
  type?: Maybe<PartyPersonType>;
};

export type GroupProgrammeStage = {
  __typename?: 'GroupProgrammeStage';
  programmeId?: Maybe<Scalars['Int']>;
  programmeStage?: Maybe<ProgrammeStage>;
  programmeStageId?: Maybe<Scalars['Int']>;
};

export type Locale = {
  __typename?: 'Locale';
  id: Scalars['Int'];
  locale: Scalars['String'];
  name: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addRecipe?: Maybe<Recipe>;
  createAttendanceCode?: Maybe<AttendanceCode>;
  createDayAttendance?: Maybe<DayAttendance>;
  createProfileForGlobalUser?: Maybe<Profile>;
  createRole?: Maybe<SecurityRole>;
  createSubjects?: Maybe<Array<Maybe<Subject>>>;
  test?: Maybe<AcademicNamespace>;
  updateAttendanceCode?: Maybe<AttendanceCode>;
  updateDayAttendance?: Maybe<DayAttendance>;
  upsertEventAttendance?: Maybe<Array<Maybe<EventAttendance>>>;
  upsertStudentDayAttendance?: Maybe<Array<Maybe<StudentDayAttendance>>>;
};


export type MutationAddRecipeArgs = {
  input?: InputMaybe<RecipeInput>;
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
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  partyId?: Maybe<Scalars['Long']>;
  type?: Maybe<PartyPersonType>;
};

export type PersonFilter = {
  partyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
  profilePartyType?: InputMaybe<PartyPersonType>;
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
  academicNamespaced?: Maybe<Array<Maybe<AcademicNamespace>>>;
  admin__party_people?: Maybe<Array<Maybe<Person>>>;
  admin__tenants?: Maybe<Array<Maybe<Tenant>>>;
  attendanceCodes?: Maybe<Array<Maybe<AttendanceCode>>>;
  calendarEvents?: Maybe<Array<Maybe<CalendarEvent>>>;
  dayAttendances?: Maybe<Array<Maybe<DayAttendance>>>;
  eventAttendance?: Maybe<Array<Maybe<EventAttendance>>>;
  generalGroups?: Maybe<Array<Maybe<GeneralGroup>>>;
  myAuthDetails?: Maybe<GlobalUser>;
  permissions?: Maybe<Array<Maybe<Permission>>>;
  profileTypes?: Maybe<Array<Maybe<ProfileType>>>;
  profiles?: Maybe<Array<Maybe<ProfileType>>>;
  recipes?: Maybe<Array<Maybe<Recipe>>>;
  roles?: Maybe<Array<Maybe<SecurityRole>>>;
  studentDayAttendance?: Maybe<Array<Maybe<StudentDayAttendance>>>;
  subjectGroups?: Maybe<Array<Maybe<SubjectGroup>>>;
  subjects?: Maybe<Array<Maybe<Subject>>>;
};


export type QueryAcademicNamespacedArgs = {
  filter?: InputMaybe<AcademicNamespaceFilter>;
};


export type QueryAdmin__Party_PeopleArgs = {
  tenant: Scalars['Int'];
};


export type QueryAdmin__TenantsArgs = {
  filter?: InputMaybe<TenantsFilter>;
};


export type QueryAttendanceCodesArgs = {
  filter?: InputMaybe<AttendanceCodeFilter>;
};


export type QueryCalendarEventsArgs = {
  filter?: InputMaybe<CalendarEventFilter>;
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


export type QueryStudentDayAttendanceArgs = {
  filter?: InputMaybe<StudentDayAttendanceFilter>;
};


export type QuerySubjectGroupsArgs = {
  filter?: InputMaybe<SubjectGroupFilter>;
};


export type QuerySubjectsArgs = {
  filter?: InputMaybe<SubjectFilter>;
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

/**     --- Read model */
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

export type UpsertStudentDayAttendanceInput = {
  attendanceCodeId: Scalars['Int'];
  date: Scalars['Date'];
  dayAttendanceId: Scalars['Int'];
  id?: InputMaybe<Scalars['Long']>;
  studentPartyId: Scalars['Int'];
};

/**    -------------- Inputs --------------- */
export enum UserType {
  Admin = 'ADMIN',
  Contact = 'CONTACT',
  Student = 'STUDENT',
  Teacher = 'TEACHER'
}

export type _Service = {
  __typename?: '_Service';
  sdl: Scalars['String'];
};

export type MyAuthDetailsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyAuthDetailsQuery = { __typename?: 'Query', myAuthDetails?: { __typename?: 'GlobalUser', id: number, email?: string | null, name?: string | null, defaultProfileId?: number | null, activeProfileId?: number | null, profiles?: Array<{ __typename?: 'Profile', id: number, nickName?: string | null, permissionIds?: Array<string | null> | null, tenant: { __typename?: 'Tenant', tenant: number, name: string, imgUrl: string }, profileType?: { __typename?: 'ProfileType', name: string, description: string } | null } | null> | null } | null };


export const MyAuthDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"myAuthDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myAuthDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"defaultProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"activeProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"profiles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nickName"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"imgUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"profileType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"permissionIds"}}]}}]}}]}}]} as unknown as DocumentNode<MyAuthDetailsQuery, MyAuthDetailsQueryVariables>;