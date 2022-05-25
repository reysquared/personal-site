// TODO|kevin NOTE that fragId should already have the leading # removed
export const getTabFromFragmentId = (fragId) => {
  if (fragId && fragId !== 'top') { // top is a special fragid for the top of the document.
    // Figure out what tab (if any) is the parent of the targeted anchor
    var currElement = document.getElementById(fragId);
    if (!currElement) return; // No element with that ID found, get outta here!

    while (currElement.parentNode && !currElement.classList.contains('tab-panel')) {
      // Bubble upward through the element's parents until either we find an element of class
      // tab-panel or we can't go up any further.
      currElement = currElement.parentNode;
    }
    if (currElement.classList.contains('tab-panel')) {
      // We have found the tab panel that contained the given pragment!
      return currElement.id;
    }
  }
};