import React from 'react';
import { Nav, Navbar, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Header = props => {
  const styles = {
    color: 'white',
  };
  return (
    <Navbar expand="sm" collapseOnSelect bg="primary" variant="dark">
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
        <Form inline>
          <Form.Control type="text" placeholder="Search" className="mr-sm-2" />
          <Button variant="outline-dark">GO</Button>
        </Form>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
