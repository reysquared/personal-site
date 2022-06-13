import Complex from 'complex.js';
import React, { useEffect, useState } from 'react';

import { DEFAULT_MANDELBROT_CANVAS_SIZE } from 'react_components/constants';
import { boundsToRange, ColorModes, makeColorMap, rangeToBounds } from 'helpers/mandel';
import { getMouseCoordsWithinEventTarget } from 'helpers/misc';
import Collapsible from 'react_components/Collapsible';
import { ColorPickerSwitchable } from 'react_components/ColorPicker';
import { MandelXYWindowPicker } from 'react_components/CoordinateWindowPicker';
import DimensionsPicker from 'react_components/DimensionsPicker';
import DurableCanvas, { durableCanvasRegistry } from 'react_components/DurableCanvas';
import FractalColorModeSelect from 'react_components/FractalColorModeSelect';
import FractalZoomCanvas from 'react_components/FractalZoomCanvas';
import JumpToViewButton from 'react_components/JumpToViewButton';
import SaveCanvasButton from 'react_components/SaveCanvasButton';


const JULIA_CANVAS_ID = 'julia-canvas';
const MANDEL_CANVAS_ID = 'mandelbrot-canvas';

const MIN_CANVAS_DIMENSION = 300;
const MAX_CANVAS_DIMENSION = 2000;
const MAX_FRACTAL_ITERATIONS = 200;

const COOL_REGIONS = [
  { x: [ 0.360, 0.430], y: [ 0.120, 0.170], label: 'Seahorses?' },
  { x: [-0.325,-0.275], y: [ 0.625, 0.675], label: 'Frumpy alien?' },
  { x: [ 0.345, 0.375], y: [ 0.630, 0.660], label: 'Lightning Mandel?' },
  { x: [-0.005, 0.000], y: [ 0.825, 0.830], label: 'Disco neuron?' },
  { x: [-1.075,-1.050], y: [ 0.250, 0.275], label: 'Mole nose?' },
  { x: [-1.500,-1.325], y: [-0.050, 0.050], label: 'Frost branches?' },
  { x: [-1.410,-1.400], y: [-0.005, 0.005], label: 'Thick spikes?' },
];


