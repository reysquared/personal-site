import React, { StrictMode } from 'react';
import ReactDOMClient from 'react-dom/client';

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
      // TODO|kevin do some silly fuckin visual effects here lol
      // document.getElementById('email').textContent = 'kevin@mcswiggen.dev';
    },
  },
  {
    id: 'schedule',
    label: 'Schedule of Events',
    content: TabScheduleRaw,
    effect: () => {
      // TODO|kevin LMAO WAIT I COULD LIKE PLAY AN AUDIO CLIP OR SOMETHING WHEN ACTIVATING CERTAIN TABS
      // TODO|kevin I could also append different images to the end of the .tabs-menu
    },
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
        // Ensure .lastone is the last one
        list.append(...allItems, list.querySelector(".lastone"));
      }

    }
  },
  // TODO|kevin gotta reorder these mmmm
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
});
