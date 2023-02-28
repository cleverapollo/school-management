/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const documents = {
    "\n  query searchQuery($filter: SearchFilter) {\n    search_search(filter: $filter) {\n      partyId\n      type\n      text\n      meta {\n        studentPartyId\n      }\n    }\n  }\n": types.SearchQueryDocument,
    "\n  query dashboardAssessment($filter: DashboardAssessmentFilter) {\n    dashboardAssessment(filter: $filter) {\n      id\n      name\n      description\n      assessmentType\n      startDate\n      endDate\n      results {\n        id\n        subject\n        result\n        grade\n      }\n    }\n  }\n": types.DashboardAssessmentDocument,
    "\n  mutation calendar_createCalendarEvents($input: CreateCalendarEventsInput!) {\n    calendar_createCalendarEvents(input: $input) {\n      eventId\n      calendarIds\n      schedule {\n        startTime\n        endTime\n        startDate\n        endDate\n        recurrenceRule\n      }\n      attendees {\n        partyId\n        type\n        startDate\n        endDate\n        recurrenceRule\n      }\n      exclusions {\n        partyId\n        startDate\n        endDate\n        recurrenceRule\n      }\n      type\n      lessonInfo {\n        subjectGroupId\n        lessonId\n      }\n      roomIds\n    }\n  }\n": types.Calendar_CreateCalendarEventsDocument,
    "\n  query calendar_calendarEvents($filter: CalendarEventFilter!) {\n    calendar_calendarEvents(filter: $filter) {\n      calendarIds\n      startTime\n      endTime\n      type\n      lessonInfo {\n        subjectGroupId\n        lessonId\n      }\n      exclusions {\n        partyId\n        type\n      }\n      attendees {\n        partyId\n        type\n        partyInfo {\n          partyId\n          __typename\n          ... on GeneralGroup {\n            name\n          }\n          ... on SubjectGroup {\n            name\n            subjects {\n              name\n            }\n          }\n          ... on Person {\n            firstName\n            lastName\n          }\n        }\n      }\n      rooms {\n        roomId\n        name\n      }\n    }\n  }\n": types.Calendar_CalendarEventsDocument,
    "\n  query generalGroupsList($filter: GeneralGroupFilter!) {\n    generalGroups(filter: $filter) {\n      partyId\n      name\n      studentMembers {\n        memberCount\n      }\n      generalGroupType\n      programmeStages {\n        programme {\n          name\n        }\n      }\n    }\n  }\n": types.GeneralGroupsListDocument,
    "\n  query enrolmentGroupsById($filter: GeneralGroupFilter!) {\n    generalGroups(filter: $filter) {\n      partyId\n      name\n      students {\n        partyId\n        firstName\n        lastName\n      }\n    }\n  }\n": types.EnrolmentGroupsByIdDocument,
    "\n  query customGroupById($filter: GeneralGroupFilter!) {\n    generalGroups(filter: $filter) {\n      partyId\n      name\n      students {\n        partyId\n        firstName\n        lastName\n      }\n      staff {\n        partyId\n        firstName\n        lastName\n      }\n    }\n  }\n": types.CustomGroupByIdDocument,
    "\n  query subjectGroups {\n    subjectGroups {\n      partyId\n      name\n      subjects {\n        name\n      }\n      studentMembers {\n        memberCount\n      }\n      staff {\n        firstName\n        lastName\n        avatarUrl\n      }\n      irePP {\n        level\n      }\n      programmeStages {\n        programme {\n          name\n        }\n      }\n    }\n  }\n": types.SubjectGroupsDocument,
    "\n  query subjectGroupById($filter: SubjectGroupFilter!) {\n    subjectGroups(filter: $filter) {\n      partyId\n      name\n      students {\n        firstName\n        lastName\n        avatarUrl\n      }\n    }\n  }\n": types.SubjectGroupByIdDocument,
    "\n  query label($filter: LabelFilter) {\n    label(filter: $filter) {\n      id\n      name\n      personPartyId\n      colour\n      custom\n    }\n  }\n": types.LabelDocument,
    "\n  mutation labelMutation($input: LabelInput) {\n    label(input: $input) {\n      id\n      name\n      personPartyId\n      colour\n      custom\n    }\n  }\n": types.LabelMutationDocument,
    "\n  query unreadCount($filter: UnreadCountFilter) {\n    unreadCount(filter: $filter) {\n      labelId\n      count\n    }\n  }\n": types.UnreadCountDocument,
    "\n  mutation assignLabel($input: AssignLabelInput) {\n    assignLabel(input: $input) {\n      id\n      rootMailId\n      threadId\n      subject\n      body\n      senderPartyId\n      sentOn\n      latestMessage\n      canReply\n      starred\n      readOn\n      recipients {\n        id\n        recipientPartyId\n        recipientType\n        name\n      }\n      labels {\n        id\n        name\n        personPartyId\n        colour\n        custom\n      }\n      threads {\n        id\n        rootMailId\n        threadId\n        subject\n        body\n        senderPartyId\n        sentOn\n        latestMessage\n        canReply\n        starred\n        readOn\n        recipients {\n          id\n          recipientPartyId\n          recipientType\n          name\n        }\n        labels {\n          id\n          name\n          personPartyId\n          colour\n          custom\n        }\n      }\n    }\n  }\n": types.AssignLabelDocument,
    "\n  query mail($filter: MailFilter) {\n    mail(filter: $filter) {\n      id\n      rootMailId\n      threadId\n      subject\n      body\n      senderPartyId\n      sentOn\n      latestMessage\n      canReply\n      starred\n      readOn\n      recipients {\n        id\n        recipientPartyId\n        recipientType\n        name\n      }\n      labels {\n        id\n        name\n        personPartyId\n        colour\n        custom\n      }\n      threads {\n        id\n        rootMailId\n        threadId\n        subject\n        body\n        senderPartyId\n        sentOn\n        latestMessage\n        canReply\n        starred\n        readOn\n        recipients {\n          id\n          recipientPartyId\n          recipientType\n          name\n        }\n        labels {\n          id\n          name\n          personPartyId\n          colour\n          custom\n        }\n      }\n    }\n  }\n": types.MailDocument,
    "\n  mutation sendMail($input: SendMailInput) {\n    sendMail(input: $input) {\n      id\n      rootMailId\n      threadId\n      subject\n      body\n      senderPartyId\n      sentOn\n      latestMessage\n      canReply\n      starred\n      readOn\n      recipients {\n        id\n        recipientPartyId\n        recipientType\n        name\n      }\n      labels {\n        id\n        name\n        personPartyId\n        colour\n        custom\n      }\n      threads {\n        id\n        rootMailId\n        threadId\n        subject\n        body\n        senderPartyId\n        sentOn\n        latestMessage\n        canReply\n        starred\n        readOn\n        recipients {\n          id\n          recipientPartyId\n          recipientType\n          name\n        }\n        labels {\n          id\n          name\n          personPartyId\n          colour\n          custom\n        }\n      }\n    }\n  }\n": types.SendMailDocument,
    "\n  mutation starred($input: MailStarredInput) {\n    starred(input: $input)\n  }\n": types.StarredDocument,
    "\n  mutation read($input: MailReadInput) {\n    read(input: $input)\n  }\n": types.ReadDocument,
    "\n  query core_studentContacts {\n    core_studentContacts {\n      partyId\n      person {\n        avatarUrl\n        firstName\n        lastName\n      }\n      personalInformation {\n        preferredFirstName\n        primaryPhoneNumber {\n          number\n        }\n        primaryEmail {\n          email\n        }\n      }\n    }\n  }\n": types.Core_StudentContactsDocument,
    "\n  query core_student_contacts($filter: StudentFilter!) {\n    core_students(filter: $filter) {\n      partyId\n      contacts {\n        partyId\n        person {\n          firstName\n          lastName\n          avatarUrl\n          type\n        }\n        personalInformation {\n          gender\n          nationality\n          primaryAddress {\n            line1\n            line2\n            line3\n            city\n            country\n            postCode\n          }\n          primaryPhoneNumber {\n            number\n            areaCode\n            countryCode\n          }\n          primaryEmail {\n            email\n          }\n        }\n        relationships {\n          relationshipType\n          primaryContact\n          allowedToContact\n        }\n      }\n    }\n  }\n": types.Core_Student_ContactsDocument,
    "\n  query core_student_personal($filter: StudentFilter!) {\n    core_students(filter: $filter) {\n      partyId\n      personalInformation {\n        firstName\n        lastName\n        preferredFirstName\n        middleName\n        gender\n        dateOfBirth\n        ire {\n          ppsNumber\n          religion\n          countryOfBirth\n        }\n        nationality\n        mothersMaidenName\n        primaryAddress {\n          line1\n          line2\n          line3\n          city\n          country\n          postCode\n        }\n        primaryPhoneNumber {\n          number\n          areaCode\n          countryCode\n        }\n        primaryEmail {\n          email\n        }\n      }\n      studentIrePP {\n        medicalCard\n        travellerHeritage\n        languageSupportApplicant\n        borderIndicator\n        examNumber\n        previousSchoolRollNumber\n      }\n    }\n  }\n": types.Core_Student_PersonalDocument,
    "\n  query core_students {\n    core_students {\n      partyId\n      person {\n        avatarUrl\n        firstName\n        lastName\n      }\n      classGroup {\n        name\n        staff {\n          firstName\n          lastName\n        }\n      }\n      personalInformation {\n        preferredFirstName\n        primaryPhoneNumber {\n          number\n        }\n        primaryEmail {\n          email\n        }\n      }\n      studentIrePP {\n        examNumber\n      }\n      tutors {\n        partyId\n        firstName\n        lastName\n        avatarUrl\n      }\n      yearGroupLeads {\n        partyId\n        firstName\n        lastName\n        avatarUrl\n      }\n      yearGroups {\n        name\n      }\n      programmeStages {\n        name\n        programme {\n          name\n        }\n      }\n    }\n  }\n": types.Core_StudentsDocument,
    "\n  query core_student($filter: StudentFilter!) {\n    core_students(filter: $filter) {\n      partyId\n      person {\n        avatarUrl\n        firstName\n        lastName\n      }\n      classGroup {\n        name\n        staff {\n          firstName\n          lastName\n        }\n      }\n      status {\n        sessionAttendance {\n          studentPartyId\n          name\n          status\n        }\n        currentLocation {\n          room {\n            roomId\n            name\n          }\n          lesson\n          teacher\n          currentAttendance {\n            attendanceCodeName\n            codeType\n          }\n        }\n        priorityStudent\n        activeSupportPlan\n      }\n    }\n  }\n": types.Core_StudentDocument,
    "\n  mutation updateCoreStudents($input: [UpdateStudentInput]!) {\n    core_updateStudents(input: $input)\n  }\n": types.UpdateCoreStudentsDocument,
    "\n  query core_academicNamespaces {\n    core_academicNamespaces {\n      academicNamespaceId\n      type\n      name\n      year\n      description\n      isActiveDefaultNamespace\n    }\n  }\n": types.Core_AcademicNamespacesDocument,
    "\n  mutation core_setActiveActiveAcademicNamespace(\n    $input: SetActiveAcademicNamespace\n  ) {\n    core_setActiveActiveAcademicNamespace(input: $input) {\n      academicNamespaceId\n      type\n      name\n      year\n      description\n      isActiveDefaultNamespace\n    }\n  }\n": types.Core_SetActiveActiveAcademicNamespaceDocument,
    "\n  query core_rooms {\n    core_rooms {\n      roomId\n      name\n      capacity\n    }\n  }\n": types.Core_RoomsDocument,
    "\n  query catalogueSubjects {\n    catalogue_subjects {\n      id\n      name\n      description\n      shortCode\n      nationalCode\n      subjectSource\n      colour\n      icon\n    }\n  }\n": types.CatalogueSubjectsDocument,
    "\n  query admin__party_people($tenant: Int!) {\n    admin__party_people(tenant: $tenant) {\n      partyId\n      firstName\n      lastName\n      type\n    }\n  }\n": types.Admin__Party_PeopleDocument,
    "\n  query admin__tenants {\n    admin__tenants {\n      tenant\n      name\n      imgUrl\n    }\n  }\n": types.Admin__TenantsDocument,
    "\n  query myAuthDetails {\n    myAuthDetails {\n      id\n      email\n      name\n      defaultProfileId\n      activeProfileId\n      profiles {\n        id\n        nickName\n        avatarUrl\n        tenant {\n          tenant\n          name\n          imgUrl\n        }\n        profileType {\n          name\n          description\n          userType\n        }\n        permissionIds\n        partyId\n      }\n    }\n  }\n": types.MyAuthDetailsDocument,
};

