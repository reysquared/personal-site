import React, { StrictMode } from 'react';
import ReactDOMClient from 'react-dom/client';

import CaesarSolver from 'react_components/CaesarSolver';

document.addEventListener('DOMContentLoaded', () => {
  const rootEl = document.getElementById('caesar-solver');
  const root = ReactDOMClient.createRoot(rootEl);
  // TODO|kevin StrictMode component is only for debugging, remove later!
  root.render(
    <StrictMode>
      <CaesarSolver initialText="Jul abg tvir vg n fcva?" initialRotation={13} />
    </StrictMode>
  );
});