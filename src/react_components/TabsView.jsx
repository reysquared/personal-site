import _ from 'lodash';
import React from 'react';
import TabButton from 'react_components/TabButton';
import TabContent from 'react_components/TabContent';
import { DEFAULT_TAB } from 'react_components/constants';


// TODO|kevin it MIGHT be possible to turn this into a functional component using the useState hook actually...?
export default class TabsView extends React.Component {
  constructor(props) {
    super(props);
    _.bindAll(this, [
      'setActiveTab',
      'tabIsValid',
    ]);

    // Ideally if you want a "default" tab it should be first in the list, but
    // if it isn't the ReturnButtons will still work correctly, so this just
    // has the first tab in the list start activated. Shrugs. TODO|kevin update comments lol
    // TODO|kevin perhaps should throw an error if hasDefaultTab but there's no tab with the "default" id
    const startingTab = props.hasDefaultTab ? DEFAULT_TAB : props.tabs[0].tabId;
    const activeTab = props.startingTab || startingTab;
    // TODO|kevin also, yknow, if I grab the URL hash here in the constructor
    // then I might not actually NEED a fully-fledged routing library...?
    // I would probably just need to add like, a history.pushState() in my tab button onClick handler
    // TODO|kevin oh, right, and uh, a hashchange event listener, probably defined HERE,
    // which does a setState / generally models the old activateFragment

    this.state = {
      activeTab,
    }; 
  }

  componentDidMount() {
    window.addEventListener('hashchange', (event) => {
      // TODO|kevin check if the hash exists
      // if it does, check whether it is already a valid tab.
        // if so, set tab.
        // if not, attempt getTabFromFragmentId
          // If that gets us a tab, set tab.
            // Currently I have setActiveTab doing the history modification, so
            // perhaps in this case I should also follow it up by setting the url hash one more time...? (wait, but how to do w/o creating an infinite loop?)
          // If it doesn't, I think we should've already scrolled to it right...?
      const hash = (window.location.hash || '#').substring(1);
      if (!hash && this.props.hasDefaultTab) {
        this.setActiveTab(DEFAULT_TAB);
      } else {
        this.setActiveTab(hash);  // TODO|kevin need to actually make sure this is a valid tab first, though...
      }
    });
  }

  tabIsValid(tab) {
    return _.findIndex(this.props.tabs, (t) => (t.tabId === tab)) !== -1;
  }

  setActiveTab(tab) {
    if (!this.tabIsValid(tab)) return;  // TODO|kevin log a warning or something? idk man...
    this.setState({ activeTab: tab });
  }

  render() {
    return (
      <div id="main-content">
        <nav className="tabs-menu">
          <ul className="tabs-list" role="tablist">
            {this.props.tabs.map((tab) => {
              // The default tab panel doesn't have a corresponding tab button
              if (this.props.hasDefaultTab && tab.tabId === DEFAULT_TAB) return;
              // TODO|kevin yknow... I should condense MOST of this stuff into just passing the tab object huh?
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
              setActiveTab={this.setActiveTab}
            />
          )}
        </div>
      </div>
    );
  }
}
