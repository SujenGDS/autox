// // import React, { useState, useEffect } from "react";
// // import {
// //   BrowserRouter as Router,
// //   Route,
// //   Routes,
// //   Navigate,
// // } from "react-router-dom";
// // import axios from "axios";
// // import Col from "react-bootstrap/esm/Col";
// // import Row from "react-bootstrap/esm/Row";
// // import CarCard from "../components/CarCard";
// // import NavBar from "../components/NavBar";

// // const UserProfile = () => {
// //   const [user, setUser] = useState(null);
// //   const [cars, setCars] = useState([]);
// //   const [refresh, setRefresh] = useState(false);

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const token = localStorage.getItem("token");
// //         const res = await axios.get(`http://localhost:3000/auth/home`, {
// //           headers: { Authorization: `Bearer ${token}` },
// //         });

// //         const userCars = await axios.get(`http://localhost:3000/auth/my-cars`, {
// //           headers: { Authorization: `Bearer ${token}` },
// //         });

// //         setUser(res.data.user);
// //         const carRes = await axios.get(`http://localhost:3000/auth/my-cars`, {
// //           headers: { Authorization: `Bearer ${token}` },
// //         });
// //         setCars(carRes.data.cars);
// //       } catch (err) {
// //         console.error("Failed to fetch data", err);
// //       }
// //     };
// //     fetchData();
// //   }, [refresh]);

// //   return (
// //     <>
// //       <NavBar setRefresh={setRefresh} />
// //       <div className="p-4">
// //         {user && <h2 className="text-xl">Welcome, {user.firstName}</h2>}
// //         <h3 className="mt-4">My Cars</h3>
// //         <Row>
// //           <Col>
// //             <div className="d-flex flex-wrap gap-3 w-100">
// //               {cars.map((car, index) => (
// //                 <CarCard
// //                   key={index}
// //                   title={car.carName}
// //                   fuel={car.fuelType}
// //                   transmission={car.transmission}
// //                   price={`${car.pricePerDay}/day`}
// //                   imgLink="https://via.placeholder.com/150" // Replace with a car image URL if available
// //                 />
// //               ))}
// //             </div>
// //           </Col>
// //         </Row>
// //       </div>
// //     </>
// //   );
// // };

// // export default UserProfile;

// import React, { useState, useEffect } from "react";
// import {
//   BrowserRouter as Router,
//   Route,
//   Routes,
//   Navigate,
// } from "react-router-dom";
// import axios from "axios";
// import Col from "react-bootstrap/esm/Col";
// import Row from "react-bootstrap/esm/Row";
// import NavBar from "../components/NavBar";
// import Modal from "react-bootstrap/Modal";
// import Button from "react-bootstrap/Button";
// import Form from "react-bootstrap/Form";

// const UserProfile = () => {
//   const [user, setUser] = useState(null);
//   const [cars, setCars] = useState([]);
//   const [refresh, setRefresh] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [currentCar, setCurrentCar] = useState(null);
//   const [editedCar, setEditedCar] = useState({
//     carName: "",
//     fuelType: "",
//     transmission: "",
//     pricePerDay: "",
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get(`http://localhost:3000/auth/home`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const userCars = await axios.get(`http://localhost:3000/auth/my-cars`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setUser(res.data.user);
//         setCars(userCars.data.cars);
//       } catch (err) {
//         console.error("Failed to fetch data", err);
//       }
//     };
//     fetchData();
//   }, [refresh]);

//   const handleEditCar = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.put(
//         `http://localhost:3000/auth/edit-car/${currentCar._id}`,
//         editedCar,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setShowEditModal(false);
//       setRefresh(!refresh);
//     } catch (err) {
//       console.error("Failed to edit car", err);
//     }
//   };

//   const handleDeleteCar = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(
//         `http://localhost:3000/auth/delete-car/${currentCar._id}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setShowDeleteModal(false);
//       setRefresh(!refresh);
//     } catch (err) {
//       console.error("Failed to delete car", err);
//     }
//   };

//   return (
//     <>
//       <NavBar setRefresh={setRefresh} />
//       <div className="p-4">
//         {user && <h2 className="text-xl">Welcome, {user.firstName}</h2>}
//         <h3 className="mt-4">My Cars</h3>
//         <Row>
//           <Col>
//             <div className="w-100">
//               <ul className="list-group list-group-flush">
//                 {cars.map((car, index) => (
//                   <li key={index} className="list-group-item p-2">
//                     <div className="d-flex align-items-center">
//                       <img
//                         src="https://via.placeholder.com/50"
//                         alt={car.carName}
//                         className="img-thumbnail me-3"
//                       />
//                       <div className="flex-grow-1">
//                         <h5 className="mb-1">{car.carName}</h5>
//                         <p className="mb-1">
//                           <strong>Fuel:</strong> {car.fuelType}
//                         </p>
//                         <p className="mb-1">
//                           <strong>Transmission:</strong> {car.transmission}
//                         </p>
//                         <p>
//                           <strong>Price:</strong> {`${car.pricePerDay}/day`}
//                         </p>
//                       </div>
//                       <div>
//                         <Button
//                           variant="warning"
//                           className="me-2"
//                           onClick={() => {
//                             setCurrentCar(car);
//                             setEditedCar({
//                               carName: car.carName,
//                               fuelType: car.fuelType,
//                               transmission: car.transmission,
//                               pricePerDay: car.pricePerDay,
//                             });
//                             setShowEditModal(true);
//                           }}
//                         >
//                           Edit
//                         </Button>
//                         <Button
//                           variant="danger"
//                           onClick={() => {
//                             setCurrentCar(car);
//                             setShowDeleteModal(true);
//                           }}
//                         >
//                           Delete
//                         </Button>
//                       </div>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </Col>
//         </Row>
//       </div>

//       {/* Edit Car Modal */}
//       <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Edit Car</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group controlId="formCarName">
//               <Form.Label>Car Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={editedCar.carName}
//                 onChange={(e) =>
//                   setEditedCar({ ...editedCar, carName: e.target.value })
//                 }
//               />
//             </Form.Group>
//             <Form.Group controlId="formFuelType">
//               <Form.Label>Fuel Type</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={editedCar.fuelType}
//                 onChange={(e) =>
//                   setEditedCar({ ...editedCar, fuelType: e.target.value })
//                 }
//               />
//             </Form.Group>
//             <Form.Group controlId="formTransmission">
//               <Form.Label>Transmission</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={editedCar.transmission}
//                 onChange={(e) =>
//                   setEditedCar({ ...editedCar, transmission: e.target.value })
//                 }
//               />
//             </Form.Group>
//             <Form.Group controlId="formPrice">
//               <Form.Label>Price per Day</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={editedCar.pricePerDay}
//                 onChange={(e) =>
//                   setEditedCar({ ...editedCar, pricePerDay: e.target.value })
//                 }
//               />
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowEditModal(false)}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={handleEditCar}>
//             Save Changes
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Delete Car Modal */}
//       <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Delete Car</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <p>Are you sure you want to delete this car?</p>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
//             Close
//           </Button>
//           <Button variant="danger" onClick={handleDeleteCar}>
//             Delete
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };

