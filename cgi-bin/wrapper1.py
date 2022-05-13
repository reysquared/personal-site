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

ciphertext = str(form.getvalue("input")) # Text to be deciphered

plaintext = caesar.decipher(ciphertext)

# Print stdout from student's python script
print "Content-type: text/plain"
print
print plaintext
