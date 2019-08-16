import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo-hooks';
import {
  Accordion,
  Card,
  Button,
  Container,
  Row,
  Col,
  Spinner,
} from 'react-bootstrap';
import { GET_LAUNCH_DATA } from '../services/queries';

const Space = ({ me }) => {
  const {
    data: { getLaunchData },
    loading,
  } = useQuery(GET_LAUNCH_DATA);

  if (!me) return null;

  if (loading) {
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
  }

  if (!loading) {
    const k = JSON.parse(getLaunchData.value);

    console.log('details', k.filter(fl => fl.upcoming));
  }

  /*const parsed = JSON.parse(data.getLaunchData.value).filter(
    flight => flight.upcoming
  );*/

  return (
    <div className="container">
      <h2 className="pb-3" style={{ textAlign: 'center' }}>
        Upcoming Space X Missions
      </h2>
      <Accordion>
        {!loading &&
          JSON.parse(getLaunchData.value)
            .filter(flight => flight.upcoming)
            .map((launch, i) => (
              <Card key={`${launch.mission_name}`}>
                <Card.Header>
                  <Accordion.Toggle
                    as={Button}
                    variant="link"
                    eventKey={`${i}`}
                  >
                    {launch.mission_name}
                  </Accordion.Toggle>
                  <p>aaoiwdaind</p>
                </Card.Header>
                <Accordion.Collapse eventKey={`${i}`}>
                  <Card.Body>
                    <p>{launch.details}</p>
                    <p>{launch.rocket.rocket_id}</p>
                    <p>{launch.launch_site.site_id}</p>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            ))}
      </Accordion>
    </div>
  );
};

Space.propTypes = {
  me: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

Space.defaultProps = {
  me: undefined,
};

export default withRouter(Space);
