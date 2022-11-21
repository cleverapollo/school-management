import { GraphQLClient } from 'graphql-request';
import { Response } from 'graphql-request/dist/types';
import { EmulateHeaders } from './utils/emulate';
import { getToken } from './utils/jwt';

const getEndpoint = (isLocal?: boolean) =>
  isLocal
    ? 'http://localhost:80/api/graphql'
    : 'https://tyro-api-uat.azurewebsites.net/api/graphql';

// Need to setup a response middleware to handle auth errors
// function responseMiddleware(response: Response<unknown> | Error) {
//   console.log({ response });
// }

export const gqlClient = new GraphQLClient(getEndpoint(), {
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
