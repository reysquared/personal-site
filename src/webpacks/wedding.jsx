import React, { StrictMode } from 'react';
import ReactDOMClient from 'react-dom/client';

import { convertAniBinaryToCSS } from 'ani-cursor';

import DisableTheme from 'react_components/DisableTheme';
import TabsView from 'react_components/TabsView';
import DefaultTabRaw from 'html/wedding/__default.html';
import TabScheduleRaw from 'html/wedding/_schedule.html';
import TabDressCodeRaw from 'html/wedding/_dresscode.html';
import TabHotelRaw from 'html/wedding/_hotel.html';
import TabRegistryRaw from 'html/wedding/_registry.html';
import TabRsvpRaw from 'html/wedding/_rsvp.html';
import TabConstruction from 'html/wedding/_construction.html';
import TabGallery from 'html/wedding/_gallery.html';
import TabLivestream from 'html/wedding/_livestream.html';
import TabOurStory from 'html/wedding/_ourstory.html';


const TABS_LIST = [
  {
    id: 'default',
    label: 'Not actually used lol',
    content: DefaultTabRaw,
    effect: () => {
      // TODO|kevin LMAO WAIT I COULD LIKE PLAY AN AUDIO CLIP OR SOMETHING WHEN ACTIVATING CERTAIN TABS
    },
  },
  {
    id: 'schedule',
    label: 'Schedule of Events',
    content: TabScheduleRaw,
  },
  {
    id: 'rsvp',
    label: 'RSVP',
    content: TabRsvpRaw,
  },
  {
    id: 'dress-code',
    label: 'Dress Code',
    content: TabDressCodeRaw,
  },
  {
    id: 'hotel',
    label: 'Hotel + Transit',
    content: TabHotelRaw,
  },
  {
    id: 'registry',
    label: 'Registry',
    content: TabRegistryRaw,
    effect: () => {
      const list = document.getElementById("charity-list");
      if (list) {
        const allItems = Array.from(list.children);
        // Shuffle charity list into a random order
        allItems.sort(() => Math.random() - 0.5);
        list.append(...allItems)
        // Ensure .lastone is the last one
        list.append(list.querySelector(".lastone"));
      }

    }
  },
  {
    id: 'ourstory',
    label: 'Our Story',
    content: TabOurStory,
    effect: () => window.location.replace("#under-construction"),
  },
  {
    id: 'gallery',
    label: 'Gallery',
    content: TabGallery,
    effect: () => window.location.replace("#under-construction"),
  },
  {
    id: 'livestream',
    label: 'Livestream',
    content: TabLivestream,
  },
  {
    id: 'under-construction',
    label: 'UNDER CONSTRUCTION', // Not shown
    content: TabConstruction,
  },
];


document.addEventListener('DOMContentLoaded', () => {
  const rootEl = document.getElementById('main-content');
  const root = ReactDOMClient.createRoot(rootEl);

  root.render(
    <StrictMode>
      <TabsView tabs={TABS_LIST} hasDefaultTab={true} containerClass="content" />
    </StrictMode>
  );

  const toggleEl = document.getElementById("theme-toggle-root");
  const toggleRoot = ReactDOMClient.createRoot(toggleEl);
  toggleRoot.render(
    <StrictMode>
      <DisableTheme id="themetoggle" />
    </StrictMode>
  )

  CURSOR_SELECTORS.forEach(([selector, aniUrl]) => {
    applyCursor(selector, aniUrl);
  })
});

const CURSOR_SELECTORS = [
  ["#default", "/images/wedding/curs/rainbow.ani"],
  ["#default a", "/images/wedding/curs/rainbow-ptr.ani"],
  ["#dress-code", "/images/wedding/curs/wizard.ani"],
  ["#dress-code a", "/images/wedding/curs/wizard-ptr.ani"],
  ["#gallery", '/images/wedding/curs/heart.ani'],
  ["#gallery a", '/images/wedding/curs/heart-ptr.ani'],
  ["#hotel", "/images/wedding/curs/compass.ani"],
  ["#hotel a", "/images/wedding/curs/compass-ptr.ani"],
  ["#livestream a", "/images/wedding/curs/sea-ptr.ani"],
  ["#ourstory", "/images/wedding/curs/rose.ani"],
  ["#ourstory a", "/images/wedding/curs/rose-ptr.ani"],
  ["#registry a", "/images/wedding/curs/space-ptr.ani"],
  ["#rsvp", "/images/wedding/curs/goth.ani"],
  ["#rsvp a", "/images/wedding/curs/goth-ptr.ani"],
  [".tabs-menu", "/images/wedding/curs/sidebar.ani"],
  [".tabs-menu a", "/images/wedding/curs/sidebar-ptr.ani"],
  ["#sticky-footer", "/images/wedding/curs/circuit.ani"],
  ["#sticky-footer a, #counter", "/images/wedding/curs/circuit-ptr.ani"],
  ["#under-construction", "/images/wedding/curs/tool.ani"],
  ["#under-construction a", "/images/wedding/curs/tool-ptr.ani"],
];

function applyCursor(selector, aniUrl) {
  fetch(aniUrl)
    .then((response) => response.arrayBuffer())
    .then((buff) => {
      const data = new Uint8Array(buff);
      const style = document.createElement('style');
      style.innerText = convertAniBinaryToCSS(selector, data);
      document.head.appendChild(style);
    });
}
