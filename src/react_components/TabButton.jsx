import React from 'react';


export default function TabButton({ tab, activeTab, setActiveTab }) {
  const handleClick = (event) => {
    event.preventDefault();
    setActiveTab(tab.id);
    window.history.pushState(null, null, `#${tab.id}`);
  }

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
