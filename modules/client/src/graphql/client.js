import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import { ApolloLink } from "apollo-link";
import { BatchHttpLink } from "apollo-link-batch-http";
import { History } from "history";
// import { buildErrorLink } from "./error-link";
// import { ClientSideResolvers } from "./resolvers";
// import { DEFAULTS } from "./client-state";
import { compact } from "lodash-es";
import { setContext } from 'apollo-link-context';
import { Auth } from "aws-amplify";
import { createHttpLink } from 'apollo-link-http';
import { createAppSyncLink } from "aws-appsync"
import {awsconfig} from '../aws-exports';

export function buildGraphqlClient(opts) {
  const { history, fetch, uri, prefixLink } = {
    uri: "/graphql",
    ...opts,
  };
  const cache = new InMemoryCache();
  // const errorLink = buildErrorLink(history);
  const httpLink = createHttpLink({
    uri: awsconfig.appsync_url,
  });
  
  const awsLink = createAppSyncLink({
    url: awsconfig.appsync_url,
    region: awsconfig.appsync_region,
    auth: {
      type: awsconfig.appsync_auth_type,
      credentials: () => Auth.currentCredentials(),
      jwtToken: async () =>
        (await Auth.currentSession()).getAccessToken().getJwtToken()
    },
    complexObjectsCredentials: () => Auth.currentCredentials()
   })

   
  const links = [
    // errorLink,
    ...compact([prefixLink]),
   awsLink, 
   httpLink,
    new BatchHttpLink({
      uri: uri,
      batchInterval: 10,
      credentials: "same-origin",
      fetch,
    }),
  ];
  const link = ApolloLink.from(links);
  const client = new ApolloClient({
    cache: cache,
    link,
    defaultOptions: {
      watchQuery: {
        // this governs the default fetch policy for react-apollo useQuery():
        fetchPolicy: "cache-and-network",
      },
    },
    // resolvers: ClientSideResolvers as any,
  });

  // cache.writeData({
  //   data: DEFAULTS,
  // });
  return client;
}