export default function FractalViewer({ ...props }) {
  const [renderInProgress, setRenderInProgress] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [usingHsl, setUsingHsl] = useState(true);
  const [startColor, setStartColor] = useState({ h: 0, s: 100, l: 50 });
  const [endColor, setEndColor] = useState({ h: 360, s: 100, l: 50 });
  const [bgColor, setBgColor] = useState({ h: 0, s: 0, l: 0 });
  const [colorMode, setColorMode] = useState(ColorModes.LINEAR);
  const [canvasDims, setCanvasDims] = useState({
    height: DEFAULT_MANDELBROT_CANVAS_SIZE,
    width: DEFAULT_MANDELBROT_CANVAS_SIZE,
  });
  const [viewWindowX, setViewWindowX] = useState({ center: 0, range: 4 });
  const [viewWindowY, setViewWindowY] = useState({ center: 0, range: 4 });
  const [numIters, setNumIters] = useState(50);
  const [juliaCoords, setJuliaCoords] = useState({ x: 0, y: 0 });

  // Shorthand for a looong function call. Applies current state to the canvas.
  const updateMandel = () => {
    renderMandelbrot(numIters, startColor, endColor, bgColor, viewWindowX, viewWindowY, colorMode, setRenderInProgress);
  }

  useEffect(() => {
    // Render a fractal on load so things don't start out looking boring :B
    updateMandel();
  }, []);

  // This is a somewhat silly way for different inputs to OPT-IN to automatically
  // re-rendering the fractal when changed, as certain input changes can have
  // cascading effects that won't take effect until the next render cycle. Still
  // thinking about how to make this work better cus it still doesn't do what I
  // want for right-click-zoom updates, but it's otherwise convenient lol
  if (shouldRender) {
    setShouldRender(false);
    updateMandel();
  }

  useEffect(() => {
    renderJulia(juliaCoords, numIters, startColor, endColor, bgColor, colorMode)
  }, [juliaCoords.x, juliaCoords.y]);

  const wrapperClass = 'fractal-viewer' + (renderInProgress ? ' loading' : '');
  return (
    <div className={wrapperClass} {...props}>
      <FractalZoomCanvas canvasId={MANDEL_CANVAS_ID}
        className="mandelbrot-canvas-wrapper"
        height={canvasDims.height}
        width={canvasDims.width}
        onClick={(normalizedCoords) => {
          setJuliaCoords(scaleToEuclideanCoords(normalizedCoords, viewWindowX, viewWindowY));
        }}
        onDragEnd={(dragStart, dragStop) => {
          setViewWindowFromDrag(dragStart, dragStop, viewWindowX, viewWindowY, setViewWindowX, setViewWindowY);
          // TODO|kevin uuuugh well obviously these coords haven't had a chance to
          // be aspect-ratio-normalized yet, which is annoying because I REALLY
          // wanted to handle all the aspect ratio junk at the XYWindowPicker level.
          // I guess I shoulda seen this coming. At least it triggers AN update lmao
          setShouldRender(true);
        }}
        onDoubleClick={(e) => {
          const normalizedCoords = getMouseCoordsWithinEventTarget(e);
          const { x, y } = scaleToEuclideanCoords(normalizedCoords, viewWindowX, viewWindowY);
          // Set the new viewing window to be zoomed in 2x and centered on the double click coords
          setViewWindowX((viewX) => ({ center: x, range: viewX.range / 2 }));
          setViewWindowY((viewY) => ({ center: y, range: viewY.range / 2 }));
          setShouldRender(true);
        }}
      />
      <figure className="julia-container">
        <figcaption className="julia-label">
          Julia Set for <var>z<sup>2</sup></var> + <var>c</var>, where <var>c</var> =
          <br />
          <span className="julia-coords">
            {Complex(juliaCoords.x, juliaCoords.y).toString()}
          </span>
        </figcaption>
        <DurableCanvas canvasId={JULIA_CANVAS_ID}
          className="julia-canvas-wrapper"
          width={MIN_CANVAS_DIMENSION}
          height={MIN_CANVAS_DIMENSION}
        />
      </figure>
      <div id="main-inputs">
        <button className="button render-button"
          onClick={updateMandel}
        >
          Render Fractal
        </button>
        <MandelXYWindowPicker legend="Viewing window coordinates"
          coords={{
            x: viewWindowX,
            y: viewWindowY,
          }}
          onCoordsChange={(coords) => {
            setViewWindowX(coords.x);
            setViewWindowY(coords.y);
          }}
          aspectRatios={{
            x: canvasDims.width,
            y: canvasDims.height,
          }}
        />
      </div>
      <Collapsible regionId="color-controls" label="Color options">
        <label className="hsl-toggle">
          <input
            type="checkbox"
            checked={usingHsl}
            onChange={() => setUsingHsl(_.negate(_.identity))}
          />
          Use HSL?
        </label>
        <FractalColorModeSelect
          colorMode={colorMode}
          onChange={setColorMode}
        />
        <ColorPickerSwitchable legend="Fast Escape"
          initialColor={startColor}
          onColorUpdate={setStartColor}
          usingHsl={usingHsl}
        />
        <ColorPickerSwitchable legend="Slow Escape"
          initialColor={endColor}
          onColorUpdate={setEndColor}
          usingHsl={usingHsl}
        />
        <ColorPickerSwitchable legend="Background Color"
          initialColor={bgColor}
          onColorUpdate={setBgColor}
          usingHsl={usingHsl}
        />
      </Collapsible>
      <Collapsible regionId="image-controls" label="Image controls">
        <DimensionsPicker legend="Canvas Dimensions"
          height={canvasDims.height}
          minHeight={MIN_CANVAS_DIMENSION}
          maxHeight={MAX_CANVAS_DIMENSION}
          width={canvasDims.width}
          minWidth={MIN_CANVAS_DIMENSION}
          maxWidth={MAX_CANVAS_DIMENSION}
          onWidthChange={(w) => setCanvasDims((dims) => ({ width: w, height: dims.height }))}
          onHeightChange={(h) => setCanvasDims((dims) => ({ height: h, width: dims.width }))}
        />
        <label className="num-iterations">
          <span>
            Number of iterations:
          </span>
          {' '}
          <input type="number" className="small-number"
            value={numIters}
            min={1}
            max={MAX_FRACTAL_ITERATIONS}
            step={1}
            onChange={(e) => setNumIters(parseInt(e.target.value))}
          />
        </label>
        <SaveCanvasButton canvasId={MANDEL_CANVAS_ID} />
      </Collapsible>
      <Collapsible regionId="region-buttons" label="Some cool-lookin' regions">
        <ul>
          {COOL_REGIONS.map((regionData, i) => 
            <li key={i}>
              <JumpToViewButton
                {...regionData}
                {...{
                  setViewWindowX,
                  setViewWindowY,
                  setShouldRender,
                  setCanvasDims,
                }}
              />
            </li>
          )}
        </ul>
      </Collapsible>
    </div>
  );
}


