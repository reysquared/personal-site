#!/usr/bin/env python
# -*- coding: UTF-8 -*-
import cgi
import sys
import subprocess
import os
import stat
import uuid #For filenames
from hw8pr1 import mandel #Student script!

# get form data
form = cgi.FieldStorage()

# Prints 400 error response headers
def errorResponse(message):
    print "Content-type: text/plain"
    print "Status: 400 Bad Request"
    print
    print message
    sys.exit(1)

# Attempt to parse the input values
try:
    xmin = float(form.getvalue("xmin"))
    xmax = float(form.getvalue("xmax"))
    ymin = float(form.getvalue("ymin"))
    ymax = float(form.getvalue("ymax"))
    height = int(form.getvalue("height"))
    steps = int(form.getvalue("steps"))
except ValueError:
    errorResponse("Invalid input values")

# Do input validation
width = int(round(height/abs(ymax - ymin)*abs(xmax - xmin)));
if height > 1200 or width > 1800:
    errorResponse("Output image dimensions too large")
if height < 1 or width < 1:
    errorResponse("Output image dimensions too small")
if not 0 < steps <= 100:
    errorResponse("Invalid number of iterations")

# Create a unique name for the output image file
# (The UUID module facilitates creating Universally Unique IDentifiers to avoid name collision)
outName = str(uuid.uuid4()) + ".png"

# Now, actually generate the image with the provided input values
try:
    mandel.msetColor(dim=(xmin, xmax, ymin, ymax), height=height, steps=steps, outFile = outName)
except:
    errorResponse("Unexpected error while generating image: " + str(sys.exc_info()[0]))

# Return created image as successful response
print "Content-type: image/png"
print
print file(outName,"rb").read()

# And once the response has been sent, delete the file so it doesn't keep taking up space!
os.remove(outName)
