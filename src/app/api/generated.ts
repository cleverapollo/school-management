import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
import { CUSTOM_GROUP_TYPE, PROFILE_TYPE_NAMES, SUBJECT_GROUP_LEVEL } from '../../constants';
import { GroupTypes } from '../../components/table/types';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  _FieldSet: any;
};

/**    -------------- Inputs --------------- */
export type CreatePermissionInput = {
  id: Scalars['String'];
  translations?: InputMaybe<Array<InputMaybe<PermissionTranslationInput>>>;
};

export type CreateProfileForGlobalUserInput = {
  globalUserId: Scalars['Int'];
  isActive?: InputMaybe<Scalars['Boolean']>;
  profileTypeId: Scalars['Int'];
};

export type CreateRoleInput = {
  permissions?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  translations?: InputMaybe<RoleTranslationInput>;
};

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

export type Mutation = {
  __typename?: 'Mutation';
  addRecipe?: Maybe<Recipe>;
  createPermission?: Maybe<SecurityRole>;
  createProfileForGlobalUser?: Maybe<Profile>;
  createRole?: Maybe<SecurityRole>;
};


export type MutationAddRecipeArgs = {
  input?: InputMaybe<RecipeInput>;
};


export type MutationCreatePermissionArgs = {
  input?: InputMaybe<CreatePermissionInput>;
};


export type MutationCreateProfileForGlobalUserArgs = {
  input?: InputMaybe<CreateProfileForGlobalUserInput>;
};


export type MutationCreateRoleArgs = {
  input?: InputMaybe<CreateRoleInput>;
};

export type Permission = {
  __typename?: 'Permission';
  description: Scalars['String'];
  descriptionTextId: Scalars['Int'];
  id: Scalars['String'];
  name: Scalars['String'];
  nameTextId: Scalars['Int'];
};

export type PermissionTranslationInput = {
  description: Scalars['String'];
  locale: Scalars['String'];
  name: Scalars['String'];
};

export type PermissionsFilter = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type Profile = {
  __typename?: 'Profile';
  id: Scalars['Int'];
  nickName?: Maybe<Scalars['String']>;
  permissionIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  permissions?: Maybe<Array<Maybe<Permission>>>;
  profileType?: Maybe<ProfileType>;
  profileTypeId?: Maybe<Scalars['Int']>;
  tenant: Tenant;
  tenantId?: Maybe<Scalars['Int']>;
};

export type ProfileFilter = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export type UserProfileName = PROFILE_TYPE_NAMES.TURO_ADMIN |
  PROFILE_TYPE_NAMES.ADMIN |
  PROFILE_TYPE_NAMES.TEACHER |
  PROFILE_TYPE_NAMES.CONTACT |
  PROFILE_TYPE_NAMES.STUDENT;

export type ProfileType = {
  __typename?: 'ProfileType';
  defaultRoleIds?: Maybe<Array<Maybe<Scalars['Int']>>>;
  defaultRoles: Array<Maybe<SecurityRole>>;
  description: Scalars['String'];
  descriptionTextId?: Maybe<Scalars['Int']>;
  id: Scalars['Int'];
  name: UserProfileName;
  nameTextId?: Maybe<Scalars['Int']>;
  //ToDO: add userType and refactor access to pages from profileType.name to profileType.userType
};

