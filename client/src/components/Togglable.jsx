import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
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
      {!toggle && (
        <>
          {children}{' '}
          <Button variant="warning" onClick={() => setToggle(!toggle)}>
            cancel
          </Button>
        </>
      )}
    </>
  );
};

Togglable.propTypes = {
  value: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
};

export default Togglable;
