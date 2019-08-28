import React from 'react';
import { useQuery, useMutation } from 'react-apollo-hooks';
import { Container, Col, Row, Spinner, Table, Button } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setNotification } from '../reducers/notification';
import { GET_USER_INFO, ALL_USERS, CREATE_ROOM } from '../services/queries';

const UserPage = ({ foo, setNotification, history, me }) => {
  const { data, loading, error } = useQuery(GET_USER_INFO, {
    variables: {
      username: foo.params.username,
    },
  });

  const createRoom = useMutation(CREATE_ROOM);

  const handleChat = async (senderId, receiverId) => {
    try {
      const room = await createRoom({
        variables: {
          senderId,
          receiverId,
          title: 'awdad',
        },
        refetchQueries: [{ query: ALL_USERS }],
      });

      setNotification(`Chat started.`, 'success', 5);
      history.push(`/chat/${room.data.createRoom.id}`);
    } catch (error) {
      setNotification(`${error.message}`, 'danger', 5);
    }
  };

  if (error)
    return (
      <h2 style={{ textAlign: 'center', marginTop: '20%' }}>
        {error.message.substring(15)}
      </h2>
    );

  if (loading)
    return (
      <Container>
        <Row>
          <Col
            style={{
              textAlign: 'center',
              marginTop: '50%',
            }}
          >
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </Col>
        </Row>
      </Container>
    );

  if (!loading) {
    console.log('me', me);
    console.log('data', data);
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Container>
        <Row>
          <Col>
            <h3>{data.getUserInfo.username}</h3>
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
                        <>
                          <tr>
                            <td>{i + 1}</td>
                            <td>{friend.username}</td>
                            <td>
                              <Button
                                onClick={() =>
                                  handleChat(me.id, data.getUserInfo.id)
                                }
                              />
                            </td>
                          </tr>
                        </>
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
  me: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
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
