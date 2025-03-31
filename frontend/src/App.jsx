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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/sujen-home" element={<Home />}></Route>
        <Route path="/sujen-register" element={<Register />}></Route>
        <Route path="/sujen-login" element={<Login />}></Route>
        <Route path="/Cars" element={<Cars />}></Route>
        <Route path="/upload-car" element={<UploadCarPage />}></Route>
        <Route path="/userProfile" element={<UserProfile />}></Route>
        <Route path="/car/:carId" element={<CarDetail />}></Route>
        <Route path="/booking/lifts" element={<LiftPage />}></Route>
        <Route path="/Compare" element={<ComparePage />}></Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
