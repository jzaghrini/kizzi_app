import './AppNavbar.css'
import { Instagram, Envelope } from 'react-bootstrap-icons'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'

export const AppNavbar = () => {
  const isMobile = false
  return (
    <Navbar bg="secondary" expand="lg">
      <Container>
        <Navbar.Brand href="/" className="title">
          Kizzi
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav>
            <Nav.Link href="https://kizziatx.com">Home</Nav.Link>
            <Nav.Link href="/signup">Sign up</Nav.Link>
            <Nav.Link target="_blank" href="https://instagram.com/kizzi.atx">
              {isMobile ? 'Instagram' : <Instagram />}
            </Nav.Link>
            <Nav.Link href="mailto:joe@kizziatx.com">
              {isMobile ? 'Email' : <Envelope />}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
