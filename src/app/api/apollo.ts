import { setContext } from "@apollo/client/link/context";
import { ApolloClient, createHttpLink, DefaultOptions, InMemoryCache, HttpLink, ApolloLink, from} from "@apollo/client";

const authLink = setContext((_, { headers }) => {
  // get the authentication token from ApplicationSettings if it exists
  const token =  localStorage.getItem('accessToken');

  // return the headers to the context so HTTP link can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null
    }
  }
});

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  // uri: 'http://localhost:8082/api/graphql',
  uri: 'https://tyro-api-uat.azurewebsites.net/api/graphql',
});

const emulateMiddleware = new ApolloLink((operation, forward) => {
  // add the emulate custom header to the headers
  const customHeaders: { [key: string]: string | null } = {};
  if (localStorage.getItem('X-TENANT-ID') && localStorage.getItem('X-PARTY-ID')) {
    customHeaders['X-TENANT-ID'] = localStorage.getItem('X-TENANT-ID');
    customHeaders['X-PARTY-ID'] = localStorage.getItem('X-PARTY-ID');
  }
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      ...customHeaders,
    }
  }));

  return forward(operation);
})

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
}


// Cache implementation
const cache = new InMemoryCache()

// Create the apollo client
export const apolloClient = new ApolloClient({
  link:  from([ emulateMiddleware, authLink, httpLink ]),
  cache,
  defaultOptions
})
