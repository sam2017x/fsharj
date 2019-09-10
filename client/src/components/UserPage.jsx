import React, { useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Container, Col, Row, Table, Button } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setNotification } from '../reducers/notification';
import { GET_USER_INFO, CREATE_ROOM } from '../services/queries';
import LoadingIcon from './LoadingIcon';

const UserPage = ({ foo, setNotification, history, me }) => {
  const { data, loading, error } = useQuery(GET_USER_INFO, {
    variables: {
      username: foo.params.username,
    },
  });

  useEffect(() => window.scrollTo(0, 0), []);

  const [createRoom] = useMutation(CREATE_ROOM);

  const handleChat = async (senderId, receiverId) => {
    try {
      const room = await createRoom({
        variables: {
          senderId,
          receiverId,
          title: 'awdad',
        },
      });
      setNotification(`Chat started.`, 'success', 5);
      history.push(`/chat/${room.data.createRoom.id}`);
    } catch (error) {
      setNotification(`${error.message}`, 'danger', 5);
    }
  };

  if (!me)
    return (
      <div style={{ minHeight: '100vh' }} className="container text-center">
        <div style={{ marginTop: '50px' }}>
          <h4>
            <u>Log in to see the user profile.</u>
          </h4>
        </div>
      </div>
    );

  if (error)
    return (
      <h2 style={{ textAlign: 'center', marginTop: '20%' }}>
        {error.message.substring(15)}
      </h2>
    );

  if (loading) return <LoadingIcon />;

  return (
    <div style={{ minHeight: '100vh' }}>
      <Container>
        <Row
          className="mb-4 mt-4"
          style={{ borderBottom: '1px solid rgb(188, 206, 235)' }}
        >
          <Col>
            <h3 className="p-3">{data.getUserInfo.username}</h3>
          </Col>
        </Row>
        <Row>
          <Col>
            <h5>Posts: {data.getUserInfo.posts || 0}</h5>
          </Col>
          <Col>
            <h5>Level: {data.getUserInfo.level || 'beginner'}</h5>
          </Col>
        </Row>
        {me.username === data.getUserInfo.username && (
          <Row>
            <Col className="mt-4">
              <h5>Friends: </h5>
              <Table size="sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Username</th>
                  </tr>
                </thead>
                <tbody>
                  {data.getUserInfo.friends &&
                    data.getUserInfo.friends.map((friend, i) => {
                      return (
                        <tr key={`${friend.username}`}>
                          <td>{i + 1}</td>
                          <td>{friend.username}</td>
                          <td>
                            <Button
                              onClick={() =>
                                handleChat(me.id, data.getUserInfo.id)
                              }
                              size="sm"
                            >
                              Chat
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

UserPage.propTypes = {
  foo: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  setNotification: PropTypes.func.isRequired,
  history: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  me: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

UserPage.defaultProps = {
  me: undefined,
};

const mapDispatchToProps = {
  setNotification,
};

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(UserPage)
);
