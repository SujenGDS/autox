import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  Grid2,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    licenseNumber: "",
    password: "",
    citizenshipFrontUrl: "",
    citizenshipBackUrl: "",
    licenseFrontUrl: "",
    licenseBackUrl: "",
  });

  const navigate = useNavigate();

  const handleChanges = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleRemoveImageUrl = (fieldName) => {
    setValues((prevValues) => ({
      ...prevValues,
      [fieldName]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/register",
        values
      );
      if (response.status === 201) {
        toast.success("Registration successful!");
        setTimeout(() => navigate("/sujen-login"), 2000); // Redirect after 2 seconds
      }
    } catch (err) {
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
        backgroundImage: "url('/images/bg-4.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontSize: "50px",
          textAlign: "center",
          color: "white",
          lineHeight: "1.3",
          padding: "10px",
          background: "rgba(0, 0, 0, 0.1)", // Glass effect
          backdropFilter: "blur(5px)",
          borderRadius: "10px",
          border: "1px solid rgba(0, 0, 0, 0.02)",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
          maxWidth: "400px",
          margin: "auto",
        }}
      >
        Join us today <br /> and experience a <br />
        smarter way <br />
        to rent <br /> and share vehicles!
      </div>
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            backgroundColor: "white",
            padding: 2,
            justifyContent: "center",
            alignItems: "center",
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
                  autoFocus
                  sx={{ mb: 1 }}
                />
              </Grid2>

              <Grid2 item size={6}>
                <TextField
                  name="lastName"
                  onChange={handleChanges}
                  label="Last Name"
                  size="medium"
                  fullWidth
                  autoFocus
                  sx={{ mb: 2 }}
                />
              </Grid2>

              <Grid2 item size={6}>
                <TextField
                  name="email"
                  onChange={handleChanges}
                  label="Email"
                  size="medium"
                  fullWidth
                  autoFocus
                  sx={{ mb: 2 }}
                />
              </Grid2>

              <Grid2 item size={6}>
                <TextField
                  name="phoneNumber"
                  onChange={handleChanges}
                  label="Phone Number"
                  size="medium"
                  fullWidth
                  autoFocus
                  sx={{ mb: 2 }}
                />
              </Grid2>

              <Grid2 item size={6}>
                <TextField
                  name="licenseNumber"
                  onChange={handleChanges}
                  label="License Number"
                  size="medium"
                  fullWidth
                  type="text"
                  sx={{ mb: 2 }}
                />
              </Grid2>

              <Grid2 item size={6}>
                <TextField
                  name="password"
                  onChange={handleChanges}
                  label="Password"
                  size="medium"
                  fullWidth
                  type="password"
                  sx={{ mb: 2 }}
                />
              </Grid2>

              {/* Add URL guidance below each URL field */}
              <Grid2 item size={6}>
                <Box display="flex" alignItems="center">
                  <TextField
                    name="citizenshipFrontUrl"
                    label="Citizenship Front URL"
                    value={values.citizenshipFrontUrl}
                    onChange={handleChanges}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  {values.citizenshipFrontUrl && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() =>
                        handleRemoveImageUrl("citizenshipFrontUrl")
                      }
                      sx={{ ml: 1, height: "40px" }}
                    >
                      Remove
                    </Button>
                  )}
                </Box>
                <Typography variant="body2" sx={{ color: "gray" }}>
                  Give access to <strong>autox.verify@gmail.com</strong> and
                  paste the link here.
                </Typography>
              </Grid2>

              <Grid2 item size={6}>
                <Box display="flex" alignItems="center">
                  <TextField
                    name="citizenshipBackUrl"
                    label="Citizenship Back URL"
                    value={values.citizenshipBackUrl}
                    onChange={handleChanges}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  {values.citizenshipBackUrl && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleRemoveImageUrl("citizenshipBackUrl")}
                      sx={{ ml: 1, height: "40px", mb: 2 }}
                    >
                      Remove
                    </Button>
                  )}
                </Box>
                <Typography variant="body2" sx={{ color: "gray" }}>
                  Give access to <strong>autox.verify@gmail.com</strong> and
                  paste the link here.
                </Typography>
              </Grid2>

              <Grid2 item size={6}>
                <Box display="flex" alignItems="center">
                  <TextField
                    name="licenseFrontUrl"
                    label="License Front URL"
                    value={values.licenseFrontUrl}
                    onChange={handleChanges}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  {values.licenseFrontUrl && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleRemoveImageUrl("licenseFrontUrl")}
                      sx={{ ml: 1, height: "40px", mb: 2 }}
                    >
                      Remove
                    </Button>
                  )}
                </Box>
                <Typography variant="body2" sx={{ color: "gray" }}>
                  Give access to <strong>autox.verify@gmail.com</strong> and
                  paste the link here.
                </Typography>
              </Grid2>

              <Grid2 item size={6}>
                <Box display="flex" alignItems="center">
                  <TextField
                    name="licenseBackUrl"
                    label="License Back URL"
                    value={values.licenseBackUrl}
                    onChange={handleChanges}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  {values.licenseBackUrl && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleRemoveImageUrl("licenseBackUrl")}
                      sx={{ ml: 1, height: "40px", mb: 2 }}
                    >
                      Remove
                    </Button>
                  )}
                </Box>
                <Typography variant="body2" sx={{ color: "gray" }}>
                  Give access to <strong>autox.verify@gmail.com</strong> and
                  paste the link here.
                </Typography>
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
      </Container>
    </Box>
  );
};

export default Register;
