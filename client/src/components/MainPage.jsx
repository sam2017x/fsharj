import React, { useState } from 'react';
import { Col, Row, Container, Jumbotron, Carousel } from 'react-bootstrap';
import PropTypes from 'prop-types';
import nasa from '../util/img/nasa.jpg';
import impress from '../util/img/impress2.jpg';
import weather from '../util/img/weather.jpg';
import bg from '../util/img/bg.jpg';

const MainPage = ({ me, client }) => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(null);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
    setDirection(e.direction);
  };

  /*

  Image spreading example:

  <div
      style={{
        backgroundImage: `url(${bg})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
      }}
      className="mb-4"
    >

    */

  if (!bg) return <div>Loading....</div>;

  if (!me) {
    return (
      <div className="container-fluid">
        <Jumbotron>
          <h1>Hey there! ;)</h1>
          <p>
            Welcome to Chatterinos. Please log in to see the service selection.
          </p>
        </Jumbotron>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <Container className="mt-0 pb-4">
        <Row className="mt-4">
          <Col>
            <h4>
              Ever wanted one place with all the necessary tools to socialize,
              check the weather and get knowledge about SpaceX missions? Look no
              further!
            </h4>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <ul>
              <li>Impress others and socialize using the FiveMSG tool!</li>
              <li>Check the weatherforecast. World wide.</li>
              <li>Upcoming NASA flights in order.</li>
            </ul>
          </Col>
          <Col md={12} lg={6}>
            <Carousel
              activeIndex={index}
              direction={direction}
              onSelect={handleSelect}
            >
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src={impress}
                  alt="First slide"
                  style={{
                    objectFit: 'cover',
                    maxHeight: '295px',
                  }}
                />
                <Carousel.Caption>
                  <h3>Impress others</h3>
                  <p>You are given five chances to socialize, good luck!</p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src={nasa}
                  alt="Second slide"
                  style={{ objectFit: 'cover', maxHeight: '295px' }}
                />
                <Carousel.Caption>
                  <h3>SPACE X -missions</h3>
                  <p>List of upcoming flights.</p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src={weather}
                  alt="Third slide"
                  style={{ objectFit: 'cover', maxHeight: '295px' }}
                />
                <Carousel.Caption>
                  <h3>Weather forecast</h3>
                  <p>Make plans with precision.</p>
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

MainPage.propTypes = {
  me: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  client: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
};

MainPage.defaultProps = {
  me: undefined,
};

export default MainPage;
