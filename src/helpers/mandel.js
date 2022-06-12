import Complex from 'complex.js';
import _ from 'lodash';


export const ColorModes = Object.freeze({
  QUADRATIC: 1,
  LINEAR: 0,
  INV_QUADRATIC: -1,
});
const ESCAPE_THRESHOLD = 2;

// Shorthand linear interpolation function
const lerp = (a, b, n) => (1 - n) * a + n * b;

// Generates numValues numbers between [start, end] incl., scaling intermediate
// values according to the colorMode value (defaults to linear interpolation)
const getValuesBetween = (start, end, numValues, colorMode) => {
  return _.map(_.range(numValues), (val) => {
    let normVal = val / numValues;
    if (colorMode) {
      if (colorMode === ColorModes.QUADRATIC) {
        normVal *= normVal;
      } else if (colorMode === ColorModes.INV_QUADRATIC) {
        normVal = Math.sqrt(normVal);
      }
    }
    return lerp(start, end, normVal);
  });
}

export function isHslColor({ h, s, l }) {
  return (
    _.every([h, s, l], _.isNumber)
    && 0 <= h && h <= 360
    && 0 <= s && s <= 100
    && 0 <= l && l <= 100
  );
}

export function isRgbColor({ r, g, b }) {
  return (
    _.every([r, g, b], _.isNumber)
    && 0 <= r && r <= 255
    && 0 <= g && g <= 255
    && 0 <= b && b <= 255
  );
}

export function hsl2rgb({ h, s, l }) {
  if (!isHslColor({ h, s, l }))
    throw 'hsl2rgb argument must be a valid HSL color object';
  // Normalize saturation and luminosity to the range [0, 1]
  const saturation = s / 100;
  const luminosity = l / 100;
  // Calculate chroma and use a piecewise function to calculate the 2nd largest
  // color component (here labeled x)
  const chroma = (1 - Math.abs(2 * luminosity - 1)) * saturation;
  const h_ = h / 60;
  const x = chroma * (1 - Math.abs(h_ % 2 - 1));
  let r_, g_, b_;
  switch (_.toInteger(h_)) {
    case 6: // I chose to allow h = 360, which is the only way to get 6
    case 0:
      [r_, g_, b_] = [chroma, x, 0]; break;
    case 1:
      [r_, g_, b_] = [x, chroma, 0]; break;
    case 2:
      [r_, g_, b_] = [0, chroma, x]; break;
    case 3:
      [r_, g_, b_] = [0, x, chroma]; break;
    case 4:
      [r_, g_, b_] = [x, 0, chroma]; break;
    case 5:
      [r_, g_, b_] = [chroma, 0, x]; break;
  }
  // calculate necessary lightness adjustment
  const m = luminosity - (chroma / 2);
  return {
    r: _.toInteger((r_ + m) * 255),
    g: _.toInteger((g_ + m) * 255),
    b: _.toInteger((b_ + m) * 255),
  };
}

export function rgb2hsl({ r, g, b }) {
  if (!isRgbColor({ r, g, b }))
    throw 'rgb2hsl argument must be a valid RGB color object';
  // Normalize the color channel values to the range [0, 1]
  const r_ = r / 255;
  const g_ = g / 255;
  const b_ = b / 255;
  const cmax = Math.max(r_, g_, b_);
  const cmin = Math.min(r_, g_, b_);
  const delta = cmax - cmin;
  const lum = (cmax + cmin) / 2;
  let hue, sat;
  if (delta === 0) {
    hue = sat = 0;
  } else {
    switch (cmax) {
      case r_:
        hue = ((g_ - b_) / delta + 6) % 6; break;
      case g_:
        hue = ((b_ - r_) / delta + 2); break;
      case b_:
        hue = ((r_ - g_) / delta + 4); break;
    }
    hue *= 60;
    sat = delta / (1 - Math.abs(2 * lum - 1));
  }
  return {
    h: _.toInteger(hue),
    s: _.toInteger(sat * 100),
    l: _.toInteger(lum * 100),
  };
}

export function ensureHsl(color) {
  if (isHslColor(color)) {
    return _.pick(color, ['h', 's', 'l']);
  } else if (isRgbColor(color)) {
    return rgb2hsl(color);
  } else {
    throw `ensureHsl can only accept HSL or RGB color objects: ${JSON.stringify(color)}`;
  }
}

export function ensureRgb(color) {
  if (isRgbColor(color)) {
    return _.pick(color, ['r', 'g', 'b']);
  } else if (isHslColor(color)) {
    return hsl2rgb(color);
  } else {
    throw `ensureRgb can only accept RGB or HSL color objects: ${JSON.stringify(color)}`;
  }
}

