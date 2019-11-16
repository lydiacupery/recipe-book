import { graphql } from 'react-apollo';
import React, { Component } from "react";
import gql from 'graphql-tag';
import './App.css'

class AllRecipes extends Component {
  render() {
    console.log("got some stuff!", this.props.data)
    return (
      <p className="App-header">
      {this.props && this.props.data && this.props.data.getPost && this.props.data.getPost.title}
      </p>

    )
  }
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

export default graphql(
  Query,
  {
      options: {
          fetchPolicy: 'cache-and-network',
      },
      props: (resp) => resp
  }
)(AllRecipes);

