import { createGraphiQLFetcher } from '@graphiql/toolkit';
import { GraphiQL } from 'graphiql';
import '@graphiql/react/dist/style.css';
import 'graphiql/graphiql.css';
import { checkEmulationMode, EmulateHeaders, EmulationMode } from '@tyro/api';

const emulationHeaders = () => {
  const emulationMode = checkEmulationMode();
  const headers = {
    authorization: `Bearer ${localStorage.getItem('accessToken') as string}`,
  };
  if (emulationMode === EmulationMode.Tenant) {
    console.log(`-----------emulationMode: ${emulationMode}`);
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
  url:
    process.env.REACT_APP_GRAPHQL_API_URI ||
    'https://tyro-api-uat.azurewebsites.net/api/graphql',
  headers: {
    ...emulationHeaders(),
  },
});

const PageGraphiQL = () => <GraphiQL fetcher={fetcher} />;

export default PageGraphiQL;
