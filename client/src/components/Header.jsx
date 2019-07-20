import React from 'react';
import { Nav, Navbar, Button, NavDropdown } from 'react-bootstrap';
import { useApolloClient } from 'react-apollo-hooks';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { ME } from '../services/queries';
import PropTypes from 'prop-types';
import { setUser } from '../reducers/user';
import Togglable from './Togglable';
import Signup from './Signup';
import Login from './Login';

const Header = props => {
  const client = useApolloClient();
  const { user, history } = props;
  const styles = {
    color: 'white',
  };

  // Ref toggle, for reference.
  const formToggle = React.createRef();
  const toggleForm = () => {
    formToggle.current.toggleVisibility();
  };

  const logout = () => {
    window.localStorage.clear();
    props.setUser({});
    client.resetStore();
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
          <NavDropdown title="Search" id="collasible-nav-dropdown">
            <NavDropdown.Item as="span">
              <Link to="/s/users">Users</Link>
            </NavDropdown.Item>
            <NavDropdown.Item as="span">
              <Link to="/s/groups">Groups</Link>
            </NavDropdown.Item>
            <NavDropdown.Item as="span">
              <Link to="/s/posts">Posts</Link>
            </NavDropdown.Item>
          </NavDropdown>
          <Nav.Link href="/about" as="span">
            <Link to="/about" style={styles}>
              About
            </Link>
          </Nav.Link>
        </Nav>
        {user.token === undefined && (
          <>
            <Togglable ref={formToggle} color="warning">
              <Login toggleForm={toggleForm} />
              <Signup toggleForm={toggleForm} />
            </Togglable>
          </>
        )}
        {user.token && (
          <>
            <Navbar.Text as="span">
              <span style={{ color: 'white' }}>Signed in as: </span>
              <Link
                className="mr-2"
                to={`/user/${user.username}`}
                style={{ color: 'black', textUnderlinePosition: 'auto' }}
              >
                {user.username}
              </Link>
              |
              <Button
                size="sm"
                className="ml-2"
                onClick={() => logout()}
                variant="danger"
              >
                Logout
              </Button>
            </Navbar.Text>
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
  user: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.string,
  ]).isRequired,
  history: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  setUser: PropTypes.func.isRequired,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Header)
);
