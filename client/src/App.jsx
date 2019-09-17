import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Alert, Image } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useQuery, useApolloClient } from '@apollo/react-hooks';
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
import { setLocale } from './util/localization/i18n';
import pic1 from './util/img/1.jpg';
import './css/index.css';

const App = ({ notification, setUser }) => {
  const client = useApolloClient();

  const [lang, setLang] = useState(document.documentElement.lang || 'en');

  useEffect(() => {
    const user = JSON.parse(window.localStorage.getItem('loggedUser'));
    if (user) {
      setUser(user);
    }
  }, [setUser]);

  const setLanguage = lang => {
    setLocale(lang);
    setLang(lang);
    document.documentElement.lang = lang;
  };

  const check = useQuery(ME);

  return (
    <div>
      <Router>
        <Header
          user={check.data.me}
          client={client}
          setLocale={setLanguage}
          lang={lang}
        />
        {notification.text !== undefined && (
          <Alert
            className="mb-0 fixed-top"
            variant={notification.style}
            style={{ width: '6rem' }}
          >
            {notification.text}
          </Alert>
        )}
        <div>
          <Route
            exact
            path="/user/:username"
            render={({ match }) => {
              return <UserPage foo={match} me={check.data.me} />;
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
                  <MainPage me={check.data.me} client={client} />
                  {check.data.me && (
                    <>
                      <div style={{ marginBottom: '50px' }}>
                        <Image
                          src={pic1}
                          style={{
                            width: '100%',
                            height: '50vh',
                            objectFit: 'cover',
                          }}
                        />
                      </div>
                      <ServiceChoice />
                    </>
                  )}
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
