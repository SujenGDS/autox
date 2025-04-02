import React, { useState, useEffect } from "react";
import axios from "axios";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import NavBar from "../components/NavBar";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
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
      if (!token) {
        console.error("No authentication token found");
        return;
      }

      if (!id) {
        console.error("No car ID provided for editing");
        return;
      }

      if (!editedCar || Object.keys(editedCar).length === 0) {
        console.error("No car details provided for update");
        return;
      }

      await axios.put(`http://localhost:3000/car/edit-car/${id}`, editedCar, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Car updated successfully!");
      setShowEditModal(false);
      setRefresh((prev) => !prev);
    } catch (err) {
      console.error("Failed to edit car:", err.response?.data || err.message);
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

  return (
    <>
      <NavBar setRefresh={setRefresh} />
      <div className="p-4">
        {user && (
          <h2 className="text-xl text-center mb-4">
            Welcome, {user.firstName}
          </h2>
        )}

        <Row>
          {/* My Bookings Section */}
          <Col md={6}>
            <section>
              <h3 className="mt-4">My Bookings</h3>
              <div className="card shadow-lg border-0 rounded-lg mb-4">
                <div className="card-body">
                  {bookings.length === 0 ? (
                    <p className="text-muted">No bookings found.</p>
                  ) : (
                    bookings.map((booking, index) => (
                      <div
                        key={index}
                        className="card mb-3 border-0 rounded-lg shadow-sm"
                        style={{ transition: "all 0.3s ease" }}
                      >
                        <div className="d-flex p-3">
                          {/* Car Image */}
                          <img
                            src="https://imgcdn.zigwheels.ph/medium/gallery/exterior/115/1640/rolls-royce-phantom-full-front-view-950210.jpg"
                            alt="Car"
                            className="img-thumbnail rounded"
                            style={{ width: "250px", height: "auto" }}
                          />
                          <div className="ms-3 flex-grow-1">
                            <h5 className="card-title text-dark">
                              {booking.carName}
                            </h5>
                            <p className="card-text text-muted">
                              <strong>From:</strong> {booking.startDate}
                            </p>
                            <p className="card-text text-muted">
                              <strong>To:</strong> {booking.endDate}
                            </p>
                            <p className="card-text text-dark">
                              <strong>Total:</strong> {`${booking.totalAmount}`}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>
          </Col>

          {/* My Cars Section */}
          <Col md={6}>
            <section>
              <h3 className="mt-4 ">My Cars</h3>
              <div className="card shadow-lg border-0 rounded-lg mb-4">
                <div className="card-body">
                  {cars.map((car, index) => (
                    <div
                      key={index}
                      className="card mb-3 border-0 rounded-lg shadow-sm"
                      style={{ transition: "all 0.3s ease" }}
                    >
                      <div className="d-flex p-3">
                        {/* Car Image */}
                        <img
                          src="https://i.insider.com/51364fb06bb3f74508000027?width=800&format=jpeg&auto=webp"
                          alt={car.carName}
                          className="img-thumbnail rounded me-3"
                          style={{ width: "250px", height: "auto" }}
                        />
                        <div className="ms-3 flex-grow-1">
                          <div className="d-flex align-items-center justify-content-between">
                            <h5 className="card-title text-dark">
                              {car.carName}
                            </h5>
                            {/* Badge for booking status */}
                            <span
                              className={`badge ${
                                car.isBooked ? "bg-success" : "bg-warning"
                              } text-dark`}
                            >
                              {car.isBooked ? "Booked" : "Available"}
                            </span>
                          </div>
                          <p className="card-text text-muted">
                            <strong>Fuel:</strong> {car.fuelType}
                          </p>
                          <p className="card-text text-muted">
                            <strong>Transmission:</strong> {car.transmission}
                          </p>
                          <p className="card-text text-dark">
                            <strong>Price:</strong> {`${car.pricePerDay}/day`}
                          </p>
                        </div>
                        <div className="d-flex align-items-center">
                          <Button
                            variant="outline-warning"
                            className="me-2 text-dark shadow-sm"
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
                              setCurrentCar(car);
                              setShowDeleteModal(true);
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </Col>

          {/* Profile Section */}
          <Col md={6}>
            <section>
              <h3 className="mt-4">Your Profile</h3>
              {/* Profile details can be added here */}
            </section>
          </Col>
        </Row>
      </div>

      {/* Edit Car Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Car</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group name="carName">
              <Form.Label>Car Name</Form.Label>
              <Form.Control
                type="text"
                value={editedCar.carName}
                onChange={(e) =>
                  setEditedCar({ ...editedCar, carName: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group name="company">
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

            <Form.Group name="pricePerDay">
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
