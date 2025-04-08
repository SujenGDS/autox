import React, { useState } from "react";
import { Modal, Button, Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const NotificationModal = ({ showModal, handleClose, notifications }) => {
  const navigate = useNavigate();
  const handleView = (notification) => {
    if (notification.rideshareId != null) {
      navigate(`/rideshare/${notification.rideshareId}`);
      //window.location.href = `/rideshare/${notification.rideshareId}`;
    } else if (notification.bookingId != null) {
      navigate(`/booking/owner/${notification.bookingId}`);
      //window.location.href = `/booking/${notification.bookingId}`;
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
    } catch (error) {
      console.error("Failed to respond to rideshare:", error);
      alert("Something went wrong");
    }
  };

  console.log("Notifs", notifications);

  return (
    <Modal show={showModal} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Notifications</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!Array.isArray(notifications) && notifications.message != null ? (
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
                      {notification.bookingId != null && (
                        <Button
                          variant="primary"
                          onClick={() => handleView(notification)}
                        >
                          View Booking
                        </Button>
                      )}

                      {notification.rideshareId != null && (
                        <>
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() =>
                              handleRideShareAction(
                                notification.rideshareId,
                                true
                              )
                            }
                          >
                            Accept
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() =>
                              handleRideShareAction(
                                notification.rideshareId,
                                false
                              )
                            }
                          >
                            Reject
                          </Button>
                        </>
                      )}

                      {notification.rideshareId != null && (
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
