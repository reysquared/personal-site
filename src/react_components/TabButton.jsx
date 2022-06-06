import React from 'react';


export default function TabButton({ tab, activeTab, setActiveTab }) {
  const handleClick = (event) => {
    event.preventDefault();
    setActiveTab(tab.id);
    window.history.pushState(null, null, `#${tab.id}`);
  }
  // TODO|kevin still REALLY not sure if the onClick should be on the anchor or not.
  // If putting it on the li means that the default behavior for the href is still
  // prevented, then I think PROBABLY it should go on the higher up element. but
  // maybe it also needs a stopPropagation or something? or maybe it just doesn't work.
  // TODO|kevin check if this is keyboard accessible at all...? in EITHER approach, really.
  // I THINK I need to add a tabindex=0 and maybe also some other handling.
  // Maybe instead I actually need to put the aria roles on the <a>...?
  // TODO|kevin okay wait do I actually need tabindex=0 or was that also just a
  // side-effect from that fucked up OSX setting?
  return (
    <li
      role="presentation"
      className={activeTab === tab.id ? 'tab-title active' : 'tab-title'}
    >
      <a
        id={`tab-${tab.id}`}
        href={`#${tab.id}`}
        role="tab"
        tabIndex="0"
        aria-controls={tab.id}
        aria-selected={activeTab === tab.id}
        onClick={handleClick}
      >
        {tab.label}
      </a>
    </li>
  );
}
