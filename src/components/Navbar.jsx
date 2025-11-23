// import { Link } from "react-router-dom";
// import { Button, Alert } from 'react-bootstrap';

// export default function Navbar() {
//   return (
//     <nav className="bg-blue-600 text-white p-4 flex gap-4">
//       <Link to="/">Home</Link>
//       <Button variant="primary">Click Me</Button>
//       <Link to="/about">About</Link>
//     </nav>
//   );
// }

// import Container from 'react-bootstrap/Container';
// import Nav from 'react-bootstrap/Nav';
// import Navbar from 'react-bootstrap/Navbar';
// import Button from 'react-bootstrap/Button';
import { Navbar, Nav, NavDropdown, Container, Image } from "react-bootstrap"
// import { Link } from 'react-router-dom';

function ColorSchemesExample({ user, onLogout }) {
  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="/">Bumm.kids</Navbar.Brand>
        <Nav className="me-auto d-flex w-100">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/about">About</Nav.Link>
          <div className='ms-auto'>
            {user ? (
              <NavDropdown
                align="end"
                title={
                  <>
                    <Image
                      src={user.profilePictureUrl || "/img/default-avatar.jpg"} // Replace with actual path or user's avatar URL
                      roundedCircle
                      width="30"
                      height="30"
                      className="me-2"
                    />
                    {user.name || user.email}
                  </>
                }
                id="user-profile-dropdown"
              >
                <NavDropdown.Item href="/account">Profile</NavDropdown.Item>
                <NavDropdown.Item href="/account-setting">Settings</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={onLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link href="/login">Login</Nav.Link>
            )}
          </div>

        </Nav>
      </Container>
    </Navbar>
  )
}

export default ColorSchemesExample
