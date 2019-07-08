import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Container, Row, Col, Table } from 'react-bootstrap';
import { useQuery } from 'react-apollo-hooks';
import { ALL_USERS } from '../services/queries';

const UserSearch = props => {
  const [searchDone, setSearchDone] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const { data, loading } = useQuery(ALL_USERS);

  console.log('onload userSearch', data);

  return (
    <>
      {!searchDone && (
        <>
          <Form>
            <Form.Group>
              <Form.Label>Search with username: </Form.Label>
              <Form.Control
                type="text"
                placeholder="username"
                value={searchValue}
                onChange={event => setSearchValue(event.target.value)}
              />
            </Form.Group>
            <Button onClick={() => console.log('adawd')} variant="primary">
              Search
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
                data.allUsers.map((user, i) => (
                  <tr key={`${user.username}-list`}>
                    <td>{i + 1}</td>
                    <td>{user.username}</td>
                    <td>
                      <Button
                        variant="primary"
                        onClick={() => console.log('invited')}
                      >
                        Invite
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

const mapStateToProps = state => {
  return {
    user: state.user,
    notification: state.notification,
  };
};

export default UserSearch;
