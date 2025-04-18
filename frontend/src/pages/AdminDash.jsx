import React, { useEffect, useState } from "react";
import axios from "axios";
import { Tabs, Tab, Card, Table, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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
    <div className="container mt-4">
      <h2 className="mb-4">Admin Dashboard</h2>

      <Button variant="danger" onClick={handleLogout} className="mb-3">
        Logout
      </Button>

      <Tabs defaultActiveKey="cars" className="mb-3" fill>
        {/* All Listed Cars */}
        <Tab eventKey="cars" title="All Listed Cars">
          <Card className="mb-3">
            <Card.Header>All Listed Cars</Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Car ID</th>
                    <th>Car Name</th>
                    <th>Company</th>
                    <th>Car Plate Number</th>
                    <th>Owner Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {cars.map((car, index) => (
                    <tr key={index}>
                      <td>{car.carId}</td>
                      <td>{car.carName}</td>
                      <td>{car.company}</td>
                      <td>{car.carPlateNumber}</td>
                      <td>
                        {car.firstName} {car.lastName}
                      </td>
                      <td>{car.email}</td>
                      <td>{car.phoneNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        {/* All Bookings */}
        <Tab eventKey="bookings" title="All Bookings">
          <Card className="mb-3">
            <Card.Header>All Bookings</Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Car ID</th>
                    <th>Car Name</th>
                    <th>Plate Number</th>
                    <th>Renter ID</th>
                    <th>Owner ID</th>
                    <th>Owner Name</th>
                    <th>Renter Name</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>RideShare Enable</th>
                    <th>Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b, index) => (
                    <tr key={index}>
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
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        {/* All Ride Shares */}
        <Tab eventKey="rideshares" title="All Ride Shares">
          <Card className="mb-3">
            <Card.Header>All Ride Shares</Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>RideShare ID</th>
                    <th>Booking ID</th>
                    <th>Car ID</th>
                    <th>Passenger ID</th>
                    <th>Passenger Name</th>
                    <th>Ride Share Destination</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Is Accepted</th>
                  </tr>
                </thead>
                <tbody>
                  {rideShares.map((r, index) => (
                    <tr key={index}>
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
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        {/* Cancelled Bookings */}
        <Tab eventKey="cancelled" title="Cancelled Bookings">
          <Card className="mb-3">
            <Card.Header>Cancelled Bookings</Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Car ID</th>
                    <th>User ID</th>
                    <th>Cancelled On</th>
                  </tr>
                </thead>
                <tbody>
                  {cancelled.map((c, index) => (
                    <tr key={index}>
                      <td>{c.bookingId}</td>
                      <td>{c.carId}</td>
                      <td>{c.userId}</td>
                      <td>{c.cancelDate}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        {/* Active Bookings */}
        <Tab eventKey="active" title="Active Bookings">
          <Card className="mb-3">
            <Card.Header>Active Bookings</Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Car ID</th>
                    <th>User ID</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                  </tr>
                </thead>
                <tbody>
                  {activeBookings.map((a, index) => (
                    <tr key={index}>
                      <td>{a.bookingId}</td>
                      <td>{a.carId}</td>
                      <td>{a.userId}</td>
                      <td>{a.startDate}</td>
                      <td>{a.endDate}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
