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
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/auth/home", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status !== 201) {
        navigate("/sujen-login");
      }
    } catch (err) {
      navigate("/sujen-login");
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <NavBar />
      <img
        src="/images/home-bg.png"
        alt="car"
        style={{ width: "100%", height: "80vh", objectFit: "cover" }}
      />

      <div className="p-5 d-flex gap-4">
        <CarCard
          title="Hyundai"
          description="AN amazing car with amazing features ksjdhfsaghsdaljghaskljghdskjhjksdh"
          price="1200/day"
          imgLink="https://cdn.jdpower.com/JDP_2023%20Mercedes-Maybach%20S680%20Cashmere%20White%20Magno%20Front%20Quarter%20View.jpg"
        />

        <CarCard
          title="Kia"
          description="AN faskdjfaksljflsakjf car with amazing features ksjdhfsaghsdaljghaskljghdskjhjksdh"
          price="1200"
          imgLink="https://apollo.olx.in/v1/files/ugjab7o17e8x1-IN/image;s=360x0"
        />

        <CarCard
          title="Tesla"
          description="AN amazing car with alsdjkfalksfjuhfjfjfjfjf features ksjdhfsaghsdaljghaskljghdskjhjksdh"
          price="74747"
          imgLink="https://res.cloudinary.com/unix-center/image/upload/c_limit,dpr_3.0,f_auto,fl_progressive,g_center,h_240,q_auto:good,w_385/pnv7ncbgaqvsstbfkjr8.jpg"
        />

        <CarCard
          title="Tesla"
          description="AN amazing car with alsdjkfalksfjuhfjfjfjfjf features ksjdhfsaghsdaljghaskljghdskjhjksdh"
          price="74747"
          imgLink="https://assets.bwbx.io/images/users/iqjWHBFdfxIU/i.Bj4m.V11iQ/v1/-1x-1.webp"
        />

        <CarCard
          title="Tesla"
          description="AN amazing car with alsdjkfalksfjuhfjfjfjfjf features ksjdhfsaghsdaljghaskljghdskjhjksdh"
          price="74747"
          imgLink="https://auto.cdn-rivamedia.com/photos/annoncecli/big/mclaren-720s-coupe-luxury-launch-edition-v8-4-0-720-146742811.jpg"
        />

        <CarCard
          title="Tesla"
          description="AN amazing car with alsdjkfalksfjuhfjfjfjfjf features ksjdhfsaghsdaljghaskljghdskjhjksdh"
          price="74747"
          imgLink="https://static1.topspeedimages.com/wordpress/wp-content/uploads/2023/01/mercedes-g-wagen.jpg"
        />
      </div>
    </>
  );
};

export default Home;
