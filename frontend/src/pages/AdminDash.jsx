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
} from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  FaCarSide,
  FaClipboardList,
  FaShareAlt,
  FaBan,
  FaCheckCircle,
} from "react-icons/fa";

const AdminDashboard = () => {
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [rideShares, setRideShares] = useState([]);
  const [cancelled, setCancelled] = useState([]);
  const [activeBookings, setActiveBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const carsRes = await axios.get(
          "http://localhost:3000/admin/all-listed-cars"
        );
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
                columns={["Booking ID", "Car ID", "User ID", "Cancelled On"]}
                renderRow={(c) => (
                  <>
                    <td>{c.bookingId}</td>
                    <td>{c.carId}</td>
                    <td>{c.userId}</td>
                    <td>{c.cancelDate}</td>
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
                  "User ID",
                  "Start Date",
                  "End Date",
                ]}
                renderRow={(a) => (
                  <>
                    <td>{a.bookingId}</td>
                    <td>{a.carId}</td>
                    <td>{a.userId}</td>
                    <td>{a.startDate}</td>
                    <td>{a.endDate}</td>
                  </>
                )}
              />
            </Tab>
          </Tabs>
        </Card>
      </Container>
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
