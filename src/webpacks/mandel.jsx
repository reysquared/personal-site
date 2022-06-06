import React, { StrictMode } from 'react';
import ReactDOMClient from 'react-dom/client';
import BigNumber from 'bignumber.js';
// import caman from 'caman';  // TODO|kevin okay so something INCREDIBLY stupid is
// happening where this module when run defines Caman on the window but DOESN'T
// actually export anything? I guess? so I import it as lowercase-caman instead
// for the time being. but I should really sort that bullshit out oh my fucking god

import { camandel, juliaset, makeColorMap } from 'helpers/mandel';
import FractalViewer from 'react_components/FractalViewer';

document.addEventListener('DOMContentLoaded', () => {
  // TODO|kevin should this happen HERE??? or maybe in a useEffect in the
  // actual FractalViewer component...? also, do I want to render a fractal
  // right off the bat or require a button press? PROBABLY the former right?
  Caman.Filter.register('camandel', camandel);
  Caman.Filter.register('juliaset', juliaset);

  const rootEl = document.getElementById('mandel-canvas-container');
  const root = ReactDOMClient.createRoot(rootEl);

  console.error('TODO|kevin I guess its also good to at least be sure we get THIS far huh');
  root.render(
    <StrictMode>
      <FractalViewer />
    </StrictMode>
  );
  // const numSteps = 30;
  // const colorMap = makeColorMap(
  //   {h: 0, s: 100, l: 50},
  //   {h: 360, s: 100, l: 50},
  //   numSteps,
  // );

  // const mandelRange = {
  //   xmin: -2,
  //   xmax: 2,
  //   ymin: -2,
  //   ymax: 2,
  // }

  // const bgColor = {r: 0, g: 0, b: 0};  // TODO|kevin maybe provide this in hsl once that's supported?

  // console.error('TODO|kevin cool at least SOMETHING is actually running');
  // console.error(Caman);
  // console.error(window.Caman);

  // var canvas = document.getElementById('edit-canvas');
  // const clone = canvas.cloneNode(true);
  // // clone.height=160;
  // // clone.width = 160;
  // // // // Clone the image stored in the canvas as well
  // // // clone.getContext('2d').drawImage(canvas, 0, 0, 160, 160);
  // const theParent = document.getElementById('mandel-canvas-container');
  // theParent.removeChild(document.getElementById('edit-canvas'));
  // theParent.appendChild(clone);


  // document.getElementById('mandelbutton').addEventListener('click', () => {
  //   Caman('#edit-canvas', function() {
  //     // this.reloadCanvasData();
  //     // const canvas = document.createElement('canvas');
  //     // canvas.width = 160;
  //     // canvas.height = 160;
  //     // this.replaceCanvas(canvas);  // I don't fucking know dude

  //     this.fillColor('#ff0000');
  //     // this.render();
  
  //     this.camandel(mandelRange, colorMap, bgColor);
      
  //     console.error('TODO|kevin ok fxn applied......... in theory');
  //     this.render(() => {
  //       console.error('TODO|kevin ok now were REALLY done renderin');
  //       // this.reloadCanvasData();
  //     });
  //     console.error('rendering... done?????');
  //   });
  // });
});