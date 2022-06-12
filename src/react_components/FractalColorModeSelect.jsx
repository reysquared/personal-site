import _ from 'lodash';
import React from 'react';

import { ColorModes } from 'helpers/mandel';


const colorModeNames = {
  [ColorModes.QUADRATIC]: 'Quadratic',
  [ColorModes.LINEAR]: 'Linear',
  [ColorModes.INV_QUADRATIC]: 'Inverse Quad.',
}

export default function FractalColorModeSelect({ colorMode, onChange }) {
  return (
    <label className="color-mode-select">
      <span>Color interpolation mode:</span>
      {' '}
      <select
        value={colorMode}
        onChange={(e) => onChange && onChange(_.toNumber(e.target.value))}
      >
        {_.sortBy(_.toPairs(ColorModes), 1).map(([key, val]) => 
          <option key={key} value={val}>
            {colorModeNames[val] || key}
          </option>
        )}
      </select>
    </label>
  );
}
