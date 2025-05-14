import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Card, Button, Spinner, Alert } from "react-bootstrap";
import NavBar from "../components/NavBar";
import { Carousel, Row, Col } from "react-bootstrap";
import CarCard from "../components/CarCard";
import BookNowModal from "../components/BookNowModal";

const CarDetail = () => {
  const { carId } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [price, setPrice] = useState(0);
  const [title, setTitle] = useState("Car");
  const [recommendedCars, setRecommendedCars] = useState([]);

  const carFeatures = {
    air_conditioning: {
      id: 1,
      feature: "Air Conditioning",
      ariaLabel: "Checkbox for Air Conditioning",
      name: "air_conditioning",
    },
    gps_navigation: {
      id: 2,
      feature: "GPS Navigation",
      ariaLabel: "Checkbox for GPS Navigation",
      name: "gps_navigation",
    },
    bluetooth_audio: {
      id: 3,
      feature: "Bluetooth Audio",
      ariaLabel: "Checkbox for Bluetooth Audio",
      name: "bluetooth_audio",
    },
    heated_seats: {
      id: 4,
      feature: "Heated Seats",
      ariaLabel: "Checkbox for Heated Seats",
      name: "heated_seats",
    },
    sunroof: {
      id: 5,
      feature: "Sunroof",
      ariaLabel: "Checkbox for Sunroof",
      name: "sunroof",
    },
    all_wheel_drive: {
      id: 6,
      feature: "All Wheel Drive",
      ariaLabel: "Checkbox for All Wheel Drive",
      name: "all_wheel_drive",
    },
  };

  useEffect(() => {
    const fetchCarDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/car/${carId}`);
        let car_res = response.data.car;
        car_res.imagesArray = JSON.parse(car_res.images);
        car_res.featuresArray = JSON.parse(car_res.featuresArray);
        setCar(car_res);
        
        // Fetch all cars for recommendations
        const allCarsResponse = await axios.get("http://localhost:3000/car/get-cars");
        const allCars = allCarsResponse.data.cars;
        
        // Filter cars based on type and company, excluding current car
        const recommended = allCars
          .filter(c => 
            (c.type === car_res.type || c.company === car_res.company) && 
            c.carId !== car_res.carId
          )
          .slice(0, 6); // Get top 6 recommendations
        
        setRecommendedCars(recommended);
      } catch (error) {
        setError("Failed to load car details");
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetail();
  }, [carId]);

  const openBookNowModal = () => {
    setShowModal(true);
  };

  if (loading)
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );

  if (error)
    return (
      <Container className="text-center mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  return (
    <>
      <BookNowModal
        title={title}
        price={price}
        showModal={showModal}
        setShowModal={setShowModal}
      />
      <NavBar />
      <Row className="d-flex align-items-center m-4">
        <Col md={6}>
          <Carousel>
            {car?.imagesArray?.map((image, index) => (
              <Carousel.Item key={index}>
                <img
                  className="d-block w-100"
                  src={image}
                  alt={`Slide ${index + 1}`}
                  style={{ height: "400px", objectFit: "cover" }}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>

        <Col md={6} className="mt-1 ps-5 ">
          <Row>
            {/* Car Details Section */}
            <Col md={5}>
              <h2>{car?.carName}</h2>
              <p>
                <strong>Company:</strong> {car?.company}
              </p>
              <p>
                <strong>Make Year:</strong> {car?.makeYear}
              </p>

              <p>
                <strong>Type:</strong> {car?.type}
              </p>
              <p>
                <strong>Kilometers:</strong> {car?.currentKm}
              </p>
              <p>
                <strong>Seat Capacity:</strong> {car?.seatCapacity}
              </p>
              <p>
                <strong>Fuel Type:</strong> {car?.fuelType}
              </p>
              <p>
                <strong>Transmission:</strong> {car?.transmission}
              </p>
              <p>
                <strong>Price Per Day:</strong> {car?.pricePerDay}
              </p>
            </Col>

            {/* Divider */}
            <Col
              md={1}
              className="d-flex justify-content-center align-items-center"
            >
              <div
                style={{ borderLeft: "2px solid black", height: "100%" }}
              ></div>
            </Col>

            {/* Features Section */}
            <Col md={5}>
              <h4>Features:</h4>
              {car?.featuresArray &&
              Array.isArray(car.featuresArray) &&
              car.featuresArray.length > 0 ? (
                <ul>
                  {car.featuresArray.map((feature, index) => (
                    <li key={index}>{carFeatures[feature]["feature"]}</li>
                  ))}
                </ul>
              ) : (
                <p>No features available</p>
              )}
            </Col>
          </Row>

          <div className="text-end mt-4">
            {car?.isBooked ? (
              <span className="text-danger fw-bold">Booked</span>
            ) : (
              <Button variant="outline-dark" onClick={openBookNowModal}>
                Book Now
              </Button>
            )}
          </div>
        </Col>
      </Row>

      <div
        style={{
          fontSize: "50px",
          paddingLeft: "50px",
          marginTop: "10px",
          marginBottom: "10px",
        }}
      >
        Similar Cars You May Like
      </div>

      <div
        className="px-5 d-flex gap-4 overflow-x-scroll"
        style={{ scrollbarWidth: "none" }}
      >
        {recommendedCars.map((car, index) => {
          let firstImage = "";
          try {
            const imagesArray = JSON.parse(car.images.replace(/&quot;/g, '"'));
            if (Array.isArray(imagesArray) && imagesArray.length > 0) {
              firstImage = imagesArray[0];
            }
          } catch (error) {
            console.error("Error parsing car images:", error);
            firstImage = "path/to/default-image.jpg";
          }
          return (
            <div key={index} style={{ width: "290px", flexShrink: 0 }}>
              <CarCard
                title={car.carName}
                fuel={car.fuelType}
                transmission={car.transmission}
                carId={car.carId}
                price={`${car.pricePerDay}/day`}
                imgLink={firstImage}
                isBooked={car.isBooked}
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default CarDetail;
