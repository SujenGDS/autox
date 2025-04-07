import React from "react";
import { Modal, Button, Card, Row, Col } from "react-bootstrap";

const NotificationModal = ({ showModal, handleClose, notifications }) => {
  // Function to handle the view button click
  const handleView = (notification) => {
    if (notification.type === "rideshare") {
      window.location.href = `/rideshare/${notification.id}`; // Redirect to rideshare details
    } else if (notification.type === "booking") {
      window.location.href = `/booking/${notification.id}`; // Redirect to booking details
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
                      className="d-flex align-items-center justify-content-end"
                    >
                      <Button
                        variant="primary"
                        onClick={() => handleView(notification)} // Pass the notification object
                      >
                        {notification.type === "booking"
                          ? "View Booking"
                          : "View Rideshare"}
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
