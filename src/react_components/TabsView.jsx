import _ from 'lodash';
import React from 'react';
import { getTabFromFragmentId } from '../helpers/tabs';
import TabButton from 'react_components/TabButton';
import TabContent from 'react_components/TabContent';
import { DEFAULT_TAB } from 'react_components/constants';


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
    const handleHashChange = (event) => {
      const hash = (window.location.hash || '#').substring(1);
      const targetTab = getTabFromFragmentId(hash);
      // TODO|kevin comments here lol
      if (!hash && this.props.hasDefaultTab) {
        this.setActiveTab(DEFAULT_TAB);
      } else if (targetTab) {
        this.setActiveTab(targetTab);
        // If the tab we just activated is not the target itself, we should
        // scroll to that fragment now that the tab is visible
        // if (hash !== targetTab) {
        //   window.location.hash = '#' + hash;
        // }
      }
    }

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
  }

  tabIsValid(tabId) {
    return _.findIndex(this.props.tabs, (t) => (t.id === tabId)) !== -1;
  }

  setActiveTab(tabId) {
    if (!this.tabIsValid(tabId)) return;  // TODO|kevin log a warning or something? idk man...
    this.setState({ activeTab: tabId });
  }

  render() {
    return (
      <>
        <nav className="tabs-menu">
          <ul className="tabs-list" role="tablist">
            {this.props.tabs.map((tab) => {
              // The default tab panel doesn't have a corresponding tab button
              if (this.props.hasDefaultTab && tab.id === DEFAULT_TAB) return;
              // TODO|kevin yknow... I should condense MOST of this stuff into just passing the tab object huh?
              return (
                <TabButton
                  key={tab.id}
                  tab={tab}
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
              key={tab.id}
              tab={tab}
              activeTab={this.state.activeTab}
              hasDefaultTab={this.props.hasDefaultTab}
              setActiveTab={this.setActiveTab}
            />
          )}
        </div>
      </>
    );
  }
}
