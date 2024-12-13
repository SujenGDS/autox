import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <Navbar bg="dark" data-bs-theme="dark" className="sticky-top">
      <Container fluid className="justify-content-between">
        <Navbar.Brand href="#home" className="fs-3">
          AutoX
        </Navbar.Brand>
        <Nav className="me-auto  ms-auto">
          <Nav.Link href="#home" className="mx-3 fs-5">
            Home
          </Nav.Link>
          <Nav.Link href="#Cars" className="mx-3 fs-5">
            Cars
          </Nav.Link>
          <Nav.Link href="#lift" className="mx-3 fs-5">
            Lift
          </Nav.Link>
          <Nav.Link href="#compare" className="mx-3 fs-5">
            Compare
          </Nav.Link>
        </Nav>
        <div className="" aria-label="Basic example">
          <Button
            className="me-1"
            variant="primary"
            style={{
              backgroundColor: "#800000",
              border: "none",
              outline: "none",
            }}
          >
            Rent your car
          </Button>
          <Button
            className="me-2"
            variant="secondary"
            onClick={() => navigate("/sujen-login")}
          >
            Login
          </Button>

          <Button
            className="me-2 "
            variant="secondary"
            onClick={() => navigate("/sujen-register")}
          >
            Register
          </Button>
        </div>
      </Container>
    </Navbar>
  );
};

export default NavBar;
