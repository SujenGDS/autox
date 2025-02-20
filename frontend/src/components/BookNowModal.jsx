import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

const BookNowModal = ({ showModal, setShowModal, price, title }) => {
  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Book {title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Pick-up Date</Form.Label>
            <Form.Control type="date" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Drop-off Date</Form.Label>
            <Form.Control type="date" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Pick up location</Form.Label>
            <Form.Control type="text" placeholder="Enter location" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Drop off location</Form.Label>
            <Form.Control type="text" placeholder="Enter location" />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        <div>Total: {price}</div>
        <div>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="outline-dark" className="ms-2">
            Proceed to Payment
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default BookNowModal;
