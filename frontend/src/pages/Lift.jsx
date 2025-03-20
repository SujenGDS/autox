import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";

import { Card, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const LiftPage = () => {
  const [rides, setRides] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await axios.get("http://localhost:3000/booking/lifts");
        setRides(response.data.rides);
      } catch (err) {
        console.error("Error fetching rides:", err);
      }
    };

    fetchRides();
  }, []);

  const handleBookNowClick = (ride) => {
    setSelectedRide(ride);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRide(null);
  };

  return (
    <>
      <NavBar setRefresh={setRefresh} />
      <div className="container mt-4">
        <h2 className="text-center mb-4">Available Ride Shares</h2>

        {rides.length === 0 ? (
          <p className="text-center text-muted">No ride shares available</p>
        ) : (
          <div className="row">
            {rides.map((ride) => (
              <div key={ride.bookingId} className="col-md-6 col-lg-4 mb-4">
                <Card
                  className="bg-light text-black w-100 lift-card"
                  style={{ cursor: "pointer" }}
                >
                  <Card.Body>
                    <Card.Title>{ride.carName}</Card.Title>
                    <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                      <li>{ride.rideShareDestination} </li>
                      <li>Price: {ride.rideSharePrice}</li>
                    </ul>
                  </Card.Body>
                  <Card.Footer className="d-flex justify-content-between align-items-center">
                    <Button
                      variant="outline-dark"
                      onClick={() => handleBookNowClick(ride)}
                    >
                      Send request
                    </Button>
                  </Card.Footer>
                </Card>
              </div>
            ))}
          </div>
        )}

        {/* Modal for booking */}
        {selectedRide && (
          <Modal show={showModal} onHide={handleCloseModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>Ride share with {selectedRide.carName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                <strong>Destination:</strong>{" "}
                {selectedRide.rideShareDestination}
              </p>
              <p>
                <strong>Price:</strong> {selectedRide.rideSharePrice}
              </p>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-between">
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button variant="outline-dark">Request</Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </>
  );
};

export default LiftPage;
