import axios from "axios";
import React from "react";
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

  const carList = [
    {
      title: "Maybach",
      fuel: "Petrol",
      transmission: "Automatic",
      price: "1200/day",
      imgLink:
        "https://cdn.jdpower.com/JDP_2023%20Mercedes-Maybach%20S680%20Cashmere%20White%20Magno%20Front%20Quarter%20View.jpg",
    },
    {
      title: "Verna",
      fuel: "Petrol",
      transmission: "Automatic",
      price: "1200",
      imgLink: "https://apollo.olx.in/v1/files/ugjab7o17e8x1-IN/image;s=360x0",
    },
    {
      title: "Rolls Royce",
      fuel: "Petrol",
      transmission: "Automatic",
      price: "74747",
      imgLink:
        "https://res.cloudinary.com/unix-center/image/upload/c_limit,dpr_3.0,f_auto,fl_progressive,g_center,h_240,q_auto:good,w_385/pnv7ncbgaqvsstbfkjr8.jpg",
    },
    {
      title: "Flying Spur",
      fuel: "Petrol",
      transmission: "Automatic",
      price: "74747",
      imgLink:
        "https://assets.bwbx.io/images/users/iqjWHBFdfxIU/i.Bj4m.V11iQ/v1/-1x-1.webp",
    },
    {
      title: "McLaren",
      fuel: "Petrol",
      transmission: "Automatic",
      price: "74747",
      imgLink:
        "https://auto.cdn-rivamedia.com/photos/annoncecli/big/mclaren-720s-coupe-luxury-launch-edition-v8-4-0-720-146742811.jpg",
    },
    {
      title: "G-Wagon",
      fuel: "Petrol",
      transmission: "Automatic",
      price: "74747",
      imgLink:
        "https://static1.topspeedimages.com/wordpress/wp-content/uploads/2023/01/mercedes-g-wagen.jpg",
    },
  ];

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
          {carList.map((car, index) => (
            <div key={index} style={{ width: "290px", flexShrink: 0 }}>
              <CarCard {...car} />
            </div>
          ))}
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
              or taking a weekend escape, we’re here to get you there in style.
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
          {carList.slice(0, 3).map((car, idx) => (
            <Col key={idx}>
              <CarCard {...car} />
            </Col>
          ))}
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
