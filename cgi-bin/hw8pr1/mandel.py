# hw8pr1.py
# Lab 8
#

# keep this import line...
from cs5png import *

# start your Lab 8 functions here:

NUMITER = 25 # number of updates
XMIN = -2.0
XMAX =  1.0
YMIN = -1.0
YMAX =  1.0

def update(c, n):
    """ update starts with z=0 and runs z = z**2 + c
         for a total of n times. It returns the final z. 
    """
    z = 0
    for i in range(n):
        z = z**2 + c
    return z

def inMSet(c, n):
    """ inMSet accepts
            c for the update step of z = z**2+c
            n, the maximum number of times to run that step
        Then, it returns
            False as soon as abs(z) gets larger than 2
            True if abs(z) never gets larger than 2 (for n iterations)
    """
    z = 0
    for i in range(n):
        z = z**2 + c
        if abs(z) > 2: return False
    return True

def inMSetVelocity(c, n):
    """ inMSet accepts
            c for the update step of z = z**2+c
            n, the maximum number of times to run that step
        Then, it returns
            The number of iterations so far as soon as abs(z) gets larger than 2
            True if abs(z) never gets larger than 2 (for n iterations)
    """
    z = 0
    for i in range(n):
        z = z**2 + c
        if abs(z) > 2: return (False, i)
    return (True, n)

def scale(pix, pixMax, floatMin, floatMax):
    """ scale accepts
            pix, the CURRENT pixel column (or row)
            pixMax, the total # of pixel columns
            floatMin, the min floating-point value
            floatMax, the max floating-point value
        scale returns the floating-point value that
            corresponds to pix
    """
    if pix > pixMax:
        print "PIX TOO BIG :((( (" + pix + " > " + pixMax + ")"
    return 1.0*pix/pixMax*(floatMax-floatMin) + floatMin

def mset():
    """ creates a 300x200 image of the Mandelbrot set
    """
    width = 300
    height = 200
    image = PNGImage(width, height)

    # create a loop in order to draw some pixels
    
    for col in range(width):
        for row in range(height):
            # here is where you will need
            # to create the complex number, c!
            # Use scale twice:
            #   once to create the real part of c (x)
            #   once to create the imag. part of c (y)
            # THEN, test if it's in the M. Set:
            xcoord = scale(col, width, XMIN, XMAX)
            ycoord = scale(row, height, YMIN, YMAX)
            c = xcoord + ycoord*1j
            if inMSet(c, NUMITER):
                image.plotPoint(col, row, (0,0,120)) #mset color
            else:
                image.plotPoint(col, row, (255,255,255)) #bg color--not necessary if white


    # we looped through every image pixel; we now write the file
    image.saveFile()

def msetColor(dim=(XMIN, XMAX, YMIN, YMAX), height = 200, quadmode = False, startColor=(255,255,255), endColor=(255,255,255), inFile=None, bgColor=(0,0,0), steps=NUMITER, outFile="outColor.png"):
    """ creates a 300x200 image of the Mandelbrot set
    """
    # NOTE: sanity-checking of input should be handled by the WRAPPER, not by this fxn!
    # or more realistically they should be handled by the client-side code even before
    # that, but having redundant server-side validation is probably a good idea.
    # this includes: making sure the height isn't absurdly large, 
    # making sure the dimensions aren't absurdly tall & skinny or short & wide,
    #    (or more accurately, making sure the computed width won't be absurdly large)
    # making sure the number of iterations isn't too large,
    # making sure all relevant numbers are ints and not floats,
    # correctly converting RGB input info into Python triples of range 0-255,
    # and, once image uploading is enabled, checking that uploaded images are valid PNGs 
    # of a reasonable size (TBD)
    # also, outfile should definitely be chosen by the wrapper, not the client...
    xMin, xMax, yMin, yMax = dim
    width = int(round(height/abs(yMax - yMin)*abs(xMax - xMin))) #ensure 1:1 x/y scaling
    image = PNGImage(width, height)
    colorMap = makeColorMap(startColor, endColor, steps, quadmode)
    bgImg = None
    if inFile is not None:
        # since this version of the script is for the web server, we're going to assume
        # that anything passed to inFile is going to be a byte array, not a string.
        bgImg = getRGB(filebytes=inFile)
        bgImg = bgImg[::-1] # rows reversed for Mandelbrot coords

    # create a loop in order to draw some pixels
    for col in range(width):
        for row in range(height):
            # here is where you will need
            # to create the complex number, c!
            # Use scale twice:
            #   once to create the real part of c (x)
            #   once to create the imag. part of c (y)
            # THEN, test if it's in the M. Set:
            xcoord = scale(col, width, xMin, xMax)
            ycoord = scale(row, height, yMin, yMax)
            c = xcoord + ycoord*1j
            pointVal = inMSetVelocity(c, steps)
            if pointVal[0] == True:
                if bgImg is None:
                    image.plotPoint(col, row, bgColor)
                else:
                    # take pixel value from the background image provided. Use modulo
                    # so that if the background image is smaller than our output image,
                    # the background will just loop.
                    bgPixel = bgImg[row%len(bgImg)][col%len(bgImg[0])]
                    image.plotPoint(col, row, bgPixel)
            else:
                image.plotPoint(col, row, colorMap[pointVal[1]])

    # we looped through every image pixel; we now write the file
    image.saveFile(outFile)

def makeColorMap(startColor, endColor, numSteps=NUMITER, quadMode=False):
    """ makeColorMap accepts
            startColor, a triple of RGB values from 0 to 255
            endColor, a similar triple
            numSteps, the number of color steps to interpolate (default NUMITER)
            quadMode, whether to use quadratic instead of linear interpolation
        makeColorMap returns a list of [numSteps] RGB triples interpolated between
            the start and end colors
    """
    stepFactors = []
    if quadMode:  #quadratic
        stepFactors = [(i*1.0/numSteps)**.5 for i in range(numSteps)]
    else: #linear interpolation
        stepFactors = [(i*1.0/numSteps) for i in range(numSteps)]

    rStart, gStart, bStart = startColor
    rEnd,   gEnd,   bEnd   = endColor

    rRange = rEnd - rStart
    gRange = gEnd - gStart
    bRange = bEnd - bStart

    colorMap = []

    for i in range(numSteps):
        # make absolutely sure that all values are correctly-rounded ints between 0 and 255
        rPoint = min( max( 0, int(round(rStart + stepFactors[i]*rRange)) ), 255 )
        gPoint = min( max( 0, int(round(gStart + stepFactors[i]*gRange)) ), 255 )
        bPoint = min( max( 0, int(round(bStart + stepFactors[i]*bRange)) ), 255 )
        colorMap.append((rPoint, gPoint, bPoint))

    return colorMap
