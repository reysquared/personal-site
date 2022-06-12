import React from 'react';

// The goal for this component is to have a canvas object that renders some
// properties and then gets left the hell alone by React so it doesn't totally
// blow away the canvas state with its interminable UPDATES!!! >:C Rendering
// fractals is at least a LITTLE intensive, you know.

// Approach adapted from https://www.madebymike.com.au/writing/getting-the-heck-out-of-react/
export const durableCanvasRegistry = {};

// Forwards ref so that other components can do stuff inside the wrapper div as
// desired. FractalZoomCanvas uses this to render a right-click-drag rectangle.
function DurableCanvas({ canvasId, height, width, ...props }, ref) {
    if (!canvasId) throw 'DurableCanvas instances must specify a canvasId';

    if (!durableCanvasRegistry[canvasId]) {
      const newCanvas = document.createElement('canvas');
      newCanvas.id = canvasId;
      newCanvas.setAttribute('data-caman-hidpi-disabled', true);
      durableCanvasRegistry[canvasId] = newCanvas;
    }
    // We need SOME ref so we can append the canvas to the DOM element after
    // mounting, but we're fine with using our parent's ref if they provide one
    const canvasContainer = ref || React.useRef();
    const canvas = durableCanvasRegistry[canvasId];

    React.useEffect(() => {
      if (height) {
        canvas.height = height;
        canvas.setAttribute('data-camanheight', height);
      }
      if (width) {
        canvas.width = width;
        canvas.setAttribute('data-camanwidth', width);
      }
      // Fool Caman into thinking this canvas hasn't been Caman'd before, pretty
      // much? Otherwise it seems to ignore the dimension change and gets weird.
      canvas.removeAttribute('data-caman-id');
    }, [height, width]);

    React.useEffect(() => {
      // A non-scoped useEffect handles appending the actual canvas element. As
      // appendChild relocates the node to its new parent, this is idempotent.
      canvasContainer.current.appendChild(canvas);
    });

    // Passing through ...props is mostly intended for attaching arbitrary click
    // handlers on the canvas wrapper element
    return <div ref={canvasContainer} {...props} />;
}
export default DurableCanvas = React.forwardRef(DurableCanvas);
