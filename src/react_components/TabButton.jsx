import React from 'react';

// TODO|kevin this SHOULD be convertible to a purely functional component
export default class TabButton extends React.Component {
  render() {
    // TODO|kevin lol this is currently copied from the tabcontent view
    return (
      <section id={this.props.label} class="tab-panel">{this.props.tabContent}</section>
    );
  }
}

/*
export default const TabButton = ({tabId, title, activeTab, setActiveTab}) => (
  const handleClick = () => {
    setActiveTab(tabId);
  };
  return (
    <li class="tab-title">
      <a href="#bio">Bio</a>
    </li>
   <li onClick={handleClick} className={activeTab === id ? "active" : ""}>
     { title }
   </li>
 );
);
*/