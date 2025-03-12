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
  // const [rentedOutCars, setRentedOutCars] = useState([]);
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

        // const rentedOutRes = await axios.get(
        //   `http://localhost:3000/booking/my-rented-out-cars`,
        //   {
        //     headers: { Authorization: `Bearer ${token}` },
        //   }
        // );

        console.log(userBookings);
        setUser(res.data.user);
        setCars(userCars.data.cars);
        setBookings(userBookings.data.bookings);
        // setRentedOutCars(rentedOutRes.data.rentedCars);
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
        {user && <h2 className="text-xl">Welcome, {user.firstName}</h2>}

        <Row>
          <Col md={6}>
            <h3 className="mt-4">My Bookings</h3>
            <ul className="list-group list-group-flush">
              {bookings.length === 0 ? (
                <p>No bookings found.</p>
              ) : (
                bookings.map((booking, index) => (
                  <li key={index} className="list-group-item p-2">
                    <div className="d-flex align-items-center">
                      <div className="flex-grow-1">
                        <h5 className="mb-1">{booking.carName}</h5>
                        <p className="mb-1">
                          <strong>From:</strong> {booking.startDate}
                        </p>
                        <p className="mb-1">
                          <strong>To:</strong> {booking.endDate}
                        </p>
                        <p>
                          <strong>Total:</strong> {`${booking.totalAmount}`}
                        </p>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </Col>

          <Col md={6}>
            <h3 className="mt-4">My Cars</h3>
            <ul className="list-group list-group-flush">
              {cars.map((car, index) => (
                <li key={index} className="list-group-item p-2">
                  <div className="d-flex align-items-center">
                    <img
                      src="https://via.placeholder.com/50"
                      alt={car.carName}
                      className="img-thumbnail me-3"
                    />
                    <div className="flex-grow-1">
                      <h5 className="mb-1">{car.carName}</h5>
                      <p className="mb-1">
                        <strong>Fuel:</strong> {car.fuelType}
                      </p>
                      <p className="mb-1">
                        <strong>Transmission:</strong> {car.transmission}
                      </p>
                      <p>
                        <strong>Price:</strong> {`${car.pricePerDay}/day`}
                      </p>
                    </div>
                    <div>
                      <Button
                        variant="warning"
                        className="me-2"
                        onClick={function () {
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
                        variant="danger"
                        onClick={() => {
                          setCurrentCar(car);
                          setShowDeleteModal(true);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Col>

          <Col md={6}>
            <h3 className="mt-4">Your Profile</h3>
            {/* <p>
              Full name: {user.firstName} {user.lastName}
            </p>
            <p>Email: {user.email}</p>
            <p>Phone number: {user.phoneNumber}</p>
            <p>License number: {user.licenseNumber}</p> */}
          </Col>
        </Row>
      </div>

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
                <option value="">Select a company</option>{" "}
                <option value="Toyota">Toyota</option>
                <option value="Honda">Honda</option>
                <option value="Ford">Ford</option>
                <option value="BMW">BMW</option>
                <option value="RollsRoyce">Rolls Royce</option>
              </Form.Select>
            </Form.Group>

            <Form.Group name="pricePerDay">
              <Form.Label>price</Form.Label>
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
            save changes
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
