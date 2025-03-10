import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import axios from "axios";

const BookNowModal = ({ showModal, setShowModal, price, title, carId }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pickUpLocation, setPickUpLocation] = useState("");
  const [dropOffLocation, setDropOffLocation] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!startDate || !endDate || !pickUpLocation || !dropOffLocation) {
      alert("Please fill in all the fields");
      return;
    }

    // Log the values before sending the request
    console.log("Booking details:");
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);
    console.log("Pick-up Location:", pickUpLocation);
    console.log("Drop-off Location:", dropOffLocation);

    try {
      console.log("Sending POST request to backend...");

      const payload = {
        carId: carId,
        startDate: startDate,
        endDate: endDate,
        pickUpLocation: pickUpLocation,
        dropOffLocation: dropOffLocation,
      };

      const token = localStorage.getItem("token");
      console.log(token);
      console.log(payload);
      const response = await axios.post(
        "http://localhost:3000/booking/book",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Booking successful:", response.data);
      // Proceed to payment or show confirmation
      setShowModal(false);
    } catch (err) {
      console.error("Error during booking:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Book {title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} method="POST">
          <Form.Group className="mb-3">
            <Form.Label>Pick-up Date</Form.Label>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Drop-off Date</Form.Label>
            <Form.Control
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Pick up location</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter location"
              value={pickUpLocation}
              onChange={(e) => setPickUpLocation(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Drop off location</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter location"
              value={dropOffLocation}
              onChange={(e) => setDropOffLocation(e.target.value)}
            />
          </Form.Group>
          <Button variant="outline-dark" type="submit" className="w-100">
            Proceed to Payment
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        <div>Total: {price}</div>
        <div>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default BookNowModal;
