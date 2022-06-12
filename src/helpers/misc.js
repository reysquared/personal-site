import _ from 'lodash';

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
  const relativeX = e.clientX - _.round(targetRect.left) - borderOffsetX;
  const relativeY = _.round(targetRect.bottom) - e.clientY - borderOffsetY;
  // Ensure values are clamped to the acceptable range, in case of minor offset
  // calculation errors
  const clampedX = _.clamp(relativeX, 0, e.target.clientWidth);
  const clampedY = _.clamp(relativeY, 0, e.target.clientHeight);
  return {
    x: clampedX / e.target.clientWidth,
    y: clampedY / e.target.clientHeight,
  };
  // OKAY, so in box-sizing content-box, this SEEMS to be basically
  // treating the bottom corner of the BORDER as the origin, so we need to offset
  // from that basically. x values should subtract the width of the LEFT border
  // (and then clamp to the known dimensions)
  // and y values should subtract the width of...... hmm. should subtract the
  // width of the bottom border, but MAYBE more than that?

  // We should clamp values to [0, e.target.clientWidth/Height] which is the
  // size of the content incl PADDING but NOT border, then normalize to [0, 1]
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

// This is not necessary for performance by any means, I just don't like the
// idea of repeatedly messing with the actual storage values unnecessarily.
let __storageSupported = null;

export function supportsLocalStorage() {
  if (__storageSupported === null) {
    const teststr = '__localstorage_test__';
    try {
      localStorage.setItem(teststr, teststr);
      localStorage.removeItem(teststr);
      __storageSupported = true;
    } catch (e) {
      __storageSupported = false;
    }
  }
  return __storageSupported;
}

// I'm sure this has been done plenty of times before, but... I wanted to make
// a silly function that creates a konami code listener on the document, firing
// some callback if the user hits [UP UP DOWN DOWN LEFT RIGHT LEFT RIGHT B A]
// If `once` is true, this will remove the listener after the callback is fired.
// Otherwise the key sequence resets and the user can enter it again.
// Doesn't play too well with non-QWERTY keyboard layouts, seems like browser
// support is maybe still in progress on that front (Keyboard.getLayoutMap()?)
const KONAMI_KEYS = [ 'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA' ];

// TODO|kevin think of SOME kind of easter egg that this can control lmao!
export function catchKonamiCode(callback, once) {
  // Keep track of which keys the user has pressed
  const keypressQueue = [];
  // Function to catch the key events
  function konamiCatcher(e) {
    const evCode = e.code;
    keypressQueue.push(evCode);
    if (keypressQueue.length >= KONAMI_KEYS.length) {
      if (_.isEqual(keypressQueue, KONAMI_KEYS)) {
        callback();  // User succeeded! Run the callback
        if (once) {
          // Remove ourselves if we're only supposed to run once
          document.removeEventListener('keydown', konamiCatcher);
        }
      }
      // Doesn't really matter if it was right, need to empty the queue if full
      // This removes all elements from keypressQueue by reference
      keypressQueue.length = 0;
    } else if (!_.isEqual(keypressQueue, KONAMI_KEYS.slice(0, keypressQueue.length))) {
      // Also clear the queue If they messed up the sequence before the end
      keypressQueue.length = 0;
    }
  }
  // 
  document.addEventListener('keydown', konamiCatcher);
}
