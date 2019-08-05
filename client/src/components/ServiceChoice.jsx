import React, { useState } from 'react';
import { Container, Col, Row, Spinner, Card, Button } from 'react-bootstrap';
import { withRouter, Link } from 'react-router-dom';

const ServiceChoice = ({ history }) => {
  const handleClick = val => {
    switch (val) {
      case 'impress':
        history.push('/service/impress');
        break;
      case 'nasa':
        history.push('/service/nasa');
        break;
      case 'weather':
        history.push('/service/weather');
        break;
      default:
        break;
    }
  };

  return (
    <Container>
      <Row>
        <Col sm={4}>
          <Card className="text-center">
            <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body>
              <Card.Title>Impress</Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </Card.Text>
              <Button variant="primary" onClick={() => handleClick('impress')}>
                Go somewhere
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={4}>
          <Card>
            <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body>
              <Card.Title>Weather</Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </Card.Text>
              <Button variant="primary" onClick={() => handleClick('weather')}>
                Go somewhere
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={4}>
          <Card>
            <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body>
              <Card.Title>NASA - launches</Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </Card.Text>
              <Button variant="primary" onClick={() => handleClick('nasa')}>
                Go somewhere
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default withRouter(ServiceChoice);
