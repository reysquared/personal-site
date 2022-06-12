import _ from 'lodash';
import React from 'react';

import { gcd } from 'helpers/misc';


export default function DimensionsPicker({
  height,
  minHeight,
  maxHeight,
  width,
  minWidth,
  maxWidth,
  onWidthChange,
  onHeightChange,
  legend,
}) {
  // Dimensions below 0 do not make sense
  minHeight = _.max([minHeight, 0]);
  minWidth = _.max([minWidth, 0]);
  const aspectGcd = gcd(width, height);
  const widthReduced = width / aspectGcd;
  const heightReduced = height / aspectGcd;
  return (
    <fieldset className="dimensions-picker">
      {legend ? <legend>{legend}</legend> : null}
      <label>
        <span>Width</span>
        <input type="number" name="width" className="medium-number"
          value={width} min={minWidth} max={maxWidth} step={1}
          onChange={(e) => onWidthChange(_.toInteger(e.target.value))}
        />
      </label>
      <label>
        <span>Height</span>
        <input type="number" name="height" className="medium-number"
          value={height} min={minHeight} max={maxHeight} step={1}
          onChange={(e) => onHeightChange(_.toInteger(e.target.value))}
        />
      </label>
      <span>Aspect ratio:<br />{widthReduced}:{heightReduced}</span>
    </fieldset>
  );
}