// export default UserProfile;

import React, { useState, useEffect } from "react";
import axios from "axios";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import NavBar from "../components/NavBar";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [cars, setCars] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentCar, setCurrentCar] = useState(null);
  const [editedCar, setEditedCar] = useState({
    carName: "",
    fuelType: "",
    transmission: "",
    pricePerDay: "",
  });

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
        setCars(userCars.data.cars);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };
    fetchData();
  }, [refresh]);

  const handleEditCar = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/auth/edit-car/${currentCar.carId}`,
        editedCar,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowEditModal(false);
      setRefresh(!refresh);
    } catch (err) {
      console.error("Failed to edit car", err);
    }
  };

  const handleDeleteCar = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:3000/auth/delete-car/${currentCar._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowDeleteModal(false);
      setRefresh(!refresh);
    } catch (err) {
      console.error("Failed to delete car", err);
    }
  };

  return (
    <>
      <NavBar setRefresh={setRefresh} />
      <div className="p-4">
        {user && <h2 className="text-xl">Welcome, {user.firstName}</h2>}

        <Row>
          {/* Car List - Takes 50% Width */}
          <Col md={6}>
            <h3 className="mt-4">My Cars</h3>
            <ul className="list-group list-group-flush">
              {cars.map((car, index) => (
                <li key={index} className="list-group-item p-2">
                  <div className="d-flex align-items-center">
                    <img
                      src="https://via.placeholder.com/50"
                      alt={car.carName}
                      className="img-thumbnail me-3"
                    />
                    <div className="flex-grow-1">
                      <h5 className="mb-1">{car.carName}</h5>
                      <p className="mb-1">
                        <strong>Fuel:</strong> {car.fuelType}
                      </p>
                      <p className="mb-1">
                        <strong>Transmission:</strong> {car.transmission}
                      </p>
                      <p>
                        <strong>Price:</strong> {`${car.pricePerDay}/day`}
                      </p>
                    </div>
                    <div>
                      <Button
                        variant="warning"
                        className="me-2"
                        onClick={function () {
                          setCurrentCar(car);
                          setEditedCar({
                            carName: car.carName,
                            fuelType: car.fuelType,
                            transmission: car.transmission,
                            pricePerDay: car.pricePerDay,
                          });
                          setShowEditModal(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => {
                          setCurrentCar(car);
                          setShowDeleteModal(true);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Col>

          {/* Additional Content - Takes 50% Width */}
          <Col md={6}>
            <h3 className="mt-4">Your Profile</h3>
          </Col>
        </Row>
      </div>

      {/* Edit Car Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Car</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formCarName">
              <Form.Label>Car Name</Form.Label>
              <Form.Control
                type="text"
                value={editedCar.carName}
                onChange={(e) =>
                  setEditedCar({ ...editedCar, carName: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formFuelType">
              <Form.Label>Fuel Type</Form.Label>
              <Form.Control
                type="text"
                value={editedCar.fuelType}
                onChange={(e) =>
                  setEditedCar({ ...editedCar, fuelType: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formTransmission">
              <Form.Label>Transmission</Form.Label>
              <Form.Control
                type="text"
                value={editedCar.transmission}
                onChange={(e) =>
                  setEditedCar({ ...editedCar, transmission: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formPrice">
              <Form.Label>Price per Day</Form.Label>
              <Form.Control
                type="text"
                value={editedCar.pricePerDay}
                onChange={(e) =>
                  setEditedCar({ ...editedCar, pricePerDay: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditCar}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Car Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Car</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this car?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDeleteCar}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserProfile;
