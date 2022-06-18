import _ from 'lodash';
import React from 'react';

import { DEFAULT_MANDELBROT_CANVAS_SIZE } from 'react_components/constants';
import { boundsToRange } from 'helpers/mandel';


export default function JumpToViewButton({ x, y, label, setViewWindowX, setViewWindowY, setShouldRender, setCanvasDims, setExponent }) {
  // If x and y are arrays, assume they represent view bounds instead of a
  // center-and-range object, and replace them for convenience
  if (x.length && y.length) {
    const [xCenter, xRange] = boundsToRange(...x);
    const [yCenter, yRange] = boundsToRange(...y);
    x = { center: xCenter, range: xRange };
    y = { center: yCenter, range: yRange };
  }
  return (
    <label>
      <button
        className="button small jump-to-view"
        onClick={() => {
          setCanvasDims({
            height: DEFAULT_MANDELBROT_CANVAS_SIZE,
            width: DEFAULT_MANDELBROT_CANVAS_SIZE,
          });
          setExponent(2);
          setViewWindowX(x);
          setViewWindowY(y);
          setShouldRender(true);
        }}
        >
        Go!
      </button>
      {' '}
      <span>{label}</span>
    </label>
  );
};
