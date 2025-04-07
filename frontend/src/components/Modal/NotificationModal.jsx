import React, { useState } from "react";
import { Modal, Button, Card, Row, Col } from "react-bootstrap";

const NotificationModal = ({ showModal, handleClose, notifications }) => {
  const [acceptedRideshares, setAcceptedRideshares] = useState([]);

  const handleView = (notification) => {
    if (notification.type === "rideshare") {
      window.location.href = `/rideshare/${notification.id}`;
    } else if (notification.type === "booking") {
      window.location.href = `/booking/${notification.id}`;
    }
  };

  const handleRideShareAction = async (rideshareId, isAccepted) => {
    try {
      const res = await fetch("http://localhost:3000/rideShare/respond", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ rideshareId, isAccepted }),
      });

      const result = await res.json();
      alert(result.message);

      // If accepted, track in local state to show View button
      if (isAccepted) {
        setAcceptedRideshares((prev) => [...prev, rideshareId]);
      }
    } catch (error) {
      console.error("Failed to respond to rideshare:", error);
      alert("Something went wrong");
    }
  };

  return (
    <Modal show={showModal} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Notifications</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {notifications.length === 0 ? (
          <p className="text-center">No new notifications</p>
        ) : (
          <div>
            {notifications.map((notification, index) => (
              <Card key={index} className="mb-3 shadow-sm">
                <Card.Body>
                  <Row>
                    <Col md={9}>
                      <p className="notification-message">
                        <strong>{notification.message}</strong>
                      </p>
                    </Col>
                    <Col
                      md={3}
                      className="d-flex align-items-center justify-content-end gap-2"
                    >
                      {notification.type === "booking" && (
                        <Button
                          variant="primary"
                          onClick={() => handleView(notification)}
                        >
                          View Booking
                        </Button>
                      )}

                      {notification.type === "rideshare" &&
                        !acceptedRideshares.includes(notification.id) && (
                          <>
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() =>
                                handleRideShareAction(notification.id, true)
                              }
                            >
                              Accept
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() =>
                                handleRideShareAction(notification.id, false)
                              }
                            >
                              Reject
                            </Button>
                          </>
                        )}

                      {notification.type === "rideshare" &&
                        acceptedRideshares.includes(notification.id) && (
                          <Button
                            variant="primary"
                            onClick={() => handleView(notification)}
                          >
                            View Rideshare
                          </Button>
                        )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NotificationModal;
