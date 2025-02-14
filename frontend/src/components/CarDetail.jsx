import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CarDetail = () => {
  const { carId } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/car/${carId}`);
        setCar(response.data.car);
      } catch (error) {
        setError("Failed to load car details");
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetail();
  }, [carId]);

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <div>
      <h1>{car?.carName}</h1>
      <img
        src={car?.imgLink || "https://via.placeholder.com/400"}
        alt={car?.carName}
      />
      <p>
        <strong>Fuel Type:</strong> {car?.fuelType}
      </p>
      <p>
        <strong>Transmission:</strong> {car?.transmission}
      </p>
      <p>
        <strong>Price Per Day:</strong> ${car?.pricePerDay}
      </p>
      <button>Book Now</button>
    </div>
  );
};

export default CarDetail;
