import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import './style.css'
function Header() {
  return (
    <Navbar collapseOnSelect expand="lg" className="bg-header">
      <Container >
        <Navbar.Brand className='text-header fs-3' href="/Home">Alexandre Belloni</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link className='fs-5' href="/Home">Home</Nav.Link>
            <Nav.Link className='fs-5' href="/About">Sobre</Nav.Link>
            <Nav.Link className='fs-5' href="/Project">Projetos</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;