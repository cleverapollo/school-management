/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const documents = {
    "\n  query myAuthDetails {\n    myAuthDetails {\n      id\n      email\n      name\n      defaultProfileId\n      activeProfileId\n      profiles {\n        id\n        nickName\n        tenant {\n          tenant\n          name\n          imgUrl\n        }\n        profileType {\n          name\n          description\n          userType\n        }\n        permissionIds\n      }\n    }\n  }\n": types.MyAuthDetailsDocument,
    "\n  query admin__party_people($tenant: Int!) {\n    admin__party_people(tenant: $tenant) {\n      partyId\n      firstName\n      lastName\n      type\n    }\n  }\n": types.Admin__Party_PeopleDocument,
    "\n  query admin__tenants {\n    admin__tenants {\n      tenant\n      name\n      imgUrl\n    }\n  }\n": types.Admin__TenantsDocument,
    "\n  query generalGroupsList($filter: GeneralGroupFilter!) {\n    generalGroups(filter: $filter){\n      partyId\n      name\n      studentCount\n      generalGroupType\n      programmeStages {\n        programmeStage {\n          programme {\n            name\n          }\n        }\n      }\n    }\n  }\n": types.GeneralGroupsListDocument,
    "\n  query enrolmentGroupsById($filter: GeneralGroupFilter!) {\n    generalGroups(filter: $filter){\n      partyId\n      name,\n      students {\n        partyId\n        firstName\n        lastName\n      }\n    }\n  }\n": types.EnrolmentGroupsByIdDocument,
    "\n  query customGroupById($filter: GeneralGroupFilter!) {\n    generalGroups(filter: $filter){\n      partyId\n      name,\n      students {\n        partyId\n        firstName\n        lastName\n      }\n      staff {\n        partyId\n        firstName\n        lastName\n      }\n    }\n  }\n": types.CustomGroupByIdDocument,
    "\n  query subjectGroups{\n    subjectGroups{\n      partyId\n      name\n      subjects{\n        name\n      }\n      studentCount\n      staff{\n        partyId\n        firstName\n        lastName\n      }\n      irePP{\n        level\n      }\n      programmeStages {\n        programmeStage {\n          programme {\n            name\n          }\n        }\n      }\n    }\n  }\n": types.SubjectGroupsDocument,
    "\n  query subjectGroupById($filter: SubjectGroupFilter!){\n    subjectGroups(filter: $filter) {\n      partyId\n      name\n      students {\n        partyId\n        firstName\n        lastName\n      }\n    }\n  }\n": types.SubjectGroupByIdDocument,
    "\n  query label($filter: LabelFilter){\n    label(filter: $filter){\n      id\n      name\n      personPartyId\n      colour\n      custom\n    }\n  }\n": types.LabelDocument,
    "\n  query mail($filter: MailFilter){\n    mail(filter: $filter){\n      id\n      rootMailId\n      threadId\n      subject\n      body\n      senderPartyId\n      sentOn\n      latestMessage\n      canReply\n      starred\n      readOn\n      recipients{\n        id\n        recipientPartyId\n        recipientType\n        name\n      }\n      labels{\n        id\n        name\n        personPartyId\n        colour\n        custom\n      }\n      threads{\n        id\n        rootMailId\n        threadId\n        subject\n        body\n        senderPartyId\n        sentOn\n        latestMessage\n        canReply\n        starred\n        readOn\n        recipients{\n          id\n          recipientPartyId\n          recipientType\n          name\n        }\n        labels{\n          id\n          name\n          personPartyId\n          colour\n          custom\n        }\n      }\n    }\n  }\n": types.MailDocument,
    "\n  mutation sendMail($input: SendMailInput){\n    sendMail(input: $input){\n      id\n      rootMailId\n      threadId\n      subject\n      body\n      senderPartyId\n      sentOn\n      latestMessage\n      canReply\n      starred\n      readOn\n      recipients{\n        id\n        recipientPartyId\n        recipientType\n        name\n      }\n      labels{\n        id\n        name\n        personPartyId\n        colour\n        custom\n      }\n      threads{\n        id\n        rootMailId\n        threadId\n        subject\n        body\n        senderPartyId\n        sentOn\n        latestMessage\n        canReply\n        starred\n        readOn\n        recipients{\n          id\n          recipientPartyId\n          recipientType\n          name\n        }\n        labels{\n          id\n          name\n          personPartyId\n          colour\n          custom\n        }\n      }\n    }\n  }\n": types.SendMailDocument,
    "\n  mutation starred($input: MailStarredInput){\n    starred(input: $input)\n  }\n": types.StarredDocument,
};

