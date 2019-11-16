import * as React from 'react';
import { AllRecipes } from './AllRecipes';
import './App.css';

import Amplify from 'aws-amplify'
import {ApolloProvider} from "react-apollo"

import { withAuthenticator } from 'aws-amplify-react';
import { createBrowserHistory } from 'history';
import  {awsconfig} from './aws-exports'
import { buildGraphqlClient } from './graphql/client';

Amplify.configure({
  Auth: {
    region: awsconfig.appsync_region,
    userPoolId: awsconfig.user_pool_id,
    userPoolWebClientId: awsconfig.user_pool_client_id 
  }
})

const history = createBrowserHistory();
const graphqlClient = buildGraphqlClient({history})

class BaseApp extends React.Component {
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Welcome to recipe book!
            </p>
            <p>
            There will be more content here soon.
            </p>
        </header>
        <AllRecipes/>
        <div className="App-intro">that data came back from graphql!</div>
      </div>
    );
  }
}
const App = withAuthenticator(BaseApp, true)

const EnhancedApp = () => (
  <ApolloProvider client={graphqlClient}>
    <App/>
  </ApolloProvider>
)

export default EnhancedApp;
