import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import {
  Container,
  Row,
  Col,
  InputGroup,
  Button,
  FormControl,
} from 'react-bootstrap';
import { setNotification } from '../reducers/notification';
import Message from './Message';

import {
  GET_CHATROOM_INFO,
  SEND_MSG,
  REMOVE_MESSAGE,
  MESSAGE_SUBSCRIPTION,
} from '../services/queries';

const ChatPage = ({ setNotification, match, me, client }) => {
  const [msg, setMsg] = useState('');
  const msgSub = useSubscription(MESSAGE_SUBSCRIPTION, {
    variables: {
      room: match.params.id,
    },
    onSubscriptionData: ({ subscriptionData }) => {
      const newMessage = subscriptionData.data.messageAdded;
      console.log('new message', newMessage);
    },
  });
  const [sendMsg] = useMutation(SEND_MSG);
  const { data, error, loading } = useQuery(GET_CHATROOM_INFO, {
    variables: {
      id: match.params.id,
    },
  });
  const scrollRef = React.useRef(null);
  const [removeMessage] = useMutation(REMOVE_MESSAGE);

  const scrollToMsg = () => {
    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }, 500);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 500);
  }, []);

  const handleRemoveMessage = async id => {
    try {
      const rm = removeMessage({
        variables: {
          id,
        },
      });

      if (!rm.loading) {
        const dataInStore = client.readQuery({
          query: GET_CHATROOM_INFO,
          variables: { id: match.params.id },
        });

        const idArr = dataInStore.getChatroomInfo.messages.map(msg => msg.id);

        const idx = idArr.indexOf(id);

        dataInStore.getChatroomInfo.messages.splice(idx, 1);

        client.writeQuery({
          query: GET_CHATROOM_INFO,
          data: dataInStore,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleMessage = async () => {
    try {
      const resp = await sendMsg({
        variables: {
          id: match.params.id,
          message: msg,
          senderId: me.id,
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
        scrollToMsg();
        setMsg('');
      }
    } catch (error) {
      console.log(error);
      //setNotification(`${error.message}`, 'danger', 5);
    }
  };

  if (!me) return null;

  if (loading) return <div>Loading...</div>;

  if (error) {
    // Could show an image here.
    return <div>{error.message.substring(14)}</div>;
  }

  return (
    <>
      <div style={{ minHeight: '80vh' }}>
        <Container>
          <Row
            className="d-flex"
            style={{ alignItems: 'center', justifyContent: 'center' }}
          >
            <Col
              className="text-center rounded-top"
              style={{
                backgroundColor: 'white',
                paddingBottom: '20px',
                marginTop: '40px',
              }}
            >
              <h3>Chatchatchat</h3>
            </Col>
          </Row>
          <Row
            className="d-flex rounded-bottom"
            style={{
              backgroundColor: 'white',
              overflow: 'auto',
              height: '60vh',
              position: 'relative',
              border: '2px solid red',
            }}
            ref={scrollRef}
          >
            <Col className="p-4" style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '0',
                  backgroundColor: 'black',
                  width: '0.25rem',
                  height: '100%',
                }}
              ></div>
              {!loading &&
                data.getChatroomInfo.messages.map(msg => (
                  <Row key={msg.id}>
                    <Col
                      xs={{ order: 5, span: 1 }}
                      sm={{ order: 5, span: 1 }}
                    ></Col>
                    <Message
                      me={me}
                      message={msg}
                      remove={handleRemoveMessage}
                    />
                  </Row>
                ))}
            </Col>
          </Row>
        </Container>
      </div>
      <InputGroup className="sticky-bottom">
        <InputGroup.Prepend>
          <Button onClick={() => handleMessage()}>Send:</Button>
        </InputGroup.Prepend>
        <FormControl
          value={msg}
          onChange={event => setMsg(event.target.value)}
          as="textarea"
          style={{ resize: 'vertical', maxHeight: '10em' }}
          aria-label="With textarea"
        />
      </InputGroup>
      <Button onClick={() => scrollToMsg()}>scroll</Button>
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
