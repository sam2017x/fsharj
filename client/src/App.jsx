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
import Footer from './components/Footer';

const App = props => {

  useEffect(() => {
    
  })

  return (
    <div>
      <Router>
        <Header />
        <div className="container-fluid">
          <Route exact path="/" render={() => 'adawd'}></Route>
        </div>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
