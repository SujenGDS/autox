import Row from "react-bootstrap/esm/Row";
import UploadCar from "../components/UploadCar";
import Col from "react-bootstrap/esm/Col";

const UploadCarPage = () => {
  return (
    <Row>
      <Col xs={3}>
        <UploadCar />
      </Col>
    </Row>
  );
};

export default UploadCarPage;
