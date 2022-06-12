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
    // has the first tab in the list start activated. Shrugs.
    const startingTab = props.hasDefaultTab ? DEFAULT_TAB : props.tabs[0].tabId;
    const activeTab = props.startingTab || startingTab;

    this.state = {
      activeTab,
    }; 
  }

  componentDidMount() {
    // tiny homebrewed URL routing hook so the tabs can be easily linked to!
    const handleHashChange = (event) => {
      const hash = (window.location.hash || '#').substring(1);
      // If hash isn't a tab ID, it might be a real anchor WITHIN a tab. Find
      // out! If it's not a real anchor, or not within a tab, returns undefined.
      const targetTab = getTabFromFragmentId(hash);
      if (!hash && this.props.hasDefaultTab) {
        // If the hash was empty, reset to the default, if any.
        this.setActiveTab(DEFAULT_TAB);
      } else if (targetTab) {
        // If we found a different target tab, acrivate it.
        this.setActiveTab(targetTab);
      }
      // Otherwise it's one of three things: 1) an invalid hash (DNE in document)
      // 2) a valid hash that just isn't within a tab, or 2.5) an empty hash and
      // we have no default tab, in which case it's treated as the valid hash for
      // returning to the top of the document. Regardless, there's no need to do
      // anything else because the UA's default hashchange behavior is just fine!
    }

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
  }

  tabIsValid(tabId) {
    return _.findIndex(this.props.tabs, (t) => (t.id === tabId)) !== -1;
  }

  setActiveTab(tabId) {
    if (!this.tabIsValid(tabId)) {
      console.error(`tried to set invalid tab as active: ${tabId}`);
      return;
    }
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
        <div className="inner-content">
          {this.props.tabs.map((tab) =>
            <TabContent
              key={tab.id}
              tab={tab}
              containerClass={this.props.containerClass}
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
