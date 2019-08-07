import React, { useState } from 'react';
import {
  Button,
  Container,
  Col,
  Row,
  Spinner,
  InputGroup,
  FormControl,
  Table,
} from 'react-bootstrap';
import { useQuery } from 'react-apollo-hooks';
import { COUNTRIES, WEATHER } from '../services/queries';

const Weather = ({ me, client }) => {
  const [val, setVal] = useState('');
  const { data, loading, error } = useQuery(COUNTRIES);

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
    return <div>{error.message}</div>;
  }

  return (
    <div className="container">
      <h2>Weather</h2>
      <InputGroup>
        <InputGroup.Prepend>
          <InputGroup.Text id="basic-addon1">Filter</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          placeholder="City"
          aria-label="City"
          aria-describedby="basic-addon1"
          value={val}
          onChange={event => setVal(event.target.value.toLowerCase())}
        />
      </InputGroup>
      <Table>
        <thead>
          <tr>
            <th>Country</th>
          </tr>
        </thead>
        {data.value &&
          data.value
            .filter(country => country.name.toLowerCase().includes(val))
            .map(c => {
              return null;
            })}
      </Table>
    </div>
  );
};

export default Weather;
