import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "../components/NavBar";

const Login = () => {
  const [values, setValues] = useState({
    email: "",
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
        "http://localhost:3000/auth/login",
        values
      );
      if (response.status === 201) {
        localStorage.setItem("token", response.data.token);
        navigate("/sujen-home");
        toast.success("Logged In");
      } else {
        toast.error("Invalid Credentials");
      }
    } catch (err) {
      toast.error("Invalid Credentials");
      console.log("error", err.message);
    }
  };

  return (
    <>
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
          justifyContent: "flex-start",
          alignItems: "center",
          // paddingLeft: "60%",
          // filter: "blur(5px)",
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
          <Paper elevation={10} sx={{ padding: 4 }}>
            <Typography
              component="h1"
              variant="h5"
              sx={{ textAlign: "center", mb: 3 }}
            >
              Log in
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                name="email"
                label="Email"
                size="medium"
                onChange={handleChanges}
                fullWidth
                // required
                autoFocus
                sx={{ mb: 2 }}
              />

              <TextField
                name="password"
                label="Password"
                size="medium"
                onChange={handleChanges}
                fullWidth
                // required
                type="password"
                sx={{ mb: 2 }}
              />

              <Button
                type="submit"
                variant="outlined"
                fullWidth
                sx={{
                  mt: 1,
                  color: "black",
                  borderColor: "black",
                  "&:hover": {
                    backgroundColor: "black",
                    color: "white",
                  },
                }}
              >
                Sign in
              </Button>
            </Box>
            <Box display="flex" justifyContent="space-between" sx={{ mt: 1 }}>
              <Typography>Don't have an account?</Typography>
              <Link to="/sujen-register"> Register </Link>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default Login;
