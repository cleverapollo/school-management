/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const documents = {
    "\n  query myAuthDetails {\n    myAuthDetails {\n      id\n      email\n      name\n      defaultProfileId\n      activeProfileId\n      profiles {\n        id\n        nickName\n        tenant {\n          tenant\n          name\n          imgUrl\n        }\n        profileType {\n          name\n          description\n        }\n        permissionIds\n      }\n    }\n  }\n": types.MyAuthDetailsDocument,
};

export function graphql(source: "\n  query myAuthDetails {\n    myAuthDetails {\n      id\n      email\n      name\n      defaultProfileId\n      activeProfileId\n      profiles {\n        id\n        nickName\n        tenant {\n          tenant\n          name\n          imgUrl\n        }\n        profileType {\n          name\n          description\n        }\n        permissionIds\n      }\n    }\n  }\n"): (typeof documents)["\n  query myAuthDetails {\n    myAuthDetails {\n      id\n      email\n      name\n      defaultProfileId\n      activeProfileId\n      profiles {\n        id\n        nickName\n        tenant {\n          tenant\n          name\n          imgUrl\n        }\n        profileType {\n          name\n          description\n        }\n        permissionIds\n      }\n    }\n  }\n"];

export function graphql(source: string): unknown;
export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;