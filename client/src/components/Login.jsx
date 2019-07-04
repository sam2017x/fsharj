import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo-hooks';
import { useField } from '../hooks/index';
import { userLogin } from '../reducers/user';
import { LOGIN } from '../services/user';
import { setNotification } from '../reducers/notification';

const Login = props => {
  const ufields = useField('text');
  const pfields = useField('password');

  const loggedUser = useMutation(LOGIN);

  const handleLogin = async () => {
    try {
      const { loading, data } = await loggedUser({
        variables: {
          username: ufields.value,
          password: pfields.value,
        },
      });
      if (!loading) {
        props.setNotification(`Welcome ${data.login.username}`, 'success', 5);
        props.userLogin(data.login);
      }
    } catch (error) {
      props.setNotification(`${error.message}`, 'danger', 5);
    }
  };

  return (
    <Form inline>
      <Form.Control
        {...ufields}
        reset={null}
        placeholder="Username"
        className="mr-sm-3"
      />
      <Form.Control
        {...pfields}
        reset={null}
        placeholder="Password"
        className="mr-sm-3"
      />
      <Button variant="warning" onClick={() => handleLogin()}>
        Login
      </Button>
    </Form>
  );
};

Login.propTypes = {
  userLogin: PropTypes.func.isRequired,
  setNotification: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  userLogin,
  setNotification,
};

export default connect(
  null,
  mapDispatchToProps
)(Login);
