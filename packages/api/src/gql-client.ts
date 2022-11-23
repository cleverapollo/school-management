import { GraphQLClient } from 'graphql-request';
import { Response } from 'graphql-request/dist/types';
import polly from 'polly-js';
import { EmulateHeaders } from './utils/emulate';
import { getToken } from './utils/jwt';
import { acquireMsalToken } from './utils/msal-configs';

const getEndpoint = (isLocal?: boolean) =>
  isLocal
    ? 'http://localhost:80/api/graphql'
    : 'https://tyro-api-uat.azurewebsites.net/api/graphql';

type FetchInstance = (
  url: RequestInfo | URL,
  init?: RequestInit | undefined
) => Promise<any>;

const fetchInstance: FetchInstance = (...args) =>
  polly()
    .handle((error: Response<unknown>) => error?.status === 401)
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

    // get the authentication token from ApplicationSettings if it exists
    const token = getToken();
    if (typeof token === 'string') {
      headers.authorization = `Bearer ${token}`;
    }

    // add the emulate custom header to the headers
    const tenantId = localStorage.getItem(EmulateHeaders.TENANT);
    const partyId = localStorage.getItem(EmulateHeaders.PARTY_ID);
    if (typeof tenantId === 'string' && typeof partyId === 'string') {
      headers[EmulateHeaders.TENANT] = tenantId;
      headers[EmulateHeaders.PARTY_ID] = partyId;
    }

    return headers;
  },
});
