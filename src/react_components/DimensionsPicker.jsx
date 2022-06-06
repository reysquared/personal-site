import _ from 'lodash';
import React from 'react';
/**
 * I CHANGED MY MIND, I WANT DIMENSIONSPICKER TO BE A WIDTH/HEIGHT PICKER
 * 
 */

// TODO|kevin this should definitely support max/min width and height values in some format
export default function DimensionsPicker({
  startHeight,
  minHeight,
  maxHeight,
  startWidth,
  minWidth,
  maxWidth,
  onWidthChange,  // TODO|kevin should these in fact be onDimensionChange?
  onHeightChange,
  legend,
}) {
  // Dimensions below 0 do not make sense
  minHeight = _.max([minHeight, 0]);
  minWidth = _.max([minWidth, 0]);
  return (
    <fieldset className="dimensions-picker">
      {legend ? <legend>{legend}</legend> : null}
      <label>
        <span>Height</span>
        <input type="number" name="height"
          value={startHeight} min={minHeight} max={maxHeight} step={1}
          onChange={(e) => onHeightChange(_.toInteger(e.target.value))}
        />
      </label>
      <label>
        <span>Width</span>
        <input type="number" name="width"
          value={startWidth} min={minWidth} max={maxWidth} step={1}
          onChange={(e) => onWidthChange(_.toInteger(e.target.value))}
        />
      </label>
      <span>TODO|kevin again, thinking about putting an aspect ratio readout here maybe?</span>
    </fieldset>
  );
}