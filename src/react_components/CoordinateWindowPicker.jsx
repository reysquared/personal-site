import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';

import { rangeToBounds } from 'helpers/mandel';


/*
  Supports an arbitrary number of dimensions, by god!!!
  coordsOptions takes the form of a object, where the keys are the coords you want
  {
    min: optional number, lower limit of where the coordinate center can be placed
    max: optional number, upper limit of where the coordinate center can be placed
    rangeMax: optional number, maximum size of the window centered at this coord
  }
  coords is also a (NON-optional) object keyed by coord dimensions
  {
    center: center point for a given axis of the viewing window
    range: absolute magnitude of the viewing window along this axis
  }
  aspectRatios is a similarly keyed object where the values are integers defining
  each dimension's, well, aspect. The ratios come from dividing them by each other
*/
export default function CoordinateWindowPicker({ coords, coordsOptions, aspectRatios, onCoordsChange, legend }) {
  // Break coords out into two separate objects, it's easier to update the ranges
  const rangeMaxes = _.mapValues(coordsOptions, 'rangeMax');
  let centers = _.mapValues(coords, 'center');
  let ranges = _.mapValues(coords, 'range');
  // Apply aspect ratios to the passed-in ranges BEFORE RENDERING INPUTS
  ranges = applyRangeAspectRatios(ranges, rangeMaxes, aspectRatios);
  // Similarly, ensure all centers are clamped to limits defined in coordsOptions
  // Unlike Math.max, lodash max/min ignore undefined values entirely, so we
  // don't need extra logic to check for that. (Just take a LITTLE caution in
  // case no options were passed for this dimension :p) Ironically _.clamp()
  // itself is less helpful for this, if one bound is undefined then the other
  // is always treated as the upper bound regardless of their positionality.
  centers = _.mapValues(centers, (center, coordKey) => {
    const opts = coordsOptions[coordKey] || {};
    return _.min([_.max([center, opts.min]), opts.max])
  });
  // Now that we've calculated AR-normalized ranges, zhoop these objects back
  // together so they can be more easily passed up the callback(s)!
  const coordsNormalized = _.mapValues(centers, (center, coordKey) => ({
    center: center,
    range: ranges[coordKey],
  }));
  // turn the coord components into flat arrays of primitives that can be passed
  // to useEffect without getting tripped up by identity comparison
  const flatDepsForCenters = _.toPairs(centers).sort().flat();
  const flatDepsForRanges = _.toPairs(ranges).sort().flat();

  // Since we may end up normalizing the input values based on aspectRatios
  // before any user input at all, we have a useEffect that takes the above
  // flattened dependency arrays and ensures onCoordsChange is called with the
  // corrected values even if the user doesn't interact with the control.
  useEffect(() => {
    onCoordsChange && onCoordsChange(coordsNormalized);
    // If I had it installed, the react eslint exhaustive-deps plugin would warn
    // me about these spread values, but the NUMBER of coordinates should never
    // change between renders so the number of dependencies will remain constant
  }, [...flatDepsForCenters, ...flatDepsForRanges]);

  // Order coordinate keys alphabetically ascending
  const orderedCoordKeys = _.orderBy(_.keys(coordsOptions));
  return (
    <fieldset className="coordinate-range-picker">
      {legend ? <legend>{legend}</legend> : null}
      {_.map(orderedCoordKeys, (key) => {
        const opts = coordsOptions[key]
        return (
          <IndividualPicker
            key={key}
            keyName={key}
            center={centers[key]}
            range={ranges[key]}
            opts={opts}
            onCenterUpdate={updateCoordCenter(key, coordsNormalized, onCoordsChange)}
            onRangeUpdate={updateCoordRange(key, coordsNormalized, ranges, rangeMaxes, aspectRatios, onCoordsChange)}
          />
        );
      })}
    </fieldset>
  );
}

// A shorthand for creating a CoordinateWindowPicker with the options I need for the FractalViewer
export function MandelXYWindowPicker({...props}) {
  return (
    <CoordinateWindowPicker
      coordsOptions={{
        x: { min: -2, max: 2, rangeMax: 4, label: 'X (real)' },
        y: { min: -2, max: 2, rangeMax: 4, label: 'Y (imaginary)' },
      }}
      {...props}
    />
  );
}

// A value-and-range picker for an individual coordinate dimension! Kind of a
// dumb name but, hey, I'm not exporting it and it makes sense in context
function IndividualPicker({ keyName, center, range, opts, onCenterUpdate, onRangeUpdate }) {
  const [rangeStart, rangeEnd] = rangeToBounds(center, range);
  return (
    <fieldset className="coordinate-range">
      <legend>{opts.label || keyName}</legend>
      <label>
        <span>Center</span>
        <input type="number" className="long-number"
          min={opts.min} max={opts.max} value={center} step="any"
          onChange={onCenterUpdate}
        />
      </label>
      <label>
        <span>Range</span>
        <input type="number" className="medium-number"
          min={0} max={opts.rangeMax} value={range} step="any"
          onChange={onRangeUpdate}
        />
      </label>
      <span className="range-bounds">
        Min: {rangeStart}
        <br />
        Max: {rangeEnd}
      </span>
    </fieldset>
  );
}

