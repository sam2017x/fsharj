import React from 'react';
import { Col, Toast } from 'react-bootstrap';
import PropTypes from 'prop-types';

const Message = ({ message, me, remove }) => {
  if (me.id === message.sender.id) {
    return (
      <>
        <Col xs={{ order: 1 }} sm={{ order: 1 }}></Col>
        <Col
          className="p-1 pl-2"
          xs={{ order: 12, span: 6 }}
          sm={{ order: 12, span: 6 }}
        >
          <Toast onClose={() => remove(message.id)}>
            <Toast.Header style={{backgroundColor: 'black'}}>
              <strong className="mr-auto">{message.sender.username}</strong>
            </Toast.Header>
            <Toast.Body>{message.message}</Toast.Body>
          </Toast>
        </Col>
      </>
    );
  }

  return (
    <>
      <Col
        className="p-1"
        sm={{ order: 1, span: 6 }}
        xs={{ order: 1, span: 6 }}
      >
        <Toast>
          <Toast.Header>
            <strong className="mr-auto">{message.sender.username}</strong>
          </Toast.Header>
          <Toast.Body>{message.message}</Toast.Body>
        </Toast>
      </Col>
      <Col sm={{ order: 12 }} xs={{ order: 12 }}></Col>
    </>
  );
};

Message.propTypes = {
  remove: PropTypes.func.isRequired,
  message: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  me: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
};

export default Message;
