import React, { useState } from "react";
import { Button, Box, Typography } from "@mui/material";

const ImageUpload = ({ label }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={1}
      p={1}
      border="1px solid #ccc"
      borderRadius="8px"
    >
      {selectedImage ? (
        <img
          src={selectedImage}
          alt="Selected"
          style={{
            width: "160px",
            height: "160px",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
      ) : (
        <Typography variant="body1" color="text.secondary">
          {label}
        </Typography>
      )}
      <Button
        variant="outlined"
        component="label"
        color="black"
        size="small"
        sx={{
          "&:hover": {
            backgroundColor: "black",
            color: "white",
          },
        }}
      >
        Upload Image
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleImageChange}
        />
      </Button>
    </Box>
  );
};

export default ImageUpload;
