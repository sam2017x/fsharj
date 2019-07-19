/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Form, Container, Row, Col, Table } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import { useQuery, useMutation, useApolloClient } from 'react-apollo-hooks';
import { useField } from '../hooks/index';
import { setNotification } from '../reducers/notification';
import { setUser } from '../reducers/user';
import { ALL_USERS, ADD_FRIEND, ME } from '../services/queries';

const UserSearch = props => {
  const searchField = useField('text');

  const { me } = props.me.data;
  const { data, loading } = useQuery(ALL_USERS);
  const addFriend = useMutation(ADD_FRIEND);
  const focusRef = React.createRef();

  if (me === null || me === undefined)
    return (
      <>
        <Form>
          <Form.Group>
            <Form.Label>Search with username: </Form.Label>
            <Form.Control
              ref={focusRef}
              {...searchField}
              reset={null}
              placeholder="username"
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
      </>
    );

  console.log('ME', me);
  console.log('ALL USERS', data);

  const focus = () => {
    focusRef.current.focus();
  };

  const handleFriendAdd = async id => {
    try {
      const afterAdd = await addFriend({
        variables: {
          id,
        },
      });

      if (!afterAdd.loading) {
        //props.setUser(afterAdd.addFriend.data);
        props.setNotification(`Friend added!`, 'success', 5);
      }
    } catch (error) {
      console.log(error);
      props.setNotification(`${error.message}`, 'danger', 5);
    }
  };

  const handleClear = () => {
    searchField.reset();
    focus();
  };

  return (
    <>
      <Form>
        <Form.Group>
          <Form.Label>Search with username: </Form.Label>
          <Form.Control
            ref={focusRef}
            {...searchField}
            reset={null}
            placeholder="username"
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
                  {usr.friends !== null &&
                  me.username === usr.username ? null : me.friends.find(
                      frd => frd.id === usr.id
                    ) === undefined ? (
                    <td>
                      <Button
                        variant="primary"
                        onClick={() => handleFriendAdd(usr.id)}
                      >
                        Add friend
                      </Button>
                    </td>
                  ) : (
                    <td>
                      <Button variant="secondary" disabled>
                        Remove
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
        </tbody>
      </Table>
    </>
  );
};

UserSearch.propTypes = {
  user: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  setNotification: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired,
  me: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
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
