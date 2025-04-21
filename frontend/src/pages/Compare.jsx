import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Card,
  Button,
  Form,
  Row,
  Col,
  Container,
  Image,
} from "react-bootstrap";
import NavBar from "../components/NavBar";

const CompareCars = () => {
  const [carId1, setCarId1] = useState("");
  const [carId2, setCarId2] = useState("");
  const [availableCars, setAvailableCars] = useState([]);
  const [car1, setCar1] = useState(null);
  const [car2, setCar2] = useState(null);

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
    axios
      .get("http://localhost:3000/car/get-cars/all")
      .then((res) => {
        setAvailableCars(res.data.cars);
      })
      .catch((err) => {
        toast.error("Failed to load cars");
        console.error("loadCarError", err);
      });
  }, []);

  const handleCompare = () => {
    if (!carId1 || !carId2 || carId1 === carId2) {
      toast.error("Please select two different cars");
      return;
    }

    const selectedCar1 = availableCars.find(
      (car) => car.carId === parseInt(carId1)
    );
    const selectedCar2 = availableCars.find(
      (car) => car.carId === parseInt(carId2)
    );

    setCar1(selectedCar1);
    setCar2(selectedCar2);
  };

  const getColor = (value1, value2, isHigherBetter = true) => {
    if (value1 === value2) return "text-secondary";
    if (
      (isHigherBetter && value1 > value2) ||
      (!isHigherBetter && value1 < value2)
    ) {
      return "text-success fw-bold";
    }
    return "text-danger fw-bold";
  };

  const compareMetric = (
    label,
    val1,
    val2,
    isHigherBetter = true,
    unit = ""
  ) => (
    <div className="d-flex justify-content-between mb-2">
      <span className="fw-bold">{label}:</span>
      <div>
        <span className={getColor(val1, val2, isHigherBetter)}>
          {val1} {unit}
        </span>{" "}
        vs{" "}
        <span className={getColor(val2, val1, isHigherBetter)}>
          {val2} {unit}
        </span>
      </div>
    </div>
  );

  const renderCarCard = (car) => {
    // const imageUrl = `https://pixelz.cc/wp-content/uploads/2018/08/audi-r8-white-uhd-4k-wallpaper.jpg`;

    let firstImage = "";
    try {
      const imagesArray = JSON.parse(car.images.replace(/&quot;/g, '"'));
      if (Array.isArray(imagesArray) && imagesArray.length > 0) {
        firstImage = imagesArray[0];
      }
      console.log(car);
    } catch (error) {
      console.error("Error parsing car images:", error);
      // Optionally set a default image URL here if parsing fails
      // firstImage = 'path/to/default-image.jpg';
    }

    return (
      <Card className="shadow-sm mb-3 border-0 rounded-4">
        <Image
          src={firstImage}
          alt={car.carName}
          fluid
          className="rounded-top-4"
          style={{ height: "300px", objectFit: "cover", width: "100%" }}
        />
        <Card.Body>
          <Card.Title className="fw-bold text-center">
            {car.carName} ({car.company})
          </Card.Title>
          <Card.Text className="small text-muted text-center mb-3">
            {car.type} • {car.makeYear}
          </Card.Text>
          <ul className="list-unstyled mb-0">
            <li>
              <strong>Price/Day:</strong> {car.pricePerDay}
            </li>
            <li>
              <strong>Fuel:</strong> {car.fuelType}
            </li>
            <li>
              <strong>Transmission:</strong> {car.transmission}
            </li>
            <li>
              <strong>Seats:</strong> {car.seatCapacity}
            </li>
            <li>
              <strong>Mileage:</strong> {car.mileage} km/l
            </li>
            <li>
              <strong>KM Driven:</strong> {car.currentKm} km
            </li>
            <li>
              <strong>Features:</strong>{" "}
              {car?.featuresArray && car.featuresArray.length > 0 ? (
                <ul>
                  {JSON.parse(car.featuresArray).map((feature, index) => (
                    <li key={index}>{carFeatures[feature]["feature"]}</li>
                  ))}
                </ul>
              ) : (
                <p>No features available</p>
              )}
            </li>
          </ul>
        </Card.Body>
      </Card>
    );
  };

  return (
    <>
      <NavBar />
      <Container className="mt-4">
        <ToastContainer />
        <h2 className="text-center fw-bold mb-4">Compare Cars</h2>
        <Form>
          <Row className="mb-4 justify-content-center">
            <Col md={4}>
              <Form.Select
                value={carId1}
                onChange={(e) => setCarId1(e.target.value)}
              >
                <option value="">Select First Car</option>
                {availableCars.map((car) => (
                  <option key={car.carId} value={car.carId}>
                    {car.carName} ({car.company})
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Select
                value={carId2}
                onChange={(e) => setCarId2(e.target.value)}
              >
                <option value="">Select Second Car</option>
                {availableCars.map((car) => (
                  <option key={car.carId} value={car.carId}>
                    {car.carName} ({car.company})
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md="auto">
              <Button variant="dark" onClick={handleCompare}>
                Compare
              </Button>
            </Col>
          </Row>
        </Form>

        {car1 && car2 && (
          <>
            <Row>
              <Col md={6}>{renderCarCard(car1)}</Col>
              <Col md={6}>{renderCarCard(car2)}</Col>
            </Row>

            <Card className="shadow-sm p-4 mt-4 border-0 rounded-4">
              <h5 className="fw-bold mb-3">Performance Comparison</h5>
              {compareMetric(
                "Price/Day",
                car1.pricePerDay,
                car2.pricePerDay,
                false
              )}
              {compareMetric(
                "Mileage",
                car1.mileage,
                car2.mileage,
                true,
                "km/l"
              )}
              {compareMetric(
                "KM Driven",
                car1.currentKm,
                car2.currentKm,
                false,
                "km"
              )}
              {compareMetric("Make Year", car1.makeYear, car2.makeYear, true)}
            </Card>
          </>
        )}
      </Container>
    </>
  );
};

export default CompareCars;
