/* eslint-disable no-nested-ternary */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Container, Row, Col, Table, Spinner } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useField } from '../hooks/index';
import { setNotification } from '../reducers/notification';
import { setUser } from '../reducers/user';
import {
  ALL_USERS,
  ADD_FRIEND,
  CREATE_ROOM,
  REMOVE_FRIEND,
} from '../services/queries';
import translate from '../util/localization/i18n';
import LoadingIcon from './LoadingIcon';
import UserSearchField from './UserSearchField';

const UserSearch = ({ history, me, setNotification }) => {
  const searchField = useField('text');
  const { data, loading } = useQuery(ALL_USERS);
  const [addFriend] = useMutation(ADD_FRIEND);
  const [createRoom] = useMutation(CREATE_ROOM);
  const [removeFriend] = useMutation(REMOVE_FRIEND);

  useEffect(() => window.scrollTo(0, 0), []);

  const handleChat = async (senderId, receiverId) => {
    try {
      const room = await createRoom({
        variables: {
          senderId,
          receiverId,
          title: 'awdad',
        },
      });

      setNotification(`${translate('chat_started')}`, 'success', 5);
      history.push(`/chat/${room.data.createRoom.id}`);
    } catch (error) {
      setNotification(`${error.message}`, 'danger', 5);
    }
  };

  const handleFriendAdd = async id => {
    try {
      const afterAdd = await addFriend({
        variables: {
          id,
        },
      });

      if (!afterAdd.loading) {
        setNotification(`${translate('friend_added')}`, 'success', 5);
        document.activeElement.blur();
      }
    } catch (error) {
      setNotification(`${error.message}`, 'danger', 5);
    }
  };

  const handleClear = () => {
    searchField.reset();
  };

  const handleRemoveFriend = async id => {
    try {
      const response = await removeFriend({
        variables: {
          id,
        },
      });

      if (!response.loading) {
        setNotification(`${translate('friend_removed')}`, 'success', 5);
      }
    } catch (error) {
      setNotification(`${error.message}`, 'danger', 5);
    }
  };

  if (loading) return <LoadingIcon />;

  if (data.allUsers === undefined || data.allUsers === null)
    return (
      <Container fluid style={{ minHeight: '100vh' }}>
        <UserSearchField searchField={searchField} handleClear={handleClear} />
        <Container>
          <Row>
            <Col
              style={{
                textAlign: 'center',
                marginTop: '5em',
              }}
            >
              <Spinner animation="border" role="status">
                <span className="sr-only">{translate('loadingicon')}</span>
              </Spinner>
            </Col>
          </Row>
        </Container>
      </Container>
    );

  if (me === null || me === undefined)
    return (
      <Container fluid style={{ minHeight: '100vh' }}>
        <UserSearchField searchField={searchField} handleClear={handleClear} />
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>{translate('login_username')}</th>
            </tr>
          </thead>
          <tbody>
            {!loading &&
              data.allUsers.map((usr, i) => (
                <tr key={`${usr.username}-list`}>
                  <td>{i + 1}</td>
                  <td>
                    <Link to={`/user/${usr.username}`}>{usr.username}</Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Container>
    );

  return (
    <Container fluid style={{ minHeight: '100vh' }}>
      <UserSearchField searchField={searchField} handleClear={handleClear} />
      <Table>
        <thead>
          <tr>
            <th>#</th>
            <th>{translate('login_username')}</th>
          </tr>
        </thead>
        <tbody>
          {!loading &&
            me.data !== null &&
            data.allUsers
              .filter(usr =>
                usr.username
                  .toLowerCase()
                  .includes(searchField.value.toLowerCase())
              )
              .map((usr, i) => (
                <tr key={`${usr.username}-list`}>
                  <td>{i + 1}</td>
                  <td>
                    <Link to={`/user/${usr.username}`}>{usr.username}</Link>
                  </td>
                  {usr.friends !== null && me.username === usr.username ? (
                    <>
                      <td></td>
                      <td></td>
                    </>
                  ) : me.friends.find(frd => frd.id === usr.id) ===
                    undefined ? (
                    <>
                      <td>
                        <Button
                          variant="primary"
                          onClick={() => handleFriendAdd(usr.id)}
                        >
                          {translate('usersearch_action_add')}
                        </Button>
                      </td>
                      <td></td>
                    </>
                  ) : (
                    <>
                      <td>
                        <Button
                          variant="secondary"
                          onClick={() => handleRemoveFriend(usr.id)}
                        >
                          {translate('usersearch_action_remove')}
                        </Button>
                      </td>
                      <td>
                        <Button
                          variant="secondary"
                          onClick={() => handleChat(me.id, usr.id)}
                        >
                          Chat
                        </Button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
        </tbody>
      </Table>
    </Container>
  );
};

UserSearch.propTypes = {
  setNotification: PropTypes.func.isRequired,
  me: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  history: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
};

UserSearch.defaultProps = {
  me: null,
};

const mapStateToProps = state => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = {
  setNotification,
  setUser,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(UserSearch)
);
