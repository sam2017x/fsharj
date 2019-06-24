import React from 'react';
import { Nav, Navbar, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Togglable from './Togglable';

const Header = props => {
  const styles = {
    color: 'white',
  };
  return (
    <Navbar expand="md" collapseOnSelect bg="primary" variant="dark">
      <Navbar.Brand href="/">
        <Link to="/" style={styles}>
          FSHT
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/stats">
            <Link to="/stats" style={styles}>
              Stats
            </Link>
          </Nav.Link>
          <Nav.Link href="/about">
            <Link to="/about" style={styles}>
              About
            </Link>
          </Nav.Link>
        </Nav>
        {!window.localStorage.getItem('userLoggedIn') && (
          <Togglable value="Log in">
            <Form inline>
              <Form.Control
                type="text"
                placeholder="Username"
                className="mr-sm-3"
              />
              <Form.Control
                type="password"
                placeholder="Password"
                className="mr-sm-3"
              />
              <Button variant="outline-dark">GO</Button>
            </Form>
          </Togglable>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
