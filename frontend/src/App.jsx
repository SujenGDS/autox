import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Cars from "./pages/Cars.jsx";
import UploadCarPage from "./pages/CarUpload.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import UserProfile from "./pages/UserProfile.jsx";
import CarDetail from "./pages/CarDetail.jsx";
import LiftPage from "./pages/Lift.jsx";
import ComparePage from "./pages/Compare.jsx";
import BookedCarDetail from "./pages/BookedCarDetail.jsx";
import MyBookedCarDetailsPage from "./pages/MyBookedCarsDetail.jsx";
import ViewRideShare from "./pages/ViewRideShare.jsx";
import Success from "./pages/Success.jsx";
import AdminDashboard from "./pages/AdminDash.jsx";
import Dashboard from "./pages/Dashboard.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />}></Route>
        <Route path="/payment-success" element={<Success />} />
        <Route path="/sujen-home" element={<Dashboard />}></Route>
        <Route path="/sujen-register" element={<Register />}></Route>
        <Route path="/sujen-login" element={<Login />}></Route>
        <Route path="/Cars" element={<Cars />}></Route>
        <Route path="/upload-car" element={<UploadCarPage />}></Route>
        <Route path="/userProfile" element={<UserProfile />}></Route>
        <Route path="/admin" element={<AdminDashboard />}></Route>

        <Route path="/car/:carId" element={<CarDetail />}></Route>
        <Route path="/booking/:bookingId" element={<BookedCarDetail />}></Route>
        <Route
          path="/booking/owner/:bookingId"
          element={<BookedCarDetail />}
        ></Route>
        <Route path="/rideshare/:rideShareId" element={<ViewRideShare />} />
        <Route
          path="/booking/my-booking/:carId"
          element={<MyBookedCarDetailsPage />}
        ></Route>
        <Route path="/booking/lifts" element={<LiftPage />}></Route>
        <Route path="/Compare" element={<ComparePage />}></Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
