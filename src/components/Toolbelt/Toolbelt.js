import React from 'react';
import { func, shape, string } from 'prop-types';
import classNames from 'classnames';
import './Toolbelt.sass';
import { toolType } from '../../enums';

import { tools, pixel } from '../../img';

const { HOE, SCYTHE, WATERING_CAN } = toolType;

const Toolbelt = ({
  handlers: { handleToolSelect },
  state: { selectedTool },
}) => (
  <div className="Toolbelt">
    {[
      {
        alt: 'A watering can for hydrating plants',
        toolImageId: 'watering-can',
        toolType: WATERING_CAN,
      },
      {
        alt: 'A scythe for crop harvesting',
        toolImageId: 'scythe',
        toolType: SCYTHE,
      },
      {
        alt: 'A hoe for removing crops without harvesting them',
        toolImageId: 'hoe',
        toolType: HOE,
      },
    ].map(({ alt, className, toolImageId, toolType }) => (
      <button
        className={classNames({
          selected: selectedTool === toolType,
        })}
        key={toolType}
      >
        <img
          {...{
            className: `square ${toolImageId}`,
            onClick: () => handleToolSelect(toolType),
            src: pixel,
            style: { backgroundImage: `url(${tools[toolImageId]}` },
          }}
          alt={alt}
        />
      </button>
    ))}
  </div>
);

Toolbelt.propTypes = {
  handlers: shape({
    handleToolSelect: func.isRequired,
  }).isRequired,
  state: shape({
    selectedTool: string.isRequired,
  }).isRequired,
};

export default Toolbelt;
