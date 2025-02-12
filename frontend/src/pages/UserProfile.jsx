import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import CarCard from "../components/CarCard";
import NavBar from "../components/NavBar";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [cars, setCars] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:3000/auth/home`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userCars = await axios.get(`http://localhost:3000/auth/my-cars`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data.user);
        const carRes = await axios.get(`http://localhost:3000/auth/my-cars`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCars(carRes.data.cars);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };
    fetchData();
  }, [refresh]);

  return (
    <>
      <NavBar setRefresh={setRefresh} />
      <div className="p-4">
        {user && <h2 className="text-xl">Welcome, {user.firstName}</h2>}
        <h3 className="mt-4">My Cars</h3>
        <Row>
          <Col>
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
        </Row>
      </div>
    </>
  );
};

export default UserProfile;
