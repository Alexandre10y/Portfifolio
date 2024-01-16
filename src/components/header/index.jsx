import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import './style.css'
function Header() {
  return (
    <Navbar collapseOnSelect expand="lg" className="bg-header">
      <Container >
        <Navbar.Brand className='text-header' href="/Home">Belloni Alexandre</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/About">About</Nav.Link>
            <Nav.Link href="/Project">Project</Nav.Link>
            <Nav.Link href="#deets">Dark Mode</Nav.Link>
            <Nav.Link href=".#">Portuguese</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;