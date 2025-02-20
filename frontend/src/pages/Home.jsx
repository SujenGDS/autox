// import { Container } from "@mui/material";
import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "../components/NavBar";
import Container from "react-bootstrap/esm/Container";
import CarCard from "../components/CarCard";

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <NavBar />
      <img
        src="/images/bg-6.jpg"
        alt="car"
        style={{ width: "100%", height: "80vh", objectFit: "cover" }}
      />

      <div
        style={{
          fontSize: "50px",
          paddingLeft: "50px",
          marginTop: "10px",
          marginBottom: "10px",
        }}
      >
        {" "}
        Top Picks
      </div>

      <div
        className="px-5 d-flex gap-4 overflow-x-scroll"
        style={{ scrollbarWidth: "none" }}
      >
        <div style={{ width: "290px", flexShrink: 0 }}>
          <CarCard
            title="Maybach"
            fuel={"Petrol"}
            transmission={"Automatic"}
            price="1200/day"
            imgLink="https://cdn.jdpower.com/JDP_2023%20Mercedes-Maybach%20S680%20Cashmere%20White%20Magno%20Front%20Quarter%20View.jpg"
          />
        </div>

        <div style={{ width: "290px", flexShrink: 0 }}>
          <CarCard
            title="Verna"
            fuel={"Petrol"}
            transmission={"Automatic"}
            price="1200"
            imgLink="https://apollo.olx.in/v1/files/ugjab7o17e8x1-IN/image;s=360x0"
          />
        </div>

        <div style={{ width: "290px", flexShrink: 0 }}>
          <CarCard
            title="Rolls Royce"
            fuel={"Petrol"}
            transmission={"Automatic"}
            price="74747"
            imgLink="https://res.cloudinary.com/unix-center/image/upload/c_limit,dpr_3.0,f_auto,fl_progressive,g_center,h_240,q_auto:good,w_385/pnv7ncbgaqvsstbfkjr8.jpg"
          />
        </div>

        <div style={{ width: "290px", flexShrink: 0 }}>
          <CarCard
            title="Flying Spur"
            fuel={"Petrol"}
            transmission={"Automatic"}
            price="74747"
            imgLink="https://assets.bwbx.io/images/users/iqjWHBFdfxIU/i.Bj4m.V11iQ/v1/-1x-1.webp"
          />
        </div>

        <div style={{ width: "290px", flexShrink: 0 }}>
          <CarCard
            title="Mclaren"
            fuel={"Petrol"}
            transmission={"Automatic"}
            price="74747"
            imgLink="https://auto.cdn-rivamedia.com/photos/annoncecli/big/mclaren-720s-coupe-luxury-launch-edition-v8-4-0-720-146742811.jpg"
          />
        </div>

        <div style={{ width: "290px", flexShrink: 0 }}>
          <CarCard
            title="G-Wagon"
            fuel={"Petrol"}
            transmission={"Automatic"}
            price="74747"
            imgLink="https://static1.topspeedimages.com/wordpress/wp-content/uploads/2023/01/mercedes-g-wagen.jpg"
          />
        </div>
      </div>

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
