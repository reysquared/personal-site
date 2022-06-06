import _ from 'lodash';
import React, { useEffect, useState } from 'react';

/*
  coordsOptions takes the form of a dictionary, where the keys are the coords you want
  {
    min: optional number, lower limit of where the coordinate center can be placed
    max: optional number, upper limit of where the coordinate center can be placed
    rangeMax: number, maximum size of the window centered at this coord
    value: optional number, starting value of the window center
      defaults to avg(min, max) if both are defined, min || max if only one is
      defined, and 0 if neither is defined
    range: optional number, starting size of the window along this dimension
      defaults to rangeMax if defined, falls back to (max - min) if not, and
      falls back again to 1 if either of those is undefined
  }
*/
// TODO|kevin god damn man, I gotta say of ALL the React inputs I've implemented
// this one feels like it needs tests the most >_>;
export default function CoordinateWindowPicker({ coordsOptions, aspectRatios, onCoordsChange, legend }) {
  // Create two state objects with the same keys as coordsOptions, one to hold
  // the current value for each coordinate dimension and the other to hold the
  // ranges for each coordinate's viewing window
  const [values, setValues] = useState(_.mapValues(coordsOptions, (coord) => getCoordStartingValue(coord)));
  const [ranges, setRanges] = useState(_.mapValues(coordsOptions, (coord) => getCoordStartingRange(coord)));
  const rangeMaxes = _.mapValues(coordsOptions, (coord) => coord.rangeMax);
  useEffect(() => {
    // Merge the ranges and values state objects into single objects under their
    // corresponding coordKeys with `value` and `range` properties, BEFORE we
    // pass the state back to onCoordsChange. The fact that values and ranges
    // are handled with separate useState calls is an implementation detail.
    // TODO|kevin should I be passing [values, ranges] to useEffect here or nah?
    onCoordsChange && onCoordsChange(_.reduce(values, (accum, value, coordKey) => {
      accum[coordKey] = { value: value, range: ranges[coordKey] }
      return accum;
    }, {}));
  });
  useEffect(() => {
    // TODO|kevin I'm PRETTY SURE I also really want to have a useEffect that
    // just performs maintainRangeAspectRatios if aspectRatios changes...
  });
  // Order coordinate keys alphabetically
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
            value={values[key]}
            range={ranges[key]}
            opts={opts}
            onValueUpdate={updateCoordValue(key, setValues)}
            onRangeUpdate={updateCoordRange(key, setRanges, rangeMaxes, aspectRatios)}
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
        x: { min: -2, max: 2, value: 0, range: 2, rangeMax: 4, label: 'X (real)' },
        y: { min: -2, max: 2, value: 0, range: 2, rangeMax: 4, label: 'Y (imaginary)' },
      }}
      {...props}
    />
  );
}

// A value-and-range picker for an individual coordinate dimension!
function IndividualPicker({ keyName, value, range, opts, onValueUpdate, onRangeUpdate }) {
  return (
    <fieldset className="coordinate-range">
      <legend>{opts.label || keyName}</legend>
      <label>
        <span>Center</span>
        <input type="number" className="long-number"
        // TODO|kevin fuckin a. do I still need this || 0? should i be using defaultValue or value? fma
          min={opts.min} max={opts.max} defaultValue={value || 0}
          onChange={onValueUpdate}
        />
      </label>
      <label>
        <span>Range</span>
        <input type="number" className="medium-number"
          min={0} max={opts.rangeMax} defaultValue={range}
          onChange={onRangeUpdate}
        />
      </label>
      <span className="range-bounds">Min: beep - Max: boop{/* TODO|kevin possibly want to output calculated min and max here? */}</span>
    </fieldset>
  );
}

function getCoordStartingValue(coord) {
  // non-equality comparisons against undefined values are always false, so
  // this will only throw if both a min and a max are defined
  if (coord.max < coord.min) throw `Coordinate max ${coord.max} and min ${coord.min} are reversed`;

  let startValue;
  if (_.isNumber(coord.value)) {
    startValue = coord.value;
  } else if (_.isNumber(coord.min) && _.isNumber(coord.max)) {
    startValue = (coord.min + coord.max) / 2;
  } else {  // i.e. none of min, max, or value was defined on the coord
    startValue = 0;
  }
  // unlike Math.max, lodash max/min ignore undefined values entirely, so we can
  // safely separate the value clamp from the conditionals. Ironically _.clamp()
  // itself is less consistent in this, if one bound is undefined then the other
  // is always treated as the upper bound regardless of their positionality.
  return _.min([_.max([startValue, coord.min]), coord.max]);
};

