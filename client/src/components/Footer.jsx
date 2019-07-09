import React from 'react';
import { Container, Row, Col, Navbar, Nav } from 'react-bootstrap';

const Footer = props => {
  return (
    <Navbar className="sticky-bottom" bg="primary" variant="dark">
      <Container>
        <Row>
          <Col>
            <h5>Creator:</h5>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut
              lacus faucibus, placerat libero nec, pretium velit. Quisque
              consequat nulla id gravida laoreet.
            </p>
          </Col>
          <Col md={2}>Stuff</Col>
          <Col md={2}>Links</Col>
        </Row>
      </Container>
    </Navbar>
  );
};

export default Footer;
