/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const documents = {
    "\n  query admin__party_people($tenant: Int!) {\n    admin__party_people(tenant: $tenant) {\n      partyId\n      firstName\n      lastName\n      type\n    }\n  }\n": types.Admin__Party_PeopleDocument,
    "\n  query admin__tenants {\n    admin__tenants {\n      tenant\n      name\n      imgUrl\n    }\n  }\n": types.Admin__TenantsDocument,
    "\n  query myAuthDetails {\n    myAuthDetails {\n      id\n      email\n      name\n      defaultProfileId\n      activeProfileId\n      profiles {\n        id\n        nickName\n        tenant {\n          tenant\n          name\n          imgUrl\n        }\n        profileType {\n          name\n          description\n        }\n        permissionIds\n      }\n    }\n  }\n": types.MyAuthDetailsDocument,
};

export function graphql(source: "\n  query admin__party_people($tenant: Int!) {\n    admin__party_people(tenant: $tenant) {\n      partyId\n      firstName\n      lastName\n      type\n    }\n  }\n"): (typeof documents)["\n  query admin__party_people($tenant: Int!) {\n    admin__party_people(tenant: $tenant) {\n      partyId\n      firstName\n      lastName\n      type\n    }\n  }\n"];
export function graphql(source: "\n  query admin__tenants {\n    admin__tenants {\n      tenant\n      name\n      imgUrl\n    }\n  }\n"): (typeof documents)["\n  query admin__tenants {\n    admin__tenants {\n      tenant\n      name\n      imgUrl\n    }\n  }\n"];
export function graphql(source: "\n  query myAuthDetails {\n    myAuthDetails {\n      id\n      email\n      name\n      defaultProfileId\n      activeProfileId\n      profiles {\n        id\n        nickName\n        tenant {\n          tenant\n          name\n          imgUrl\n        }\n        profileType {\n          name\n          description\n        }\n        permissionIds\n      }\n    }\n  }\n"): (typeof documents)["\n  query myAuthDetails {\n    myAuthDetails {\n      id\n      email\n      name\n      defaultProfileId\n      activeProfileId\n      profiles {\n        id\n        nickName\n        tenant {\n          tenant\n          name\n          imgUrl\n        }\n        profileType {\n          name\n          description\n        }\n        permissionIds\n      }\n    }\n  }\n"];

export function graphql(source: string): unknown;
export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;