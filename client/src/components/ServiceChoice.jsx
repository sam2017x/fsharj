import React from 'react';
import { Container, Col, Row, Card, Button } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

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
            <Card.Header>Chat Application</Card.Header>
            <Card.Body>
              <Card.Title>Socialize</Card.Title>
              <Card.Text as="div">
                <p className="p-0 m-0">Find people.</p>
                <p className="p-0 m-0">Add them to your friendlist.</p>
                <p className="p-0 m-0">Chat away!</p>
              </Card.Text>
              <Button variant="primary" onClick={() => handleClick('impress')}>
                Chat App
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
            <Card.Header>Weather Application</Card.Header>
            <Card.Body>
              <Card.Title>Weather</Card.Title>
              <Card.Text>
                Choose the desired country. The app shows the weather forecast
                of the country&apos;s capital city.
              </Card.Text>
              <Button variant="primary" onClick={() => handleClick('weather')}>
                Weather App
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} xs={12} className="d-flex align-items-stretch mb-3">
          <Card bg="secondary" style={{ width: '100%', position: 'relative' }}>
            <Card.Header>SpaceX API</Card.Header>
            <Card.Body>
              <Card.Title>SPACE X -missions</Card.Title>
              <Card.Text>
                Check out all the SpaceX -missions that have happened or will
                happen.
              </Card.Text>
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
