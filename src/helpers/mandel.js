// import BigNumber from 'bignumber.js';
import Complex from 'complex.js';
import _ from 'lodash';

// TODO|kevin actually I guess this doesn't REALLY need to be defined as a BigNumber, .gt() takes ints
const ESCAPE_THRESHOLD = 2;
const DEFAULT_ITERATIONS = 25;  // TODO|kevin should I export this I wonder

// Shorthand linear interpolation function
const lerp = (a, b, n) => (1 - n) * a + n * b;
// Shorthand quadratic interpolation function
// TODO|kevin man idk if I'm actually gonna use this tbh lol
const qerp = (a, b, n) => lerp(a, b, n*n);

// TODO|kevin I COULD just give THIS a quadMode arg and based on that choose
// whether or not to square the input to lerp
const getValuesBetween = (start, end, numValues) => {
  return _.map(_.range(numValues), (val) => lerp(start, end, val/numValues));
}

// const lerpBig = (a, b, n) => BigNumber(1).minus(n).times(a).plus(b.times(n))

// // TODO|kevin start and end should both be BigNumber, numValues should be an int
// const getValuesBetweenBig = (start, end, numValues) => {
//   return _.map(_.range(numValues), (val) => lerpBig(start, end, BigNumber(val).div(numValues)));
// }

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

// TODO|kevin holy BALLS I could be getting SO MUCH MORE COMPLICATED THAN THIS!
// looked up "Orbit Traps" and akjhkjshakj omg yo
// ANOTHER COOL FEATURE IDEA: CLICK TO RENDER A JULIA SET!!!!! Could easily
// calculate click coordinates based on relative x,y position and current zoom coords,
// and then can calculate a ~ [-2, 2] julia set that's initialized at x+yi and
// iterates using the complex number at the click coordinate

/*
stepFactors = []
if quadMode:  #quadratic
    stepFactors = [(i*1.0/numSteps)**.5 for i in range(numSteps)]
else: #linear interpolation
    stepFactors = [(i*1.0/numSteps) for i in range(numSteps)]
*/

// TODO|kevin OKAY, so msetColor is definitely the PRIMARY interface for the old
// Python-based wrapper, which means I should be able to generate a satisfactory
// library just so long as I can implement the entirety of that function lololol

// TODO|kevin make docstrings for ALL these bastards!
/**
 * original python docstring:
    makeColorMap accepts
            startColor, a triple of RGB values from 0 to 255
            endColor, a similar triple
            numSteps, the number of color steps to interpolate (default NUMITER)
            quadMode, whether to use quadratic instead of linear interpolation
        makeColorMap returns a list of [numSteps] RGB triples interpolated between
            the start and end colors
 * @param {*} startColor 
 * @param {*} endColor 
 * @param {*} steps 
 * @param {*} quadMode 
 * @returns 
 */
export function makeColorMap(startColor, endColor, steps, quadMode) {
  if (isHslColor(startColor) && isHslColor(endColor)) {
    const hueRange = getValuesBetween(startColor.h, endColor.h, steps);
    const satRange = getValuesBetween(startColor.s, endColor.s, steps);
    const lumRange = getValuesBetween(startColor.l, endColor.l, steps);
    return _.map(_.range(steps), (i) => hsl2rgb({
      // TODO|kevin still kind of an open question for me as to whether I want
      // round or integer-truncate here.
      h: Math.round(hueRange[i]),
      s: Math.round(satRange[i]),
      l: Math.round(lumRange[i]),
    }));
    // TODO|kevin
  } else if (isRgbColor(startColor) && isRgbColor(endColor)) {
    const rRange = getValuesBetween(startColor.r, endColor.r, steps);
    const gRange = getValuesBetween(startColor.g, endColor.g, steps);
    const bRange = getValuesBetween(startColor.b, endColor.b, steps);
    return _.map(_.range(steps), (i) => ({
      r: _.toInteger(rRange[i]),
      g: _.toInteger(gRange[i]),
      b: _.toInteger(bRange[i]),
    }));
  } else {
    throw 'The first two arguments to makeColorMap must either both be RGB objects or both be HSL objects';
  }
}


function mandelbrotVelocity(c, steps) {
  // TODO|kevin oh my god I need so many more comments EEEVERYWHEERREEEREREERE
  // let z = new ComplexNumber(0, 0);
  let z = new Complex(0, 0);
  for (const i of _.range(steps)) {
    // z = z.mandelStep(c);
    z = z.mul(z).add(c);
    if (z.abs() > ESCAPE_THRESHOLD) {
      return [false, i];
    }
  }
  return [true, steps];
}

// TODO|kevin if I actually did this right (uhhhh I think maybe? lmao) then I
// should update mandelbrotVelocity to just use this but with an initial of (0,0)
// The julia set is INITIALIZED with z = x+yi but then is iterated with a different,
// *constant* c that is definitive of that julia set. For mandelbrot, we instead
// initialize at zero (or at x+yi again, not meaningfully different tbh) but then
// the c for any given pixel is ALSO x+yi.
// one thing that MIGHT make a difference, since we init the mandelbrot fxn with
// zero it means that a value for c > ESCAPE_THRESHOLD will get counted as escaping
// on the "0th" iteration, whereas juliaSetVelocity as written doesn't distinguish
// between coordinates that start already outside of the radius vs coordinates
// that start within the radius but go outside after a single iteration.
// TODO|kevin I COULD also fix this though, and it might not even be THAT hard...
function juliaSetVelocity(initial, c, steps) {
  let z = initial;
  for (const i of _.range(steps)) {
    // z = z.mandelStep(c);
    z = z.mul(z).add(c);
    if (z.abs() > ESCAPE_THRESHOLD) {
      return [false, i];
    }
  }
  return [true, steps];
}
/*
// TODO|kevin ONCE I fix above mentioned bug, then I think I can do this and
// have it be exactly equivalent to current behavior
const mandelbrotVelocity = (c, steps) => juliaSetVelocity(c, c, steps);
// BUT..... I should make sure it's actually working as-is before I make anything more complicated lmao
*/

