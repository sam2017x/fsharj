import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Form, Container, Row, Col, Table } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import { useQuery } from 'react-apollo-hooks';
import { useField } from '../hooks/index';
import { ALL_USERS } from '../services/queries';

const UserSearch = props => {
  const searchField = useField('text');

  const { data, loading } = useQuery(ALL_USERS);
  const { user } = props;

  const focusRef = React.createRef();

  const focus = () => {
    focusRef.current.focus();
  };

  const handleClear = () => {
    searchField.reset();
    focus();
  };

  console.log('PROPS USER ID', user);

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
              .filter(
                usr =>
                  usr.username
                    .toLowerCase()
                    .includes(searchField.value.toLowerCase()) &&
                  usr.id !== user.id
              )
              .map((usr, i) => (
                <tr key={`${usr.username}-list`}>
                  <td>{i + 1}</td>
                  <td>
                    <Link to={`/user/${usr.username}`}>{usr.username}</Link>
                  </td>
                  {user.token && (
                    <td>
                      <Button
                        variant="primary"
                        onClick={() => console.log('invited')}
                      >
                        Invite
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
};

const mapStateToProps = state => {
  return {
    user: state.user,
    notification: state.notification,
  };
};

export default withRouter(connect(mapStateToProps)(UserSearch));
