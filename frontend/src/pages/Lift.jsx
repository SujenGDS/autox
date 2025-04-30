import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";
import { Card, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  }, [refresh]);

  const handleBookNowClick = (ride) => {
    setSelectedRide(ride);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRide(null);
  };

  const handleRequestRide = async () => {
    if (selectedRide) {
      try {
        const token = localStorage.getItem("token");

        await axios.post(
          "http://localhost:3000/rideShare/request-lift",
          {
            bookingId: selectedRide.bookingId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setShowModal(false);
        setSelectedRide(null);
        setRefresh(!refresh);

        // Show success toast
        toast.success("Ride request sent successfully!");
      } catch (err) {
        console.error("Error requesting ride:", err);

        if (err.response && err.response.status === 401) {
          toast.error("You cannot request a lift for a booking you made.");
        } else if (err.response && err.response.status === 409) {
          toast.error("You have already sent a lift request for this booking.");
        } else {
          toast.error("Error booking car!");
        }
      }
    }
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
                      <li>
                        <strong>{ride.startDestination}</strong> ➝{" "}
                        <strong>{ride.rideShareDestination}</strong>
                      </li>
                      <li>
                        Departing date:{" "}
                        {new Date(ride.startDate).toLocaleDateString()}
                      </li>

                      <li>Description: {ride.rideShareDescription}</li>
                      <li>Price: {ride.rideSharePrice}</li>
                    </ul>
                  </Card.Body>
                  <Card.Footer className="d-flex justify-content-between align-items-center">
                    {new Date(ride.startDate) > new Date() ? (
                      <Button
                        variant="outline-dark"
                        onClick={() => handleBookNowClick(ride)}
                      >
                        Send request
                      </Button>
                    ) : (
                      <span className="text-muted">Ride Started</span>
                    )}
                  </Card.Footer>
                </Card>
              </div>
            ))}
          </div>
        )}

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
              <Button variant="outline-dark" onClick={handleRequestRide}>
                Request
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>

      {/* ToastContainer for displaying toasts */}
      <ToastContainer />
    </>
  );
};

export default LiftPage;
