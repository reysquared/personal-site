import React from 'react';

export default function ThemeSwitcher({props}) {
  const currentTheme = localStorage.getItem('theme');
  const preferDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const defaultDark = currentTheme === 'dark' || (!currentTheme && preferDark);

  if (currentTheme) {
    document.body.setAttribute('data-theme', currentTheme);
  }

  const setTheme = (event) => {
    if (event.target.checked) {
      document.body.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  };

  // TODO|kevin boy howdy I have very little confidence in the ARIA setup here
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
