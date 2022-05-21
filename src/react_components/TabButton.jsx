import React from 'react';

// TODO|kevin make sure this all works gucci lol
export default function TabButton({ tabId, label, activeTab, setActiveTab }) {
  const handleClick = (event) => {
    event.preventDefault();
    setActiveTab(tabId);
  }
  // TODO|kevin still REALLY not sure if the onClick should be on the anchor or not
  // If putting it on the li means that the default behavior for the href is still
  // prevented, then I think PROBABLY it should go on the higher up element. but
  // maybe it also needs a stopPropagation or something? or maybe it just doesn't work.
  // TODO|kevin check if this is keyboard accessible at all...? in EITHER approach, really.
  // I THINK I need to add a tabindex=0 and maybe also some other handling.
  // Maybe instead I actually need to put the aria roles on the <a>...?
  // TODO|kevin hmmmm this might need :focus styles huh
  return (
    <li
      className={activeTab === tabId ? 'tab-title active' : 'tab-title'}
      role="tab"
      aria-controls={tabId}
      aria-selected={activeTab === tabId}
    >
      <a href={`#${tabId}`} onClick={handleClick} >
        {label}
      </a>
    </li>
  );
}
// export default class TabButton extends React.Component {
//   render() {
//     return (
//       <li class="tab-title">
//         <a href={`#${this.props.tabId}`}>{this.props.label}</a>
//       </li>
//     );
//   }

//   handleClick() {
//     this.props.setActiveTab(this.props.tabId);
//     // TODO|kevin
//   }
// }
