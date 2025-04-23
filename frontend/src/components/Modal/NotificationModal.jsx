import React, { useState, useEffect } from "react";
import { Modal, Button, Card, Row, Col, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const NOTIFICATION_MESSAGE = [
  "Your rideshare request has been accepted.",
  "Your rideshare request was rejected.",
];

const NotificationModal = ({
  showModal,
  handleClose,
  notifications,
  setNotifications,
}) => {
  const navigate = useNavigate();
  const [localNotifications, setLocalNotifications] = useState([]);

  // Sync with parent when modal is opened
  useEffect(() => {
    if (showModal && Array.isArray(notifications)) {
      setLocalNotifications(notifications);
    }
  }, [showModal, notifications]);

  const handleView = (notification) => {
    if (notification.rideshareId != null) {
      navigate(`/rideshare/${notification.rideshareId}`);
    } else if (notification.bookingId != null) {
      navigate(`/booking/my-booking/${notification.carId}`);
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

      // Update the response status locally
      setLocalNotifications((prev) =>
        prev.map((n) =>
          n.rideshareId === rideshareId
            ? { ...n, responseStatus: isAccepted ? "accepted" : "rejected" }
            : n
        )
      );
    } catch (error) {
      console.error("Failed to respond to rideshare:", error);
      alert("Something went wrong");
    }
  };

  const handleDismissNotification = async (notificationId) => {
    try {
      const res = await fetch(
        `http://localhost:3000/auth/cancel-notification/${notificationId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const result = await res.json();
      // alert(result.message);
    } catch (error) {
      console.error("Failed to dismiss notification:", error);
      alert("Something went wrong");
    }
  };

  return (
    <Modal show={showModal} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Notifications</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {localNotifications.length === 0 ? (
          <p className="text-center">No new notifications</p>
        ) : (
          <div>
            {localNotifications.map((notification, index) => (
              <Card key={index} className="mb-3 shadow-sm">
                <Card.Body>
                  <Row>
                    <Col md={9}>
                      <p className="notification-message mb-0">
                        <strong>{notification.message}</strong>
                      </p>
                      {notification.responseStatus === "rejected" && (
                        <Badge bg="danger" className="mt-2">
                          Rejected
                        </Badge>
                      )}
                      {notification.responseStatus === "accepted" && (
                        <Badge bg="success" className="mt-2">
                          Accepted
                        </Badge>
                      )}
                    </Col>
                    <Col
                      md={3}
                      className="d-flex align-items-center justify-content-end flex-wrap gap-2"
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
                          {notification.isAccepted ? (
                            <Button
                              variant="primary"
                              onClick={() => handleView(notification)}
                            >
                              View Rideshare
                            </Button>
                          ) : (
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
                        </>
                      )}

                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() =>
                          handleDismissNotification(notification.notificationId)
                        }
                      >
                        Dismiss
                      </Button>
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
