import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useField } from '../hooks/index';
import { userLogin } from '../reducers/user';

const Login = props => {
  const { ureset, ...ufields } = useField('text');
  const { preset, ...pfields } = useField('password');

  const handleLogin = async () => {
    try {
      props.userLogin({
        username: ufields.value,
        password: pfields.value,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form inline>
      <Form.Control {...ufields} placeholder="Username" className="mr-sm-3" />
      <Form.Control {...pfields} placeholder="Password" className="mr-sm-3" />
      <Button variant="outline-dark" onClick={() => handleLogin()}>
        GO
      </Button>
    </Form>
  );
};

Login.propTypes = {
  userLogin: PropTypes.element.isRequired,
};

const mapDispatchToProps = {
  userLogin,
};

export default connect(
  null,
  mapDispatchToProps
)(Login);
