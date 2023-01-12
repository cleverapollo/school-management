/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const documents = {
    "\n  mutation calendar_createCalendarEvents($input: CreateCalendarEventsInput!){\n    calendar_createCalendarEvents(input: $input){\n      eventId\n      calendarIds\n      schedule{\n        startTime\n        endTime\n        startDate\n        endDate\n        recurrenceRule\n      }\n      attendees{\n        partyId\n        type\n        startDate\n        endDate\n        recurrenceRule\n      }\n      exclusions{\n        partyId\n        startDate\n        endDate\n        recurrenceRule\n      }\n      type\n      lessonInfo{\n        subjectGroupId\n        lessonId\n      }\n      roomIds\n    }\n  }\n": types.Calendar_CreateCalendarEventsDocument,
    "\n  query calendar_calendarEvents($filter: CalendarEventFilter!){\n    calendar_calendarEvents(filter: $filter){\n      calendarIds\n      startTime\n      endTime\n      type\n      lessonInfo{\n        subjectGroupId\n        lessonId\n      }\n      exclusions{\n        partyId\n        type\n      }\n      attendees{\n        partyId\n        type\n        partyInfo{\n          partyId\n          __typename\n          ... on GeneralGroup {\n            name\n            \n          }\n          ... on SubjectGroup {\n            name\n            subjects {\n              name\n            }\n          }\n          ... on Person {\n            firstName\n            lastName           \n          }\n        }\n      }\n      rooms{\n        roomId\n        name\n      }\n    }\n  }\n": types.Calendar_CalendarEventsDocument,
    "\n  query generalGroupsList($filter: GeneralGroupFilter!) {\n    generalGroups(filter: $filter) {\n      partyId\n      name\n      studentMembers {\n        memberCount\n      }\n      generalGroupType\n      programmeStages {\n        programme {\n          name\n        }\n      }\n    }\n  }\n": types.GeneralGroupsListDocument,
    "\n  query enrolmentGroupsById($filter: GeneralGroupFilter!) {\n    generalGroups(filter: $filter) {\n      partyId\n      name\n      students {\n        partyId\n        firstName\n        lastName\n      }\n    }\n  }\n": types.EnrolmentGroupsByIdDocument,
    "\n  query customGroupById($filter: GeneralGroupFilter!) {\n    generalGroups(filter: $filter) {\n      partyId\n      name\n      students {\n        partyId\n        firstName\n        lastName\n      }\n      staff {\n        partyId\n        firstName\n        lastName\n      }\n    }\n  }\n": types.CustomGroupByIdDocument,
    "\n  query subjectGroups {\n    subjectGroups {\n      partyId\n      name\n      subjects {\n        name\n      }\n      studentMembers {\n        memberCount\n      }\n      staff {\n        firstName\n        lastName\n        avatarUrl\n      }\n      irePP {\n        level\n      }\n      programmeStages {\n        programme {\n          name\n        }\n      }\n    }\n  }\n": types.SubjectGroupsDocument,
    "\n  query subjectGroupById($filter: SubjectGroupFilter!) {\n    subjectGroups(filter: $filter) {\n      partyId\n      name\n      students {\n        firstName\n        lastName\n        avatarUrl\n      }\n    }\n  }\n": types.SubjectGroupByIdDocument,
    "\n  query core_academicNamespaces {\n    core_academicNamespaces {\n      academicNamespaceId\n      type\n      name\n      year\n      description\n      isActiveDefaultNamespace\n    }\n  }\n": types.Core_AcademicNamespacesDocument,
    "\n  mutation core_setActiveActiveAcademicNamespace(\n    $input: SetActiveAcademicNamespace\n  ) {\n    core_setActiveActiveAcademicNamespace(input: $input) {\n      academicNamespaceId\n      type\n      name\n      year\n      description\n      isActiveDefaultNamespace\n    }\n  }\n": types.Core_SetActiveActiveAcademicNamespaceDocument,
    "\n  query core_rooms {\n    core_rooms {\n      roomId\n      name\n      capacity\n    }\n  }\n": types.Core_RoomsDocument,
    "\n  query catalogueSubjects {\n    catalogue_subjects {\n      id\n      name\n      description\n      shortCode\n      nationalCode\n      subjectSource\n      colour\n      icon\n    }\n  }\n": types.CatalogueSubjectsDocument,
    "\n  query admin__party_people($tenant: Int!) {\n    admin__party_people(tenant: $tenant) {\n      partyId\n      firstName\n      lastName\n      type\n    }\n  }\n": types.Admin__Party_PeopleDocument,
    "\n  query admin__tenants {\n    admin__tenants {\n      tenant\n      name\n      imgUrl\n    }\n  }\n": types.Admin__TenantsDocument,
    "\n  query myAuthDetails {\n    myAuthDetails {\n      id\n      email\n      name\n      defaultProfileId\n      activeProfileId\n      profiles {\n        id\n        nickName\n        tenant {\n          tenant\n          name\n          imgUrl\n        }\n        profileType {\n          name\n          description\n          userType\n        }\n        permissionIds\n      }\n    }\n  }\n": types.MyAuthDetailsDocument,
};

