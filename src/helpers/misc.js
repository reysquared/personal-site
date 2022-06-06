// *NOTE* RETURNED COORDINATES USE A *CARTESIAN* ORIGIN, NOT IMAGEDATA ORIGIN!
// y = 0 is at the BOTTOM of the target element's box, NOT the top!
// I am also 99% sure this WILL NOT WORK CORRECTLY on scaled elements.
export function getMouseCoordsWithinEventTarget(e) {
  const targetStyles = getComputedStyle(e.target);
  const boxSizing = targetStyles.getPropertyValue('box-sizing');
  const contentBox = boxSizing === 'content-box';
  let borderOffsetX = 0, borderOffsetY = 0;
  if (contentBox) {
    // These return as "_px" string values but seem to ALWAYS be computed in px,
    // so just passing the strings to parseInt gives us exactly what we want
    borderOffsetX = parseInt(targetStyles.getPropertyValue('border-left-width'));
    borderOffsetY = parseInt(targetStyles.getPropertyValue('border-bottom-width'));
  }
  const targetRect = e.target.getBoundingClientRect();
  const relativeX = e.clientX - targetRect.left - borderOffsetX;
  const relativeY = targetRect.bottom - e.clientY - borderOffsetY;
  return {
    x: Math.max(0, Math.min(relativeX, e.target.clientWidth)),
    y: Math.max(0, Math.min(relativeY, e.target.clientHeight)),
  };
  // OKAY, so in box-sizing content-box, this SEEMS to be basically
  // treating the bottom corner of the BORDER as the origin, so we need to offset
  // from that basically. x values should subtract the width of the LEFT border
  // (and then clamp to the known dimensions)
  // and y values should subtract the width of...... hmm. should subtract the
  // width of the bottom border, but MAYBE more than that?

  // We should clamp values to [0, e.target.clientWidth/Height] which is the
  // size of the content INCLUDING padding but NOT border
}

export function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while(b) {
    var t = b;
    b = a % b;
    a = t;
  }
  return a;
}

export function supportsLocalStorage() {
  const teststr = '__localstorage_test__';
  try {
    localStorage.setItem(teststr, teststr);
    localStorage.removeItem(teststr);
    return true;
  } catch (e) {
    return false;
  }
}
