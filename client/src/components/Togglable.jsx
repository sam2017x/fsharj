import React, { useState, useImperativeHandle } from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

const Togglable = React.forwardRef((props, ref) => {
  const [toggle, setToggle] = useState('none');

  const toggleVisibility = () => {
    setToggle(!toggle);
  };

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    };
  });
  return (
    <>
      {toggle === 'none' && (
        <>
          <Button
            variant="warning"
            onClick={() => setToggle('log')}
            className="mr-sm-1"
          >
            Log in
          </Button>
          {` | `}
          <Button
            variant="success"
            onClick={() => setToggle('sign')}
            className="ml-sm-1"
          >
            Sign up
          </Button>
        </>
      )}
      {toggle === 'log' && (
        <>
          {props.children[0]}{' '}
          <Button
            variant="dark"
            onClick={() => setToggle('none')}
            className="ml-sm-1"
          >
            X
          </Button>
        </>
      )}
      {toggle === 'sign' && (
        <>
          {props.children[1]}
          <Button
            variant="dark"
            onClick={() => setToggle('none')}
            className="ml-sm-1"
          >
            X
          </Button>
        </>
      )}
    </>
  );
});

Togglable.propTypes = {
  children: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.element, PropTypes.element])
  ),
};

Togglable.defaultProps = {
  children: () => [],
};

export default Togglable;
