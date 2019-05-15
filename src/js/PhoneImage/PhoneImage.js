import React, { Component } from 'react';
import PropTypes from 'prop-types';
import img from '../../img/iphonex_frame.png';
import frame1 from '../../img/amino_frame_1b.png';


const propTypes = {
  img: PropTypes.object.isRequired
};

export default props => (
  <div style={{
    backgroundColor: 'lightgray',
    height: '500px',
    width: '222px',
    overflow: 'hidden',    
  }}>
    
    <img src={frame1} style={{
      position: 'absolute',
      left: '33px',
      top: '40px',      
      width: '222px',

      left: '80px'
      // zIndex: -1
    }}/>
    <img src={img} className="phone-image" style={{ position: 'absolute' }}/>
    
  </div>
);