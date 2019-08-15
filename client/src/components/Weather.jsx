import React, { useState, useEffect } from 'react';
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
import axios from 'axios';
import { useQuery, useMutation } from 'react-apollo-hooks';
import { COUNTRIES, GET_WEATHER_DATA } from '../services/queries';

const Weather = ({ me, client }) => {
  const [page, setPage] = useState('');
  const [val, setVal] = useState('');
  const [forecast, setForecast] = useState(null);
  const [mockCountries, setMockCountries] = useState([]);
  const { data, loading, error } = useQuery(COUNTRIES);
  const weatherData = useMutation(GET_WEATHER_DATA);

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
      <Container>
        <Row>
          <Col
            style={{
              textAlign: 'center',
              marginTop: '50%',
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
      {page === '' && (
        <div className="container pb-4">
          <h2>Weather</h2>
          <InputGroup className="mb-2">
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
              sm={12}
              md={3}
              xs={12}
              className="mr-2 mb-3 mt-1"
              style={{
                overflow: 'auto',
                fontSize: '0.75rem',
                maxHeight: '50vh',
              }}
            >
              <Table className="mt-4">
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
                      .map((c, i) => (
                        <tr key={`${c.name}-${i}`}>
                          <td>
                            <a
                              href="#"
                              role="button"
                              onClick={event =>
                                getCountryData(c.capital, c.name)
                              }
                            >
                              {c.name}
                            </a>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </Table>
            </Col>
            <Col style={{ textAlign: 'center' }} sm={12} xs={12} md={true}>
              <Container>
                {forecast !== null && (
                  <div className="pt-1 mt-2">
                    <h3>{forecast.country}</h3>
                    <p>
                      <strong>Capital:</strong> {forecast.weather.location.name}
                    </p>
                    <Row>
                      {forecast.weather.forecast.forecastday.map(day => {
                        let date = new Date(day.date_epoch * 1000);
                        console.log('date_olio', date.toDateString());
                        return (
                          <Col
                            key={`${day.date}`}
                            className="mr-auto ml-auto pl-auto pr-auto mb-2 pb-auto"
                            style={{ maxWidth: '15rem' }}
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
              </Container>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
};

export default Weather;
