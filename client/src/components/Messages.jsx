import React, { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Message from './Message';

const Messages = ({ scrollToMsg, messages, removeMessage, me }) => {
  useEffect(() => {
    scrollToMsg();
  }, []);

  return (
    <Col className="p-3">
      {messages.map(msg => (
        <Row key={msg.id}>
          <Message me={me} message={msg} remove={removeMessage} />
        </Row>
      ))}
    </Col>
  );
};

Messages.propTypes = {
  scrollToMsg: PropTypes.func.isRequired,
  messages: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  removeMessage: PropTypes.func.isRequired,
  me: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
};

export default Messages;
