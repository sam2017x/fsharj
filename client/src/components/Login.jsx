import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { useField } from '../hooks/index';

const Login = () => {
  const { ureset, ...ufields } = useField('text');
  const { preset, ...pfields } = useField('password');

  return (
    <Form inline>
      <Form.Control {...ufields} placeholder="Username" className="mr-sm-3" />
      <Form.Control {...pfields} placeholder="Password" className="mr-sm-3" />
      <Button variant="outline-dark">GO</Button>
    </Form>
  );
};

export default Login;
