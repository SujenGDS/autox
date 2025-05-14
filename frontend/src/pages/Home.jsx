import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "../components/NavBar";
import Container from "react-bootstrap/esm/Container";
import CarCard from "../components/CarCard";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Home = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get("http://localhost:3000/car/get-cars");
        setCars(response.data.cars);
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    };

    fetchCars();
  }, []);

  return (
    <>
      <NavBar />

      {/* Hero Banner */}
      <img
        src="/images/bg1331.jpg"
        alt="Luxury Car"
        style={{ width: "100%", height: "80vh", objectFit: "cover" }}
      />

      {/* Top Picks Section */}
      <Container className="my-5">
        <h2 className="mb-4" style={{ fontSize: "2.8rem", fontWeight: "500" }}>
          Top Picks For You
        </h2>
        <div
          className="d-flex gap-4 overflow-x-scroll px-2"
          style={{ scrollbarWidth: "none" }}
        >
          {cars.slice(0, 6).map((car, index) => {
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
      </Container>

      {/* About Us Section */}
      <Container className="my-5">
        <Row className="align-items-center">
          <Col md={6}>
            <img
              src="https://c4.wallpaperflare.com/wallpaper/658/877/209/red-rolls-royce-cars-blue-winter-hd-wallpaper-preview.jpg"
              alt="About Us"
              style={{
                width: "100%",
                borderRadius: "16px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              }}
            />
          </Col>
          <Col md={6}>
            <h2 style={{ fontSize: "2.5rem", fontWeight: "500" }}>About Us</h2>
            <p style={{ fontSize: "1.2rem", marginTop: "20px" }}>
              We believe renting a car should be as luxurious as driving one.
              Our platform connects customers with premium and affordable
              vehicles with just a few clicks. Whether you're cruising the city
              or taking a weekend escape, we're here to get you there in style.
            </p>
          </Col>
        </Row>
      </Container>

      {/* Explore More Cars */}
      <Container className="my-5">
        <h2 className="mb-4" style={{ fontSize: "2.5rem", fontWeight: "600" }}>
          Explore Our Fleet
        </h2>
        <Row xs={1} md={3} className="g-4">
          {cars.slice(0, 3).map((car, idx) => {
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
              <Col key={idx}>
                <CarCard
                  title={car.carName}
                  fuel={car.fuelType}
                  transmission={car.transmission}
                  carId={car.carId}
                  price={`${car.pricePerDay}/day`}
                  imgLink={firstImage}
                  isBooked={car.isBooked}
                />
              </Col>
            );
          })}
        </Row>
        <div className="text-center mt-4">
          <Button variant="outline-dark" onClick={() => navigate("/Cars")}>
            View All Cars
          </Button>
        </div>
      </Container>

      {/* Footer Strip */}
      <div
        style={{
          width: "100%",
          height: "120px",
          backgroundImage:
            "linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url('/images/bg-4.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          marginBottom: "20px",
        }}
        className="mt-5"
      ></div>
    </>
  );
};

export default Home;
