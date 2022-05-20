import React from 'react';
import { DEFAULT_TAB } from 'react_components/constants';

// TODO|kevin a component for each tab's "return to home" button
// TODO|kevin this SHOULD be convertible to a purely functional component
// TODO|kevin I should probably install lodash as a dependency
// TODO|kevin oh yeah, the click handling this should PROBABLY also do a history
// pushstate to specifically clear out the URL hash, since it's sort of a special case TabButton
export default class ReturnButton extends React.Component {
  render() {
    // TODO|kevin needs an onClick! but uhhhh maybe not defined at this level actually?
    // TODO|kevin possibly this should also have aria roles...
    return (
      <a className="button go-back" href="#top">Main</a>
    );
  }
}