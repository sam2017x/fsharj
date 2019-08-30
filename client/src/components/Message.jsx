import React, { useState } from 'react';
import { Col, Toast } from 'react-bootstrap';
import { useMutation } from 'react-apollo-hooks';
import { REMOVE_MESSAGE } from '../services/queries';

const Message = ({ date, message, me }) => {
  console.log('props', { date, message, me });

  const removeMessage = useMutation(REMOVE_MESSAGE);
  const [show, setShow] = useState(true);

  const handleRemoveMessage = async id => {
    try {
      const rm = removeMessage({
        variables: {
          id,
        },
      });

      if (!rm.loading) {
        setShow(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (me.id === message.sender.id) {
    return (
      <>
        <Col xs={{ order: 1, span: 5 }} sm={{ order: 1, span: 5 }}></Col>
        <Col xs={{ order: 12, span: 5 }} sm={{ order: 12, span: 5 }}>
          <Toast show={show} onClose={() => handleRemoveMessage(message.id)}>
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
      <Col sm={{ order: 1, span: 6 }}>{message.message}</Col>
      <Col sm={{ order: 12, span: 6 }}></Col>
    </>
  );
};

export default Message;
