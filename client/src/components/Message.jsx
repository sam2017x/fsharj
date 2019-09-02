import React from 'react';
import { Col, Toast } from 'react-bootstrap';
import PropTypes from 'prop-types';

const Message = ({ message, me, remove }) => {

  if (me.id === message.sender.id) {
    return (
      <>
        <Col xs={{ order: 1, span: 5 }} sm={{ order: 1, span: 5 }}></Col>
        <Col xs={{ order: 12, span: 5 }} sm={{ order: 12, span: 5 }}>
          <Toast onClose={() => remove(message.id)}>
            <Toast.Header>
              <img
                src="holder.js/20x20?text=%20"
                className="rounded mr-2"
                alt=""
              />
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
      <Col sm={{ order: 1, span: 5 }}>
        <Toast>
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded mr-2"
              alt=""
            />
            <strong className="mr-auto">{message.sender.username}</strong>
          </Toast.Header>
          <Toast.Body>{message.message}</Toast.Body>
        </Toast>
      </Col>
      <Col sm={{ order: 12, span: 5 }}></Col>
    </>
  );
};

Message.propTypes = {
  remove: PropTypes.func.isRequired,
  message: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  me: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
};

export default Message;
