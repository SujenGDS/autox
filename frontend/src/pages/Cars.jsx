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
  const [vehicleType, setVehicleType] = useState("");
  const [company, setCompany] = useState("");
  const [maxPrice, setMaxPrice] = useState(3000000);
  const [filteredCars, setFilteredCars] = useState([]);

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
                  <option value="SUV">SUV</option>
                  <option value="Sedan">Sedan</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Company</Form.Label>
                <Form.Select
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="Ferrari">Ferrari</option>
                  <option value="Mercedes-Benz">Mercedes-Benz</option>
                  <option value="Audi">Audi</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Bugatti">Bugatti</option>
                  <option value="Chevrolet">Chevrolet</option>
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
                  <option value="Hyundai">Hyundai</option>
                  <option value="Kia">Kia</option>
                  <option value="Nissan">Nissan</option>
                  <option value="Honda">Honda</option>
                  <option value="Ford">Ford</option>
                  <option value="Volkswagen">Volkswagen</option>
                  <option value="Lexus">Lexus</option>
                  <option value="Infiniti">Infiniti</option>
                  <option value="Acura">Acura</option>
                  <option value="Genesis">Genesis</option>
                  <option value="Land Rover">Land Rover</option>
                  <option value="Jaguar">Jaguar</option>
                  <option value="Mini">Mini</option>
                  <option value="Alfa Romeo">Alfa Romeo</option>
                  <option value="Jeep">Jeep</option>
                  <option value="Dodge">Dodge</option>
                  <option value="Chrysler">Chrysler</option>
                  <option value="Ram">Ram</option>
                  <option value="Lincoln">Lincoln</option>
                  <option value="Buick">Buick</option>
                  <option value="Cadillac">Cadillac</option>
                  <option value="GMC">GMC</option>
                  <option value="Subaru">Subaru</option>
                  <option value="Mitsubishi">Mitsubishi</option>
                  <option value="Suzuki">Suzuki</option>
                  <option value="Mazda">Mazda</option>
                  <option value="Skoda">Skoda</option>
                  <option value="Seat">Seat</option>
                  <option value="Renault">Renault</option>
                  <option value="Peugeot">Peugeot</option>
                  <option value="Citroen">Citroen</option>
                  <option value="DS">DS</option>
                  <option value="Opel">Opel</option>
                  <option value="Vauxhall">Vauxhall</option>
                  <option value="Lancia">Lancia</option>
                  <option value="Lamborghini">Lamborghini</option>
                  <option value="Pagani">Pagani</option>
                  <option value="Koenigsegg">Koenigsegg</option>
                  <option value="Rimac">Rimac</option>
                  <option value="Lucid">Lucid</option>
                  <option value="Rivian">Rivian</option>
                  <option value="Polestar">Polestar</option>
                  <option value="BYD">BYD</option>
                  <option value="NIO">NIO</option>
                  <option value="XPeng">XPeng</option>
                  <option value="Li Auto">Li Auto</option>
                  <option value="Great Wall">Great Wall</option>
                  <option value="Geely">Geely</option>
                  <option value="Lynk & Co">Lynk & Co</option>
                  <option value="Zeekr">Zeekr</option>
                  <option value="Ora">Ora</option>
                  <option value="Tata">Tata</option>
                  <option value="Mahindra">Mahindra</option>
                  <option value="Maruti Suzuki">Maruti Suzuki</option>
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
                filteredCars.map((car, index) => {
                  let firstImage = "";
                  try {
                    const imagesArray = JSON.parse(
                      car.images.replace(/&quot;/g, '"')
                    );
                    if (Array.isArray(imagesArray) && imagesArray.length > 0) {
                      firstImage = imagesArray[0];
                    }
                  } catch (error) {
                    console.error("Error parsing car images:", error);
                    // Optionally set a default image URL here
                    firstImage = "path/to/default-image.jpg";
                  }
                  return (
                    <Col md={4} xxl={3} className="mb-3">
                      <CarCard
                        key={index}
                        title={car.carName}
                        fuel={car.fuelType}
                        transmission={car.transmission}
                        carId={car.carId}
                        price={`${car.pricePerDay}/day`}
                        imgLink={firstImage}
                        isBooked={car.isBooked}
                        setRefresh={setRefresh}
                      />
                    </Col>
                  );
                })
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
