import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Col, Container, Row, Spinner, Button } from 'react-bootstrap';

const Impress = props => {
  const [instructions, setInstructions] = useState(false);

  const { data, loading } = useQuery(ALL_USERS);

  if (!instructions) {
    return (
      <Container>
        <Row>
          <Col>
            <h3>Instructions for impressing others:</h3>
          </Col>
        </Row>
        <Row>
          <Col sm={2}>
            <h2>1.</h2>
          </Col>
          <Col>Find a person you would like to impress from the userlist.</Col>
        </Row>
        <Row>
          <Col sm={2}>
            <h2>2.</h2>
          </Col>
          <Col>Add to friend list and press "Chat".</Col>
        </Row>
        <Row>
          <Col sm={2}>3.</Col>
          <Col>
            You have now five messages worth of time to be funny and engaging.
            The receiver will rate you afterwards.
          </Col>
        </Row>
        <Col sm={2}>4.</Col>
        <Col>
          You can play only once a day. The score you will get from this game
          will be updated on your own userpage under "Level" -label.
        </Col>
      </Container>
    );
  }
};
