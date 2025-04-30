import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import { Card, Container, Row, Col, Table } from "react-bootstrap";

const BookedCarDetailsPage = () => {
  const { bookingId } = useParams();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (bookingId) {
      const fetchBookingDetails = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `http://localhost:3000/booking/${bookingId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          setBookingDetails(response.data.booking);
        } catch (error) {
          console.error("Failed to fetch booking details", error);
        }
      };

      fetchBookingDetails();
    }
  }, [bookingId]);

  return (
    <>
      <NavBar setRefresh={setRefresh} />
      <Container className="mt-4">
        <h2 className="text-center mb-4">My Booking Details</h2>

        {bookingDetails ? (
          <div>
            <Row className="mb-4">
              <Col md={6}>
                <Card className="shadow-sm">
                  <Card.Body>
                    <Card.Title className="text-center">
                      Car Information
                    </Card.Title>
                    <Table striped bordered hover responsive>
                      <tbody>
                        <tr>
                          <td>
                            <strong>Car Name</strong>
                          </td>
                          <td>{bookingDetails.car.carName}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Company</strong>
                          </td>
                          <td>{bookingDetails.car.company}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Fuel Type</strong>
                          </td>
                          <td>{bookingDetails.car.fuelType}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Transmission</strong>
                          </td>
                          <td>{bookingDetails.car.transmission}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Price per Day</strong>
                          </td>
                          <td>{bookingDetails.car.pricePerDay}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6}>
                <Card className="shadow-sm">
                  <Card.Body>
                    <Card.Title className="text-center">
                      Booking Information
                    </Card.Title>
                    <Table striped bordered hover responsive>
                      <tbody>
                        <tr>
                          <td>
                            <strong>From</strong>
                          </td>
                          <td>{bookingDetails.startDate.split("T")[0]}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>To</strong>
                          </td>
                          <td>{bookingDetails.endDate.split("T")[0]}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Total Amount</strong>
                          </td>
                          <td>{bookingDetails.totalAmount}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Pickup Location</strong>
                          </td>
                          <td>{bookingDetails.pickUpLocation}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Drop-off Location</strong>
                          </td>
                          <td>{bookingDetails.dropOffLocation}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Ride Share Price</strong>
                          </td>
                          <td>{bookingDetails.rideSharePrice}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Ride Share Enabled</strong>
                          </td>
                          <td>
                            {bookingDetails.isRideShareEnabled ? "Yes" : "No"}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col>
                <Card className="shadow-sm">
                  <Card.Body>
                    <Card.Title className="text-center">
                      Car Owner Information
                    </Card.Title>
                    <Table striped bordered hover responsive>
                      <tbody>
                        <tr>
                          <td>
                            <strong>Name</strong>
                          </td>
                          <td>
                            {bookingDetails.user.firstName}{" "}
                            {bookingDetails.user.lastName}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Email</strong>
                          </td>
                          <td>{bookingDetails.user.email}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Phone</strong>
                          </td>
                          <td>{bookingDetails.user.phone}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        ) : (
          <p className="text-center">Loading...</p>
        )}
      </Container>
    </>
  );
};

export default BookedCarDetailsPage;
