import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';

import { getMouseCoordsWithinEventTarget } from 'helpers/misc';
import DurableCanvas from 'react_components/DurableCanvas';


const DRAG_RECTANGLE_CLASS = 'drag-rect';

// This encapsulates some of the logic around interactions w/ the factal canvas
// such as converting click events and right-click-drag events into normalized
// relative coordinates between [0,1]. Origin is treated as in the lower left.
export default function FractalZoomCanvas({ canvasId, height, width, onClick, onDragEnd, ...props }) {
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState(nullCoords());
  const [dragPos, setDragPos] = useState(nullCoords());

  const canvasContainer = useRef();

  // useEffect to fire the onDragEnd handler
  useEffect(() => {
    if (dragging) return;  // Clearly the drag hasn't ended yet!

    // Only fire onDragEnd if the mouse has moved since the drag initiated.
    // Don't want to zoom the canvas in on a single solid-color point.
    if (!_.isEqual(dragStart, dragPos)) {
      onDragEnd && onDragEnd(dragStart, dragPos);
    }
    // Reset dragging state
    setDragStart(nullCoords());
    setDragPos(nullCoords());
  }, [dragging]);

  // useEffect to draw the right-click-drag rectangle. I dunno if this is really
  // the best way to handle this, but it works and it seems pretty smooth tbh!
  useEffect(() => {
    let dragRect = canvasContainer.current.querySelector(`div.${DRAG_RECTANGLE_CLASS}`);
    if (_.isEqual(dragPos, nullCoords())) {
      // If the change in dragPos is that it was set to null, then we shouldn't
      // be showing a drag rectangle, so remove it (if present) and return early
      dragRect && dragRect.parentNode.removeChild(dragRect);
      return;
    }
    if (!dragRect) {
      dragRect = document.createElement('div');
      dragRect.classList.add(DRAG_RECTANGLE_CLASS);
      canvasContainer.current.appendChild(dragRect);
    }
    Object.assign(dragRect.style, dragCoordsToPositionStyles(dragStart, dragPos));
  }, [dragStart.x, dragStart.y, dragPos.x, dragPos.y]);

  return (
    <DurableCanvas canvasId={canvasId}
      ref={canvasContainer}
      height={height}
      width={width}
      onClick={handleCanvasClick(onClick)}
      onContextMenu={(e) => {e.preventDefault(); return false;}}
      onMouseDown={handleRightMouseDown(setDragging, setDragStart)}
      onMouseMove={handleMouseMove(dragging, setDragPos)}
      onMouseUp={handleRightMouseUp(setDragging, setDragPos)}
      // Treat mouseleave the same as mouseup so the drag automatically ends if
      // you drag beyond the bounds of the canvas container. Keeps things neat.
      onMouseLeave={handleRightMouseUp(setDragging, setDragPos)}

      {...props}
    />
  );
}

function handleCanvasClick(onClick) {
  return (e) => (onClick && onClick(getMouseCoordsWithinEventTarget(e)));
}

function handleRightMouseDown(setDragging, setDragStart) {
  return (e) => {
    if (e.button !== 2) return;  // Right clicking only!
    e.preventDefault();
    setDragging(true);
    setDragStart(getMouseCoordsWithinEventTarget(e));
    return false;
  };
}

function handleRightMouseUp(setDragging, setDragPos) {
  return (e) => {
    if (e.button !== 2) return;  // Right clicking only!
    e.preventDefault();
    setDragPos(getMouseCoordsWithinEventTarget(e));
    setDragging(false);
    return false;
  };
}

function handleMouseMove(dragging, setDragPos) {
  return (e) => {
    if (!dragging) return;  // mouseMove handler ONLY updates drag position
    setDragPos(getMouseCoordsWithinEventTarget(e));
  };
}

// Takes two [0,1]-normalized coordinates and converts them to a dict of CSS
// position properties (left, right, top, bottom) to define a bounding box
function dragCoordsToPositionStyles(dragStart, dragPos) {
  if (_.isEqual(dragStart, nullCoords()) || _.isEqual(dragPos, nullCoords())) {
    throw 'Attempted to draw a drag rectangle with a null coordinate';
  }

  const [xmin, xmax] = [dragStart.x, dragPos.x].sort();
  const [ymin, ymax] = [dragStart.y, dragPos.y].sort();
  // basic idea: use the [0,1] normalized coordinates directly to create %-based
  // positioning properties! all coordinates assume origin in LOWER LEFT corner!
  return {
    top: `${_.round((1 - ymax) * 100, 2)}%`,
    bottom: `${_.round(ymin * 100, 2)}%`,
    left: `${_.round(xmin * 100, 2)}%`,
    right: `${_.round((1 - xmax) * 100, 2)}%`,
  }
}

function nullCoords() {
  return { x: null, y: null };
}
