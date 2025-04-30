import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import * as formik from "formik";
import * as yup from "yup";
import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { ListGroup, Modal } from "react-bootstrap"; // Import ListGroup

const carFeatures = [
  // ... (keep carFeatures array as is)
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

// Define min/max link counts
const MIN_IMAGE_LINKS = 3;
const MAX_IMAGE_LINKS = 5;

const UploadCar = ({ setShow, setRefresh }) => {
  const { Formik } = formik;
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState("");

  const schema = yup.object().shape({
    carName: yup.string().required(),
    company: yup.string().required(),
    makeYear: yup.number().required().typeError("Must be a number"),
    type: yup.string().required(),
    seatCapacity: yup.number().required().typeError("Must be a number"),
    carPlateNumber: yup.string().required(),
    pricePerDay: yup.number().required().typeError("Must be a number"),
    mileage: yup.number().required().typeError("Must be a number"),
    km: yup.number().required().typeError("Must be a number"),
    transmission: yup.string().required(),
    fuelType: yup.string().required(), // Use string, not mixed if it's from a select
    // Validation for the array of image URLs (using 'imageLinks' key)
    imageLinks: yup // Changed key name to match DB
      .array()
      .of(yup.string().url("Must be a valid URL").required()) // Each item must be a valid URL
      .min(MIN_IMAGE_LINKS, `Minimum ${MIN_IMAGE_LINKS} photo links required`)
      .max(MAX_IMAGE_LINKS, `Maximum ${MAX_IMAGE_LINKS} photo links allowed`)
      .required(`At least ${MIN_IMAGE_LINKS} photo links are required`), // Make the array itself required

    blueBookUrl: yup
      .string()
      .url("Must be a valid URL")
      .required("Bluebook URL is required"),
    // Feature checkboxes
    air_conditioning: yup.bool(),
    gps_navigation: yup.bool(),
    bluetooth_audio: yup.bool(),
    heated_seats: yup.bool(),
    sunroof: yup.bool(),
    all_wheel_drive: yup.bool(),
    // Terms
    terms: yup.bool().required().oneOf([true], "Terms must be accepted"),
  });

  const handleSubmit = async (values) => {
    // Filter selected features based on the carFeatures definition
    const featuresArray = carFeatures
      .filter((feature) => values[feature.name] === true)
      .map((feature) => feature.name); // Extract just the names

    const payload = {
      carName: values.carName,
      company: values.company,
      makeYear: values.makeYear,
      type: values.type,
      seatCapacity: values.seatCapacity,
      carPlateNumber: values.carPlateNumber,
      pricePerDay: values.pricePerDay,
      mileage: values.mileage,
      km: values.km,
      transmission: values.transmission,
      fuelType: values.fuelType,
      imageLinks: values.imageLinks,
      featuresArray: featuresArray,
      terms: values.terms,
      blueBookUrl: values.blueBookUrl,
    };

    console.log("Submitting Payload:", payload);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/car/upload-car",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Add Content-Type header
          },
        }
      );

      if (response.status === 201) {
        toast.success("Your car has been uploaded successfully");
        setShow(false); // Close modal on success
        setRefresh((prev) => !prev); // Trigger data refresh
      } else {
        // Use response data for more specific error message if available
        toast.error(response.data?.message || "Error Uploading Car");
      }
    } catch (err) {
      console.error("Upload Error:", err);
      // Provide more specific feedback based on error response
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred.";
      toast.error(`Upload failed: ${errorMessage}`);
    }
  };

  return (
    <Formik
      validationSchema={schema}
      onSubmit={handleSubmit}
      initialValues={{
        carName: "",
        company: "",
        makeYear: "",
        type: "",
        seatCapacity: "",
        carPlateNumber: "",
        pricePerDay: "",
        mileage: "",
        km: "",
        transmission: "",
        fuelType: "",
        imageLinks: [], // Initialize imageLinks as an empty array (matching schema/DB)
        bluebookUrl: "",
        terms: false,
        air_conditioning: false,
        gps_navigation: false,
        bluetooth_audio: false,
        heated_seats: false,
        sunroof: false,
        all_wheel_drive: false,
      }}
      validateOnChange={true} // Enable onChange validation
      validateOnBlur={true} // Enable onBlur validation
    >
      {({
        handleSubmit,
        handleChange,
        values,
        touched,
        errors,
        setFieldValue,
      }) => {
        // Helper function to add a URL
        const handleAddImageUrl = () => {
          const trimmedUrl = currentImageUrl.trim();
          if (trimmedUrl && !values.imageLinks.includes(trimmedUrl)) {
            if (
              !trimmedUrl.startsWith("http://") &&
              !trimmedUrl.startsWith("https://")
            ) {
              toast.warn(
                "Please enter a valid URL starting with http:// or https://"
              );
              return;
            }

            if (values.imageLinks.length < MAX_IMAGE_LINKS) {
              // Use setFieldValue to update Formik's state for 'imageLinks'
              setFieldValue("imageLinks", [...values.imageLinks, trimmedUrl]);
              setCurrentImageUrl(""); // Clear the input field
            } else {
              toast.warn(`Maximum ${MAX_IMAGE_LINKS} photo links allowed.`);
            }
          } else if (values.imageLinks.includes(trimmedUrl)) {
            toast.warn("This URL has already been added.");
          } else if (!trimmedUrl) {
            toast.warn("Please enter a URL.");
          }
        };

        // Helper function to remove a URL
        const handleRemoveImageUrl = (index) => {
          const updatedUrls = values.imageLinks.filter((_, i) => i !== index);
          setFieldValue("imageLinks", updatedUrls);
        };

        return (
          <Form noValidate className="m-3" onSubmit={handleSubmit}>
            <Row className="mb-3 g-3">
              <Form.Group as={Col} md="6" controlId="validationFormikCarName">
                <Form.Label>Car Name</Form.Label>
                <Form.Control
                  type="text"
                  name="carName"
                  value={values.carName}
                  onChange={handleChange}
                  isValid={touched.carName && !errors.carName}
                  isInvalid={touched.carName && !!errors.carName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.carName}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group
                as={Col}
                md="6"
                controlId="validationFormikCompanyName"
              >
                <Form.Label>Company</Form.Label>
                <Form.Select
                  name="company"
                  value={values.company}
                  onChange={handleChange}
                  isValid={touched.company && !errors.company}
                  isInvalid={touched.company && !!errors.company}
                >
                  <option value=""> Select company</option>

                  <option value="Tata">Tata</option>
                  <option value="Mahindra">Mahindra</option>
                  <option value="Maruti Suzuki">Maruti Suzuki</option>
                  <option value="Hyundai">Hyundai</option>
                  <option value="Kia">Kia</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Honda">Honda</option>
                  <option value="Nissan">Nissan</option>
                  <option value="Renault">Renault</option>
                  <option value="Volkswagen">Volkswagen</option>
                  <option value="Skoda">Skoda</option>
                  <option value="Ford">Ford</option>
                  <option value="Chevrolet">Chevrolet</option>
                  <option value="Peugeot">Peugeot</option>
                  <option value="Mitsubishi">Mitsubishi</option>
                  <option value="Mazda">Mazda</option>
                  <option value="Subaru">Subaru</option>
                  <option value="Suzuki">Suzuki</option>
                  <option value="Daewoo">Daewoo</option>
                  <option value="Datsun">Datsun</option>
                  <option value="Citroën">Citroën</option>
                  <option value="Opel">Opel</option>
                  <option value="Geely">Geely</option>
                  <option value="Chery">Chery</option>
                  <option value="BMW">BMW</option>
                  <option value="Mercedes-Benz">Mercedes-Benz</option>
                  <option value="Audi">Audi</option>
                  <option value="Jaguar">Jaguar</option>
                  <option value="Land Rover">Land Rover</option>
                  <option value="Volvo">Volvo</option>
                  <option value="Lexus">Lexus</option>
                  <option value="Porsche">Porsche</option>
                  <option value="Infiniti">Infiniti</option>
                  <option value="Genesis">Genesis</option>
                  <option value="Mini">Mini</option>
                  <option value="Acura">Acura</option>
                  <option value="Cadillac">Cadillac</option>
                  <option value="Lincoln">Lincoln</option>
                  <option value="Tesla">Tesla</option>
                  <option value="BYD">BYD</option>
                  <option value="MG">MG</option>
                  <option value="Ola Electric">Ola Electric</option>
                  <option value="Ather">Ather</option>
                  <option value="Rivian">Rivian</option>
                  <option value="Lucid Motors">Lucid Motors</option>
                  <option value="Polestar">Polestar</option>
                  <option value="NIO">NIO</option>
                  <option value="Jeep">Jeep</option>
                  <option value="Isuzu">Isuzu</option>
                  <option value="Hummer">Hummer</option>
                  <option value="Ram">Ram</option>
                  <option value="Great Wall Motors">Great Wall Motors</option>
                  <option value="Ferrari">Ferrari</option>
                  <option value="Lamborghini">Lamborghini</option>
                  <option value="McLaren">McLaren</option>
                  <option value="Aston Martin">Aston Martin</option>
                  <option value="Bentley">Bentley</option>
                  <option value="Rolls-Royce">Rolls-Royce</option>
                  <option value="Bugatti">Bugatti</option>
                  <option value="Koenigsegg">Koenigsegg</option>
                  <option value="Pagani">Pagani</option>
                  <option value="Maserati">Maserati</option>
                  <option value="Ashok Leyland">Ashok Leyland</option>
                  <option value="Piaggio">Piaggio</option>
                  <option value="TAM">TAM</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.company}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md="6" controlId="validationFormikMakeYear">
                <Form.Label>Make Year</Form.Label>
                <Form.Control
                  type="number" // Use type number
                  placeholder="e.g., 2023"
                  name="makeYear"
                  value={values.makeYear}
                  onChange={handleChange}
                  isValid={touched.makeYear && !errors.makeYear}
                  isInvalid={touched.makeYear && !!errors.makeYear}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.makeYear}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md="6" controlId="validationFormikType">
                <Form.Label>Type</Form.Label>
                <Form.Select
                  name="type"
                  value={values.type}
                  onChange={handleChange}
                  isValid={touched.type && !errors.type}
                  isInvalid={touched.type && !!errors.type}
                >
                  <option value="">Select Type</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="SUV">SUV</option>
                  <option value="Crossover">Crossover</option>
                  <option value="Pick Up">Pick Up</option>
                  <option value="Coupe">Coupe</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.type}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group
                as={Col}
                md="6"
                controlId="validationFormikTransmission"
              >
                <Form.Label>Transmission</Form.Label>
                <Form.Select
                  name="transmission"
                  value={values.transmission}
                  onChange={handleChange}
                  isValid={touched.transmission && !errors.transmission}
                  isInvalid={touched.transmission && !!errors.transmission}
                >
                  <option value="">Select Transmission</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.transmission}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            {/* --- More Car Detail Fields (Add validation feedback) --- */}
            <Row className="mb-3 g-3">
              <Form.Group
                as={Col}
                md="4"
                controlId="validationFormikSeatCapacity"
              >
                <Form.Label>Seat capacity</Form.Label>
                <Form.Control
                  type="number"
                  name="seatCapacity"
                  value={values.seatCapacity}
                  onChange={handleChange}
                  isValid={touched.seatCapacity && !errors.seatCapacity}
                  isInvalid={touched.seatCapacity && !!errors.seatCapacity}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.seatCapacity}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group
                as={Col}
                md="4"
                controlId="validationFormikCarPlateNumber"
              >
                <Form.Label>Car plate number</Form.Label>
                <Form.Control
                  type="text"
                  name="carPlateNumber"
                  value={values.carPlateNumber}
                  onChange={handleChange}
                  isValid={touched.carPlateNumber && !errors.carPlateNumber}
                  isInvalid={touched.carPlateNumber && !!errors.carPlateNumber}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.carPlateNumber}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group
                as={Col}
                md="4"
                controlId="validationFormikPricePerDay"
              >
                <Form.Label>Price per day </Form.Label>
                <Form.Control
                  type="number"
                  name="pricePerDay"
                  value={values.pricePerDay}
                  onChange={handleChange}
                  isValid={touched.pricePerDay && !errors.pricePerDay}
                  isInvalid={touched.pricePerDay && !!errors.pricePerDay}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.pricePerDay}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validationFormikMileage">
                <Form.Label>Mileage (e.g., km/l)</Form.Label>
                <Form.Control
                  type="number"
                  name="mileage"
                  value={values.mileage}
                  onChange={handleChange}
                  isValid={touched.mileage && !errors.mileage}
                  isInvalid={touched.mileage && !!errors.mileage}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.mileage}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validationFormikKm">
                <Form.Label>Current km (Odometer)</Form.Label>
                <Form.Control
                  type="number"
                  name="km"
                  value={values.km}
                  onChange={handleChange}
                  isValid={touched.km && !errors.km}
                  isInvalid={touched.km && !!errors.km}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.km}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validationFormikFuelType">
                <Form.Label>Fuel type</Form.Label>
                <Form.Select
                  name="fuelType"
                  value={values.fuelType}
                  onChange={handleChange}
                  isValid={touched.fuelType && !errors.fuelType}
                  isInvalid={touched.fuelType && !!errors.fuelType}
                >
                  <option value=""> Select Fuel type </option>
                  <option value="Petrol"> Petrol </option>
                  <option value="Diesel"> Diesel </option>
                  <option value="EV"> EV </option>
                  <option value="Hybrid"> Hybrid </option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.fuelType}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            {/* --- Image URL Input Section --- */}
            <Form.Group
              as={Col}
              md="12"
              className="position-relative mb-3"
              controlId="validationFormikImageLinks"
            >
              <Form.Label>
                Car Photo Links | Min - {MIN_IMAGE_LINKS} | Max -{" "}
                {MAX_IMAGE_LINKS} |
              </Form.Label>
              <InputGroup className="mb-2">
                <Form.Control
                  type="text"
                  placeholder="Paste image URL here (e.g., https://.../image.jpg)"
                  value={currentImageUrl}
                  onChange={(e) => setCurrentImageUrl(e.target.value)}
                  // Only mark the input itself invalid if the *whole array* has an error (min/max/required)
                  // Individual URL validity is checked by Yup but doesn't invalidate this specific input
                  isInvalid={
                    touched.imageLinks &&
                    !!errors.imageLinks &&
                    typeof errors.imageLinks === "string"
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault(); // Prevent form submission
                      handleAddImageUrl();
                    }
                  }}
                />
                <Button variant="outline-secondary" onClick={handleAddImageUrl}>
                  Add Link
                </Button>
                {/* Display array-level errors below the Input Group */}
                <Form.Control.Feedback type="invalid" className="d-block">
                  {/* Show array error only if touched and it's a string (like min/max message) */}
                  {touched.imageLinks && typeof errors.imageLinks === "string"
                    ? errors.imageLinks
                    : null}
                </Form.Control.Feedback>
              </InputGroup>
              <Form.Text className="text-muted">
                Enter the full web address (URL) for each image. Ensure links
                point to publicly accessible images (jpg, png, webp, etc.).
                <br />
                Car photos must clearly display a valid number plate.
              </Form.Text>

              {/* Display Added URLs and Previews */}
              {values.imageLinks.length > 0 && (
                <ListGroup variant="flush" className="mt-2 mb-3 border rounded">
                  {values.imageLinks.map((url, index) => (
                    <ListGroup.Item
                      key={index}
                      className="d-flex justify-content-between align-items-center flex-wrap"
                    >
                      <div
                        className="d-flex align-items-center me-2"
                        style={{ minWidth: "200px", flex: 1 }}
                      >
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          style={{
                            width: "60px",
                            height: "40px",
                            objectFit: "cover",
                            marginRight: "10px",
                            border: "1px solid #eee",
                          }}
                          // Handle broken image links gracefully
                          onError={(e) => {
                            e.target.onerror = null; // prevent infinite loop if placeholder fails
                            e.target.src =
                              "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2260%22%20height%3D%2240%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2060%2040%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15ec911398e%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A10pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15ec911398e%22%3E%3Crect%20width%3D%2260%22%20height%3D%2240%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2210.5%22%20y%3D%2224.8%22%3EError%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"; // Basic placeholder
                            e.target.alt = "Image load error";
                          }}
                        />
                        <span
                          style={{ wordBreak: "break-all", fontSize: "0.9em" }}
                        >
                          {url}
                        </span>
                      </div>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleRemoveImageUrl(index)}
                        className="mt-1 mt-md-0" // Add margin top on small screens
                      >
                        Remove
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}

              {touched.imageLinks &&
                typeof errors.imageLinks === "object" &&
                Array.isArray(errors.imageLinks) && (
                  <div className="invalid-feedback d-block mt-1">
                    {errors.imageLinks.map((error, index) =>
                      error ? (
                        <div key={index}>
                          Link {index + 1}: {error}
                        </div>
                      ) : null
                    )}
                  </div>
                )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Bluebook URL</Form.Label>
              <Form.Control
                type="url"
                name="blueBookUrl"
                placeholder="https://example.com/bluebook.pdf"
                value={values.blueBookUrl}
                onChange={handleChange}
                isInvalid={touched.blueBookUrl && !!errors.bluebookUrl}
              />
              <Form.Control.Feedback type="invalid">
                {errors.bluebookUrl}
              </Form.Control.Feedback>
            </Form.Group>
            <hr />
            <h3>Features</h3>
            <Row className="mb-3">
              {carFeatures.map((feature) => (
                <Col lg="4" md="6" sm={6} key={feature.id} className="mb-2">
                  <Form.Check
                    type="checkbox"
                    id={`feature-${feature.name}`} // Unique id
                    label={feature.feature}
                    name={feature.name}
                    checked={values[feature.name]} // Control checked state
                    onChange={handleChange}
                    // No need for isInvalid here usually
                  />
                </Col>
              ))}
            </Row>
            <hr />
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label={
                  <>
                    I agree to the{" "}
                    <span
                      style={{ color: "blue", cursor: "pointer" }}
                      onClick={() => setShowTermsModal(true)}
                    >
                      terms and conditions
                    </span>
                  </>
                }
                name="terms"
                checked={values.terms}
                onChange={handleChange}
                isInvalid={touched.terms && !!errors.terms}
              />
              <Form.Control.Feedback type="invalid">
                {errors.terms}
              </Form.Control.Feedback>
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
              Upload Car Details
            </Button>
            <Modal
              show={showTermsModal}
              onHide={() => setShowTermsModal(false)}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Terms and Conditions</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Terms and conditions content goes here.</p>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowTermsModal(false)}
                >
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </Form>
        );
      }}
    </Formik>
  );
};

export default UploadCar;
