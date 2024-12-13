import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/sujen-home" element={<Home />}></Route>
        <Route path="/sujen-register" element={<Register />}></Route>
        <Route path="/sujen-login" element={<Login />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
