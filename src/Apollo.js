import {
  ApolloClient,
  createHttpLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client/core";

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: "https://sound-crayfish-99.hasura.app/v1/graphql",
});

// Cache implementation
const cache = new InMemoryCache();

// Create the apollo client
// const apolloClient = new ApolloClient({
//   link: httpLink,
//   cache,
// });

const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://sound-crayfish-99.hasura.app/v1/graphql",
    headers: {
      "x-hasura-admin-secret":
        "YatUam3ho7I7tvkXFdhcwAVzR6k1Y2vedc9tu7lKtJ2iIQDWGMH2p8FRkkLhEPwL",
    },
  }),
  cache: new InMemoryCache(),
});
export default apolloClient;


