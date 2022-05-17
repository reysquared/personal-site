import React from 'react';
import HTMLReactParser from 'html-react-parser';

// TODO|kevin this SHOULD be convertible to a purely functional component
// TODO|kevin depending on how I get routing to work, the go-back button should
// MAYBE also be its own React component
export default class TabContent extends React.Component {
  render() {
    return (
      <section id={this.props.label} class="tab-panel">
        {HTMLReactParser(this.props.tabContent)}
        <a class="button go-back" href="#top">Main</a><br/><br/>
      </section>
    );
  }
}