import React from 'react';
import { Nav, Navbar, Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { setUser } from '../reducers/user';
import Togglable from './Togglable';
import Signup from './Signup';
import Login from './Login';

const Header = props => {
  const { user, history } = props;
  const styles = {
    color: 'white',
  };
  console.log(user);

  const loginRef = React.createRef();

  const toggleLoginForm = () => {
    loginRef.current.toggleVisibility();
  };

  const logout = () => {
    window.localStorage.clear();
    props.setUser({});
    history.push('/');
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
        {user.token && (
          <>
            <Nav.Link>
              <span style={{ color: 'white' }}>Signed in as: </span>
              <Link
                to={`/user/${user.username}`}
                style={{ color: 'black', textUnderlinePosition: 'auto' }}
              >
                {user.username}
              </Link>
            </Nav.Link>
            <Button onClick={() => logout()} variant="danger">
              Logout
            </Button>
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

const mapDispatchToProps = {
  setUser,
};

Header.propTypes = {
  user: PropTypes.objectOf(PropTypes.object).isRequired,
  history: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Header)
);
