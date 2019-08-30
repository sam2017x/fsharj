import React from 'react';
import { Image } from 'react-bootstrap';
import twitter from '../util/img/twitter.png';
import ig from '../util/img/insta.png';
import fb from '../util/img/fb.png';
import whatsapp from '../util/img/wazzap.png';

const Footer = () => {
  return (
    <div
      style={{
        paddingTop: '40px',
        paddingBottom: '40px',
        bottom: '0',
        width: '100%',
        backgroundColor: '#343a40',
        color: '#808080',
      }}
      className="text-center"
    >
      <p>
        <strong>Application Mashup</strong>
      </p>
      <p>
        <Image
          src={fb}
          alt="facebook"
          rounded
          style={{ height: '50px', width: '50px' }}
        />
        <Image
          src={ig}
          alt="instagram"
          rounded
          style={{ height: '50px', width: '50px' }}
        />
        <Image
          src={twitter}
          alt="twitter"
          rounded
          style={{ height: '50px', width: '50px' }}
        />
        <Image
          src={whatsapp}
          alt="whatsapp"
          rounded
          style={{ height: '50px', width: '50px' }}
        />
      </p>
      <p style={{marginBottom: '0'}}>&copy; SJ.</p>
    </div>
  );
};

export default Footer;
