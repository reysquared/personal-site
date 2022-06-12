import _ from 'lodash';
import React, { useEffect, useState } from 'react';

import { ensureHsl, ensureRgb } from 'helpers/mandel';

/**
 * This component isn't really intended to be used directly, but it's easy to
 * compose as you can see below. It allows you to set up a color picker control
 * with an arbitrary number (but usually 3-4) of integer color channels, and a
 * pane that displays a preview of the currently selected color. A goal I had
 * for this component is that the parent shouldn't need to think about colors on
 * the actual channel level if it doesn't want.
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
  const color = initialColor || _.mapValues(colorChannels, () => 0);

  return (
    <fieldset className="color-picker">
      {legend ? <legend>{legend}</legend> : null}
      {colorChannels.map((chan) =>
        <label key={chan.id}>
          <span>{chan.label || chan.id}</span>
          <input type="number" className="small-number" name={chan.id}
            value={color[chan.id]} min={0} max={chan.max} step={1}
            onChange={updateColorChannel(chan.id, color, toCssColor, onColorUpdate)}
          />
        </label>
      )}
      <div className="color-preview"
        style={{ backgroundColor: toCssColor(color) }}
      />
    </fieldset>
  );
};

// This COULD, IN THEORY result in throttled color changes if your inputs were
// blazingly fast, since it doesn't pass a state mutator, but if you manage to
// do some junk like that to a color picker component, what are you even doing?
function updateColorChannel(channelId, color, toCssColor, onColorUpdate) {
  return (e) => {
    const updatedColor = {...color, [channelId]: parseInt(e.target.value)};
    onColorUpdate && onColorUpdate(updatedColor, toCssColor(updatedColor));
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
