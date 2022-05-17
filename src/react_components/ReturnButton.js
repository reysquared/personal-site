import React from 'react';

// TODO|kevin a component for each tab's "return to home" button
// TODO|kevin this SHOULD be convertible to a purely functional component
// TODO|kevin I should probably install lodash as a dependency
export default class TabButton extends React.Component {
  render() {
    // TODO|kevin needs an onClick!
    return (
      <a class="button go-back" href="#top">Main</a>
    );
  }
}