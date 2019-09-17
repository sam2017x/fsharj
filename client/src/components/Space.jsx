import React, { useState, useEffect, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { Accordion, Card, Container, Row, Col } from 'react-bootstrap';
import { GET_LAUNCH_DATA } from '../services/queries';
import rocket from '../util/img/rocket.png';
import translate from '../util/localization/i18n';
import LoadingIcon from './LoadingIcon';

const Space = ({ me }) => {
  const [t, setT] = useState({});
  const [filter, setFilter] = useState({
    rocket: 'all',
    order: 'desc',
    scope: 'all',
  });
  const [intervalId, setIntervalId] = useState(null);
  const {
    data: { getLaunchData },
    loading,
  } = useQuery(GET_LAUNCH_DATA);

  useEffect(() => {
    return () => clearInterval(intervalId);
  }, [intervalId]);

  useEffect(() => window.scrollTo(0, 0), []);

  const getTime = useCallback(
    (launchDate, missionName, element) => {
      if (missionName === t.missionName) {
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

          if (distance > 0) {
            setT({
              time: `${days}${translate('space_days')} : ${hours}${translate(
                'space_hours'
              )} : ${minutes}${translate(
                'space_minutes'
              )} : ${seconds}${translate('space_seconds')}`,
              missionName,
              element,
              launchDate,
            });
          } else {
            setT({
              time: translate('space_expired'),
              missionName,
              element,
              launchDate,
            });
          }
        }, 1000);

        setIntervalId(interval);
      }

      return null;
    },
    [intervalId, t]
  );

  const filterMissions = useCallback(() => {
    let missions = [];

    if (filter.scope === 'all') {
      missions = JSON.parse(getLaunchData.value);
    } else {
      missions = JSON.parse(getLaunchData.value).filter(msn => msn.upcoming);
    }

    if (filter.rocket !== 'all') {
      missions = missions.filter(
        msn => msn.rocket.rocket_name === filter.rocket
      );
    }

    if (filter.order === 'desc') {
      return missions.sort((a, b) => a.launch_date_unix - b.launch_date_unix);
    }

    return missions.sort((a, b) => b.launch_date_unix - a.launch_date_unix);
  }, [filter, getLaunchData]);

  useEffect(() => {
    if (!loading) {
      const openCard = filterMissions();
      if (openCard[t.element] !== undefined) {
        getTime(
          openCard[t.element].launch_date_unix,
          openCard[t.element].mission_name,
          t.element
        );
      }
    }
  }, [filter]);

  if (!me)
    return (
      <div style={{ minHeight: '100vh' }} className="container text-center">
        <div style={{ marginTop: '50px' }}>
          <h4>
            <u>{translate('space_nolog')}</u>
          </h4>
        </div>
      </div>
    );

  if (loading) {
    return <LoadingIcon />;
  }

  return (
    <div
      className="container pt-4 mt-4"
      style={{ minHeight: '100vh', marginBottom: '40px' }}
    >
      <h2 className="pb-3 mb-3" style={{ textAlign: 'center' }}>
        {translate('space_h1')}
      </h2>
      <Container className="mb-4">
        <Row>
          <Col xs={12} sm={12} md={4}>
            {translate('space_filter1')}
            <select
              style={{ width: '100%' }}
              onChange={event =>
                setFilter({ ...filter, rocket: event.target.value })
              }
            >
              <option value="all">{translate('space_filter3_1')}</option>
              {!loading &&
                JSON.parse(getLaunchData.value)
                  .map(mis => mis.rocket.rocket_name)
                  .filter((v, i, a) => a.indexOf(v) === i)
                  .map(rname => (
                    <option key={rname} value={rname}>
                      {rname}
                    </option>
                  ))}
            </select>
          </Col>
          <Col xs={12} md={4} sm={12}>
            {translate('space_filter2')}
            <select
              style={{ width: '100%' }}
              onChange={event =>
                setFilter({ ...filter, order: event.target.value })
              }
            >
              <option value="desc">{translate('space_filter2_1')}</option>
              <option value="asc">{translate('space_filter2_2')}</option>
            </select>
          </Col>
          <Col xs={12} sm={12} md={4}>
            {translate('space_filter3')}
            <select
              style={{ width: '100%' }}
              onChange={event =>
                setFilter({ ...filter, scope: event.target.value })
              }
            >
              <option value="all">{translate('space_filter3_1')}</option>
              <option value="upcoming">{translate('space_filter3_2')}</option>
            </select>
          </Col>
        </Row>
      </Container>
      <Accordion>
        {!loading &&
          filterMissions().map((launch, i) => (
            <Card key={`${launch.mission_name}`}>
              <Accordion.Toggle
                as={Card.Header}
                eventKey={`${i}`}
                onClick={() =>
                  getTime(launch.launch_date_unix, launch.mission_name, i)
                }
              >
                {launch.mission_name}{' '}
                <div style={{ float: 'right' }}>
                  {launch.launch_date_utc.substring(0, 10)}
                </div>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey={`${i}`}>
                <Card.Body>
                  <h4 style={{ textAlign: 'center' }}>
                    {translate('space_details')}
                  </h4>
                  <Container className="pt-3">
                    <Row>
                      <Col
                        sm={{ span: 12, order: 2 }}
                        md={{ order: 1, span: 8 }}
                        xs={{ span: 12, order: 2 }}
                      >
                        <dl>
                          <dt>{translate('space_accordion1')}</dt>
                          {launch.details ? (
                            <dd>{launch.details}</dd>
                          ) : (
                            <dd>TBA</dd>
                          )}
                          <dt>{translate('space_accordion2')}</dt>
                          {launch.rocket.rocket_id ? (
                            <dd>{launch.rocket.rocket_name}</dd>
                          ) : (
                            <dd>TBA</dd>
                          )}
                          <dt>{translate('space_accordion3')}</dt>
                          {launch.launch_site.site_id ? (
                            <dd>{launch.launch_site.site_name_long}</dd>
                          ) : (
                            <dd>TBA</dd>
                          )}
                          <dt>{translate('space_accordion4')}</dt>
                          <dd>{t.time}</dd>
                        </dl>
                      </Col>
                      <Col
                        xs={{ order: 1, span: 12 }}
                        sm={{ order: 1, span: 12 }}
                        md={{ order: 2 }}
                        className="pb-3 text-center"
                      >
                        <img
                          src={rocket}
                          alt="rocket"
                          style={{ height: '10rem' }}
                        />
                      </Col>
                    </Row>
                  </Container>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          ))}
        {!loading && filterMissions().length === 0 && (
          <div className="text-center mt-5 pt-5">
            <strong>{translate('space_filter_fail')}</strong>
          </div>
        )}
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
