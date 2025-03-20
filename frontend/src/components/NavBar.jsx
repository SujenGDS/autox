import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CarPostModal from "./Modal/CarPostModal";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { UserCircle } from "lucide-react";
import { Bell } from "lucide-react";

const NavBar = ({ setRefresh }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  const logout = function () {
    toast.success("You have been logged out successfully.");
    localStorage.removeItem("token");

    setTimeout(() => {
      window.location.href = "/";
    }, 500);
  };

  return (
    <>
      <CarPostModal show={show} setShow={setShow} setRefresh={setRefresh} />
      <Navbar
        bg="black"
        data-bs-theme="dark"
        className="sticky-top"
        style={{ height: "62px" }}
      >
        <Container fluid className="justify-content-between px-5">
          <Navbar.Brand
            href="/sujen-home"
            className={`mx-3 fs-5 ${
              location.pathname === "/sujen-home" || location.pathname === "/"
                ? "active"
                : ""
            }`}
          >
            <img
              src="images/newLG.png"
              alt="logo"
              style={{ width: "90px", height: "auto" }}
            />
          </Navbar.Brand>
          <Nav className="me-auto  ms-auto">
            <Nav.Link
              href="/sujen-home"
              className={`mx-3 fs-5 ${
                location.pathname === "/sujen-home" || location.pathname === "/"
                  ? "active"
                  : ""
              }`}
            >
              Home
            </Nav.Link>

            <Nav.Link
              href="/Cars"
              className={`mx-3 fs-5 ${
                location.pathname === "/Cars" || location.pathname === "/Cars"
                  ? "active"
                  : ""
              }`}
            >
              Cars
            </Nav.Link>

            <Nav.Link
              href="/booking/lifts"
              className={`mx-3 fs-5 ${
                location.pathname === "/booking/lifts" ||
                location.pathname === "/booking/lifts"
                  ? "active"
                  : ""
              }`}
            >
              Lifts
            </Nav.Link>

            <Nav.Link href="#compare" className="mx-3 fs-5">
              Compare
            </Nav.Link>
          </Nav>

          {isLoggedIn && (
            <div
              className="cursor-pointer flex items-center"
              onClick={() => navigate("/notifications")}
            >
              <Bell size={32} color="#800000" />
              <span className="ms-2 text-sm font-medium"></span>
            </div>
          )}

          {isLoggedIn && (
            <div
              className="cursor-pointer flex items-center"
              onClick={() => navigate("/UserProfile")}
            >
              <UserCircle size={32} color="#800000" />
              <span className="ms-2 text-sm font-medium"></span>
            </div>
          )}

          <div className="" aria-label="Rent Button">
            {isLoggedIn && (
              <Button
                className="me-1"
                variant="primary"
                style={{
                  backgroundColor: "#800000",
                  border: "none",
                  outline: "none",
                }}
                onClick={() => setShow(true)}
              >
                Rent your car
              </Button>
            )}

            {isLoggedIn && (
              <Button
                className="me-1"
                variant="primary"
                style={{
                  backgroundColor: "#800000",
                  border: "none",
                  outline: "none",
                }}
                onClick={logout}
              >
                Log out
              </Button>
            )}

            {!isLoggedIn && (
              <>
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
              </>
            )}
          </div>
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;