export function graphql(source: "\n  query generalGroupsList($filter: GeneralGroupFilter!) {\n    generalGroups(filter: $filter) {\n      partyId\n      name\n      studentMembers {\n        memberCount\n      }\n      generalGroupType\n      programmeStages {\n        programme {\n          name\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query generalGroupsList($filter: GeneralGroupFilter!) {\n    generalGroups(filter: $filter) {\n      partyId\n      name\n      studentMembers {\n        memberCount\n      }\n      generalGroupType\n      programmeStages {\n        programme {\n          name\n        }\n      }\n    }\n  }\n"];
export function graphql(source: "\n  query enrolmentGroupsById($filter: GeneralGroupFilter!) {\n    generalGroups(filter: $filter) {\n      partyId\n      name\n      students {\n        partyId\n        firstName\n        lastName\n      }\n    }\n  }\n"): (typeof documents)["\n  query enrolmentGroupsById($filter: GeneralGroupFilter!) {\n    generalGroups(filter: $filter) {\n      partyId\n      name\n      students {\n        partyId\n        firstName\n        lastName\n      }\n    }\n  }\n"];
export function graphql(source: "\n  query customGroupById($filter: GeneralGroupFilter!) {\n    generalGroups(filter: $filter) {\n      partyId\n      name\n      students {\n        partyId\n        firstName\n        lastName\n      }\n      staff {\n        partyId\n        firstName\n        lastName\n      }\n    }\n  }\n"): (typeof documents)["\n  query customGroupById($filter: GeneralGroupFilter!) {\n    generalGroups(filter: $filter) {\n      partyId\n      name\n      students {\n        partyId\n        firstName\n        lastName\n      }\n      staff {\n        partyId\n        firstName\n        lastName\n      }\n    }\n  }\n"];
export function graphql(source: "\n  query subjectGroups {\n    subjectGroups {\n      partyId\n      name\n      subjects {\n        name\n      }\n      studentMembers {\n        memberCount\n      }\n      staff {\n        firstName\n        lastName\n        avatarUrl\n      }\n      irePP {\n        level\n      }\n      programmeStages {\n        programme {\n          name\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query subjectGroups {\n    subjectGroups {\n      partyId\n      name\n      subjects {\n        name\n      }\n      studentMembers {\n        memberCount\n      }\n      staff {\n        firstName\n        lastName\n        avatarUrl\n      }\n      irePP {\n        level\n      }\n      programmeStages {\n        programme {\n          name\n        }\n      }\n    }\n  }\n"];
export function graphql(source: "\n  query subjectGroupById($filter: SubjectGroupFilter!) {\n    subjectGroups(filter: $filter) {\n      partyId\n      name\n      students {\n        firstName\n        lastName\n        avatarUrl\n      }\n    }\n  }\n"): (typeof documents)["\n  query subjectGroupById($filter: SubjectGroupFilter!) {\n    subjectGroups(filter: $filter) {\n      partyId\n      name\n      students {\n        firstName\n        lastName\n        avatarUrl\n      }\n    }\n  }\n"];
export function graphql(source: "\n  query core_academicNamespaces {\n    core_academicNamespaces {\n      academicNamespaceId\n      type\n      name\n      year\n      description\n      isActiveDefaultNamespace\n    }\n  }\n"): (typeof documents)["\n  query core_academicNamespaces {\n    core_academicNamespaces {\n      academicNamespaceId\n      type\n      name\n      year\n      description\n      isActiveDefaultNamespace\n    }\n  }\n"];
export function graphql(source: "\n  mutation core_setActiveActiveAcademicNamespace(\n    $input: SetActiveAcademicNamespace\n  ) {\n    core_setActiveActiveAcademicNamespace(input: $input) {\n      academicNamespaceId\n      type\n      name\n      year\n      description\n      isActiveDefaultNamespace\n    }\n  }\n"): (typeof documents)["\n  mutation core_setActiveActiveAcademicNamespace(\n    $input: SetActiveAcademicNamespace\n  ) {\n    core_setActiveActiveAcademicNamespace(input: $input) {\n      academicNamespaceId\n      type\n      name\n      year\n      description\n      isActiveDefaultNamespace\n    }\n  }\n"];
export function graphql(source: "\n  query core_rooms {\n    core_rooms {\n      roomId\n      name\n      capacity\n    }\n  }\n"): (typeof documents)["\n  query core_rooms {\n    core_rooms {\n      roomId\n      name\n      capacity\n    }\n  }\n"];
export function graphql(source: "\n  query catalogueSubjects {\n    catalogue_subjects {\n      id\n      name\n      description\n      shortCode\n      nationalCode\n      subjectSource\n      colour\n      icon\n    }\n  }\n"): (typeof documents)["\n  query catalogueSubjects {\n    catalogue_subjects {\n      id\n      name\n      description\n      shortCode\n      nationalCode\n      subjectSource\n      colour\n      icon\n    }\n  }\n"];
export function graphql(source: "\n  query admin__party_people($tenant: Int!) {\n    admin__party_people(tenant: $tenant) {\n      partyId\n      firstName\n      lastName\n      type\n    }\n  }\n"): (typeof documents)["\n  query admin__party_people($tenant: Int!) {\n    admin__party_people(tenant: $tenant) {\n      partyId\n      firstName\n      lastName\n      type\n    }\n  }\n"];
export function graphql(source: "\n  query admin__tenants {\n    admin__tenants {\n      tenant\n      name\n      imgUrl\n    }\n  }\n"): (typeof documents)["\n  query admin__tenants {\n    admin__tenants {\n      tenant\n      name\n      imgUrl\n    }\n  }\n"];
export function graphql(source: "\n  mutation calendar_createCalendarEvents($input: CreateCalendarEventsInput!){\n    calendar_createCalendarEvents(input: $input){\n      eventId\n      calendarIds\n      schedule{\n        startTime\n        endTime\n        startDate\n        endDate\n        recurrenceRule\n      }\n      attendees{\n        partyId\n        type\n        startDate\n        endDate\n        recurrenceRule\n      }\n      exclusions{\n        partyId\n        startDate\n        endDate\n        recurrenceRule\n      }\n      type\n      lessonInfo{\n        subjectGroupId\n        lessonId\n      }\n      roomIds\n    }\n  }\n"): (typeof documents)["\n  mutation calendar_createCalendarEvents($input: CreateCalendarEventsInput!){\n    calendar_createCalendarEvents(input: $input){\n      eventId\n      calendarIds\n      schedule{\n        startTime\n        endTime\n        startDate\n        endDate\n        recurrenceRule\n      }\n      attendees{\n        partyId\n        type\n        startDate\n        endDate\n        recurrenceRule\n      }\n      exclusions{\n        partyId\n        startDate\n        endDate\n        recurrenceRule\n      }\n      type\n      lessonInfo{\n        subjectGroupId\n        lessonId\n      }\n      roomIds\n    }\n  }\n"];
export function graphql(source: "\n  query calendar_calendarEvents($filter: CalendarEventFilter!){\n    calendar_calendarEvents(filter: $filter){\n      calendarIds\n      startTime\n      endTime\n      type\n      lessonInfo{\n        subjectGroupId\n        lessonId\n      }\n      exclusions{\n        partyId\n        type\n      }\n      attendees{\n        partyId\n        type\n        partyInfo{\n          partyId\n          __typename\n          ... on GeneralGroup {\n            name\n            \n          }\n          ... on SubjectGroup {\n            name\n            subjects {\n              name\n            }\n          }\n          ... on Person {\n            firstName\n            lastName           \n          }\n        }\n      }\n      rooms{\n        roomId\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query calendar_calendarEvents($filter: CalendarEventFilter!){\n    calendar_calendarEvents(filter: $filter){\n      calendarIds\n      startTime\n      endTime\n      type\n      lessonInfo{\n        subjectGroupId\n        lessonId\n      }\n      exclusions{\n        partyId\n        type\n      }\n      attendees{\n        partyId\n        type\n        partyInfo{\n          partyId\n          __typename\n          ... on GeneralGroup {\n            name\n            \n          }\n          ... on SubjectGroup {\n            name\n            subjects {\n              name\n            }\n          }\n          ... on Person {\n            firstName\n            lastName           \n          }\n        }\n      }\n      rooms{\n        roomId\n        name\n      }\n    }\n  }\n"];
export function graphql(source: "\n  query myAuthDetails {\n    myAuthDetails {\n      id\n      email\n      name\n      defaultProfileId\n      activeProfileId\n      profiles {\n        id\n        nickName\n        tenant {\n          tenant\n          name\n          imgUrl\n        }\n        profileType {\n          name\n          description\n          userType\n        }\n        permissionIds\n      }\n    }\n  }\n"): (typeof documents)["\n  query myAuthDetails {\n    myAuthDetails {\n      id\n      email\n      name\n      defaultProfileId\n      activeProfileId\n      profiles {\n        id\n        nickName\n        tenant {\n          tenant\n          name\n          imgUrl\n        }\n        profileType {\n          name\n          description\n          userType\n        }\n        permissionIds\n      }\n    }\n  }\n"];

export function graphql(source: string): unknown;
export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;
