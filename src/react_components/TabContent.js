import React from 'react';

// TODO|kevin this SHOULD be convertible to a purely functional component
export default class TabContent extends React.Component {
  render() {
    return (
      <section id={this.props.label} class="tab-panel">{this.props.tabContent}</section>
    );
  }
}