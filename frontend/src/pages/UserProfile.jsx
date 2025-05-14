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

        console.log("Ride Shares Data:", rideShares.data.rideDetails);

        // Sort bookings by startDate in descending order
        const sortedBookings = userBookings.data.bookings.sort((a, b) => 
          new Date(b.startDate) - new Date(a.startDate)
        );

        setMyRideShares(rideShares.data.rideDetails);
        setBookedCars(bookedCarsByOthers.data.cars);
        setUser(res.data.user);
        setCars(userCars.data.cars);
        setBookings(sortedBookings);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };
    fetchData();
  }, [refresh]);

  useEffect(() => {
    const updateBookingStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        await axios.put("http://localhost:3000/booking/update-booking-status", {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.error("Failed to update booking status", err);
      }
    };
    updateBookingStatus();
  }, []);

  const getFirstImage = (imagesString) => {
    try {
      const imagesArray = JSON.parse(
        imagesString?.replace(/&quot;/g, '"') || "[]"
      );
      return imagesArray[0] || "https://via.placeholder.com/150"; // Default placeholder if no image
    } catch (error) {
      console.error("Error parsing images:", error);
      return "https://via.placeholder.com/150"; // Default placeholder on error
    }
  };

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
      } else {
        alert(response.data.message); // Show the error message like "Car cannot be returned until the booking end date has passed"
      }
    } catch (error) {
      console.error("Error returning car:", error);
      alert("Error returning car");
    }
  };

  const handleViewRideShareDetail = (rideShareId) => {
    if (!rideShareId) {
      console.error("No ride share ID provided");
      return;
    }
    navigate(`/rideshare/${rideShareId}`);
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
              <React.Fragment key={index}>
                <div
                  className="card mb-4 p-4 border-0 shadow-sm rounded"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleViewBookingDetail(booking.bookingId)}
                >
                  <div className="d-flex">
                    <img
                      src={getFirstImage(booking.images)}
                      alt="Car"
                      className="img-thumbnail rounded"
                      style={{
                        width: "200px",
                        height: "fit-content",
                        objectFit: "contain",
                      }}
                    />
                    <div className="ms-4">
                      <h5>{booking.carName}</h5>
                      <p>Start Date: {new Date(booking.startDate).toLocaleDateString()}</p>
                      <p>End Date: {new Date(booking.endDate).toLocaleDateString()}</p>
                      <p>Status: {booking.bookingStatus}</p>
                      {booking.bookingStatus === 'upcoming' ? (
                        <Button
                          variant="danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentBooking(booking);
                            setShowCancelModal(true);
                          }}
                        >
                          Cancel Booking
                        </Button>
                      ) : (
                        <p className="text-muted">
                          {booking.bookingStatus === 'ongoing' ? 'Booking is ongoing' : 'Booking completed'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </React.Fragment>
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
                    src={getFirstImage(car.images)}
                    alt={car.carName}
                    className="img-thumbnail rounded me-4"
                    style={{
                      width: "200px",
                      height: "fit-content",
                      objectFit: "contain",
                    }}
                  />
                  <div className="ms-4 flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5>
                        {car.carName}{" "}
                        {car.approvalStatus === "accepted" && (
                          <span
                            className={`badge ${
                              car.isBooked ? "bg-success" : "bg-warning"
                            } text-dark ms-2`}
                          >
                            {car.isBooked ? "Booked" : "Available"}
                          </span>
                        )}
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
                    <p className="text-dark">
                      <strong>Status:</strong> {car.approvalStatus}
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
                    src={getFirstImage(car.images)}
                    alt="Car"
                    className="img-thumbnail rounded"
                    style={{
                      width: "200px",
                      height: "fit-content",
                      objectFit: "contain",
                    }}
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
        <div className="mb-4">
          <h4 className="text-secondary mb-4">My Ride Shares</h4>
          {myRideShares.length === 0 ? (
            <p>You haven't shared any rides yet.</p>
          ) : (
            myRideShares
              .filter((ride) => ride.status !== "Rejected")
              .map((ride, index) => {
                const isDriver = ride.driverId === user.userId;
                return (
                  <div
                    key={index}
                    className="card mb-4 p-4 border-0 shadow-sm rounded"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleViewRideShareDetail(ride.rideshareId)}
                  >
                    <div className="d-flex">
                      <img
                        src={getFirstImage(ride.images)}
                        alt="Shared Ride Car"
                        className="img-thumbnail rounded"
                        style={{
                          width: "200px",
                          height: "fit-content",
                          objectFit: "contain",
                        }}
                      />
                      <div className="ms-4 flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start">
                          <h5>{ride.carName}</h5>
                          <span className={`badge ${isDriver ? 'bg-primary' : 'bg-success'} text-white`}>
                            {isDriver ? 'Driver' : 'Passenger'}
                          </span>
                        </div>
                        
                        <p className="text-muted">
                          <strong>Destination:</strong> {ride.rideShareDestination}
                        </p>
                        <p className="text-muted">
                          <strong>From:</strong> {new Date(ride.startDate).toLocaleDateString()}
                        </p>
                        <p className="text-muted">
                          <strong>To:</strong> {new Date(ride.endDate).toLocaleDateString()}
                        </p>
                        <p className="text-dark">
                          <strong>Ride Price:</strong> {ride.rideSharePrice}
                        </p>

                        {isDriver ? (
                          <>
                            <p className="text-muted">
                              <strong>Passenger:</strong> {ride.passengerFirstName} {ride.passengerLastName}
                            </p>
                            <p className="text-muted">
                              <strong>Passenger Phone:</strong> {ride.passengerPhoneNumber}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-muted">
                              <strong>Driver:</strong> {ride.driverFirstName} {ride.driverLastName}
                            </p>
                            <p className="text-muted">
                              <strong>Driver Phone:</strong> {ride.driverPhoneNumber}
                            </p>
                          </>
                        )}

                        <p className="text-muted">
                          <strong>Status:</strong>{" "}
                          <span className={`badge ${
                            new Date(ride.endDate) < new Date() ? 'bg-secondary' :
                            new Date(ride.startDate) <= new Date() ? 'bg-success' :
                            ride.status === 'Accepted' ? 'bg-primary' :
                            ride.status === 'Pending' ? 'bg-warning' :
                            'bg-secondary'
                          } text-white`}>
                            {new Date(ride.endDate) < new Date() ? 'Completed' :
                             new Date(ride.startDate) <= new Date() ? 'Ongoing' :
                             ride.status === 'Accepted' ? 'Upcoming' :
                             ride.status}
                          </span>
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
                <option value="Rolls Royce">Rolls Royce</option>
                <option value="Hyundai">Hyundai</option>
                <option value="Kia">Kia</option>
                <option value="Chevrolet">Chevrolet</option>
                <option value="Nissan">Nissan</option>
                <option value="Volkswagen">Volkswagen</option>
                <option value="Audi">Audi</option>
                <option value="Mercedes-Benz">Mercedes-Benz</option>
                <option value="Lexus">Lexus</option>
                <option value="Mazda">Mazda</option>
                <option value="Subaru">Subaru</option>
                <option value="Jeep">Jeep</option>
                <option value="Porsche">Porsche</option>
                <option value="Jaguar">Jaguar</option>
                <option value="Land Rover">Land Rover</option>
                <option value="Tata">Tata</option>
                <option value="Mahindra">Mahindra</option>
                <option value="Skoda">Skoda</option>
                <option value="Renault">Renault</option>
                <option value="Peugeot">Peugeot</option>
                <option value="Mini">Mini</option>
                <option value="Volvo">Volvo</option>
                <option value="Ferrari">Ferrari</option>
                <option value="Lamborghini">Lamborghini</option>
                <option value="Bugatti">Bugatti</option>
                <option value="Mitsubishi">Mitsubishi</option>
                <option value="Buick">Buick</option>
                <option value="Dodge">Dodge</option>
                <option value="Chrysler">Chrysler</option>
                <option value="GMC">GMC</option>
                <option value="Lincoln">Lincoln</option>
                <option value="Genesis">Genesis</option>
                <option value="Infiniti">Infiniti</option>
                <option value="Acura">Acura</option>
                <option value="Alfa Romeo">Alfa Romeo</option>
                <option value="Bentley">Bentley</option>
                <option value="Maserati">Maserati</option>
                <option value="Suzuki">Suzuki</option>
                <option value="Isuzu">Isuzu</option>
                <option value="Hummer">Hummer</option>
                <option value="SEAT">SEAT</option>
                <option value="Daihatsu">Daihatsu</option>
                <option value="Proton">Proton</option>
                <option value="Saab">Saab</option>
                <option value="Smart">Smart</option>
                <option value="Tesla">Tesla</option>
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
        <Modal.Body>
          Are you sure you want to cancel this booking?
          <br />
          <small className="text-muted">
            Your refund will be processed within 48 hours after cancellation.
          </small>
        </Modal.Body>

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
