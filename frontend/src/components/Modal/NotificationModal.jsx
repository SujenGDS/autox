import React from "react";
import { Modal, Button } from "react-bootstrap";

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
    <Modal show={showModal} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Notifications</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {notifications.length === 0 ? (
          <p>No new notifications</p>
        ) : (
          <div>
            {notifications.map((notification, index) => (
              <div key={index} className="notification-item">
                <p>
                  <strong>{notification.message}</strong>
                </p>
                <Button
                  variant="primary"
                  onClick={() => handleView(notification)} // Pass the notification object
                >
                  {notification.type === "booking"
                    ? "View Booking"
                    : "View Rideshare"}
                </Button>
              </div>
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
