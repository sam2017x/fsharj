import React, { useState, useEffect } from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation, useApolloClient } from 'react-apollo-hooks';
import { Subscription } from 'react-apollo';
import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter,
  Redirect,
} from 'react-router-dom';
import Header from './components/Header';

const App = props => {
  return (
    <div>
      <Router>
        <Header />
        <div className="container-fluid">
          <Route exact path="/" render={() => 'adawd'}></Route>
        </div>
      </Router>
    </div>
  );
};

export default App;
