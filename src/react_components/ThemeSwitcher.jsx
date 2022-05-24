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

  // TODO|kevin boy howdy this needs SO MUCH WORK but screw it lets just see if the dang ol checkbox itself works
  return (
    <>
      <label></label>
      <label id="theme-toggle">
        <input
          type="checkbox"
          onChange={setTheme}
          defaultChecked={defaultDark}
        />
      </label>
    </>
  );
}
// TODO|kevin lessgooo

/*
<label className="theme-toggle">
  <input type="checkbox" id="theme-switcher" />
  <div className="theme-slider"></div>
</label>
// I think this second one is more like what I want actually? some folks make the
// point that a checkbox CAN imply a form submission instead of an immediate toggle?
<label for="toggle">Important binary setting
<button type="button" id="toggle" role="switch" aria-checked="true">
  <span>on</span><span>off</span>  
</button>
</label>
*/