import React from 'react';
import { connect } from 'react-redux';
import { Container, Col, Row } from 'react-bootstrap';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const UserPage = props => {
  const { user } = props;
  if (!user.token) return null;

  return (
    <>
      <Container>
        <Row>
          <Col> {user.username} </Col>
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
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(UserPage)
);
