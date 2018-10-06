import React, { Component } from 'react';
import './Plot.css';

import pixel from '../../img/pixel.png';

class Plot extends Component {
  state = {};

  render() {
    return (
      <div className="Plot">
        <img src={pixel} alt="TODO: Place explanatory text here" />
      </div>
    );
  }
}

export default Plot;
