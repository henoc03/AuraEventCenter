import Carousel from 'react-bootstrap/Carousel';
import salaLiberia from "../../assets/images/salas/sala1.png"
import salaCahuita from "../../assets/images/salas/sala2.png"
import salaGrecia from "../../assets/images/salas/sala3.png"


function CarouselFadeExample() {
  return (
    <div className="carousel-container">
      <Carousel fade interval={3000} indicators={false} controls={false}>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={salaLiberia}
            alt="Sala Liberia"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={salaCahuita}
            alt="Sala Cahuita"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={salaGrecia}
            alt="Sala Grecia"
          />
        </Carousel.Item>
      </Carousel>
    </div>
  );
}

export default CarouselFadeExample;
