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

const Weather = ({ me }) => {
  const [val, setVal] = useState('');
  const [forecast, setForecast] = useState(null);
  const { data, loading, error } = useQuery(COUNTRIES);
  const [weatherData] = useMutation(GET_WEATHER_DATA);

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
    } catch (error) {
      setForecast(null);
    }
  };

  if (!me)
    return (
      <div style={{ minHeight: '100vh' }}>
        <div>Log in to use the weather app!</div>
      </div>
    );

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
    return <div>{error.message}</div>;
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
            className="rounded pl-0 pr-0"
            style={{
              overflow: 'auto',
              fontSize: '0.75rem',
              maxHeight: '60vh',
              border: '1px solid rgb(188, 206, 235)',
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
          <Col
            style={{ textAlign: 'center' }}
            sm={12}
            xs={12}
            md={8}
            className="mt-4"
          >
            {forecast !== null && (
              <div
                style={{
                  width: '100%',
                  border: '1px rgb(188, 206, 235) solid',
                }}
                className="rounded"
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
                          bg="info"
                          style={{
                            width: '100%',
                            height: '25rem',
                            position: 'relative',
                          }}
                          className="text-center"
                        >
                          <Card.Header as="h5" style={{ color: 'white' }}>
                            {date.toDateString().substring(0, 3)}
                          </Card.Header>
                          <Card.Img
                            variant="top"
                            src={day.day.condition.icon}
                            alt={day.day.condition.text}
                            title={day.day.condition.text}
                          />
                          <Card.Body style={{ color: 'white' }}>
                            <Card.Title>{`${date.getDate()}.${date.getMonth() +
                              1}.${date.getFullYear()}`}</Card.Title>
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
