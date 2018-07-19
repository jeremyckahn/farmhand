import React from 'react';
import { string } from 'prop-types';

const Item = ({ name }) => (
  <div className="item">
    <header>{name}</header>
  </div>
);

Item.propTypes = {
  name: string.isRequired,
};

export default Item;
