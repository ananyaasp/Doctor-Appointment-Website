// pages/AboutUs.js
import React from 'react';
import Footer from '../components/Footer'; // Assuming Footer is in components
import userimage from '../components/userimage.png'; // Adjust the path as needed

const AboutUs = () => {
  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <h1>About Us</h1>
      <p>
        Our mission is to provide easy access to healthcare by enabling patients to
        book appointments seamlessly with doctors.
      </p>
      <p>
        Our team is dedicated to making healthcare more accessible and improving
        patient care through technology.
      </p>
      
      {/* Insert the image */}
      <img src={userimage} alt="Our Team" style={{ width: '300px', height: 'auto', margin: '20px 0' ,borderRadius:"10px"}} />

      {/* Include Footer */}
      <Footer />
    </div>
  );
};

export default AboutUs;
