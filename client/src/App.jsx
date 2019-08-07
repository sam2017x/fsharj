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
import MainPage from './components/MainPage';
import Weather from './components/Weather';
import ServiceChoice from './components/ServiceChoice';
import './css/index.css';

const App = ({ notification, setUser }) => {
  const client = useApolloClient();

  useEffect(() => {
    const user = JSON.parse(window.localStorage.getItem('loggedUser'));
    if (user) {
      setUser(user);
    }
  });

  const check = useQuery(ME);

  return (
    <div>
      <Router>
        <Header user={check.data.me} client={client} />
        {notification.text !== undefined && (
          <Alert className="mb-0" variant={notification.style}>
            {notification.text}
          </Alert>
        )}
        <div>
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
              return [
                <MainPage me={check.data.me} client={client} />,
                <ServiceChoice />,
              ];
            }}
          />
          <Route
            exact
            path="/chat/:id"
            render={({ match }) => (
              <ChatPage me={check.data.me} match={match} client={client} />
            )}
          />
          <Route
            exact
            path="/service/weather"
            render={() => <Weather me={check.data.me} client={client} />}
          />
        </div>
      </Router>
      <Footer />
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
