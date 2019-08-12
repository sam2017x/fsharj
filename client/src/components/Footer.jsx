import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = props => {
  return (
    <Container style={{ bottom: '0', position: 'absolute' }}>
      <Row>
        <Col></Col>
        <Col sm={8} style={{ textAlign: 'center' }}>
          &copy; SJ.
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
};

export default Footer;
