import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import CarPostModal from "./Modal/CarPostModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserCircle } from "lucide-react";
import NotificationModal from "./Modal/NotificationModal"; // Import the notification modal

const NavBar = ({ setRefresh }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [show, setShow] = useState(false); // For car posting modal
  const [showNotificationModal, setShowNotificationModal] = useState(false); // For notification modal
  const [notifications, setNotifications] = useState([
    { title: "Ride Request", message: "Your ride request has been accepted." },
  ]);
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const handleOpenNotificationModal = () => setShowNotificationModal(true);
  const handleCloseNotificationModal = () => setShowNotificationModal(false);

  const logout = function () {
    toast.success("You have been logged out successfully.");
    localStorage.removeItem("token");

    setTimeout(() => {
      window.location.href = "/";
    }, 500);
  };

  return (
    <>
      {/* Car Post Modal */}
      <CarPostModal show={show} setShow={setShow} setRefresh={setRefresh} />

      {/* Notification Modal */}
      <NotificationModal
        showModal={showNotificationModal}
        handleClose={handleCloseNotificationModal}
        notifications={notifications}
      />

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
          <Nav className="me-auto ms-auto">
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
                location.pathname === "/Cars" ? "active" : ""
              }`}
            >
              Cars
            </Nav.Link>

            <Nav.Link
              href="/booking/lifts"
              className={`mx-3 fs-5 ${
                location.pathname === "/booking/lifts" ? "active" : ""
              }`}
            >
              Lifts
            </Nav.Link>

            <Nav.Link href="/Compare" className="mx-3 fs-5">
              Compare
            </Nav.Link>
          </Nav>

          {isLoggedIn && (
            <div
              className="cursor-pointer flex items-center position-relative" // Ensure it's relative for modal positioning
              onClick={handleOpenNotificationModal}
            >
              <Bell size={32} color="#800000" />
              {notifications.length > 0 && (
                <span className="ms-2 text-sm font-medium">
                  {notifications.length}
                </span>
              )}
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
                onClick={handleShow}
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
                  className="me-2"
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
