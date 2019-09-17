import React from 'react';
import { Container, Col, Row, Card, Button } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import translate from '../util/localization/i18n';

const ServiceChoice = ({ history }) => {
  const handleClick = val => {
    switch (val) {
      case 'impress':
        history.push('/s/users');
        break;
      case 'space':
        history.push('/service/space');
        break;
      case 'weather':
        history.push('/service/weather');
        break;
      default:
        break;
    }
  };

  return (
    <Container className="p-4 fluid" style={{ marginBottom: '80px' }}>
      <Row>
        <Col md={4} xs={12} className="d-flex align-items-stretch mb-3">
          <Card bg="success" style={{ width: '100%', position: 'relative' }}>
            <Card.Header>{translate('sc_c1_header')}</Card.Header>
            <Card.Body>
              <Card.Title>{translate('sc_c1_title')}</Card.Title>
              <Card.Text as="div">
                <p className="p-0 m-0">{translate('sc_c1_p1')}</p>
                <p className="p-0 m-0">{translate('sc_c1_p2')}</p>
                <p>{translate('sc_c1_p3')}</p>
              </Card.Text>
              <Button variant="primary" onClick={() => handleClick('impress')}>
                {translate('sc_c1_button')}
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} xs={12} className="d-flex align-items-stretch mb-3">
          <Card
            bg="info"
            text="white"
            style={{ width: '100%', position: 'relative' }}
          >
            <Card.Header>{translate('sc_c2_header')}</Card.Header>
            <Card.Body>
              <Card.Title>{translate('sc_c2_title')}</Card.Title>
              <Card.Text>{translate('sc_c2_text')}</Card.Text>
              <Button variant="primary" onClick={() => handleClick('weather')}>
                {translate('sc_c2_button')}
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} xs={12} className="d-flex align-items-stretch mb-3">
          <Card bg="secondary" style={{ width: '100%', position: 'relative' }}>
            <Card.Header>SpaceX API</Card.Header>
            <Card.Body>
              <Card.Title>{translate('sc_c3_title')}</Card.Title>
              <Card.Text>{translate('sc_c3_text')}</Card.Text>
              <Button variant="primary" onClick={() => handleClick('space')}>
                SpaceX API
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

ServiceChoice.propTypes = {
  history: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
};

export default withRouter(ServiceChoice);
