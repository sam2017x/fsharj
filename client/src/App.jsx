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
import { SIGN } from './services/user';
import { sign } from 'crypto';

const App = props => {
  useEffect(() => {});

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

export default App;
