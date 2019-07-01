import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo-hooks';
import { useField } from '../hooks/index';
import { userLogin } from '../reducers/user';
import { LOGIN } from '../services/user';

const Login = props => {
  const ufields = useField('text');
  const pfields = useField('password');

  const loggedUser = useMutation(LOGIN);

  const handleLogin = async () => {
    const { error, loading, data } = await loggedUser({
      variables: {
        username: ufields.value,
        password: pfields.value,
      },
    });
    if (error) console.log(error.message);

    if (!loading) {
      console.log('loading done', data);
      props.userLogin(data.login);
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
      <Button variant="outline-dark" onClick={() => handleLogin()}>
        GO
      </Button>
    </Form>
  );
};

Login.propTypes = {
  userLogin: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  userLogin,
};

export default connect(
  null,
  mapDispatchToProps
)(Login);
