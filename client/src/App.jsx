import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useQuery, useApolloClient } from 'react-apollo-hooks';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { setUser } from './reducers/user';
import Header from './components/Header';
import Footer from './components/Footer';
import UserPage from './components/UserPage';
import UserSearch from './components/UserSearch';
import ChatPage from './components/ChatPage';
import { ME } from './services/queries';
import MainPage from './components/MainPage';
import Weather from './components/Weather';
import Space from './components/Space';
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
        <div className="pb-3">
          <Route
            exact
            path="/user/:username"
            render={({ match }) => {
              return <UserPage foo={match} />;
            }}
          />
          <Route
            path="/s/users"
            render={() => <UserSearch me={check.data.me} />}
          />
          <Route
            exact
            path="/"
            render={() => {
              return (
                <>
                  <MainPage me={check.data.me} client={client} />,
                  <ServiceChoice />,
                </>
              );
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
          <Route
            path="/service/space"
            render={() => <Space me={check.data.me} />}
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
