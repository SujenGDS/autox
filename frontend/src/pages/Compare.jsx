import React, { useState } from "react";

const carsData = [
  {
    image: "https://via.placeholder.com/200",
    name: "Car Model A",
    brand: "Brand X",
    price: "$25,000",
    year: "2022",
    engine: "2.0L Turbo",
    mileage: "15 km/l",
    transmission: "Automatic",
  },
  {
    image: "https://via.placeholder.com/200",
    name: "Car Model B",
    brand: "Brand Y",
    price: "$27,500",
    year: "2023",
    engine: "2.5L Hybrid",
    mileage: "18 km/l",
    transmission: "Manual",
  },
  {
    image: "https://via.placeholder.com/200",
    name: "Car Model C",
    brand: "Brand Z",
    price: "$30,000",
    year: "2021",
    engine: "3.0L V6",
    mileage: "12 km/l",
    transmission: "Automatic",
  },
];

const ComparePage = () => {
  const [selectedCar1, setSelectedCar1] = useState(carsData[0]);
  const [selectedCar2, setSelectedCar2] = useState(carsData[1]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">Compare Cars</h2>
      <div className="flex justify-center gap-6 mb-4">
        <select
          className="border p-2 rounded"
          onChange={(e) =>
            setSelectedCar1(carsData.find((car) => car.name === e.target.value))
          }
          value={selectedCar1.name}
        >
          {carsData.map((car, index) => (
            <option key={index} value={car.name}>
              {car.brand} - {car.name}
            </option>
          ))}
        </select>
        <select
          className="border p-2 rounded"
          onChange={(e) =>
            setSelectedCar2(carsData.find((car) => car.name === e.target.value))
          }
          value={selectedCar2.name}
        >
          {carsData.map((car, index) => (
            <option key={index} value={car.name}>
              {car.brand} - {car.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-center gap-6 border p-4 rounded-lg shadow-lg flex-nowrap">
        {[selectedCar1, selectedCar2].map((car, index) => (
          <div key={index} className="w-1/2 border p-4 rounded-lg bg-white">
            <img
              src={car.image}
              alt={car.name}
              className="w-full h-40 object-cover mb-4"
            />
            <h3 className="text-xl font-semibold">{car.name}</h3>
            <p className="text-gray-500">Brand: {car.brand}</p>
            <p className="text-gray-500">Price: {car.price}</p>
            <p className="text-gray-500">Year: {car.year}</p>
            <p className="text-gray-500">Engine: {car.engine}</p>
            <p className="text-gray-500">Mileage: {car.mileage}</p>
            <p className="text-gray-500">Transmission: {car.transmission}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComparePage;
