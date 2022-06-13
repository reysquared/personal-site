import React from 'react';
import { DEFAULT_TAB } from 'react_components/constants';


export default function ReturnButton({ setActiveTab }) {
  const clickHandler = (event) => {
    event.preventDefault();
    setActiveTab(DEFAULT_TAB);
    // simple lil' hook for the url hash-routing, cus I'm too lazy to install
    // react-router on a serverless host when HashRouter is deprecated anyway
    window.history.pushState(null, null, '#');
  };
  return (
    <a
      className="button go-back"
      href="#top"
      onClick={clickHandler}
      role="button"
      aria-controls="default"
    >
      Main
    </a>
  );
}