import { GraphQLClient } from 'graphql-request';
import polly from 'polly-js';
import {
  checkEmulationMode,
  EmulateHeaders,
  EmulationMode,
} from './utils/emulate';
import { getToken } from './utils/jwt';
import { acquireMsalToken } from './utils/msal-configs';

const getEndpoint = () =>
  process.env.REACT_APP_GRAPHQL_API_URI ||
  'https://tyro-api-uat.azurewebsites.net/api/graphql';

type FetchInstance = (
  url: RequestInfo | URL,
  init?: RequestInit | undefined
) => Promise<any>;

const fetchInstance: FetchInstance = (...args) =>
  polly()
    .handle((error: Response) => error?.status === 401)
    .retry(1)
    .executeForPromise(async () => {
      const response = await fetch(...args);

      if (response?.status === 401) {
        await acquireMsalToken();
        return Promise.reject(response);
      }

      return response;
    });

export const gqlClient = new GraphQLClient(getEndpoint(), {
  fetch: fetchInstance,
  headers: () => {
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
    if (
      emulationMode === EmulationMode.Tenant &&
      typeof tenantId === 'string'
    ) {
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

    console.log('---------------------------------');
    console.log(headers);
    return headers;
  },
});
