import React from 'react';
import HTMLReactParser from 'html-react-parser';
import { DEFAULT_TAB } from 'react_components/constants';
import ReturnButton from 'react_components/ReturnButton';


export default function TabContent({ tab, containerClass, activeTab, hasDefaultTab, setActiveTab }) {
  // A lazy lil way to attach some basic dynamic content while still having the
  // tab content specified programmatically. Runs EVERY render though, be aware!
  if (tab.effect) {
    React.useEffect(tab.effect);
  }

  // Only show a "go back" button if default tab is enabled and this is NOT the
  // default tab. if the default tab is active we're already "back", and if it
  // isn't enabled at all then there's already a button for this tab in the nav
  let className = 'tab-panel ' + (activeTab === tab.id ? 'active' : 'inactive');
  if (containerClass) {
    className += ' ' + containerClass;
  }
  return (
    <section
      id={tab.id}
      className={className}
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
