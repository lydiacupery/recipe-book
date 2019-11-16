import gql from 'graphql-tag';
import * as React from 'react';
import { graphql } from 'react-apollo';
import './App.css'


const AlLRecipesUI: React.FunctionComponent<{
  results: any
}> = props => {
  return (
      <p className="App-intro">
      {props && props.results && props.results.data && props.results.data.getPost && props.results.data.getPost.title}
      </p>

  )
}

const Query =  gql`
query {
  getPost(id: 1) {
    id
    author
    title
    content
    url
  }
}`;

export const AllRecipes =  graphql(
  Query,
  {
      options: {
          fetchPolicy: 'cache-and-network',
      },
      props: (resp) => resp
  }
)(results => <AlLRecipesUI results={results}/>);

