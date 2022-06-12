import React, { useState } from 'react';
import { encipher, autoDecipher } from 'helpers/caesar';


export default function CaesarSolver({ initialText, initialRotation }) {
  const [inputText, setInputText] = useState(initialText);
  const [rotation, setRotation] = useState(parseInt(initialRotation));

  return (
    <fieldset>
      <legend>Caesar Solver</legend>
      <label>
        <span>
          Input text
        </span>
        <textarea
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
            min={0} max={25} step={1} value={rotation}
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
        <textarea
          className="scriptbox"
          readOnly
          value={encipher(inputText, rotation)}
        />
      </label>
    </fieldset>
  );
}
