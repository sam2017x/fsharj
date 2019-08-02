import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useQuery, useMutation } from 'react-apollo-hooks';
import {
  Container,
  Row,
  Col,
  InputGroup,
  Button,
  FormControl,
} from 'react-bootstrap';
import { setNotification } from '../reducers/notification';

import { GET_CHATROOM_INFO, SEND_MSG, ME } from '../services/queries';

const ChatPage = ({ setNotification, match, me, client }) => {
  const [msg, setMsg] = useState('');
  const sendMsg = useMutation(SEND_MSG);
  const { data, error, loading } = useQuery(GET_CHATROOM_INFO, {
    variables: {
      id: match.params.id,
    },
  });

  const handleMessage = async () => {
    try {
      const resp = await sendMsg({
        variables: {
          id: match.params.id,
          message: msg,
        },
      });

      if (!resp.loading) {
        const dataInStore = client.readQuery({
          query: GET_CHATROOM_INFO,
          variables: { id: match.params.id },
        });
        console.log('BEFORE CACHE MOD', dataInStore);
        console.log('INCOMING MSG', resp.data);
        if (
          !dataInStore.getChatroomInfo.messages
            .map(msg => msg.id)
            .includes(resp.data.sendMessage.id)
        ) {
          dataInStore.getChatroomInfo.messages = dataInStore.getChatroomInfo.messages.concat(
            resp.data.sendMessage
          );
          client.writeQuery({
            query: GET_CHATROOM_INFO,
            data: dataInStore,
          });
        }
        console.log('AFTER CACHE MOD', dataInStore.getChatroomInfo);
        setNotification(`Message sent!`, 'success', 2);
      }
    } catch (error) {
      console.log(error);
      setNotification(`${error.message}`, 'danger', 5);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (error) {
    // Could show an image here.
    return <div>{error.message.substring(14)}</div>;
  }

  console.log('DATA', data);
  console.log('MEEEE', me);

  return (
    <>
      <Container>
      <h3>Chatchatchat</h3>
        <Row>
          <Col>
            {!loading &&
              data.getChatroomInfo.messages.map(msg =>
                me.id === msg.sender.id ? (
                  <div>{`Me: ${msg.message} //// ${new Date(+msg.date)}`}</div>
                ) : (
                  <div>{`${msg.sender.username}: ${msg.message} /// ${new Date(
                    +msg.date
                  )}`}</div>
                )
              )}
          </Col>
        </Row>
      </Container>
      <div className="container">
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
