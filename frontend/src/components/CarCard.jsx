import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import "../styles/carCard.css";
import { useNavigate } from "react-router-dom";

const CarCard = ({ carId, title, fuel, transmission, price, imgLink }) => {
  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate(`/car/${carId}`);
  };
  return (
    <div style={{ width: "290px", flexShrink: 0 }}>
      <Card
        className="bg-light text-black w-100 car-card"
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      >
        <Card.Img variant="top" src={imgLink} alt={title} />
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              <li>
                <span style={{ fontWeight: 500 }}>Fuel</span> - {fuel}
              </li>
              <li>
                <span style={{ fontWeight: 500 }}>Transmission</span> -{" "}
                {transmission}
              </li>
            </ul>
          </div>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-between align-items-center">
          <small className="text-dark">{price}</small>
          <Button
            variant="outline-dark"
            onClick={(e) => {
              e.stopPropagation();
              handleClick(car);
            }}
          >
            Book Now
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default CarCard;
