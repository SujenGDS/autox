import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import * as formik from "formik";
import * as yup from "yup";
import React, { useState } from "react";
import { toast } from "react-toastify";

const carFeatures = [
  {
    id: 1,
    feature: "Air Conditioning",
    ariaLabel: "Checkbox for Air Conditioning",
    name: "air_conditioning",
  },
  {
    id: 2,
    feature: "GPS Navigation",
    ariaLabel: "Checkbox for GPS Navigation",
    name: "gps_navigation",
  },
  {
    id: 3,
    feature: "Bluetooth Audio",
    ariaLabel: "Checkbox for Bluetooth Audio",
    name: "bluetooth_audio",
  },
  {
    id: 4,
    feature: "Heated Seats",
    ariaLabel: "Checkbox for Heated Seats",
    name: "heated_seats",
  },
  {
    id: 5,
    feature: "Sunroof",
    ariaLabel: "Checkbox for Sunroof",
    name: "sunroof",
  },
  {
    id: 6,
    feature: "All Wheel Drive",
    ariaLabel: "Checkbox for All Wheel Drive",
    name: "all_wheel_drive",
  },
];

const UploadCar = () => {
  const { Formik } = formik;

  const [photos, setPhotos] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (photos.length && files.length > 5) {
      toast.error("you can upload only 5 photos");
      return;
    }

    const newPhotos = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);

    const handleUpload = () => {
      if (photos.length < 2) {
        toast.error("Upload atleast 2 photos of your car.");
      } else {
        console.log("photos ready to upload");
        toast.success("photos are uploaded");
        //backend
      }
    };
  };

  const handleRemovePhoto = (index) => {
    setPhotos((prevPhotos) => {
      URL.revokeObjectURL(prevPhotos[index].preview);
      return prevPhotos.filter((_, i) => i !== index);
    });
  };

  const schema = yup.object().shape({
    carName: yup.string().required(),
    company: yup.string().required(),
    makeYear: yup.string().required(),
    seatCapacity: yup.string().required(),
    carPlateNumber: yup.string().required(),
    pricePerDay: yup.mixed().required(),

    air_conditioning: yup.bool(),
    gps_navigation: yup.bool(),
    bluetooth_audio: yup.bool(),
    heated_seats: yup.bool(),
    sunroof: yup.bool(),
    all_wheel_drive: yup.bool(),
    terms: yup.bool().required().oneOf([true], "terms must be accepted"),
  });

  const handleSubmit = (values) => {
    console.log(values);
  };

  return (
    <Formik
      validationSchema={schema}
      onSubmit={handleSubmit}
      initialValues={{
        carName: "",
        company: "",
        makeYear: "",
        seatCapacity: "",
        carPlateNumber: "",
        pricePerDay: "",
        file: null,
        terms: false,
        air_conditioning: false,
        gps_navigation: false,
        bluetooth_audio: false,
        heated_seats: false,
        sunroof: false,
        all_wheel_drive: false,
      }}
    >
      {({ handleSubmit, handleChange, values, touched, errors }) => (
        <Form noValidate className="m-3" onSubmit={handleSubmit}>
          <Row className="mb-3 g-3">
            <Form.Group
              as={Col}
              md="12"
              controlId="validationFormikCarName"
              // className="position-relative"
            >
              <Form.Label>Car Name</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="text"
                  name="carName"
                  value={values.carName}
                  onChange={handleChange}
                  isInvalid={!!errors.carName}
                />
              </InputGroup>
            </Form.Group>

            <Form.Group
              as={Col}
              md="6"
              controlId="validationFormikCompanyName"
              className="position-relative"
            >
              <Form.Label>Company</Form.Label>
              <Form.Control
                type="text"
                name="company"
                value={values.company}
                onChange={handleChange}
                isInvalid={!!errors.company}
              />
            </Form.Group>

            <Form.Group as={Col} md="6" controlId="validationFormikMakeYear">
              <Form.Label>Make Year</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                aria-describedby="inputGroupPrepend"
                name="makeYear"
                value={values.makeYear}
                onChange={handleChange}
                isInvalid={!!errors.makeYear}
              />
            </Form.Group>
          </Row>
          <Row className="mb-3 g-3">
            <Form.Group
              as={Col}
              md="4"
              controlId="validationFormik103"
              className="position-relative"
            >
              <Form.Label>Seat capacity</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                name="seatCapacity"
                value={values.seatCapacity}
                onChange={handleChange}
                isInvalid={!!errors.seatCapacity}
              />

              {/* <Form.Control.Feedback type="invalid" tooltip>
                {errors.seatCapacity}
              </Form.Control.Feedback> */}
            </Form.Group>
            <Form.Group
              as={Col}
              md="4"
              controlId="validationFormik104"
              className="position-relative"
            >
              <Form.Label>Car plate number</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                name="carPlateNumber"
                value={values.carPlateNumber}
                onChange={handleChange}
                isInvalid={!!errors.carPlateNumber}
              />
            </Form.Group>
            <Form.Group
              as={Col}
              md="4"
              controlId="validationFormik105"
              className="position-relative"
            >
              <Form.Label>Price per day</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                name="pricePerDay"
                value={values.pricePerDay}
                onChange={handleChange}
                isInvalid={!!errors.pricePerDay}
              />

              {/* <Form.Control.Feedback type="invalid" tooltip>
                {errors.pricePerDay}
              </Form.Control.Feedback> */}
            </Form.Group>
          </Row>
          <Form.Group as={Col} md="12" className="position-relative mb-3">
            <Form.Label>Car photos | Max - 5 Min - 3 |</Form.Label>
            <Form.Control
              type="file"
              required
              name="file"
              onChange={handleFileChange}
              isInvalid={!!errors.file}
              multiple={true}
            />
            <Form.Control.Feedback type="invalid" tooltip>
              {errors.file}
            </Form.Control.Feedback>
          </Form.Group>
          <Row>
            {photos.map((photo, index) => (
              <Col key={index} md={6} className="mb-3">
                <img
                  src={photo.preview}
                  alt={`preview-${index}`}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    marginBottom: "5px",
                  }}
                />
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemovePhoto(index)}
                >
                  Remove
                </Button>
              </Col>
            ))}
          </Row>
          <h3>Features</h3>
          <Row>
            {carFeatures.map((feature) => (
              <Col lg="4" md="6" sm="6">
                <Form.Check
                  inline
                  label={feature.feature}
                  name={feature.name}
                  onChange={handleChange}
                  type={"checkbox"}
                  key={feature.id}
                />
              </Col>
            ))}
          </Row>

          <hr />

          <Form.Group className="position-relative mb-3">
            <Form.Check
              required
              name="terms"
              label="Agree to terms and conditions"
              onChange={handleChange}
              isInvalid={!!errors.terms}
              feedback={errors.terms}
              feedbackType="invalid"
              id="validationFormik106"
            />
          </Form.Group>
          <Button
            type="submit"
            style={{
              backgroundColor: "black",
              border: "none",
              color: "white",
              opacity: 1,
              transition: "opacity 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.opacity = 0.7)}
            onMouseLeave={(e) => (e.target.style.opacity = 1)}
          >
            Upload
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default UploadCar;
