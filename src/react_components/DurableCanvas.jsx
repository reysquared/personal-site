import React from 'react';

// TODO|kevin the goal with this component is to have a canvas object that
// renders some properties and then DOES NOT CHANGE THROUGH REACT.
// Fractal rendering is intensive and I DO NOT WANT React to handle ANY
// updates to the actual canvas, but I need it to be rendered as part of
// a react component that wraps it in UI. I can probably explain this better lol
// but anyway, this component should ONLY be re-rendered by react if its width/height
// props are modified. 

// adapted from https://www.madebymike.com.au/writing/getting-the-heck-out-of-react/
export const durableCanvasRegistry = {};

// TODO|kevin ....... this MIGHT be all I need? wanna try a functional version though.
// export class DurableCanvas extends React.Component {
//   constructor({ props }) {
//     super(props);
//     const { canvasId, width, height } = props;
//     // TODO|kevin honestly should probably error if canvasId isn't specified
//     this.canvasContainer = React.createRef();
//     if (!durableCanvasRegistry[canvasId]) {
//       const newCanvas = document.createElement('canvas');
//       newCanvas.id = canvasId;
//       newCanvas.width = width;
//       newCanvas.height = height;
//       durableCanvasRegistry[canvasId] = newCanvas;
//     }
//     this.canvas = durableCanvasRegistry[canvasId];
//   }

//   componentDidMount() {
//     this.canvasContainer.current.appendChild(this.canvas);
//   }

//   render() {
//     return <div ref={this.canvasContainer} />;
//   }
// }


export default function DurableCanvas({ canvasId, height, width, ...props }) {
    // TODO|kevin honestly should probably throw if canvasId isn't specified
    if (!durableCanvasRegistry[canvasId]) {
      const newCanvas = document.createElement('canvas');
      newCanvas.id = canvasId;
      newCanvas.setAttribute('data-caman-hidpi-disabled', true);
      // TODO|kevin actually, maybe the width and height setting should be outside...?
      durableCanvasRegistry[canvasId] = newCanvas;
    }
    const canvasContainer = React.useRef();
    const canvas = durableCanvasRegistry[canvasId];
    
    React.useEffect(() => {
      // TODO|kevin pretty sure I wanna set width and height in here.
      // I MAY also want to do s/t like clear the context?
      // TODO|kevin although maybe this should only happen on mount (deps = [])
      // cus we SHOULD be re-rendering and therefore re-mounting when any props
      // change to begin with, right? this might be kinda stupid
      if (height) {
        canvas.height = height;
        canvas.style.height = height;
        canvas.setAttribute('data-camanheight', height);
      }
      if (width) {
        canvas.width = width;
        canvas.style.width = width;
        canvas.setAttribute('data-camanwidth', width);
      }
    }, [height, width]);

    React.useEffect(() => {
      // Separate non-prop-scoped useEffect call to handle appending the actual canvas element
      canvasContainer.current.appendChild(canvas);
    });

    // Spread arbitrary ...props from the args so that we can attach arbitrary
    // click handlers on DurableCanvas components from the parent and have them
    // automatically passed through to the canvas wrapper element
    return <div ref={canvasContainer} {...props} />;
}
