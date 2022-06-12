import React from 'react';

import { supportsLocalStorage } from 'helpers/misc';

export default function ThemeSwitcher({props}) {
  const currentTheme = (supportsLocalStorage() && localStorage.getItem('theme'));
  const preferDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const defaultDark = currentTheme === 'dark' || (!currentTheme && preferDark);

  if (currentTheme) {
    document.body.setAttribute('data-theme', currentTheme);
  }

  return (
    <label
      id="theme-toggle"
    >
      <span className="theme-header">Theme</span>
      <input
        type="checkbox"
        onChange={setDocumentTheme}
        defaultChecked={defaultDark}
        role="switch"
        aria-label="Enable dark mode"
      />
      <span className="theme-slider" aria-hidden="true">&nbsp;</span>
    </label>
  );
}

function setDocumentTheme(event) {
  const targetTheme = (event.target.checked ? 'dark' : 'light');
  document.body.setAttribute('data-theme', targetTheme);
  if (supportsLocalStorage()) {
    localStorage.setItem('theme', targetTheme);
  }
}
