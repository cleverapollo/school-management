import { GraphQLClient } from 'graphql-request';
import {
  checkEmulationMode,
  EmulateHeaders,
  EmulationMode,
} from './utils/emulate';
import { getToken } from './utils/jwt';
import { acquireMsalToken } from './utils/msal-configs';

export const getEndpoint = () =>
  process.env.REACT_APP_GRAPHQL_API_URI ||
  `${window.location.origin}/api/tyrogql`;

type FetchArguments = Parameters<typeof fetch>;

const getAuthHeaders = (
  ...args: [url: RequestInfo | URL, init?: RequestInit | undefined]
) => {
  const headers: HeadersInit = {};
  const emulationMode = checkEmulationMode();

  // get the authentication token from ApplicationSettings if it exists
  const token = getToken();
  if (typeof token === 'string') {
    headers.authorization = `Bearer ${token}`;
  }

  // headers['X-THROW-HTTP-ERROR'] = '401';

  // add the emulate custom header to the headers
  const tenantId = localStorage.getItem(EmulateHeaders.TENANT);
  const partyId = localStorage.getItem(EmulateHeaders.PARTY_ID);
  if (emulationMode === EmulationMode.Tenant && typeof tenantId === 'string') {
    headers[EmulateHeaders.TENANT] = tenantId;
  }

  if (
    emulationMode === EmulationMode.User &&
    typeof tenantId === 'string' &&
    typeof partyId === 'string'
  ) {
    headers[EmulateHeaders.TENANT] = tenantId;
    headers[EmulateHeaders.PARTY_ID] = partyId;
  }

  const academicNamespaceId = localStorage.getItem(
    EmulateHeaders.ACADEMIC_NAMESPACE_ID
  );
  if (typeof academicNamespaceId === 'string') {
    headers[EmulateHeaders.ACADEMIC_NAMESPACE_ID] = academicNamespaceId;
  }

  args[1] = {
    ...args[1],
    headers: {
      ...args[1]?.headers,
      ...headers,
    },
  };

  return args;
};

async function fetchInstance(...args: FetchArguments) {
  const patchedArgs = getAuthHeaders(...args);
  const response = await fetch(...patchedArgs);

  // Try to acquire a new token if the response is 401
  if (response?.status === 401) {
    const newToken = await acquireMsalToken();

    if (newToken) {
      return fetch(patchedArgs[0], {
        ...patchedArgs[1],
        headers: {
          ...patchedArgs[1]?.headers,
          authorization: `Bearer ${newToken}`,
        },
      });
    }
  }

  return response;
}

export async function fetchClient<TResponse = unknown>(
  url: string,
  options?: RequestInit
) {
  try {
    const endpoint = new URL(url, getEndpoint());
    const response = await fetchInstance(endpoint, {
      ...options,
    });

    if (!response.ok) {
      const error = (await response.json()) as unknown;
      return await Promise.reject(error);
    }

    return (await response.json()) as TResponse;
  } catch (error) {
    return Promise.reject(error);
  }
}

export const gqlClient = new GraphQLClient(getEndpoint(), {
  fetch: fetchInstance,
});