export function graphql(source: "\n  query myAuthDetails {\n    myAuthDetails {\n      id\n      email\n      name\n      defaultProfileId\n      activeProfileId\n      profiles {\n        id\n        nickName\n        tenant {\n          tenant\n          name\n          imgUrl\n        }\n        profileType {\n          name\n          description\n          userType\n        }\n        permissionIds\n      }\n    }\n  }\n"): (typeof documents)["\n  query myAuthDetails {\n    myAuthDetails {\n      id\n      email\n      name\n      defaultProfileId\n      activeProfileId\n      profiles {\n        id\n        nickName\n        tenant {\n          tenant\n          name\n          imgUrl\n        }\n        profileType {\n          name\n          description\n          userType\n        }\n        permissionIds\n      }\n    }\n  }\n"];
export function graphql(source: "\n  query admin__party_people($tenant: Int!) {\n    admin__party_people(tenant: $tenant) {\n      partyId\n      firstName\n      lastName\n      type\n    }\n  }\n"): (typeof documents)["\n  query admin__party_people($tenant: Int!) {\n    admin__party_people(tenant: $tenant) {\n      partyId\n      firstName\n      lastName\n      type\n    }\n  }\n"];
export function graphql(source: "\n  query admin__tenants {\n    admin__tenants {\n      tenant\n      name\n      imgUrl\n    }\n  }\n"): (typeof documents)["\n  query admin__tenants {\n    admin__tenants {\n      tenant\n      name\n      imgUrl\n    }\n  }\n"];
export function graphql(source: "\n  query generalGroupsList($filter: GeneralGroupFilter!) {\n    generalGroups(filter: $filter){\n      partyId\n      name\n      studentCount\n      generalGroupType\n      programmeStages {\n        programmeStage {\n          programme {\n            name\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query generalGroupsList($filter: GeneralGroupFilter!) {\n    generalGroups(filter: $filter){\n      partyId\n      name\n      studentCount\n      generalGroupType\n      programmeStages {\n        programmeStage {\n          programme {\n            name\n          }\n        }\n      }\n    }\n  }\n"];
export function graphql(source: "\n  query enrolmentGroupsById($filter: GeneralGroupFilter!) {\n    generalGroups(filter: $filter){\n      partyId\n      name,\n      students {\n        partyId\n        firstName\n        lastName\n      }\n    }\n  }\n"): (typeof documents)["\n  query enrolmentGroupsById($filter: GeneralGroupFilter!) {\n    generalGroups(filter: $filter){\n      partyId\n      name,\n      students {\n        partyId\n        firstName\n        lastName\n      }\n    }\n  }\n"];
export function graphql(source: "\n  query customGroupById($filter: GeneralGroupFilter!) {\n    generalGroups(filter: $filter){\n      partyId\n      name,\n      students {\n        partyId\n        firstName\n        lastName\n      }\n      staff {\n        partyId\n        firstName\n        lastName\n      }\n    }\n  }\n"): (typeof documents)["\n  query customGroupById($filter: GeneralGroupFilter!) {\n    generalGroups(filter: $filter){\n      partyId\n      name,\n      students {\n        partyId\n        firstName\n        lastName\n      }\n      staff {\n        partyId\n        firstName\n        lastName\n      }\n    }\n  }\n"];
export function graphql(source: "\n  query subjectGroups{\n    subjectGroups{\n      partyId\n      name\n      subjects{\n        name\n      }\n      studentCount\n      staff{\n        partyId\n        firstName\n        lastName\n      }\n      irePP{\n        level\n      }\n      programmeStages {\n        programmeStage {\n          programme {\n            name\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query subjectGroups{\n    subjectGroups{\n      partyId\n      name\n      subjects{\n        name\n      }\n      studentCount\n      staff{\n        partyId\n        firstName\n        lastName\n      }\n      irePP{\n        level\n      }\n      programmeStages {\n        programmeStage {\n          programme {\n            name\n          }\n        }\n      }\n    }\n  }\n"];
export function graphql(source: "\n  query subjectGroupById($filter: SubjectGroupFilter!){\n    subjectGroups(filter: $filter) {\n      partyId\n      name\n      students {\n        partyId\n        firstName\n        lastName\n      }\n    }\n  }\n"): (typeof documents)["\n  query subjectGroupById($filter: SubjectGroupFilter!){\n    subjectGroups(filter: $filter) {\n      partyId\n      name\n      students {\n        partyId\n        firstName\n        lastName\n      }\n    }\n  }\n"];
export function graphql(source: "\n  query label($filter: LabelFilter){\n    label(filter: $filter){\n      id\n      name\n      personPartyId\n      colour\n      custom\n    }\n  }\n"): (typeof documents)["\n  query label($filter: LabelFilter){\n    label(filter: $filter){\n      id\n      name\n      personPartyId\n      colour\n      custom\n    }\n  }\n"];
export function graphql(source: "\n  query mail($filter: MailFilter){\n    mail(filter: $filter){\n      id\n      rootMailId\n      threadId\n      subject\n      body\n      senderPartyId\n      sentOn\n      latestMessage\n      canReply\n      starred\n      readOn\n      recipients{\n        id\n        recipientPartyId\n        recipientType\n        name\n      }\n      labels{\n        id\n        name\n        personPartyId\n        colour\n        custom\n      }\n      threads{\n        id\n        rootMailId\n        threadId\n        subject\n        body\n        senderPartyId\n        sentOn\n        latestMessage\n        canReply\n        starred\n        readOn\n        recipients{\n          id\n          recipientPartyId\n          recipientType\n          name\n        }\n        labels{\n          id\n          name\n          personPartyId\n          colour\n          custom\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query mail($filter: MailFilter){\n    mail(filter: $filter){\n      id\n      rootMailId\n      threadId\n      subject\n      body\n      senderPartyId\n      sentOn\n      latestMessage\n      canReply\n      starred\n      readOn\n      recipients{\n        id\n        recipientPartyId\n        recipientType\n        name\n      }\n      labels{\n        id\n        name\n        personPartyId\n        colour\n        custom\n      }\n      threads{\n        id\n        rootMailId\n        threadId\n        subject\n        body\n        senderPartyId\n        sentOn\n        latestMessage\n        canReply\n        starred\n        readOn\n        recipients{\n          id\n          recipientPartyId\n          recipientType\n          name\n        }\n        labels{\n          id\n          name\n          personPartyId\n          colour\n          custom\n        }\n      }\n    }\n  }\n"];
export function graphql(source: "\n  mutation sendMail($input: SendMailInput){\n    sendMail(input: $input){\n      id\n      rootMailId\n      threadId\n      subject\n      body\n      senderPartyId\n      sentOn\n      latestMessage\n      canReply\n      starred\n      readOn\n      recipients{\n        id\n        recipientPartyId\n        recipientType\n        name\n      }\n      labels{\n        id\n        name\n        personPartyId\n        colour\n        custom\n      }\n      threads{\n        id\n        rootMailId\n        threadId\n        subject\n        body\n        senderPartyId\n        sentOn\n        latestMessage\n        canReply\n        starred\n        readOn\n        recipients{\n          id\n          recipientPartyId\n          recipientType\n          name\n        }\n        labels{\n          id\n          name\n          personPartyId\n          colour\n          custom\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation sendMail($input: SendMailInput){\n    sendMail(input: $input){\n      id\n      rootMailId\n      threadId\n      subject\n      body\n      senderPartyId\n      sentOn\n      latestMessage\n      canReply\n      starred\n      readOn\n      recipients{\n        id\n        recipientPartyId\n        recipientType\n        name\n      }\n      labels{\n        id\n        name\n        personPartyId\n        colour\n        custom\n      }\n      threads{\n        id\n        rootMailId\n        threadId\n        subject\n        body\n        senderPartyId\n        sentOn\n        latestMessage\n        canReply\n        starred\n        readOn\n        recipients{\n          id\n          recipientPartyId\n          recipientType\n          name\n        }\n        labels{\n          id\n          name\n          personPartyId\n          colour\n          custom\n        }\n      }\n    }\n  }\n"];
export function graphql(source: "\n  mutation starred($input: MailStarredInput){\n    starred(input: $input)\n  }\n"): (typeof documents)["\n  mutation starred($input: MailStarredInput){\n    starred(input: $input)\n  }\n"];

export function graphql(source: string): unknown;
export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;