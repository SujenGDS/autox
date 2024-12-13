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
        position: "absolute",
        height: "100vh",
        width: "100%",
        backgroundImage: "url('/images/background-image.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        // filter: "blur(5px)",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            backgroundColor: "white",
            padding: 2,
            justifyContent: "center",
            alignItems: "center",
            padding: 3,
          }}
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
              <Grid2 size={6}>
                <TextField
                  name="firstName"
                  onChange={handleChanges}
                  label="First Name"
                  size="medium"
                  fullWidth
                  // required
                  autoFocus
                  sx={{ mb: 1 }}
                />
              </Grid2>

              <Grid2 item size={6}>
                <TextField
                  name="lastName"
                  // placeholder="Enter last name"
                  onChange={handleChanges}
                  label="Last Name"
                  size="medium"
                  fullWidth
                  // required
                  autoFocus
                  sx={{ mb: 2 }}
                />
              </Grid2>

              <Grid2 item size={6}>
                <TextField
                  name="email"
                  // placeholder="Enter email"
                  onChange={handleChanges}
                  label="Email"
                  size="medium"
                  fullWidth
                  // required
                  autoFocus
                  sx={{ mb: 2 }}
                />
              </Grid2>

              <Grid2 item size={6}>
                <TextField
                  name="phoneNumber"
                  // placeholder="Enter Phone number"
                  onChange={handleChanges}
                  label="Phone Number"
                  size="medium"
                  fullWidth
                  // required
                  autoFocus
                  sx={{ mb: 2 }}
                />
              </Grid2>

              <Grid2 item size={6}>
                <TextField
                  name="licenseNumber"
                  // placeholder="Enter license Number"
                  onChange={handleChanges}
                  label="License Number"
                  size="medium"
                  fullWidth
                  // required
                  type="text"
                  sx={{ mb: 2 }}
                />
              </Grid2>

              <Grid2 item size={6}>
                <TextField
                  name="password"
                  // placeholder="Enter password"
                  onChange={handleChanges}
                  label="Password"
                  size="medium"
                  fullWidth
                  // required
                  type="password"
                  sx={{ mb: 2 }}
                />
              </Grid2>

              <Grid2 item size={6}>
                <ImageUpload label="license photo front" />
              </Grid2>

              <Grid2 item size={6}>
                <ImageUpload label="license photo back" />
              </Grid2>
            </Grid2>
            <Button
              type="submit"
              variant="outlined"
              fullWidth
              sx={{
                mt: 4,
                color: "black",
                borderColor: "black",
                "&:hover": {
                  backgroundColor: "black",
                  color: "white",
                },
              }}
            >
              Register
            </Button>
          </Box>

          <Box display="flex" justifyContent="space-between" sx={{ mt: 1 }}>
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
