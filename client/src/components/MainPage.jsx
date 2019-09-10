import React, { useState, useEffect } from 'react';
import {
  Col,
  Row,
  Container,
  Jumbotron,
  Carousel,
  Image,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import nasa from '../util/img/nasa.jpg';
import impress from '../util/img/impress2.jpg';
import weather from '../util/img/weather.jpg';

const MainPage = ({ me }) => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(null);

  useEffect(() => window.scrollTo(0, 0), []);

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

  if (!me) {
    return (
      <div className="container text-center" style={{ minHeight: '100vh' }}>
        <Jumbotron className="pb-0 mb-0">
          <h1>Hey there! ;)</h1>
          <p>Please log in to gain access to the services.</p>
        </Jumbotron>
        <div
          className="rounded-circle"
          style={{
            backgroundColor: 'black',
            height: '10px',
            width: '10px',
            marginLeft: '50%',
            marginBottom: '30px',
            marginTop: '50px',
          }}
        />
        <div
          className="rounded-circle"
          style={{
            backgroundColor: 'black',
            height: '10px',
            width: '10px',
            marginLeft: '50%',
            marginBottom: '30px',
          }}
        />
        <div
          className="rounded-circle"
          style={{
            backgroundColor: 'black',
            height: '10px',
            width: '10px',
            marginLeft: '50%',
            marginBottom: '50px',
          }}
        />
        <div>
          <p>SpaceX API</p>
          <p>Weather App</p>
          <p>Chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Container className="mt-3 p-4 fluid" style={{ marginBottom: '50px' }}>
        <Row>
          <Col
            className="p-3"
            style={{ marginBottom: '40px', borderBottom: '1px solid #bcceeb' }}
          >
            <h2>App Mashup!</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <h5>
              Ever wanted one place with all the necessary tools to socialize,
              be informed about weather and get knowledge about SpaceX missions?
              Look no further!
            </h5>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col
            className="d-flex mb-3"
            style={{ alignItems: 'center', justifyContent: 'center' }}
          >
            <ul>
              <li>Socialize using the chat app.</li>
              <li>Check out the weather forecast. World wide.</li>
              <li>Space X -missions. The past and the future.</li>
            </ul>
          </Col>
          <Col lg={6}>
            <Carousel
              activeIndex={index}
              direction={direction}
              onSelect={handleSelect}
            >
              <Carousel.Item>
                <Image
                  className="d-block w-100"
                  src={impress}
                  alt="First slide"
                  style={{
                    objectFit: 'cover',
                    height: '15rem',
                  }}
                />
                <Carousel.Caption>
                  <h3>Chat like no tomorrow.</h3>
                  <p>Limited to people on your friendlist.</p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <Image
                  className="d-block w-100"
                  src={nasa}
                  alt="Second slide"
                  style={{ objectFit: 'cover', height: '15rem' }}
                />
                <Carousel.Caption>
                  <h3>SPACE X -missions</h3>
                  <p>List of upcoming flights.</p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <Image
                  className="d-block w-100"
                  src={weather}
                  alt="Third slide"
                  style={{ objectFit: 'cover', height: '15rem' }}
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
};

MainPage.defaultProps = {
  me: undefined,
};

export default MainPage;
