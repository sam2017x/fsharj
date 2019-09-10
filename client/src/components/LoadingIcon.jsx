import React from 'react';
import { Container, Col, Row, Spinner } from 'react-bootstrap';

const LoadingIcon = () => (
  <Container style={{ minHeight: '100vh' }}>
    <Row>
      <Col
        className="d-flex"
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </Col>
    </Row>
  </Container>
);

export default LoadingIcon;
