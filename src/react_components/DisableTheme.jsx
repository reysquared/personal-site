import _ from 'lodash';
import React from 'react';

const BORINGMODE_LOCALSTORAGE = "boringmode"

export default function DisableTheme({ ...props }) {
  const [isBoring, setIsBoring] = React.useState(getBoringModeStartState())

  React.useEffect(() => {
    document.body.classList.toggle("boring-mode", isBoring);
    localStorage.setItem(BORINGMODE_LOCALSTORAGE, isBoring ? "enabled" : "disabled");
  }, [isBoring]);

  return (
    <input
      type="checkbox"
      onChange={(e) => {
        setIsBoring(e.currentTarget.checked)
      }}
      checked={isBoring}
      {...props}
    />
  );
}

function getBoringModeStartState() {
  const localPref = localStorage.getItem(BORINGMODE_LOCALSTORAGE);
  if (localPref === "enabled") {
    return true;
  }
  if (localPref === "disabled") {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
