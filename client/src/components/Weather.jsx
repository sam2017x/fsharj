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
} from 'react-bootstrap';
import axios from 'axios';
import { useQuery } from 'react-apollo-hooks';
import { COUNTRIES, WEATHER } from '../services/queries';

const Weather = ({ me, client }) => {
  const [page, setPage] = useState('');
  const [val, setVal] = useState('');
  const [mockCountries, setMockCountries] = useState([]);
  const { data, loading, error } = useQuery(COUNTRIES);

  /*useEffect(async () => {
    const response = await axios.get('https://restcountries.eu/rest/v2/all');
    console.log('CLIENT GET', response.data);
  }, []);*/

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
        <div className="container">
          <h2>Weather</h2>
          <InputGroup>
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
            <Col>
              <Table>
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
                              name={c.name}
                              onClick={event =>
                                console.log(
                                  `NAME OF COUNTRY: ${event.target.name}`
                                )
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
            <Col>
              <Table>
                <thead>
                  <tr>
                    <th>City</th>
                  </tr>
                </thead>
                {data.value &&
                  data.value
                    .filter(country => country.name.toLowerCase().includes(val))
                    .map(c => {
                      return null;
                    })}
              </Table>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
};

export default Weather;
