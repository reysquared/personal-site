import React from 'react';
import HTMLReactParser from 'html-react-parser';
import { DEFAULT_TAB } from 'react_components/constants';
import ReturnButton from 'react_components/ReturnButton';


export default function TabContent({ tab, containerClass, activeTab, hasDefaultTab, setActiveTab }) {
  // A lazy lil way to attach some basic dynamic content while still having the
  // tab content specified programmatically. Runs whenever tab becomes active.
  // NOTE|kevin 26-07-30 man I was really bad at React when I originally made this component lmao
  React.useEffect(() => {
    if (tab.effect && tab.id === activeTab) {
      tab.effect()
    }
  }, [tab.effect, tab.id, activeTab]);

  // Only show a "go back" button if default tab is enabled and this is NOT the
  // default tab. if the default tab is active we're already "back", and if it
  // isn't enabled at all then there's already a button for this tab in the nav
  let className = 'tab-panel ' + (activeTab === tab.id ? 'active' : 'inactive');
  if (containerClass) {
    className += ' ' + containerClass;
  }
  // Only include the labelledby attribute if the tab IS labeled by something.
  // Since default tab panel doesn't have a corresponding tab control, skip it.
  const isDefault = hasDefaultTab && tab.id === DEFAULT_TAB;
  const labelAttr = !isDefault ? { 'aria-labelledby': `tab-${tab.id}` } : {}
  return (
    <section
      id={tab.id}
      className={className}
      role="tabpanel"
      {...labelAttr}
    >
      {HTMLReactParser(tab.content)}
      {hasDefaultTab && tab.id !== DEFAULT_TAB &&
        <ReturnButton setActiveTab={setActiveTab} />
      }
    </section>
  );
}
