import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useQuery } from 'react-apollo-hooks';
import { Container, Col, Row, Spinner, Table } from 'react-bootstrap';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { GET_USER_INFO } from '../services/queries';

const UserPage = props => {
  const { foo, user } = props;

  console.log(user);

  const { data, loading, error } = useQuery(GET_USER_INFO, {
    variables: {
      username: foo.params.username,
    },
  });

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

  if (!loading) console.log(data);

  return (
    <>
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
                        </tr>
                      </>
                    );
                  })}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </>
  );
};

const mapStateToProps = state => {
  return {
    user: state.user,
    notification: state.notification,
  };
};

const mapDispatchToProps = {};

UserPage.propTypes = {
  user: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  foo: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(UserPage)
);
