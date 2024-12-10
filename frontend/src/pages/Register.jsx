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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
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
    <Container maxWidth="xs">
      <Paper
        elevation={10}
        sx={{ backgroundColor: "white", marginTop: 8, padding: 2 }}
      >
        {/* <Avatar
          sx={{
            mx: "auto",
            bgcolor: "grey",
            textAlign: "center",
            mb: 1,
          }}
        >
          <LockOutlinedIcon />
        </Avatar> */}
        <Typography component="h1" variant="h5" sx={{ textAlign: "center" }}>
          Get Started
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            name="firstName"
            placeholder="Enter first name"
            onChange={handleChanges}
            fullWidth
            required
            autoFocus
            sx={{ mb: 2 }}
          />

          {
            <TextField
              name="lastName"
              placeholder="Enter last name"
              onChange={handleChanges}
              fullWidth
              required
              autoFocus
              sx={{ mb: 2 }}
            />
          }

          <TextField
            name="email"
            placeholder="Enter email"
            onChange={handleChanges}
            fullWidth
            required
            autoFocus
            sx={{ mb: 2 }}
          />

          <TextField
            name="phoneNumber"
            placeholder="Enter Phone number"
            onChange={handleChanges}
            fullWidth
            required
            autoFocus
            sx={{ mb: 2 }}
          />

          <TextField
            name="license photo"
            placeholder="upload license photo"
            onChange={handleChanges}
            fullWidth
            required
            autoFocus
            sx={{ mb: 2 }}
          />

          <TextField
            name="password"
            placeholder="Enter password"
            onChange={handleChanges}
            fullWidth
            required
            type="password"
            sx={{ mb: 2 }}
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 1 }}>
            Sign in
          </Button>
        </Box>
        <Box display="flex" justifyContent="space-between" sx={{ mt: 1 }}>
          <Typography>Already have an account?</Typography>
          <Link to="/sujen-login"> Log in </Link>
        </Box>
      </Paper>
      <ToastContainer />
    </Container>
  );
};

export default Register;

//   <div>
//     <div>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="username">Username</label>
//           <input
//             type="text"
//             placeholder="Enter Username"
//             name="username"
//             onChange={handleChanges}
//           ></input>
//         </div>
//         <div>
//           <label htmlFor="email">Email</label>
//           <input
//             type="email"
//             placeholder="Enter Email"
//             name="email"
//             onChange={handleChanges}
//           ></input>
//         </div>
//         <div>
//           <label htmlFor="password">Password</label>
//           <input
//             type="password"
//             placeholder="Enter Password"
//             name="password"
//             onChange={handleChanges}
//           ></input>
//         </div>
//         <button>Submit</button>
//       </form>
//       <div>
//         <p>Already have a account</p>
//         <Link to="/sujen-login">Login</Link>
//       </div>
//     </div>
//   </div>
// );
