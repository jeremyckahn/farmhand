import React from 'react';
import { func, shape, string } from 'prop-types';
import classNames from 'classnames';
import './Toolbelt.sass';
import { fieldMode } from '../../enums';

import { tools, pixel } from '../../img';

const { CLEANUP, HARVEST, WATER } = fieldMode;

const Toolbelt = ({
  handlers: { handleFieldModeSelect },
  state: { fieldMode: currentFieldMode },
}) => (
  <div className="Toolbelt">
    {[
      {
        alt: 'A watering can for hydrating plants',
        toolImageId: 'watering-can',
        fieldMode: WATER,
      },
      {
        alt: 'A scythe for crop harvesting',
        toolImageId: 'scythe',
        fieldMode: HARVEST,
      },
      {
        alt: 'A hoe for removing crops without harvesting them',
        toolImageId: 'hoe',
        fieldMode: CLEANUP,
      },
    ].map(({ alt, className, toolImageId, fieldMode }) => (
      <button
        className={classNames({
          selected: fieldMode === currentFieldMode,
        })}
        key={fieldMode}
      >
        {/* alt is in a different format here because of linter weirdness. */}
        <img
          {...{
            className: `square ${toolImageId}`,
            onClick: () => handleFieldModeSelect(fieldMode),
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
    handleFieldModeSelect: func.isRequired,
  }).isRequired,
  state: shape({
    fieldMode: string.isRequired,
  }).isRequired,
};

export default Toolbelt;
