import React from 'react';
import { useMutation } from 'react-apollo-hooks';
import { Form, Button, Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useField } from '../hooks/index';
import { SIGN } from '../services/queries';
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
    <>
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
      </Form>
      <Button variant="success" onClick={() => handleSign()} className="mr-1">
        Sign up
      </Button>
      <Button variant="light" onClick={() => props.toggleForm()}>
        Cancel
      </Button>
    </>
  );
};

const mapDispatchToProps = {
  setNotification,
};

Signup.propTypes = {
  setNotification: PropTypes.func.isRequired,
  toggleForm: PropTypes.func.isRequired,
};

export default connect(
  null,
  mapDispatchToProps
)(Signup);
