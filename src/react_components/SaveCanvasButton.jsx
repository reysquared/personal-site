import React from 'react';

export default function SaveCanvasButton({ canvasId }) {
  const canvas = document.getElementById(canvasId);
  return (
    <button
      className="button save-canvas"
      onClick={() => {
        const dataURL = canvas.toDataURL('image/png');
        const newTab = window.open('about:blank', 'Canvas image (right click to save)');
        newTab.document.write(`<img src="${dataURL}" alt="Image data from canvas">`);
      }}
    >
      Save Canvas
    </button>
  );
}
