import _ from 'lodash';
import React, { useEffect, useState } from 'react';

import { ensureHsl, ensureRgb } from 'helpers/mandel';

/**
 * This component isn't really intended to be used directly, but it's easy to
 * compose as you can see below. It allows you to set up a color picker control
 * with an arbitrary number (but usually 3-4) of integer color channels, and a
 * pane that displays a preview of the currently selected color.
 * 
 * Props:
 *   colorChannels: [{id, label, max}] list of integer channel inputs to create
 *   toCssColor: function (color) => (string) given a color object, must return
 *     a string that is a valid expression for the css background-color property
 *   onColorUpdate: optional callback for useEffect. is called with two args,
 *     the color state object and the output of calling toCssColor(color)
 *   initialColor: optional color object. should have a key corresponding to the
 *     id of each channel in colorChannels, but I guess you can kinda go nuts if
 *     you really want, it's honestly a little weirdly defensively programmed :V
 */
export function ColorPicker({ colorChannels, toCssColor, onColorUpdate, initialColor, legend }) {
  // Generate a color state object with a key for every channel. If you specify
  // an initialColor object it looks for channel values there, falling back to 0
  const [color, setColor] = useState(_.reduce(colorChannels, (clr, chan) => {
    clr[chan.id] = _.toNumber(_.isObject(initialColor) && initialColor[chan.id]) || 0;
    return clr;
  }, {}));

  useEffect(() => {
    // TODO|kevin bluhhhh I shouldn't be doing this in here, huh?
    onColorUpdate && onColorUpdate(color, toCssColor(color));
  });

  return (
    <fieldset className="color-picker">
      {legend ? <legend>{legend}</legend> : null}
      {colorChannels.map((chan) =>
        <label key={chan.id}>
          <span>{chan.label || chan.id}</span>
          <input type="number" className="small-number" name={chan.id}
            value={color[chan.id]} min={0} max={chan.max} step={1}
            onChange={updateColorChannel(chan.id, setColor)}
          />
        </label>
      )}
      <div className="color-preview"
        style={{ backgroundColor: toCssColor(color) }}
      />
    </fieldset>
  );
};

// Each color input recieves an onChange handler that passes a state mutator
// function updating the corresponding color channel in the state. Because
// we're using useState and not setState, object updates aren't merged, hence
// unrolling the rest of ...clr. Still, keeping state in an object is worth
// the inconveniences to allow passing arbitrary channels in a single object.
function updateColorChannel(channelId, setColor) {
  return (e) => {
    setColor((clr) => ({ ...clr, [channelId]: parseInt(e.target.value) }));
  };
}

const HSL_COLOR_CHANNELS = [
  { id: 'h', label: 'Hue', max: 360 },
  { id: 's', label: 'Sat.', max: 100 },
  { id: 'l', label: 'Light.', max: 100 },
];
function hslToCssColor(clr) {
  return `hsl(${clr.h}, ${clr.s}%, ${clr.l}%)`;
}

export function ColorPickerHsl({ onColorUpdate, initialColor, legend }) {
  return (
    <ColorPicker
      colorChannels={HSL_COLOR_CHANNELS}
      toCssColor={hslToCssColor}
      onColorUpdate={onColorUpdate}
      initialColor={ensureHsl(initialColor)}
      legend={legend}
    />
  );
}

const RGB_COLOR_CHANNELS = [
  { id: 'r', label: 'Red', max: 360 },
  { id: 'g', label: 'Green', max: 100 },
  { id: 'b', label: 'Blue', max: 100 },
];
function rgbToCssColor(clr) {
  return `rgb(${clr.r}, ${clr.g}, ${clr.b})`;
}

export function ColorPickerRgb({ onColorUpdate, initialColor, legend }) {
  return (
    <ColorPicker
      colorChannels={RGB_COLOR_CHANNELS}
      toCssColor={rgbToCssColor}
      onColorUpdate={onColorUpdate}
      initialColor={ensureRgb(initialColor)}
      legend={legend}
    />
  );
}

export function ColorPickerSwitchable({ usingHsl, ...passThruProps }) {
  return (
    <>
      {usingHsl
        ? <ColorPickerHsl {...passThruProps} />
        : <ColorPickerRgb {...passThruProps} />
      }
    </>
  );
}