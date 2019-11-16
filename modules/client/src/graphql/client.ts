import { Auth } from "aws-amplify";
// tslint:disable-next-line: ordered-imports
import { createHttpLink } from 'apollo-link-http';
// tslint:disable-next-line: ordered-imports
import { NormalizedCacheObject ,InMemoryCache,} from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import { ApolloLink } from "apollo-link";
import { BatchHttpLink } from "apollo-link-batch-http";
import { History } from "history";
// import { buildErrorLink } from "./error-link";
// import { ClientSideResolvers } from "./resolvers";
// import { DEFAULTS } from "./client-state";
import { compact } from "lodash-es";
// tslint:disable-next-line:ordered-imports
import { createAppSyncLink } from "aws-appsync"
import {awsconfig} from '../aws-exports';

export function buildGraphqlClient(opts: {
  history: History<any>;
  fetch?: any;
  uri?: string;
  prefixLink?: ApolloLink;
}): ApolloClient<NormalizedCacheObject> {
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
    auth: {
      credentials: () => Auth.currentCredentials() as any,
      jwtToken: async () =>
        (await Auth.currentSession()).getAccessToken().getJwtToken(),
      type: awsconfig.appsync_auth_type as any,
    },
    complexObjectsCredentials: () => Auth.currentCredentials(),
    region: awsconfig.appsync_region,
    url: awsconfig.appsync_url,
   })

   
  const links = [
    // errorLink,
    ...compact([prefixLink]),
   awsLink, 
   httpLink,
    new BatchHttpLink({
      batchInterval: 10,
      credentials: "same-origin",
      fetch,
      uri,
    }),
  ];
  const link = ApolloLink.from(links);
  const client = new ApolloClient({
    cache,
    defaultOptions: {
      watchQuery: {
        // this governs the default fetch policy for react-apollo useQuery():
        fetchPolicy: "cache-and-network",
      },
    },
    link,
    // resolvers: ClientSideResolvers as any,
  });

  // cache.writeData({
  //   data: DEFAULTS,
  // });
  return client;
}
