import React from 'react';
import { Container, Col, Row, Spinner } from 'react-bootstrap';
import translate from '../util/localization/i18n';

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
          <span className="sr-only">{translate('loadingicon')}</span>
        </Spinner>
      </Col>
    </Row>
  </Container>
);

export default LoadingIcon;
