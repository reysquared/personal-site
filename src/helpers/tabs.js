export const getTabFromFragmentId = () => {
  // TODO|kevin this was lazily copied and is probably totally busted.
  const hash = window.location.hash || '#';
  hash = hash.substring(1); // Drop the leading '#'
  if (hash && hash !== 'top') { // top is a special fragid for the top of the document.
    // If what's left is the empty string, we don't need to do anything special. If it's not
    // empty, we run this code.
    // Figure out what tab (if any) is the parent of the targeted anchor
    var currElement = document.getElementById(hash);
    if (!currElement) return; // No element with that ID found, get outta here!

    while (currElement.parentNode && !currElement.classList.contains('tab-panel')) {
      // Bubble upward through the element's parents until either we find an element of class
      // tab-panel or we can't go up any further.
      currElement = currElement.parentNode;
    }
    if (currElement.classList.contains('tab-panel')) {
      // If the element is a tab-panel then it should be in our index, so we activate it!
      activateTab(tabIndex[currElement.id]);
    }

    // Finally, now that the correct tab (if any) is visible, we check whether the hash was
    // for the tab itself, and if not we jump to the actual anchor. If the hash was for an
    // actual tab in our index, we only want to activate the tab instead of jumping down the
    // page, so we skip this step.
    if (tabIndex[hash] === undefined || tabIndex[hash] === null) {
      window.location.href = '#' + hash;
    }
  }
};