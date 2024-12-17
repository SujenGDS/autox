import Card from "react-bootstrap/Card";
import CardGroup from "react-bootstrap/CardGroup";
import "../styles/carCard.css";
import Button from "react-bootstrap/esm/Button";

const CarCard = ({ title, description, price, imgLink }) => {
  return (
    <div style={{ width: "285px" }}>
      <Card className="bg-light text-black w-100 car-card">
        <Card.Img variant="top" src={imgLink} />
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Text>{description}</Card.Text>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-between align-items-center">
          <small className="text-dark">{price}</small>
          <Button variant="outline-dark">Book Now</Button>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default CarCard;
