import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Card, Button, Spinner, Alert } from "react-bootstrap";
import NavBar from "../components/NavBar";
import { Carousel, Row, Col } from "react-bootstrap";
import CarCard from "../components/CarCard";

const CarDetail = () => {
  const { carId } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/car/${carId}`);
        let car_res = response.data.car;
        car_res.featuresArray = JSON.parse(car_res.featuresArray);
        setCar(car_res);
        console.log(car);
      } catch (error) {
        setError("Failed to load car details");
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetail();
  }, [carId]);

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
      <NavBar />
      <Row className="d-flex align-items-center m-4">
        <Col md={6}>
          <Carousel>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="https://static0.carbuzzimages.com/wordpress/wp-content/uploads/gallery-images/original/1076000/700/1076745.jpg"
                alt="First slide"
                style={{ height: "400px", objectFit: "cover" }}
              />
            </Carousel.Item>

            <Carousel.Item>
              <img
                className="d-block w-100"
                src="https://www.topgear.com/sites/default/files/images/news-article/carousel/2020/11/9e57369ebfc2c3e6348095465ba6a95f/20c0535_007.jpg"
                alt="Second slide"
                style={{ height: "400px", objectFit: "cover" }}
              />
            </Carousel.Item>

            <Carousel.Item>
              <img
                className="d-block w-100"
                src="https://hips.hearstapps.com/hmg-prod/images/2025-mercedes-maybach-101-66fac5ed3185a.jpg"
                alt="Third slide"
                style={{ height: "400px", objectFit: "cover" }}
              />
            </Carousel.Item>
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
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              ) : (
                <p>No features available</p>
              )}
            </Col>
          </Row>

          <div className="text-end mt-4">
            <Button variant="outline-dark">Book Now</Button>
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
        {" "}
        Recommendation
      </div>

      <div
        className="px-5 d-flex gap-4 overflow-x-scroll"
        style={{ scrollbarWidth: "none" }}
      >
        <CarCard
          title="Maybach"
          fuel={"Petrol"}
          transmission={"Automatic"}
          price="1200/day"
          imgLink="https://cdn.jdpower.com/JDP_2023%20Mercedes-Maybach%20S680%20Cashmere%20White%20Magno%20Front%20Quarter%20View.jpg"
        />

        <CarCard
          title="Verna"
          fuel={"Petrol"}
          transmission={"Automatic"}
          price="1200"
          imgLink="https://apollo.olx.in/v1/files/ugjab7o17e8x1-IN/image;s=360x0"
        />

        <CarCard
          title="Rolls Royce"
          fuel={"Petrol"}
          transmission={"Automatic"}
          price="74747"
          imgLink="https://res.cloudinary.com/unix-center/image/upload/c_limit,dpr_3.0,f_auto,fl_progressive,g_center,h_240,q_auto:good,w_385/pnv7ncbgaqvsstbfkjr8.jpg"
        />

        <CarCard
          title="Flying Spur"
          fuel={"Petrol"}
          transmission={"Automatic"}
          price="74747"
          imgLink="https://assets.bwbx.io/images/users/iqjWHBFdfxIU/i.Bj4m.V11iQ/v1/-1x-1.webp"
        />

        <CarCard
          title="Mclaren"
          fuel={"Petrol"}
          transmission={"Automatic"}
          price="74747"
          imgLink="https://auto.cdn-rivamedia.com/photos/annoncecli/big/mclaren-720s-coupe-luxury-launch-edition-v8-4-0-720-146742811.jpg"
        />

        <CarCard
          title="G-Wagon"
          fuel={"Petrol"}
          transmission={"Automatic"}
          price="74747"
          imgLink="https://static1.topspeedimages.com/wordpress/wp-content/uploads/2023/01/mercedes-g-wagen.jpg"
        />
      </div>
    </>
  );
};

export default CarDetail;