function renderJulia(juliaCoords, numSteps, startColor, endColor, bgColor, colorMode) {
  const canvas = durableCanvasRegistry[JULIA_CANVAS_ID];
  const colorMap = makeColorMap(startColor, endColor, numSteps, colorMode);
  const mandelRange = {
    xmin: -2,
    xmax: 2,
    ymin: -2,
    ymax: 2,
  }
  const juliaComplex = new Complex(juliaCoords.x, juliaCoords.y);
  Caman(canvas, function() {
    // Filters won't apply unless we fill the canvas with SOME kind of data first
    // You'd think the documentation would be a bit more explicit about that, but
    // I guess people use Caman for actual image filtering and not to render
    // fractals most of the time :V
    this.fillColor('#ffffff');
    this.juliaset(mandelRange, juliaComplex, colorMap, bgColor);
    this.render();
  });
}

function renderMandelbrot(numSteps, startColor, endColor, bgColor, viewX, viewY, colorMode, setRenderInProgress) {
  setRenderInProgress(true);
  const canvas = durableCanvasRegistry[MANDEL_CANVAS_ID];
  const colorMap = makeColorMap(startColor, endColor, numSteps, colorMode);
  const [xmin, xmax] = rangeToBounds(viewX.center, viewX.range);
  const [ymin, ymax] = rangeToBounds(viewY.center, viewY.range);
  const mandelRange = { xmin, xmax, ymin, ymax };

  Caman(canvas, function () {
    // Filters won't apply unless we fill the canvas with SOME kind of data first
    this.fillColor('#ffffff');
    const dims = this.dimensions;
    this.camandel(mandelRange, colorMap, bgColor);
    this.render(() => setRenderInProgress(false));
  });
}

function scaleToEuclideanCoords(normalizedCoords, viewWindowX, viewWindowY) {
  const xmin = viewWindowX.center - (viewWindowX.range / 2);
  const ymin = viewWindowY.center - (viewWindowY.range / 2);
  const x = xmin + (normalizedCoords.x * viewWindowX.range);
  const y = ymin + (normalizedCoords.y * viewWindowY.range);
  return { x, y };
}

function setViewWindowFromDrag(dragStart, dragStop, viewWindowX, viewWindowY, setViewWindowX, setViewWindowY) {
  const [xminNorm, xmaxNorm] = [dragStart.x, dragStop.x].sort();
  const [yminNorm, ymaxNorm] = [dragStart.y, dragStop.y].sort();

  const [xStart, ] = rangeToBounds(viewWindowX.center, viewWindowX.range);
  const [yStart, ] = rangeToBounds(viewWindowY.center, viewWindowY.range);
  const xmin = xStart + (xminNorm * viewWindowX.range);
  const xmax = xStart + (xmaxNorm * viewWindowX.range);
  const ymin = yStart + (yminNorm * viewWindowY.range);
  const ymax = yStart + (ymaxNorm * viewWindowY.range);
  const viewX = {};
  const viewY = {};
  [viewX.center, viewX.range] = boundsToRange(xmin, xmax);
  [viewY.center, viewY.range] = boundsToRange(ymin, ymax);
  setViewWindowX(viewX);
  setViewWindowY(viewY);
  return {x: viewX, y: viewY};
}
