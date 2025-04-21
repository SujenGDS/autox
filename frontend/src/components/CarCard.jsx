import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import "../styles/carCard.css";
import BookNowModal from "./BookNowModal";

const CarCard = ({
  carId,
  title,
  fuel,
  transmission,
  price,
  imgLink,
  isBooked,
  setRefresh,
}) => {
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
          {/* Show "Booked" if car is already booked, else show "Book Now" button */}
          {isBooked ? (
            <span className="text-danger fw-bold">Booked</span>
          ) : (
            <Button variant="outline-dark" onClick={handleBookNowClick}>
              Book Now
            </Button>
          )}
        </Card.Footer>
      </Card>

      <BookNowModal
        key={carId}
        setShowModal={setShowModal}
        showModal={showModal}
        title={title}
        price={price}
        carId={carId}
        setRefresh={setRefresh}
      />
    </div>
  );
};

export default CarCard;
