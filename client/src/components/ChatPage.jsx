import React, { useEffect } from 'react';
import { useQuery } from 'react-apollo-hooks';
import {
  Container,
  Row,
  Col,
  InputGroup,
  Button,
  FormControl,
} from 'react-bootstrap';

import { GET_CHATROOM_INFO } from '../services/queries';

const ChatPage = props => {
  const { data, error, loading } = useQuery(GET_CHATROOM_INFO, {
    variables: {
      id: props.match.id,
    },
  });

  if (loading) return <div>Loading...</div>;

  if (error) console.log(error);

  return (
    <>
      <h3>Chatchatchat</h3>
      <Container>
        <Row>
          <Col>
            <span>awdawdawdawdawd</span>
          </Col>
        </Row>
      </Container>
      <div>
        <InputGroup>
          <InputGroup.Prepend>
            <Button>Send: </Button>
          </InputGroup.Prepend>
          <FormControl
            as="textarea"
            style={{ resize: 'vertical', maxHeight: '10em' }}
            aria-label="With textarea"
          />
        </InputGroup>
      </div>
    </>
  );
};

export default ChatPage;
