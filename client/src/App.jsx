import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Alert } from 'react-bootstrap';
import { gql } from 'apollo-boost';
import PropTypes from 'prop-types';
import { useQuery, useMutation, useApolloClient } from 'react-apollo-hooks';
import { Subscription } from 'react-apollo';
import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter,
  Redirect,
} from 'react-router-dom';
import { setUser } from './reducers/user';
import Header from './components/Header';
import Footer from './components/Footer';
import UserPage from './components/UserPage';
import UserSearch from './components/UserSearch';
import ChatPage from './components/ChatPage';
import { SIGN, ME } from './services/queries';

const App = props => {
  const { notification } = props;

  useEffect(() => {
    const user = JSON.parse(window.localStorage.getItem('loggedUser'));
    if (user) {
      props.setUser(user);
    }
  });

  const check = useQuery(ME);

  return (
    <div>
      <Router>
        <Header />
        {notification.text !== undefined && (
          <Alert variant={notification.style}>{notification.text}</Alert>
        )}
        <div className="container">
          <Route
            exact
            path="/user/:username"
            render={({ match }) => {
              return <UserPage foo={match} />;
            }}
          />
          <Route path="/s/users" render={() => <UserSearch me={check} />} />
          <Route
            exact
            path="/"
            render={() => {
              return <div>Hello world!</div>;
            }}
          />
          <Route
            exact
            path="/chat/:id"
            render={({ match }) => (
              <ChatPage me={check.data.me} match={match} />
            )}
          />
        </div>
      </Router>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    notification: state.notification,
  };
};

const mapDispatchToProps = {
  setUser,
};

App.propTypes = {
  notification: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
    .isRequired,
  setUser: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
