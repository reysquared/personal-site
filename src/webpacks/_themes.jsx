import React, { StrictMode } from 'react';
import ReactDOMClient from 'react-dom/client';

import ThemeSwitcher from 'react_components/ThemeSwitcher';


document.addEventListener('DOMContentLoaded', () => {
  const rootEl = document.getElementById('theme-toggle-container');
  const root = ReactDOMClient.createRoot(rootEl);

  root.render(
    <StrictMode>
      <ThemeSwitcher />
    </StrictMode>
  );
});