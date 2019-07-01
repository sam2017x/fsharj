import React from 'react';
import { Nav, Navbar, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Togglable from './Togglable';
import Login from './Login';

const Header = props => {
  const styles = {
    color: 'white',
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
        {!window.localStorage.getItem('userLoggedIn') && (
          <Togglable value="Log in">
            <Login />
          </Togglable>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
