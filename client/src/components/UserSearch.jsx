import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Form, Container, Row, Col, Table } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import { useQuery, useMutation } from 'react-apollo-hooks';
import { useField } from '../hooks/index';
import { setNotification } from '../reducers/notification';
import { setUser } from '../reducers/user';
import { ALL_USERS, ADD_FRIEND } from '../services/queries';

const UserSearch = props => {
  const { user, me } = props;
  const searchField = useField('text');

  const { data, loading } = useQuery(ALL_USERS);
  const addFriend = useMutation(ADD_FRIEND);

  console.log('UserSearch', user);
  console.log(me.data);

  const focusRef = React.createRef();

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
        console.log('afterAdd', afterAdd);
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
            reset={null}
            {...searchField}
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
  me: PropTypes.objectOf(PropTypes.object).isRequired,
};

const mapStateToProps = state => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = {
  setNotification,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(UserSearch)
);
