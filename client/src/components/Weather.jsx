import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Col,
  Row,
  Spinner,
  InputGroup,
  FormControl,
  Table,
  Button,
  ListGroup,
  ListGroupItem,
  Card,
} from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { COUNTRIES, GET_WEATHER_DATA } from '../services/queries';

const Weather = ({ me, client }) => {
  const [val, setVal] = useState('');
  const [forecast, setForecast] = useState(null);
  const { data, loading, error } = useQuery(COUNTRIES);
  const weatherData = useMutation(GET_WEATHER_DATA);

  useEffect(() => window.scrollTo(0, 0), []);

  const getCountryData = async (capital, country) => {
    try {
      const data = await weatherData({
        variables: {
          capital,
        },
      });
      setForecast({
        country,
        weather: JSON.parse(data.data.getWeatherData.value),
      });
      console.log('forecast data', {
        country,
        weather: JSON.parse(data.data.getWeatherData.value),
      });
    } catch (error) {
      setForecast(null);
      console.log(error.message);
    }
  };

  if (!me) return null;

  if (loading)
    return (
      <Container style={{ minHeight: '100vh' }}>
        <Row>
          <Col
            className="d-flex"
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: '100vh',
            }}
          >
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </Col>
        </Row>
      </Container>
    );

  if (error) {
    console.log(error);
    return <div>{error.message}</div>;
  }

  if (!loading) {
    console.log('Country data', data);
  }

  return (
    <>
      <div
        className="container-fluid p-4 mt-4 mb-4"
        style={{ minHeight: '100vh' }}
      >
        <h2>Weather</h2>
        <InputGroup style={{ paddingBottom: '25px' }}>
          <InputGroup.Prepend>
            <InputGroup.Text id="basic-addon1">Filter</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            placeholder="Country"
            aria-label="Country"
            aria-describedby="basic-addon1"
            value={val}
            onChange={event => setVal(event.target.value)}
          />
        </InputGroup>
        <Row>
          <Col
            md={3}
            xs={12}
            className="mr-2 mb-0 mt-1"
            style={{
              overflow: 'auto',
              fontSize: '0.75rem',
              maxHeight: '40vh',
            }}
          >
            <Table className="mt-4" striped>
              <thead>
                <tr>
                  <th>Country</th>
                </tr>
              </thead>
              <tbody>
                {!loading &&
                  data.getCountries
                    .filter(country =>
                      country.name.toLowerCase().includes(val.toLowerCase())
                    )
                    .map(c => (
                      <tr key={`${c.name}`}>
                        <td>
                          <Button
                            href="#"
                            role="button"
                            onClick={() => getCountryData(c.capital, c.name)}
                            variant="link"
                          >
                            {c.name}
                          </Button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </Table>
          </Col>
          <Col style={{ textAlign: 'center' }} sm={12} xs={12} md={8}>
            {forecast !== null && (
              <div
                className="pt-2 mt-0"
                style={{ width: '100%', border: '1px black solid' }}
              >
                <h3 className="mt-3">{forecast.country}</h3>
                <p>
                  <strong>Capital:</strong> {forecast.weather.location.name}
                </p>
                <Row className="pb-3">
                  {forecast.weather.forecast.forecastday.map(day => {
                    let date = new Date(day.date_epoch * 1000);
                    console.log('date_olio', date.toDateString());
                    return (
                      <Col
                        sm={3}
                        xs={12}
                        key={`${day.date}`}
                        className="mr-auto ml-auto pl-auto pr-auto mb-2 pb-auto"
                        style={{ maxWidth: '20rem' }}
                      >
                        <Card
                          bg="secondary"
                          style={{
                            width: '100%',
                            height: '25rem',
                            position: 'relative',
                          }}
                          className="text-center"
                        >
                          <Card.Img
                            variant="top"
                            src={day.day.condition.icon}
                            alt={day.day.condition.text}
                            title={day.day.condition.text}
                          />
                          <Card.Body>
                            <Card.Title>{`${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`}</Card.Title>
                            <Card.Text>{`${day.day.condition.text}`}</Card.Text>
                          </Card.Body>
                          <ListGroup
                            className="list-group-flush"
                            style={{ fontSize: '0.75rem' }}
                          >
                            <ListGroupItem>
                              Max temp: {day.day.maxtemp_c}
                            </ListGroupItem>
                            <ListGroupItem>
                              Min temp: {day.day.mintemp_c}
                            </ListGroupItem>
                            <ListGroupItem>
                              Avg temp: {day.day.avgtemp_c}
                            </ListGroupItem>
                          </ListGroup>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              </div>
            )}
          </Col>
        </Row>
      </div>
    </>
  );
};

Weather.propTypes = {
  me: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  client: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
};

Weather.defaultProps = {
  me: undefined,
};

export default Weather;
