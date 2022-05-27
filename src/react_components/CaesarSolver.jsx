// TODO|kevin okay, what bits should THIS have? hmm
import React, { useState } from 'react';
import { encipher, autoDecipher } from 'helpers/caesar';

/*
  so the bits this needs... a TEXT INPUT, firstly.
  obviously also a TEXT OUTPUT
  a ROTATION VALUE input
  and a button to click to auto-rotate the bad boy, thereby programmatically setting the rotation value, right?

  so our STATE is comprised of 1) the input text, and 2) the rotation value.

  I think the way I want it to be VISUALLY structured is 

  introductory explanatory text (fairly brief, couple sentences ideally)
  [ INPUT TEXT BOX ]
  rotation value: [rot value] [ DETERMINE AUTOMATICALLY button ]
  [ OUTPUT TEXT BOX ]

  maybe an "invert" button somewhere in that middle row too, to quickly swap the
  rotation value to its mod26 complement

  SO WHAT FUNCTIONS DO WE NEED?
  - handle onChange from the text input
  - handle onChange from the rotation value input
  - handle onClick from the auto-decrypt button
    - should update the value of the rotation input
    - should PROBABLY also update the value of the output? but that should happen
      as a natural consequence of the input->state update, so it may be hard to avoid wasted work lol
  - handle onClick from the complement button
*/
export default function CaesarSolver({ initialText, initialRotation }) {
  const [inputText, setInputText] = useState(initialText);
  const [rotation, setRotation] = useState(parseInt(initialRotation));

  // TODO|kevin ehhhh probably don't actually want .content on this component itself
  // rather, I want that on the div that CONTAINS this component's render target
  return (
    <fieldset>
      <legend>Caesar Solver</legend>
      <label>
        <span>
          Input text
        </span>
        <input
          type="text"
          className="scriptbox"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
      </label>
      <label>
        <span>
          Rotation offset
        </span>
        <div className="rotation-inputs">
          <input
            type="number"
            className="small-number"
            min={0}
            max={25}
            step={1}
            value={rotation}
            onChange={(e) => setRotation(parseInt(e.target.value))}
          />
          <button
            className="button"
            onClick={() => setRotation((rot) => (26 - rot))}
          >
            Invert
          </button>
          <button
            className="button"
            onClick={() => setRotation(autoDecipher(inputText))}
          >
            Auto-Decipher
          </button>
        </div>
      </label>
      <label>
        <span>
          Output text
        </span>
        <input
          type="text"
          className="scriptbox"
          readOnly
          value={encipher(inputText, rotation)}
        />
      </label>
    </fieldset>
  );
}