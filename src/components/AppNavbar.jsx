import './AppNavbar.css'
import useBreakPoint from 'bootstrap-5-breakpoint-react-hook'
import { Instagram, Envelope } from 'react-bootstrap-icons'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'

const smallBreakpoints = ['xs', 'sm', 'md']
export const AppNavbar = () => {
  const breakpoint = useBreakPoint()
  const isMobile = smallBreakpoints.includes(breakpoint)
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
