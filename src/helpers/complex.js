// There are quite good JavaScript implementations of complex arithmetic out
// there, but seemingly none that currently support arbitrary precision. This
// stems in large part from the additional considerations required for a general
// purpose mathematics library, turning the upgrade into quite an undertaking.
// But since I specifically want to use it for my Mandelbrot visualizer, I've
// created a very simplified implementation based on BigNumber that contains
// only and exactly the features I need. The only operation that loses precision
// is abs() and that's only used to check against the escape threshold, so the
// precision loss isn't compounded by successive iterations.
// TODO|kevin I may still need to optimize mandelStep some tho lol. we'll see.

import BigNumber from 'bignumber.js';

// TODO|kevin lessee here, maybe I should actually just make it a class of its own

export default class ComplexNumber {
  constructor(real, imaginary) {
    try {
      this.re = new BigNumber(real);
      this.im = new BigNumber(imaginary);
    } catch(e) {
      // TODO|kevin you gave me invalid inputs you numpty!!!!!!!
    }
  }

  abs() {
    // TODO|kevin
    return this.re.pow(2).plus(this.im.pow(2)).sqrt();
  }

  add(cplx) {
    return new ComplexNumber(
      this.re.plus(cplx.re),
      this.im.plus(cplx.im),
    );
    // TODO|kevin
  }

  times(cplx) {
    // (a + bi)(c + di) = ac + adi + bci - bd
    const realPart = this.re.times(cplx.re).minus(this.im.times(cplx.im));
    const imagPart = this.re.times(cplx.im).plus(this.im.times(cplx.re));
    return new ComplexNumber(realPart, imagPart);
  }

  squared() {
    return this.times(this);
  }

  mandelStep(cplx) {
    return this.squared().add(cplx);
  }
}