// TODO|kevin need to pass SOME kind of dimensions here... I suppose I could just
// allow aspect ratio squishing in this function, and rely on things outside of
// the camandel filter to make sure canvas and plotted area both have the same aspect ratio
// TODO|kevin yknow, it's a little weird that I can create a colorMap using 
// hsl but bgColor has to be in rgb already lol. I should either change or validate that
export function camandel(mandelRange, colorMap, bgColor) {
  bgColor = ensureRgb(bgColor);  // TODO|kevin handle this more neatly,,,?
  // TODO|kevin I'm PRETTY SURE this works... we'll see lmfaoooo
  // I THINK it needs to happen outside of the process() call also, but not positive.
  const {width, height} = this.dimensions;
  // TODO|kevin expect mandelRange values to be BigNumber!!!!!
  const {xmin, xmax, ymin, ymax} = mandelRange;
  // TODO|kevin idk i don't think this is REALLY necessary but I had previously written this...
  // IDEA: To avoid re-constructing the real and imaginary parts
  // of the inputs, I could generate two arrays for the real/imaginary components
  // and iterate through both 
  console.error('TODO|kevin ok but im actually real curious what you think the dimensions are rn');
  console.error(`width ${width} height ${height}`);
  console.error(this);
  // const realValues = getValuesBetweenBig(xmin, xmax, width);
  // const imagValues = getValuesBetweenBig(ymin, ymax, height);
  const realValues = getValuesBetween(xmin, xmax, width);
  const imagValues = getValuesBetween(ymin, ymax, height);
  const maxIter = colorMap.length;

  // TODO|kevin okay as much as I do love it maybe I should at least REGISTER it
  // with a name more descriptive than "camandel" lmao
  this.process('camandel', function (rgba) {
    // TODO|kevin according to http://camanjs.com/docs/pixel.html this has the
    // origin in the lower left corner, like you'd expect from a normal coordinate plane.
    // WE SHALL SEE IF THAT IS TRUE.
    const {x, y} = this.locationXY();

    // NOTE because of how Caman internally computes locationXY, the y domain
    // effectively changes from [0, 159] to [1, 160] and I don't enjoy that.
    // Hence subtracting 1 from the y value.
    const complexValue = new Complex(realValues[x], imagValues[y - 1]);
    const [inSet, velocity] = mandelbrotVelocity(complexValue, maxIter);
    
    if (inSet) {
      // TODO|kevin yknow, I could potentially just assign this to be TRANSPARENT
      // instead, and have EVERYTHING bg-related handled independently for this
      // to ultimately be layered on top of. SOMETHING TO THINK ABOUT!
      return Object.assign(rgba, bgColor);
      /**
        # take pixel value from the background image provided. Use modulo
        # so that if the background image is smaller than our output image,
        # the background will just loop.
        bgPixel = bgImg[row%len(bgImg)][col%len(bgImg[0])]
       */
    } else {
      const velocityColor = colorMap[velocity];
      return Object.assign(rgba, velocityColor);
    }
  });
}
// Caman.Filter.register('camandel', camandel);

// TODO|kevin yknow I suppose I could also make this A SINGLE filter, where if
// you pass null for c to the outer function it does mandel behavior... hmmm.
export function juliaset(mandelRange, c, colorMap, bgColor) {
  bgColor = ensureRgb(bgColor);  // TODO|kevin handle this more neatly,,,?
  // TODO|kevin I'm PRETTY SURE this works... we'll see lmfaoooo
  // I THINK it needs to happen outside of the process() call also, but not positive.
  const { width, height } = this.dimensions;
  // TODO|kevin expect mandelRange values to be BigNumber!!!!!
  const { xmin, xmax, ymin, ymax } = mandelRange;
  // TODO|kevin idk i don't think this is REALLY necessary but...
  const realValues = getValuesBetweenBig(xmin, xmax, width);
  const imagValues = getValuesBetweenBig(ymin, ymax, height);
  const maxIter = colorMap.length;

  this.process('juliaset', function (rgba) {
    // TODO|kevin according to http://camanjs.com/docs/pixel.html this has the
    // origin in the lower left corner, like you'd expect from a normal coordinate plane.
    // WE SHALL SEE IF THAT IS TRUE.
    const { x, y } = this.locationXY();

    const complexValue = new ComplexNumber(realValues[x], imagValues[y]);
    const [inSet, velocity] = juliaSetVelocity(complexValue, c, maxIter);

    if (inSet) {
      // TODO|kevin yknow, I could potentially just assign this to be TRANSPARENT
      // instead, and have EVERYTHING bg-related handled independently for this
      // to ultimately be layered on top of. SOMETHING TO THINK ABOUT!
      return Object.assign(rgba, bgColor);
    } else {
      velocityColor = colorMap[velocity];
      return Object.assign(rgba, velocityColor);
    }
  });
}
