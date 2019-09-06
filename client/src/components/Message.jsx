import React from 'react';
import { Col, Toast } from 'react-bootstrap';
import PropTypes from 'prop-types';

const Message = ({ message, me, remove }) => {
  const time = new Date(+message.date);

  if (me.id === message.sender.id) {
    return (
      <>
        <Col xs={{ order: 1 }} sm={{ order: 1 }}></Col>
        <Col
          className="p-1 pl-2"
          xs={{ order: 12, span: 8 }}
          sm={{ order: 12, span: 8 }}
        >
          <Toast
            style={{ maxWidth: '100%', overflow: 'auto' }}
            onClose={() => remove(message.id)}
          >
            <Toast.Header>
              <strong className="mr-auto">{message.sender.username}</strong>
              <small>{time.toLocaleString()}</small>
            </Toast.Header>
            <Toast.Body style={{ fontSize: '0.9rem', fontWeight: '200' }}>
              {message.message}
            </Toast.Body>
          </Toast>
        </Col>
      </>
    );
  }

  return (
    <>
      <Col
        className="p-1"
        sm={{ order: 1, span: 8 }}
        xs={{ order: 1, span: 8 }}
      >
        <Toast style={{ maxWidth: '100%', overflow: 'auto' }}>
          <Toast.Header closeButton={false}>
            <strong className="mr-auto">{message.sender.username}</strong>
            <small>{time.toLocaleString()}</small>
          </Toast.Header>
          <Toast.Body style={{ fontSize: '0.9rem', fontWeight: '200' }}>
            {message.message}
          </Toast.Body>
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
