import React, { StrictMode } from 'react';  // TODO|kevin not clear why this is needed and not just ReactDOM
import ReactDOMClient from 'react-dom/client';
// TODO|kevin regardless of how I actually handle the tabsview invocation, I'll
// need to import the tab contents in THIS file. ...buuuut I also might not be
// importing them correctly/might need to change my webpack config targets lmao
import TabsView from 'react_components/TabsView';
import DefaultTabRaw from 'html/tabs/00_default.html';
import TabBioRaw from 'html/tabs/01_bio.html';
import TabResumeRaw from 'html/tabs/02_resume.html';
import TabProjectsRaw from 'html/tabs/03_projects.html';
import TabSiteinfoRaw from 'html/tabs/04_about.html';


const TABS_LIST = [
  {
    tabId: 'default',
    label: 'TODO|kevin this isnt actually needed lololol',
    tabContent: DefaultTabRaw,
  },
  {
    tabId: 'bio',
    label: 'Bio',
    tabContent: TabBioRaw,
  },
  {
    tabId: 'resume',
    label: 'Résumé',
    tabContent: TabResumeRaw,
  },
  {
    tabId: 'projects',
    label: 'Projects',
    tabContent: TabProjectsRaw,
  },
  {
    tabId: 'siteinfo',
    label: 'About',
    tabContent: TabSiteinfoRaw,
  },
];

document.addEventListener('DOMContentLoaded', () => {
  // TODO|kevin stuff to do when the document loads! this... MIGHT be everything at this level though?
  const rootEl = document.getElementById('main-content');
  const root = ReactDOMClient.createRoot(rootEl);
  // TODO|kevin StrictMode component is only for debugging, remove later!
  root.render(
    <StrictMode>
      <TabsView tabs={TABS_LIST} hasDefaultTab={true} />
    </StrictMode>
  );
  // TODO|kevin also set up dark mode toggle below this
});
// // TODO|kevin everything below is straight from the original tabs.js, just pulled out of the IIFE

// // Simple shorthand function for pushing to the history
// function pushHash(anchorName) {
//   history.pushState(null, null, '#' + anchorName);
// }

// // Function to display the selected tab and hide other content
// // There may be "cleaner", JavaScript-free ways to accomplish tab functionality
// // similar to this, but they generally seem harder to follow under the hood and
// // don't go as far.
// function activateTab(tabId) {
//   // Determine which panel is currently visible and hide it
//   // NOTE: Element.classList is unsupported in IE9 and older.
//   var defaultPanel = document.getElementsByClassName('tab-default')[0];
//   if (defaultPanel.classList.contains('active')) {
//     // If currently viewing default panel, make it inactive
//     defaultPanel.classList.remove('active');
//     defaultPanel.classList.add('inactive');
//   } else {
//     // If not, make the previously-active tab panel and button inactive
//     var oldTab = document.getElementsByClassName('tab-title active')[0];
//     var oldPanel = document.getElementsByClassName('tab-panel active')[0];
//     oldTab.classList.remove('active');
//     oldPanel.classList.remove('active');
//     oldPanel.classList.add('inactive');
//   }

//   // Mark the newly selected tab as active
//   var newTab = document.getElementsByClassName('tab-title')[tabId];
//   var newPanel = document.getElementsByClassName('tab-panel')[tabId];
//   newTab.classList.add('active');
//   newPanel.classList.remove('inactive');
//   newPanel.classList.add('active');

//   // Finally, return the ID of the new panel so it can be passed to our pushHash fxn.
//   // TBH this is a little bit hackish, but it works dangit!
//   return newPanel.id;
// }

// // Function to hide the previously-active tab and reset the default div as active
// function resetTabs() {
//   var oldTab = document.getElementsByClassName('tab-title active')[0];
//   var oldPanel = document.getElementsByClassName('tab-panel active')[0];
//   var defaultPanel = document.getElementsByClassName('tab-default')[0];

//   oldTab.classList.remove('active'); // Reset tab button style by removing active class
//   // Hide the previous panel
//   oldPanel.classList.remove('active');
//   oldPanel.classList.add('inactive');
//   // Display the default panel
//   defaultPanel.classList.remove('inactive');
//   defaultPanel.classList.add('active');
// }

// /** Binding events and setting classes **/
// // For some info about JS events: http://www.quirksmode.org/js/events_tradmod.html
// // Since I'm not worrying much about supporting older browsers, I register events using
// // target.addEventListener() since it's an easy way to avoid throttling older listeners
// // SEE: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
// function tabInit() {
//   // Hide non-default panels
//   var tabPanels = document.getElementsByClassName('tab-panel');
//   for (var i = 0; i < tabPanels.length; i++) {
//     // Explicitly mark inactive tabs using a class. This way users with JS disabled can
//     // still see all the tab content on the page instead of having it hidden by default
//     tabPanels[i].classList.add('inactive');
//   }
//   // And just to be explicit, we add the 'active' class to the default panel as well.
//   document.getElementsByClassName('tab-default')[0].classList.add('active');

