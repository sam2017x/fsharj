import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useMutation, useApolloClient } from 'react-apollo-hooks';
import { useField } from '../hooks/index';
import { userLogin } from '../reducers/user';
import { LOGIN, ME } from '../services/queries';
import { setNotification } from '../reducers/notification';

const Login = props => {
  const ufields = useField('text');
  const pfields = useField('password');

  const client = useApolloClient();
  const loggedUser = useMutation(LOGIN);

  const handleLogin = async e => {
    e.preventDefault();

    try {
      const { loading, data } = await loggedUser({
        variables: {
          username: ufields.value,
          password: pfields.value,
        },
      });
      if (!loading) {
        // Cache manipulation code reference below.

        /*const dataInStore = client.readQuery({ query: ME });
        console.log('DATA CACHESSA ALUKSI', dataInStore);
        console.log('INCOMING DATA', data);
        dataInStore.me = {
          id: data.login.id,
          username: data.login.username,
          posts: data.login.posts,
          level: data.login.level,
          friends: data.login.friends,
          __typename: 'User',
        };
        console.log('MUOKKAUKSEN JALKEEN', dataInStore);
        client.writeQuery({
          query: ME,
          data: dataInStore,
        });*/

        props.setNotification(`Welcome ${ufields.value}`, 'success', 5);
        props.userLogin(data.login);

        // resetStore() clears the cached store and refetches all open queries.
        // Important to remember when creating new user session.
        client.resetStore();
      }
    } catch (error) {
      props.setNotification(`${error.message}`, 'danger', 5);
    }
  };

  return (
    <>
      <Form inline onSubmit={event => handleLogin(event)}>
        <Form.Control
          maxLength={20}
          autoFocus
          {...ufields}
          reset={null}
          placeholder="Username"
          className="mr-sm-3"
        />
        <Form.Control
          maxLength={20}
          width={10}
          {...pfields}
          reset={null}
          placeholder="Password"
          className="mr-sm-3"
        />
        <Button type="submit" size="sm" variant="warning" className="mr-1">
          Login
        </Button>
        <Button size="sm" variant="light" onClick={() => props.toggleForm()}>
          Cancel
        </Button>
      </Form>
    </>
  );
};

Login.propTypes = {
  user: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  userLogin: PropTypes.func.isRequired,
  setNotification: PropTypes.func.isRequired,
  toggleForm: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  userLogin,
  setNotification,
};

const mapStateToProps = state => {
  return {
    user: state.user,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
