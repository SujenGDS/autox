import Modal from "react-bootstrap/Modal";
import UploadCar from "../UploadCar";

const CarPostModal = ({ show, setShow }) => {
  return (
    <Modal show={show} onHide={() => setShow(false)} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Rent Your Car</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          height: "65vh",
          overflowY: "auto",
        }}
      >
        <UploadCar setShow={setShow} />
      </Modal.Body>
    </Modal>
  );
};

export default CarPostModal;
