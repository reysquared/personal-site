import React from 'react';

export default class TabsView extends React.Component {
  constructor(props) {
    super(props);
    // TODO|kevin How to handle "default" tab?  

    this.state = {
      // TODO|kevin not so sure about this, the demo I was looking at does some PropTypes junk...?
      activeTab: this.props.children[0].props.label,
    };
  }

  setActiveTab = (tab) => {
    this.setState({ activeTab: tab });
  }

  // TODO|kevin what I WANT to do is to render ALL of the tab content but have
  // them react to the activeTab state in terms of whether they are displayed.
  // This would degrade the most neatly to a JS-free webpage, but I think would
  // require some pre-rendering that I'm not currently doing to work w/o React.
  // Then, the idea is that re-rendering in response to activeTab changing should
  // ONLY require changing the classes on the tabcontent/tabnav divs, rather than
  // actually changing the content of any div
  render() {
    return (
      <div id="main-content">
        <nav class="tabs-menu">
          <ul class="tabs-list">
          </ul>
        </nav>
        <div id="tabs-content">
        </div>
      </div>
    );
  }
}