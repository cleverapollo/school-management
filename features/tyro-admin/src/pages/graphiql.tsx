import { createGraphiQLFetcher } from '@graphiql/toolkit';
import { GraphiQL } from 'graphiql';
import '@graphiql/react/dist/style.css';
import 'graphiql/graphiql.css';

const fetcher = createGraphiQLFetcher({
  url: 'https://tyro-api-uat.azurewebsites.net/api/graphql',
  headers: {
    authorization: `Bearer ${localStorage.getItem('accessToken') as string}`,
  },
});

const PageGraphiQL = () => <GraphiQL fetcher={fetcher} />;

export default PageGraphiQL;
