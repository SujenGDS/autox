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
    <Container maxWidth="xs">
      <Paper elevation={10} sx={{ marginTop: 8, padding: 2 }}>
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
          Log in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
          <Typography>Don't have an account?</Typography>
          <Link to="/sujen-register"> Register </Link>
        </Box>
      </Paper>
      <ToastContainer />
    </Container>
  );
};

export default Login;

// <div>
//   <div>
//     <form onSubmit={handleSubmit}>
//       <div>
//         <label htmlFor="email">Email</label>
//         <input
//           type="email"
//           placeholder="Enter Email"
//           name="email"
//           onChange={handleChanges}
//         ></input>
//       </div>
//       <div>
//         <label htmlFor="password">Password</label>
//         <input
//           type="password"
//           placeholder="Enter Password"
//           name="password"
//           onChange={handleChanges}
//         ></input>
//       </div>
//       <button>Submit</button>
//     </form>
//     <div>
//       <p>Don't have an account</p>
//       <Link to="/sujen-register">Sign up</Link>
//     </div>
//   </div>
// </div>