export function graphql(source: "\n  query searchQuery($filter: SearchFilter) {\n    search_search(filter: $filter) {\n      partyId\n      type\n      text\n      meta {\n        studentPartyId\n      }\n    }\n  }\n"): (typeof documents)["\n  query searchQuery($filter: SearchFilter) {\n    search_search(filter: $filter) {\n      partyId\n      type\n      text\n      meta {\n        studentPartyId\n      }\n    }\n  }\n"];
export function graphql(source: "\n  query dashboardAssessment($filter: DashboardAssessmentFilter) {\n    dashboardAssessment(filter: $filter) {\n      id\n      name\n      description\n      assessmentType\n      startDate\n      endDate\n      results {\n        id\n        subject\n        result\n        grade\n      }\n    }\n  }\n"): (typeof documents)["\n  query dashboardAssessment($filter: DashboardAssessmentFilter) {\n    dashboardAssessment(filter: $filter) {\n      id\n      name\n      description\n      assessmentType\n      startDate\n      endDate\n      results {\n        id\n        subject\n        result\n        grade\n      }\n    }\n  }\n"];
export function graphql(source: "\n  mutation calendar_createCalendarEvents($input: CreateCalendarEventsInput!) {\n    calendar_createCalendarEvents(input: $input) {\n      eventId\n      calendarIds\n      schedule {\n        startTime\n        endTime\n        startDate\n        endDate\n        recurrenceRule\n      }\n      attendees {\n        partyId\n        type\n        startDate\n        endDate\n        recurrenceRule\n      }\n      exclusions {\n        partyId\n        startDate\n        endDate\n        recurrenceRule\n      }\n      type\n      lessonInfo {\n        subjectGroupId\n        lessonId\n      }\n      roomIds\n    }\n  }\n"): (typeof documents)["\n  mutation calendar_createCalendarEvents($input: CreateCalendarEventsInput!) {\n    calendar_createCalendarEvents(input: $input) {\n      eventId\n      calendarIds\n      schedule {\n        startTime\n        endTime\n        startDate\n        endDate\n        recurrenceRule\n      }\n      attendees {\n        partyId\n        type\n        startDate\n        endDate\n        recurrenceRule\n      }\n      exclusions {\n        partyId\n        startDate\n        endDate\n        recurrenceRule\n      }\n      type\n      lessonInfo {\n        subjectGroupId\n        lessonId\n      }\n      roomIds\n    }\n  }\n"];
export function graphql(source: "\n  query calendar_calendarEvents($filter: CalendarEventFilter!) {\n    calendar_calendarEvents(filter: $filter) {\n      calendarIds\n      startTime\n      endTime\n      type\n      lessonInfo {\n        subjectGroupId\n        lessonId\n      }\n      exclusions {\n        partyId\n        type\n      }\n      attendees {\n        partyId\n        type\n        partyInfo {\n          partyId\n          __typename\n          ... on GeneralGroup {\n            name\n          }\n          ... on SubjectGroup {\n            name\n            subjects {\n              name\n            }\n          }\n          ... on Person {\n            firstName\n            lastName\n          }\n        }\n      }\n      rooms {\n        roomId\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query calendar_calendarEvents($filter: CalendarEventFilter!) {\n    calendar_calendarEvents(filter: $filter) {\n      calendarIds\n      startTime\n      endTime\n      type\n      lessonInfo {\n        subjectGroupId\n        lessonId\n      }\n      exclusions {\n        partyId\n        type\n      }\n      attendees {\n        partyId\n        type\n        partyInfo {\n          partyId\n          __typename\n          ... on GeneralGroup {\n            name\n          }\n          ... on SubjectGroup {\n            name\n            subjects {\n              name\n            }\n          }\n          ... on Person {\n            firstName\n            lastName\n          }\n        }\n      }\n      rooms {\n        roomId\n        name\n      }\n    }\n  }\n"];
export function graphql(source: "\n  query generalGroupsList($filter: GeneralGroupFilter!) {\n    generalGroups(filter: $filter) {\n      partyId\n      name\n      studentMembers {\n        memberCount\n      }\n      generalGroupType\n      programmeStages {\n        programme {\n          name\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query generalGroupsList($filter: GeneralGroupFilter!) {\n    generalGroups(filter: $filter) {\n      partyId\n      name\n      studentMembers {\n        memberCount\n      }\n      generalGroupType\n      programmeStages {\n        programme {\n          name\n        }\n      }\n    }\n  }\n"];
export function graphql(source: "\n  query enrolmentGroupsById($filter: GeneralGroupFilter!) {\n    generalGroups(filter: $filter) {\n      partyId\n      name\n      students {\n        partyId\n        firstName\n        lastName\n      }\n    }\n  }\n"): (typeof documents)["\n  query enrolmentGroupsById($filter: GeneralGroupFilter!) {\n    generalGroups(filter: $filter) {\n      partyId\n      name\n      students {\n        partyId\n        firstName\n        lastName\n      }\n    }\n  }\n"];
export function graphql(source: "\n  query customGroupById($filter: GeneralGroupFilter!) {\n    generalGroups(filter: $filter) {\n      partyId\n      name\n      students {\n        partyId\n        firstName\n        lastName\n      }\n      staff {\n        partyId\n        firstName\n        lastName\n      }\n    }\n  }\n"): (typeof documents)["\n  query customGroupById($filter: GeneralGroupFilter!) {\n    generalGroups(filter: $filter) {\n      partyId\n      name\n      students {\n        partyId\n        firstName\n        lastName\n      }\n      staff {\n        partyId\n        firstName\n        lastName\n      }\n    }\n  }\n"];
export function graphql(source: "\n  query subjectGroups {\n    subjectGroups {\n      partyId\n      name\n      subjects {\n        name\n      }\n      studentMembers {\n        memberCount\n      }\n      staff {\n        firstName\n        lastName\n        avatarUrl\n      }\n      irePP {\n        level\n      }\n      programmeStages {\n        programme {\n          name\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query subjectGroups {\n    subjectGroups {\n      partyId\n      name\n      subjects {\n        name\n      }\n      studentMembers {\n        memberCount\n      }\n      staff {\n        firstName\n        lastName\n        avatarUrl\n      }\n      irePP {\n        level\n      }\n      programmeStages {\n        programme {\n          name\n        }\n      }\n    }\n  }\n"];
export function graphql(source: "\n  query subjectGroupById($filter: SubjectGroupFilter!) {\n    subjectGroups(filter: $filter) {\n      partyId\n      name\n      students {\n        firstName\n        lastName\n        avatarUrl\n      }\n    }\n  }\n"): (typeof documents)["\n  query subjectGroupById($filter: SubjectGroupFilter!) {\n    subjectGroups(filter: $filter) {\n      partyId\n      name\n      students {\n        firstName\n        lastName\n        avatarUrl\n      }\n    }\n  }\n"];
export function graphql(source: "\n  query label($filter: LabelFilter) {\n    label(filter: $filter) {\n      id\n      name\n      personPartyId\n      colour\n      custom\n    }\n  }\n"): (typeof documents)["\n  query label($filter: LabelFilter) {\n    label(filter: $filter) {\n      id\n      name\n      personPartyId\n      colour\n      custom\n    }\n  }\n"];
export function graphql(source: "\n  mutation labelMutation($input: LabelInput) {\n    label(input: $input) {\n      id\n      name\n      personPartyId\n      colour\n      custom\n    }\n  }\n"): (typeof documents)["\n  mutation labelMutation($input: LabelInput) {\n    label(input: $input) {\n      id\n      name\n      personPartyId\n      colour\n      custom\n    }\n  }\n"];
export function graphql(source: "\n  query unreadCount($filter: UnreadCountFilter) {\n    unreadCount(filter: $filter) {\n      labelId\n      count\n    }\n  }\n"): (typeof documents)["\n  query unreadCount($filter: UnreadCountFilter) {\n    unreadCount(filter: $filter) {\n      labelId\n      count\n    }\n  }\n"];
export function graphql(source: "\n  mutation assignLabel($input: AssignLabelInput) {\n    assignLabel(input: $input) {\n      id\n      rootMailId\n      threadId\n      subject\n      body\n      senderPartyId\n      sentOn\n      latestMessage\n      canReply\n      starred\n      readOn\n      recipients {\n        id\n        recipientPartyId\n        recipientType\n        name\n      }\n      labels {\n        id\n        name\n        personPartyId\n        colour\n        custom\n      }\n      threads {\n        id\n        rootMailId\n        threadId\n        subject\n        body\n        senderPartyId\n        sentOn\n        latestMessage\n        canReply\n        starred\n        readOn\n        recipients {\n          id\n          recipientPartyId\n          recipientType\n          name\n        }\n        labels {\n          id\n          name\n          personPartyId\n          colour\n          custom\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation assignLabel($input: AssignLabelInput) {\n    assignLabel(input: $input) {\n      id\n      rootMailId\n      threadId\n      subject\n      body\n      senderPartyId\n      sentOn\n      latestMessage\n      canReply\n      starred\n      readOn\n      recipients {\n        id\n        recipientPartyId\n        recipientType\n        name\n      }\n      labels {\n        id\n        name\n        personPartyId\n        colour\n        custom\n      }\n      threads {\n        id\n        rootMailId\n        threadId\n        subject\n        body\n        senderPartyId\n        sentOn\n        latestMessage\n        canReply\n        starred\n        readOn\n        recipients {\n          id\n          recipientPartyId\n          recipientType\n          name\n        }\n        labels {\n          id\n          name\n          personPartyId\n          colour\n          custom\n        }\n      }\n    }\n  }\n"];
export function graphql(source: "\n  query mail($filter: MailFilter) {\n    mail(filter: $filter) {\n      id\n      rootMailId\n      threadId\n      subject\n      body\n      senderPartyId\n      sentOn\n      latestMessage\n      canReply\n      starred\n      readOn\n      recipients {\n        id\n        recipientPartyId\n        recipientType\n        name\n      }\n      labels {\n        id\n        name\n        personPartyId\n        colour\n        custom\n      }\n      threads {\n        id\n        rootMailId\n        threadId\n        subject\n        body\n        senderPartyId\n        sentOn\n        latestMessage\n        canReply\n        starred\n        readOn\n        recipients {\n          id\n          recipientPartyId\n          recipientType\n          name\n        }\n        labels {\n          id\n          name\n          personPartyId\n          colour\n          custom\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query mail($filter: MailFilter) {\n    mail(filter: $filter) {\n      id\n      rootMailId\n      threadId\n      subject\n      body\n      senderPartyId\n      sentOn\n      latestMessage\n      canReply\n      starred\n      readOn\n      recipients {\n        id\n        recipientPartyId\n        recipientType\n        name\n      }\n      labels {\n        id\n        name\n        personPartyId\n        colour\n        custom\n      }\n      threads {\n        id\n        rootMailId\n        threadId\n        subject\n        body\n        senderPartyId\n        sentOn\n        latestMessage\n        canReply\n        starred\n        readOn\n        recipients {\n          id\n          recipientPartyId\n          recipientType\n          name\n        }\n        labels {\n          id\n          name\n          personPartyId\n          colour\n          custom\n        }\n      }\n    }\n  }\n"];
export function graphql(source: "\n  mutation sendMail($input: SendMailInput) {\n    sendMail(input: $input) {\n      id\n      rootMailId\n      threadId\n      subject\n      body\n      senderPartyId\n      sentOn\n      latestMessage\n      canReply\n      starred\n      readOn\n      recipients {\n        id\n        recipientPartyId\n        recipientType\n        name\n      }\n      labels {\n        id\n        name\n        personPartyId\n        colour\n        custom\n      }\n      threads {\n        id\n        rootMailId\n        threadId\n        subject\n        body\n        senderPartyId\n        sentOn\n        latestMessage\n        canReply\n        starred\n        readOn\n        recipients {\n          id\n          recipientPartyId\n          recipientType\n          name\n        }\n        labels {\n          id\n          name\n          personPartyId\n          colour\n          custom\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation sendMail($input: SendMailInput) {\n    sendMail(input: $input) {\n      id\n      rootMailId\n      threadId\n      subject\n      body\n      senderPartyId\n      sentOn\n      latestMessage\n      canReply\n      starred\n      readOn\n      recipients {\n        id\n        recipientPartyId\n        recipientType\n        name\n      }\n      labels {\n        id\n        name\n        personPartyId\n        colour\n        custom\n      }\n      threads {\n        id\n        rootMailId\n        threadId\n        subject\n        body\n        senderPartyId\n        sentOn\n        latestMessage\n        canReply\n        starred\n        readOn\n        recipients {\n          id\n          recipientPartyId\n          recipientType\n          name\n        }\n        labels {\n          id\n          name\n          personPartyId\n          colour\n          custom\n        }\n      }\n    }\n  }\n"];
export function graphql(source: "\n  mutation starred($input: MailStarredInput) {\n    starred(input: $input)\n  }\n"): (typeof documents)["\n  mutation starred($input: MailStarredInput) {\n    starred(input: $input)\n  }\n"];
export function graphql(source: "\n  mutation read($input: MailReadInput) {\n    read(input: $input)\n  }\n"): (typeof documents)["\n  mutation read($input: MailReadInput) {\n    read(input: $input)\n  }\n"];
export function graphql(source: "\n  query core_studentContacts {\n    core_studentContacts {\n      partyId\n      person {\n        avatarUrl\n        firstName\n        lastName\n      }\n      personalInformation {\n        preferredFirstName\n        primaryPhoneNumber {\n          number\n        }\n        primaryEmail {\n          email\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query core_studentContacts {\n    core_studentContacts {\n      partyId\n      person {\n        avatarUrl\n        firstName\n        lastName\n      }\n      personalInformation {\n        preferredFirstName\n        primaryPhoneNumber {\n          number\n        }\n        primaryEmail {\n          email\n        }\n      }\n    }\n  }\n"];
export function graphql(source: "\n  query core_student_contacts($filter: StudentFilter!) {\n    core_students(filter: $filter) {\n      partyId\n      contacts {\n        partyId\n        person {\n          firstName\n          lastName\n          avatarUrl\n          type\n        }\n        personalInformation {\n          gender\n          nationality\n          primaryAddress {\n            line1\n            line2\n            line3\n            city\n            country\n            postCode\n          }\n          primaryPhoneNumber {\n            number\n            areaCode\n            countryCode\n          }\n          primaryEmail {\n            email\n          }\n        }\n        relationships {\n          relationshipType\n          primaryContact\n          allowedToContact\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query core_student_contacts($filter: StudentFilter!) {\n    core_students(filter: $filter) {\n      partyId\n      contacts {\n        partyId\n        person {\n          firstName\n          lastName\n          avatarUrl\n          type\n        }\n        personalInformation {\n          gender\n          nationality\n          primaryAddress {\n            line1\n            line2\n            line3\n            city\n            country\n            postCode\n          }\n          primaryPhoneNumber {\n            number\n            areaCode\n            countryCode\n          }\n          primaryEmail {\n            email\n          }\n        }\n        relationships {\n          relationshipType\n          primaryContact\n          allowedToContact\n        }\n      }\n    }\n  }\n"];
export function graphql(source: "\n  query core_student_personal($filter: StudentFilter!) {\n    core_students(filter: $filter) {\n      partyId\n      personalInformation {\n        firstName\n        lastName\n        preferredFirstName\n        middleName\n        gender\n        dateOfBirth\n        ire {\n          ppsNumber\n          religion\n          countryOfBirth\n        }\n        nationality\n        mothersMaidenName\n        primaryAddress {\n          line1\n          line2\n          line3\n          city\n          country\n          postCode\n        }\n        primaryPhoneNumber {\n          number\n          areaCode\n          countryCode\n        }\n        primaryEmail {\n          email\n        }\n      }\n      studentIrePP {\n        medicalCard\n        travellerHeritage\n        languageSupportApplicant\n        borderIndicator\n        examNumber\n        previousSchoolRollNumber\n      }\n    }\n  }\n"): (typeof documents)["\n  query core_student_personal($filter: StudentFilter!) {\n    core_students(filter: $filter) {\n      partyId\n      personalInformation {\n        firstName\n        lastName\n        preferredFirstName\n        middleName\n        gender\n        dateOfBirth\n        ire {\n          ppsNumber\n          religion\n          countryOfBirth\n        }\n        nationality\n        mothersMaidenName\n        primaryAddress {\n          line1\n          line2\n          line3\n          city\n          country\n          postCode\n        }\n        primaryPhoneNumber {\n          number\n          areaCode\n          countryCode\n        }\n        primaryEmail {\n          email\n        }\n      }\n      studentIrePP {\n        medicalCard\n        travellerHeritage\n        languageSupportApplicant\n        borderIndicator\n        examNumber\n        previousSchoolRollNumber\n      }\n    }\n  }\n"];
export function graphql(source: "\n  query core_students {\n    core_students {\n      partyId\n      person {\n        avatarUrl\n        firstName\n        lastName\n      }\n      classGroup {\n        name\n        staff {\n          firstName\n          lastName\n        }\n      }\n      personalInformation {\n        preferredFirstName\n        primaryPhoneNumber {\n          number\n        }\n        primaryEmail {\n          email\n        }\n      }\n      studentIrePP {\n        examNumber\n      }\n      tutors {\n        partyId\n        firstName\n        lastName\n        avatarUrl\n      }\n      yearGroupLeads {\n        partyId\n        firstName\n        lastName\n        avatarUrl\n      }\n      yearGroups {\n        name\n      }\n      programmeStages {\n        name\n        programme {\n          name\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query core_students {\n    core_students {\n      partyId\n      person {\n        avatarUrl\n        firstName\n        lastName\n      }\n      classGroup {\n        name\n        staff {\n          firstName\n          lastName\n        }\n      }\n      personalInformation {\n        preferredFirstName\n        primaryPhoneNumber {\n          number\n        }\n        primaryEmail {\n          email\n        }\n      }\n      studentIrePP {\n        examNumber\n      }\n      tutors {\n        partyId\n        firstName\n        lastName\n        avatarUrl\n      }\n      yearGroupLeads {\n        partyId\n        firstName\n        lastName\n        avatarUrl\n      }\n      yearGroups {\n        name\n      }\n      programmeStages {\n        name\n        programme {\n          name\n        }\n      }\n    }\n  }\n"];
export function graphql(source: "\n  query core_student($filter: StudentFilter!) {\n    core_students(filter: $filter) {\n      partyId\n      person {\n        avatarUrl\n        firstName\n        lastName\n      }\n      classGroup {\n        name\n        staff {\n          firstName\n          lastName\n        }\n      }\n      status {\n        sessionAttendance {\n          studentPartyId\n          name\n          status\n        }\n        currentLocation {\n          room {\n            roomId\n            name\n          }\n          lesson\n          teacher\n          currentAttendance {\n            attendanceCodeName\n            codeType\n          }\n        }\n        priorityStudent\n        activeSupportPlan\n      }\n    }\n  }\n"): (typeof documents)["\n  query core_student($filter: StudentFilter!) {\n    core_students(filter: $filter) {\n      partyId\n      person {\n        avatarUrl\n        firstName\n        lastName\n      }\n      classGroup {\n        name\n        staff {\n          firstName\n          lastName\n        }\n      }\n      status {\n        sessionAttendance {\n          studentPartyId\n          name\n          status\n        }\n        currentLocation {\n          room {\n            roomId\n            name\n          }\n          lesson\n          teacher\n          currentAttendance {\n            attendanceCodeName\n            codeType\n          }\n        }\n        priorityStudent\n        activeSupportPlan\n      }\n    }\n  }\n"];
export function graphql(source: "\n  mutation updateCoreStudents($input: [UpdateStudentInput]!) {\n    core_updateStudents(input: $input)\n  }\n"): (typeof documents)["\n  mutation updateCoreStudents($input: [UpdateStudentInput]!) {\n    core_updateStudents(input: $input)\n  }\n"];
export function graphql(source: "\n  query core_academicNamespaces {\n    core_academicNamespaces {\n      academicNamespaceId\n      type\n      name\n      year\n      description\n      isActiveDefaultNamespace\n    }\n  }\n"): (typeof documents)["\n  query core_academicNamespaces {\n    core_academicNamespaces {\n      academicNamespaceId\n      type\n      name\n      year\n      description\n      isActiveDefaultNamespace\n    }\n  }\n"];
export function graphql(source: "\n  mutation core_setActiveActiveAcademicNamespace(\n    $input: SetActiveAcademicNamespace\n  ) {\n    core_setActiveActiveAcademicNamespace(input: $input) {\n      academicNamespaceId\n      type\n      name\n      year\n      description\n      isActiveDefaultNamespace\n    }\n  }\n"): (typeof documents)["\n  mutation core_setActiveActiveAcademicNamespace(\n    $input: SetActiveAcademicNamespace\n  ) {\n    core_setActiveActiveAcademicNamespace(input: $input) {\n      academicNamespaceId\n      type\n      name\n      year\n      description\n      isActiveDefaultNamespace\n    }\n  }\n"];
export function graphql(source: "\n  query core_rooms {\n    core_rooms {\n      roomId\n      name\n      capacity\n    }\n  }\n"): (typeof documents)["\n  query core_rooms {\n    core_rooms {\n      roomId\n      name\n      capacity\n    }\n  }\n"];
export function graphql(source: "\n  query catalogueSubjects {\n    catalogue_subjects {\n      id\n      name\n      description\n      shortCode\n      nationalCode\n      subjectSource\n      colour\n      icon\n    }\n  }\n"): (typeof documents)["\n  query catalogueSubjects {\n    catalogue_subjects {\n      id\n      name\n      description\n      shortCode\n      nationalCode\n      subjectSource\n      colour\n      icon\n    }\n  }\n"];
export function graphql(source: "\n  query admin__party_people($tenant: Int!) {\n    admin__party_people(tenant: $tenant) {\n      partyId\n      firstName\n      lastName\n      type\n    }\n  }\n"): (typeof documents)["\n  query admin__party_people($tenant: Int!) {\n    admin__party_people(tenant: $tenant) {\n      partyId\n      firstName\n      lastName\n      type\n    }\n  }\n"];
export function graphql(source: "\n  query admin__tenants {\n    admin__tenants {\n      tenant\n      name\n      imgUrl\n    }\n  }\n"): (typeof documents)["\n  query admin__tenants {\n    admin__tenants {\n      tenant\n      name\n      imgUrl\n    }\n  }\n"];
export function graphql(source: "\n  query myAuthDetails {\n    myAuthDetails {\n      id\n      email\n      name\n      defaultProfileId\n      activeProfileId\n      profiles {\n        id\n        nickName\n        avatarUrl\n        tenant {\n          tenant\n          name\n          imgUrl\n        }\n        profileType {\n          name\n          description\n          userType\n        }\n        permissionIds\n        partyId\n      }\n    }\n  }\n"): (typeof documents)["\n  query myAuthDetails {\n    myAuthDetails {\n      id\n      email\n      name\n      defaultProfileId\n      activeProfileId\n      profiles {\n        id\n        nickName\n        avatarUrl\n        tenant {\n          tenant\n          name\n          imgUrl\n        }\n        profileType {\n          name\n          description\n          userType\n        }\n        permissionIds\n        partyId\n      }\n    }\n  }\n"];

export function graphql(source: string): unknown;
export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;