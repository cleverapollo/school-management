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
  grade?: Maybe<Scalars['String']>;
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
  description?: Maybe<Scalars['String']>;
  descriptionTextId?: Maybe<Scalars['Int']>;
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

export type BellTimeFilter = {
  ids: Array<InputMaybe<Scalars['Int']>>;
};

export type BlockFilter = {
  blockIds?: InputMaybe<Array<Scalars['String']>>;
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

export type CalendarDayBellTime = {
  __typename?: 'CalendarDayBellTime';
  bellTimeIds?: Maybe<Array<Scalars['Int']>>;
  /** deep linked */
  bellTimes?: Maybe<Array<Calendar_BellTime>>;
  date: Scalars['Date'];
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
  datetimeOrCondition?: InputMaybe<Array<Calendar_DatetimeFilterCondition>>;
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
  source?: Maybe<CalendarEventSource>;
  sourceId?: Maybe<Scalars['String']>;
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
  exclusions: Array<CalendarEventRawExcludedAttendee>;
  /**  iCal/rfc5545 recurrence rule for event. Null means single */
  recurrenceRule?: Maybe<Scalars['String']>;
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
  context?: Maybe<Scalars['String']>;
  label: Scalars['String'];
};

export type CalendarTagInput = {
  context?: InputMaybe<Scalars['String']>;
  label: Scalars['String'];
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

export type Calendar_SchoolDayType = {
  __typename?: 'Calendar_SchoolDayType';
  bellTimeIds: Array<Scalars['Int']>;
  bellTimes: Array<Calendar_BellTime>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
  time: Scalars['Time'];
};

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

export type Core_NonEnrolledSibling = {
  __typename?: 'Core_NonEnrolledSibling';
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  partyId: Scalars['Long'];
};

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

export type Core_UserAccess = {
  __typename?: 'Core_UserAccess';
  email?: Maybe<Scalars['String']>;
  invitationId?: Maybe<Scalars['Long']>;
  invitedOn?: Maybe<Scalars['DateTime']>;
  /** deep linked */
  invitingPerson?: Maybe<Person>;
  invitingPersonPartyId?: Maybe<Scalars['Long']>;
  mobileLastLogin?: Maybe<Scalars['DateTime']>;
  /** deep linked */
  person: Person;
  personPartyId: Scalars['Long'];
  status?: Maybe<UserAccessStatus>;
  webLastLogin?: Maybe<Scalars['DateTime']>;
};

export type Core_UserAccessFilter = {
  partyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
  userType: UserType;
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
  irePP?: InputMaybe<Array<InputMaybe<CreateSubjectGroupIrePpInput>>>;
  membershipTypes: Array<SubjectGroupMembershipTypeInput>;
  name: Scalars['String'];
  staffMembers?: InputMaybe<Array<InputMaybe<CreateStaffGroupMembershipInput>>>;
  studentMembers?: InputMaybe<Array<InputMaybe<CreateGroupMembershipInput>>>;
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

export enum DayType {
  Holiday = 'HOLIDAY',
  Partial = 'PARTIAL',
  SchoolDay = 'SCHOOL_DAY',
  StaffDay = 'STAFF_DAY'
}

export type DeleteDiscountInput = {
  id: Scalars['Int'];
};

export type DeleteFeeInput = {
  id: Scalars['Int'];
};

export type DeleteStudentMedicalConditionInput = {
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
  assignmentType: EnrollmentIre_AutoAssignBlockMembershipType;
  blockId: Scalars['String'];
};

export enum EnrollmentIre_AutoAssignBlockMembershipType {
  ByClassGroup = 'BY_CLASS_GROUP'
}

export type EnrollmentIre_AutoAssignCoreMembershipInput = {
  yearGroupEnrollmentId: Scalars['Long'];
};

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
  Groups = 'GROUPS',
  Notes = 'NOTES',
  Search = 'SEARCH',
  Settings = 'SETTINGS',
  Substitution = 'SUBSTITUTION',
  Timetable = 'TIMETABLE',
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

export type FindFreeResourcesFilter = {
  allRooms?: InputMaybe<Scalars['Boolean']>;
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
  classGroupInfo?: Maybe<ClassGroupInfo>;
  /**     deep linked */
  contactMembers?: Maybe<Group>;
  /**     deep linked */
  contacts: Array<Person>;
  generalGroupType: GeneralGroupType;
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
  colour?: Maybe<Colour>;
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
  colour?: InputMaybe<Colour>;
  id?: InputMaybe<Scalars['Long']>;
  name: Scalars['String'];
};

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

export enum MemberType {
  Admin = 'ADMIN',
  Contact = 'CONTACT',
  Staff = 'STAFF',
  Student = 'STUDENT'
}

export type Mutation = {
  __typename?: 'Mutation';
  asd?: Maybe<Scalars['String']>;
  assessment_saveAssessment?: Maybe<Assessment>;
  assessment_saveAssessmentComments?: Maybe<Array<AssessmentComment>>;
  assessment_saveAssessmentResults?: Maybe<Array<AssessmentResult>>;
  assessment_saveCommentBank?: Maybe<CommentBank>;
  assessment_saveGradeSet?: Maybe<GradeSet>;
  attendance_saveAttendanceCode?: Maybe<Array<Maybe<AttendanceCode>>>;
  attendance_saveEventAttendance?: Maybe<Array<Maybe<EventAttendance>>>;
  attendance_saveParentalAttendanceRequest?: Maybe<Array<Maybe<ParentalAttendanceRequest>>>;
  attendance_saveStudentSessionAttendance?: Maybe<Array<Maybe<StudentSessionAttendance>>>;
  calendar_createCalendarEvents?: Maybe<Array<Maybe<CalendarEventRaw>>>;
  calendar_updateCalendarDays?: Maybe<Success>;
  catalogue_createSubjects: Array<Subject>;
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
  core_enableBlockRotations?: Maybe<Success>;
  core_linkSiblingsAndContacts: Success;
  core_setActiveActiveAcademicNamespace?: Maybe<AcademicNamespace>;
  core_updateClassGroups?: Maybe<Success>;
  core_updateStaff: Success;
  core_updateStudentContactRelationships?: Maybe<Success>;
  core_updateStudents?: Maybe<Success>;
  core_updateSubjectGroups?: Maybe<Success>;
  core_updateYearGroupEnrollments?: Maybe<Success>;
  core_upsertAcademicNamespace?: Maybe<AcademicNamespace>;
  core_upsertRooms: Array<Room>;
  core_upsertStaff?: Maybe<Array<Maybe<Staff>>>;
  core_upsertStudentContact: StudentContact;
  enrollment_ire_autoAssignBlocks: EnrollmentIre_CoreMemberships;
  enrollment_ire_autoAssignCore: EnrollmentIre_CoreMemberships;
  enrollment_ire_changeProgrammeStage: Success;
  enrollment_ire_upsertBlockMemberships: EnrollmentIre_BlockMemberships;
  enrollment_ire_upsertCoreMemberships: EnrollmentIre_CoreMemberships;
  fees_deleteDiscount?: Maybe<Scalars['String']>;
  fees_deleteFee?: Maybe<Scalars['String']>;
  fees_saveDiscount?: Maybe<Discount>;
  fees_saveFee?: Maybe<Fee>;
  ppod_savePPODCredentials: PpodCredentials;
  swm_deleteAbsence: Success;
  swm_upsertAbsence: Array<Swm_StaffAbsence>;
  swm_upsertAbsenceType: Array<Swm_StaffAbsenceType>;
  tt_cloneTimetable: TtTimetable;
  tt_editLessonInstance: Array<TtIndividualViewLesson>;
  tt_publish: Tt_PublishResult;
  tt_reset: Success;
  tt_swap: Success;
  tt_updateTimetableGroup: Success;
  users_createProfileForGlobalUser?: Maybe<Profile>;
  users_inviteUsers?: Maybe<Array<Maybe<UserAccess>>>;
  users_savePermissionGroup?: Maybe<PermissionGroup>;
  wellbeing_deleteStudentMedicalCondition: StudentMedical;
  wellbeing_savePriorityStudent?: Maybe<PriorityStudent>;
  wellbeing_saveStudentSupportFile?: Maybe<StudentSupportFile>;
  wellbeing_saveStudentSupportPlan?: Maybe<StudentSupportPlan>;
  wellbeing_saveStudentSupportPlanReview?: Maybe<StudentSupportPlanReview>;
  wellbeing_upsertStudentMedicalCondition: StudentMedical;
  wellbeing_upsertStudentMedicalContact: StudentMedical;
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


export type MutationAttendance_SaveEventAttendanceArgs = {
  input?: InputMaybe<Array<InputMaybe<SaveEventAttendanceInput>>>;
};


export type MutationAttendance_SaveParentalAttendanceRequestArgs = {
  input?: InputMaybe<Array<InputMaybe<SaveParentalAttendanceRequest>>>;
};


export type MutationAttendance_SaveStudentSessionAttendanceArgs = {
  input?: InputMaybe<Array<InputMaybe<SaveStudentSessionAttendanceInput>>>;
};


export type MutationCalendar_CreateCalendarEventsArgs = {
  input?: InputMaybe<CreateCalendarEventsInput>;
};


export type MutationCalendar_UpdateCalendarDaysArgs = {
  input?: InputMaybe<Calendar_UpdateDays>;
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


export type MutationCore_EnableBlockRotationsArgs = {
  input?: InputMaybe<Core_EnableBlockRotationInput>;
};


export type MutationCore_LinkSiblingsAndContactsArgs = {
  input: Core_LinkSiblingsAndContacts;
};


export type MutationCore_SetActiveActiveAcademicNamespaceArgs = {
  input?: InputMaybe<SetActiveAcademicNamespace>;
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


export type MutationCore_UpsertRoomsArgs = {
  input?: InputMaybe<Array<InputMaybe<UpsertRoomInput>>>;
};


export type MutationCore_UpsertStaffArgs = {
  input?: InputMaybe<Array<InputMaybe<UpsertStaffInput>>>;
};


export type MutationCore_UpsertStudentContactArgs = {
  input: UpsertStudentContactInput;
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


export type MutationPpod_SavePpodCredentialsArgs = {
  input?: InputMaybe<SavePpodCredentials>;
};


export type MutationSwm_DeleteAbsenceArgs = {
  input: Array<Scalars['Int']>;
};


export type MutationSwm_UpsertAbsenceArgs = {
  input: Array<Swm_UpsertStaffAbsence>;
};


export type MutationSwm_UpsertAbsenceTypeArgs = {
  input?: InputMaybe<Array<InputMaybe<Swm_UpsertStaffAbsenceType>>>;
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


export type MutationTt_ResetArgs = {
  input: Tt_Reset;
};


export type MutationTt_SwapArgs = {
  input: TtSwapsInput;
};


export type MutationTt_UpdateTimetableGroupArgs = {
  input: Tt_UpdateTimetableGroupInput;
};


export type MutationUsers_CreateProfileForGlobalUserArgs = {
  input?: InputMaybe<CreateProfileForGlobalUserInput>;
};


export type MutationUsers_InviteUsersArgs = {
  input?: InputMaybe<Array<InputMaybe<InviteUser>>>;
};


export type MutationUsers_SavePermissionGroupArgs = {
  input?: InputMaybe<SavePermissionGroup>;
};


export type MutationWellbeing_DeleteStudentMedicalConditionArgs = {
  input: DeleteStudentMedicalConditionInput;
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


export type MutationWellbeing_UpsertStudentMedicalConditionArgs = {
  input: UpsertStudentMedicalConditionInput;
};


export type MutationWellbeing_UpsertStudentMedicalContactArgs = {
  input: UpsertStudentMedicalContactInput;
};

export type MyLabelsFilter = {
  personPartyId: Scalars['Long'];
};

export type NextOfKin = {
  __typename?: 'NextOfKin';
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  phoneNumbers?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export enum Notes_BehaviourType {
  Negative = 'NEGATIVE',
  Neutral = 'NEUTRAL',
  Positive = 'POSITIVE'
}

export type Notes_CreateBehaviourTagInput = {
  behaviourType?: InputMaybe<Notes_BehaviourType>;
  description?: InputMaybe<Array<InputMaybe<TranslationInput>>>;
  name?: InputMaybe<Array<InputMaybe<TranslationInput>>>;
  tag_l2: Scalars['String'];
  tag_l3?: InputMaybe<Scalars['String']>;
};

export type Notes_CreateNote = {
  createdBy?: InputMaybe<Scalars['Long']>;
  createdOn?: InputMaybe<Scalars['DateTime']>;
  note?: InputMaybe<Scalars['String']>;
  referencedParties?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
  tags: Array<Scalars['Int']>;
};

export type Notes_CreateNotesTagInput = {
  description?: InputMaybe<Array<InputMaybe<TranslationInput>>>;
  name?: InputMaybe<Array<InputMaybe<TranslationInput>>>;
  tag_l1: Scalars['String'];
  tag_l2?: InputMaybe<Scalars['String']>;
  tag_l3?: InputMaybe<Scalars['String']>;
};

export type Notes_Note = {
  __typename?: 'Notes_Note';
  createdBy: Scalars['Int'];
  createdByPerson?: Maybe<Person>;
  createdOn?: Maybe<Scalars['DateTime']>;
  id?: Maybe<Scalars['Int']>;
  referencedParties: Array<Party>;
  tags: Array<Notes_Tag>;
  tagsIds: Array<Scalars['Int']>;
};

export type Notes_Tag = {
  __typename?: 'Notes_Tag';
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
  id: Scalars['Int'];
  permissionType?: Maybe<PermissionType>;
  toggle?: Maybe<Scalars['Boolean']>;
};

export type PermissionSet = {
  __typename?: 'PermissionSet';
  contact: Scalars['Boolean'];
  description: Scalars['String'];
  descriptionTextId: Scalars['Int'];
  feature?: Maybe<Feature>;
  id: Scalars['Int'];
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
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
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
  asdasd?: Maybe<Scalars['String']>;
  assessment_assessment?: Maybe<Array<Assessment>>;
  assessment_assessmentComment?: Maybe<Array<AssessmentComment>>;
  assessment_assessmentResult?: Maybe<Array<AssessmentResult>>;
  assessment_assessmentSubjectGroups?: Maybe<Array<AssessmentSubjectGroup>>;
  assessment_calculateGrade: CalculatedGrade;
  assessment_commentBank?: Maybe<Array<CommentBank>>;
  assessment_dashboardAssessment?: Maybe<Array<DashboardAssessment>>;
  assessment_gradeSet?: Maybe<Array<GradeSet>>;
  attendance_attendanceCodes?: Maybe<Array<Maybe<AttendanceCode>>>;
  attendance_eventAttendance?: Maybe<Array<Maybe<EventAttendance>>>;
  attendance_parentalAttendanceRequests?: Maybe<Array<Maybe<ParentalAttendanceRequest>>>;
  attendance_studentSessionAttendance?: Maybe<Array<Maybe<StudentSessionAttendance>>>;
  calendar_bellTimes: Array<Calendar_BellTime>;
  calendar_calendarDayBellTimes: Array<CalendarDayBellTime>;
  calendar_calendarEvents?: Maybe<ResourceCalendarWrapper>;
  calendar_calendarEventsIterator?: Maybe<CalendarEvent>;
  calendar_dayInfo: Array<CalendarDayInfo>;
  /**    Checks whether the searched for calendar resources are free or not at particular times */
  calendar_findFreeResources: FreeCalendarResources;
  catalogue_personalTitles: Array<PersonalTitle>;
  catalogue_programmeStages: Array<ProgrammeStage>;
  catalogue_staffCapacities: Array<StaffCapacity>;
  catalogue_staffPosts: Array<StaffPost>;
  catalogue_subjects: Array<Subject>;
  catalogue_years: Array<YearGroup>;
  communications_label?: Maybe<Array<Maybe<Label>>>;
  communications_mail?: Maybe<Array<Maybe<Mail>>>;
  communications_notificationTemplates?: Maybe<Array<Maybe<NotificationTemplate>>>;
  communications_notifications?: Maybe<Array<Maybe<Notification>>>;
  communications_registeredDevices?: Maybe<Array<Maybe<DeviceRegistration>>>;
  communications_sms?: Maybe<Array<Maybe<Sms>>>;
  communications_smsCost?: Maybe<SmsCost>;
  communications_smsCredit?: Maybe<SmsCredit>;
  communications_smsXeroItem: Array<XeroItem>;
  communications_unreadCount?: Maybe<Array<Maybe<UnreadCount>>>;
  composite_studentStatus: StudentStatus;
  core_academicNamespaces?: Maybe<Array<AcademicNamespace>>;
  core_blocks: Array<CoreBlock>;
  core_parties: Array<Party>;
  core_rooms?: Maybe<Array<Room>>;
  core_staff: Array<Staff>;
  core_studentContacts?: Maybe<Array<StudentContact>>;
  core_students: Array<Student>;
  core_subjectGroupStudents?: Maybe<SubjectGroupStudent>;
  core_userAccess: Array<Core_UserAccess>;
  core_yearGroupEnrollments: Array<YearGroupEnrollment>;
  enrollment_ire_blockMemberships: EnrollmentIre_BlockMemberships;
  enrollment_ire_coreMemberships: EnrollmentIre_CoreMemberships;
  fees_discounts?: Maybe<Array<Maybe<Discount>>>;
  fees_fees?: Maybe<Array<Maybe<Fee>>>;
  generalGroups?: Maybe<Array<GeneralGroup>>;
  myAuthDetails?: Maybe<GlobalUser>;
  permissions?: Maybe<Array<Maybe<Permission>>>;
  ppod_PPODCredentials?: Maybe<PpodCredentials>;
  ppod_syncRequests: Array<SyncRequest>;
  profileTypes?: Maybe<Array<Maybe<ProfileType>>>;
  profiles?: Maybe<Array<Maybe<ProfileType>>>;
  search_search: Array<Search>;
  subjectGroups?: Maybe<Array<SubjectGroup>>;
  swm_absenceTypes: Array<Swm_StaffAbsenceType>;
  swm_absences: Array<Swm_StaffAbsence>;
  swm_eventsForSubstitutions: Array<Swm_CalendarSubstitution>;
  swm_substitutions: Array<Swm_Substitution>;
  tt_groups: Array<Tt_Groups>;
  tt_individualLessons: Array<TtIndividualViewLesson>;
  tt_resourceTimetableView: TtResourceTimetableView;
  tt_swapRoomOptions: TtSwapRoomOptions;
  tt_swapTeacherOptions: TtSwapTeacherOptions;
  tt_timetables: Array<TtTimetable>;
  users_permissionGroups?: Maybe<Array<Maybe<PermissionGroup>>>;
  users_permissionSets?: Maybe<Array<Maybe<PermissionSet>>>;
  users_schoolInfo?: Maybe<SchoolInfo>;
  users_userInvitations?: Maybe<Array<Maybe<UserAccess>>>;
  wellbeing_activeSupportPlan?: Maybe<Array<Maybe<ActivePlan>>>;
  wellbeing_priorityStudent?: Maybe<Array<Maybe<PriorityStudent>>>;
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


export type QueryAttendance_EventAttendanceArgs = {
  filter?: InputMaybe<EventAttendanceFilter>;
};


export type QueryAttendance_ParentalAttendanceRequestsArgs = {
  filter?: InputMaybe<ParentalAttendanceRequestFilter>;
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


export type QueryComposite_StudentStatusArgs = {
  filter?: InputMaybe<StudentStatusFilter>;
};


export type QueryCore_AcademicNamespacesArgs = {
  filter?: InputMaybe<AcademicNamespaceFilter>;
};


export type QueryCore_BlocksArgs = {
  filter?: InputMaybe<BlockFilter>;
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


export type QueryCore_UserAccessArgs = {
  filter?: InputMaybe<Core_UserAccessFilter>;
};


export type QueryCore_YearGroupEnrollmentsArgs = {
  filter?: InputMaybe<YearGroupEnrollmentFilter>;
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


export type QueryGeneralGroupsArgs = {
  filter?: InputMaybe<GeneralGroupFilter>;
};


export type QueryPpod_SyncRequestsArgs = {
  filter?: InputMaybe<SyncRequestsFilter>;
};


export type QueryProfileTypesArgs = {
  filter?: InputMaybe<ProfileTypeFilter>;
};


export type QueryProfilesArgs = {
  filter?: InputMaybe<ProfileFilter>;
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


export type QuerySwm_SubstitutionsArgs = {
  filter?: InputMaybe<Swm_SubstitutionsFilter>;
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


export type QueryUsers_UserInvitationsArgs = {
  filter?: InputMaybe<UserAccessFilter>;
};


export type QueryWellbeing_ActiveSupportPlanArgs = {
  filter?: InputMaybe<ActiveSupportPlanFilter>;
};


export type QueryWellbeing_PriorityStudentArgs = {
  filter?: InputMaybe<PriorityStudentFilter>;
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
  name?: Maybe<Scalars['String']>;
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
  event: CalendarEvent;
  substitution?: Maybe<Swm_Substitution>;
};

export type Swm_EventsForSubstitutionFilter = {
  fromDate: Scalars['Date'];
  staffPartyIds?: InputMaybe<Array<Scalars['Long']>>;
  toDate: Scalars['Date'];
};

export type Swm_StaffAbsence = {
  __typename?: 'SWM_StaffAbsence';
  absenceId: Scalars['Int'];
  absenceReasonText?: Maybe<Scalars['String']>;
  absenceType: Swm_StaffAbsenceType;
  absenceTypeId: Scalars['Int'];
  dates: Array<Swm_StaffAbsenceDate>;
  fromAbsenceRequestId?: Maybe<Scalars['Int']>;
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
  staffAbsenceIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  staffPartyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
  toDate?: InputMaybe<Scalars['Date']>;
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

export type Swm_Substitution = {
  __typename?: 'SWM_Substitution';
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
  id: Scalars['Int'];
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
  attendanceCodeId: Scalars['Int'];
  bellTimeId: Scalars['Int'];
  date: Scalars['Date'];
  id?: InputMaybe<Scalars['Long']>;
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
  SubjectGroupStudent = 'SUBJECT_GROUP_STUDENT',
  YearGroupEnrollment = 'YEAR_GROUP_ENROLLMENT'
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
  availableForTeaching?: InputMaybe<Scalars['Boolean']>;
  partyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
};

export type StaffGroupMembershipInput = {
  fromDate?: InputMaybe<Scalars['Date']>;
  partyId: Scalars['Long'];
  roles?: InputMaybe<Array<InputMaybe<StaffGroupMembershipRoles>>>;
  toDate?: InputMaybe<Scalars['Date']>;
};

export enum StaffGroupMembershipRoles {
  GroupAdmin = 'GROUP_ADMIN',
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
  /**  deep linked */
  classGroup?: Maybe<GeneralGroup>;
  /**  deep linked */
  contacts?: Maybe<Array<StudentContact>>;
  endDate?: Maybe<Scalars['Date']>;
  /**  deep linked */
  enrolmentHistory?: Maybe<Array<EnrollmentHistory>>;
  extensions?: Maybe<StudentGraphqlExtension>;
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

export type StudentFilter = {
  examNumbers?: InputMaybe<Array<Scalars['String']>>;
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
  reasonForLeaving?: Maybe<Scalars['String']>;
  repeatYear?: Maybe<Scalars['Boolean']>;
  shortTermPupil?: Maybe<Scalars['Boolean']>;
  shortTermPupilNumWeeks?: Maybe<Scalars['Int']>;
  travellerHeritage?: Maybe<Scalars['Boolean']>;
};

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
  subjectIds?: Maybe<Array<Maybe<Scalars['Int']>>>;
  /**     deep linked */
  subjects: Array<Subject>;
  yearGroups: Array<YearGroupEnrollment>;
};

export type SubjectGroupFilter = {
  partyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
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
  Unknown = 'UNKNOWN'
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
  liveTimetable?: InputMaybe<Scalars['Boolean']>;
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
  includeDtrReturns?: InputMaybe<Scalars['Boolean']>;
  jobSharing?: InputMaybe<Scalars['Boolean']>;
  makeAndModel?: InputMaybe<Scalars['String']>;
  noLongerStaffMember?: InputMaybe<Scalars['Boolean']>;
  otherSchool1?: InputMaybe<Scalars['String']>;
  otherSchool2?: InputMaybe<Scalars['String']>;
  parking?: InputMaybe<Scalars['String']>;
  position?: InputMaybe<Scalars['String']>;
  previousSchool1?: InputMaybe<Scalars['String']>;
  previousSchool2?: InputMaybe<Scalars['String']>;
  qualifications?: InputMaybe<Scalars['String']>;
  qualifications2?: InputMaybe<Scalars['String']>;
  qualifications3?: InputMaybe<Scalars['String']>;
  qualifications4?: InputMaybe<Scalars['String']>;
  staffPartyId: Scalars['Long'];
  staffPost?: InputMaybe<Scalars['Int']>;
  teacherCouncilNumber?: InputMaybe<Scalars['String']>;
  teacherReferenceNumber?: InputMaybe<Scalars['String']>;
};

export type UpdateStudentInput = {
  examNumber?: InputMaybe<Scalars['String']>;
  guardianshipNote?: InputMaybe<Scalars['String']>;
  lockerNumber?: InputMaybe<Scalars['String']>;
  preferredFirstName?: InputMaybe<Scalars['String']>;
  preferredLastName?: InputMaybe<Scalars['String']>;
  primaryEmail?: InputMaybe<Scalars['String']>;
  primaryPhoneNumber?: InputMaybe<Scalars['String']>;
  studentPartyId: Scalars['Long'];
};

export type UpdateSubjectGroupInput = {
  irePP?: InputMaybe<UpdateSubjectGroupIrePpInput>;
  subjectGroupPartyId: Scalars['Long'];
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
  pps?: InputMaybe<Scalars['String']>;
  religion?: InputMaybe<Scalars['String']>;
  staffPost?: InputMaybe<Scalars['Int']>;
  teacherCouncilNumber?: InputMaybe<Scalars['String']>;
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
  invitationId?: Maybe<Scalars['Long']>;
  invitedOn?: Maybe<Scalars['DateTime']>;
  invitingPersonPartyId?: Maybe<Scalars['Long']>;
  mobileLastLogin?: Maybe<Scalars['DateTime']>;
  personPartyId: Scalars['Long'];
  status?: Maybe<UserAccessStatus>;
  webLastLogin?: Maybe<Scalars['DateTime']>;
};

export type UserAccessFilter = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
  partyIds?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
};

export enum UserAccessStatus {
  Active = 'ACTIVE',
  Disabled = 'DISABLED',
  InviteSent = 'INVITE_SENT'
}

export type UserPermission = {
  __typename?: 'UserPermission';
  id: Scalars['String'];
  permissionType?: Maybe<PermissionType>;
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

export type Attendance_AttendanceCodesQueryVariables = Exact<{
  filter?: InputMaybe<AttendanceCodeFilter>;
}>;


export type Attendance_AttendanceCodesQuery = { __typename?: 'Query', attendance_attendanceCodes?: Array<{ __typename?: 'AttendanceCode', id: number, name: string, description?: string | null, code?: TuslaCode | null, active: boolean, visibleForTeacher: boolean, visibleForContact: boolean, nameTextId?: number | null, codeType: AttendanceCodeType } | null> | null };

export type Attendance_SaveAttendanceCodeMutationVariables = Exact<{
  input?: InputMaybe<Array<InputMaybe<SaveAttendanceCodeInput>> | InputMaybe<SaveAttendanceCodeInput>>;
}>;


export type Attendance_SaveAttendanceCodeMutation = { __typename?: 'Mutation', attendance_saveAttendanceCode?: Array<{ __typename?: 'AttendanceCode', id: number } | null> | null };

export type Attendance_SaveEventAttendanceMutationVariables = Exact<{
  input?: InputMaybe<Array<InputMaybe<SaveEventAttendanceInput>> | InputMaybe<SaveEventAttendanceInput>>;
}>;


export type Attendance_SaveEventAttendanceMutation = { __typename?: 'Mutation', attendance_saveEventAttendance?: Array<{ __typename?: 'EventAttendance', id: number, eventId: number, attendanceCodeId: number, personPartyId: number, date: string } | null> | null };

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


export type Calendar_CalendarEventsQuery = { __typename?: 'Query', calendar_calendarEvents?: { __typename?: 'ResourceCalendarWrapper', resources: Array<{ __typename: 'PartyCalendar', resourceId: number, partyInfo?: { __typename: 'GeneralGroup', name: string, avatarUrl?: string | null } | { __typename: 'ProgrammeStageEnrollment', name: string, avatarUrl?: string | null } | { __typename: 'Staff', person: { __typename?: 'Person', avatarUrl?: string | null, firstName?: string | null, lastName?: string | null } } | { __typename: 'Student', person: { __typename?: 'Person', avatarUrl?: string | null, firstName?: string | null, lastName?: string | null } } | { __typename: 'StudentContact', person: { __typename?: 'Person', avatarUrl?: string | null, firstName?: string | null, lastName?: string | null } } | { __typename: 'SubjectGroup', name: string, avatarUrl?: string | null } | { __typename: 'YearGroupEnrollment', name: string, avatarUrl?: string | null } | null, events: Array<{ __typename?: 'CalendarEvent', name: string, eventId: number, calendarIds: Array<number | null>, startTime: string, endTime: string, type: CalendarEventType, colour?: Colour | null, description?: string | null, allDayEvent: boolean, lessonInfo?: { __typename?: 'CalendarEventLessonRaw', subjectGroupId: number, lessonId?: number | null } | null, exclusions: Array<{ __typename?: 'CalendarEventAttendee', partyId: number, type: CalendarEventAttendeeType }>, attendees: Array<{ __typename?: 'CalendarEventAttendee', partyId: number, type: CalendarEventAttendeeType, partyInfo?: { __typename: 'GeneralGroup', name: string, avatarUrl?: string | null, partyId: number } | { __typename: 'ProgrammeStageEnrollment', name: string, avatarUrl?: string | null, partyId: number } | { __typename: 'Staff', partyId: number, person: { __typename?: 'Person', firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null } } | { __typename: 'Student', partyId: number, person: { __typename?: 'Person', firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null } } | { __typename: 'StudentContact', partyId: number, person: { __typename?: 'Person', firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null } } | { __typename: 'SubjectGroup', name: string, avatarUrl?: string | null, partyId: number } | { __typename: 'YearGroupEnrollment', name: string, avatarUrl?: string | null, partyId: number } | null }>, rooms: Array<{ __typename?: 'Room', roomId: number, name: string }> }> } | { __typename?: 'RoomCalendar', resourceId: number, room?: { __typename?: 'Room', name: string } | null, events: Array<{ __typename?: 'CalendarEvent', name: string, eventId: number, calendarIds: Array<number | null>, startTime: string, endTime: string, type: CalendarEventType, colour?: Colour | null, description?: string | null, allDayEvent: boolean, lessonInfo?: { __typename?: 'CalendarEventLessonRaw', subjectGroupId: number, lessonId?: number | null } | null, exclusions: Array<{ __typename?: 'CalendarEventAttendee', partyId: number, type: CalendarEventAttendeeType }>, attendees: Array<{ __typename?: 'CalendarEventAttendee', partyId: number, type: CalendarEventAttendeeType, partyInfo?: { __typename: 'GeneralGroup', name: string, avatarUrl?: string | null, partyId: number } | { __typename: 'ProgrammeStageEnrollment', name: string, avatarUrl?: string | null, partyId: number } | { __typename: 'Staff', partyId: number, person: { __typename?: 'Person', firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null } } | { __typename: 'Student', partyId: number, person: { __typename?: 'Person', firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null } } | { __typename: 'StudentContact', partyId: number, person: { __typename?: 'Person', firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null } } | { __typename: 'SubjectGroup', name: string, avatarUrl?: string | null, partyId: number } | { __typename: 'YearGroupEnrollment', name: string, avatarUrl?: string | null, partyId: number } | null }>, rooms: Array<{ __typename?: 'Room', roomId: number, name: string }> }> }> } | null };

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


export type Core_BlocksQuery = { __typename?: 'Query', core_blocks: Array<{ __typename?: 'CoreBlock', blockId: string, name: string, description?: string | null, subjectGroupNamesJoined?: string | null, isRotation: boolean, rotations: Array<{ __typename?: 'BlockRotation', iteration: number, startDate: string, endDate: string }> }> };

export type Enrollment_Ire_BlockMembershipsQueryVariables = Exact<{
  filter: EnrollmentIre_BlockEnrollmentFilter;
}>;


export type Enrollment_Ire_BlockMembershipsQuery = { __typename?: 'Query', enrollment_ire_blockMemberships: { __typename?: 'EnrollmentIre_BlockMemberships', blockId: string, isRotation: boolean, block: { __typename?: 'CoreBlock', blockId: string, name: string, description?: string | null, classGroupIds: Array<number>, subjectGroupIds: Array<number> }, groups: Array<{ __typename?: 'EnrollmentIre_BlockMembershipsDetails', rotationIteration: number, unenrolledStudents: Array<{ __typename?: 'EnrollmentIre_BlockMembershipStudent', isDuplicate: boolean, classGroupName?: string | null, gender?: Gender | null, person: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null } }>, subjectGroups: Array<{ __typename?: 'EnrollmentIre_BlockMembershipSubjectGroup', partyId: number, name: string, students: Array<{ __typename?: 'EnrollmentIre_BlockMembershipStudent', isDuplicate: boolean, classGroupName?: string | null, gender?: Gender | null, person: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null } }>, staff: Array<{ __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null }> }> }> } };

export type Enrollment_Ire_UpsertBlockMembershipsMutationVariables = Exact<{
  input: EnrollmentIre_UpsertBlockMembership;
}>;


export type Enrollment_Ire_UpsertBlockMembershipsMutation = { __typename?: 'Mutation', enrollment_ire_upsertBlockMemberships: { __typename?: 'EnrollmentIre_BlockMemberships', blockId: string } };

export type Enrollment_Ire_CoreMembershipsQueryVariables = Exact<{
  filter: EnrollmentIre_CoreEnrollmentFilter;
}>;


export type Enrollment_Ire_CoreMembershipsQuery = { __typename?: 'Query', enrollment_ire_coreMemberships: { __typename?: 'EnrollmentIre_CoreMemberships', yearGroupEnrollment?: { __typename?: 'YearGroupEnrollment', yearGroupId: number, name: string } | null, unenrolledStudents: Array<{ __typename?: 'Student', personalInformation?: { __typename?: 'PersonalInformation', gender?: Gender | null } | null, person: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null } }>, classGroups: Array<{ __typename?: 'GeneralGroup', partyId: number, name: string, students: Array<{ __typename?: 'Student', personalInformation?: { __typename?: 'PersonalInformation', gender?: Gender | null } | null, person: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null } }>, staff: Array<{ __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null }> }> } };

export type Enrollment_Ire_UpsertCoreMembershipsMutationVariables = Exact<{
  input: EnrollmentIre_UpsertCoreMembership;
}>;


export type Enrollment_Ire_UpsertCoreMembershipsMutation = { __typename?: 'Mutation', enrollment_ire_upsertCoreMemberships: { __typename?: 'EnrollmentIre_CoreMemberships', yearGroupEnrollment?: { __typename?: 'YearGroupEnrollment', yearGroupId: number } | null } };

export type ClassGroupsListQueryVariables = Exact<{
  filter: GeneralGroupFilter;
}>;


export type ClassGroupsListQuery = { __typename?: 'Query', generalGroups?: Array<{ __typename?: 'GeneralGroup', partyId: number, name: string, avatarUrl?: string | null, generalGroupType: GeneralGroupType, studentMembers?: { __typename?: 'Group', memberCount: number } | null, programmeStages: Array<{ __typename?: 'ProgrammeStage', programme?: { __typename?: 'Programme', name: string } | null }>, tutors: Array<{ __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null }>, yearGroupLeads: Array<{ __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null }>, yearGroups: Array<{ __typename?: 'YearGroupEnrollment', yearGroupId: number, name: string }> }> | null };

export type ClassGroupsByIdQueryVariables = Exact<{
  filter: GeneralGroupFilter;
}>;


export type ClassGroupsByIdQuery = { __typename?: 'Query', generalGroups?: Array<{ __typename?: 'GeneralGroup', partyId: number, name: string, students: Array<{ __typename?: 'Student', person: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', nameTextId: number, id: number, name: string } | null } }>, relatedSubjectGroups: Array<{ __typename?: 'SubjectGroup', name: string, partyId: number, avatarUrl?: string | null, studentMembershipType?: { __typename?: 'SubjectGroupStudentMembershipType', type: SubjectGroupStudentMembershipTypeEnum } | null, subjects: Array<{ __typename?: 'Subject', name: string, colour?: Colour | null }>, programmeStages: Array<{ __typename?: 'ProgrammeStage', name: string }>, staff: Array<{ __typename?: 'Person', type?: PartyPersonType | null, firstName?: string | null, lastName?: string | null, title?: { __typename?: 'PersonalTitle', id: number, nameTextId: number, name: string } | null }>, irePP?: { __typename?: 'SubjectGroupIrePP', level?: StudyLevel | null } | null, studentMembers?: { __typename?: 'Group', memberCount: number } | null }> }> | null };

export type Core_UpdateClassGroupsMutationVariables = Exact<{
  input?: InputMaybe<Array<UpdateClassGroupGroupInput> | UpdateClassGroupGroupInput>;
}>;


export type Core_UpdateClassGroupsMutation = { __typename?: 'Mutation', core_updateClassGroups?: { __typename?: 'Success', success?: boolean | null } | null };

export type CustomGroupsListQueryVariables = Exact<{
  filter: GeneralGroupFilter;
}>;


export type CustomGroupsListQuery = { __typename?: 'Query', generalGroups?: Array<{ __typename?: 'GeneralGroup', partyId: number, name: string, avatarUrl?: string | null, studentMembers?: { __typename?: 'Group', memberCount: number } | null, staffMembers?: { __typename?: 'Group', memberCount: number } | null, contactMembers?: { __typename?: 'Group', memberCount: number } | null }> | null };

export type CustomGroupByIdQueryVariables = Exact<{
  filter: GeneralGroupFilter;
}>;


export type CustomGroupByIdQuery = { __typename?: 'Query', generalGroups?: Array<{ __typename?: 'GeneralGroup', partyId: number, name: string, students: Array<{ __typename?: 'Student', person: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null } }>, staff: Array<{ __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null }>, contacts: Array<{ __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null }> }> | null };

export type Calendar_CalendarEventsIteratorQueryVariables = Exact<{
  filter: CalendarEventIteratorFilter;
}>;


export type Calendar_CalendarEventsIteratorQuery = { __typename?: 'Query', calendar_calendarEventsIterator?: { __typename?: 'CalendarEvent', eventId: number, calendarIds: Array<number | null>, startTime: string, endTime: string, type: CalendarEventType, attendees: Array<{ __typename?: 'CalendarEventAttendee', partyId: number, type: CalendarEventAttendeeType, partyInfo?: { __typename?: 'GeneralGroup', partyId: number } | { __typename?: 'ProgrammeStageEnrollment', partyId: number } | { __typename?: 'Staff', partyId: number, person: { __typename?: 'Person', firstName?: string | null, lastName?: string | null, avatarUrl?: string | null } } | { __typename?: 'Student', partyId: number } | { __typename?: 'StudentContact', partyId: number } | { __typename?: 'SubjectGroup', partyId: number } | { __typename?: 'YearGroupEnrollment', partyId: number } | null }>, rooms: Array<{ __typename?: 'Room', name: string }>, extensions?: { __typename?: 'CalendarEventExtension', eventAttendance?: Array<{ __typename?: 'EventAttendance', eventId: number, attendanceCodeId: number, personPartyId: number } | null> | null } | null } | null };

export type SubjectGroupsQueryVariables = Exact<{ [key: string]: never; }>;


export type SubjectGroupsQuery = { __typename?: 'Query', subjectGroups?: Array<{ __typename?: 'SubjectGroup', partyId: number, name: string, avatarUrl?: string | null, subjects: Array<{ __typename?: 'Subject', name: string, colour?: Colour | null }>, studentMembers?: { __typename?: 'Group', memberCount: number } | null, staff: Array<{ __typename?: 'Person', firstName?: string | null, lastName?: string | null, avatarUrl?: string | null }>, irePP?: { __typename?: 'SubjectGroupIrePP', level?: StudyLevel | null } | null, programmeStages: Array<{ __typename?: 'ProgrammeStage', programme?: { __typename?: 'Programme', name: string } | null }>, yearGroups: Array<{ __typename?: 'YearGroupEnrollment', name: string }> }> | null };

export type SubjectGroupByIdQueryVariables = Exact<{
  filter: SubjectGroupFilter;
}>;


export type SubjectGroupByIdQuery = { __typename?: 'Query', subjectGroups?: Array<{ __typename?: 'SubjectGroup', partyId: number, name: string, avatarUrl?: string | null, yearGroups: Array<{ __typename?: 'YearGroupEnrollment', name: string }>, subjects: Array<{ __typename?: 'Subject', name: string, colour?: Colour | null }>, staff: Array<{ __typename?: 'Person', firstName?: string | null, lastName?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null }>, students: Array<{ __typename?: 'Student', partyId: number, classGroup?: { __typename?: 'GeneralGroup', name: string } | null, person: { __typename?: 'Person', firstName?: string | null, lastName?: string | null, avatarUrl?: string | null } }> }> | null };

export type Core_UpdateSubjectGroupsMutationVariables = Exact<{
  input?: InputMaybe<Array<UpdateSubjectGroupInput> | UpdateSubjectGroupInput>;
}>;


export type Core_UpdateSubjectGroupsMutation = { __typename?: 'Mutation', core_updateSubjectGroups?: { __typename?: 'Success', success?: boolean | null } | null };

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


export type Communications_LabelQuery = { __typename?: 'Query', communications_label?: Array<{ __typename?: 'Label', id: number, name: string, personPartyId: number, colour?: Colour | null, custom?: boolean | null } | null> | null };

export type Update_Communications_LabelMutationVariables = Exact<{
  input?: InputMaybe<LabelInput>;
}>;


export type Update_Communications_LabelMutation = { __typename?: 'Mutation', communications_saveLabel?: { __typename?: 'Label', id: number, name: string, personPartyId: number, colour?: Colour | null, custom?: boolean | null } | null };

export type Communications_UnreadCountQueryVariables = Exact<{
  filter?: InputMaybe<UnreadCountFilter>;
}>;


export type Communications_UnreadCountQuery = { __typename?: 'Query', communications_unreadCount?: Array<{ __typename?: 'UnreadCount', labelId: number, count: number } | null> | null };

export type Communications_AssignLabelMutationVariables = Exact<{
  input?: InputMaybe<AssignLabelInput>;
}>;


export type Communications_AssignLabelMutation = { __typename?: 'Mutation', communications_assignLabel?: { __typename?: 'Mail', id: number, rootMailId: number, threadId: number, subject: string, body?: string | null, senderPartyId: number, sentOn: string, latestMessage?: string | null, canReply: boolean, starred?: boolean | null, readOn?: string | null, recipients?: Array<{ __typename?: 'Recipient', id: number, recipientPartyId: number, recipientType: RecipientType, name?: string | null } | null> | null, labels?: Array<{ __typename?: 'Label', id: number, name: string, personPartyId: number, colour?: Colour | null, custom?: boolean | null } | null> | null, threads?: Array<{ __typename?: 'Mail', id: number, rootMailId: number, threadId: number, subject: string, body?: string | null, senderPartyId: number, sentOn: string, latestMessage?: string | null, canReply: boolean, starred?: boolean | null, readOn?: string | null, recipients?: Array<{ __typename?: 'Recipient', id: number, recipientPartyId: number, recipientType: RecipientType, name?: string | null } | null> | null, labels?: Array<{ __typename?: 'Label', id: number, name: string, personPartyId: number, colour?: Colour | null, custom?: boolean | null } | null> | null } | null> | null } | null };

export type Communications_MailQueryVariables = Exact<{
  filter?: InputMaybe<MailFilter>;
}>;


export type Communications_MailQuery = { __typename?: 'Query', communications_mail?: Array<{ __typename?: 'Mail', id: number, rootMailId: number, threadId: number, subject: string, body?: string | null, senderPartyId: number, sentOn: string, latestMessage?: string | null, canReply: boolean, starred?: boolean | null, readOn?: string | null, recipients?: Array<{ __typename?: 'Recipient', id: number, recipientPartyId: number, recipientType: RecipientType, name?: string | null } | null> | null, labels?: Array<{ __typename?: 'Label', id: number, name: string, personPartyId: number, colour?: Colour | null, custom?: boolean | null } | null> | null, threads?: Array<{ __typename?: 'Mail', id: number, rootMailId: number, threadId: number, subject: string, body?: string | null, senderPartyId: number, sentOn: string, latestMessage?: string | null, canReply: boolean, starred?: boolean | null, readOn?: string | null, recipients?: Array<{ __typename?: 'Recipient', id: number, recipientPartyId: number, recipientType: RecipientType, name?: string | null } | null> | null, labels?: Array<{ __typename?: 'Label', id: number, name: string, personPartyId: number, colour?: Colour | null, custom?: boolean | null } | null> | null } | null> | null } | null> | null };

export type Communications_SendMailMutationVariables = Exact<{
  input?: InputMaybe<SendMailInput>;
}>;


export type Communications_SendMailMutation = { __typename?: 'Mutation', communications_sendMail?: { __typename?: 'Mail', id: number, rootMailId: number, threadId: number, subject: string, body?: string | null, senderPartyId: number, sentOn: string, latestMessage?: string | null, canReply: boolean, starred?: boolean | null, readOn?: string | null, recipients?: Array<{ __typename?: 'Recipient', id: number, recipientPartyId: number, recipientType: RecipientType, name?: string | null } | null> | null, labels?: Array<{ __typename?: 'Label', id: number, name: string, personPartyId: number, colour?: Colour | null, custom?: boolean | null } | null> | null, threads?: Array<{ __typename?: 'Mail', id: number, rootMailId: number, threadId: number, subject: string, body?: string | null, senderPartyId: number, sentOn: string, latestMessage?: string | null, canReply: boolean, starred?: boolean | null, readOn?: string | null, recipients?: Array<{ __typename?: 'Recipient', id: number, recipientPartyId: number, recipientType: RecipientType, name?: string | null } | null> | null, labels?: Array<{ __typename?: 'Label', id: number, name: string, personPartyId: number, colour?: Colour | null, custom?: boolean | null } | null> | null } | null> | null } | null };

export type Communications_StarredMutationVariables = Exact<{
  input?: InputMaybe<MailStarredInput>;
}>;


export type Communications_StarredMutation = { __typename?: 'Mutation', communications_starred?: string | null };

export type Communications_ReadMutationVariables = Exact<{
  input?: InputMaybe<MailReadInput>;
}>;


export type Communications_ReadMutation = { __typename?: 'Mutation', communications_read?: string | null };

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

export type Core_Staff_PersonalQueryVariables = Exact<{
  filter?: InputMaybe<StaffFilter>;
}>;


export type Core_Staff_PersonalQuery = { __typename?: 'Query', core_staff: Array<{ __typename?: 'Staff', partyId: number, startDate?: string | null, endDate?: string | null, payrollNumber?: string | null, displayCode?: string | null, carRegistrationNumber?: string | null, makeAndModel?: string | null, parking?: string | null, jobSharing?: boolean | null, qualifications?: string | null, competencies?: Array<number | null> | null, availableForTeaching: boolean, availableForSubstitution: boolean, availableForSupportClasses: boolean, position?: string | null, person: { __typename?: 'Person', firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null }, personalInformation?: { __typename?: 'PersonalInformation', gender?: Gender | null, dateOfBirth?: string | null, ire?: { __typename?: 'PersonalInformationIre', ppsNumber?: string | null } | null, primaryAddress?: { __typename?: 'Address', id?: number | null, line1?: string | null, line2?: string | null, line3?: string | null, city?: string | null, country?: string | null, postCode?: string | null } | null, primaryPhoneNumber?: { __typename?: 'PhoneNumber', phoneNumberId?: number | null, number?: string | null, areaCode?: string | null, countryCode?: string | null } | null, phoneNumbers?: Array<{ __typename?: 'PhoneNumber', phoneNumberId?: number | null, primaryPhoneNumber?: boolean | null, number?: string | null, areaCode?: string | null, countryCode?: string | null } | null> | null, primaryEmail?: { __typename?: 'EmailAddress', emailId?: number | null, email?: string | null } | null, emails?: Array<{ __typename?: 'EmailAddress', emailId?: number | null, email?: string | null, primaryEmail?: boolean | null } | null> | null, nextOfKin?: { __typename?: 'NextOfKin', firstName?: string | null, lastName?: string | null, phoneNumbers?: Array<string | null> | null } | null } | null, staffIre?: { __typename?: 'StaffIre', teacherCouncilNumber?: string | null, staffPost?: { __typename?: 'StaffPost', id: number, name: string } | null } | null, employmentCapacity?: { __typename?: 'StaffCapacity', id: string, name: string } | null, emergencyContact?: { __typename?: 'StaffEmergencyContact', firstName?: string | null, lastName?: string | null, primaryNumber?: string | null, additionalNumber?: string | null } | null, competencySubjects: Array<{ __typename?: 'Subject', id: number, name: string, colour?: Colour | null }> }> };

export type Catalogue_StaffPostsQueryVariables = Exact<{ [key: string]: never; }>;


export type Catalogue_StaffPostsQuery = { __typename?: 'Query', catalogue_staffPosts: Array<{ __typename?: 'StaffPost', id: number, name: string }> };

export type Core_Staff_SubjectGroupsQueryVariables = Exact<{
  filter?: InputMaybe<StaffFilter>;
}>;


export type Core_Staff_SubjectGroupsQuery = { __typename?: 'Query', core_staff: Array<{ __typename?: 'Staff', subjectGroups: Array<{ __typename?: 'SubjectGroup', partyId: number, name: string, avatarUrl?: string | null, subjects: Array<{ __typename?: 'Subject', name: string, colour?: Colour | null }>, irePP?: { __typename?: 'SubjectGroupIrePP', level?: StudyLevel | null } | null, studentMembers?: { __typename?: 'Group', memberCount: number } | null }> }> };

export type Core_UpsertStaffMutationVariables = Exact<{
  input?: InputMaybe<Array<InputMaybe<UpsertStaffInput>> | InputMaybe<UpsertStaffInput>>;
}>;


export type Core_UpsertStaffMutation = { __typename?: 'Mutation', core_upsertStaff?: Array<{ __typename?: 'Staff', partyId: number } | null> | null };

export type Enrollment_Ire_ChangeProgrammeStageMutationVariables = Exact<{
  input: Array<EnrollmentIre_ChangeProgrammeStage> | EnrollmentIre_ChangeProgrammeStage;
}>;


export type Enrollment_Ire_ChangeProgrammeStageMutation = { __typename?: 'Mutation', enrollment_ire_changeProgrammeStage: { __typename?: 'Success', success?: boolean | null } };

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


export type Core_Student_PersonalQuery = { __typename?: 'Query', core_students: Array<{ __typename?: 'Student', partyId: number, startDate?: string | null, leftEarly?: boolean | null, endDate?: string | null, guardianshipNote?: string | null, person: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null }, personalInformation?: { __typename?: 'PersonalInformation', firstName: string, lastName: string, preferredFirstName?: string | null, preferredLastName?: string | null, middleName?: string | null, gender?: Gender | null, dateOfBirth?: string | null, birthCertFirstName?: string | null, birthCertLastName?: string | null, nationality?: string | null, mothersMaidenName?: string | null, ire?: { __typename?: 'PersonalInformationIre', ppsNumber?: string | null, religion?: string | null, countryOfBirth?: string | null } | null, primaryAddress?: { __typename?: 'Address', line1?: string | null, line2?: string | null, line3?: string | null, city?: string | null, country?: string | null, postCode?: string | null } | null, addresses?: Array<{ __typename?: 'Address', line1?: string | null, line2?: string | null, line3?: string | null, city?: string | null, country?: string | null, postCode?: string | null, primaryAddress?: boolean | null } | null> | null, primaryPhoneNumber?: { __typename?: 'PhoneNumber', number?: string | null, areaCode?: string | null, countryCode?: string | null } | null, primaryEmail?: { __typename?: 'EmailAddress', email?: string | null } | null } | null, studentIrePP?: { __typename?: 'StudentIrePP', medicalCard?: boolean | null, travellerHeritage?: boolean | null, languageSupportApplicant?: boolean | null, borderIndicator?: boolean | null, examNumber?: string | null, lockerNumber?: string | null, previousSchoolRollNumber?: string | null, dpin?: number | null, examEntrant?: boolean | null, repeatYear?: boolean | null, boardingDays?: string | null, shortTermPupil?: boolean | null, shortTermPupilNumWeeks?: number | null, reasonForLeaving?: string | null, destinationRollNo?: string | null, previousSchoolName?: string | null, previousSchoolType?: string | null } | null, classGroup?: { __typename?: 'GeneralGroup', name: string } | null, tutors: Array<{ __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null }>, yearGroupLeads: Array<{ __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null }>, yearGroups: Array<{ __typename?: 'YearGroupEnrollment', name: string }>, programmeStages?: Array<{ __typename?: 'ProgrammeStage', name: string, programme?: { __typename?: 'Programme', name: string } | null }> | null, siblings?: { __typename?: 'Core_Siblings', enrolledSiblings: Array<{ __typename?: 'Student', partyId: number, person: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, title?: { __typename?: 'PersonalTitle', id: number, nameTextId: number, name: string } | null }, classGroup?: { __typename?: 'GeneralGroup', name: string } | null }>, nonEnrolledSiblings: Array<{ __typename?: 'Core_NonEnrolledSibling', partyId: number, firstName?: string | null, lastName?: string | null }> } | null }> };

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


export type Core_StudentsInfoForSelectQuery = { __typename?: 'Query', core_students: Array<{ __typename?: 'Student', person: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null } }> };

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

export type SavePermissionGroupMutationVariables = Exact<{
  input?: InputMaybe<SavePermissionGroup>;
}>;


export type SavePermissionGroupMutation = { __typename?: 'Mutation', users_savePermissionGroup?: { __typename?: 'PermissionGroup', id: number } | null };

export type Users_PermissionGroupsQueryVariables = Exact<{
  filter: PermissionGroupFilter;
}>;


export type Users_PermissionGroupsQuery = { __typename?: 'Query', users_permissionGroups?: Array<{ __typename?: 'PermissionGroup', id: number, name: string, description: string, memberType: MemberType, memberPartyIds: Array<number>, custom?: boolean | null, permissionSets: Array<{ __typename?: 'PermissionGroupPermissionSet', id: number, toggle?: boolean | null, permissionType?: PermissionType | null, feature?: Feature | null }> } | null> | null };

export type Users_PermissionSetsQueryVariables = Exact<{
  filter: PermissionSetFilter;
}>;


export type Users_PermissionSetsQuery = { __typename?: 'Query', users_permissionSets?: Array<{ __typename?: 'PermissionSet', id: number, name: string, description: string, permissionType?: PermissionType | null, toggle?: boolean | null, feature?: Feature | null } | null> | null };

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

export type SendSmsMutationVariables = Exact<{
  input?: InputMaybe<SendSmsInput>;
}>;


export type SendSmsMutation = { __typename?: 'Mutation', communications_sendSms?: string | null };

export type Communications_SmsQueryVariables = Exact<{
  filter?: InputMaybe<SmsFilter>;
}>;


export type Communications_SmsQuery = { __typename?: 'Query', communications_sms?: Array<{ __typename?: 'Sms', id: number, name: string, body: string, sentOn: string, canReply: boolean, numRecipients: number, totalCost: number, sender: { __typename?: 'Person', firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null }, recipients: Array<{ __typename?: 'SmsRecipient', recipientPhoneNumber: string, smsStatus: SmsStatus, id?: { __typename?: 'SmsRecipientId', tenant: number, smsId: number, recipientPartyId: number } | null, recipient?: { __typename?: 'Person', firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null } | null }> } | null> | null };

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

export type Swm_AbsenceTypesQueryVariables = Exact<{
  filter?: InputMaybe<Swm_StaffAbsenceTypeFilter>;
}>;


export type Swm_AbsenceTypesQuery = { __typename?: 'Query', swm_absenceTypes: Array<{ __typename?: 'SWM_StaffAbsenceType', absenceTypeId: number, name: string, nameTextId?: number | null, description?: string | null, descriptionTextId?: number | null, code: string, availableForRequests: boolean }> };

export type Swm_AbsencesQueryVariables = Exact<{
  filter?: InputMaybe<Swm_StaffAbsenceFilter>;
}>;


export type Swm_AbsencesQuery = { __typename?: 'Query', swm_absences: Array<{ __typename?: 'SWM_StaffAbsence', absenceId: number, staffPartyId: number, absenceReasonText?: string | null, substitutionRequired?: boolean | null, absenceType: { __typename?: 'SWM_StaffAbsenceType', name: string, code: string }, staff?: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null } | null, dates: Array<{ __typename?: 'SWM_StaffAbsenceDate', continuousStartDate?: string | null, continuousEndDate?: string | null, individualDates?: Array<string> | null, partialAbsence: boolean, leavesAt?: string | null, returnsAt?: string | null }> }> };

export type Swm_UpsertAbsenceMutationVariables = Exact<{
  input: Array<Swm_UpsertStaffAbsence> | Swm_UpsertStaffAbsence;
}>;


export type Swm_UpsertAbsenceMutation = { __typename?: 'Mutation', swm_upsertAbsence: Array<{ __typename?: 'SWM_StaffAbsence', staffPartyId: number, absenceTypeId: number, fromAbsenceRequestId?: number | null, absenceReasonText?: string | null }> };

export type Swm_DeleteAbsenceMutationVariables = Exact<{
  input: Array<Scalars['Int']> | Scalars['Int'];
}>;


export type Swm_DeleteAbsenceMutation = { __typename?: 'Mutation', swm_deleteAbsence: { __typename?: 'Success', success?: boolean | null } };

export type Tt_TimetablesQueryVariables = Exact<{
  filter?: InputMaybe<TtTimetableFilter>;
}>;


export type Tt_TimetablesQuery = { __typename?: 'Query', tt_timetables: Array<{ __typename?: 'TTTimetable', timetableId: number, name: string, liveStatus?: { __typename?: 'TT_LiveStatus', totalChanges: number, lessonChanges: number, timetableGroupChanges: number, lastPublishedDate?: string | null } | null }> };

export type Tt_SwapTeacherOptionsQueryVariables = Exact<{
  filter: TtSwapTeacherFilter;
}>;


export type Tt_SwapTeacherOptionsQuery = { __typename?: 'Query', tt_swapTeacherOptions: { __typename?: 'TTSwapTeacherOptions', timeslots: Array<{ __typename?: 'TTTimeslot', id: { __typename?: 'TTTimeslotId', gridIdx: number, dayIdx: number, periodIdx: number }, info: { __typename?: 'TTTimeslotInfo', dayOfWeek: number, startTime: string, endTime: string } }>, teachers: Array<{ __typename?: 'TTSwapTeacherTeacherInfo', staffId: number, teacher: { __typename?: 'Staff', person: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, nameTextId: number, name: string } | null } }, lessonOnTimeslots: Array<{ __typename?: 'TTIndividualViewLesson', id: { __typename?: 'TTIndividualViewLessonId', lessonIdx: number, lessonInstanceIdx: number, timetableGroupId: number }, partyGroup: { __typename?: 'GeneralGroup', name: string } | { __typename?: 'ProgrammeStageEnrollment', name: string } | { __typename?: 'SubjectGroup', name: string } | { __typename?: 'YearGroupEnrollment', name: string } } | null> }> } };

export type Tt_SwapRoomOptionsQueryVariables = Exact<{
  filter: TtSwapRoomFilter;
}>;


export type Tt_SwapRoomOptionsQuery = { __typename?: 'Query', tt_swapRoomOptions: { __typename?: 'TTSwapRoomOptions', timeslots: Array<{ __typename?: 'TTTimeslot', id: { __typename?: 'TTTimeslotId', gridIdx: number, dayIdx: number, periodIdx: number }, info: { __typename?: 'TTTimeslotInfo', dayOfWeek: number, startTime: string, endTime: string } }>, rooms: Array<{ __typename?: 'TTSwapRoomRoomInfo', roomId: number, room: { __typename?: 'Room', name: string, capacity?: number | null, description?: string | null, pools: Array<string> }, lessonOnTimeslots: Array<{ __typename?: 'TTIndividualViewLesson', id: { __typename?: 'TTIndividualViewLessonId', lessonIdx: number, lessonInstanceIdx: number, timetableGroupId: number }, partyGroup: { __typename?: 'GeneralGroup', name: string } | { __typename?: 'ProgrammeStageEnrollment', name: string } | { __typename?: 'SubjectGroup', name: string } | { __typename?: 'YearGroupEnrollment', name: string } } | null> }> } };

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


export type Tt_GroupsQuery = { __typename?: 'Query', tt_groups: Array<{ __typename?: 'TT_Groups', partyGroup: { __typename: 'GeneralGroup', name: string, partyId: number, avatarUrl?: string | null } | { __typename: 'ProgrammeStageEnrollment', name: string, partyId: number, avatarUrl?: string | null } | { __typename: 'SubjectGroup', name: string, partyId: number, avatarUrl?: string | null, yearGroups: Array<{ __typename?: 'YearGroupEnrollment', name: string }>, subjects: Array<{ __typename?: 'Subject', colour?: Colour | null }>, studentMembershipType?: { __typename?: 'SubjectGroupStudentMembershipType', type: SubjectGroupStudentMembershipTypeEnum, classGroupId?: number | null, blockId?: string | null, classGroupName?: string | null } | null } | { __typename: 'YearGroupEnrollment', name: string, partyId: number, avatarUrl?: string | null }, teachers: Array<{ __typename?: 'Staff', person: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, nameTextId: number, name: string } | null } }>, lessons: Array<{ __typename?: 'TTIndividualViewLesson', spread: number, id: { __typename?: 'TTIndividualViewLessonId', lessonIdx: number, lessonInstanceIdx: number, timetableGroupId: number }, timeslotId?: { __typename?: 'TTTimeslotId', gridIdx: number, dayIdx: number, periodIdx: number } | null, timeslotInfo?: { __typename?: 'TTTimeslotInfo', startTime: string, endTime: string } | null, partyGroup: { __typename: 'GeneralGroup', partyId: number, name: string, avatarUrl?: string | null } | { __typename: 'ProgrammeStageEnrollment', partyId: number, name: string, avatarUrl?: string | null } | { __typename: 'SubjectGroup', partyId: number, name: string, avatarUrl?: string | null, subjects: Array<{ __typename?: 'Subject', name: string, colour?: Colour | null }> } | { __typename: 'YearGroupEnrollment', partyId: number, name: string, avatarUrl?: string | null }, room?: { __typename?: 'Room', roomId: number, name: string } | null, teachers: Array<{ __typename?: 'Staff', person: { __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null, title?: { __typename?: 'PersonalTitle', id: number, name: string, nameTextId: number } | null } }> }> }> };

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

export type Admin__Party_PeopleQueryVariables = Exact<{
  tenant: Scalars['Int'];
}>;


export type Admin__Party_PeopleQuery = { __typename?: 'Query', admin__party_people?: Array<{ __typename?: 'Person', partyId: number, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null, type?: PartyPersonType | null }> | null };

export type Admin__TenantsQueryVariables = Exact<{ [key: string]: never; }>;


export type Admin__TenantsQuery = { __typename?: 'Query', admin__tenants?: Array<{ __typename?: 'Tenant', tenant: number, name: string, imgUrl?: string | null } | null> | null };

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
export const Attendance_AttendanceCodesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"attendance_attendanceCodes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AttendanceCodeFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attendance_attendanceCodes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"visibleForTeacher"}},{"kind":"Field","name":{"kind":"Name","value":"visibleForContact"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}},{"kind":"Field","name":{"kind":"Name","value":"codeType"}}]}}]}}]} as unknown as DocumentNode<Attendance_AttendanceCodesQuery, Attendance_AttendanceCodesQueryVariables>;
export const Attendance_SaveAttendanceCodeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"attendance_saveAttendanceCode"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SaveAttendanceCodeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attendance_saveAttendanceCode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<Attendance_SaveAttendanceCodeMutation, Attendance_SaveAttendanceCodeMutationVariables>;
export const Attendance_SaveEventAttendanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"attendance_saveEventAttendance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SaveEventAttendanceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attendance_saveEventAttendance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"attendanceCodeId"}},{"kind":"Field","name":{"kind":"Name","value":"personPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"date"}}]}}]}}]} as unknown as DocumentNode<Attendance_SaveEventAttendanceMutation, Attendance_SaveEventAttendanceMutationVariables>;
export const Calendar_FindFreeResourcesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"calendar_findFreeResources"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FindFreeResourcesFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendar_findFreeResources"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"freeRooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"clashingRooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"room"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<Calendar_FindFreeResourcesQuery, Calendar_FindFreeResourcesQueryVariables>;
export const Calendar_CreateCalendarEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"calendar_createCalendarEvents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCalendarEventsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendar_createCalendarEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventId"}}]}}]}}]} as unknown as DocumentNode<Calendar_CreateCalendarEventsMutation, Calendar_CreateCalendarEventsMutationVariables>;
export const CalendarSearchQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"calendarSearchQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"search_search"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]} as unknown as DocumentNode<CalendarSearchQueryQuery, CalendarSearchQueryQueryVariables>;
export const Calendar_CalendarEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"calendar_calendarEvents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarEventFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendar_calendarEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resources"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PartyCalendar"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"partyInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PartyGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PartyPerson"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RoomCalendar"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"room"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"calendarIds"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"allDayEvent"}},{"kind":"Field","name":{"kind":"Name","value":"lessonInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subjectGroupId"}},{"kind":"Field","name":{"kind":"Name","value":"lessonId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"exclusions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"attendees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"partyInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PartyGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PartyPerson"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"rooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<Calendar_CalendarEventsQuery, Calendar_CalendarEventsQueryVariables>;
export const Calendar_PartyTimetableDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"calendar_partyTimetable"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarEventFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendar_calendarEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resources"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"attendees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"partyInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Staff"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SubjectGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"rooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<Calendar_PartyTimetableQuery, Calendar_PartyTimetableQueryVariables>;
export const TimetableInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"timetableInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarDayInfoFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendar_dayInfo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"dayType"}},{"kind":"Field","name":{"kind":"Name","value":"periods"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<TimetableInfoQuery, TimetableInfoQueryVariables>;
export const Core_BlocksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"core_blocks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"BlockFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_blocks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"blockId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"subjectGroupNamesJoined"}},{"kind":"Field","name":{"kind":"Name","value":"isRotation"}},{"kind":"Field","name":{"kind":"Name","value":"rotations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"iteration"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}}]}}]}}]}}]} as unknown as DocumentNode<Core_BlocksQuery, Core_BlocksQueryVariables>;
export const Enrollment_Ire_BlockMembershipsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"enrollment_ire_blockMemberships"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EnrollmentIre_BlockEnrollmentFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enrollment_ire_blockMemberships"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"blockId"}},{"kind":"Field","name":{"kind":"Name","value":"block"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"blockId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"classGroupIds"}},{"kind":"Field","name":{"kind":"Name","value":"subjectGroupIds"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isRotation"}},{"kind":"Field","name":{"kind":"Name","value":"groups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rotationIteration"}},{"kind":"Field","name":{"kind":"Name","value":"unenrolledStudents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isDuplicate"}},{"kind":"Field","name":{"kind":"Name","value":"classGroupName"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"subjectGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"students"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isDuplicate"}},{"kind":"Field","name":{"kind":"Name","value":"classGroupName"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"staff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<Enrollment_Ire_BlockMembershipsQuery, Enrollment_Ire_BlockMembershipsQueryVariables>;
export const Enrollment_Ire_UpsertBlockMembershipsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"enrollment_ire_upsertBlockMemberships"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EnrollmentIre_UpsertBlockMembership"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enrollment_ire_upsertBlockMemberships"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"blockId"}}]}}]}}]} as unknown as DocumentNode<Enrollment_Ire_UpsertBlockMembershipsMutation, Enrollment_Ire_UpsertBlockMembershipsMutationVariables>;
export const Enrollment_Ire_CoreMembershipsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"enrollment_ire_coreMemberships"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EnrollmentIre_CoreEnrollmentFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enrollment_ire_coreMemberships"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"yearGroupEnrollment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"yearGroupId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unenrolledStudents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"personalInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gender"}}]}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"classGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"students"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"personalInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gender"}}]}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"staff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]}}]} as unknown as DocumentNode<Enrollment_Ire_CoreMembershipsQuery, Enrollment_Ire_CoreMembershipsQueryVariables>;
export const Enrollment_Ire_UpsertCoreMembershipsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"enrollment_ire_upsertCoreMemberships"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EnrollmentIre_UpsertCoreMembership"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enrollment_ire_upsertCoreMemberships"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"yearGroupEnrollment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"yearGroupId"}}]}}]}}]}}]} as unknown as DocumentNode<Enrollment_Ire_UpsertCoreMembershipsMutation, Enrollment_Ire_UpsertCoreMembershipsMutationVariables>;
export const ClassGroupsListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"classGroupsList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GeneralGroupFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"generalGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"studentMembers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"memberCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"generalGroupType"}},{"kind":"Field","name":{"kind":"Name","value":"programmeStages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"programme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"tutors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"yearGroupLeads"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"yearGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"yearGroupId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<ClassGroupsListQuery, ClassGroupsListQueryVariables>;
export const ClassGroupsByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"classGroupsById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GeneralGroupFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"generalGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"students"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"relatedSubjectGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"studentMembershipType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}}]}},{"kind":"Field","name":{"kind":"Name","value":"programmeStages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"staff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"irePP"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"level"}}]}},{"kind":"Field","name":{"kind":"Name","value":"studentMembers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"memberCount"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ClassGroupsByIdQuery, ClassGroupsByIdQueryVariables>;
export const Core_UpdateClassGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"core_updateClassGroups"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateClassGroupGroupInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_updateClassGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<Core_UpdateClassGroupsMutation, Core_UpdateClassGroupsMutationVariables>;
export const CustomGroupsListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"customGroupsList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GeneralGroupFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"generalGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"studentMembers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"memberCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"staffMembers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"memberCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"contactMembers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"memberCount"}}]}}]}}]}}]} as unknown as DocumentNode<CustomGroupsListQuery, CustomGroupsListQueryVariables>;
export const CustomGroupByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"customGroupById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GeneralGroupFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"generalGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"students"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"staff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"contacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<CustomGroupByIdQuery, CustomGroupByIdQueryVariables>;
export const Calendar_CalendarEventsIteratorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"calendar_calendarEventsIterator"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarEventIteratorFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendar_calendarEventsIterator"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"calendarIds"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"attendees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"partyInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Staff"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"rooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"extensions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventAttendance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"attendanceCodeId"}},{"kind":"Field","name":{"kind":"Name","value":"personPartyId"}}]}}]}}]}}]}}]} as unknown as DocumentNode<Calendar_CalendarEventsIteratorQuery, Calendar_CalendarEventsIteratorQueryVariables>;
export const SubjectGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"subjectGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subjectGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"subjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}}]}},{"kind":"Field","name":{"kind":"Name","value":"studentMembers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"memberCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"staff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"irePP"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"level"}}]}},{"kind":"Field","name":{"kind":"Name","value":"programmeStages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"programme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"yearGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<SubjectGroupsQuery, SubjectGroupsQueryVariables>;
export const SubjectGroupByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"subjectGroupById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SubjectGroupFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subjectGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"yearGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}}]}},{"kind":"Field","name":{"kind":"Name","value":"staff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"students"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"classGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}}]}}]} as unknown as DocumentNode<SubjectGroupByIdQuery, SubjectGroupByIdQueryVariables>;
export const Core_UpdateSubjectGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"core_updateSubjectGroups"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateSubjectGroupInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_updateSubjectGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<Core_UpdateSubjectGroupsMutation, Core_UpdateSubjectGroupsMutationVariables>;
export const YearGroupsListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"yearGroupsList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"YearGroupEnrollmentFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_yearGroupEnrollments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"yearGroupEnrollmentPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nationalCode"}},{"kind":"Field","name":{"kind":"Name","value":"yearGroupId"}},{"kind":"Field","name":{"kind":"Name","value":"shortName"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"yearGroupLeads"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"studentMembers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"memberCount"}}]}}]}}]}}]} as unknown as DocumentNode<YearGroupsListQuery, YearGroupsListQueryVariables>;
export const YearGroupByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"yearGroupById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"YearGroupEnrollmentFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_yearGroupEnrollments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"yearGroupEnrollmentPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"students"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"classGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tutors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]}}]} as unknown as DocumentNode<YearGroupByIdQuery, YearGroupByIdQueryVariables>;
export const Core_UpdateYearGroupEnrollmentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"core_updateYearGroupEnrollments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateYearGroupEnrollmentInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_updateYearGroupEnrollments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<Core_UpdateYearGroupEnrollmentsMutation, Core_UpdateYearGroupEnrollmentsMutationVariables>;
export const Communications_LabelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"communications_label"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"LabelFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communications_label"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"personPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}},{"kind":"Field","name":{"kind":"Name","value":"custom"}}]}}]}}]} as unknown as DocumentNode<Communications_LabelQuery, Communications_LabelQueryVariables>;
export const Update_Communications_LabelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"update_communications_label"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"LabelInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communications_saveLabel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"personPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}},{"kind":"Field","name":{"kind":"Name","value":"custom"}}]}}]}}]} as unknown as DocumentNode<Update_Communications_LabelMutation, Update_Communications_LabelMutationVariables>;
export const Communications_UnreadCountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"communications_unreadCount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UnreadCountFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communications_unreadCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"labelId"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]} as unknown as DocumentNode<Communications_UnreadCountQuery, Communications_UnreadCountQueryVariables>;
export const Communications_AssignLabelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"communications_assignLabel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AssignLabelInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communications_assignLabel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rootMailId"}},{"kind":"Field","name":{"kind":"Name","value":"threadId"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"senderPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"sentOn"}},{"kind":"Field","name":{"kind":"Name","value":"latestMessage"}},{"kind":"Field","name":{"kind":"Name","value":"canReply"}},{"kind":"Field","name":{"kind":"Name","value":"starred"}},{"kind":"Field","name":{"kind":"Name","value":"readOn"}},{"kind":"Field","name":{"kind":"Name","value":"recipients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"recipientPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"recipientType"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"personPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}},{"kind":"Field","name":{"kind":"Name","value":"custom"}}]}},{"kind":"Field","name":{"kind":"Name","value":"threads"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rootMailId"}},{"kind":"Field","name":{"kind":"Name","value":"threadId"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"senderPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"sentOn"}},{"kind":"Field","name":{"kind":"Name","value":"latestMessage"}},{"kind":"Field","name":{"kind":"Name","value":"canReply"}},{"kind":"Field","name":{"kind":"Name","value":"starred"}},{"kind":"Field","name":{"kind":"Name","value":"readOn"}},{"kind":"Field","name":{"kind":"Name","value":"recipients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"recipientPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"recipientType"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"personPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}},{"kind":"Field","name":{"kind":"Name","value":"custom"}}]}}]}}]}}]}}]} as unknown as DocumentNode<Communications_AssignLabelMutation, Communications_AssignLabelMutationVariables>;
export const Communications_MailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"communications_mail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MailFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communications_mail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rootMailId"}},{"kind":"Field","name":{"kind":"Name","value":"threadId"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"senderPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"sentOn"}},{"kind":"Field","name":{"kind":"Name","value":"latestMessage"}},{"kind":"Field","name":{"kind":"Name","value":"canReply"}},{"kind":"Field","name":{"kind":"Name","value":"starred"}},{"kind":"Field","name":{"kind":"Name","value":"readOn"}},{"kind":"Field","name":{"kind":"Name","value":"recipients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"recipientPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"recipientType"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"personPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}},{"kind":"Field","name":{"kind":"Name","value":"custom"}}]}},{"kind":"Field","name":{"kind":"Name","value":"threads"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rootMailId"}},{"kind":"Field","name":{"kind":"Name","value":"threadId"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"senderPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"sentOn"}},{"kind":"Field","name":{"kind":"Name","value":"latestMessage"}},{"kind":"Field","name":{"kind":"Name","value":"canReply"}},{"kind":"Field","name":{"kind":"Name","value":"starred"}},{"kind":"Field","name":{"kind":"Name","value":"readOn"}},{"kind":"Field","name":{"kind":"Name","value":"recipients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"recipientPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"recipientType"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"personPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}},{"kind":"Field","name":{"kind":"Name","value":"custom"}}]}}]}}]}}]}}]} as unknown as DocumentNode<Communications_MailQuery, Communications_MailQueryVariables>;
export const Communications_SendMailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"communications_sendMail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SendMailInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communications_sendMail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rootMailId"}},{"kind":"Field","name":{"kind":"Name","value":"threadId"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"senderPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"sentOn"}},{"kind":"Field","name":{"kind":"Name","value":"latestMessage"}},{"kind":"Field","name":{"kind":"Name","value":"canReply"}},{"kind":"Field","name":{"kind":"Name","value":"starred"}},{"kind":"Field","name":{"kind":"Name","value":"readOn"}},{"kind":"Field","name":{"kind":"Name","value":"recipients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"recipientPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"recipientType"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"personPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}},{"kind":"Field","name":{"kind":"Name","value":"custom"}}]}},{"kind":"Field","name":{"kind":"Name","value":"threads"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rootMailId"}},{"kind":"Field","name":{"kind":"Name","value":"threadId"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"senderPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"sentOn"}},{"kind":"Field","name":{"kind":"Name","value":"latestMessage"}},{"kind":"Field","name":{"kind":"Name","value":"canReply"}},{"kind":"Field","name":{"kind":"Name","value":"starred"}},{"kind":"Field","name":{"kind":"Name","value":"readOn"}},{"kind":"Field","name":{"kind":"Name","value":"recipients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"recipientPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"recipientType"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"personPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}},{"kind":"Field","name":{"kind":"Name","value":"custom"}}]}}]}}]}}]}}]} as unknown as DocumentNode<Communications_SendMailMutation, Communications_SendMailMutationVariables>;
export const Communications_StarredDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"communications_starred"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MailStarredInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communications_starred"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<Communications_StarredMutation, Communications_StarredMutationVariables>;
export const Communications_ReadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"communications_read"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MailReadInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communications_read"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<Communications_ReadMutation, Communications_ReadMutationVariables>;
export const Catalogue_PersonalTitlesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"catalogue_personalTitles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"catalogue_personalTitles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<Catalogue_PersonalTitlesQuery, Catalogue_PersonalTitlesQueryVariables>;
export const Core_StudentContactsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"core_studentContacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_studentContacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"personalInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"primaryAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"line1"}},{"kind":"Field","name":{"kind":"Name","value":"line2"}},{"kind":"Field","name":{"kind":"Name","value":"line3"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"postCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryPhoneNumber"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryEmail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"relationships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"student"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<Core_StudentContactsQuery, Core_StudentContactsQueryVariables>;
export const Core_StudentContactsForSelectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"core_studentContactsForSelect"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_studentContacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<Core_StudentContactsForSelectQuery, Core_StudentContactsForSelectQueryVariables>;
export const Core_StudentContacts_PersonalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"core_studentContacts_personal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StudentContactFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_studentContacts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"personalInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"preferredFirstName"}},{"kind":"Field","name":{"kind":"Name","value":"middleName"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"ire"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ppsNumber"}},{"kind":"Field","name":{"kind":"Name","value":"religion"}},{"kind":"Field","name":{"kind":"Name","value":"countryOfBirth"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nationality"}},{"kind":"Field","name":{"kind":"Name","value":"mothersMaidenName"}},{"kind":"Field","name":{"kind":"Name","value":"primaryAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"line1"}},{"kind":"Field","name":{"kind":"Name","value":"line2"}},{"kind":"Field","name":{"kind":"Name","value":"line3"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"postCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryPhoneNumber"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"phoneNumberId"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"areaCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"phoneNumberId"}},{"kind":"Field","name":{"kind":"Name","value":"primaryPhoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"areaCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryEmail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emailId"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"occupation"}},{"kind":"Field","name":{"kind":"Name","value":"requiresInterpreter"}},{"kind":"Field","name":{"kind":"Name","value":"spokenLanguages"}},{"kind":"Field","name":{"kind":"Name","value":"relationships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"relationshipType"}},{"kind":"Field","name":{"kind":"Name","value":"studentPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"allowedToContact"}},{"kind":"Field","name":{"kind":"Name","value":"includeInSms"}},{"kind":"Field","name":{"kind":"Name","value":"includeInTmail"}},{"kind":"Field","name":{"kind":"Name","value":"pickupRights"}},{"kind":"Field","name":{"kind":"Name","value":"legalGuardian"}},{"kind":"Field","name":{"kind":"Name","value":"allowAccessToStudentData"}}]}}]}}]}}]} as unknown as DocumentNode<Core_StudentContacts_PersonalQuery, Core_StudentContacts_PersonalQueryVariables>;
export const Core_StudentContacts_StudentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"core_studentContacts_students"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StudentContactFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_studentContacts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"relationships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"relationshipType"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"allowedToContact"}},{"kind":"Field","name":{"kind":"Name","value":"includeInSms"}},{"kind":"Field","name":{"kind":"Name","value":"includeInTmail"}},{"kind":"Field","name":{"kind":"Name","value":"pickupRights"}},{"kind":"Field","name":{"kind":"Name","value":"legalGuardian"}},{"kind":"Field","name":{"kind":"Name","value":"allowAccessToStudentData"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StudentContactRelationshipInfo"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"student"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"classGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Student"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<Core_StudentContacts_StudentsQuery, Core_StudentContacts_StudentsQueryVariables>;
export const Core_UpsertStudentContactDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"core_upsertStudentContact"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpsertStudentContactInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_upsertStudentContact"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}}]}}]}}]} as unknown as DocumentNode<Core_UpsertStudentContactMutation, Core_UpsertStudentContactMutationVariables>;
export const Catalogue_StaffCapacitiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"catalogue_staffCapacities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"catalogue_staffCapacities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<Catalogue_StaffCapacitiesQuery, Catalogue_StaffCapacitiesQueryVariables>;
export const Core_StaffDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"core_staff"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"StaffFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_staff"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"employmentCapacity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"personalInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"primaryPhoneNumber"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryEmail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ire"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ppsNumber"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"staffIre"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teacherCouncilNumber"}},{"kind":"Field","name":{"kind":"Name","value":"staffPost"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"carRegistrationNumber"}},{"kind":"Field","name":{"kind":"Name","value":"parking"}},{"kind":"Field","name":{"kind":"Name","value":"position"}}]}}]}}]} as unknown as DocumentNode<Core_StaffQuery, Core_StaffQueryVariables>;
export const Core_StaffInfoForSelectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"core_staffInfoForSelect"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"StaffFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_staff"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<Core_StaffInfoForSelectQuery, Core_StaffInfoForSelectQueryVariables>;
export const Core_Staff_PersonalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"core_staff_personal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"StaffFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_staff"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"personalInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"ire"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ppsNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"line1"}},{"kind":"Field","name":{"kind":"Name","value":"line2"}},{"kind":"Field","name":{"kind":"Name","value":"line3"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"postCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryPhoneNumber"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"phoneNumberId"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"areaCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"phoneNumberId"}},{"kind":"Field","name":{"kind":"Name","value":"primaryPhoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"areaCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryEmail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emailId"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"emails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emailId"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"primaryEmail"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nextOfKin"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"staffIre"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teacherCouncilNumber"}},{"kind":"Field","name":{"kind":"Name","value":"staffPost"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"payrollNumber"}},{"kind":"Field","name":{"kind":"Name","value":"employmentCapacity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"emergencyContact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"primaryNumber"}},{"kind":"Field","name":{"kind":"Name","value":"additionalNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"displayCode"}},{"kind":"Field","name":{"kind":"Name","value":"carRegistrationNumber"}},{"kind":"Field","name":{"kind":"Name","value":"makeAndModel"}},{"kind":"Field","name":{"kind":"Name","value":"parking"}},{"kind":"Field","name":{"kind":"Name","value":"jobSharing"}},{"kind":"Field","name":{"kind":"Name","value":"qualifications"}},{"kind":"Field","name":{"kind":"Name","value":"competencies"}},{"kind":"Field","name":{"kind":"Name","value":"availableForTeaching"}},{"kind":"Field","name":{"kind":"Name","value":"availableForSubstitution"}},{"kind":"Field","name":{"kind":"Name","value":"availableForSupportClasses"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"competencySubjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}}]}}]}}]}}]} as unknown as DocumentNode<Core_Staff_PersonalQuery, Core_Staff_PersonalQueryVariables>;
export const Catalogue_StaffPostsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"catalogue_staffPosts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"catalogue_staffPosts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<Catalogue_StaffPostsQuery, Catalogue_StaffPostsQueryVariables>;
export const Core_Staff_SubjectGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"core_staff_subjectGroups"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"StaffFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_staff"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subjectGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"subjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}}]}},{"kind":"Field","name":{"kind":"Name","value":"irePP"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"level"}}]}},{"kind":"Field","name":{"kind":"Name","value":"studentMembers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"memberCount"}}]}}]}}]}}]}}]} as unknown as DocumentNode<Core_Staff_SubjectGroupsQuery, Core_Staff_SubjectGroupsQueryVariables>;
export const Core_UpsertStaffDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"core_upsertStaff"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpsertStaffInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_upsertStaff"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}}]}}]}}]} as unknown as DocumentNode<Core_UpsertStaffMutation, Core_UpsertStaffMutationVariables>;
export const Enrollment_Ire_ChangeProgrammeStageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"enrollment_ire_changeProgrammeStage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EnrollmentIre_ChangeProgrammeStage"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enrollment_ire_changeProgrammeStage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<Enrollment_Ire_ChangeProgrammeStageMutation, Enrollment_Ire_ChangeProgrammeStageMutationVariables>;
export const Core_Student_ContactsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"core_student_contacts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StudentFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_students"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"contacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"personalInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"nationality"}},{"kind":"Field","name":{"kind":"Name","value":"primaryAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"line1"}},{"kind":"Field","name":{"kind":"Name","value":"line2"}},{"kind":"Field","name":{"kind":"Name","value":"line3"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"postCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryPhoneNumber"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"areaCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryEmail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"relationships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"relationshipType"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"allowedToContact"}},{"kind":"Field","name":{"kind":"Name","value":"includeInSms"}},{"kind":"Field","name":{"kind":"Name","value":"includeInTmail"}},{"kind":"Field","name":{"kind":"Name","value":"pickupRights"}},{"kind":"Field","name":{"kind":"Name","value":"legalGuardian"}},{"kind":"Field","name":{"kind":"Name","value":"allowAccessToStudentData"}}]}}]}}]}}]}}]} as unknown as DocumentNode<Core_Student_ContactsQuery, Core_Student_ContactsQueryVariables>;
export const Core_Student_SubjectGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"core_student_subjectGroups"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StudentFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_students"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"subjectGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"subjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}}]}},{"kind":"Field","name":{"kind":"Name","value":"staff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"irePP"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"level"}}]}}]}}]}}]}}]} as unknown as DocumentNode<Core_Student_SubjectGroupsQuery, Core_Student_SubjectGroupsQueryVariables>;
export const Core_Student_PersonalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"core_student_personal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StudentFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_students"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"leftEarly"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"guardianshipNote"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"personalInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"preferredFirstName"}},{"kind":"Field","name":{"kind":"Name","value":"preferredLastName"}},{"kind":"Field","name":{"kind":"Name","value":"middleName"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"birthCertFirstName"}},{"kind":"Field","name":{"kind":"Name","value":"birthCertLastName"}},{"kind":"Field","name":{"kind":"Name","value":"ire"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ppsNumber"}},{"kind":"Field","name":{"kind":"Name","value":"religion"}},{"kind":"Field","name":{"kind":"Name","value":"countryOfBirth"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nationality"}},{"kind":"Field","name":{"kind":"Name","value":"mothersMaidenName"}},{"kind":"Field","name":{"kind":"Name","value":"primaryAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"line1"}},{"kind":"Field","name":{"kind":"Name","value":"line2"}},{"kind":"Field","name":{"kind":"Name","value":"line3"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"postCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"addresses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"line1"}},{"kind":"Field","name":{"kind":"Name","value":"line2"}},{"kind":"Field","name":{"kind":"Name","value":"line3"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"postCode"}},{"kind":"Field","name":{"kind":"Name","value":"primaryAddress"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryPhoneNumber"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"areaCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryEmail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"studentIrePP"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"medicalCard"}},{"kind":"Field","name":{"kind":"Name","value":"travellerHeritage"}},{"kind":"Field","name":{"kind":"Name","value":"languageSupportApplicant"}},{"kind":"Field","name":{"kind":"Name","value":"borderIndicator"}},{"kind":"Field","name":{"kind":"Name","value":"examNumber"}},{"kind":"Field","name":{"kind":"Name","value":"lockerNumber"}},{"kind":"Field","name":{"kind":"Name","value":"previousSchoolRollNumber"}},{"kind":"Field","name":{"kind":"Name","value":"dpin"}},{"kind":"Field","name":{"kind":"Name","value":"examEntrant"}},{"kind":"Field","name":{"kind":"Name","value":"repeatYear"}},{"kind":"Field","name":{"kind":"Name","value":"boardingDays"}},{"kind":"Field","name":{"kind":"Name","value":"shortTermPupil"}},{"kind":"Field","name":{"kind":"Name","value":"shortTermPupilNumWeeks"}},{"kind":"Field","name":{"kind":"Name","value":"reasonForLeaving"}},{"kind":"Field","name":{"kind":"Name","value":"destinationRollNo"}},{"kind":"Field","name":{"kind":"Name","value":"previousSchoolName"}},{"kind":"Field","name":{"kind":"Name","value":"previousSchoolType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"classGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tutors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"yearGroupLeads"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"yearGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"programmeStages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"programme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"siblings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enrolledSiblings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"classGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"nonEnrolledSiblings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]}}]}}]} as unknown as DocumentNode<Core_Student_PersonalQuery, Core_Student_PersonalQueryVariables>;
export const QDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"q"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"StudentStatusFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"composite_studentStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"sessionAttendance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"currentLocation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"room"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lesson"}},{"kind":"Field","name":{"kind":"Name","value":"teacher"}},{"kind":"Field","name":{"kind":"Name","value":"currentAttendance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attendanceCodeName"}},{"kind":"Field","name":{"kind":"Name","value":"codeType"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"priorityStudent"}},{"kind":"Field","name":{"kind":"Name","value":"activeSupportPlan"}}]}}]}}]} as unknown as DocumentNode<QQuery, QQueryVariables>;
export const StudentsForSiblingSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"studentsForSiblingSearch"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_students"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"classGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"contacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]}}]} as unknown as DocumentNode<StudentsForSiblingSearchQuery, StudentsForSiblingSearchQueryVariables>;
export const Core_StudentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"core_students"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_students"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"classGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"staff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"personalInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"preferredFirstName"}},{"kind":"Field","name":{"kind":"Name","value":"primaryPhoneNumber"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryEmail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"studentIrePP"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"examNumber"}},{"kind":"Field","name":{"kind":"Name","value":"previousSchoolName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tutors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"yearGroupLeads"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"yearGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"programmeStages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"programme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<Core_StudentsQuery, Core_StudentsQueryVariables>;
export const Core_StudentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"core_student"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StudentFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_students"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"classGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"staff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"yearGroupLeads"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"yearGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shortName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tutors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<Core_StudentQuery, Core_StudentQueryVariables>;
export const Core_StudentsInfoForSelectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"core_studentsInfoForSelect"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"StudentFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_students"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<Core_StudentsInfoForSelectQuery, Core_StudentsInfoForSelectQueryVariables>;
export const UpdateCoreStudentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateCoreStudents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateStudentInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_updateStudents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<UpdateCoreStudentsMutation, UpdateCoreStudentsMutationVariables>;
export const Core_LinkSiblingsAndContactsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"core_linkSiblingsAndContacts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Core_LinkSiblingsAndContacts"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_linkSiblingsAndContacts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<Core_LinkSiblingsAndContactsMutation, Core_LinkSiblingsAndContactsMutationVariables>;
export const Core_UpdateStudentContactRelationshipsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"core_updateStudentContactRelationships"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Core_UpdateStudentContactRelationshipInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_updateStudentContactRelationships"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<Core_UpdateStudentContactRelationshipsMutation, Core_UpdateStudentContactRelationshipsMutationVariables>;
export const UpdateStudentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateStudent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateStudentInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_updateStudents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<UpdateStudentMutation, UpdateStudentMutationVariables>;
export const Core_UpsertAcademicNamespaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"core_upsertAcademicNamespace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SaveAcademicNamespaceInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_upsertAcademicNamespace"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"academicNamespaceId"}}]}}]}}]} as unknown as DocumentNode<Core_UpsertAcademicNamespaceMutation, Core_UpsertAcademicNamespaceMutationVariables>;
export const Core_SetActiveActiveAcademicNamespaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"core_setActiveActiveAcademicNamespace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SetActiveAcademicNamespace"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_setActiveActiveAcademicNamespace"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"academicNamespaceId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isActiveDefaultNamespace"}}]}}]}}]} as unknown as DocumentNode<Core_SetActiveActiveAcademicNamespaceMutation, Core_SetActiveActiveAcademicNamespaceMutationVariables>;
export const Core_UpsertRoomsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"core_upsertRooms"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpsertRoomInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_upsertRooms"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomId"}}]}}]}}]} as unknown as DocumentNode<Core_UpsertRoomsMutation, Core_UpsertRoomsMutationVariables>;
export const SavePermissionGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"savePermissionGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SavePermissionGroup"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users_savePermissionGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<SavePermissionGroupMutation, SavePermissionGroupMutationVariables>;
export const Users_PermissionGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"users_permissionGroups"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PermissionGroupFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users_permissionGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}},{"kind":"Field","name":{"kind":"Name","value":"memberPartyIds"}},{"kind":"Field","name":{"kind":"Name","value":"custom"}},{"kind":"Field","name":{"kind":"Name","value":"permissionSets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"toggle"}},{"kind":"Field","name":{"kind":"Name","value":"permissionType"}},{"kind":"Field","name":{"kind":"Name","value":"feature"}}]}}]}}]}}]} as unknown as DocumentNode<Users_PermissionGroupsQuery, Users_PermissionGroupsQueryVariables>;
export const Users_PermissionSetsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"users_permissionSets"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PermissionSetFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users_permissionSets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"permissionType"}},{"kind":"Field","name":{"kind":"Name","value":"toggle"}},{"kind":"Field","name":{"kind":"Name","value":"feature"}}]}}]}}]} as unknown as DocumentNode<Users_PermissionSetsQuery, Users_PermissionSetsQueryVariables>;
export const Ppod_PpodCredentialsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ppod_PPODCredentials"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ppod_PPODCredentials"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"password"}},{"kind":"Field","name":{"kind":"Name","value":"lastSyncSuccessful"}}]}}]}}]} as unknown as DocumentNode<Ppod_PpodCredentialsQuery, Ppod_PpodCredentialsQueryVariables>;
export const Ppod_SavePpodCredentialsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ppod_savePPODCredentials"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SavePPODCredentials"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ppod_savePPODCredentials"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"password"}}]}}]}}]} as unknown as DocumentNode<Ppod_SavePpodCredentialsMutation, Ppod_SavePpodCredentialsMutationVariables>;
export const Users_SchoolInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"users_schoolInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users_schoolInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rollNo"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"fax"}},{"kind":"Field","name":{"kind":"Name","value":"principal"}},{"kind":"Field","name":{"kind":"Name","value":"boardingFeeFiveDay"}},{"kind":"Field","name":{"kind":"Name","value":"boardingFeeSixOrSevenDay"}},{"kind":"Field","name":{"kind":"Name","value":"schoolGender"}},{"kind":"Field","name":{"kind":"Name","value":"parentAssociation"}},{"kind":"Field","name":{"kind":"Name","value":"studentCouncil"}},{"kind":"Field","name":{"kind":"Name","value":"boardOfManagement"}},{"kind":"Field","name":{"kind":"Name","value":"irishClassification"}},{"kind":"Field","name":{"kind":"Name","value":"coOperatingSchoolRollNo1"}},{"kind":"Field","name":{"kind":"Name","value":"coOperatingSchoolRollNo2"}},{"kind":"Field","name":{"kind":"Name","value":"octoberReturnsContact"}},{"kind":"Field","name":{"kind":"Name","value":"octoberReturnsPhoneNo"}},{"kind":"Field","name":{"kind":"Name","value":"octoberReturnsFaxNo"}},{"kind":"Field","name":{"kind":"Name","value":"octoberReturnsEmail"}},{"kind":"Field","name":{"kind":"Name","value":"phones"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}},{"kind":"Field","name":{"kind":"Name","value":"addresses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address1"}},{"kind":"Field","name":{"kind":"Name","value":"address2"}},{"kind":"Field","name":{"kind":"Name","value":"address3"}},{"kind":"Field","name":{"kind":"Name","value":"address4"}},{"kind":"Field","name":{"kind":"Name","value":"county"}},{"kind":"Field","name":{"kind":"Name","value":"localAuthority"}}]}},{"kind":"Field","name":{"kind":"Name","value":"chairPeople"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chairPersonId"}},{"kind":"Field","name":{"kind":"Name","value":"forename"}},{"kind":"Field","name":{"kind":"Name","value":"surname"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNo"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"owners"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ownerId"}},{"kind":"Field","name":{"kind":"Name","value":"forename"}},{"kind":"Field","name":{"kind":"Name","value":"surname"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine3"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine4"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"trustees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trusteeId"}},{"kind":"Field","name":{"kind":"Name","value":"forename"}},{"kind":"Field","name":{"kind":"Name","value":"surname"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine3"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine4"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}}]}}]}}]}}]} as unknown as DocumentNode<Users_SchoolInfoQuery, Users_SchoolInfoQueryVariables>;
export const Ppod_SyncRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ppod_syncRequests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SyncRequestsFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ppod_syncRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"syncRequestStatus"}},{"kind":"Field","name":{"kind":"Name","value":"requesterPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"requester"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"failureReason"}},{"kind":"Field","name":{"kind":"Name","value":"requestedOn"}}]}}]}}]} as unknown as DocumentNode<Ppod_SyncRequestsQuery, Ppod_SyncRequestsQueryVariables>;
export const Core_RoomsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"core_rooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_rooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"pools"}},{"kind":"Field","name":{"kind":"Name","value":"includeInTimetable"}},{"kind":"Field","name":{"kind":"Name","value":"externalSystemId"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"disabled"}}]}}]}}]} as unknown as DocumentNode<Core_RoomsQuery, Core_RoomsQueryVariables>;
export const CatalogueSubjectsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"catalogueSubjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"catalogue_subjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"shortCode"}},{"kind":"Field","name":{"kind":"Name","value":"nationalCode"}},{"kind":"Field","name":{"kind":"Name","value":"subjectSource"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}}]}}]} as unknown as DocumentNode<CatalogueSubjectsQuery, CatalogueSubjectsQueryVariables>;
export const Catalogue_UpsertSubjectsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"catalogue_upsertSubjects"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpsertSubject"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"catalogue_upsertSubjects"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<Catalogue_UpsertSubjectsMutation, Catalogue_UpsertSubjectsMutationVariables>;
export const SendSmsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"sendSms"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SendSmsInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communications_sendSms"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<SendSmsMutation, SendSmsMutationVariables>;
export const Communications_SmsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"communications_sms"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SmsFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communications_sms"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"sender"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"sentOn"}},{"kind":"Field","name":{"kind":"Name","value":"canReply"}},{"kind":"Field","name":{"kind":"Name","value":"numRecipients"}},{"kind":"Field","name":{"kind":"Name","value":"totalCost"}},{"kind":"Field","name":{"kind":"Name","value":"recipients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"smsId"}},{"kind":"Field","name":{"kind":"Name","value":"recipientPartyId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recipient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recipientPhoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"smsStatus"}}]}}]}}]}}]} as unknown as DocumentNode<Communications_SmsQuery, Communications_SmsQueryVariables>;
export const Communications_SmsCostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"communications_smsCost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SmsCostFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communications_smsCost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]} as unknown as DocumentNode<Communications_SmsCostQuery, Communications_SmsCostQueryVariables>;
export const Communications_SmsCreditDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"communications_smsCredit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communications_smsCredit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"smsCredit"}}]}}]}}]} as unknown as DocumentNode<Communications_SmsCreditQuery, Communications_SmsCreditQueryVariables>;
export const Communications_SmsXeroItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"communications_smsXeroItem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communications_smsXeroItem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"cost"}}]}}]}}]} as unknown as DocumentNode<Communications_SmsXeroItemQuery, Communications_SmsXeroItemQueryVariables>;
export const Communications_SmsTopUpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"communications_smsTopUp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SmsTopUpInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communications_smsTopUp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"smsCredit"}}]}}]}}]} as unknown as DocumentNode<Communications_SmsTopUpMutation, Communications_SmsTopUpMutationVariables>;
export const Swm_AbsenceTypesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"swm_absenceTypes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SWM_StaffAbsenceTypeFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"swm_absenceTypes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"absenceTypeId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"descriptionTextId"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"availableForRequests"}}]}}]}}]} as unknown as DocumentNode<Swm_AbsenceTypesQuery, Swm_AbsenceTypesQueryVariables>;
export const Swm_AbsencesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"swm_absences"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SWM_StaffAbsenceFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"swm_absences"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"absenceId"}},{"kind":"Field","name":{"kind":"Name","value":"staffPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"absenceType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"staff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"absenceReasonText"}},{"kind":"Field","name":{"kind":"Name","value":"substitutionRequired"}},{"kind":"Field","name":{"kind":"Name","value":"dates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"continuousStartDate"}},{"kind":"Field","name":{"kind":"Name","value":"continuousEndDate"}},{"kind":"Field","name":{"kind":"Name","value":"individualDates"}},{"kind":"Field","name":{"kind":"Name","value":"partialAbsence"}},{"kind":"Field","name":{"kind":"Name","value":"leavesAt"}},{"kind":"Field","name":{"kind":"Name","value":"returnsAt"}}]}}]}}]}}]} as unknown as DocumentNode<Swm_AbsencesQuery, Swm_AbsencesQueryVariables>;
export const Swm_UpsertAbsenceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"swm_upsertAbsence"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SWM_UpsertStaffAbsence"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"swm_upsertAbsence"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"staffPartyId"}},{"kind":"Field","name":{"kind":"Name","value":"absenceTypeId"}},{"kind":"Field","name":{"kind":"Name","value":"fromAbsenceRequestId"}},{"kind":"Field","name":{"kind":"Name","value":"absenceReasonText"}}]}}]}}]} as unknown as DocumentNode<Swm_UpsertAbsenceMutation, Swm_UpsertAbsenceMutationVariables>;
export const Swm_DeleteAbsenceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"swm_deleteAbsence"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"swm_deleteAbsence"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<Swm_DeleteAbsenceMutation, Swm_DeleteAbsenceMutationVariables>;
export const Tt_TimetablesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"tt_timetables"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TTTimetableFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tt_timetables"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timetableId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"liveStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalChanges"}},{"kind":"Field","name":{"kind":"Name","value":"lessonChanges"}},{"kind":"Field","name":{"kind":"Name","value":"timetableGroupChanges"}},{"kind":"Field","name":{"kind":"Name","value":"lastPublishedDate"}}]}}]}}]}}]} as unknown as DocumentNode<Tt_TimetablesQuery, Tt_TimetablesQueryVariables>;
export const Tt_SwapTeacherOptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"tt_swapTeacherOptions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TTSwapTeacherFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tt_swapTeacherOptions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timeslots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gridIdx"}},{"kind":"Field","name":{"kind":"Name","value":"dayIdx"}},{"kind":"Field","name":{"kind":"Name","value":"periodIdx"}}]}},{"kind":"Field","name":{"kind":"Name","value":"info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dayOfWeek"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"teachers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"staffId"}},{"kind":"Field","name":{"kind":"Name","value":"teacher"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"lessonOnTimeslots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lessonIdx"}},{"kind":"Field","name":{"kind":"Name","value":"lessonInstanceIdx"}},{"kind":"Field","name":{"kind":"Name","value":"timetableGroupId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"partyGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<Tt_SwapTeacherOptionsQuery, Tt_SwapTeacherOptionsQueryVariables>;
export const Tt_SwapRoomOptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"tt_swapRoomOptions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TTSwapRoomFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tt_swapRoomOptions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timeslots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gridIdx"}},{"kind":"Field","name":{"kind":"Name","value":"dayIdx"}},{"kind":"Field","name":{"kind":"Name","value":"periodIdx"}}]}},{"kind":"Field","name":{"kind":"Name","value":"info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dayOfWeek"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"rooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomId"}},{"kind":"Field","name":{"kind":"Name","value":"room"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"pools"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lessonOnTimeslots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lessonIdx"}},{"kind":"Field","name":{"kind":"Name","value":"lessonInstanceIdx"}},{"kind":"Field","name":{"kind":"Name","value":"timetableGroupId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"partyGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<Tt_SwapRoomOptionsQuery, Tt_SwapRoomOptionsQueryVariables>;
export const Tt_PublishDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"tt_publish"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TTPublishTimetableInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tt_publish"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<Tt_PublishMutation, Tt_PublishMutationVariables>;
export const Tt_ResetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"tt_reset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TT_Reset"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tt_reset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<Tt_ResetMutation, Tt_ResetMutationVariables>;
export const Tt_ResourceTimetableViewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"tt_resourceTimetableView"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TTResourceTimetableViewFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tt_resourceTimetableView"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timeslots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timeslotIds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gridIdx"}},{"kind":"Field","name":{"kind":"Name","value":"dayIdx"}},{"kind":"Field","name":{"kind":"Name","value":"periodIdx"}}]}},{"kind":"Field","name":{"kind":"Name","value":"timeslots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dayOfWeek"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"periodType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lessons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lessonIdx"}},{"kind":"Field","name":{"kind":"Name","value":"lessonInstanceIdx"}},{"kind":"Field","name":{"kind":"Name","value":"timetableGroupId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"timeslotId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gridIdx"}},{"kind":"Field","name":{"kind":"Name","value":"dayIdx"}},{"kind":"Field","name":{"kind":"Name","value":"periodIdx"}}]}},{"kind":"Field","name":{"kind":"Name","value":"timeslotInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}}]}},{"kind":"Field","name":{"kind":"Name","value":"partyGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SubjectGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"room"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"teachers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"spread"}}]}}]}}]}}]}}]} as unknown as DocumentNode<Tt_ResourceTimetableViewQuery, Tt_ResourceTimetableViewQueryVariables>;
export const Tt_GroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"tt_groups"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TT_GroupsFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tt_groups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SubjectGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"yearGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"colour"}}]}},{"kind":"Field","name":{"kind":"Name","value":"studentMembershipType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"classGroupId"}},{"kind":"Field","name":{"kind":"Name","value":"blockId"}},{"kind":"Field","name":{"kind":"Name","value":"classGroupName"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"teachers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"lessons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lessonIdx"}},{"kind":"Field","name":{"kind":"Name","value":"lessonInstanceIdx"}},{"kind":"Field","name":{"kind":"Name","value":"timetableGroupId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"timeslotId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gridIdx"}},{"kind":"Field","name":{"kind":"Name","value":"dayIdx"}},{"kind":"Field","name":{"kind":"Name","value":"periodIdx"}}]}},{"kind":"Field","name":{"kind":"Name","value":"timeslotInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}}]}},{"kind":"Field","name":{"kind":"Name","value":"partyGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SubjectGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"room"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"teachers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"spread"}}]}}]}}]}}]} as unknown as DocumentNode<Tt_GroupsQuery, Tt_GroupsQueryVariables>;
export const Tt_SwapDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"tt_swap"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TTSwapsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tt_swap"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<Tt_SwapMutation, Tt_SwapMutationVariables>;
export const Tt_UnpublishedChangesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"tt_unpublishedChanges"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TTTimetableFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tt_timetables"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timetableId"}},{"kind":"Field","name":{"kind":"Name","value":"liveStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalChanges"}},{"kind":"Field","name":{"kind":"Name","value":"publishDiff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lessonDiffs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"newLesson"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lessonIdx"}},{"kind":"Field","name":{"kind":"Name","value":"lessonInstanceIdx"}},{"kind":"Field","name":{"kind":"Name","value":"timetableGroupId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"timeslotId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gridIdx"}},{"kind":"Field","name":{"kind":"Name","value":"dayIdx"}},{"kind":"Field","name":{"kind":"Name","value":"periodIdx"}}]}},{"kind":"Field","name":{"kind":"Name","value":"timeslotInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}}]}},{"kind":"Field","name":{"kind":"Name","value":"partyGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SubjectGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"room"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"teachers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"spread"}}]}},{"kind":"Field","name":{"kind":"Name","value":"oldLesson"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lessonIdx"}},{"kind":"Field","name":{"kind":"Name","value":"lessonInstanceIdx"}},{"kind":"Field","name":{"kind":"Name","value":"timetableGroupId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"timeslotId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gridIdx"}},{"kind":"Field","name":{"kind":"Name","value":"dayIdx"}},{"kind":"Field","name":{"kind":"Name","value":"periodIdx"}}]}},{"kind":"Field","name":{"kind":"Name","value":"timeslotInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}}]}},{"kind":"Field","name":{"kind":"Name","value":"partyGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SubjectGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"room"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"teachers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"spread"}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"roomChanged"}},{"kind":"Field","name":{"kind":"Name","value":"teachersChanged"}},{"kind":"Field","name":{"kind":"Name","value":"timeslotChanged"}}]}},{"kind":"Field","name":{"kind":"Name","value":"groupDiffs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"newGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SubjectGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"teachers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"oldGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SubjectGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"teachers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameTextId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"teachersChanged"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<Tt_UnpublishedChangesQuery, Tt_UnpublishedChangesQueryVariables>;
export const Tt_UpdateTimetableGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"tt_updateTimetableGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TT_UpdateTimetableGroupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tt_updateTimetableGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<Tt_UpdateTimetableGroupMutation, Tt_UpdateTimetableGroupMutationVariables>;
export const Admin__Party_PeopleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"admin__party_people"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tenant"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"admin__party_people"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"tenant"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tenant"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partyId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]} as unknown as DocumentNode<Admin__Party_PeopleQuery, Admin__Party_PeopleQueryVariables>;
export const Admin__TenantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"admin__tenants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"admin__tenants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"imgUrl"}}]}}]}}]} as unknown as DocumentNode<Admin__TenantsQuery, Admin__TenantsQueryVariables>;
export const Core_AcademicNamespacesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"core_academicNamespaces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"core_academicNamespaces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"academicNamespaceId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isActiveDefaultNamespace"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}}]}}]}}]} as unknown as DocumentNode<Core_AcademicNamespacesQuery, Core_AcademicNamespacesQueryVariables>;
export const Catalogue_ProgrammeStagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"catalogue_programmeStages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"catalogue_programmeStages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<Catalogue_ProgrammeStagesQuery, Catalogue_ProgrammeStagesQueryVariables>;
export const YearsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"years"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"YearGroupFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"catalogue_years"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"yearGroupId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<YearsQuery, YearsQueryVariables>;
export const MyAuthDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"myAuthDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myAuthDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"defaultProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"activeProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"profiles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nickName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"imgUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"profileType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"userType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"permissionIds"}},{"kind":"Field","name":{"kind":"Name","value":"partyId"}}]}}]}}]}}]} as unknown as DocumentNode<MyAuthDetailsQuery, MyAuthDetailsQueryVariables>;