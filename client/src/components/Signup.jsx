import React from 'react';
import { useMutation } from 'react-apollo-hooks';
import { Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useField } from '../hooks/index';
import { SIGN } from '../services/user';
import { setNotification } from '../reducers/notification';

const Signup = props => {
  const uname = useField('text');
  const pw = useField('password');

  const signup = useMutation(SIGN);

  const handleSign = async () => {
    try {
      const { loading, data } = signup({
        variables: {
          username: uname.value,
          password: pw.value,
        },
      });

      if (!loading) {
        props.setNotification(`Signed up successfully!`, 'success', 5);
      }
    } catch (error) {
      props.setNotification(`${error.message}`, 'danger', 5);
    }
  };

  return (
    <Form inline>
      <Form.Control
        {...uname}
        reset={null}
        placeholder="Username"
        className="mr-sm-3"
      />
      <Form.Control
        {...pw}
        reset={null}
        placeholder="Password"
        className="mr-sm-3"
      />
      <Button variant="success" onClick={() => handleSign()}>
        Sign up
      </Button>
    </Form>
  );
};

const mapDispatchToProps = {
  setNotification,
};

Signup.propTypes = {
  setNotification: PropTypes.func.isRequired,
};

export default connect(
  null,
  mapDispatchToProps
)(Signup);
