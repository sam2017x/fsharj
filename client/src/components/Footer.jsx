import React from 'react';

const Footer = () => {
  return (
    <>
      <div style={{ height: '10rem' }}></div>
      <div
        style={{
          bottom: '0',
          position: 'absolute',
          width: '100%',
          textAlign: 'center',
          backgroundColor: 'black',
        }}
      >
        &copy; SJ.
      </div>
    </>
  );
};

export default Footer;
