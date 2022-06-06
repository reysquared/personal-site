import Complex from 'complex.js';
import React, { useEffect, useState } from 'react';

import { makeColorMap } from 'helpers/mandel';
import { getMouseCoordsWithinEventTarget } from 'helpers/misc';
import Collapsible from 'react_components/Collapsible';
import { ColorPickerSwitchable } from 'react_components/ColorPicker';
import { MandelXYWindowPicker } from 'react_components/CoordinateWindowPicker';
import DimensionsPicker from 'react_components/DimensionsPicker';
import DurableCanvas, { durableCanvasRegistry } from 'react_components/DurableCanvas';

const JULIA_CANVAS_ID = 'julia-canvas';
const MANDEL_CANVAS_ID = 'mandelbrot-canvas';

const MIN_CANVAS_DIMENSION = 200;  // TODO|kevin might need tweaking
const MAX_CANVAS_DIMENSION = 2000;  // TODO|kevin REALLY might need tweaking lmao
const MAX_FRACTAL_ITERATIONS = 50;  // TODO|kevin planning to have an input for this ultimately

// TODO|kevin WELL. obviously this needs a lot of stuff here.

/**
  what does it need?
  INPUTS
    color inputs
    dimensions inputs
  RENDER BUTTON
  OUTPUT CANVAS
  also, ideally we don't want output canvas to change UNLESS we have hit the
  render button! re-rending it every time seems stupid as all hell!

  advanced:
  JULIA COORDS
  JULIA OUTPUT
  requires also being able to use the FIRST output canvas as a click input
  I mean, we COULD have Julia Coords as its own input (pair), but I'd rather
  be able to click-and-drag and have the coords readout update along with the
  render!

  TODO|kevin ahhh this could also probably do with a numSteps input huh
 */

// TODO|kevin need a RESET ALL INPUTS button, both for user convenience and to
// verify that I'm ACTUALLY handling all this state/rendering correctly lol

export default function FractalViewer({ ...props }) {
  // TODO|kevin not POSITIVE about using this loading pattern, but we'll see!
  // if yes, this should really be reflected in the wrapping div className!
  const [renderInProgress, setRenderInProgress] = useState(false);
  const [usingHsl, setUsingHsl] = useState(true);
  const [startColor, setStartColor] = useState({ h: 0, s: 100, l: 50 });
  const [endColor, setEndColor] = useState({ h: 360, s: 100, l: 50 });
  const [bgColor, setBgColor] = useState({ h: 0, s: 0, l: 0 });
  const [canvasDims, setCanvasDims] = useState({
    height: 500,
    width: 500,
  });
  const [viewWindowX, setViewWindowX] = useState({
    value: 0,
    range: 2,
  });
  const [viewWindowY, setViewWindowY] = useState({
    value: 0,
    range: 2,
  });
  const [juliaCoords, setJuliaCoords] = useState({ x: 0, y: 0 });
  // TODO|kevin finish this component, duh, lmao
  // TODO|kevin add a `loading` class if renderInProgress

  // useEffect(() => {
  //   // TODO|kevin render a julia set to the JULIA_CANVAS_ID
  // }, [juliaCoords]);
  useEffect(() => {
    renderMandelbrot(MAX_FRACTAL_ITERATIONS, startColor, endColor, bgColor, viewWindowX, viewWindowY, usingHsl, setRenderInProgress);
  }, []);

  const wrapperClass = 'fractal-viewer' + (renderInProgress ? ' loading' : '');
  return (
    <div className={wrapperClass} {...props}>
      <DurableCanvas canvasId={MANDEL_CANVAS_ID}
        className="mandelbrot-canvas-wrapper"
        height={canvasDims.height}
        width={canvasDims.width}
        // TODO|kevin whoops, wait, these coords are NOT normalized to the view,
        // they are in fact just the pixel location in the canvas lmfao
        onMouseDown={(e) => setJuliaCoords(getMouseCoordsWithinEventTarget(e))}
      />
      <div className="main-inputs">
        <label>
          <input
            type="checkbox"
            checked={usingHsl}
            // TODO|kevin I could potentially have a [usingHsl]-only useEffect that re-normalizes state colors...
            onChange={() => setUsingHsl(_.negate(_.identity))}
          />
          Use HSL?
        </label>
        {/* I dunno bud, this is element hierarchy is gettin a bit weird lol.
          do I want ALL the inputs inside a Collapsible or only SOME?
          TODO|kevin also I have a sneaking suspicion I have to wrap these
          setColors better than this lol, idk if it chokes on the second arg? */}
        <ColorPickerSwitchable legend="Start Color"
          initialColor={startColor}
          onColorUpdate={setStartColor}
          usingHsl={usingHsl}
        />
        <ColorPickerSwitchable legend="End Color"
          initialColor={endColor}
          onColorUpdate={setEndColor}
          usingHsl={usingHsl}
        />
        {/* TODO|kevin does this component need to be passed values/ranges from state? */}
        <MandelXYWindowPicker legend="Viewing Window Coordinates"
          onCoordsChange={(coords) => {
            setViewWindowX(coords.x);
            setViewWindowY(coords.y);
          }}
          aspectRatios={{
            // x: canvasDims.width,
            // y: canvasDims.height,
            x: 1,
            y: 1,
          }}
        />
        <button className="button"
          onClick={() => renderMandelbrot(MAX_FRACTAL_ITERATIONS, startColor, endColor, bgColor, viewWindowX, viewWindowY, usingHsl, setRenderInProgress)}
        >
          Render Fractal
        </button>
      </div>
      <span className="julia-coords">{`JULIA COORDS X: ${juliaCoords.x} Y: ${juliaCoords.y}`}</span>
      <DurableCanvas canvasId={JULIA_CANVAS_ID}
        className="julia-canvas-wrapper"
        width={MIN_CANVAS_DIMENSION}
        height={MIN_CANVAS_DIMENSION}
      />
      {/* TODO|kevin pass a .more-inputs here somewhere */}
      <Collapsible>
        {/* <DimensionsPicker legend="Canvas Dimensions"
          startHeight={canvasDims.height}
          minHeight={MIN_CANVAS_DIMENSION}
          maxHeight={MAX_CANVAS_DIMENSION}
          startWidth={canvasDims.width}
          minWidth={MIN_CANVAS_DIMENSION}
          maxWidth={MAX_CANVAS_DIMENSION}
          onWidthChange={(w) => setCanvasDims((dims) => ({ width: w, height: dims.height }))}
          onHeightChange={(h) => setCanvasDims((dims) => ({ height: h, width: dims.width }))}
        /> */}
        <ColorPickerSwitchable legend="Background Color"
          initialColor={bgColor}
          onColorUpdate={setBgColor}
          usingHsl={usingHsl}
        />
      </Collapsible>
    </div>
  );
}