function getCoordStartingRange(coord) {
  let startRange = _.min([coord.range, coord.rangeMax]);
  if (startRange === undefined) { // i.e. neither range nor rangeMax was defined
    startRange = 1;
  }
  return startRange;
};

// Helper functions that take a coordKey and a reference to a state setter
// function, and return an event handler which updates the corresponding state
// for the corresponding coordKey, along with other necessary side-effects...
function updateCoordValue(coordKey, setValues) {
  return (e) => {
    setValues((coordValues) => ({
      ...coordValues,
      [coordKey]: _.toNumber(e.target.value),
    }));
  };
}
// ...for example, updateCoordRange also makes sure the event handler maintains
// aspect ratios and rangeMax limits, BEFORE it calls setRanges
function updateCoordRange(coordKey, setRanges, rangeMaxes, aspectRatios) {
  return (e) => {
    setRanges((coordRanges) => {
      // The mutator that our event handler passes to setRanges is responsible for
      // ensuring that the coordRanges are normalized to respect aspect ratios and
      // rangeMax limits, so our state always fulfills constraints before setting.
      const rangesNonNormalized = {
        ...coordRanges,
        [coordKey]: _.toNumber(e.target.value),
      };
      return maintainRangeAspectRatios(coordKey, rangesNonNormalized, rangeMaxes, aspectRatios);
    });
    // TODO|kevin do onCoordsUpdate here instead??
  };
}

function maintainRangeAspectRatios(initiator, ranges, rangeMaxes, aspectRatios) {
  console.error('TODO|kevin calling maintainRangeAspectRatios with the following ranges');
  console.error(JSON.stringify(ranges));
  console.error('Aspect ratios:');
  console.error(JSON.stringify(aspectRatios));
  // You can choose to lock only some of the dimensions, if this dimension isn't
  // specified in the aspectRatio object then there's nothing to do
  if (!aspectRatios[initiator]) return ranges;

  // Calculate new ranges for every coordinate dimension using the aspectRatios
  // keys and the new range for the initiator dimension
  let outputRanges = {};
  _.keys(aspectRatios).forEach((key) => {
    // a_0 / b_0 == a_1 / b_1
    // here, b is the initiator range and a is the range to update. we hold b_1
    // constant, so to calculate the new range we take targetRatio * fixedRange
    const targetRatio = aspectRatios[key] / aspectRatios[initiator];
    const fixedRange = ranges[initiator];
    const newRange = targetRatio * fixedRange;
    outputRanges[key] = newRange;
  });

  // Ensure ranges stay clamped by corresponding rangeMax values
  // Iterate through the calculated output ranges, determining if any of them
  // exceed their dimension's rangeMax and which dimension has the highest ratio
  // of range/rangeMax
  let largestMaxRatio = null;
  let largestRange = null;
  _.keys(outputRanges).forEach((key) => {
    // Skip any dimensions that are constrained by ratio but not by upper limit
    if (!rangeMaxes[key]) return;

    const maxRatio = outputRanges[key] / rangeMaxes[key];
    if (maxRatio > largestMaxRatio) {
      largestMaxRatio = maxRatio;
      largestRange = key;
    }
  });

  // If so, we take the dimension with the LARGEST ratio and re-run the function
  // with that dimension as the initiator, set to its own rangeMax. This should
  // result in every other range being recalculated within their corresponding
  // rangeMax, and with a maximum necessary recursion depth of just 1.
  if (largestMaxRatio > 1) {
    outputRanges[largestRange] = rangeMaxes[largestRange];
    return maintainRangeAspectRatios(largestRange, outputRanges, rangeMaxes, aspectRatios);
  }
  // Otherwise, our calculated outputRanges already satisfy all constraints!
  return outputRanges;
}
