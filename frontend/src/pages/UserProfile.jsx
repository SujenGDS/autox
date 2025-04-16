import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [bookedCars, setBookedCars] = useState([]);
  const [myRideShares, setMyRideShares] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentCar, setCurrentCar] = useState(null);
  const [editedCar, setEditedCar] = useState({
    carName: "",
    fuelType: "",
    transmission: "",
    pricePerDay: "",
    company: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:3000/auth/home`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userCars = await axios.get(`http://localhost:3000/auth/my-cars`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userBookings = await axios.get(
          `http://localhost:3000/booking/my-bookings`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const bookedCarsByOthers = await axios.get(
          `http://localhost:3000/auth/my-booked-cars`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const rideShares = await axios.get(
          `http://localhost:3000/auth/my-ride-share`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setMyRideShares(rideShares.data.rideDetails);
        setBookedCars(bookedCarsByOthers.data.cars);
        setUser(res.data.user);
        setCars(userCars.data.cars);
        setBookings(userBookings.data.bookings);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };
    fetchData();
  }, [refresh]);

  const handleEditCar = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:3000/car/edit-car/${id}`, editedCar, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setShowEditModal(false);
      setRefresh((prev) => !prev);
    } catch (err) {
      console.error("Failed to edit car:", err.response?.data || err.message);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/booking/cancel/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setShowCancelModal(false);
      setRefresh((prev) => !prev); // Refresh bookings
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      alert("Could not cancel booking.");
    }
  };

  const handleDeleteCar = async (Id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/car/delete-car/${Id}`
      );
      if (response.status === 200) {
        setRefresh((prev) => !prev);
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error("Error deleting car:", error);
      alert("Failed to delete car");
    }
  };

  const handleViewBookingDetail = (bookingId) => {
    navigate(`/booking/${bookingId}`);
  };

  const handleViewMyBookingDetail = (bookingId) => {
    navigate(`/booking/my-booking/${bookingId}`);
  };

  const handleReturnCar = async (carId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `http://localhost:3000/booking/return/${carId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert(response.data.message);
        // Refresh the list or remove the returned car from the UI
        setBookedCars(bookedCars.filter((car) => car.bookingId !== bookingId));
      } else {
        alert(response.data.message); // Show the error message like "Car cannot be returned until the booking end date has passed"
      }
    } catch (error) {
      console.error("Error returning car:", error);
      alert("Error returning car");
    }
  };

  return (
    <>
      <NavBar setRefresh={setRefresh} />
      <div className="container py-5">
        {user && (
          <h2 className="text-center  mb-4">Welcome, {user.firstName}</h2>
        )}

        {/* My Bookings Section */}
        <div className="mb-4">
          <h4 className="text-secondary mb-4">My Bookings</h4>
          {bookings.length === 0 ? (
            <p>No bookings found.</p>
          ) : (
            bookings.map((booking, index) => (
              <div
                key={index}
                className="card mb-4 p-4 border-0 shadow-sm rounded"
                style={{ cursor: "pointer" }}
                onClick={() => handleViewBookingDetail(booking.bookingId)}
              >
                <div className="d-flex">
                  <img
                    src="https://imgcdn.zigwheels.ph/medium/gallery/exterior/115/1640/rolls-royce-phantom-full-front-view-950210.jpg"
                    alt="Car"
                    className="img-thumbnail rounded"
                    style={{ width: "200px", height: "auto" }}
                  />
                  <div className="ms-4 flex-grow-1">
                    <h5>{booking.carName}</h5>
                    <p className="text-muted">
                      <strong>From:</strong> {booking.startDate.split("T")[0]}
                    </p>
                    <p className="text-muted">
                      <strong>To:</strong> {booking.endDate.split("T")[0]}
                    </p>
                    <p className="text-dark">
                      <strong>Total:</strong> {`${booking.totalAmount}`}
                    </p>
                    {/* Cancel Booking Button */}
                    <Button
                      variant="danger"
                      size="sm"
                      className="mt-2"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card's onClick from triggering
                        setCurrentBooking(booking);
                        setShowCancelModal(true); // Show Cancel Modal
                      }}
                    >
                      Cancel Booking
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* My Cars Section */}
        <div className="mb-4">
          <h4 className="text-secondary mb-4">My Cars</h4>
          {cars.length === 0 ? (
            <p>You have no cars listed yet.</p>
          ) : (
            cars.map((car, index) => (
              <div
                key={index}
                className="card mb-4 p-4 border-0 shadow-sm rounded"
              >
                <div className="d-flex">
                  <img
                    src="https://i.insider.com/51364fb06bb3f74508000027?width=800&format=jpeg&auto=webp"
                    alt={car.carName}
                    className="img-thumbnail rounded me-4"
                    style={{ width: "200px", height: "auto" }}
                  />
                  <div className="ms-4 flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5>
                        {car.carName}{" "}
                        <span
                          className={`badge ${
                            car.isBooked ? "bg-success" : "bg-warning"
                          } text-dark ms-2`}
                        >
                          {car.isBooked ? "Booked" : "Available"}
                        </span>
                      </h5>
                    </div>

                    <p className="text-muted">
                      <strong>Fuel:</strong> {car.fuelType}
                    </p>
                    <p className="text-muted">
                      <strong>Transmission:</strong> {car.transmission}
                    </p>
                    <p className="text-dark">
                      <strong>Price:</strong> {`${car.pricePerDay}/day`}
                    </p>
                  </div>
                  <div className="d-flex align-items-center">
                    <Button
                      variant="outline-warning"
                      className="me-3"
                      onClick={() => {
                        setCurrentCar(car);
                        setEditedCar({
                          carName: car.carName,
                          fuelType: car.fuelType,
                          transmission: car.transmission,
                          pricePerDay: car.pricePerDay,
                          company: car.company,
                        });
                        setShowEditModal(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      onClick={() => {
                        if (car.isBooked) {
                          alert(
                            "You cannot delete this car as it is currently booked!"
                          );
                          return;
                        }
                        setCurrentCar(car);
                        setShowDeleteModal(true);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cars Booked by Others Section */}
        <div>
          <h4 className="text-secondary mb-4">Cars Booked by Others</h4>
          {bookedCars.length === 0 ? (
            <p>No cars booked by others yet.</p>
          ) : (
            bookedCars.map((car, index) => (
              <div
                key={index}
                className="card mb-4 p-4 border-0 shadow-sm rounded"
                onClick={() => handleViewMyBookingDetail(car.carId)}
              >
                <div className="d-flex">
                  <img
                    src="https://imgcdn.zigwheels.ph/medium/gallery/exterior/115/1640/rolls-royce-phantom-full-front-view-950210.jpg"
                    alt="Car"
                    className="img-thumbnail rounded"
                    style={{ width: "200px", height: "auto" }}
                  />
                  <div className="ms-4 flex-grow-1">
                    <h5>{car.carName}</h5>
                    <p className="text-muted">
                      <strong>Rented By:</strong> {car.renterFirstName}{" "}
                      {car.renterLastName}
                    </p>
                    <p className="text-muted">
                      <strong>From:</strong> {car.startDate.split("T")[0]}
                    </p>
                    <p className="text-muted">
                      <strong>To:</strong> {car.endDate.split("T")[0]}
                    </p>
                    <p className="text-dark">
                      <strong>Price/Day:</strong> {car.pricePerDay}
                    </p>

                    {new Date(car.endDate) < new Date() && (
                      <button
                        className="btn btn-danger mt-2"
                        onClick={() => handleReturnCar(car.carId)}
                      >
                        Returned Car
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* My Ride Shares Section */}
        <div>
          <h4 className="text-secondary mb-4">My Ride Shares</h4>
          {myRideShares.length === 0 ||
          myRideShares.filter((ride) => ride.status !== "Rejected").length ===
            0 ? (
            <p>You haven't shared any rides yet.</p>
          ) : (
            myRideShares
              .filter((ride) => ride.status !== "Rejected")
              .map((ride, index) => {
                const isDriver = ride.driverId === user.userId; // compare IDs
                return (
                  <div
                    key={index}
                    className="card mb-4 p-4 border-0 shadow-sm rounded"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleViewBookingDetail(ride.bookingId)}
                  >
                    <div className="d-flex">
                      <img
                        src="https://imgcdn.zigwheels.ph/medium/gallery/exterior/115/1640/rolls-royce-phantom-full-front-view-950210.jpg"
                        alt="Shared Ride Car"
                        className="img-thumbnail rounded"
                        style={{ width: "200px", height: "auto" }}
                      />
                      <div className="ms-4 flex-grow-1">
                        <h5>{ride.carName}</h5>
                        <p className="text-muted">
                          <strong>Destination:</strong>{" "}
                          {ride.rideShareDestination}
                        </p>

                        {isDriver ? (
                          <>
                            <p className="text-muted">
                              <strong>Passenger:</strong>{" "}
                              {ride.passengerFirstName}
                            </p>
                            <p className="text-muted">
                              <strong>Passenger Phone:</strong>{" "}
                              {ride.passengerPhoneNumber}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-muted">
                              <strong>Driver:</strong> {ride.driverFirstName}
                            </p>
                            <p className="text-muted">
                              <strong>Driver Phone:</strong>{" "}
                              {ride.driverPhoneNumber}
                            </p>
                          </>
                        )}

                        <p className="text-muted">
                          <strong>Request status:</strong> {ride.status}
                        </p>

                        <p className="text-muted">
                          <strong>From:</strong> {ride.startDate.split("T")[0]}
                        </p>
                        <p className="text-muted">
                          <strong>To:</strong> {ride.endDate.split("T")[0]}
                        </p>
                        <p className="text-dark">
                          <strong>Ride Price:</strong> {ride.rideSharePrice}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </div>

      {/* Edit Car Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Car</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="carName">
              <Form.Label>Car Name</Form.Label>
              <Form.Control
                type="text"
                value={editedCar.carName}
                onChange={(e) =>
                  setEditedCar({ ...editedCar, carName: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="company">
              <Form.Label>Company</Form.Label>
              <Form.Select
                value={editedCar.company || ""}
                onChange={(e) =>
                  setEditedCar({ ...editedCar, company: e.target.value })
                }
              >
                <option value="">Select a company</option>
                <option value="Toyota">Toyota</option>
                <option value="Honda">Honda</option>
                <option value="Ford">Ford</option>
                <option value="BMW">BMW</option>
                <option value="RollsRoyce">Rolls Royce</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="pricePerDay">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="text"
                value={editedCar.pricePerDay}
                onChange={(e) =>
                  setEditedCar({ ...editedCar, pricePerDay: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button
            variant="outline-dark"
            onClick={() => handleEditCar(currentCar.carId)}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* cancel booking modal*/}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cancel Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to cancel this booking?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            Close
          </Button>
          <Button
            variant="danger"
            onClick={() => handleCancelBooking(currentBooking.bookingId)}
          >
            Cancel Booking
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Car Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Car</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this car?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Close
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDeleteCar(currentCar.carId)}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserProfile;
