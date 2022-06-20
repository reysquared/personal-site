import React, { StrictMode } from 'react';
import ReactDOMClient from 'react-dom/client';

import { catchKonamiCode } from 'helpers/misc';
import TabsView from 'react_components/TabsView';
import DefaultTabRaw from 'html/tabs/_00_default.html';
import TabBioRaw from 'html/tabs/_01_bio.html';
import TabResumeRaw from 'html/tabs/_02_resume.html';
import TabProjectsRaw from 'html/tabs/_03_projects.html';
import TabSiteinfoRaw from 'html/tabs/_04_about.html';


const TABS_LIST = [
  {
    id: 'default',
    label: 'Not actually used lol',
    content: DefaultTabRaw,
    // Specifying an `effect` function for any tab will get passed to useEffect
    // for the corresponding TabContent component. A lil janky, but it works!
    effect: () => {
      // Replace email placeholder with actual email string. Honestly, I don't
      // think this is really a critical or particularly-effective spam prevention
      // measure at this stage, but it's fun so I'm keeping it around lmao
      document.getElementById('email').textContent = 'kevin@mcswiggen.dev';
    }
  },
  {
    id: 'bio',
    label: 'Bio',
    content: TabBioRaw,
    effect: () => {
      // This silly snippet replaces the Bio subheader with one of these lines
      const subOpts = [
        'Lives bodily inside a laptop',
        'Eats JavaScript for snax',
        '"It\'s more of a computer art than a computer science."',
        'is climbing a mountain (why are they climbing a mountain?)',
        'Need more sleep.',
      ];
      const choice = subOpts[Math.floor(Math.random() * subOpts.length)];
      document.getElementById('sillysub').innerHTML = choice;
    },
  },
  {
    id: 'resume',
    label: 'Résumé',
    content: TabResumeRaw,
  },
  {
    id: 'projects',
    label: 'Projects',
    content: TabProjectsRaw,
  },
  {
    id: 'siteinfo',
    label: 'About',
    content: TabSiteinfoRaw,
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

  // I made this function on a whim and couldn't decide what to do with it, so
  // here's a dumb, hard-to-notice easter egg just for the Bio tab until I come
  // up with a better idea! Replaces #pixelface with a neat gif of my initials.
  catchKonamiCode(() => {
    const myFace = document.getElementById('pixelface');
    // The GIF doesn't loop, so the URL param resets the animation if triggered again
    // EDIT: well... it works in SOME browsers. I changed my mind about this, I'd
    // rather save the bandwidth :P
    // myFace.style.backgroundImage = `url('/images/initials.gif?cachebust=${Math.random()}')`;
    myFace.style.backgroundImage = `url('/images/initials.gif')`;
    window.setTimeout(() => {
      myFace.removeAttribute('style');
    }, 4000);
  });
});
