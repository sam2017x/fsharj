import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useQuery } from 'react-apollo-hooks';
import { Container, Col, Row, Spinner } from 'react-bootstrap';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { GET_USER_INFO } from '../services/queries';

const UserPage = props => {
  const { foo } = props;

  const { data, loading } = useQuery(GET_USER_INFO, {
    variables: {
      username: foo.params.username,
    },
  });

  if (!loading)
    return (
      <Container>
        <Row>
          <Col style={{ textAlign: 'center', marginTop: '50%' }}>
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
          <Col> awdawd </Col>
        </Row>
      </Container>
      <Container>
        <Row>
          <Col>ajwdijaiwdjaiowd</Col>
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