//   // Add click event actions to the tab buttons. Because we detect the number of tabs
//   // programmatically, it's easy to add more by modifying only the HTML, not the script.
//   var tabButtons = document.getElementsByClassName('tab-title');
//   for (var i = 0; i < tabButtons.length; i++) {
//     // Bind click event for the child anchor element
//     // This awkward construction is necessary because of the way JavaScript scopes work.
//     // More info: http://stackoverflow.com/questions/500431/
//     // If you find yourself thinking this all looks rather complicated, that's why you
//     // would ordinarily use frameworks like jQuery with powerful tools for taking care
//     // of the tedious bits. I haven't used it because a) it's educational and b) jQuery
//     // does more than I need, so the extra dozens of kB are kind of wasteful.
//     tabButtons[i].getElementsByTagName('a')[0].addEventListener('click',
//       function (tab) {
//         return function (e) {
//           e.preventDefault(); // This stops the browser's default action for the event.
//           // In this case, the default is to follow the link's HREF attribute. When JS is
//           // disabled the default will still occur, which allows us to set up a fallback
//           // HREF that jumps back up to the top of the page if the script hasn't run.
//           var panelId = activateTab(tab);
//           pushHash(panelId);
//         };
//       }(i), // Passing i to outermost function (as value for tab)
//       false);
//   }

//   // Add the tab-resetting action for the back buttons.
//   var backButtons = document.getElementsByClassName('go-back');
//   for (var i = 0; i < backButtons.length; i++) {
//     backButtons[i].addEventListener('click',
//       function (e) {
//         e.preventDefault();
//         resetTabs();
//         pushHash('');
//       },
//       false);
//   }
// };
// // This ensures that the tab initialization tasks won't be run until the window has
// // finished loading, to make sure all the necessary page elements are present.
// window.addEventListener('load', tabInit, false);

// /* Code below this point relies upon the basic tab navigation script above but isn't
// essential for navigation to work. If you no longer feel like supporting fragmint links,
// you can easily delete or comment out everything up to (but not including) the line that
// closes the IIFE and the navigation will still be functional.*/
// // Correctly activates tabs when linking to fragment identifiers within page
// function fragmentInit() {
//   // First construct an index of tab button numbers with their corresponding panel IDs.
//   // There may be a better way to do this but none immediately occurs to me. For the sake
//   // of minimizing redundant indexing work, we construct the index in this initialization
//   // function which is called only once on load. The only downside to this is it doesn't
//   // correctly consider any elements that are added to the document tree using JavaScript
//   // after the initial load. Perhaps an even better strategy would be to create an index
//   // of anchors that link to places in the current document and their corresponding tab
//   // panels, but this frontloaded setup would have its own overhead and might be messier.
//   var tabIndex = {};
//   var tabButtons = document.getElementsByClassName('tab-title');
//   for (var i = 0; i < tabButtons.length; i++) {
//     var tabLink = tabButtons[i].getElementsByTagName('a')[0];
//     tabIndex[tabLink.href.split('#')[1]] = i; // e.g. (in our case) tabIndex['week1'] === 0
//     // Mind that this requires you to specify an href/id for every tab button/panel pair,
//     // otherwise things will certainly break.
//   }

//   function activateFragment() {
//     console.log("starting to activate fragment");
//     // Grab URL parameters and activate tab as necessary
//     // If the URL has no fragment identifier, use the "default" of '#' followed by nothing.
//     var hash = window.location.hash || '#';
//     hash = hash.substring(1); // Drop the leading '#'
//     if (hash && hash !== 'top') { // top is a special fragid for the top of the document.
//       // If what's left is the empty string, we don't need to do anything special. If it's not
//       // empty, we run this code.
//       // Figure out what tab (if any) is the parent of the targeted anchor
//       var currElement = document.getElementById(hash);
//       if (!currElement) { return; } // No element with that ID found, get outta here!

//       while (currElement.parentNode && !currElement.classList.contains('tab-panel')) {
//         // Bubble upward through the element's parents until either we find an element of class
//         // tab-panel or we can't go up any further.
//         currElement = currElement.parentNode;
//       }
//       if (currElement.classList.contains('tab-panel')) {
//         // If the element is a tab-panel then it should be in our index, so we activate it!
//         activateTab(tabIndex[currElement.id]);
//       }

//       // Finally, now that the correct tab (if any) is visible, we check whether the hash was
//       // for the tab itself, and if not we jump to the actual anchor. If the hash was for an
//       // actual tab in our index, we only want to activate the tab instead of jumping down the
//       // page, so we skip this step.
//       if (tabIndex[hash] === undefined || tabIndex[hash] === null) {
//         window.location.href = '#' + hash;
//       }
//     }
//   }
//   activateFragment(); // Once for the initial page load
//   // Trigger the tab activation function when the URL's hash is changed
//   window.addEventListener('hashchange', activateFragment, false);
// }
// // Run the initialization code once on page load
// window.addEventListener('load', fragmentInit, false);
