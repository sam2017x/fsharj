import React, { useState, useEffect } from 'react';
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
  Image,
} from 'react-bootstrap';
import { GET_LAUNCH_DATA } from '../services/queries';
import rocket from '../util/img/rocket.png';

const Space = ({ me }) => {
  const [t, setT] = useState({});
  const [intervalId, setIntervalId] = useState(null);
  const {
    data: { getLaunchData },
    loading,
  } = useQuery(GET_LAUNCH_DATA);

  useEffect(() => {
    return () => clearInterval(intervalId);
  }, [intervalId]);

  const getTime = (launchDate, missionName) => {
    console.log('stuff', { date: launchDate, name: missionName });
    if (missionName === t.mission) {
      console.log('here');
      clearInterval(intervalId);
      setT({});
    } else {
      clearInterval(intervalId);
      setT({});
      const interval = setInterval(() => {
        let now = new Date().getTime();
        now /= 1000;
        const distance = launchDate - now;

        const days = Math.floor(distance / (60 * 60 * 24));
        const hours = Math.floor((distance % (60 * 60 * 24)) / (60 * 60));
        const minutes = Math.floor((distance % (60 * 60)) / 60);
        const seconds = Math.floor(distance % 60);

        setT({
          time: `${days}d : ${hours}h : ${minutes}m : ${seconds}s`,
          mission: missionName,
        });
      }, 1000);

      setIntervalId(interval);
    }
  };

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

  return (
    <div className="container">
      <h2 className="pb-3" style={{ textAlign: 'center' }}>
        Upcoming Space X Missions
      </h2>
      <Accordion>
        {!loading &&
          JSON.parse(getLaunchData.value)
            .filter(flight => flight.upcoming)
            .sort((a, b) => a.launch_date_unix - b.launch_date_unix)
            .map((launch, i) => (
              <Card key={`${launch.mission_name}`}>
                <Card.Header>
                  <Accordion.Toggle
                    as={Button}
                    variant="link"
                    eventKey={`${i}`}
                    onClick={() =>
                      getTime(launch.launch_date_unix, launch.mission_name)
                    }
                  >
                    {launch.mission_name}
                  </Accordion.Toggle>
                  <p>Launching: {launch.launch_date_utc.substring(0, 10)}</p>
                </Card.Header>
                <Accordion.Collapse eventKey={`${i}`}>
                  <Card.Body>
                    <h4 style={{ textAlign: 'center' }}>Mission details</h4>
                    <Container className="pt-3">
                      <Row>
                        <Col
                          sm={{ span: 12, order: 2 }}
                          md={{ order: 1, span: 8 }}
                          xs={{ span: 12, order: 2 }}
                        >
                          <dl>
                            <dt>Description</dt>
                            {launch.details ? (
                              <dd>{launch.details}</dd>
                            ) : (
                              <dd>TBA</dd>
                            )}
                            <dt>Rocket</dt>
                            {launch.rocket.rocket_id ? (
                              <dd>{launch.rocket.rocket_name}</dd>
                            ) : (
                              <dd>TBA</dd>
                            )}
                            <dt>Launch site</dt>
                            {launch.launch_site.site_id ? (
                              <dd>{launch.launch_site.site_name_long}</dd>
                            ) : (
                              <dd>TBA</dd>
                            )}
                            <dt>Countdown</dt>
                            <dd>{t.time}</dd>
                          </dl>
                        </Col>
                        <Col
                          xs={{ order: 1, span: 12 }}
                          sm={{ order: 1, span: 12 }}
                          md={{ order: 2 }}
                          className="pb-3 text-center"
                        >
                          <Image
                            src={rocket}
                            alt="rocket"
                            rounded
                            style={{ height: '10rem' }}
                          />
                        </Col>
                      </Row>
                    </Container>
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
