import React, { StrictMode } from 'react';
import ReactDOMClient from 'react-dom/client';

import ThemeSwitcher from 'react_components/ThemeSwitcher';

// TODO|kevin I feel like I might be able to do some webpack magic to reduce some
// redundancy between this and the other bundles. idk though.
document.addEventListener('DOMContentLoaded', () => {
  // TODO|kevin stuff to do when the document loads! this... MIGHT be everything at this level though?
  const rootEl = document.getElementById('theme-toggle-container');
  const root = ReactDOMClient.createRoot(rootEl);
  // TODO|kevin StrictMode component is only for debugging, remove later!
  root.render(
    <StrictMode>
      <ThemeSwitcher />
    </StrictMode>
  );
});