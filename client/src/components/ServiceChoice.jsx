import React from 'react';
import { Container, Col, Row, Card, Button } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

const ServiceChoice = ({ history }) => {
  const handleClick = val => {
    switch (val) {
      case 'impress':
        history.push('/service/impress');
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
    <Container className="pb-3 mb-3">
      <Row>
        <Col md={4}>
          <Card className="text-center" bg="secondary">
            <Card.Body>
              <Card.Title>Impress</Card.Title>
              <Card.Text>Chat app.</Card.Text>
              <Button variant="primary" onClick={() => handleClick('impress')}>
                Go somewhere
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card bg="secondary" className="text-center">
            <Card.Body>
              <Card.Title>Weather</Card.Title>
              <Card.Text>
                Pick a country and see how's the weather in the capital.
              </Card.Text>
              <Button variant="primary" onClick={() => handleClick('weather')}>
                Go somewhere
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card bg="secondary" className="text-center">
            <Card.Body>
              <Card.Title>SPACE X -missions</Card.Title>
              <Card.Text>Check out the upcoming Space X missions.</Card.Text>
              <Button variant="primary" onClick={() => handleClick('space')}>
                Go somewhere
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
