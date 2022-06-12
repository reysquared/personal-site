import _ from 'lodash';

// Table of English letter monogram probabilities (case-insensitive)
// Adapted from http://www.cs.chalmers.se/Cs/Grundutb/Kurser/krypto/en_stat.html
export const LETTER_PROBABILITIES = {
  'e': 0.1017,
  't': 0.0737,
  'a': 0.0661,
  'o': 0.0610,
  'i': 0.0562,
  'n': 0.0557,
  'h': 0.0542,
  's': 0.0508,
  'r': 0.0458,
  'd': 0.0369,
  'l': 0.0325,
  'u': 0.0228,
  'm': 0.0205,
  'c': 0.0192,
  'w': 0.0190,
  'f': 0.0175,
  'y': 0.0165,
  'g': 0.0161,
  'p': 0.0131,
  'b': 0.0115,
  'v': 0.0088,
  'k': 0.0066,
  'x': 0.0014,
  'j': 0.0008,
  'q': 0.0008,
  'z': 0.0005,
}

// Take a single ASCII character and rotate it by n
export const rotateChar = (ch, n) => {
  let offset;  // Difference between a letter's alphabet position and ASCII code
  const charCode = ch.charCodeAt(0);

  if (65 <= charCode && charCode <= 90) {
    offset = 65;  // uppercase ASCII letter
  } else if (97 <= charCode && charCode <= 122) {
    offset = 97;  // lowercase ASCII letter
  } else {
    // Other characters are returned unchanged
    return ch;
  }

  // Find the character's alphabet position (case-insensitive) and rotate by n
  let letterCode = charCode - offset;
  letterCode += n;
  letterCode %= 26;
  // Add back the offset to get a correctly-cased rotated letter
  return String.fromCharCode(letterCode + offset);
};

export const letterProbability = (ch) => {
  const normalizedCh = ch.toLowerCase();
  return LETTER_PROBABILITIES[normalizedCh] || 1.0;
};

// NOTE rotation cipher decoding uses the same operation as encoding but with an
// offset of (26 - n) so we only create one function to use for both
export const encipher = (plainText, n) => {
  let cipherText = '';

  for (let ch of plainText) {
    cipherText += rotateChar(ch, n);
  }

  return cipherText;
};

// NOTE not guaranteed to play nicely with Unicode chars, more testing needed...
export const scoreString = (text) => {
  return _.reduce(text, (acc, val) => (acc * letterProbability(val)), 1.0);
};

// Given a ciphertext, attempts to guess the rotation value whose output seems
// most like an English string based on letter monogram probabilities
export const autoDecipher = (cipherText) => {
  const candidates = _.range(26).map((n) => encipher(cipherText, n));
  const scores = candidates.map((candidate) => scoreString(candidate));
  const mostLikelyOffset = scores.indexOf(_.max(scores));
  return mostLikelyOffset;
};
