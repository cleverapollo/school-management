import { createGraphiQLFetcher } from '@graphiql/toolkit';
import { GraphiQL } from 'graphiql';
import '@graphiql/react/dist/style.css';
import 'graphiql/graphiql.css';
import { checkIsUserEmulated, EmulateHeaders } from '@tyro/api';

const fetcher = createGraphiQLFetcher({
  url: 'https://tyro-api-uat.azurewebsites.net/api/graphql',
  headers: {
    authorization: `Bearer ${localStorage.getItem('accessToken') as string}`,
    ...(checkIsUserEmulated() && {
      [EmulateHeaders.TENANT]: localStorage.getItem(
        EmulateHeaders.TENANT
      ) as string,
      [EmulateHeaders.PARTY_ID]: localStorage.getItem(
        EmulateHeaders.PARTY_ID
      ) as string,
    }),
  },
});

const PageGraphiQL = () => <GraphiQL fetcher={fetcher} />;

export default PageGraphiQL;
