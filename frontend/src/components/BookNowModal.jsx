import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookNowModal = ({
  showModal,
  setShowModal,
  price,
  title,
  carId,
  setRefresh,
}) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pickUpLocation, setPickUpLocation] = useState("");
  const [dropOffLocation, setDropOffLocation] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!startDate || !endDate || !pickUpLocation || !dropOffLocation) {
      toast.error("Please fill in all the fields");
      return;
    }

    try {
      const payload = {
        carId: carId,
        startDate: startDate,
        endDate: endDate,
        pickUpLocation: pickUpLocation,
        dropOffLocation: dropOffLocation,
      };

      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/booking/book",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Car booked successfully");
      setRefresh((prev) => !prev);
      setShowModal(false);
    } catch (err) {
      if (err.response) {
        if (err.response.status === 403) {
          toast.error("You cannot book your own car!");
        } else {
          toast.error(
            err.response.data.message ||
              "Something went wrong. Please try again."
          );
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }
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
