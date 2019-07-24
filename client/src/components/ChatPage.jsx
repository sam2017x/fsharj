import React, { useState, useMutation } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useQuery } from 'react-apollo-hooks';
import {
  Container,
  Row,
  Col,
  InputGroup,
  Button,
  FormControl,
} from 'react-bootstrap';
import { setNotification } from '../reducers/notification';

import { GET_CHATROOM_INFO, SEND_MSG } from '../services/queries';

const ChatPage = ({ setNotification, match }) => {
  const [msg, setMsg] = useState('');
  const sendMsg = useMutation(SEND_MSG);
  const { data, error, loading } = useQuery(GET_CHATROOM_INFO, {
    variables: {
      id: match.params.id,
    },
  });

  const handleMessage = async () => {
    try {
      const resp = sendMsg({
        variables: {
          roomId: match.params.id,
          message: msg,
        },
      });

      if (!resp.loading) {
        setNotification(`Message sent!`, 'success', 2);
      }
    } catch (error) {
      setNotification(`${error.message}`, 'danger', 5);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (error) {
    //props.setNotification(`Error: ${error.message.substring(14)}`, 'danger', 5);
    // Could show an image here.
    return <div>{error.message.substring(14)}</div>;
  }

  console.log(data);

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
            <Button onClick={() => handleMessage()}>Send:</Button>
          </InputGroup.Prepend>
          <FormControl
            onChange={event => setMsg(event.target.value)}
            as="textarea"
            style={{ resize: 'vertical', maxHeight: '10em' }}
            aria-label="With textarea"
          />
        </InputGroup>
      </div>
    </>
  );
};

const mapDispatchToProps = {
  setNotification,
};

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(ChatPage)
);
