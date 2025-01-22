import React, { useEffect, useState } from "react";
import Row from "react-bootstrap/esm/Row";
import CarCard from "../components/CarCard";
import NavBar from "../components/NavBar";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import axios from "axios"; // Install axios if not already installed

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [refresh, setRefresh] = useState(false);

  // Fetch cars from the backend
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
  }, [refresh]);

  return (
    <>
      <NavBar setRefresh={setRefresh} />

      <Container fluid className="mt-3 px-5">
        <Row>
          <Col lg={10}>
            <div className="d-flex flex-wrap gap-3 w-100">
              {cars.map((car, index) => (
                <CarCard
                  key={index}
                  title={car.carName}
                  fuel={car.fuelType}
                  transmission={car.transmission}
                  price={`${car.pricePerDay}/day`}
                  imgLink="https://via.placeholder.com/150" // Replace with a car image URL if available
                />
              ))}
            </div>
          </Col>

          <Col>
            <div>Filter Filter</div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Cars;
