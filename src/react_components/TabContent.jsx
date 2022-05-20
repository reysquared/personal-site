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
export default function TabContent({ tabId, activeTab, tabContent }) {
  // TODO|kevin bluh.... does this ALSO need setActiveTab to set a handler on the button?
  // does it make sense to have a ReturnButton as its own thing if we're setting
  // a handler in THIS render?  I guess maybe to separate the HTML for the button...
  // TODO|kevin wait, this DOES also need some classes related to activeTab right?
  // TODO|kevin wait, also, what if we HAVEN'T specified a default tab? o.O
  // TODO|kevin bluh this maybe also needs aria-labelledby?
  // TODO|kevin BLAARGH and this also shouldn't have a ReturnButton if it's the default tab content!!
  return (
    <section
      id={tabId}
      className={`tab-panel ${activeTab === tabId ? 'active' : 'inactive'}`}
      aria-role="tabpanel"
    >
      {HTMLReactParser(tabContent)}
      {tabId !== DEFAULT_TAB && // Don't show go-back button on default tab, because we're already "back"
        <><a className="button go-back" href="#top">Main</a><br/><br/></>
      }
    </section>
  );
}