// Helper functions that take a coordKey and a callback function, and return an
// event handler which calls the function with a coords state mutator function
// function, and return an event handler which updates the corresponding state
// for the corresponding coordKey, along with other necessary side-effects...
function updateCoordCenter(coordKey, coordsNormalized, onCoordsChange) {
  return (e) => {
    coordsNormalized = {
      ...coordsNormalized,
      [coordKey]: {...coordsNormalized[coordKey], center: _.toNumber(e.target.value)}
    };
    onCoordsChange && onCoordsChange(coordsNormalized);
  };
}

// ...for example, updateCoordRange also makes sure the event handler maintains
// correct aspect ratios and rangeMax limits, BEFORE it calls onCoordsChange
// TBF it's a little bit silly to pass ranges AND coords, but... it's easier!
function updateCoordRange(coordKey, coordsNormalized, ranges, rangeMaxes, aspectRatios, onCoordsChange) {
  return (e) => {
    ranges[coordKey] = _.toNumber(e.target.value);
    const correctedRanges = maintainRangeAspectRatios(coordKey, ranges, rangeMaxes, aspectRatios);
    coordsNormalized = _.mapValues(coordsNormalized, (coord, key) => ({...coord, range: correctedRanges[key]}));
    onCoordsChange && onCoordsChange(coordsNormalized);
  };
}

// I struggled for a while with the most principled way of choosing what axis
// to initiate from, but ultimately decided that if maintainRangeAspectRatios
// handles rangeMax clamping, I can just pick one and let it do so. Since for
// my purposes aspect ratios will USUALLY be starting out square, I just grab
// whichever axis is slated to be the widest after applying the ARs, under the
// assumption that it would be the most likely to need to shrink its current
// range in order to stay within its rangeMax otherwise.
function applyRangeAspectRatios(ranges, rangeMaxes, aspectRatios) {
  // Convert all DEFINED aspectRatios to [key, value] pairs
  const aspectRatioPairs = _.toPairs(_.pickBy(aspectRatios, _.isNumber));
  // Sort pairs by index 1 to find the largest value, then grab its key.
  // ... of course, we MIGHT not have actually defined any aspectRatios--in that
  // case just choose any key and let maintainRangeARs() handle max clamping.
  const initiator = _.last(_.sortBy(aspectRatioPairs, 1))[0] || _.keys(ranges)[0];
  return maintainRangeAspectRatios(initiator, ranges, rangeMaxes, aspectRatios);
}

function maintainRangeAspectRatios(initiator, ranges, rangeMaxes, aspectRatios) {
  // Calculate new ranges for every coordinate dimension using the aspectRatios
  // keys and the new range for the initiator dimension
  let outputRanges = {};
  if (aspectRatios[initiator]) {
    _.keys(aspectRatios).forEach((key) => {
      // Maintaining a constant aspect ratio:   a_0 / b_0 == a_1 / b_1
      // Here, b is the initiator dimension and a is the dimension to update.
      // We hold b_1 constant, so with aspect ratios a_0 and b_0 we calculate
      // a_1, the new range value for the a axis, as targetRatio * fixedRange
      const targetRatio = aspectRatios[key] / aspectRatios[initiator];
      const fixedRange = ranges[initiator];
      const newRange = targetRatio * fixedRange;
      outputRanges[key] = newRange;
    });
  } else {
    // You can choose to lock only some of the dimensions; if this dimension
    // isn't specified in the aspectRatios there's nothing to do. However, we
    // still want to apply rangeMax ceilings, so clone into output and continue
    outputRanges = _.clone(ranges);
  }

  // Ensure ranges stay clamped by their corresponding rangeMax values. First
  // we determine which dimension has the largest ratio of range/rangeMax
  const [largestRange, maxRatio] = largestRangeMaxRatio(outputRanges, rangeMaxes);

  // If that ratio is more than 1, re-run the function with this dimension as
  // the initiator, set to its own rangeMax. Since this dimension exceeds its
  // rangeMax limit by more than any other, this ensures every other range WITH
  // A DEFINED ASPECT RATIO gets recalculated within its own rangeMax after only
  // one additional call. However, if there are many other dimensions that have
  // a rangeMax but NO aspect ratio, this will only ceil the largest non-ratio'd
  // dimension per recursion.
  if (maxRatio > 1) {
    outputRanges[largestRange] = rangeMaxes[largestRange];
    return maintainRangeAspectRatios(largestRange, outputRanges, rangeMaxes, aspectRatios);
  }
  // Otherwise, our calculated outputRanges already satisfy all constraints!
  return outputRanges;
}

// Iterate over ranges and determine which has the highest range/rangeMax ratio
// returns: [rangeKey, rangeMaxRatio]
function largestRangeMaxRatio(ranges, rangeMaxes) {
  let largestMaxRatio = null;
  let largestRange = null;
  _.keys(ranges).forEach((key) => {
    // Skip any dimensions that don't have an upper limit to conform to
    if (!rangeMaxes[key]) return;

    const maxRatio = ranges[key] / rangeMaxes[key];
    if (maxRatio > largestMaxRatio) {
      largestMaxRatio = maxRatio;
      largestRange = key;
    }
  });
  return [largestRange, largestMaxRatio];
}
