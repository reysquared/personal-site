import React from 'react';
import { DEFAULT_TAB } from 'react_components/constants';

// TODO|kevin I should probably install lodash as a dependency
export default function ReturnButton({ setActiveTab }) {
  // TODO|kevin make sure these aria roles aren't totally busted lolol
  const clickHandler = (event) => {
    event.preventDefault();
    setActiveTab(DEFAULT_TAB);
    // TODO|kevin do some URL rewriting here yeah? clear out URL hash
  };
  return (
    <a
      className="button go-back"
      href="#top"
      onClick={clickHandler}
      role="tab"
      aria-controls="default"
      aria-selected="false"
    >
      Main
    </a>
  );
}