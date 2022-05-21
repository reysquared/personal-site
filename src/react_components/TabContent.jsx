import React from 'react';
import HTMLReactParser from 'html-react-parser';
import { DEFAULT_TAB } from 'react_components/constants';

// TODO|kevin this SHOULD be convertible to a purely functional component
// TODO|kevin depending on how I get routing to work, the go-back button should
// MAYBE also be its own React component. BUT, WE WILL START WITH NO ROUTING.
// export default class TabContent extends React.Component {
//   render() {
//     return (
//       <section id={this.props.tabId} class="tab-panel">
//         {HTMLReactParser(this.props.tabContent)}
//         <a class="button go-back" href="#top">Main</a><br/><br/>
//       </section>
//     );
//   }
// }
export default function TabContent({ tabId, activeTab, tabContent, hasDefaultTab }) {
  // TODO|kevin bluh.... does this ALSO need setActiveTab to set a handler on the button?
  // does it make sense to have a ReturnButton as its own thing if we're setting
  // a handler in THIS render?  I guess maybe to separate the HTML for the button...
  // TODO|kevin bluh this maybe also needs aria-labelledby?

  // Only show a "go back" button if default tab is enabled and this is NOT the
  // default tab. if the default tab is active we're already "back", and if it
  // isn't enabled at all then there's already a button for this tab in the nav
  return (
    <section
      id={tabId}
      className={`tab-panel ${activeTab === tabId ? 'active' : 'inactive'}`}
      role="tabpanel"
    >
      {HTMLReactParser(tabContent)}
      {hasDefaultTab && tabId !== DEFAULT_TAB &&
        <><a className="button go-back" href="#top">Main</a><br/><br/></>
      }
    </section>
  );
}