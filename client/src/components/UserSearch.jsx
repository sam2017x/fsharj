/* eslint-disable no-nested-ternary */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Button,
  Form,
  Container,
  Row,
  Col,
  Table,
  Spinner,
} from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useField } from '../hooks/index';
import { setNotification } from '../reducers/notification';
import { setUser } from '../reducers/user';
import { ALL_USERS, ADD_FRIEND, CREATE_ROOM } from '../services/queries';
import translate from '../util/localization/i18n';
import LoadingIcon from './LoadingIcon';

const UserSearch = ({ history, me, setNotification }) => {
  const searchField = useField('text');
  const { data, loading } = useQuery(ALL_USERS);
  const [addFriend] = useMutation(ADD_FRIEND);
  const [createRoom] = useMutation(CREATE_ROOM);
  const focusRef = React.createRef();

  const focus = () => {
    focusRef.current.focus();
  };

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

      setNotification(`Chat started.`, 'success', 5);
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
        setNotification(`Friend added!`, 'success', 5);
      }
    } catch (error) {
      setNotification(`${error.message}`, 'danger', 5);
    }
  };

  const handleClear = () => {
    searchField.reset();
    focus();
  };

  if (loading) return <LoadingIcon />;

  if (data.allUsers === undefined || data.allUsers === null)
    return (
      <div style={{ minHeight: '100vh' }}>
        <Form>
          <Form.Group>
            <Form.Label>{translate('usersearch_form_label')}</Form.Label>
            <Form.Control
              ref={focusRef}
              {...searchField}
              reset={null}
              placeholder={translate('login_username')}
            />
          </Form.Group>
          <Button onClick={() => handleClear()} variant="primary">
            Clear
          </Button>
        </Form>
        <Container>
          <Row>
            <Col
              style={{
                textAlign: 'center',
                marginTop: '5em',
              }}
            >
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            </Col>
          </Row>
        </Container>
      </div>
    );

  if (me === null || me === undefined)
    return (
      <div style={{ minHeight: '100vh' }}>
        <Form>
          <Form.Group>
            <Form.Label>{translate('usersearch_form_label')}</Form.Label>
            <Form.Control
              ref={focusRef}
              {...searchField}
              reset={null}
              placeholder={translate('login_username')}
            />
          </Form.Group>
          <Button onClick={() => handleClear()} variant="primary">
            Clear
          </Button>
        </Form>
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
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
      </div>
    );

  return (
    <div style={{ minHeight: '100vh' }}>
      <Form>
        <Form.Group>
          <Form.Label>{translate('usersearch_form_label')}</Form.Label>
          <Form.Control
            ref={focusRef}
            {...searchField}
            reset={null}
            placeholder={translate('login_username')}
          />
        </Form.Group>
        <Button onClick={() => handleClear()} variant="primary">
          {translate('usersearch_form_button')}
        </Button>
      </Form>
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
                        <Button variant="secondary" disabled>
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
    </div>
  );
};

UserSearch.propTypes = {
  user: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  setNotification: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired,
  me: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
  history: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
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
