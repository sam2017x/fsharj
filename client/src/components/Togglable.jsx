import React, { useState, useImperativeHandle } from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import translate from '../util/localization/i18n';

const Togglable = React.forwardRef((props, ref) => {
  const [toggle, setToggle] = useState('none');

  const toggleVisibility = () => {
    setToggle('none');
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
            {translate('toggle_log')}
          </Button>
          {` | `}
          <Button
            variant="success"
            onClick={() => setToggle('sign')}
            className="ml-sm-1"
          >
            {translate('toggle_sign')}
          </Button>
        </>
      )}
      {toggle === 'log' && <>{props.children[0]} </>}
      {toggle === 'sign' && <>{props.children[1]}</>}
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
