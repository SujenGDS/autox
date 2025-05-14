import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import { Card, Container, Row, Col, Table } from "react-bootstrap";

const ViewRideShare = () => {
  const { rideShareId } = useParams();
  const [rideShareDetails, setRideShareDetails] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (rideShareId) {
      const fetchRideShareDetails = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `http://localhost:3000/rideshare/${rideShareId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setRideShareDetails(response.data.rideShare);
        } catch (error) {
          console.error("Failed to fetch ride share details", error);
        }
      };

      fetchRideShareDetails();
    }
  }, [rideShareId]);

  return (
    <>
      <NavBar setRefresh={setRefresh} />
      <Container className="mt-4">
        <h2 className="text-center mb-4">Ride Share Details</h2>

        {rideShareDetails ? (
          <div>
            <Row className="mb-4">
              <Col md={6}>
                <Card className="shadow-sm">
                  <Card.Body>
                    <Card.Title className="text-center">Driver Info</Card.Title>
                    <Table striped bordered hover responsive>
                      <tbody>
                        <tr>
                          <td>
                            <strong>Name</strong>
                          </td>
                          <td>
                            {rideShareDetails.driver.firstName}{" "}
                            {rideShareDetails.driver.lastName}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Phone</strong>
                          </td>
                          <td>{rideShareDetails.driver.phone}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>License</strong>
                          </td>
                          <td>{rideShareDetails.driver.licenseNumber}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Email</strong>
                          </td>
                          <td>{rideShareDetails.driver.email}</td>
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
                      Passenger Info
                    </Card.Title>
                    <Table striped bordered hover responsive>
                      <tbody>
                        <tr>
                          <td>
                            <strong>Name</strong>
                          </td>
                          <td>
                            {rideShareDetails.passenger.firstName}{" "}
                            {rideShareDetails.passenger.lastName}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Phone</strong>
                          </td>
                          <td>{rideShareDetails.passenger.phone}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>License</strong>
                          </td>
                          <td>{rideShareDetails.passenger.licenseNumber}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Email</strong>
                          </td>
                          <td>{rideShareDetails.passenger.email}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={6}>
                <Card className="shadow-sm">
                  <Card.Body>
                    <Card.Title className="text-center">Ride Info</Card.Title>
                    <Table striped bordered hover responsive>
                      <tbody>
                        <tr>
                          <td>
                            <strong>Status</strong>
                          </td>
                          <td>
                            {rideShareDetails.isAccepted
                              ? "Accepted"
                              : "Pending"}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>From</strong>
                          </td>
                          <td>{rideShareDetails.liftDetails.pickUpLocation}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>To</strong>
                          </td>
                          <td>
                            {rideShareDetails.liftDetails.dropOffLocation}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Destination</strong>
                          </td>
                          <td>{rideShareDetails.liftDetails.destination}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Start Date</strong>
                          </td>
                          <td>
                            {
                              rideShareDetails.liftDetails.startDate?.split(
                                "T"
                              )[0]
                            }
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>End Date</strong>
                          </td>
                          <td>
                            {
                              rideShareDetails.liftDetails.endDate?.split(
                                "T"
                              )[0]
                            }
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Ride Share Price</strong>
                          </td>
                          <td>{rideShareDetails.rideSharePrice}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6}>
                <Card className="shadow-sm">
                  <Card.Body>
                    <Card.Title className="text-center">Car Details</Card.Title>
                    <Table striped bordered hover responsive>
                      <tbody>
                        <tr>
                          <td>
                            <strong>Model</strong>
                          </td>
                          <td>{rideShareDetails.car.carName}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Company</strong>
                          </td>
                          <td>{rideShareDetails.car.company}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Transmission</strong>
                          </td>
                          <td>{rideShareDetails.car.transmission}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Seats</strong>
                          </td>
                          <td>{rideShareDetails.car.seatCapacity}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Fuel Type</strong>
                          </td>
                          <td>{rideShareDetails.car.fuelType}</td>
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

export default ViewRideShare;
