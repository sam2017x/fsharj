import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useField } from '../hooks/index';
import { SIGN } from '../services/queries';
import { setNotification } from '../reducers/notification';

const Signup = ({ toggleForm, setNotification }) => {
  const uname = useField('text');
  const pw = useField('password');

  const [signup] = useMutation(SIGN);

  const handleSign = async e => {
    e.preventDefault();

    try {
      const { loading, data } = await signup({
        variables: {
          username: uname.value,
          password: pw.value,
        },
      });
      toggleForm();

      if (!loading) {
        setNotification(
          `Signed up successfully as ${data.addUser.username}!`,
          'success',
          5
        );
      }
    } catch (error) {
      setNotification(`${error.message}`, 'danger', 5);
    }
  };

  return (
    <>
      <Form inline onSubmit={e => handleSign(e)}>
        <Form.Control
          autoFocus
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
        <Button type="submit" size="sm" variant="success" className="mr-1">
          Sign up
        </Button>
        <Button size="sm" variant="light" onClick={() => toggleForm()}>
          Cancel
        </Button>
      </Form>
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
