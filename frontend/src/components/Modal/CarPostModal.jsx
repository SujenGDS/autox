import Modal from "react-bootstrap/Modal";
import UploadCar from "../UploadCar";

const CarPostModal = ({ show, setShow, setRefresh }) => {
  return (
    <Modal show={show} onHide={() => setShow(false)} size="lg" centered>
      <Modal.Header
        style={{ backgroundColor: "black", color: "white" }}
        closeButton
        closeVariant="white"
      >
        <Modal.Title>Rent Your Car</Modal.Title>
        <btn-close>
          <style></style>
        </btn-close>
      </Modal.Header>

      <Modal.Body
        style={{
          height: "75vh",
          overflowY: "auto",
        }}
      >
        <UploadCar setShow={setShow} setRefresh={setRefresh} />
      </Modal.Body>
    </Modal>
  );
};

export default CarPostModal;
