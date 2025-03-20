import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookNowModal = ({
  showModal,
  setShowModal,
  price,
  title,
  carId,
  setRefresh,
}) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pickUpLocation, setPickUpLocation] = useState("");
  const [dropOffLocation, setDropOffLocation] = useState("");
  const [isRideShareEnabled, setisRideShareEnabled] = useState(false);
  const [rideSharePrice, setRideSharePrice] = useState("");
  const [rideShareDestination, setRideShareDestination] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [agreeToRideShareTerms, setAgreeToRideShareTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsType, setTermsType] = useState(""); // "general" or "rideShare"

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!startDate || !endDate || !pickUpLocation || !dropOffLocation) {
      toast.error("Please fill in all the fields");
      return;
    }

    if (!agreeToTerms) {
      toast.error("You must agree to the terms and conditions");
      return;
    }

    if (isRideShareEnabled && (!rideSharePrice || !rideShareDestination)) {
      toast.error("Please enter ride share details");
      return;
    }

    if (isRideShareEnabled && !agreeToRideShareTerms) {
      toast.error("You must agree to the ride share terms and conditions");
      return;
    }

    try {
      const payload = {
        carId: carId,
        startDate: startDate,
        endDate: endDate,
        pickUpLocation: pickUpLocation,
        dropOffLocation: dropOffLocation,
        isRideShareEnabled: isRideShareEnabled,
        ...(isRideShareEnabled && {
          rideSharePrice: rideSharePrice,
          rideShareDestination: rideShareDestination,
        }),
      };

      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3000/booking/book", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Car booked successfully");
      setRefresh((prev) => !prev);
      setShowModal(false);
    } catch (err) {
      if (err.response) {
        toast.error(
          err.response.data.message || "Something went wrong. Please try again."
        );
      } else {
        toast.error("Network error. Please check your connection.");
      }
    }
  };

  return (
    <>
      {/* Booking Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Book {title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit} method="POST">
            <Form.Group className="mb-3">
              <Form.Label>Pick-up Date</Form.Label>
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Drop-off Date</Form.Label>
              <Form.Control
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Pick up location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter location"
                value={pickUpLocation}
                onChange={(e) => setPickUpLocation(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Drop off location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter location"
                value={dropOffLocation}
                onChange={(e) => setDropOffLocation(e.target.value)}
              />
            </Form.Group>

            {/* Enable Ride Share Checkbox */}
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Enable Ride Share"
                checked={isRideShareEnabled}
                onChange={(e) => setisRideShareEnabled(e.target.checked)}
              />
            </Form.Group>

            {/* Ride Share Form */}
            {isRideShareEnabled && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Ride Share Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter ride share price"
                    value={rideSharePrice}
                    onChange={(e) => setRideSharePrice(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Destination Location</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter destination"
                    value={rideShareDestination}
                    onChange={(e) => setRideShareDestination(e.target.value)}
                  />
                </Form.Group>

                {/* Ride Share Terms and Conditions */}
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label={
                      <>
                        I agree to the{" "}
                        <span
                          style={{ color: "blue", cursor: "pointer" }}
                          onClick={() => {
                            setTermsType("rideShare");
                            setShowTermsModal(true);
                          }}
                        >
                          ride share terms and conditions
                        </span>
                      </>
                    }
                    checked={agreeToRideShareTerms}
                    onChange={(e) => setAgreeToRideShareTerms(e.target.checked)}
                  />
                </Form.Group>
              </>
            )}

            {/* General Terms and Conditions */}
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label={
                  <>
                    I agree to the{" "}
                    <span
                      style={{ color: "blue", cursor: "pointer" }}
                      onClick={() => {
                        setTermsType("general");
                        setShowTermsModal(true);
                      }}
                    >
                      terms and conditions
                    </span>
                  </>
                }
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
              />
            </Form.Group>

            <Button variant="outline-dark" type="submit" className="w-100">
              Proceed to Payment
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <div>Total: {price}</div>
          <div>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Terms and Conditions Modal */}
      <Modal
        show={showTermsModal}
        onHide={() => setShowTermsModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {termsType === "rideShare"
              ? "Ride Share Terms & Conditions"
              : "Terms & Conditions"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            {termsType === "rideShare"
              ? "Ride share users must comply with local laws. Pricing is non-refundable once booked."
              : "By booking this car, you agree to follow all rental rules, including liability for damages."}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTermsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BookNowModal;
