import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';


const COLLAPSED_CLASS = 'collapsed';
const FOCUSABLE_SELECTOR = '[tabindex], a[href], button, input, object, select, textarea';

export default function Collapsible({ regionId, label, containerClass, startCollapsed = true, ...props }) {
  const [isCollapsed, setCollapsed] = useState(startCollapsed);
  const contentEl = useRef();

  // Ensure that contents of the collapsed div cannot be tab-focused.
  // Sadly there's no way to disable tab focusing for all child elements by
  // just setting something on the parent, hence needing this nonsense. Sigh.
  useEffect(() => {
    const focusableEls = contentEl.current.querySelectorAll(FOCUSABLE_SELECTOR);
    if (isCollapsed) {
      focusableEls.forEach((el) => {
        // If the element specifies a tabindex in its NON-collapsed state, save
        // it in a data attribute on collapse so it can be restored on expand.
        if (el.hasAttribute('tabindex')) {
          el.setAttribute('data-tabindex', el.getAttribute('tabindex'));
        }
        el.setAttribute('tabindex', '-1');
      });
    } else {
      focusableEls.forEach((el) => {
        el.removeAttribute('tabindex');
        if (el.hasAttribute('data-tabindex')) {
          el.setAttribute('tabindex', el.getAttribute('data-tabindex'));
          el.removeAttribute('data-tabindex');
        }
      });
    }
  }, [isCollapsed]);

  let contentClassName = 'collapsible-content';
  if (isCollapsed) {
    contentClassName += ' ' + COLLAPSED_CLASS;
  }
  let containerClassName = 'collapsible-container';
  if (containerClass) {
    containerClassName += ' ' + containerClass;
  }
  return (
    <div className={containerClassName}>
      <label className="collapsible-header">
        {label}
        {' '}
        <button
          className="collapsible-button button small"
          aria-controls={regionId}
          aria-expanded={!isCollapsed}
          onClick={handleCollapseToggle(contentEl.current, setCollapsed)}
        >
          {isCollapsed ? 'Expand' : 'Collapse'}
        </button>
      </label>
      <div
        id={regionId}
        className={contentClassName}
        ref={contentEl}
        aria-hidden={isCollapsed}
      >
        {props.children}
      </div>
    </div>
  );
}

// This is essentially a simplified homemade version of jQuery's .slideToggle()
// It is NOT the most efficient approach to animation, and it isn't MEANT to be
// (makes no effort to avoid document reflow) so keep this in mind when using!
function handleCollapseToggle(el, setCollapsed) {
  return () => {
    // scrollHeight is determined by inner content height, INCLUDING any content
    // hidden due to overflow, so the value isn't affected by isCollapsed state.
    const sectionHeight = el.scrollHeight;

    if (el.classList.contains(COLLAPSED_CLASS)) {
      // After CSS animation ends, clean up the unneeded inline styles
      el.addEventListener('transitionend', handleTransitionEnd);
      // Apply an explicit height so we aren't transitioning to height: auto;
      // THIS INITIATES THE TRANSITION.
      el.style.height = `${sectionHeight}px`;
      // Remove COLLAPSED_CLASS since height is overridden by inline styles now.
      // Once our transitionend handler fires, it will return to auto height.
      el.classList.remove(COLLAPSED_CLASS);
    } else {
      // Apply an explicit height so we aren't transitioning from height: auto;
      el.style.height = `${sectionHeight}px`;
      // To ensure a transition actually occurs (so our transitionend handler
      // actually fires) we need to make sure the explicit height change above
      // finishes taking effect BEFORE we set it to 0px. Otherwise it throttles
      // the height value and transitions from auto=>0px, which doesn't animate.
      requestAnimationFrame(() => {
        // I don't totally grok it, but a bug(?) in most popular browser engines
        // means the first rAF call returns the CURRENT frame rather than the
        // next, thus the nested call so the height update is delayed correctly.
        // See https://stackoverflow.com/q/44145740 and https://crbug.com/675795
        requestAnimationFrame(() => {
          // After CSS animation ends, clean up the unneeded inline styles
          el.addEventListener('transitionend', handleTransitionEnd);
          // Apply a new height of 0px. THIS INITIATES THE TRANSITION.
          el.style.height = '0px';
          // Add the COLLAPSED_CLASS, initially overridden by inline styles.
          // After handleTransitionEnd cleans them up, the class will take over.
          el.classList.add(COLLAPSED_CLASS);
        });
      });
    }
    // Of course, we also must update the React component state accordingly ;)
    setCollapsed(_.negate(_.identity));
  }
}

// When the collapsible container is not animating, its height is controlled by
// the presence or absence of the COLLAPSED_CLASS. As such, we remove explicit
// inline height once the transition ends, allowing the class to take over.
function handleTransitionEnd(e) {
  const el = e.target;
  // Ensure handler only fires once per toggle
  el.removeEventListener('transitionend', handleTransitionEnd);
  el.style.height = null;
}
