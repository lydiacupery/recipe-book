import React from 'react';
import './App.css';

//Amplify
import Amplify, { Auth } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import { createBrowserHistory } from 'history';

import {ApolloProvider} from "react-apollo"

import {buildGraphqlClient} from "./graphql/client"

import AllRecipes from "./AllRecipes"

import {awsconfig} from './aws-exports';

Amplify.configure({
  Auth: {
    region: awsconfig.appsync_region,
    userPoolId: awsconfig.user_pool_id,
    userPoolWebClientId: awsconfig.user_pool_client_id 
  }
})

const history = createBrowserHistory();
const graphqlClient = buildGraphqlClient({history})

function BaseApp() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Welcome to recipe book!
          </p>
          <p>
          There will be more content here soon.
          </p>
      <AllRecipes/>
      </header>
    </div>
  );
}

const App = withAuthenticator(BaseApp, true)

const EnhancedApp = () => (
  <ApolloProvider client={graphqlClient}>
    <App/>
  </ApolloProvider>
)

export default EnhancedApp;
