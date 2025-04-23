import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Tabs,
  Tab,
  Card,
  Table,
  Button,
  Navbar,
  Container,
  Nav,
  Modal,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  FaCarSide,
  FaClipboardList,
  FaShareAlt,
  FaBan,
  FaCheckCircle,
  FaUsers, // Add FaUsers icon for User tab
} from "react-icons/fa";

const AdminDashboard = () => {
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [rideShares, setRideShares] = useState([]);
  const [cancelled, setCancelled] = useState([]);
  const [activeBookings, setActiveBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const carsRes = await axios.get(
          "http://localhost:3000/admin/all-listed-cars"
        );
        console.log(carsRes.data.cars); // Add this line to log the cars data
        setCars(carsRes.data.cars);

        const bookingsRes = await axios.get(
          "http://localhost:3000/admin/all-bookings"
        );
        setBookings(bookingsRes.data.bookings);

        const ridesRes = await axios.get(
          "http://localhost:3000/admin/all-rideshares"
        );
        setRideShares(ridesRes.data.rideshares);

        const cancelledRes = await axios.get(
          "http://localhost:3000/admin/cancelled-bookings"
        );
        setCancelled(cancelledRes.data.cancelled);

        const activeRes = await axios.get(
          "http://localhost:3000/admin/active-bookings"
        );
        setActiveBookings(activeRes.data.activeBookings);

        const usersRes = await axios.get(
          // Fetch users data
          "http://localhost:3000/admin/all-users"
        );
        setUsers(usersRes.data.users);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch admin data");
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    navigate("/");
  };

  const handleAccept = async (carId) => {
    try {
      await axios.post(`http://localhost:3000/admin/accept-car/${carId}`);
      toast.success("Car approved successfully");
      setCars((prevCars) =>
        prevCars.map((car) =>
          car.carId === carId ? { ...car, approvalStatus: "accepted" } : car
        )
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve car");
    }
  };

  const handleReject = async (carId) => {
    try {
      await axios.post(`http://localhost:3000/admin/reject-car/${carId}`);
      toast.info("Car rejected");
      setCars((prevCars) =>
        prevCars.map((car) =>
          car.carId === carId ? { ...car, approvalStatus: "rejected" } : car
        )
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject car");
    }
  };

  const handleDeleteClick = (carId) => {
    setSelectedCarId(carId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/admin/delete/${selectedCarId}`);
      toast.success("Car deleted successfully");
      setCars((prevCars) =>
        prevCars.filter((car) => car.carId !== selectedCarId)
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete car");
    } finally {
      setShowDeleteModal(false);
      setSelectedCarId(null);
    }
  };

  return (
    <>
      {/* Top Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand>Admin Dashboard</Navbar.Brand>
          <Nav className="ms-auto">
            <Button variant="outline-light" onClick={handleLogout}>
              Logout
            </Button>
          </Nav>
        </Container>
      </Navbar>

      <Container>
        <Card className="shadow p-4">
          <Tabs defaultActiveKey="cars" className="mb-3" fill>
            {/* Users Section */}
            <Tab
              eventKey="users"
              title={
                <>
                  <FaUsers /> Users
                </>
              }
            >
              <Section
                title="All Users"
                data={users}
                columns={[
                  "User ID",
                  "First Name",
                  "Last Name",
                  "Email",
                  "Phone Number",
                  "License Number",
                  "License Front",
                  "License Back",
                  "Citizenship front",
                  "Citizenship back",
                ]}
                renderRow={(user) => (
                  <>
                    <td>{user.userId}</td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{user.phoneNumber}</td>
                    <td>{user.licenseNumber}</td>
                    <td>
                      <a
                        href={user.licenseFrontUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </a>
                    </td>
                    <td>
                      <a
                        href={user.licenseBackUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </a>
                    </td>
                    <td>
                      <a
                        href={user.citizenshipFrontUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </a>
                    </td>
                    <td>
                      <a
                        href={user.citizenshipBackUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </a>
                    </td>
                  </>
                )}
              />
            </Tab>

            {/* All Listed Cars */}
            <Tab
              eventKey="cars"
              title={
                <>
                  <FaCarSide /> Cars
                </>
              }
            >
              <Section
                title="All Listed Cars"
                data={cars}
                columns={[
                  "Car ID",
                  "Car Name",
                  "Company",
                  "Car Plate Number",
                  "Owner Name",
                  "Email",
                  "Phone",
                  "Blue Book",
                  "Approval",
                  "Status",
                  "Delete",
                ]}
                renderRow={(car) => (
                  <>
                    <td>{car.carId}</td>
                    <td>{car.carName}</td>
                    <td>{car.company}</td>
                    <td>{car.carPlateNumber}</td>
                    <td>
                      {car.firstName} {car.lastName}
                    </td>
                    <td>{car.email}</td>
                    <td>{car.phoneNumber}</td>
                    <td>
                      <a
                        href={car.blueBookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Bluebook
                      </a>
                    </td>

                    {/* Approval column */}
                    <td>
                      {car.approvalStatus === "pending" ? (
                        <>
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleAccept(car.carId)}
                            className="me-2"
                          >
                            Accept
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleReject(car.carId)}
                          >
                            Reject
                          </Button>
                        </>
                      ) : (
                        <span
                          className={`text-${
                            car.approvalStatus === "accepted"
                              ? "success"
                              : "danger"
                          }`}
                        >
                          {car.approvalStatus}
                        </span>
                      )}
                    </td>

                    {/* Status column */}
                    <td
                      className={car.isBooked ? "text-danger" : "text-success"}
                    >
                      {car.isBooked ? "Booked" : "Available"}
                    </td>

                    {/* Delete column */}
                    <td>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteClick(car.carId)}
                      >
                        Delete
                      </Button>
                    </td>
                  </>
                )}
              />
            </Tab>

            {/* All Bookings */}
            <Tab
              eventKey="bookings"
              title={
                <>
                  <FaClipboardList /> Bookings
                </>
              }
            >
              <Section
                title="All Bookings"
                data={bookings}
                columns={[
                  "Booking ID",
                  "Car ID",
                  "Car Name",
                  "Plate Number",
                  "Renter ID",
                  "Owner ID",
                  "Owner Name",
                  "Renter Name",
                  "Start Date",
                  "End Date",
                  "RideShare",
                  "Total Amount",
                ]}
                renderRow={(b) => (
                  <>
                    <td>{b.bookingId}</td>
                    <td>{b.carId}</td>
                    <td>{b.carName}</td>
                    <td>{b.carPlateNumber}</td>
                    <td>{b.userId}</td>
                    <td>{b.ownerId}</td>
                    <td>
                      {b.ownerFirstName} {b.ownerLastName}
                    </td>
                    <td>
                      {b.renterFirstName} {b.renterLastName}
                    </td>
                    <td>{new Date(b.startDate).toLocaleDateString()}</td>
                    <td>{new Date(b.endDate).toLocaleDateString()}</td>
                    <td>{b.isRideShareEnabled ? "Yes" : "No"}</td>
                    <td>{b.totalAmount}</td>
                  </>
                )}
              />
            </Tab>
            {/* All Ride Shares */}
            <Tab
              eventKey="rideshares"
              title={
                <>
                  <FaShareAlt /> Ride Shares
                </>
              }
            >
              <Section
                title="All Ride Shares"
                data={rideShares}
                columns={[
                  "RideShare ID",
                  "Booking ID",
                  "Car ID",
                  "Passenger ID",
                  "Passenger Name",
                  "Destination",
                  "Start Date",
                  "End Date",
                  "Accepted",
                ]}
                renderRow={(r) => (
                  <>
                    <td>{r.rideshareId}</td>
                    <td>{r.bookingId}</td>
                    <td>{r.carId}</td>
                    <td>{r.passengerId}</td>
                    <td>
                      {r.passengerFirstName} {r.passengerLastName}
                    </td>
                    <td>{r.rideShareDestination}</td>
                    <td>{new Date(r.startDate).toLocaleDateString()}</td>
                    <td>{new Date(r.endDate).toLocaleDateString()}</td>
                    <td>{r.isAccepted ? "Accepted" : "Pending"}</td>
                  </>
                )}
              />
            </Tab>
            {/* Cancelled Bookings */}
            <Tab
              eventKey="cancelled"
              title={
                <>
                  <FaBan /> Cancelled
                </>
              }
            >
              <Section
                title="Cancelled Bookings"
                data={cancelled}
                columns={[
                  "Booking ID",
                  "Car Name",
                  "Car Company",
                  "Renter Name",
                  "Renter Email",
                  "Renter Phone Number",
                  "Cancelled On",
                ]}
                renderRow={(c) => (
                  <>
                    <td>{c.bookingId}</td>
                    <td>{c.carName}</td>
                    <td>{c.company}</td>
                    <td>{`${c.userFirstName} ${c.userLastName}`}</td>
                    <td>{c.userEmail}</td>
                    <td>{c.userPhoneNumber}</td>
                    <td>{new Date(c.cancelledAt).toLocaleDateString()}</td>
                  </>
                )}
              />
            </Tab>

            {/* Active Bookings */}
            <Tab
              eventKey="active"
              title={
                <>
                  <FaCheckCircle /> Active
                </>
              }
            >
              <Section
                title="Active Bookings"
                data={activeBookings}
                columns={[
                  "Booking ID",
                  "Car ID",
                  "Renter Name",
                  "Renter Email",
                  "Phone Number",
                  "Start Date",
                  "End Date",
                ]}
                renderRow={(a) => {
                  const today = new Date();
                  const endDate = new Date(a.endDate);
                  const isOverdue = today > endDate;

                  return (
                    <>
                      <td>{a.bookingId}</td>
                      <td>{a.carId}</td>
                      <td>{`${a.renterFirstName} ${a.renterLastName}`}</td>
                      <td>{a.renterEmail}</td>
                      <td>{a.renterPhoneNumber}</td>
                      <td>{new Date(a.startDate).toLocaleDateString()}</td>
                      <td>
                        {new Date(a.endDate).toLocaleDateString()}{" "}
                        {isOverdue && (
                          <span style={{ color: "red", fontWeight: "bold" }}>
                            {" "}
                            (Overdue)
                          </span>
                        )}
                      </td>
                    </>
                  );
                }}
              />
            </Tab>
          </Tabs>
        </Card>
      </Container>

      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Car Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this car?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const Section = ({ title, data, columns, renderRow }) => (
  <Card className="mb-4 border-0">
    <Card.Header className="bg-primary text-white">{title}</Card.Header>
    <Card.Body>
      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            {columns.map((col, i) => (
              <th key={i}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={i}>{renderRow(item)}</tr>
          ))}
        </tbody>
      </Table>
    </Card.Body>
  </Card>
);

export default AdminDashboard;
