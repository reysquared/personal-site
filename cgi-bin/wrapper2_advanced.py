#!/usr/bin/env python
# -*- coding: UTF-8 -*-
import cgi
import sys
import subprocess
import os
import stat
import uuid #For filenames
from hw8pr1 import mandel #Student script!

MAX_FILESIZE = 1572864 # Maximum reasonable BG image size (tentatively 1.5 MiB)

# get form data
form = cgi.FieldStorage()

# Prints 400 error response headers
def errorResponse(message):
    print "Content-type: text/plain"
    print "Status: 400 Bad Request"
    print
    print message
    sys.exit(1)

# Parses a hex color triplet such as #EAAA00 as a color triplet like (234,170,0)
def hexToTuple(triplet):
    rVal = int(triplet[0:2], 16)
    gVal = int(triplet[2:4], 16)
    bVal = int(triplet[4:6], 16)
    if not (0 <= rVal <= 255 and 0 <= gVal <= 255 and 0 <= bVal <= 255):
        # Since we only parse two characters at a time, having a value greater than
        # 255 SHOULD be impossible, but negative values such as int("-F",16) => -15
        # are definitely a possibility.
        raise ValueError("Invalid color values")
    return rVal, gVal, bVal

# Make sure we can at least parse the input values as the types we expect
try:
    # Note: this syntax works because "try" blocks do not create a new scope.
    xmin = float(form.getvalue("xmin"))
    xmax = float(form.getvalue("xmax"))
    ymin = float(form.getvalue("ymin"))
    ymax = float(form.getvalue("ymax"))
    height = int(form.getvalue("height"))
    steps = int(form.getvalue("steps"))
    startColor = hexToTuple(form.getvalue("startColor")[1:]) # Remove leading # and convert
    endColor = hexToTuple(form.getvalue("endColor")[1:])
    bgColor = hexToTuple(form.getvalue("bgColor")[1:])
    quadMode = True if form.getvalue("quadMode") == "yes" else False
    bgImage = form["bgImg"] # Don't want to read the data yet, so we hold off on getvalue
except:
    errorResponse("Invalid input values")

# Once successfully parsed, sanity-check the input values
width = int(round(height/abs(ymax - ymin)*abs(xmax - xmin)));
if height > 1200 or width > 1800:
    errorResponse("Output image dimensions too large")
if height < 1 or width < 1:
    errorResponse("Output image dimensions too small")
if not 0 < steps <= 100:
    errorResponse("Invalid number of iterations")


# Create a unique name for temporarily saving the output image file
outName = str(uuid.uuid4()) + ".png"

# Generate the Mandelbrot image!
try:
    # If there is no filename field, then a file was not specified, so we use the bgColor
    if not bgImage.filename:
        mandel.msetColor(dim=(xmin, xmax, ymin, ymax), height=height, steps=steps, startColor=startColor, endColor=endColor, bgColor=bgColor, quadmode=quadMode, outFile = outName)
    else: # A background image was specified, so we check that it has a reasonable size
        imageSize = None
        if hasattr(bgImage.file, 'fileno'):
            imageSize = os.fstat(bgImage.file.fileno()).st_size
        else:
            # Apparently the cgi module uses cStringIO for files where available, which has no
            # fileno attribute, forcing us to fall back to potentially less-efficient methods
            # to check the filesize. Fortunately this *seems* to only happen for files < 1kiB.
            imageSize = len(bgImage.value)
        if imageSize > MAX_FILESIZE:
            errorResponse("Uploaded image too large")
        # And if that check succeeds then we pass the file to msetColor
        mandel.msetColor(dim=(xmin, xmax, ymin, ymax), height=height, steps=steps, startColor=startColor, endColor=endColor, bgColor=bgColor, inFile=bgImage.value, quadmode=quadMode, outFile = outName)
except:
    errorResponse("Unexpected error while generating image: " + str(sys.exc_info()))

# Return created image as successful response
print "Content-type: image/png"
print
print file(outName,"rb").read()

# And once the response has been sent, delete the file so it doesn't keep taking up space!
os.remove(outName)
