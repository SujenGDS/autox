import React from "react";
import { Modal, Button } from "react-bootstrap";

const NotificationModal = ({ showModal, handleClose, notifications }) => {
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
              <div
                key={index}
                className="notification-item d-flex justify-content-between align-items-center p-2 mb-2 border rounded"
                style={{ backgroundColor: "#f8f9fa" }} // Light gray background
              >
                <span>
                  <strong>{notification.type}:</strong> {notification.id}
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleView(notification.type, notification.id)}
                >
                  {notification.type === "rideshare"
                    ? "View Rideshare"
                    : "View Booking"}
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

// Example function to handle view click
const handleView = (type, id) => {
  if (type === "rideshare") {
    window.location.href = `/rideshare/${id}`; // Redirect to rideshare details
  } else if (type === "booking") {
    window.location.href = `/booking/${id}`; // Redirect to booking details
  }
};

export default NotificationModal;
