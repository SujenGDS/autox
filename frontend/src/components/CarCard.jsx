import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import "../styles/carCard.css";

const CarCard = ({ carId, title, fuel, transmission, price, imgLink }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleNavigate = () => {
    navigate(`/car/${carId}`);
  };

  const handleBookNowClick = (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/sujen-login");
    } else {
      setShowModal(true);
    }
  };

  return (
    <div>
      <Card
        className="bg-light text-black w-100 car-card"
        onClick={handleNavigate}
        style={{ cursor: "pointer" }}
      >
        <Card.Img variant="top" src={imgLink} alt={title} />
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            <li>
              <span style={{ fontWeight: 500 }}>Fuel</span> - {fuel}
            </li>
            <li>
              <span style={{ fontWeight: 500 }}>Transmission</span> -{" "}
              {transmission}
            </li>
          </ul>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-between align-items-center">
          <small className="text-dark">{price}</small>
          <Button variant="outline-dark" onClick={handleBookNowClick}>
            Book Now
          </Button>
        </Card.Footer>
      </Card>

      {/* Book Now Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Book {title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Pick-up Date</Form.Label>
              <Form.Control type="date" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Drop-off Date</Form.Label>
              <Form.Control type="date" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Pick up location</Form.Label>
              <Form.Control type="text" placeholder="Enter location" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Drop off location</Form.Label>
              <Form.Control type="text" placeholder="Enter location" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <div>Total: {price}</div>
          <div>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="outline-dark" className="ms-2">
              Proceed to Payment
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CarCard;
