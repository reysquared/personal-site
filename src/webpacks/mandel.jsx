import React, { StrictMode } from 'react';
import ReactDOMClient from 'react-dom/client';

import { camandel, juliaset, makeColorMap } from 'helpers/mandel';
import FractalViewer from 'react_components/FractalViewer';

document.addEventListener('DOMContentLoaded', () => {
  Caman.Filter.register('camandel', camandel);
  Caman.Filter.register('juliaset', juliaset);

  const rootEl = document.getElementById('fractal-viewer-root');
  const root = ReactDOMClient.createRoot(rootEl);

  root.render(
    <StrictMode>
      <FractalViewer />
    </StrictMode>
  );
});