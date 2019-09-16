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
import translate from '../util/localization/i18n';

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
          <h1>{translate('mainpage_nolog_h1')}</h1>
          <p>{translate('mainpage_nolog_p')}</p>
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
          <p>{translate('sc_c2_header')}</p>
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
            <h5>{translate('mainpage_h5')}</h5>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col
            className="d-flex mb-3"
            style={{ alignItems: 'center', justifyContent: 'center' }}
          >
            <ul>
              <li>{translate('mainpage_li1')}</li>
              <li>{translate('mainpage_li2')}</li>
              <li>{translate('mainpage_li3')}</li>
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
                  alt={translate('slide1')}
                  style={{
                    objectFit: 'cover',
                    height: '15rem',
                  }}
                />
                <Carousel.Caption>
                  <h3>{translate('mainpage_carousel1_h3')}</h3>
                  <p>{translate('mainpage_carousel1_p')}</p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <Image
                  className="d-block w-100"
                  src={nasa}
                  alt={translate('slide2')}
                  style={{ objectFit: 'cover', height: '15rem' }}
                />
                <Carousel.Caption>
                  <h3>{translate('mainpage_carousel2_h3')}</h3>
                  <p>{translate('mainpage_carousel2_p')}</p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <Image
                  className="d-block w-100"
                  src={weather}
                  alt={translate('slide3')}
                  style={{ objectFit: 'cover', height: '15rem' }}
                />
                <Carousel.Caption>
                  <h3>{translate('mainpage_carousel3_h3')}</h3>
                  <p>{translate('mainpage_carousel3_p')}</p>
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
