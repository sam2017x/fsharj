import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = props => {
  return (
    <div
      style={{
        bottom: '0',
        position: 'absolute',
        width: '100%',
        textAlign: 'center',
        backgroundColor: 'black',
      }}
      className="pt-3"
    >
      &copy; SJ.
    </div>
  );
};

export default Footer;
