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
import Message from './Message';

import { GET_CHATROOM_INFO, SEND_MSG } from '../services/queries';

const ChatPage = ({ setNotification, match, me, client }) => {
  const [msg, setMsg] = useState('');
  const [renderIndex, setRenderIndex] = useState(1);
  const sendMsg = useMutation(SEND_MSG);
  const { data, error, loading } = useQuery(GET_CHATROOM_INFO, {
    variables: {
      id: match.params.id,
    },
  });
  const scrollRef = React.useRef(null);

  const scrollToMsg = () => {
    if (!scrollRef.current) {
      scrollRef.current = renderIndex;
    }
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (!scrollRef.current) {
      scrollRef.current = renderIndex;
      setTimeout(() => {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }, 200);
    }
  }, []);

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
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}
            ref={scrollRef}
          >
            <Col className="p-4">
              <Col sm={{ order: 5, span: 1 }}></Col>
              {!loading &&
                data.getChatroomInfo.messages.map(msg => (
                  /*me.id === msg.sender.id ? (
                    <Col sm={12}>{`Me: ${msg.message} //// ${new Date(
                      +msg.date
                    )}`}</Col>
                  ) : (
                    <Col sm={12}>{`${msg.sender.username}: ${
                      msg.message
                    } /// ${new Date(+msg.date)}`}</Col>
                  )*/
                  <Message me={me} message={msg} date={new Date(+msg.date)} />
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
