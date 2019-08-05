import React from 'react';
import { Container, Row, Col, Navbar, Nav } from 'react-bootstrap';

const Footer = props => {
  return (
    <Container className="sticky-bottom">
      <Row>
        <Col></Col>
        <Col sm={8} style={{ textAlign: 'center' }}>
          &copy; Samuli J.
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
};

export default Footer;
