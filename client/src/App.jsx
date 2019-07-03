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
import { SIGN } from './services/user';

const App = props => {
  const { notification } = props;
  useEffect(() => {
    const user = JSON.parse(window.localStorage.getItem('loggedUser'));
    if (user) {
      props.setUser(user);
    }
  });

  const [uname, setUname] = useState('');
  const [pw, setPw] = useState('');

  const signup = useMutation(SIGN);

  const handleSign = async () => {
    const { error, loading, data } = await signup({
      variables: {
        username: uname,
        password: pw,
      },
    });
    if (error) console.log(error.message);

    if (!loading) {
      console.log('signup successful', data);
    }
  };

  return (
    <div>
      <Router>
        <Header />
        {notification.text !== undefined && (
          <Alert variant={notification.style}>{notification.text}</Alert>
        )}
        <div className="container-fluid">
          <Route
            exact
            path="/"
            render={() => {
              return (
                <form>
                  <input
                    type="text"
                    value={uname}
                    placeholder="username"
                    onChange={event => setUname(event.target.value)}
                  />
                  <input
                    type="text"
                    value={pw}
                    placeholder="pw"
                    onChange={event => setPw(event.target.value)}
                  />
                  <button type="button" onClick={() => handleSign()}>
                    ggg
                  </button>
                </form>
              );
            }}
          ></Route>
        </div>
        <Footer />
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
  notification: PropTypes.object,
  setUser: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
