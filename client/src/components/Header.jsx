import React from 'react';
import { Nav, Navbar, Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Togglable from './Togglable';
import Signup from './Signup';
import Login from './Login';

const Header = ({ user }) => {
  const styles = {
    color: 'white',
  };
  console.log(user)

  const loginRef = React.createRef();

  const toggleLoginForm = () => {
    loginRef.current.toggleVisibility();
  };

  return (
    <Navbar expand="md" collapseOnSelect bg="primary" variant="dark">
      <Navbar.Brand href="/" as="span">
        <Link to="/" style={styles}>
          FSHT
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/stats" as="span">
            <Link to="/stats" style={styles}>
              Stats
            </Link>
          </Nav.Link>
          <Nav.Link href="/about" as="span">
            <Link to="/about" style={styles}>
              About
            </Link>
          </Nav.Link>
        </Nav>
        {user.token === undefined && (
          <>
            <Togglable ref={loginRef} value="Log in" color="warning">
              <Login />
              <Signup />
            </Togglable>
            {/*<Togglable ref={signupRef} value="Sign up" color="success">
              <Signup />
        </Togglable> */}
          </>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

const mapStateToProps = state => {
  return {
    user: state.user,
  };
};

Header.propTypes = {
  user: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default connect(mapStateToProps)(Header);
