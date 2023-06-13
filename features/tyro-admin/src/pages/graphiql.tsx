import { createGraphiQLFetcher } from '@graphiql/toolkit';
import { GraphiQL } from 'graphiql';
import '@graphiql/react/dist/style.css';
import 'graphiql/graphiql.css';
import {
  checkEmulationMode,
  EmulateHeaders,
  EmulationMode,
  getEndpoint,
} from '@tyro/api';

const emulationHeaders = () => {
  const emulationMode = checkEmulationMode();
  const headers = {
    authorization: `Bearer ${localStorage.getItem('accessToken') as string}`,
  };
  if (emulationMode === EmulationMode.Tenant) {
    return {
      ...headers,
      [EmulateHeaders.TENANT]: localStorage.getItem(
        EmulateHeaders.TENANT
      ) as string,
    };
  }
  if (emulationMode === EmulationMode.User) {
    return {
      ...headers,
      [EmulateHeaders.TENANT]: localStorage.getItem(
        EmulateHeaders.TENANT
      ) as string,
      [EmulateHeaders.PARTY_ID]: localStorage.getItem(
        EmulateHeaders.PARTY_ID
      ) as string,
    };
  }
  return headers;
};

const fetcher = createGraphiQLFetcher({
  url: getEndpoint(),
  headers: {
    ...emulationHeaders(),
  },
});

const PageGraphiQL = () => <GraphiQL fetcher={fetcher} />;

export default PageGraphiQL;
