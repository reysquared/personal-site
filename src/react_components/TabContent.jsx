import React from 'react';
import HTMLReactParser from 'html-react-parser';
import { DEFAULT_TAB } from 'react_components/constants';
import ReturnButton from 'react_components/ReturnButton';


export default function TabContent({ tab, activeTab, hasDefaultTab, setActiveTab }) {
  // TODO|kevin bluh.... does this ALSO need setActiveTab to set a handler on the button?
  // does it make sense to have a ReturnButton as its own thing if we're setting
  // a handler in THIS render?  I guess maybe to separate the HTML for the button...
  // TODO|kevin bluh this maybe also needs aria-labelledby?
  // TODO|kevin I don't THINK it needs aria-hidden as long as it's actually
  // visually "display: none" but maybe double-check on that.

  // TODO|kevin comment for this snippet probably
  if (tab.effect) {
    React.useEffect(tab.effect);
  }

  // Only show a "go back" button if default tab is enabled and this is NOT the
  // default tab. if the default tab is active we're already "back", and if it
  // isn't enabled at all then there's already a button for this tab in the nav
  return (
    <section
      id={tab.id}
      className={`tab-panel ${activeTab === tab.id ? 'active' : 'inactive'}`}
      role="tabpanel"
      aria-labelledby={`tab-${tab.id}`}
    >
      {HTMLReactParser(tab.content)}
      {hasDefaultTab && tab.id !== DEFAULT_TAB &&
        <ReturnButton setActiveTab={setActiveTab} />
      }
    </section>
  );
}