// Given a startColor and endColor which are both HSL color objects or both RGB
// color objects, smoothly interpolates `steps` values between them following
// colorMode by interpolating each color channel individually. If start and end
// colors are in HSL, they will be interpolated along the HSL channels, but the
// output values will be converted to RGB objects for easier interface w/ Caman
export function makeColorMap(startColor, endColor, steps, colorMode) {
  if (isHslColor(startColor) && isHslColor(endColor)) {
    const hueRange = getValuesBetween(startColor.h, endColor.h, steps, colorMode);
    const satRange = getValuesBetween(startColor.s, endColor.s, steps, colorMode);
    const lumRange = getValuesBetween(startColor.l, endColor.l, steps, colorMode);
    return _.map(_.range(steps), (i) => hsl2rgb({
      h: Math.round(hueRange[i]),
      s: Math.round(satRange[i]),
      l: Math.round(lumRange[i]),
    }));
  } else if (isRgbColor(startColor) && isRgbColor(endColor)) {
    const rRange = getValuesBetween(startColor.r, endColor.r, steps, colorMode);
    const gRange = getValuesBetween(startColor.g, endColor.g, steps, colorMode);
    const bRange = getValuesBetween(startColor.b, endColor.b, steps, colorMode);
    return _.map(_.range(steps), (i) => ({
      r: Math.round(rRange[i]),
      g: Math.round(gRange[i]),
      b: Math.round(bRange[i]),
    }));
  } else {
    throw 'The first two arguments to makeColorMap must either both be RGB objects or both be HSL objects';
  }
}


// mandelbrotVelocity is essentially a special case of juliaSetVelocity, where
// at each point of the set we are locally rendering the Julia set for c AT each
// point c, whereas ordinarily a Julia set holds c constant.
// Both functions take a complex point c and determine how many iterations it
// takes to escape to infinity, treating it as within the Mandelbrot set if it
// reaches the `steps` limit of iterations
function mandelbrotVelocity(c, steps) {
  return juliaSetVelocity(c, c, steps);
}

// The julia set is INITIALIZED with z = x+yi but then is iterated with a different,
// *constant* c that is definitive of that julia set. For mandelbrot, we instead
// initialize at zero (or at x+yi again, not meaningfully different tbh) but then
// the c for any given pixel is ALSO x+yi.
function juliaSetVelocity(initial, c, steps) {
  if (initial.abs() > ESCAPE_THRESHOLD) {
    // I've decided I want the "0th" step to be the one that goes from z = 0,
    // which for mandelbrot rendering is the same as every other step, but for
    // the julia set is different from iteration steps, hence breaking it out.
    return [false, 0];
  }
  let z = initial;
  for (const i of _.range(1, steps)) {
    z = z.mul(z).add(c);
    if (z.abs() > ESCAPE_THRESHOLD) {
      return [false, i];
    }
  }
  return [true, steps];
}

export function camandel(mandelRange, colorMap, bgColor) {
  bgColor = ensureRgb(bgColor);
  // Get logical canvas dimensions
  const {width, height} = this.dimensions;
  // Destructure range boundaries
  const {xmin, xmax, ymin, ymax} = mandelRange;

  const realValues = getValuesBetween(xmin, xmax, width);
  const imagValues = getValuesBetween(ymin, ymax, height);
  const maxIter = colorMap.length;

  this.process('camandel', function (rgba) {
    // NOTE Caman origin is in lower-left corner
    const {x, y} = this.locationXY();

    // NOTE because of how Caman internally computes locationXY, the y domain
    // effectively changes from [0, 159] to [1, 160] -- and I don't enjoy that.
    // Hence subtracting 1 from the y value.
    const complexValue = new Complex(realValues[x], imagValues[y - 1]);
    const [inSet, velocity] = mandelbrotVelocity(complexValue, maxIter);

    if (inSet) {
      return Object.assign(rgba, bgColor);
    } else {
      const velocityColor = colorMap[velocity];
      return Object.assign(rgba, velocityColor);
    }
  });
}

export function juliaset(mandelRange, c, colorMap, bgColor) {
  bgColor = ensureRgb(bgColor);
  // Get logical canvas dimensions
  const { width, height } = this.dimensions;
  // Destructure range boundaries
  const { xmin, xmax, ymin, ymax } = mandelRange;

  const realValues = getValuesBetween(xmin, xmax, width);
  const imagValues = getValuesBetween(ymin, ymax, height);
  const maxIter = colorMap.length;

  this.process('juliaset', function (rgba) {
    // NOTE Caman origin is in lower-left corner
    const { x, y } = this.locationXY();

    // NOTE because of how Caman internally computes locationXY, the y domain
    // effectively changes from [0, 159] to [1, 160] and I don't enjoy that.
    // Hence subtracting 1 from the y value.
    const complexValue = new Complex(realValues[x], imagValues[y - 1]);
    const [inSet, velocity] = juliaSetVelocity(complexValue, c, maxIter);

    if (inSet) {
      return Object.assign(rgba, bgColor);
    } else {
      const velocityColor = colorMap[velocity];
      return Object.assign(rgba, velocityColor);
    }
  });
}

export function rangeToBounds(center, range) {
  const rangeStart = center - (range / 2);
  const rangeEnd = center + (range / 2);
  return [rangeStart, rangeEnd];
}

export function boundsToRange(min, max) {
  const center = (min + max) / 2;
  const range = max - min;
  return [center, range];
}
