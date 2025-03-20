import React, { useEffect, useState } from "react";
import Row from "react-bootstrap/esm/Row";
import CarCard from "../components/CarCard";
import NavBar from "../components/NavBar";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [refresh, setRefresh] = useState(false);

  // Filter states
  const [vehicleType, setVehicleType] = useState("");
  const [company, setCompany] = useState("");
  const [maxPrice, setMaxPrice] = useState(3000000);
  const [filteredCars, setFilteredCars] = useState([]);

  // Fetch cars from the backend
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get("http://localhost:3000/car/get-cars");
        setCars(response.data.cars);
        setFilteredCars(response.data.cars);
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    };

    fetchCars();
  }, [refresh]);

  // Apply filters
  const applyFilters = () => {
    console.log("Applying Filters:", {
      vehicleType,
      company,
      maxPrice,
    });
    const filtered = cars.filter((car) => {
      return (
        (vehicleType === "" || car.type === vehicleType) &&
        (company === "" || car.company === company) &&
        (!maxPrice || car.pricePerDay <= parseInt(maxPrice, 10))
      );
    });
    console.log("Cars Data:", cars);
    console.log("Filtering by:", { vehicleType, company, maxPrice });
    console.log("Filtered Cars:", filtered);
    setFilteredCars(filtered);
  };

  // Clear filters
  const clearFilters = () => {
    setVehicleType("");
    setCompany("");
    setMaxPrice(300000);
    setFilteredCars(cars);
  };

  return (
    <>
      <NavBar setRefresh={setRefresh} />

      <Container fluid className="mt-3 px-5">
        <Row>
          {/* Filter Section */}
          <Col md={3} className="p-3 border-end">
            <h4>Filters</h4>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Vehicle Type</Form.Label>
                <Form.Select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="SUV">SUV</option>
                  <option value="Pick Up">Pick up</option>

                  <option value="Coupe">Coupe</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Company</Form.Label>
                <Form.Select
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                >
                  <option value=""> Select company</option>
                  <option value="Hyundai">Hyundai</option>
                  <option value="Tata">Tata</option>
                  <option value="Mahindra">Mahindra</option>
                  <option value="Maruti Suzuki">Maruti Suzuki</option>
                  <option value="Honda">Honda</option>
                  <option value="Kia">Kia</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Nissan">Nissan</option>
                  <option value="Datsun">Datsun</option>
                  <option value="Ford">Ford</option>
                  <option value="Renault">Renault</option>
                  <option value="MG">MG</option>
                  <option value="Skoda">Skoda</option>
                  <option value="Volkswagen">Volkswagen</option>
                  <option value="Peugeot">Peugeot</option>
                  <option value="Jeep">Jeep</option>
                  <option value="Isuzu">Isuzu</option>
                  <option value="BYD">BYD</option>
                  <option value="Changan">Changan</option>
                  <option value="GWM (Great Wall Motors)">
                    GWM (Great Wall Motors)
                  </option>
                  <option value="Haval">Haval</option>
                  <option value="DFSK">DFSK</option>
                  <option value="Citroën">Citroën</option>
                  <option value="Mitsubishi">Mitsubishi</option>
                  <option value="Subaru">Subaru</option>
                  <option value="Land Rover">Land Rover</option>
                  <option value="Lexus">Lexus</option>
                  <option value="Jaguar">Jaguar</option>
                  <option value="Mercedes-Benz">Mercedes-Benz</option>
                  <option value="BMW">BMW</option>
                  <option value="Porsche">Porsche</option>
                  <option value="Volvo">Volvo</option>
                  <option value="Tesla">Tesla</option>
                  <option value="Fiat">Fiat</option>
                  <option value="Maserati">Maserati</option>
                  <option value="Rolls Royce">Rolls Royce</option>
                  <option value="Bentley">Bentley</option>
                  <option value="McLaren">McLaren</option>
                  <option value="Aston Martin">Aston Martin</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Max Price: {maxPrice}</Form.Label>
                <Form.Range
                  max={1000000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </Form.Group>

              <Button
                variant="outline-dark"
                className="me-2"
                onClick={applyFilters}
              >
                Apply Filter
              </Button>
              <Button variant="secondary" onClick={clearFilters}>
                Clear Filter
              </Button>
            </Form>
          </Col>

          {/* Car List Section */}
          <Col md={9} className="ps-5">
            <div className="row">
              {filteredCars.length > 0 ? (
                filteredCars.map((car, index) => (
                  <Col md={4} xxl={3} className="mb-3">
                    <CarCard
                      key={index}
                      title={car.carName}
                      fuel={car.fuelType}
                      transmission={car.transmission}
                      carId={car.carId}
                      price={`${car.pricePerDay}/day`}
                      imgLink="https://via.placeholder.com/150" // Replace with a real image
                      isBooked={car.isBooked} // Pass isBooked here
                      setRefresh={setRefresh}
                    />
                  </Col>
                ))
              ) : (
                <p>No cars match the selected filters.</p>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Cars;
