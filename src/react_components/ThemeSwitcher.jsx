import React from 'react';

import { supportsLocalStorage } from 'helpers/misc';

export default function ThemeSwitcher({props}) {
  const canStore = supportsLocalStorage();
  const currentTheme = (canStore && localStorage.getItem('theme'));
  const preferDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const defaultDark = currentTheme === 'dark' || (!currentTheme && preferDark);

  if (currentTheme) {
    document.body.setAttribute('data-theme', currentTheme);
  }

  const setTheme = (event) => {
    const targetTheme = (event.target.checked ? 'dark' : 'light');
    document.body.setAttribute('data-theme', targetTheme);
    if (canStore) {
      localStorage.setItem('theme', 'targetTheme');
    }
  };

  // TODO|kevin TEST WITH SCREEN READER BLAAARRGRHRGHG
  return (
    <label
      id="theme-toggle"
    >
      <span className="theme-header">Theme</span>
      <input
        type="checkbox"
        onChange={setTheme}
        defaultChecked={defaultDark}
        role="switch"
        aria-label="Enable dark mode"
      />
      <span className="theme-slider" aria-hidden="true">&nbsp;</span>
    </label>
  );
}
