#!/usr/bin/env python
# -*- coding: UTF-8 -*-
import cgi
import sys
import subprocess
import os
import stat 
import caesar #Student script!

# get form data
form = cgi.FieldStorage()

# Attempt to parse input values (shouldn't be a concern for strings, but why not.)
try:
    operation = str(form.getvalue("func")) # Which function to perform (encode/decode)
    rot = int(form.getvalue("rot")) # Rotation value to use if enciphering
    input = str(form.getvalue("input")) # Text to be enciphered/deciphered
except:
    print "Content-type: text/plain"
    print "Status: 400 Bad Request"
    print
    print "Invalid input values"
    sys.exit(1)

output = None

if operation == "encipher":
    output = caesar.encipher(input, rot)
elif operation == "decipher":
    output = caesar.decipher(input)
else:
    # Error response.
    output = "Something went wrong! " + operation + " is not a valid operation :("

# Print stdout from student's python script
print "Content-type: text/plain"
print
print output
