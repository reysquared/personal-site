import React from 'react';
import TabButton from 'react_components/TabButton';
import TabContent from 'react_components/TabContent';
import { DEFAULT_TAB } from 'react_components/constants';


export default class TabsView extends React.Component {
  constructor(props) {
    super(props);
    // TODO|kevin maybe I should also create a hasDefault prop honestly

    // Ideally if you want a "default" tab it should be first in the list, but
    // if it isn't the Go Back buttons will still work correctly, so this just
    // has the first tab in the list start activated. Shrugs. TODO|kevin update comments lol
    // TODO|kevin perhaps should throw an error if hasDefaultTab but there's no tab with the "default" id
    const startingTab = props.hasDefaultTab ? DEFAULT_TAB : props.tabs[0].tabId;
    const activeTab = props.activeTab || startingTab;
    // TODO|kevin should only fall back to default if there IS a default tab!
    // ACTUALLY WAIT.... no, it SHOULD just fall back to the id of the first tab in the list.
    // If you really WANT to set a default tab as not the first element, the "go back"
    // buttons will still work as intended, and we can just look for "default"
    // in the button-rendering stage to make sure it doesn't have one created.

    // TODO|kevin also, yknow, if I grab the URL hash here in the constructor
    // then I might not actually NEED a fully-fledged routing library...?
    // I would probably just need to add like, a history.pushState() in my tab button onClick handler
    // TODO|kevin oh, right, and uh, a hashchange event listener, probably defined HERE,
    // which does a setState / generally models the old activateFragment

    this.state = {
      activeTab,
    };

    this.setActiveTab = this.setActiveTab.bind(this);
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
  // TODO|kevin BLARGH these also need key attributes!!!!
  render() {
    return (
      <div id="main-content">
        <nav className="tabs-menu">
          <ul className="tabs-list" role="tablist">
            {this.props.tabs.map((tab) => {
              // The default tab panel doesn't have a corresponding tab button
              if (this.props.hasDefaultTab && tab.tabId === DEFAULT_TAB) return;
              // TODO|kevin use a constant for 'default' lol
              return (
                <TabButton
                  key={tab.tabId}
                  tabId={tab.tabId}
                  label={tab.label}
                  activeTab={this.state.activeTab}
                  setActiveTab={this.setActiveTab}
                />
              );
            })}
          </ul>
        </nav>
        <div id="tabs-content">
          {this.props.tabs.map((tab) =>
            <TabContent
              key={tab.tabId}
              tabId={tab.tabId}
              activeTab={this.state.activeTab}
              tabContent={tab.tabContent}
              hasDefaultTab={this.props.hasDefaultTab}
            />
          )}
        </div>
      </div>
    );
  }
}