export type ProfileTypeFilter = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export type Query = {
  __typename?: 'Query';
  _service?: Maybe<_Service>;
  myAuthDetails?: Maybe<GlobalUser>;
  permissions?: Maybe<Array<Maybe<Permission>>>;
  profileTypes?: Maybe<Array<Maybe<ProfileType>>>;
  profiles?: Maybe<Array<Maybe<ProfileType>>>;
  recipes?: Maybe<Array<Maybe<Recipe>>>;
  roles?: Maybe<Array<Maybe<SecurityRole>>>;
  tenants?: Maybe<Array<Maybe<Tenant>>>;
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


export type QueryTenantsArgs = {
  filter?: InputMaybe<TenantsFilter>;
};

export type Recipe = {
  __typename?: 'Recipe';
  items: Array<Maybe<RecipeItem>>;
  name: Scalars['String'];
};

export type RecipeInput = {
  items: Array<InputMaybe<RecipeItemInput>>;
  name?: InputMaybe<Scalars['String']>;
};

export type RecipeItem = {
  __typename?: 'RecipeItem';
  name?: Maybe<Scalars['String']>;
};

export type RecipeItemInput = {
  name?: InputMaybe<Scalars['String']>;
};

export type RoleTranslationInput = {
  description: Scalars['String'];
  locale: Scalars['String'];
  name: Scalars['String'];
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

export type Tenant = {
  __typename?: 'Tenant';
  imgUrl: Scalars['String'];
  name: Scalars['String'];
  tenant: Scalars['Int'];
};

export type PartyPerson = {
  __typename?: 'PartyPerson';
  partyId: number;
  firstName: string;
  lastName: string;
  type: string;
  tenant?: number;
  name?: string; 
}

export type TenantsFilter = {
  tenants?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export type _Service = {
  __typename?: '_Service';
  sdl: Scalars['String'];
};

export type MyAuthDetailsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyAuthDetailsQuery = { __typename?: 'Query', myAuthDetails?: { __typename?: 'GlobalUser', id: number, email?: string | null, name?: string | null, defaultProfileId?: number | null, activeProfileId?: number | null, profiles?: Array<{ __typename?: 'Profile', id: number, nickName?: string | null, permissionIds?: Array<string | null> | null, tenant: { __typename?: 'Tenant', tenant: number, name: string, imgUrl: string }, profileType?: { __typename?: 'ProfileType', name: string, description: string } | null } | null> | null } | null };


export const MyAuthDetailsDocument = gql`
  query myAuthDetails {
    myAuthDetails {
      id
      email
      name
      defaultProfileId
      activeProfileId
      profiles {
        id
        nickName
        tenant {
          tenant
          name
          imgUrl
        }
        profileType {
          name
          description
        }
        permissionIds
      }
    }
  }
    `;

/**
 * __useMyAuthDetailsQuery__
 *
 * To run a query within a React component, call `useMyAuthDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyAuthDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyAuthDetailsQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyAuthDetailsQuery(baseOptions?: Apollo.QueryHookOptions<MyAuthDetailsQuery, MyAuthDetailsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<MyAuthDetailsQuery, MyAuthDetailsQueryVariables>(MyAuthDetailsDocument, options);
}
export function useMyAuthDetailsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyAuthDetailsQuery, MyAuthDetailsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<MyAuthDetailsQuery, MyAuthDetailsQueryVariables>(MyAuthDetailsDocument, options);
}
export type MyAuthDetailsQueryHookResult = ReturnType<typeof useMyAuthDetailsQuery>;
export type MyAuthDetailsLazyQueryHookResult = ReturnType<typeof useMyAuthDetailsLazyQuery>;
export type MyAuthDetailsQueryResult = Apollo.QueryResult<MyAuthDetailsQuery, MyAuthDetailsQueryVariables>;

/////////////////////////////////////////////////////////////

export type MyAdminTenantsQuery = { 
  __typename?: 'Query',
  admin__tenants: Array<{ 
    __typename?: 'Tenant';
    imgUrl: Scalars['String'];
    name: Scalars['String'];
    tenant: Scalars['Int'];
  }>
}

export const MyAdminTenantsDocument = gql`
  query admin__tenants{
    admin__tenants{
      tenant
      name
      imgUrl
    }
  }
`;

export type MyAdminPartyPeopleQuery = { 
  __typename?: 'Query',
  admin__party_people: Array<{ 
    __typename?: 'Party Person';
    partyId: Scalars['Int'];
    firstName: Scalars['String'];
    lastName: Scalars['String'];
    type: Scalars['String'];
  }>
}

export const MyAdminPartyPeopleDocument = gql`
  query admin__party_people($tenant: Int!){
    admin__party_people(tenant: $tenant){
      partyId
      firstName
      lastName
      type
    }
  }
`;

export type MyAdminTenantsQueryVariables = Exact<{ [key: string]: never; }>;
export type MyAdminPartyPeopleQueryVariables = Exact<{ [key: string]: number; }>;

export function useMyAdminTenantsQuery(baseOptions?: Apollo.QueryHookOptions<MyAdminTenantsQuery, MyAdminTenantsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<MyAdminTenantsQuery, MyAdminTenantsQueryVariables>(MyAdminTenantsDocument, options);
}

export type MyAdminTenantsQueryHookResult = ReturnType<typeof useMyAdminTenantsQuery>;
export type useMyAdminTenantsQueryResult = Apollo.QueryResult<MyAdminTenantsQuery, MyAdminTenantsQueryVariables>;

/////////////////////////////////////////////////////


export interface EnrolmentGroup {
  name: string;
  members: string;
  year: string;
  tutor: string;
  yearhead: string;
  programme: string;
  id: string;
}

export type SubjectGroupLevel = SUBJECT_GROUP_LEVEL.HIGHER | SUBJECT_GROUP_LEVEL.ORDINARY | SUBJECT_GROUP_LEVEL.COMMON;

export interface SubjectGroup {
  name: string;
  subject: string;
  members: string;
  level: SubjectGroupLevel;
  teacher?: string;
  programme?: string;
  id: string;
}

export type TypeOfCustomGroup = CUSTOM_GROUP_TYPE.DYNAMIC | CUSTOM_GROUP_TYPE.STATIC;

export interface CustomGroup {
  name: string;
  members: string;
  type: TypeOfCustomGroup;
  created: string;
  id: string;
}

export type EnrolmentGroupQuery = { 
  __typename?: 'Query',
  generalGroups: Array<{ 
    __typename?: 'GeneralGroups';
    partyId: Scalars['Int'];
    name: string;
    studentCount: Scalars['Int'];
    // year: string;
    // tutor: string;
    // yearhead: string;
    programmeStages: Array<{
      programmeStage: {
        programme: {
          name: string;
        }
      }
    }>;
  }>
}

export const EnrolmentGroupDocument = gql`
  query generalGroups{
    generalGroups{
      partyId
      name
      studentCount
      programmeStages {
        programmeStage {
          programme {
            name
          }
        }
      }
    }
  }
`;

export type SubjectGroupQuery = { 
  __typename?: 'Query',
  subjectGroups: Array<{ 
    __typename?: 'SubjectGroups';
    partyId: Scalars['Int'];
    name: string;
    subjects: Array<{
      name: string;
    }>;
    studentCount: Scalars['Int'];
    irePP: {
      level: SubjectGroupLevel;
    }
    //teacher: string;
    programmeStages: Array<{
      programmeStage: {
        programme: {
          name: string;
        }
      }
    }>;
  }>
}

export const SubjectGroupDocument = gql`
  query subjectGroups{
    subjectGroups{
      partyId
      name
      subjects{
        name
      }
      studentCount
      irePP{
        level
      }
      programmeStages {
        programmeStage {
          programme {
            name
          }
        }
      }
    }
  }
`;

export type CustomGroupQuery = { 
  __typename?: 'Query',
  customGroups: Array<{ 
    __typename?: 'CustomGroups';
    partyId: Scalars['Int'];
    name: string;
    members: string;
    type: TypeOfCustomGroup;
    created: string;
  }>
}

export const CustomGroupDocument = gql`
  query customGroups{
    customGroups{
      partyId
      name
      members
      type
      created
    }
  }
`;


/////////////////////////////////////////////////////


export interface EnrolmentGroupListItem {
  name: string;
  avatarUrl: string;
  currentActivity: string;
  additionalInformation: string;
}

export interface SubjectGroupListItem {
  name: string;
  avatarUrl: string;
  class: string;
  level: SubjectGroupLevel;
  additionalInformation: string;
  examinable: string;
  tutor: string;
}

export interface CustomGroupListItem {
  name: string;
  avatarUrl: string;
  class: string;
  year: string;
  tutor: string;
  yearhead: string;
  programme: string;
}

interface ExactGroup {
  name: string;
  id: string;
  type: GroupTypes;
  list: EnrolmentGroupListItem[] | SubjectGroupListItem[] | CustomGroupListItem[];
}
