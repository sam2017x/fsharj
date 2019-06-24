import React, { useState } from 'react';
import { Nav, Navbar, Form, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

const Togglable = ({ children, value }) => {
  const [toggle, setToggle] = useState(true);

  return (
    <>
      {toggle && (
        <Button
          bg="dark"
          variant="outline-warning"
          onClick={() => setToggle(!toggle)}
        >
          {value}
        </Button>
      )}
      {!toggle && children}
    </>
  );
};

Togglable.propTypes = {
  value: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
};

export default Togglable;