// TODO|kevin ehhhh... this is so many args, can it be reduced at ALL?
function renderJulia(juliaCoords, numSteps, startColor, endColor, bgColor, usingHsl, setRenderInProgress) {
  setRenderInProgress(true);
  const canvas = durableCanvasRegistry[JULIA_CANVAS_ID];
  const colorMap = makeColorMap(
    startColor,
    endColor,
    numSteps,
  );
  const mandelRange = {
    xmin: -2,
    xmax: 2,
    ymin: -2,
    ymax: 2,
  }
  const juliaComplex = new Complex(juliaCoords.x, juliaCoords.y);
  Caman(canvas, function() {
    this.juliaset(mandelRange, juliaComplex, colorMap, bgColor, () => {
      console.error('TODO|kevin omg the callback worked even for custom function!');
      Caman(canvas, function() {
        this.reloadCanvasData();
      })
    });
    this.render(() => {
      setRenderInProgress(false);
    });
  });
}

function renderMandelbrot(numSteps, startColor, endColor, bgColor, viewX, viewY, usingHsl, setRenderInProgress) {
  console.error('TODO|kevin WOOOHOOOOOOO RENDERING A MANDELBROT');
  console.error(JSON.stringify(arguments));
  setRenderInProgress(true);
  const canvas = durableCanvasRegistry[MANDEL_CANVAS_ID];
  const canvas2 = document.getElementById(MANDEL_CANVAS_ID);
  console.error('TODO|kevin is our durable registry actually whats in the document?');
  console.error(canvas === canvas2);
  console.error(document.body.contains(canvas));
  console.error(document.body.contains(canvas2));
  /////// TODO|kevin lets just retry some of that bullshit nonsense I was doing in the entry point file
  // const clone = canvas.cloneNode(true);
  // console.error('OKAY THIS ONE better be false');
  // console.error(document.body.contains(clone));
  // // clone.height=160;
  // // clone.width = 160;
  // // // // Clone the image stored in the canvas as well
  // // // clone.getContext('2d').drawImage(canvas, 0, 0, 160, 160);
  // const theParent = canvas.parent;
  // theParent.removeChild(canvas);
  // theParent.appendChild(clone);
  ////////// TODO|kevin end bullshit nonsense! ,,,,,, sort of.
  const colorMap = makeColorMap(
    startColor,
    endColor,
    numSteps,
  );
  const mandelRange = {
    xmin: viewX.value - (viewX.range / 2),
    xmax: viewX.value + (viewX.range / 2),
    ymin: viewY.value - (viewY.range / 2),
    ymax: viewY.value + (viewY.range / 2),
  }
  // TODO|kevin having issues with actually passing the canvas element, so,
  // let's try just selecting it from the DOM again...??????
  Caman(canvas, function () {
    this.fillColor('#ffffff');  // TODO|kevin Caman DOES NOT WORK unless I fill
    // the canvas with SOME kind of data beforehand. that took way too fucking long to figure out.
    console.error('TODO|kevin inside actual Caman call... lessee what context we can see');
    console.error(this.context);
    console.error(this.context.canvas === canvas2);
    const dims = this.dimensions;
    // if (dims.height !== canvasDims.height || dims.width !== canvasDims.width) {
    //   this.resize(canvasDims).render();
    // }
    console.error('canvas dims according to this.dimensions:')
    console.error(JSON.stringify(dims));
    console.error('canvas dims according to the `canvas` var we passed in:');
    console.error(`height: ${canvas.height} width: ${canvas.width}`);
    const imageData = this.context.getImageData(0, 0, canvas.width, canvas.height);
    console.error('Pre-render pixel data');
    console.error(imageData.data);
    this.camandel(mandelRange, colorMap, bgColor, () => {
      console.error('TODO|kevin omg the callback worked even for custom function!');
      Caman(canvas, function () {
        this.reloadCanvasData();
      })
    });
    this.render(() => {
      console.error('TODO|kevin FRACTAL RENDERING FINISHED!!!!!! nominally');
      console.error('post-render pixel data');
      const theEl = document.getElementById('mandelbrot-canvas');
      const ctx = theEl.getContext('2d');
      console.error(ctx);
      console.error(ctx.getImageData(0, 0, theEl.width, theEl.height).data);
      setRenderInProgress(false);
    });
  });
}

// function setNormalizedColor()

