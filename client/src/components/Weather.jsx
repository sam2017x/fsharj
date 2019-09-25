import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Col,
  Row,
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
import translate from '../util/localization/i18n';
import LoadingIcon from './LoadingIcon';

const Weather = ({ me }) => {
  const [val, setVal] = useState('');
  const [forecast, setForecast] = useState(null);
  const { data, loading, error } = useQuery(COUNTRIES);
  const [weatherData] = useMutation(GET_WEATHER_DATA);

  useEffect(() => window.scrollTo(0, 0), []);

  const weatherRef = React.useRef(null);

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
      if (window.innerWidth <= 768 && window.innerWidth >= 576) {
        weatherRef.current.scrollIntoView({
          block: 'center',
          behavior: 'smooth',
        });
      }
      if (window.innerWidth < 576) {
        weatherRef.current.scrollIntoView({
          block: 'top',
          behavior: 'smooth',
        });
      }
    } catch (error) {
      setForecast(null);
    }
  };

  if (!me)
    return (
      <div style={{ minHeight: '100vh' }} className="container text-center">
        <div style={{ marginTop: '50px' }}>
          <h4>
            <u>{translate('weather_nolog')}</u>
          </h4>
        </div>
      </div>
    );

  if (loading) return <LoadingIcon />;

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <>
      <div
        className="container-fluid p-4 mt-4 mb-4"
        style={{ minHeight: '100vh' }}
      >
        <h2>{translate('sc_c2_title')}</h2>
        <InputGroup style={{ paddingBottom: '25px' }}>
          <InputGroup.Prepend>
            <InputGroup.Text id="basic-addon1">Filter</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            placeholder={translate('weather_country')}
            aria-label="Country"
            aria-describedby="basic-addon1"
            value={val}
            onChange={event => setVal(event.target.value)}
          />
        </InputGroup>
        <Row className="ml-0 mr-0">
          <Col
            md={3}
            xs={12}
            className="rounded mb-3"
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
                  <th>{translate('weather_country')}</th>
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
            ref={weatherRef}
            style={{ textAlign: 'center', float: 'left' }}
            sm={12}
            xs={12}
            md={{ span: 8, offset: 1 }}
            className="pr-0 pl-0"
          >
            {forecast === null && <div>No data available.</div>}
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
                  <strong>{translate('weather_capital')}</strong>{' '}
                  {forecast.weather.location.name}
                </p>
                <Row className="pb-3">
                  {forecast.weather.forecast.forecastday.map(day => {
                    const date = new Date(day.date_epoch * 1000);
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
                            {translate(date.toDateString().substring(0, 3))}
                          </Card.Header>
                          <div
                            className="d-flex"
                            style={{ justifyContent: 'center' }}
                          >
                            {' '}
                            <Card.Img
                              variant="top"
                              src={day.day.condition.icon}
                              alt={day.day.condition.text}
                              title={day.day.condition.text}
                              style={{ height: '70px', width: '70px' }}
                            />
                          </div>

                          <Card.Body style={{ color: 'white' }}>
                            <Card.Title>{`${date.getDate()}.${date.getMonth() +
                              1}.${date.getFullYear()}`}</Card.Title>
                            <Card.Text>{`${day.day.condition.text}`}</Card.Text>
                          </Card.Body>
                          <ListGroup
                            className="list-group-flush"
                            style={{ fontSize: '0.7rem' }}
                          >
                            <ListGroupItem>
                              <strong>Max: {day.day.maxtemp_c}&#8451;</strong>
                            </ListGroupItem>
                            <ListGroupItem>
                              <strong>Min: {day.day.mintemp_c}&#8451;</strong>
                            </ListGroupItem>
                            <ListGroupItem>
                              <strong>
                                {translate('weather_avg')} {day.day.avgtemp_c}
                                &#8451;
                              </strong>
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
};

Weather.defaultProps = {
  me: undefined,
};

export default Weather;
