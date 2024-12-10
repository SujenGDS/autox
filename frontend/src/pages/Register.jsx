import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid2,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ImageUpload from "../components/ImageUpload";

const Register = () => {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    licenseNumber: "",
    password: "",
  });

  const navigate = useNavigate();
  const handleChanges = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/register",
        values
      );
      // if (response.status === 201) {
      //   navigate("/sujen-login");
      if (response.status === 201) {
        toast.success("Registration successful!");
        setTimeout(() => navigate("/sujen-login"), 2000); // Redirect after 2 seconds
      }
    } catch (err) {
      // Check if the error is due to a conflict (user already exists)
      if (err.response && err.response.status === 409) {
        toast.error("User already exists! Please use a different email.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
      console.log(err.message);
    }
  };
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        backgroundImage: "url('/images/background-image.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{ backgroundColor: "white", marginTop: 8, padding: 2 }}
        >
          <Typography component="h1" variant="h5" sx={{ textAlign: "center" }}>
            Get Started
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <Grid2 container spacing={2}>
              <Grid2 item xs={12} sm={6}>
                <TextField
                  name="firstName"
                  placeholder="Enter first name"
                  onChange={handleChanges}
                  fullWidth
                  required
                  autoFocus
                  sx={{ mb: 2 }}
                />
              </Grid2>

              <Grid2 item xs={12} sm={7}>
                <TextField
                  name="lastName"
                  placeholder="Enter last name"
                  onChange={handleChanges}
                  fullWidth
                  required
                  autoFocus
                  sx={{ mb: 2 }}
                />
              </Grid2>

              <Grid2 item xs={12} sm={6}>
                <TextField
                  name="email"
                  placeholder="Enter email"
                  onChange={handleChanges}
                  fullWidth
                  required
                  autoFocus
                  sx={{ mb: 2 }}
                />
              </Grid2>

              <Grid2 item xs={12} sm={6}>
                <TextField
                  name="phoneNumber"
                  placeholder="Enter Phone number"
                  onChange={handleChanges}
                  fullWidth
                  required
                  autoFocus
                  sx={{ mb: 2 }}
                />
              </Grid2>

              <Grid2 item xs={12} sm={6}>
                <TextField
                  name="licenseNumber"
                  placeholder="Enter license Number"
                  onChange={handleChanges}
                  fullWidth
                  required
                  type="text"
                  sx={{ mb: 2 }}
                />
              </Grid2>

              <Grid2 item xs={12} sm={6}>
                <TextField
                  name="password"
                  placeholder="Enter password"
                  onChange={handleChanges}
                  fullWidth
                  required
                  type="password"
                  sx={{ mb: 2 }}
                />
              </Grid2>

              <Grid2 item xs={12} sm={6}>
                <ImageUpload label="license photo front" />
              </Grid2>

              <Grid2 item xs={12} sm={6}>
                <ImageUpload label="license photo back" />
              </Grid2>

              <Grid2 item xs={12} sm={6}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ mt: 1 }}
                >
                  Sign in
                </Button>
              </Grid2>
            </Grid2>
          </Box>
          <Box display="flex" justifyContent="flex-start" sx={{ mt: 2 }}>
            <Typography>Already have an account?</Typography>
            <Link to="/sujen-login"> Log in </Link>
          </Box>
        </Paper>
        <ToastContainer />
      </Container>
    </Box>
  );
};

export default Register;
