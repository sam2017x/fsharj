import React from 'react';
import { Nav, Navbar, Button, NavDropdown, Image } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { setUser } from '../reducers/user';
import Togglable from './Togglable';
import translate from '../util/localization/i18n';
import Signup from './Signup';
import Login from './Login';
import logo from '../util/img/logo2.jpg';

const Header = ({ history, user, setUser, client, setLocale }) => {
  const styles = {
    color: 'white',
  };

  const formToggle = React.createRef();
  const toggleForm = () => {
    formToggle.current.toggleVisibility();
  };

  const logout = () => {
    window.localStorage.clear();
    setUser({});
    client.resetStore();
    history.push('/');
  };

  return (
    <Navbar expand="md" collapseOnSelect bg="dark" variant="dark" sticky="top">
      <Navbar.Brand href="/" as="span">
        <Link to="/">
          <Image
            rounded
            alt="logo"
            src={logo}
            width="40"
            height="40"
            className="d-inline-block align-top"
          />
        </Link>
        {' FSHT'}
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <NavDropdown
            title={translate('header_services')}
            id="collasible-nav-dropdown"
          >
            <NavDropdown.Item as="span">
              <Link to="/service/space">{translate('header_space')}</Link>
            </NavDropdown.Item>
            <NavDropdown.Item as="span">
              <Link to="/service/weather">{translate('header_weather')}</Link>
            </NavDropdown.Item>
          </NavDropdown>
          <Nav.Link href="/s/users" as="span">
            <Link to="/s/users" style={styles}>
              {translate('header_users')}
            </Link>
          </Nav.Link>
        </Nav>
        <div className="ml-auto mr-4">
          <div>
            <Button
              style={{ width: '4rem' }}
              variant="outline-info"
              size="sm"
              active={document.documentElement.lang === 'en'}
              onClick={() => setLocale('en')}
            >
              en
            </Button>
          </div>
          <div>
            <Button
              style={{ width: '4rem' }}
              variant="outline-info"
              active={document.documentElement.lang === 'fi'}
              size="sm"
              onClick={() => setLocale('fi')}
            >
              fi
            </Button>
          </div>
        </div>
        {!user && (
          <>
            <Togglable ref={formToggle} color="warning">
              <Login toggleForm={toggleForm} client={client} />
              <Signup toggleForm={toggleForm} />
            </Togglable>
          </>
        )}
        {user && (
          <>
            <Navbar.Text as="span">
              <span style={{ color: 'white' }}>
                {translate('header_signed')}
              </span>
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
                {translate('header_logout')}
              </Button>
            </Navbar.Text>
          </>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

const mapDispatchToProps = {
  setUser,
};

Header.propTypes = {
  client: PropTypes.oneOfType([PropTypes.object]).isRequired,
  user: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.string,
  ]),
  history: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  setUser: PropTypes.func.isRequired,
};

Header.defaultProps = {
  user: undefined,
};

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(Header)
);
